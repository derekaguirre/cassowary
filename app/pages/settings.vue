<template>
  <section class="flex justify-between items-center mb-10">
    <h1 class="font-extrabold text-4xl text-gray-100">Settings</h1>
  </section>

  <section class="mb-10 border-b border-gray-800 pb-10">
    <span class="font-bold text-2xl block mb-4 text-gray-100">Region</span>
    <div class="max-w-xs">
      <p class="text-sm text-gray-400 mb-2">
        Select your region below to set your event timers
      </p>
      <select
        v-model="settingsStore.selectedServer"
        class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100"
      >
        <option
          v-for="(info, id) in settingsStore.servers"
          :key="id"
          :value="id"
        >
          {{ info.name }} (UTC{{ info.offset }})
        </option>
      </select>
    </div>
  </section>

  <section class="grid grid-cols-1">
    <span class="font-bold text-2xl">Backup & Restore Data</span>
    <div>
      <span class="font-bold">Backup Data</span>
      <div class="mb-2">
        <UButton color="primary" variant="solid" @click="downloadData">
          Download JSON Data
        </UButton>
      </div>
    </div>
    <div>
      <span class="font-bold">Restore Data</span>
      <div class="mb-2">
        <div class="flex flex-row justify-stretch">
          <UInput
            v-model="inputFileModel"
            class="block self-center mr-3 w-2/3"
            type="file"
            accept=".json"
            icon="i-heroicons-arrow-up-tray"
            @change="handleJsonDataSelected"
          />
          <UButton
            class=""
            color="primary"
            variant="solid"
            @click="submitUploadData"
          >
            Upload JSON Data
          </UButton>
        </div>
        <div :class="uploadedJsonTextArea ? 'block' : 'hidden'">
          <div>Preview restored JSON data</div>
          <UTextarea
            class="w-full"
            v-model="uploadedJsonTextArea"
            resize
            :rows="uploadedJsonTextArea ? 10 : 1"
            placeholder="Preview restored JSON data"
            disabled
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import * as plannerService from "@/services/plannerService";
import { useSettingsStore } from "@/stores/settingsStore";
import { ref } from "vue";
const settingsStore = useSettingsStore();
const toast = useToast();

const downloadData = () => {
  plannerService.downloadData();
};

const uploadedJsonTextArea = ref(null);
const inputFileModel = ref(null);
const selectedFiles = ref(null);

const submitUploadData = () => {
  if (!uploadedJsonTextArea.value) {
    toast.add({
      title: "No JSON data selected",
      icon: "i-heroicons-x-mark",
      duration: 2000,
    });
    return;
  }
  let result = [];
  if (confirm("Are you sure you want to restore this data?")) {
    result = plannerService.uploadData(JSON.parse(uploadedJsonTextArea.value));
    uploadedJsonTextArea.value = null;
    toast.add({
      title: "Data successfully restored: " + result.join(", "),
      icon: "i-heroicons-check-badge",
      duration: 2000,
    });
    inputFileModel.value = null;
    selectedFiles.value = null;
  }
};

async function handleJsonDataSelected(event) {
  selectedFiles.value = event.target.files;
  const file = selectedFiles.value?.[0];
  if (!file) return;

  if (file.type !== "application/json") {
    console.error("Only JSON files are supported.");
    return;
  }

  try {
    const text = await file.text();
    const jsonData = JSON.parse(text);

    // show preview
    uploadedJsonTextArea.value = JSON.stringify(jsonData, null, 2);
  } catch (err) {
    console.error("Invalid JSON file:", err);
  }
}
</script>
