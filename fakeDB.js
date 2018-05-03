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

function getNomFlux(LEDModel){
  return 1000;
}
// https://javascript.info/class
class LED {

  constructor(name){
    this.name = name;
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
