export const checklistItem = {
  id: crypto.randomUUID(),
  title: "New Task",
  description: "",
  recurType: "none",
  resetAt: "from-original",
  originalDate: null,
  completionDate: null,
  deadline: null,
  checked: false,
  isSnoozed: false,
  snoozeUntil: null,
  isGlobal: false,
  anchorHour: 9,
  // TODO: see if i can refactor or merge with originalDate, use file search to find all occurrences and see if i can use originalDate instead of recurDays for custom tasks instead
  created_at: null,
  updated_at: null,
};
