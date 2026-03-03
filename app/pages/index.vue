<template>
  <UAccordion
    :ref="templateRef"
    type="multiple"
    :items="accordionItems"
    v-model="accordionActives"
  >
    <template v-for="(value, key) in accordionTemplates" #[key]="{ item }">
      <component :is="value.component" />
    </template>
  </UAccordion>
</template>

<script setup>
/*
accordionTemplates
set key and resolveComponent for each item for accordion
this is only needed for this page, not every accordion
case by case

 in the future maybe move label to i18n

IMPORTANT: resolveComponent needs to happen on vue files,
 should not on composables
*/
const accordionTemplates = {
  welcome: {
    component: resolveComponent("HomeWelcome"),
    label: "Welcome To Cassowary!",
  },
  checklist: {
    component: resolveComponent("Checklist"),
    label: "Events Checklist",
  },
  stamina: {
    component: resolveComponent("Stamina"),
    label: "Stamina Tracker",
  },
  planned_items: {
    component: resolveComponent("PlannedItems"),
    label: "Planned Characters & Weapons",
  },
  needed_materials: {
    component: resolveComponent("AllNeededMaterials"),
    label: "Needed Materials",
  },
};

const accordionDefaultOrder = Object.keys(accordionTemplates);
// init variables
const accordionGroupKey = "index_page";
const templateRef = "homeAccordion";

// Initialize reactive state with defaults
const accordionItems = ref(
  // init default values
  // accordionItems tell accordion what the content would be
  accordionDefaultOrder.map((item) => ({
    label: accordionTemplates[item].label,
    slot: item,
    value: item,
    ui: { label: "font-extrabold text-4xl" },
  })),
);

// Open first two by default
const accordionActives = ref(accordionDefaultOrder.slice(0, 3));

// Pass refs directly; the composable handles the synchronization
useAccordion(templateRef, accordionGroupKey, accordionItems, accordionActives);
</script>
