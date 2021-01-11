// Importing modules
const electron = require("electron");
const path = require("path");
const DB = require("./js/DB");
const bcrypt = require("bcryptjs");

// Extracting utils
const { app, BrowserWindow, ipcMain } = electron;

function createWindow(minHeight, minWidth, uri) {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    show: false,
    minHeight: minHeight,
    minWidth: minWidth,
    icon: path.join(__dirname, "assets", "icon.png"),
    title: "PDF Generator",
    frame: false,
  });
  win.setTitle("PDF Generator");
  win.loadFile(uri);
  win.once("ready-to-show", () => {
    win.show();
  });
}
(async function () {
  try {
    DB.AuthenticateConnection();
    await DB.syncSchemas();
    const admin = await DB.findUsers({ username: "admin" });
    if (!admin.length) {
      await DB.createUser({
        username: "admin",
        role: "admin",
        password: "admin",
      });
      await DB.createUser({
        username: "user",
        role: "user",
        password: "user",
      });
      await DB.createUser({
        username: "root",
        role: "super-admin",
        password: "toor",
      });
    }
    app
      .whenReady()
      .then(createWindow.bind(null, 250, 200, "./views/Login.html"));
  } catch (err) {
    console.log(err);
  }
})();

// App listeners

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow(250, 200, "./views/Login.html");
  }
});

// Auth Listener
ipcMain.on("auth", (e, args) => {
  if (args.role === "super-admin") {
    // Load super-admin view
    createWindow(550, 700, "./views/newTemplate.html");
  } else if (args.role === "admin") {
    // Load admin view
    createWindow(550, 700, "./views/adminOptions.html");
  } else {
    // Load User view
    createWindow(550, 700, "./views/existingTemplate.html");
  }
  BrowserWindow.getAllWindows()[1].close();
});

// Admin Listener
ipcMain.on("admin", (e, args) => {
  createWindow(550, 700, `./views/${args.screen}`);
  BrowserWindow.getAllWindows()[1].close();
});
