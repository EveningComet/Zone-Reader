import { Account } from "./account.js";

// Setup the things the program will always need to know about
const hideDisplayStyle = "none";

const useTestZonesBTN = document.getElementById("useTestZonesBTN");
useTestZonesBTN.addEventListener("click", onUseTestZonesBTNPressed);
const zoneListReader = document.getElementById("zoneListReader");
zoneListReader.addEventListener("change", onZoneRead);
const importPreviewDisplayer = document.getElementById("importPreviewDisplayer");
const originalImportPreviewDisplayerStyle = importPreviewDisplayer.style.display;
importPreviewDisplayer.style.display = hideDisplayStyle;
const importPreviewContainer = document.getElementById("importPreviewContainer");
const approveImportBTN = document.getElementById("approveImportBTN");
approveImportBTN.addEventListener("click", onApproveImportPressed);
const originalApproveImportBTNStyle = approveImportBTN.style.display;
approveImportBTN.style.display = hideDisplayStyle;
const outputtedZonesDisplayer = document.getElementById("outputtedZonesDisplayer");
const originalOutputtedZonesContainerStyle = outputtedZonesDisplayer.style.display;
outputtedZonesDisplayer.style.display = hideDisplayStyle;

// Stores the read data
let tempZones = {};

// Setup the test account
let testAccount = new Account();

window.onload = onSetup;

function onSetup()
{
  // Setup the test account
  testAccount.name = "Komaeda's Bagels";
  document.getElementById("accountName").textContent = testAccount.name;
}

async function onUseTestZonesBTNPressed()
{
  preZoneReadCleanup();
  let testZones = await fetch("/data/test-account-cid.csv")
    .then(response => {
      return response.text();
  })
  prepareForImport();
  parseAsCSV(testZones);
}

function preZoneReadCleanup()
{
  tempZones = {};
  outputtedZonesDisplayer.style.display = hideDisplayStyle;
  importPreviewContainer.replaceChildren();
  importPreviewDisplayer.style.display = hideDisplayStyle;
  approveImportBTN.style.display = hideDisplayStyle;
}

function onZoneRead()
{
  // Safety check to do nothing if there is no file
  let files = zoneListReader.files;
  preZoneReadCleanup();
  if (files.length == 0)
  {
    return;
  }
  let file = files[0];
  let fr = new FileReader();
  fr.onload = function(event) {
    parseAsCSV(event.target.result);
  }
  fr.readAsText(file);
  prepareForImport();
  console.log("main :: Zone properly read!");
}

function prepareForImport()
{
  importPreviewDisplayer.style.display = originalImportPreviewDisplayerStyle;
  approveImportBTN.style.display = originalApproveImportBTNStyle;
}

function parseAsCSV(data)
{
  // Display the text in the browser
  let csvText = data;
  importPreviewContainer.textContent = csvText;
  
  // Convert that csv into readable data and then into a dictionary
  let results = Papa.parse(csvText, 
  {
    header: true, // TODO: Variable for treating the first row
    skipEmptyLines: true,
  });
  
  results.data.forEach(row =>
  {
    tempZones[row["zoneId"]] = row["description"];

  });
}

function onApproveImportPressed()
{
  console.log('main :: Approve Import pressed!');

  // Set the data
  testAccount.zones.clear();
  for(const [key, value] of Object.entries(tempZones))
  {
      testAccount.zones.set(key, value);
  }
  
  // Display the data
  outputtedZonesDisplayer.style.display = originalOutputtedZonesContainerStyle;
  let zonesContainer = document.getElementById("outputtedZonesContainer");
  zonesContainer.replaceChildren();
  for(const key of testAccount.zones.keys())
  {
    let ul = document.createElement("ul");
    ul.textContent = key + ": " + testAccount.zones.get(key);
    zonesContainer.appendChild(ul);
  }
}