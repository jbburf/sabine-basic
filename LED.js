/*
 *  LED Object Class Definition
 */

class LED {
// https://javascript.info/class
  constructor(name,model,version){
    // create optional parameters to set basic values
    this.name = name;
    this.model = model;
    this.version = version;

    if(model === undefined || version === undefined){
      this.make = "";
      this.model = "";
      this.version = "";
      this.nom.vf = 0
      this.nom.i = 0;
      this.nom.TjTc = "Tj";
      this.nom.temp["Tj"] = 25;
      this.nom.flux = 0;
      this.flux_of_I = 0;
      this.flux_of_Tj_C = 0;
      this.vf_of_I_C = 0;
      this.vf_of_Tj_C = 0;
      this.Rth_of_I = 0; }
    else{
      Object.assign(this, getVersionAttrs(model,version)); }

    // Add validation to check that values are not stored as strings

    // Set Tj based on Tc or Tc based on Tj if full specs are not given
    let tempOffSet = this.Rth(this.nom.i) * (this.nom.i/1000) * this.nom.vf;

    if(debugFlag){ console.log("LED constructor has run."); }

    if(this.nom.TjTc == "Tj"){
      if(this.nom.temp["Tj"] === undefined){ this.nom.temp["Tj"] = 25; }
      this.nom.temp["Tc"] = this.nom.temp["Tj"] + tempOffSet; }
    else if (this.nom.TjTc == "Tc") {
      if(this.nom.temp["Tc"] === undefined){ this.nom.temp["Tc"] = 60; }
      this.nom.temp["Tj"] = this.nom.temp["Tc"] - tempOffSet; }
    else{ console.log("Unexpected value '" + this.nom.TjTc + "', should be either 'Tj' or 'Tc'."); }
  }

// need recursive function to solve for stats when changing I or Tj

  getFlux(){
  // return lumens based on current and temperature
    return this.now.flux;
  }

  getVf(){
  // return voltage based on current and temperature
    return this.now.vf;
  }

  getPow(){
    return this.now.vf * this.now.i / 1000;
  }

  calcLED(current = this.nom.i, temp = this.nom.temp["Tj"], tempType = "Tj"){
    console.log("On entering calcLED: ", this.nom);
    this.setTemps(current, temp, tempType);
    console.log("After setTemps: ", this.nom);
    this.setVf(current, temp, tempType);
    console.log("after setVf: ", this.nom);

    console.assert(tempType == "Tj" || tempType == "Tc", "TempType '" + tempType + "' is invalid. Should be 'Tj' or 'Tc'.");

    this.now.flux = this.fluxFactor(current, this.now.temp["Tj"]) * this.nom.flux;
    this.now.i = current;
    console.log("On leaving calcLED: ", this.nom);
  }

  setTemps(current = this.now.i, temp = this.now.temp["Tj"], tempType = "Tj"){

    let power = this.setVf(current, temp) * current / 1000;
    let tempOffset = this.Rth(current) * power;

    if(tempType == "Tj"){ this.now.temp["Tc"] = this.now.temp["Tj"] + tempOffset; }
    else if (tempType == "Tc"){ this.now.temp["Tj"] = this.now.temp["Tc"] - tempOffset; }
}


  setVf(current = this.now.i, temp = this.now.temp["Tj"]){
    let vfFactor = 0;
    let vfOffSet = 0;

      vfFactor = this.vf_of_I[1] * Math.log(current) + this.vf_of_I[0];

    for(var x in this.vf_to_Tj){
      vfOffSet += this.vf_of_Tj[x] * Math.pow(temp,x); }

    this.now.vf = this.nom.vf * vfFactor + vfOffSet;

    return this.now.vf;
  }

  fluxFactor(current = this.now.i, Tj = this.now.temp["Tj"]){
    var fluxFactorI = 0;
    var fluxFactorTemp = 0;

    for(var x in this.flux_of_Tj){
      fluxFactorTemp += this.flux_of_Tj[x] * Math.pow(Tj,x); }

    for(var x in this.flux_of_I){
      fluxFactorI += this.flux_of_I[x] * Math.pow(current,x); }

    return fluxFactorI * fluxFactorTemp;
  }

  Rth(current = this.now.i){
    let Rth = 0;

    for(let x in this.Rth_of_I){
      Rth += this.Rth_of_I[x] * Math.pow(current,x); }

    return Rth;
  }

  estLifeTime(current = this.nom.i,temp = this.nom.temp["Tj"]){
    if(current === undefined) { current = this.nom.i; }
    if(temp === undefined) { temp = this.nom.temp };

    return "50000";
  }
} // end of LED object definition
