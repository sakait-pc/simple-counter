import { ipcRenderer, contextBridge } from "electron";
import type { Counter } from "./entities";

interface ElectronAPI {
  fetchCounters: () => Promise<Counter[]>;
  createCounter: (name: string) => Promise<Counter[]>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

const api: ElectronAPI = {
  fetchCounters: () => ipcRenderer.invoke("FETCH_COUNTERS"),
  createCounter: (name: string) => ipcRenderer.invoke("CREATE_COUNTER", name),
};

contextBridge.exposeInMainWorld("electron", api);
