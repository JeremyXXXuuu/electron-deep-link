// // All of the Node.js APIs are available in the preload process.
// // It has the same sandbox as a Chrome extension.
import { contextBridge, ipcRenderer } from "electron";
import type {IpcRendererEvent} from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    removeAllListeners(channel: Channels){
      ipcRenderer.removeAllListeners(channel);
    },
  },
  login: () => ipcRenderer.send("login"),
  logout: () => ipcRenderer.send("logout"),
  userInfo: () => ipcRenderer.send("userInfo")
});



export type Channels = 'login'|'logout'|'userInfo';

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener("DOMContentLoaded", () => {
//   const replaceText = (selector: string, text: string) => {
//     const element = document.getElementById(selector);
//     if (element) {
//       element.innerText = text;
//     }
//   };

//   for (const type of ["chrome", "node", "electron"]) {
//     replaceText(`${type}-version`, process.versions[type as keyof NodeJS.ProcessVersions]);
//   }
// });
