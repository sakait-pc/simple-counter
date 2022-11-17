import type { Counter } from "../entities";
export const LOCAL_BASE_URL = "http://localhost:5173";

export const BASE_COUNTER: Counter = {
  name: "default counter",
  count: 0,
  lastUpdate: "0000/00/00 00:00",
  isLocked: false,
};
