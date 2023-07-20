import { app, BrowserWindow, ipcMain, shell } from "electron";
import * as path from "path";
import { login, tokenFlow } from "./auth/auth";

import { DeepLinkAuthClient } from '@orosound/auth_client_sdk_nodejs'
import persistToken 		      from './auth/persistToken';

const oro_provider = {
  name: "orosound",
  openIdConnectUrl: "http://localhost:8001",
  clientId: "foo",
  redirectUri: "com.example.app://auth/callback",
  scope: "openid name profile email offline_access",
  responseType: "code",
  extras: { prompt: "consent", access_type: "offline" },
};

let mainWindow: BrowserWindow | null = null;
const auth_client = new DeepLinkAuthClient(oro_provider, persistToken, mainWindow);

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('../index.html')
  mainWindow.webContents.openDevTools()
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.


const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.whenReady().then(() => {
    auth_client.init();
    createWindow();
    console.log(persistToken.getCredentials())
    app.on("activate", function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// Handle window controls via IPC
ipcMain.on("login", () => {
  auth_client.init();
});
ipcMain.on("logout", () => {
  auth_client.signOut();
});

ipcMain.on("test", (event, args) => {
  console.log('test')
  console.log(args)
  shell.openExternal(args[0])
} )