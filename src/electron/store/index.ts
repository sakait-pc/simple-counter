import isDev from "electron-is-dev";
import ElectronStore from "electron-store";
import type { StoreType } from "../entities";

const createStore = () => {
  return isDev
    ? new ElectronStore<StoreType>()
    : new ElectronStore<StoreType>({ name: "config-prod" });
};

const store = createStore();
if (!store.has("counters")) {
  store.set("counters", []);
}

export default store;
