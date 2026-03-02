<template>
  <div class="mx-auto p-4 space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Checklist</h1>
      <UButton icon="i-heroicons-plus" @click="openAdd">New Task</UButton>
    </div>

    <div class="space-y-2">
      <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">
        Active — {{ incompletedTasks.length }}
      </h2>
      <div
        v-if="incompletedTasks.length === 0"
        class="text-gray-600 italic py-4 text-center"
      >
        No active tasks.
      </div>
      <TaskItem
        v-for="task in incompletedTasks"
        :key="task.id"
        :item="task"
        @mark-complete="(item) => store.checkItem(item.id)"
        @open-edit="openEdit"
        @open-snooze="openSnooze"
      />
    </div>

    <div class="pt-4 border-t border-gray-800">
      <UButton
        color="gray"
        variant="ghost"
        @click="showCompleted = !showCompleted"
        block
        class="mb-4"
      >
        {{ showCompleted ? "Hide" : "Show" }} Completed ({{
          completedTasks.length
        }})
      </UButton>

      <div v-if="showCompleted" class="space-y-2">
        <TaskItem
          v-for="task in completedTasks"
          :key="task.id"
          :item="task"
          @mark-incomplete="handleManualActivation"
          @open-edit="openEdit"
          @open-snooze="openSnooze"
        />
      </div>
    </div>

    <CreateTaskModal
      v-model="isAddModalOpen"
      :edit-item="editingItem"
      @create="(item) => store.upsert(item)"
      @update="(item) => store.upsert(item)"
    />

    <SnoozeModal v-model="isSnoozeModalOpen" @confirm="handleSnoozeConfirm" />
  </div>
</template>

<script setup>
import CreateTaskModal from "@/components/CreateTaskModal.vue";
import SnoozeModal from "@/components/SnoozeModal.vue";
import TaskItem from "@/components/TaskItem.vue";
import { useChecklistStore } from "@/stores/checklistStore";
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted, ref } from "vue";

const store = useChecklistStore();
const { incompletedTasks, completedTasks } = storeToRefs(store);

const isAddModalOpen = ref(false);
const isSnoozeModalOpen = ref(false);
const editingItem = ref(null);
const selectedItemForSnooze = ref(null);
const showCompleted = ref(false);

let timer;

onMounted(() => {
  store.init();
  store.resetCycles();
  // Cycle reset check timer
  timer = setInterval(() => {
    store.resetCycles();
  }, 1000);
});

onUnmounted(() => clearInterval(timer));

const openAdd = () => {
  editingItem.value = null;
  isAddModalOpen.value = true;
};

const openEdit = (item) => {
  editingItem.value = item;
  isAddModalOpen.value = true;
};

const openSnooze = (item) => {
  selectedItemForSnooze.value = item;
  isSnoozeModalOpen.value = true;
};

const handleSnoozeConfirm = (newSnoozeISO) => {
  if (selectedItemForSnooze.value) {
    store.patchItem(selectedItemForSnooze.value.id, {
      checked: true,
      isSnoozed: true,
      snoozeUntil: newSnoozeISO,
    });
    isSnoozeModalOpen.value = false;
    selectedItemForSnooze.value = null;
  }
};

const handleManualActivation = (item) => {
  store.patchItem(item.id, {
    checked: false,
    isSnoozed: false,
    snoozeUntil: null,
  });
};
</script>
