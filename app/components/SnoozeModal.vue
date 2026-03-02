<template>
  <UModal :open="modelValue" @update:open="$emit('update:modelValue', $event)">
    <template #content>
      <div class="flex flex-col gap-3 p-6">
        <h3 class="text-lg font-bold">Snooze Task</h3>
        <p class="text-sm text-gray-400">
          This will hide the task temporarily. Automatically reappears in the
          active list after:
        </p>

        <div class="grid grid-cols-3 gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-bold text-gray-500 uppercase"
              >Days</label
            >
            <UInput v-model.number="snoozeTime.days" type="number" min="0" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-bold text-gray-500 uppercase"
              >Hours</label
            >
            <UInput v-model.number="snoozeTime.hours" type="number" min="0" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-bold text-gray-500 uppercase"
              >Mins</label
            >
            <UInput v-model.number="snoozeTime.minutes" type="number" min="0" />
          </div>
        </div>

        <UButton
          color="primary"
          block
          @click="confirm"
          :disabled="totalMs === 0"
        >
          Snooze & Hide for {{ summaryText }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({ modelValue: Boolean });
const emit = defineEmits(["update:modelValue", "confirm"]);

const snoozeTime = ref({ days: 0, hours: 0, minutes: 0 });

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) snoozeTime.value = { days: 0, hours: 0, minutes: 0 };
  },
);

const totalMs = computed(() => {
  return (
    snoozeTime.value.days * 86400000 +
    snoozeTime.value.hours * 3600000 +
    snoozeTime.value.minutes * 60000
  );
});

const summaryText = computed(() => {
  if (totalMs.value === 0) return "0m";
  const parts = [];
  if (snoozeTime.value.days > 0) parts.push(`${snoozeTime.value.days}d`);
  if (snoozeTime.value.hours > 0) parts.push(`${snoozeTime.value.hours}h`);
  if (snoozeTime.value.minutes > 0) parts.push(`${snoozeTime.value.minutes}m`);
  return parts.join(" ");
});

const confirm = () => {
  if (totalMs.value === 0) return;
  const now = new Date();
  const newTime = new Date(now.getTime() + totalMs.value);
  emit("confirm", newTime.toISOString());
  emit("update:modelValue", false);
};
</script>
