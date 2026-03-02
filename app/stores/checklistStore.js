import {
  getNextResetDate,
  getSnoozeWakeDate,
} from "@/composables/useChecklistTimer";
import * as dbChecklist from "@/data/database/dbChecklist";
import globalChecklistTasks from "@/data/globalChecklistTasks";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

export const useChecklistStore = defineStore("checklist", () => {
  const storage = useStorage("checklist", {});
  const checklist = ref({});

  function init() {
    // Load from storage
    checklist.value = storage.value || {};

    const globalIds = globalChecklistTasks.map((t) => String(t.id));

    // Remove unlisted globals
    Object.keys(checklist.value).forEach((id) => {
      if (checklist.value[id].isGlobal && !globalIds.includes(String(id))) {
        delete checklist.value[id];
      }
    });

    // Sync current globals
    for (const globalTask of globalChecklistTasks) {
      const id = String(globalTask.id);
      const existing = checklist.value[id];

      checklist.value[id] = existing
        ? { ...globalTask, ...existing, isGlobal: true }
        : { ...dbChecklist.checklistItem, ...globalTask, isGlobal: true };
    }
  }

  // Persist changes to storage whenever checklist changes
  watch(
    checklist,
    (newVal) => {
      storage.value = newVal;
    },
    { deep: true },
  );

  function patchItem(id, patches) {
    if (!checklist.value[id]) return;

    // Snooze cannot exceed cycle reset
    if (patches.snoozeUntil) {
      const resetDate = getNextResetDate(checklist.value[id]);
      if (resetDate && new Date(patches.snoozeUntil) > resetDate) {
        patches.snoozeUntil = resetDate.toISOString();
      }
    }

    checklist.value[id] = {
      ...checklist.value[id],
      ...patches,
      updated_at: new Date().toISOString(),
    };
  }

  function resetCycles() {
    const now = new Date();
    Object.values(checklist.value).forEach((item) => {
      // Handle snooze wake up
      const snoozeDate = getSnoozeWakeDate(item);
      if (item.isSnoozed && snoozeDate && now >= snoozeDate) {
        patchItem(item.id, {
          isSnoozed: false,
          snoozeUntil: null,
          checked: false, // Move back to active
        });
      }

      // Handle recurring reset
      if (item.checked && !item.isSnoozed && item.recurrence !== "none") {
        const resetDate = getNextResetDate(item);

        if (resetDate && now >= resetDate) {
          patchItem(item.id, {
            checked: false,
            completionDate: null,
          });
        }
      }
    });
  }

  function checkItem(id) {
    patchItem(id, {
      checked: true,
      completionDate: new Date().toISOString(),
      isSnoozed: false,
      snoozeUntil: null,
    });
  }

  function uncheckItem(id) {
    patchItem(id, {
      checked: false,
      completionDate: null,
      isSnoozed: false,
      snoozeUntil: null,
    });
  }

  function upsert(item) {
    const id = item.id || `user-${crypto.randomUUID()}`;
    const now = new Date().toISOString();
    checklist.value[id] = {
      ...(checklist.value[id] || dbChecklist.checklistItem),
      ...item,
      id,
      updated_at: now,
      created_at: checklist.value[id]?.created_at || now,
    };
  }

  return {
    checklist,
    incompletedTasks: computed(() =>
      Object.values(checklist.value)
        .filter((t) => !t.checked)
        .sort((a, b) => a.title.localeCompare(b.title)),
    ),
    completedTasks: computed(() =>
      Object.values(checklist.value).filter((t) => t.checked),
    ),
    init,
    patchItem,
    upsert,
    resetCycles,
    checkItem,
    uncheckItem,
  };
});
