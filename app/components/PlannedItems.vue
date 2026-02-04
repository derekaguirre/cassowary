<template>
  <section>
    <div
      class="w-auto h-auto flex items-center gap-1 overflow-x-auto py-1 px-1 border-2 border-yellow-500"
    >
      <div
        v-for="(item, index) in displayList()"
        :key="item.value"
        class="flex-shrink-0"
        :class="{
          'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14': true,
        }"
      >
        <UTooltip
          arrow
          :text="item.title"
          :popper="{
            placement: 'top',
            offsetDistance: 10,
          }"
          class="cursor-pointer w-full h-full"
        >
          <NuxtLink :to="item.link" class="block w-full h-full">
            <UAvatar
              :src="item.icon || ''"
              :alt="item.title || ''"
              size="md"
              :class="[
                'hover:scale-105 transition-transform duration-300 hover:shadow-lg w-full h-full',
                `rarity-${item.rarity}`,
              ]"
              :ui="{
                size: {
                  md: 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14',
                },
              }"
            />
          </NuxtLink>
        </UTooltip>
      </div>
    </div>
  </section>
</template>

<script setup>
import * as gameCharacter from "@/data/game/gameCharacter";
import * as gameWeapon from "@/data/game/gameWeapon";
import { usePlannedCharacterStore } from "@/stores/plannedCharacterStore";
import { usePlannedWeaponStore } from "@/stores/plannedWeaponStore";

const characters = ref({});
const weapons = ref({});

const displayList = () => {
  return characterList().concat(weaponList());
};

const characterList = () => {
  let list = [];
  Object.entries(characters.value).forEach(function (
    [characterName, character],
    index,
  ) {
    const charData = gameCharacter.characters[characterName];
    const subtitle = charData.rarity + "⭐";
    list = list.concat({
      value: characterName,
      title: charData.display_name,
      subtitle: subtitle,
      icon: charData.icon,
      link: "/characters#" + characterName,
      rarity: charData.rarity,
    });
  });
  return list;
};

const weaponList = () => {
  let list = [];
  Object.entries(weapons.value).forEach(function ([weaponName, weapon], index) {
    const weapData = gameWeapon.weapons[weaponName];
    const subtitle = weapData.rarity + "⭐";
    list = list.concat({
      value: weaponName,
      title: weapData.display_name,
      subtitle: subtitle,
      icon: weapData.icon,
      link: "/weapons#" + weaponName,
      rarity: weapData.rarity,
    });
  });
  return list;
};

onBeforeMount(() => {
  usePlannedCharacterStore().init();
  usePlannedWeaponStore().init();
});

onMounted(() => {
  characters.value = usePlannedCharacterStore().getAllActivePlannedCharacters();
  weapons.value = usePlannedWeaponStore().getAllActivePlannedWeapons();
});
</script>
