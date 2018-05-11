//
// UI functions
//

function loadDropDown(dropDownId, contents){
  var targetDropDown = document.getElementById(dropDownId);

  clearDropDown(dropDownId);

// Add original option back, "Choose..."
  var newOption = document.createElement("option");
  newOption.text = "Choose...";
  newOption.selected = true;
  newOption.disabled = true;
  targetDropDown.add(newOption);

// loop to add all elements to dropdown based on original dropdown input
  for (var x in contents) {
    var newOption = document.createElement("option");
    newOption.text = contents[x];
    newOption.value = contents[x];
    targetDropDown.add(newOption);
    }
}

function dropDownSelection(dropDownId){
  return document.getElementById(dropDownId).value;
}

function clearDropDown(dropDownId){
  var dropDown = document.getElementById(dropDownId);

  for (var x in dropDown) {
    dropDown.remove(x);
  }
}

function changeBSProgressBar(progressBarId, newValue){
  $('#' + progressBarId).width(newValue + "%").attr("aria-valuenow", newValue);
}

function setSlider(sliderID, min, current, max){
  var slider = document.getElementById(sliderID);

  document.getElementById(sliderID + "Value").innerHTML = current;

  slider.min = min;
  slider.value = current;
  slider.max = max;
}

function showLEDInfo(){
  var model = document.getElementById("inputGroupSelect02").value;
  var version = document.getElementById("inputGroupSelect03").value;

  LEDobj = new LED("LED1",model,version);

  var power = roundTo(LEDobj.nomVf * LEDobj.nomCurrent/1000,1);
  var efficacy = roundTo(LEDobj.nomFlux / power,0);

  var tableVis = document.getElementById("LED-info");
  if(tableVis.style.display = "none"){ tableVis.style.display = "block";}

  document.getElementById("LEDImage").src = "assets/LED-" + model + ".jpg";
  document.getElementById("partNumber").innerHTML = LEDobj.partNumber;
  document.getElementById("DSLink").href = LEDobj.DSLink;
  document.getElementById("nomPower").innerHTML = LEDobj.nomVf + " volts, " + LEDobj.nomCurrent + "mA (" + power + " watts)";
  document.getElementById("nomFlux").innerHTML = LEDobj.nomFlux + " lm";
  document.getElementById("minFlux").innerHTML = LEDobj.minFlux + " lm";
  document.getElementById("TjTc").innerHTML = LEDobj.TjTc;
  document.getElementById("temp").innerHTML = LEDobj.temp + "&#8451;";
  document.getElementById("nomEfficacy").innerHTML = efficacy + " lm/W";

  document.getElementById("tempSource").innerHTML = LEDobj.TjTc + ": ";
  setSlider("tempSlider",-40,25,125);
  setSlider("currentSlider",LEDobj.minCurrent,LEDobj.nomCurrent,LEDobj.maxCurrent);
}

function calcResults(){
  LEDobj.tempNow = document.getElementById("tempSlider").value;
  LEDobj.currentNow = document.getElementById("currentSlider").value;

  var flux = currentToFlux(LEDobj.currentNow) * TjToFlux(LEDobj.tempNow) * LEDobj.nomFlux;
  var vf = currentToVf(LEDobj.currentNow) * TjToVf(LEDobj.tempNow, LEDobj.nomVf);
  var power = vf * LEDobj.currentNow/1000;
  document.getElementById("calcFlux").innerHTML = roundTo(flux,-1);
  document.getElementById("calcPower").innerHTML = roundTo(power,1);
  document.getElementById("calcEfficacy").innerHTML = roundTo(flux/power,1);
  document.getElementById("calcLifeTime").innerHTML = "some hours...";

  console.log("Flux(I): " + roundTo(currentToFlux(LEDobj.currentNow),3) + ", Flux(Tj): " + roundTo(TjToFlux(LEDobj.tempNow),3) + ", Vf: " + vf + ", I: " + LEDobj.currentNow);
}

//
// LED Object
//

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
      this.nomVf = 0
      this.nomI = 0;
      this.nomTemp = 25;
      this.notLum = 0;
      this.nomPow = 0;
      this.flux_of_I = 0;
      this.flux_of_Tj_C = 0;
      this.vf_of_I_C = 0;
      this.vf_of_Tj_C = 0;
      this.Rth_of_I = 0;
    }
    else{
      temp = getVersionAttrs(model,version);
      for(var x in temp){ this[x] = temp[x]; }
    }
    this.current = this.nomI;
    this.vf = this.nomVf;
    this.temp = this.nomTemp;
  }

// need recursive function to solve for stats when changing I or Tj

  setCurrent(I){ this.current = I; }
  changeCurrent(I){ this.current +=I; }
  setTemp(temp){this.temp = temp;}
  changeTemp(temp){this.temp +=temp;}

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

  flux_of_Tj(temp){
    var fluxFactor = 0;
    for(var x of this.flux_of_Tj){
      fluxFactor += this.flux_of_Tj[x] * Math.pow(temp,x);
    }
    return fluxFactor;
  }

  flux_of_I(current){
    var fluxFactor = 0;
    for(var x of this.flux_of_I){
      fluxFactor += this.flux_of_I[x] * Math.pow(current,x);
    }
    return fluxFactor;
  }

  vf_of_Tj(temp){
    var vfOffSet = 0;
    for(var x of this.vf_to_Tj){
      vfOffSet += this.vf_of_Tj[x] * Math.pow(temp,x);
    }

    this.temp = this.nomTemp + vfOffSet
  }

  vf_of_I(current){
    var vfFactor = 0;
    for(var x of this.vf_of_I){
      vfFactor += this.vf_of_I[x] * Math.pow(current,x);
    }
    return vfFactor;
  }
} // end of LED object definition

//
// General functions
//

function roundTo(number,places){
  return Math.round(number * Math.pow(10,places)) / Math.pow(10,places);
}
