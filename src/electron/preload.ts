import { ipcRenderer, contextBridge } from "electron";
import type { Counter } from "./entities";

interface ElectronAPI {
  fetchCounters: () => Promise<Counter[]>;
  createCounter: (name: string) => Promise<Counter[]>;
  incrementCounter: (index: number) => Promise<Counter[]>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

const api: ElectronAPI = {
  fetchCounters: () => ipcRenderer.invoke("FETCH_COUNTERS"),
  createCounter: (name: string) => ipcRenderer.invoke("CREATE_COUNTER", name),
  incrementCounter: (index: number) =>
    ipcRenderer.invoke("INCREMENT_COUNTER", index),
};

contextBridge.exposeInMainWorld("electron", api);
