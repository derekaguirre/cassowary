import { onMounted, onUnmounted, ref, watch } from "vue";

export const calculateCycleTime = (recurDays, recurType) => {
  const recurrenceOffset = {
    daily: 1,
    weekly: 7,
    monthly: 30,
    custom: recurDays || 1,
  };
  return recurrenceOffset[recurType] * 86400000;
};

export function getNextResetDate(eventObj) {
  if (!eventObj || eventObj.recurType === "none") return null;

  const cycleMs = calculateCycleTime(eventObj.recurDays, eventObj.recurType);
  const now = Date.now();

  // Handles the time shift
  let base = new Date(eventObj.completionDate || eventObj.originalDate);

  if (base > now) return base;

  const elapsed = now - base.getTime();
  const cyclesPassed = Math.floor(elapsed / cycleMs);
  return new Date(base.getTime() + (cyclesPassed + 1) * cycleMs);
}

export function getSnoozeWakeDate(item) {
  if (!item.isSnoozed || !item.snoozeUntil) return null;
  return new Date(item.snoozeUntil);
}

export function getCountdownLabel(eventObj) {
  const now = new Date();

  // 1. Get the actual date we are counting towards
  const resetDate = getNextResetDate(eventObj); // Only returns if recurring
  const deadlineDate = eventObj.deadline ? new Date(eventObj.deadline) : null;
  const snoozeDate = getSnoozeWakeDate(eventObj);

  // 2. Handle Snooze
  if (eventObj.isSnoozed && snoozeDate) {
    const target = resetDate || deadlineDate;
    return `(💤 ${formatDuration(snoozeDate - now)}) ${target ? formatDuration(target - now) : ""}`;
  }

  // 3. Handle Completed Events
  if (eventObj.checked) {
    if (eventObj.recurType === "none") {
      return "Completed";
    }
    if (resetDate) {
      return `Reset: ${formatDuration(resetDate - now)}`; // Recurring tasks show reset
    }
  }

  // 4. Handle Active/Overdue logic
  const finalTarget = resetDate || deadlineDate;
  if (!finalTarget) return "No deadline";

  const diff = finalTarget - now;
  return diff < 0 ? "Overdue" : formatDuration(diff);
}

export const formatDuration = (ms) => {
  if (ms <= 0) return "0m";
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return parts.join(" ");
};

export function useReactiveCountdownLabel(itemRef) {
  const label = ref("");
  const update = () => {
    label.value = getCountdownLabel(itemRef.value);
  };
  let timer;
  onMounted(() => {
    update();
    timer = setInterval(update, 10000);
  });
  onUnmounted(() => clearInterval(timer));
  watch(itemRef, update, { deep: true });
  return label;
}
