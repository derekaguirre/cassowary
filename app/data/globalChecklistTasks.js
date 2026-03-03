const createTask = (overrides) => ({
  id: crypto.randomUUID(),
  title: "Untitled Task",
  description: "",
  recurrence: "none",
  recurrenceMode: "from-original",
  originalDate: new Date().toISOString(),
  completionDate: null,
  deadline: null,
  checked: false,
  isGlobal: true,
  anchorHour: null,
  ...overrides,
});

const daily = (id, title, description) =>
  createTask({
    id,
    title,
    description,
    anchorHour: 2,
    recurrence: "daily",
  });

const weekly = (id, title, originalDate) =>
  createTask({
    id,
    title,
    originalDate,
    description: "Weekly",
    recurrence: "weekly",
    anchorHour: 2,
  });

const event = (id, title, description, deadline) =>
  createTask({
    id,
    title,
    deadline,
    description,
    recurrence: "none",
  });

const cyclical = (id, title, description, days, originalDate) =>
  createTask({
    id,
    title,
    originalDate,
    description,
    recurrence: "custom",
    recurrenceDays: days,
  });

// prettier-ignore
export default [
  daily("daily-1", "Daily Activity Points", "Daily"),
  daily("daily-2", "Tacet Discord Nests", "Daily"),

  weekly("weekly-1", "Weekly Bosses", "2026-02-23T09:00:00Z"),
  weekly("weekly-2","Fantasies of the Thousand Gateways","2026-02-23T09:00:00Z"),

  cyclical("cyclical-1", "Tower of Adversity", "Endgame", 28, "2026-02-02T09:00:00Z"),
  cyclical("cyclical-2", "Whimpering Wastes", "Endgame", 28, "2026-01-19T09:00:00Z"),
  cyclical("cyclical-3", "Doubled Pawns Matrix", "Endgame", 36, "2026-02-10T20:00:00Z"),
  cyclical("store-1", "Oscillated Coral Shop", "Store", 42, "2026-02-04T17:00:00Z"),

  event("event-1", "Rein Back! Migration Mayhem!", "Event", "2026-03-09T09:00:00Z"),
  event("event-3", "Veins of the Frostlands", "Event", "2026-03-11T20:00:00Z"),
  event("event-2", "Full Throttle! Bolt & Blitz!", "Event", "2026-03-18T09:00:00Z"),
  event("event-4", "TERM-X: Outreach", "Event", "2026-03-18T09:00:00Z"),
  event("event-5", "Unfrozen Traces", "Event", "2026-03-18T09:00:00Z"),
  event("event-6", "Where Stars Cascade Down", "Event", "2026-03-18T17:00:00Z"),
  event("event-7", "Blade Hunter: Wilderness", "Event", "2026-03-18T09:00:00Z"),

  event("checkin-1", "Gifts of Soft Snow", "Check-in", "2026-03-18T09:00:00Z"),

];
