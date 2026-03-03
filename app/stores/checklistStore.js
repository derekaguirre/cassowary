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
  const globalIds = new Set(globalChecklistTasks.map((t) => String(t.id)));

  function init() {
    if (localStorage.getItem("notes")) {
      localStorage.removeItem("notes");
    }
    // Load from storage
    const stored = storage.value || {};

    const newChecklist = { ...stored };

    // Remove unlisted globals
    Object.keys(newChecklist).forEach((id) => {
      if (newChecklist[id].isGlobal && !globalIds.has(id)) {
        delete newChecklist[id];
      }
    });

    // Merge or add global tasks
    for (const globalTask of globalChecklistTasks) {
      const id = String(globalTask.id);
      newChecklist[id] = newChecklist[id]
        ? { ...globalTask, ...newChecklist[id], isGlobal: true } // If exists merge
        : { ...dbChecklist.checklistItem, ...globalTask, isGlobal: true }; // Otherwise create new
    }

    checklist.value = newChecklist;
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
    const strId = String(id);
    const item = checklist.value[strId];
    if (!item) return;

    // Snooze cannot exceed cycle reset
    if (patches.snoozeUntil) {
      const resetDate = getNextResetDate(item, new Date(item.completionDate));
      if (resetDate && new Date(patches.snoozeUntil) > resetDate) {
        patches.snoozeUntil = resetDate.toISOString();
      }
    }

    Object.assign(item, patches, { updated_at: new Date().toISOString() });
  }

  function resetCycles() {
    const now = new Date();

    Object.values(checklist.value).forEach((item) => {
      // Snooze wake‑up
      const snoozeDate = getSnoozeWakeDate(item);
      if (item.isSnoozed && snoozeDate && now >= snoozeDate) {
        item.isSnoozed = false;
        item.snoozeUntil = null;
        item.checked = false; // move back to active
        item.updated_at = now.toISOString();
      }

      // Recurring reset (only if not snoozed)
      if (!item.isSnoozed && item.checked && item.recurrence !== "none") {
        const baseDate = new Date(item.completionDate || item.originalDate);
        const resetDate = getNextResetDate(item, baseDate);
        if (resetDate && now >= resetDate) {
          item.checked = false;
          item.completionDate = null;
          item.updated_at = now.toISOString();
        }
      }
    });
  }

  function upsert(item) {
    const id = item.id || `user-${crypto.randomUUID()}`;
    const now = new Date().toISOString();
    const existing = checklist.value[id];

    const newItem = {
      ...dbChecklist.checklistItem,
      ...existing,
      ...item,
      id,
      updated_at: now,
      created_at: existing?.created_at || now,
    };
    checklist.value[id] = newItem;
  }

  const incompletedTasks = computed(() =>
    Object.values(checklist.value)
      .filter((t) => !t.checked)
      .sort((a, b) => a.title.localeCompare(b.title)),
  );

  const completedTasks = computed(() =>
    Object.values(checklist.value).filter((t) => t.checked),
  );

  return {
    checklist,
    incompletedTasks,
    completedTasks,
    init,
    patchItem,
    upsert,
    resetCycles,
    checkItem: (id) =>
      patchItem(id, {
        checked: true,
        completionDate: new Date().toISOString(),
      }),
    uncheckItem: (id) =>
      patchItem(id, { checked: false, completionDate: null }),
  };
});
