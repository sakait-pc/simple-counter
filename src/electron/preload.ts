import { ipcRenderer, contextBridge } from "electron";

interface ElectronAPI {
  hello: () => any;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

const api: ElectronAPI = {
  hello: () =>
    ipcRenderer.invoke("HELLO"),
};

contextBridge.exposeInMainWorld("electron", api);
