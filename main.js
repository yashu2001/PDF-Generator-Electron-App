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
      webSecurity: false,
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
        password: "admin4545",
      });
      await DB.createUser({
        username: "oswin",
        role: "user",
        password: "1234",
      });
      await DB.createUser({
        username: "root",
        role: "super-admin",
        password: "toor",
      });
      await DB.createTemplate({
        name: "Label-1",
        document_height: 248,
        document_width: 164,
        font_size: 9,
        document_orientation: "portrait",
        coordinates: [
          { x: "22.5", y: "88" },
          { x: "97.5", y: "88" },
          { x: "22.5", y: "205" },
          { x: "97.5", y: "205" },
        ],
      });
      await DB.createTemplate({
        name: "Label-2",
        document_height: 297,
        document_width: 210,
        font_size: 11,
        document_orientation: "portrait",
        coordinates: [
          { x: "25", y: "110" },
          { x: "130", y: "110" },
          { x: "25", y: "262" },
          { x: "130", y: "262" },
        ]
      })
      await DB.AddColor("Beige");
      await DB.AddColor("Rosewood");
      const thicknessarr = [12, 15, 18, 20, 25, 30];
      thicknessarr.map(async (thickness) => {
        await DB.AddThickness(thickness);
      });
      const sizesArr = [
        { length: 2438.4, breadth: 1219.2 },
        { length: 2438.4, breadth: 914.4 },
        { length: 2743.2, breadth: 1219.2 },
        { length: 2743.2, breadth: 914.4 },
        { length: 1828.8, breadth: 1219.2 },
        { length: 1828.8, breadth: 914.4 },
      ];
      sizesArr.map(async (size) => {
        await DB.AddSize(size);
      });
    }
    app
      .whenReady()
      .then(
        createWindow.bind(
          null,
          250,
          200,
          path.join(__dirname, "./views/Login.html")
        )
      );
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
    createWindow(250, 200, path.join(__dirname, "./views/Login.html"));
  }
});

// Auth Listener
ipcMain.on("auth", (e, args) => {
  if (args.role === "super-admin") {
    // Load super-admin view
    createWindow(550, 700, path.join(__dirname, "./views/root.html"));
  } else if (args.role === "admin") {
    // Load admin view
    createWindow(550, 700, path.join(__dirname, "./views/adminOptions.html"));
  } else {
    // Load User view
    createWindow(
      550,
      700,
      path.join(__dirname, "./views/existingTemplate.html")
    );
  }
  BrowserWindow.getAllWindows()[1].close();
});

// Admin Listener
ipcMain.on("admin", (e, args) => {
  BrowserWindow.getAllWindows()[0].loadFile(
    path.join(__dirname, `./views/${args.screen}`)
  );
});
