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

    if(LEDMaker[maker] == undefined){
      console.log("LED Maker \"" + maker + "\" does not have any models...")
    }
    else{
      return LEDMaker[maker].split(",");
    }
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

function getNomVf(LEDModel){
  var nomVf = {CXA1310:"500",CXA1520:"1000",CXA1850:"1500",CXA2590:"1800",CXA3050:"3000",CXA3590:"4000",CLU028:"1200",CLU038:"2000",CLU048:"2500",CLU058:"3500","NJCWS024Z-V1":"800","NVCWL024Z-V1":"1500","NVEWJ048Z-V1":"2300","Vero 10":"1200","Vero 13":"2000","Vero 18":"3000","Vero 29":"4000"};
}

function getNomI(LEDModel){

}
function getNomFlux(LEDModel){
  var nomFlux = {CXA1310:"500",CXA1520:"1000",CXA1850:"1500",CXA2590:"1800",CXA3050:"3000",CXA3590:"4000",CLU028:"1200",CLU038:"2000",CLU048:"2500",CLU058:"3500","NJCWS024Z-V1":"800","NVCWL024Z-V1":"1500","NVEWJ048Z-V1":"2300","Vero 10":"1200","Vero 13":"2000","Vero 18":"3000","Vero 29":"4000"};

  return nomFlux[LEDModel] + " lumens";
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
