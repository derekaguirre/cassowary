import * as gameCharacters from "~/data/game/gameCharacter";
import * as gameInventoryItem from "~/data/game/inventoryItem/gameInventoryItem";

export const getLevelRangeDiff = (arrayData, currentLevel, targetLevel) => {
  // index of currentLevel
  const currentLevelIndex = arrayData.findIndex(
    (arr) => arr.level == currentLevel,
  );
  // index of targetLevel
  const targetLevelIndex = arrayData.findIndex(
    (arr) => arr.level == targetLevel,
  );
  // e.g.: if 1 and 60A, expects [50, 50A, 60, 60A]
  const result = arrayData
    .slice(0, targetLevelIndex + 1)
    .filter((item) => !arrayData.slice(0, currentLevelIndex).includes(item))
    .slice(1);

  return result;
};

export const isTieredMaterialType = (material) => {
  const isTiered = Object.keys(
    gameInventoryItem.tiered_materials_per_type,
  ).includes(material);
  return isTiered;
};

export const getMaterialsFromLevelListStatList = (
  name,
  statsToFarm,
  gameDataList = gameCharacters.characters,
) => {
  const materials = {};
  // looping into stats
  for (let stat in statsToFarm) {
    // looping into list of levels to farm
    // passive will not have level but data is adjusted (pretend only level 1)
    for (let level of statsToFarm[stat]) {
      for (let materialType in level.materials) {
        // Check basic system resources (EXP/Credits)
        if (["weap_exp", "char_exp", "shell_credit"].includes(materialType)) {
          const amount = level.materials?.[materialType] ?? 0;
          materials[materialType] = (materials[materialType] ?? 0) + amount;
          continue;
        }

        // get the materialType's material name
        const materialName = gameDataList[name][materialType];
        // Handle Tiered Materials
        if (isTieredMaterialType(materialType)) {
          for (let tier in level.materials[materialType]) {
            try {
              const tieredMaterialName =
                gameInventoryItem.tiered_materials_per_type[materialType][
                  materialName
                ][tier].name;
              const amount = level.materials?.[materialType][tier] ?? 0;

              materials[tieredMaterialName] =
                (materials[tieredMaterialName] ?? 0) + amount;
            } catch (e) {
              console.error(
                `Failed to resolve tiered material: ${materialType} -> ${materialName} -> Tier ${tier}`,
              );
            }
          }
          continue;
        }

        // Handle standard materials
        const amount = level.materials?.[materialType] ?? 0;
        materials[materialName] = (materials[materialName] ?? 0) + amount;
      }
    }
  }

  return materials;
};
