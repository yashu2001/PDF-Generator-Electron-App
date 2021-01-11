// Module imports

const electron = require("electron");
const fs = require("fs");
const path = require("path");
const dialog = electron.remote.dialog;
const ipcRenderer = electron.ipcRenderer;

// HTML Mappings

const pfet = document.getElementById("pfet");
const pnt = document.getElementById("pnt");
const bckp = document.getElementById("bckp");
const rest = document.getElementById("restore");

// Event listeners

// Backup listener
bckp.addEventListener("click", () => {
  dialog
    .showSaveDialog(electron.remote.getCurrentWindow(), {
      title: "Select the Location to backup Database",
      defaultPath: path.join(
        __dirname,
        "../backups",
        new Date().getDate() + "-" + (new Date().getMonth() + 1) + ".sqlite"
      ),
      buttonLabel: "Save",
      filters: [
        {
          name: "Database files",
          extensions: ["sqlite"],
        },
      ],
    })
    .then((file) => {
      // Stating whether dialog operation was cancelled or not.
      console.log(file.canceled);
      if (!file.canceled) {
        console.log(file.filePath.toString());

        // Creating and Writing Backup
        fs.copyFileSync(
          path.join(__dirname, "../../../main.sqlite"),
          file.filePath.toString()
        );
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// Restore listener
rest.addEventListener("click", () => {
  dialog
    .showOpenDialog(electron.remote.getCurrentWindow(), {
      properties: ["openFile"],
      title: "Select the backed up database",
      defaultPath: path.join(__dirname, "../backups"),
      buttonLabel: "Restore",
      filters: [{ name: "Database files", extensions: ["sqlite"] }],
    })
    .then((d) => {
      if (!d.filePaths.length) {
        console.log("cancelled");
      } else {
        // Overwriting existing db
        fs.copyFileSync(
          d.filePaths[0].toString(),
          path.join(__dirname, "../../../main.sqlite")
        );
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// Existing template
pfet.addEventListener("click", () => {
  ipcRenderer.send("admin",{screen:"existingTemplate.html"})
});

// New template
pnt.addEventListener("click", () => {
  ipcRenderer.send("admin",{screen:"newTemplate.html"})
});
