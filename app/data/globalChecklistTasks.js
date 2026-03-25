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

const event = (id, title, description, startDate = null, deadline) =>
  createTask({
    id,
    title,
    deadline,
    description,
    recurrence: "none",
    ...(startDate && { originalDate: startDate }),
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
  cyclical("cyclical-3", "Endstate Matrix", "Endgame", 36, "2026-02-10T20:00:00Z"),
  cyclical("store-1", "Oscillated Coral Shop", "Store", 42, "2026-02-04T17:00:00Z"),

  event("event-1", "Lahai-Roi Blocks", "Event", "2026-03-26 04:00", "2026-04-13 03:59"),
  event("event-2", "Speed up! F.U.E.L. Instrumentality Project!", "Event", "2026-04-02 04:00", "2026-04-20 03:59"),
  event("event-3", "Knights of the Wild", "Event", "2026-04-09 10:00" ,"2026-04-29 03:59"),
  event("event-4", "The Flaming Red in Memory", "Event", "2026-04-16 04:00", "2026-04-29 03:59"),

  event("checkin-1", "Gifts of Solsworn", "Check-in","2026-03-19 11:00", "2026-04-29 03:59"),

];
