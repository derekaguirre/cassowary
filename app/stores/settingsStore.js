import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed } from "vue";

export const useSettingsStore = defineStore("settings", () => {
  // Persistence using VueUse
  const selectedServer = useStorage("setting-server", "NA");

  const servers = {
    NA: { name: "North America", offset: "-05:00" },
    EU: { name: "Europe", offset: "+01:00" },
    ASIA: { name: "Asia, SEA, TW/HK/MO", offset: "+08:00" },
  };

  const currentOffset = computed(() => servers[selectedServer.value].offset);

  return {
    selectedServer,
    servers,
    currentOffset,
  };
});
