<template>
  <div
    class="flex flex-row items-center rounded-lg border px-4 py-3 mb-2 transition-all duration-200 group"
    :class="[
      item.isSnoozed
        ? 'border-blue-500/30 bg-blue-500/5'
        : item.checked
          ? 'border-emerald-500/30 bg-emerald-500/5 opacity-70'
          : isRed
            ? 'border-red-500/40 bg-red-500/5'
            : 'border-gray-800 bg-gray-900/50 hover:bg-gray-800/50 hover:border-gray-700',
    ]"
  >
    <div
      class="mr-4 text-xl select-none transition-transform"
      :class="[
        isFutureEvent
          ? 'opacity-30'
          : 'cursor-pointer hover:scale-110 active:scale-90',
      ]"
      @click="toggleStatus"
    >
      <span v-if="item.isSnoozed">💤</span>
      <span v-else-if="item.checked" class="filter grayscale opacity-70"
        >↩️</span
      >
      <span v-else>✔️</span>
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 flex-wrap">
        <span
          class="text-sm font-bold leading-none transition-colors"
          :class="item.checked ? 'text-gray-500 line-through' : 'text-gray-100'"
        >
          {{ item.title }}
        </span>
        <span
          v-if="item.description"
          class="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border-emerald-500/20 leading-none uppercase tracking-tight"
          :class="{ 'opacity-40 grayscale': item.checked }"
        >
          {{ item.description }}
        </span>
      </div>
    </div>

    <div class="flex items-center gap-2 ml-4">
      <UButton
        icon="i-heroicons-clock"
        color="neutral"
        variant="ghost"
        size="xs"
        class="opacity-0 group-hover:opacity-100 transition-opacity"
        @click.stop="$emit('open-snooze', item)"
      />

      <UButton
        v-if="!item.isGlobal"
        icon="i-heroicons-pencil-square"
        color="neutral"
        variant="ghost"
        size="xs"
        class="opacity-0 group-hover:opacity-100 transition-opacity"
        @click.stop="$emit('open-edit', item)"
      />

      <div class="flex flex-col items-end min-w-[120px]">
        <span
          class="text-[11px] px-2 py-0.5 rounded font-bold tabular-nums tracking-tight border whitespace-nowrap"
          :class="[
            item.isSnoozed
              ? 'bg-blue-500/15 text-blue-400 border-blue-500/20'
              : isRed
                ? 'bg-red-500/15 text-red-400 border-red-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            item.checked &&
              !item.isSnoozed &&
              'opacity-40 grayscale border-transparent',
          ]"
        >
          {{ countdownLabel }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useReactiveCountdownLabel } from "@/composables/useChecklistTimer";
import { computed } from "vue";

const props = defineProps({
  item: { type: Object, required: true },
});

const emit = defineEmits([
  "mark-complete",
  "mark-incomplete",
  "open-edit",
  "open-snooze",
]);

const isFutureEvent = computed(() => {
  return new Date(props.item.originalDate) > new Date();
});

// This reactive label updates every 10 seconds
const countdownLabel = useReactiveCountdownLabel(computed(() => props.item));

const isRed = computed(() => {
  if (props.item.checked || props.item.isSnoozed) return false;
  return countdownLabel.value === "Overdue";
});

const toggleStatus = () => {
  if (isFutureEvent.value) return;

  if (props.item.checked || props.item.isSnoozed) {
    emit("mark-incomplete", props.item);
  } else {
    emit("mark-complete", props.item);
  }
};
</script>
