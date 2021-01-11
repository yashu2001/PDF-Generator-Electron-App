const DB = require("../js/DB");

const update = document.getElementById("update");

function showMessage(type, message) {
  const p = document.createElement("p");
  if (type === "error") {
    p.setAttribute("class", "error-message noSelect");
  } else {
    p.setAttribute("class", "success-message noSelect");
  }
  p.innerText = message;
  p.setAttribute("style", "text-align:center");
  document.getElementById("FormArea").appendChild(p);
  setTimeout(() => {
    p.remove();
  }, 2000);
}

update.addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (!username || !pass) {
    showMessage("error", "Please make sure to fill all fields");
  } else {
    //   Update data here
    const { error, message } = await DB.updateUser({ username, pass });
    if (error) {
      showMessage("error", message);
    } else {
      showMessage("success", message);
      document.getElementById("username").value = "";
      document.getElementById("password").value = "";
    }
  }
});
