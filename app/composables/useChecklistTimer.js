import { onMounted, onUnmounted, ref, watch } from "vue";

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

export function getNextResetDate(item) {
  if (!item || item.recurrence === "none") return null;

  const offsets = {
    daily: 1,
    weekly: 7,
    monthly: 30,
    custom: item.recurrenceDays || 1,
  };
  const intervalMs = (offsets[item.recurrence] || 1) * 86400000;

  if (item.recurrenceMode === "from-completion" && item.completionDate) {
    const completion = new Date(item.completionDate);
    let next = new Date(completion.getTime() + intervalMs);
    if (typeof item.anchorHour === "number")
      next.setHours(item.anchorHour, 0, 0, 0);
    return next;
  }

  const start = new Date(item.originalDate || item.startingDay || "2026-01-01");
  if (typeof item.anchorHour === "number")
    start.setHours(item.anchorHour, 0, 0, 0);

  const now = new Date().getTime();
  if (start.getTime() > now) return start;

  const elapsed = now - start.getTime();
  const cyclesPassed = Math.floor(elapsed / intervalMs);
  let next = new Date(start.getTime() + (cyclesPassed + 1) * intervalMs);

  if (typeof item.anchorHour === "number")
    next.setHours(item.anchorHour, 0, 0, 0);
  return next;
}

export function getSnoozeWakeDate(item) {
  if (!item.isSnoozed || !item.snoozeUntil) return null;
  return new Date(item.snoozeUntil);
}

export const isOverdue = (item) => {
  if (item.checked || item.recurrence !== "none") return false;
  const reset =
    getNextResetDate(item) || (item.deadline ? new Date(item.deadline) : null);
  return reset && new Date() > reset;
};

export function getCountdownLabel(item) {
  const now = new Date();
  const resetDate =
    getNextResetDate(item) || (item.deadline ? new Date(item.deadline) : null);
  const snoozeDate = getSnoozeWakeDate(item);

  if (item.isSnoozed && snoozeDate) {
    const sDiff = snoozeDate - now;
    const rDiff = resetDate ? resetDate - now : null;
    let label = `(💤 ${formatDuration(sDiff)})`;
    if (rDiff && rDiff > 0) {
      label += ` ${formatDuration(rDiff)}`;
    }
    return label;
  }

  if (item.checked && resetDate) {
    return `${formatDuration(resetDate - now)}`;
  }

  if (!resetDate) return "no deadline";
  const diff = resetDate - now;
  return diff <= 0 && item.recurrence === "none"
    ? "overdue"
    : formatDuration(diff);
}

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
