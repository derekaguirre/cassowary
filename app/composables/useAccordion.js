import { useAccordionStore } from "@/stores/accordionStore";
import { useSortable } from "@vueuse/integrations/useSortable";

/*
@function useAccordion
@desc the goal is passing groupKey and data then accordion can just work
@desc dont resolveComponent here

@param templateRef for useSortable
@param accordionGroupKey for key of data
@param accordionItems - The list of possible accordion sections
@param accordionActives - The list of currently expanded sections

@return accordionItems
@return accordionActives
*/
export function useAccordion(
  templateRef,
  accordionGroupKey,
  accordionItems,
  accordionActives,
) {
  // enable reordering the UI
  useSortable(useTemplateRef(templateRef), accordionItems, {
    animation: 150,
  });

  onBeforeMount(() => {
    // get data from storage
    const store = useAccordionStore();
    store.init();

    // get data based on groupKey
    let accordionGroupData = store.getGroup(accordionGroupKey);

    // Handle first time visit
    if (!accordionGroupData) {
      // Snapshot the current component defaults and save to the store
      const initialStoreData = {};
      accordionItems.value.forEach((item, index) => {
        initialStoreData[item.slot] = {
          index_position: index,
          open: accordionActives.value.includes(item.slot),
        };
      });
      store.upsertWholeGroup(accordionGroupKey, initialStoreData);
      return;
    }

    let reoderedAccordionItems = [];
    accordionActives.value = [];

    // Loop through storage to restore order and active states
    Object.entries(accordionGroupData).forEach(([key, value]) => {
      const foundItem = accordionItems.value.find((item) => item.slot === key);

      if (foundItem) {
        // Reorder the item to its saved position
        reoderedAccordionItems[value.index_position] = foundItem;

        // Restore whether this section was open or closed
        if (value.open) {
          accordionActives.value.push(key);
        }
      }
    });

    // add items that are not stored but in the code
    accordionItems.value.forEach((item) => {
      const isStored = accordionGroupData[item.slot];
      if (!isStored) {
        reoderedAccordionItems.push(item);
      }
    });

    // Remove any undefined holes in the array and update the UI ref
    accordionItems.value = reoderedAccordionItems.filter(Boolean);
  });

  // Save changes whenever user reorders or toggles an accordion
  // watcher for accordionActives
  // watcher accordionItems sorting position
  // store data when it changes
  watch(
    [accordionItems, accordionActives],
    ([newAccordionItems, newAccordionActives]) => {
      //prepare data for store
      const dataToStore = {};
      newAccordionItems.forEach((item, index) => {
        dataToStore[item.slot] = {
          index_position: index,
          open: newAccordionActives.includes(item.slot),
        };
      });
      // store data
      useAccordionStore().upsertWholeGroup(accordionGroupKey, dataToStore);
    },
    { deep: true },
  );

  // return what sorted accordion should be with each open/active status
  return { accordionItems, accordionActives };
}
