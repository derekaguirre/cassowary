<template>
  <UTooltip
    arrow
    :text="item.label"
    :popper="{
      placement: 'top',
      offsetDistance: 8,
    }"
    class=""
  >
    <UCard
      :ui="{
        // header: 'p-1 sm:p-1',
        body: 'p-0 sm:p-0',
        footer: 'p-1 sm:p-1',
      }"
      :class="[
        item && item.missing === 0 ? 'opacity-50 hover:opacity-100' : '',
      ]"
    >
      <!-- TODO repurpose for grouping by generic item names later -->
      <!-- <template #header>
        <div
          class="flex justify-center items-center h-20 font-medium text-base text-center break-words"
          :title="(item && item.label) || ''"
        >
          {{ (item && item.label) || "" }}
        </div>
      </template> -->

      <div
        class="item-card-body relative flex items-center justify-center min-h-[80px] p-2"
        :class="`rarity-${item.rarity}`"
      >
        <img
          class="object-cover w-20 h-20"
          :src="(item && item.icon) || ''"
          :alt="(item && item.label) || ''"
          width="256"
          height="256"
        />

        <!-- Overlay for missing and synthesizable-->
        <div class="inventory-counts absolute opacity-75 w-full h-full">
          <div class="needed-count absolute bottom-0 left-0">
            <UTooltip
              :text="item && item.missing > 0 ? 'Missing' : 'Completed'"
              class=""
              :content="{
                side: 'right',
              }"
            >
              <UBadge
                size="md"
                :color="ownedItemColor"
                variant="solid"
                class="rounded-tl-none rounded-bl-none rounded-tr-lg rounded-br-none"
              >
                <UIcon
                  name="ic:round-cancel"
                  class=""
                  v-if="item && item.missing > 0"
                />
                <UIcon name="ic:round-check-circle-outline" class="" v-else />
                <p class="truncate">
                  {{ (item && item.missing) || 0 }}
                </p>
              </UBadge>
            </UTooltip>
          </div>
          <!-- Convert to a button that triggers automatic synthesizing -->
          <div class="synthesizable-count absolute top-0 right-0">
            <UTooltip text="Synthesizable" v-if="item && item.synthesized > 0">
              <UBadge
                size="md"
                color="warning"
                variant="solid"
                class="rounded-tl-none rounded-bl-lg rounded-tr-lg rounded-br-none"
              >
                <UIcon name="ic:outline-science" class="" />
                {{ item && item.synthesized }}
              </UBadge>
            </UTooltip>
          </div>
        </div>
      </div>

      <template #footer>
        <!-- Needed count -->
        <div class="flex justify-center p-1 align-middle">
          <div class="self-center">
            <UTooltip text="Needed" :popper="{ placement: 'top' }">
              <p class="font-bold">
                {{ (item && item.needed) || 0 }}
              </p>
            </UTooltip>
          </div>
        </div>
        <!-- Owned count and user input -->
        <div class="h-8">
          <UTooltip text="Owned" :popper="{ placement: 'bottom' }">
            <UInput
              type="number"
              min="0"
              v-model="itemRef"
              @change="updateMaterialCount(index, itemRef)"
            />
          </UTooltip>
        </div>
      </template>
    </UCard>
  </UTooltip>
</template>

<script setup>
import { useInventoryItemStore } from "@/stores/inventoryItemStore";

const $emit = defineEmits(["updateMaterialCount"]);

const props = defineProps({
  index: String,
  item: Object,
});

const ownedItemColor = computed(() => {
  const synthesizedOwned =
    props.item && (props.item.synthesized || 0) + (props.item.owned || 0);
  if (props.item && props.item.needed === 0) return "neutral";
  return props.item && synthesizedOwned >= props.item.needed
    ? "success"
    : "error";
});

// const toast = useToast();
const itemRef = ref(0);

const updateMaterialCount = (index, count) => {
  debouncedUpdateMaterialCount(index, count).then(() => {
    // toast.add({
    //   title: "Inventory Item " + props.item.label + " updated to LocalStorage",
    //   icon: "i-heroicons-check-badge",
    //   duration: 2000,
    // });
    $emit("updateMaterialCount", true);
  });
};

const debouncedUpdateMaterialCount = useDebounceFn((index, count) => {
  useInventoryItemStore().updateInventory(index, count);
  itemRef.value = count;
}, 1000);

onMounted(() => {
  itemRef.value = (props.item && props.item.owned) || 0;
});
</script>
