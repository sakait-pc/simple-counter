import { join } from "path";
import {
  app,
  Menu,
  BrowserWindow,
  globalShortcut,
  dialog,
  ipcMain,
} from "electron";
import isDev from "electron-is-dev";
import type { Counter } from "./entities";
import store from "./store";
import { LOCAL_BASE_URL, BASE_COUNTER } from "./constants";

const handleError = (title: string, e: unknown) => {
  if (e instanceof Error) {
    dialog.showErrorBox(title, e.message);
  } else {
    dialog.showErrorBox("Unexpected error", e as any);
  }
};

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  });

  const url = isDev ? LOCAL_BASE_URL : join(__dirname, "../out/index.html");

  if (isDev) {
    mainWindow.loadURL(url);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(url);
  }

  Menu.setApplicationMenu(null);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

const registerGlobalShortcut = () => {
  globalShortcut.register("CommandOrControl+F5", () => {
    if (mainWindow && mainWindow.isFocused()) {
      console.log("Reload main window");
      mainWindow.reload();
    }
  });
  globalShortcut.register("CommandOrControl+F9", () => {
    if (!mainWindow) return;
    const wc = mainWindow.webContents;
    const isDevToolsOpen = wc.isDevToolsOpened();
    const isFocus = mainWindow.isFocused();
    const isDevToolsFocus = wc.isDevToolsFocused();
    if (isDevToolsOpen && (isFocus || isDevToolsFocus)) wc.closeDevTools();
    else if (!isDevToolsOpen && isFocus) wc.openDevTools();
  });
};

app
  .whenReady()
  .then(() => {
    if (isDev) {
      registerGlobalShortcut();
    }
  })
  .catch(e => {
    handleError("Failed to start app.", e);
    app.quit();
  });

app.on("ready", createWindow);

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

const getCounters = () => {
  try {
    const counters = store.get("counters");
    if (!counters) throw new Error("The value 'counters' is undefined");
    return counters;
  } catch (e) {
    throw e;
  }
};

const getLastUpdate = () => {
  const dateString = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  // dateString example: '2022/11/16 00:42:09'
  const slicedSeconds = dateString.slice(0, -3);
  const regExpSelectSlashes = /\//g;
  return slicedSeconds.replace(regExpSelectSlashes, "-");
};

ipcMain.handle("FETCH_COUNTERS", () => {
  try {
    const counters = getCounters();
    return counters;
  } catch (e) {
    handleError("Failed to fetch counters.", e);
  }
});

ipcMain.handle("CREATE_COUNTER", (_, name: string) => {
  const counter: Counter = {
    ...BASE_COUNTER,
    name,
    lastUpdate: getLastUpdate(),
  };
  try {
    const current = getCounters();
    const counters = [...current, counter];
    store.set("counters", counters);
    return counters;
  } catch (e) {
    handleError("Failed to create a counter.", e);
  }
});

ipcMain.handle("INCREMENT_COUNTER", (_, index: number) => {
  try {
    const current = getCounters();
    const counters = current.map((counter, idx) => {
      if (idx === index) {
        return {
          ...counter,
          count: counter.count + 1,
          lastUpdate: getLastUpdate(),
        };
      }
      return counter;
    });
    store.set("counters", counters);
    return counters;
  } catch (e) {
    handleError("Failed to increment a counter.", e);
  }
});

ipcMain.handle("TOGGLE_LOCK", (_, index: number) => {
  try {
    const current = getCounters();
    const counters = current.map((counter, idx) => {
      if (idx === index) {
        return {
          ...counter,
          isLocked: !counter.isLocked,
          lastUpdate: getLastUpdate(),
        };
      }
      return counter;
    });
    store.set("counters", counters);
    return counters;
  } catch (e) {
    handleError("Failed to toggle lock.", e);
  }
});
