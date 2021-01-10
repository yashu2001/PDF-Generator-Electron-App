let remote = require("electron").remote;

let minimize = document.getElementById("minimize");
let maximize = document.getElementById("maximize");
let quit = document.getElementById("quit");

minimize.addEventListener("click", (e) => {
  remote.BrowserWindow.getFocusedWindow().minimize();
});
try {
  maximize.addEventListener("click", (e) => {
    remote.BrowserWindow.getFocusedWindow().maximize();
  });
} catch (err) {
  console.log("maximize is not defined");
}
quit.addEventListener("click", (e) => {
  remote.BrowserWindow.getFocusedWindow().close();
});
