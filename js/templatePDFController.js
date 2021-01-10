// HTML Mappings

let generatePDF = document.getElementById("generatePDF");

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
window.addEventListener("DOMContentLoaded", () => {
  (async function () {
    const select = document.getElementById("templateName");
    const templates = await DB.fetchTemplatesList();
    templates.forEach((template) => {
      const option = document.createElement("option");
      option.setAttribute("value", template.name);
      option.appendChild(document.createTextNode(template.name));
      select.appendChild(option);
    });
  })();
});

// Event Listeners

// Handles pdf generation
generatePDF.addEventListener("click", async (e) => {
  // Extracting values
  const dataText = document.getElementById("dataText").value;
  const templateName = document.getElementById("templateName").value;
  // Error checks
  if (!dataText) {
    showMessage("error", "Please ensure to fill Label Text");
    return;
  }
  const template = (await DB.fetchTemplateByName(templateName))[0];

  // Creating and configuring document
  const doc = new jsPDF({
    orientation: template.document_orientation,
    unit: "mm",
    format: [template.document_height, template.document_width],
  });
  doc.setFontSize(template.font_size);
  const coordinatesArr = JSON.parse(template.coordinates);
  // Inserting data
  for (let coordinate of coordinatesArr) {
    let { x, y } = coordinate;
    doc.text(dataText, x, y);
  }
  // Generating URI for pdf document
  const uri = window.URL.createObjectURL(doc.output("blob"));
  // Displaying PDF
  document.getElementById(
    "pdfParent"
  ).innerHTML = `<iframe src=${uri}></iframe>`;
});
