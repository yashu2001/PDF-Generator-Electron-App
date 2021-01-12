// Global variable to keep track of number of Coordinate pairs

let Coordinates = 0;

// HTML Mappings

let CoordinateAddition = document.getElementById("addCoordinate");
let coordinatesForm = document.getElementById("coordinatesForm");
let generatePDF = document.getElementById("generatePDF");
let saveTemplate = document.getElementById("saveTemplate");

// Module import

const { jsPDF } = require("jspdf");
const DB = require("../js/DB");

// Utility Functions

function showMessage(type, message) {
  const p = document.createElement("p");
  if (type === "error") {
    p.setAttribute("class", "error-message noSelect");
  } else {
    p.setAttribute("class", "success-message noSelect");
  }
  p.innerText = message;
  if (document.getElementById("pdfParent").children[0].hasAttribute("src")) {
    document.getElementById("pdfParent").innerHTML = `<p class="noSelect">
      Please Enter all required details and click generate PDF
    </p>`;
  }
  document.getElementById("pdfParent").appendChild(p);
  setTimeout(() => {
    p.remove();
  }, 2000);
}

// Event Listeners

// Handles addition of new coordinate pairs
CoordinateAddition.addEventListener("click", (e) => {
  console.log("adding coordinate pair fields");
  let row = document.createElement("div");
  row.setAttribute("class", "form-row");
  let label = document.createElement("label");
  label.setAttribute("for", `coordinate${Coordinates + 1}x`);
  label.setAttribute("class", "noSelect");
  label.appendChild(document.createTextNode(`Coordinate-${Coordinates + 1}x`));
  row.appendChild(label);
  let input = document.createElement("input");
  input.setAttribute("type", "number");
  input.setAttribute("id", `coordinate${Coordinates + 1}x`);
  row.appendChild(input);

  let row2 = document.createElement("div");
  row2.setAttribute("class", "form-row");
  let label2 = document.createElement("label");
  label2.setAttribute("for", `coordinate${Coordinates + 1}y`);
  label2.setAttribute("class", "noSelect");
  label2.appendChild(document.createTextNode(`Coordinate-${Coordinates + 1}y`));
  row2.appendChild(label2);
  let input2 = document.createElement("input");
  input2.setAttribute("type", "number");
  input2.setAttribute("id", `coordinate${Coordinates + 1}y`);
  row2.appendChild(input2);
  Coordinates += 1;
  coordinatesForm.appendChild(row);
  coordinatesForm.appendChild(row2);
});

// Handles pdf generation
generatePDF.addEventListener("click", (e) => {
  // Extracting values
  const orientation = document.getElementById("sheetOrientation").value;
  const height = Number(document.getElementById("sheetHeight").value);
  const width = Number(document.getElementById("sheetWidth").value);
  const fontSize = Number(document.getElementById("fontSize").value);
  const dataText = document.getElementById("dataText").value;
  // Error checks
  if (!fontSize || !width || !height || !orientation || !dataText) {
    showMessage("error", "Please ensure to fill all fields");
    return;
  }

  if (Coordinates == 0) {
    showMessage("error", "There must be atleast one coordinate set");
    return;
  }

  for (let i = 0; i < Coordinates; i++) {
    let x = document.getElementById(`coordinate${i + 1}x`).value;
    let y = document.getElementById(`coordinate${i + 1}y`).value;
    if (!x || !y) {
      showMessage("error", "Please ensure all coordinates are filled");
      return;
    }
  }
  // Creating and configuring document
  const doc = new jsPDF({
    orientation: orientation,
    unit: "mm",
    format: [height, width],
  });
  doc.setFont("Times New Roman ");
  doc.setFontSize(fontSize);
  // Inserting data
  for (let i = 0; i < Coordinates; i++) {
    let x = document.getElementById(`coordinate${i + 1}x`).value;
    let y = document.getElementById(`coordinate${i + 1}y`).value;
    console.log(x, y);
    doc.text(dataText, x, y);
  }
  // Generating URI for pdf document
  const uri = window.URL.createObjectURL(doc.output("blob"));
  // Displaying PDF
  document.getElementById(
    "pdfParent"
  ).innerHTML = `<iframe src=${uri}></iframe>`;
});

// Handles saving templates
saveTemplate.addEventListener("click", async () => {
  // Extracting values
  const orientation = document.getElementById("sheetOrientation").value;
  const height = Number(document.getElementById("sheetHeight").value);
  const width = Number(document.getElementById("sheetWidth").value);
  const fontSize = Number(document.getElementById("fontSize").value);
  const name = document.getElementById("templateName").value;
  // Error checks
  if (!fontSize || !width || !height || !orientation) {
    showMessage("error", "Please ensure to fill all fields");
    return;
  }

  if (Coordinates == 0) {
    showMessage("error", "There must be atleast one coordinate set");
    return;
  }
  const coordinatesArr = [];
  for (let i = 0; i < Coordinates; i++) {
    let x = document.getElementById(`coordinate${i + 1}x`).value;
    let y = document.getElementById(`coordinate${i + 1}y`).value;
    if (!x || !y) {
      showMessage("error", "Please ensure all coordinates are filled");
      return;
    }
    coordinatesArr.push({ x, y });
  }
  const { error, message } = await DB.createTemplate({
    name: name,
    document_height: height,
    document_width: width,
    font_size: fontSize,
    document_orientation: orientation,
    coordinates: coordinatesArr,
  });
  if (error) {
    showMessage("error", message);
  } else {
    showMessage("success", message);
  }
});
