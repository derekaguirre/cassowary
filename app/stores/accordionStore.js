import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAccordionStore = defineStore("accordions", () => {
  // Define the reactive localStorage connection
  const storage = useStorage("accordions", {});
  const accordions = ref({});

  function init() {
    // Sync local ref with the actual localStorage data
    accordions.value = storage.value || {};

    // Handle the old notes field if it exists in storage
    if (accordions.value.index_page) {
      if (accordions.value.index_page.notes) {
        // Transfer notes state to checklist if checklist doesn't have a state yet
        if (!accordions.value.index_page.checklist) {
          accordions.value.index_page.checklist = {
            ...accordions.value.index_page.notes,
          };
        }
        delete accordions.value.index_page.notes;

        // Save the migration
        storage.value = accordions.value;
      }
    }
  }

  function getGroup(group_key) {
    return accordions.value[group_key];
  }

  function upsertWholeGroup(groupKey, accordionData) {
    accordions.value[groupKey] = accordionData;
    storage.value = accordions.value;
  }

  return {
    accordions,
    init,
    getGroup,
    upsertWholeGroup,
  };
});
