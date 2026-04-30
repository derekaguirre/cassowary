import {
  getNextResetDate,
  getSnoozeWakeDate,
} from "@/composables/useChecklistTimer";
import * as dbChecklist from "@/data/database/dbChecklist";
import {
  getGlobalTasks,
  GLOBAL_DATA_VERSION,
} from "@/data/globalChecklistTasks";
import { useSettingsStore } from "@/stores/settingsStore";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

export const useChecklistStore = defineStore("checklist", () => {
  const storage = useStorage("checklist", {});
  const checklist = ref({});
  const settings = useSettingsStore();
  const lastSeenVersion = useStorage("checklist_version", "0.0.0");
  const needsUpdate = ref(false);

  function checkVersion() {
    if (GLOBAL_DATA_VERSION !== lastSeenVersion.value) {
      needsUpdate.value = true;
      return true;
    }
    return false;
  }

  function confirmUpdate() {
    lastSeenVersion.value = GLOBAL_DATA_VERSION;
    storage.value = checklist.value;
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  function init() {
    const globalTasks = getGlobalTasks();
    const globalIds = new Set(globalTasks.map((t) => String(t.id)));
    const stored = storage.value || {};
    const newChecklist = { ...stored };

    // 1. Remove old globals that no longer exist in the code
    Object.keys(newChecklist).forEach((id) => {
      if (newChecklist[id].isGlobal && !globalIds.has(id)) {
        delete newChecklist[id];
      }
    });

    // 2. Smart Merge global tasks
    for (const globalTask of globalTasks) {
      const id = String(globalTask.id);
      const existing = stored[id];

      if (!existing) {
        // New task entirely
        newChecklist[id] = {
          ...dbChecklist.checklistItem,
          ...globalTask,
          isGlobal: true,
        };
      } else {
        // SMART UPDATE LOGIC:
        // Check if Title or Dates changed in the code vs storage
        const titleChanged = existing.title !== globalTask.title;
        const timesChanged =
          existing.originalDate !== globalTask.originalDate ||
          existing.deadline !== globalTask.deadline;

        newChecklist[id] = {
          ...existing, // Keep user progress (checked, snooze status)
          ...globalTask, // Override with new data from code (title, dates, recurType)
          isGlobal: true,
        };

        // If title changed, reactivate the task (reset completion)
        if (titleChanged) {
          newChecklist[id].checked = false;
          newChecklist[id].completionDate = null;
          newChecklist[id].isSnoozed = false;
          newChecklist[id].snoozeUntil = null;
        }
      }
    }

    checklist.value = newChecklist;
    resetCycles();
  }

  // Watch for server changes to recalculate times
  watch(
    () => settings.selectedServer,
    () => {
      init();
    },
  );

  function getSortTime(item) {
    if (item.isSnoozed && item.snoozeUntil)
      return new Date(item.snoozeUntil).getTime();
    const resetDate = getNextResetDate(item);
    if (resetDate) return resetDate.getTime();
    if (item.deadline) return new Date(item.deadline).getTime();
    return Infinity;
  }

  function resetCycles() {
    const now = new Date();
    Object.values(checklist.value).forEach((item) => {
      const startDate = new Date(item.originalDate);
      if (startDate > now) {
        item.isSnoozed = true;
        item.snoozeUntil = item.originalDate;
        item.checked = false;
        return;
      }
      const snoozeDate = getSnoozeWakeDate(item);
      if (item.isSnoozed && snoozeDate && now >= snoozeDate) {
        item.isSnoozed = false;
        item.snoozeUntil = null;
        item.checked = false;
      }
      if (!item.isSnoozed && item.checked) {
        const baseDate = new Date(item.completionDate || item.originalDate);
        const resetDate = getNextResetDate(item, baseDate);
        if (resetDate && now >= resetDate) {
          item.checked = false;
          item.completionDate = null;
        }
      }
    });
  }

  const incompletedTasks = computed(() =>
    Object.values(checklist.value)
      .filter((t) => !t.checked && !t.isSnoozed)
      .sort((a, b) => getSortTime(a) - getSortTime(b)),
  );

  const completedTasks = computed(() =>
    Object.values(checklist.value)
      .filter((t) => t.checked || t.isSnoozed)
      .sort((a, b) => getSortTime(a) - getSortTime(b)),
  );

  // watch(
  //   checklist,
  //   (newVal) => {
  //     storage.value = newVal;
  //   },
  //   { deep: true },
  // );

  return {
    checklist,
    incompletedTasks,
    completedTasks,
    needsUpdate,
    checkVersion,
    confirmUpdate,
    init,
    resetCycles,
    updateItem: (id, updates) => {
      if (checklist.value[id]) {
        Object.assign(checklist.value[id], updates);
      }
    },
    checkItem: (id) =>
      Object.assign(checklist.value[id], {
        checked: true,
        completionDate: new Date().toISOString(),
      }),
    uncheckItem: (id) =>
      Object.assign(checklist.value[id], {
        checked: false,
        completionDate: null,
        isSnoozed: false,
        snoozeUntil: null,
      }),
  };
});
