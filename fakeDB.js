// Postgres info Below
// Username: sabine
// Password: QBegumWGEWFeQsEaRNCf7trp

function getLEDMakers(){
  var makers = ["Cree","Citizen","Nichia","Bridgelux","Sharp"];
  return makers;
}

function getLEDModels(maker){
  // https://stackoverflow.com/questions/1144705/best-way-to-store-a-key-value-array-in-javascript
  var LEDMaker = {
    Cree: "CXA1310,CXA1520,CXA1850,CXA2590,CXA3050,CXA3590",
    Citizen: "CLU028,CLU038,CLU048,CLU058",
    Nichia: "NJCWS024Z-V1,NVCWL024Z-V1,NVEWJ048Z-V1",
    Bridgelux: "Vero 10,Vero 13,Vero 18,Vero 29" }

    if(LEDMaker[maker] === undefined){
      console.log("LED Maker \"" + maker + "\" does not have any models...")
    }
    else{
      return LEDMaker[maker].split(",");
    }
}

function getLEDVersions(model){
  var LEDModels = {
    "Vero 13": "3000K, 80CRI<,>4000K, 80CRI" }

    if(LEDModels[model] === undefined){
      console.log("LED Model \"" + model + "\" does not have any versions...");
    }
    else{
      return LEDModels[model].split("<,>");
    }
}

function getVersionAttrs(model,version){
  var versions = {
    "3000K, 80CRI": {
      modelID:"1",partNumber:"BXRC-30E4000-B-7x",DSLink:"https://www.bridgelux.com/sites/default/files/resource_media/Bridgelux%20DS92%20Vero%2018%20Gen%207%20Array%20Data%20Sheet%2020180403%20Rev%20L.pdf",nomVf:34.8,minVf:32.2,maxVf:37.4,nomCurrent:900,minCurrent:90,maxCurrent:1800,nomFlux:5000,minFlux:4500,CCT:3000,nomCRI:80,typCRI:80,TjTc:"Tj",temp:25},
    "4000K, 80CRI": {}}

    return versions[version];
}

function LEDobj(LEDModel,Version){

  var LEDVersions = {
  "Vero 10": {
    "27E":"2700K, 80CRI","30E":"3000K, 80 CRI","40E":"4000K, 80 CRI","50C":"5000K, 70 CRI"},
  "Vero 13": {
    "27E":"2700K, 80CRI","30E":"3000K, 80 CRI","40E":"4000K, 80 CRI","50C":"5000K, 70 CRI"},
  "Vero 18": {
    "27E":"2700K, 80CRI","30E":"3000K, 80 CRI","40E":"4000K, 80 CRI","50C":"5000K, 70 CRI"},
  "Vero 29": {
    "27E":"2700K, 80CRI","30E":"3000K, 80 CRI","40E":"4000K, 80 CRI","50C":"5000K, 70 CRI"}
  };

  var versions = LEDVersions[LEDModel];
  console.log("Versions are: " + versions);

  return "LEDobj function has run.";
}
// https://javascript.info/class
class LED {

  constructor(name){
    this.name = name;
    this.nomVf = 0
    this.nomI = 0;
    this.notLum = 0;
    this.nomPow = 0;
  }

  getLum(current, temp){
  // return lumens based on current and temperature
    return 0;
  }

  getVf(current, temp){
  // return voltage based on current and temperature
      return 0;
  }

  getPow(current, temp){
    return getVf(current, temp) * current;
  }
}
