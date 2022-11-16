import { ipcRenderer, contextBridge } from "electron";
import type { Counter } from "./entities";

interface ElectronAPI {
  fetchCounters: () => Promise<Counter[]>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

const api: ElectronAPI = {
  fetchCounters: () =>
    ipcRenderer.invoke("FETCH_COUNTERS"),
};

contextBridge.exposeInMainWorld("electron", api);
