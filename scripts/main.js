// Setup the things the program will always need to know about
const zoneListReader = document.getElementById("zoneListReader");
zoneListReader.addEventListener("change", onZoneRead);
const previewOfImport = document.getElementById("previewOfImport");
const approveImportBTN = document.getElementById("approveImportBTN");
approveImportBTN.addEventListener("click", onApproveImportPressed);

// Stores the read data
let readData = []

function onZoneRead()
{
  // Safety check to do nothing if there is no file
  let files = zoneListReader.files;
  readData  = [];
  if (files.length == 0)
  {
    return;
  }
  previewOfImport.replaceChildren();
  let file = files[0];
  let fr = new FileReader();
  fr.onload = function(event) {
    parseAsCSV(event.target.result);
  }
  fr.readAsText(file);
  console.log("main :: Zone properly read!");
}

function parseAsCSV(data)
{
  // Display the text in the browser
  let csvText = data;
  previewOfImport.textContent = data;
  
  // TODO: Extract the text
}

function onApproveImportPressed()
{
  console.log('main :: Approve Import pressed!');
}