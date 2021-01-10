// Importing DB module
const DB = require("../js/DB");
const ipcRenderer = require("electron").ipcRenderer;

// HTML mappings
const login = document.getElementById("login");

// Utility Functions

function showError(message) {
  const p = document.createElement("p");
  p.setAttribute("class", "error-message noSelect");
  p.innerText = message;
  document.getElementById("dataContainer").appendChild(p);
  setTimeout(() => {
    p.remove();
  }, 2000);
}

// Click Listeners
login.addEventListener("click", async () => {
  // HTML mappings
  const username = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  //   Check of presence(Data completeness)
  if (!username || !pass) {
    showError("Please ensure all fields are filled");
    console.log("error");
    return;
  }
  // Authentication request
  const { error, message } = await DB.AuthenticateUser(username, pass);
  // Error checks
  if (error) {
    showError(message);
  } else {
    // Use ipc renderer to send message to main.js
    ipcRenderer.send("auth", { username, role: message });
  }
});
