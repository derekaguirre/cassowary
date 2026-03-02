<template>
  <UModal :open="modelValue" @update:open="handleUpdateOpen">
    <template #content>
      <div class="flex flex-col gap-1 p-4 overflow-y-auto max-h-[90vh]">
        <span class="font-bold text-xl mb-2"
          >{{ editItem ? "Edit" : "Create New" }} Task</span
        >

        <span>Title</span>
        <UInput v-model="localItem.title" placeholder="Task title" />

        <span>Description</span>
        <UTextarea
          v-model="localItem.description"
          placeholder="Optional details..."
        />

        <UDivider class="my-2" />

        <span>Recurrence</span>
        <select
          v-model="localItem.recurrence"
          class="border rounded p-1 bg-transparent dark:bg-gray-900"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Custom (days)</option>
        </select>

        <div
          v-if="localItem.recurrence !== 'none'"
          class="flex flex-col gap-2 mt-2"
        >
          <span>Starting Day</span>
          <UInput v-model="localItem.startingDay" type="date" />

          <div v-if="localItem.recurrence === 'custom'">
            <span>Custom Cycle (Days)</span>
            <UInput
              v-model.number="localItem.recurrenceDays"
              type="number"
              min="1"
            />
          </div>

          <span>Resets At</span>
          <select
            v-model="localItem.recurrenceMode"
            class="border rounded p-1 bg-transparent dark:bg-gray-900"
          >
            <option value="from-completion">Completion Day</option>
            <option value="from-original">Starting Day</option>
          </select>
        </div>

        <div class="flex gap-2 mt-4">
          <UButton
            class="flex-1 justify-center"
            color="primary"
            @click="handleSubmit"
            >Save</UButton
          >
          <UButton
            class="flex-1 justify-center"
            color="gray"
            variant="outline"
            @click="handleUpdateOpen(false)"
            >Cancel</UButton
          >
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup>
import { useChecklistStore } from "@/stores/checklistStore";
import { computed, ref, watch } from "vue";

const props = defineProps({ modelValue: Boolean, editItem: Object });
const emit = defineEmits(["update:modelValue", "create", "update"]);
const store = useChecklistStore();

const getDefaultItem = () => ({
  title: "",
  description: "",
  recurrence: "daily", // Default to daily for users
  recurrenceDays: 1,
  recurrenceMode: "from-original",
  startingDay: new Date().toISOString().slice(0, 10),
  isGlobal: false,
  anchorHour: 9,
});

const localItem = ref(getDefaultItem());
const handleUpdateOpen = (val) => emit("update:modelValue", val);

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      localItem.value = props.editItem
        ? {
            ...JSON.parse(JSON.stringify(props.editItem)),
            startingDay: (
              props.editItem.startingDay || new Date().toISOString()
            ).slice(0, 10),
          }
        : getDefaultItem();
    }
  },
);

const handleSubmit = () => {
  const payload = { ...localItem.value };
  const todayStr = new Date().toISOString().slice(0, 10);

  const d = new Date(payload.startingDay + "T00:00:00");
  d.setHours(payload.anchorHour || 9, 0, 0, 0);
  payload.originalDate = d.toISOString();

  // If start day is future, auto-snooze
  if (payload.startingDay > todayStr) {
    payload.checked = true;
    payload.isSnoozed = true;
    payload.snoozeUntil = payload.originalDate;
  } else {
    payload.checked = false;
    payload.isSnoozed = false;
  }

  emit(props.editItem ? "update" : "create", payload);
  handleUpdateOpen(false);
};
</script>
