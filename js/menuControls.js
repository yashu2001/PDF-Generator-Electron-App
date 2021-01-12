// Module Imports

const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;

let back;
// HTML Mappings

back = document.getElementById("back");
if (!back) {
  if (localStorage.getItem("userType") === "admin") {
    const li = document.createElement("li");
    li.innerHTML = "<button id='back'>Back</button>";
    document
      .getElementById("menu-list")
      .insertBefore(li, document.getElementById("menu-list").children[0]);
    back = document.getElementById("back");
  }
}
const logout = document.getElementById("logout");

// Back event listener
try {
  back.addEventListener("click", () => {
    ipcRenderer.send("admin", { screen: "adminOptions.html" });
  });
} catch (err) {
  console.log("User is not admin");
}

// Logout event listener

logout.addEventListener("click", () => {
  ipcRenderer.send("admin", { screen: "Login.html" });
});
