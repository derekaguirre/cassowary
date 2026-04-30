import { checklistItem } from "@/data/database/dbChecklist";
import { useSettingsStore } from "@/stores/settingsStore";
/**
 * THE UNIVERSAL ANCHOR
 * Converts simple strings to ISO strings with the dynamic server offset.
 */
const toServerTime = (dateStr, time = "04:00:00") => {
  if (!dateStr) return null;
  const settings = useSettingsStore();
  const OFFSET = settings.currentOffset || "+08:00";

  // If dateStr already contains a time (HH:mm), we don't want to append the default time
  if (dateStr.includes(" ") || dateStr.includes("T")) {
    const formatted = dateStr.replace(" ", "T");
    // Only add offset if it doesn't have one
    return formatted.includes("+") || formatted.includes("Z")
      ? formatted
      : `${formatted}${OFFSET}`;
  }

  return `${dateStr}T${time}${OFFSET}`;
};

// Base Factory
const createTask = (overrides) => ({
  ...checklistItem,
  isGlobal: true,
  ...overrides,
});

const daily = (id, title, description) => {
  const PATCH_DATE = "2026-04-30";
  const RESET_TIME = "04:00:00";
  return createTask({
    id,
    title,
    description,
    recurType: "daily",
    originalDate: toServerTime(PATCH_DATE, RESET_TIME),
  });
};

const weekly = (id, title, startDate) =>
  createTask({
    id,
    title,
    description: "Weekly",
    recurType: "weekly",
    originalDate: toServerTime(startDate),
  });

const event = (id, title, description, deadline, startDate) =>
  createTask({
    id,
    title,
    description,
    recurType: "none",
    originalDate: toServerTime(startDate),
    deadline: toServerTime(deadline),
  });

const cyclical = (id, title, description, days, startDate) =>
  createTask({
    id,
    title,
    description,
    recurType: "custom",
    recurDays: days,
    originalDate: toServerTime(startDate),
  });

// prettier-ignore
export const GLOBAL_DATA_VERSION = "0.11.1";

export const getGlobalTasks = () => {
  const patchStartDay = "2026-03-19";
  const dailyResetTime = "04:00";
  const maintenenceEndTime = "11:00";
  const shopResetTime = "12:00";
  const versionResetTime = "15:00";
  return [
    // // DAILIES
    daily("global-daily-1", "Work In Progress", ""),
    // daily("global-daily-2", "Tacet Discord Nests", "Daily"),
    // weekly("global-weekly-1", "Weekly Bosses", `2026-02-23 ${dailyResetTime}`),
    // weekly(
    //   "global-weekly-2",
    //   "Fantasies of the Thousand Gateways",
    //   `2026-02-23 ${dailyResetTime}`,
    // ),
    // cyclical(
    //   "global-cyclical-1",
    //   "Tower of Adversity",
    //   "Endgame",
    //   28,
    //   `2026-02-02 ${dailyResetTime}`,
    // ),
    // cyclical(
    //   "global-cyclical-2",
    //   "Whimpering Wastes",
    //   "Endgame",
    //   28,
    //   `2026-01-19 ${dailyResetTime}`,
    // ),
    // cyclical(
    //   "global-cyclical-3",
    //   "Endstate Matrix",
    //   "Endgame",
    //   41,
    //   `${patchStartDay} ${versionResetTime}`,
    // ),
    // cyclical(
    //   "global-store-1",
    //   "Oscillated Coral Shop",
    //   "Store",
    //   41,
    //   `${patchStartDay} ${shopResetTime}`,
    // ),
    // event(
    //   "global-event-1",
    //   "Second Coming of Solaris: Collab Season",
    //   "Event",
    //   `2026-06-07 ${shopResetTime}`,
    //   `${patchStartDay} ${dailyResetTime}`,
    // ),
    // event(
    //   "global-event-2",
    //   "Star Bouncing",
    //   "Event",
    //   `2026-06-07 ${dailyResetTime}`,
    //   `2026-05-02 ${dailyResetTime}`,
    // ),
    // event(
    //   "global-event-3",
    //   "Lollo Express: Promise Delivered",
    //   "Event",
    //   `2026-06-07 ${dailyResetTime}`,
    //   `2026-05-07 ${dailyResetTime}`,
    // ),
    // event(
    //   "global-event-4",
    //   "Cubie Derby: Championship",
    //   "Event",
    //   `2026-05-25 ${dailyResetTime}`,
    //   `2026-05-09 ${dailyResetTime}`,
    // ),
    // event(
    //   "global-event-5",
    //   "Bountiful Waves",
    //   "Event",
    //   `2026-06-15 ${dailyResetTime}`,
    //   `${patchStartDay} ${shopResetTime}`,
    // ),
    // event(
    //   "global-event-5",
    //   "Bountiful Waves",
    //   "Event",
    //   `2026-06-15 ${dailyResetTime}`,
    //   `${patchStartDay} ${shopResetTime}`,
    // ),
    // event(
    //   "global-event-5",
    //   "Into the Memory Program!",
    //   "Web Event",
    //   `2026-06-15 ${dailyResetTime}`,
    //   `${patchStartDay} ${shopResetTime}`,
    // ),
    // event(
    //   "global-checkin-1",
    //   "Gifts of Grand Celebration",
    //   "Check-in",
    //   `2026-06-07 ${dailyResetTime}`,
    //   `${patchStartDay} ${maintenenceEndTime}`,
    // ),
  ];
};
