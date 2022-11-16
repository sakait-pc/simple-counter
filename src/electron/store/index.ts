import isDev from "electron-is-dev";
import ElectronStore from "electron-store";

interface Counter {
  name: string;
  count: number;
  lastUpdate: string;
}
type StoreType = {
  counters: Counter[] | undefined,
}

const createStore = () => {
  return isDev
    ? new ElectronStore<StoreType>()
    : new ElectronStore<StoreType>({name: "config-prod"});
};

const store = createStore();
if (!store.has("counters")) {
  store.set("counters", []);
}

export default store;
