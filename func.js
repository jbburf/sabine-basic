//
// UI functions
//

function pageLoad(){
  var maker = decodeURI(getURIParams("mk"));
  var model = decodeURI(getURIParams("md"));
  var version = decodeURI(getURIParams("vr"));
  var makerPassed = (maker !== undefined && maker !== null);
  var modelPassed = (model !== undefined && model !== null);
  var versionPassed = (version !== undefined && version !== null);

  if(makerPassed){
    loadDropDown("inputGroupSelect01",getLEDMakers());
    try{ document.getElementById("inputGroupSelect01").options[getOptionIndex("inputGroupSelect01",maker)].selected = true; }
    catch(err){
      console.log("Failed to set LED maker dropdown: " + err.message);
      makerPassed = false; }
    loadDropDown("inputGroupSelect02",getLEDModels(maker));
  }

  if(modelPassed){
    loadDropDown("inputGroupSelect02",getLEDModels(maker));
    try{ document.getElementById("inputGroupSelect02").options[getOptionIndex("inputGroupSelect02",model)].selected = true; }
    catch(err){
      console.log("Failed to set LED model dropdown: " + err.message);
      modelPassed = false; }
    loadDropDown("inputGroupSelect03",getLEDVersions(model));
  }

  if(versionPassed){
    loadDropDown("inputGroupSelect03",getLEDVersions(model));
    try{ document.getElementById("inputGroupSelect03").options[getOptionIndex("inputGroupSelect03",version)].selected = true; }
    catch(err){
      console.log("Failed to set LED version dropdown: " + err.message);
      versionPassed = false; }
  }

  if(makerPassed && modelPassed && versionPassed) { showLEDInfo(); }
}

function getOptionIndex(elementID,optionValue){
  for(var x in document.getElementById(elementID).options){
    if(document.getElementById(elementID).options[x].value == optionValue){
      return x;
    }
  }
  console.log("Element: \"" + elementID + "\" does not contain an option with value= \"" + optionValue + "\".");
}

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

  var power = roundTo(LEDobj.nom.vf * LEDobj.nom.i/1000,1);
  var efficacy = roundTo(LEDobj.nom.flux / power,0);

  var tableVis = document.getElementById("LED-info");
  if(tableVis.style.display = "none"){ tableVis.style.display = "block";}

  document.getElementById("LEDImage").src = "assets/LED-" + model + ".jpg";
  document.getElementById("partNumber").innerHTML = LEDobj.partNumber;
  document.getElementById("DSLink").href = LEDobj.DSLink;
  document.getElementById("nomPower").innerHTML = LEDobj.nom.vf + " volts, " + LEDobj.nom.i + "mA (" + power + " watts)";
  document.getElementById("nomFlux").innerHTML = LEDobj.nom.flux + " lm";
  document.getElementById("minFlux").innerHTML = LEDobj.min.flux + " lm";
  document.getElementById("TjTc").innerHTML = LEDobj.nom.TjTc;
  document.getElementById("temp").innerHTML = LEDobj.nom.temp[LEDobj.nom.TjTc] + "&#8451;";
  document.getElementById("nomEfficacy").innerHTML = efficacy + " lm/W";

  document.getElementById("tempSource").innerHTML = LEDobj.nom.temp[LEDobj.nom.TjTc] + ": ";
  setSlider("tempSlider",-40,25,125);   // NEED to update this to set slider and toggle based on LED inputs
  setSlider("currentSlider",LEDobj.min.i,LEDobj.nom.i,LEDobj.max.i);
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
  document.getElementById("calcLifeTime").innerHTML = LEDobj.estLifeTime();

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
      this.nom.vf = 0
      this.nom.i = 0;
      this.nom.temp["Tj"] = 25;
      this.nom.flux = 0;
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

      this.now = this.nom;

    // Set Tj based on Tc or Tc based on Tj if full specs are not given
  }

// need recursive function to solve for stats when changing I or Tj

  setCurrent(I){ this.now.i = I; }
  changeCurrent(I){ this.now.i +=I; }
  setTemp(temp){this.now.temp = temp;}
  changeTemp(temp){this.now.temp +=temp;}

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

    this.now.temp[1] = this.nom.temp[1] + vfOffSet;
  }

  vf_of_I(current){
    var vfFactor = 0;
    for(var x of this.vf_of_I){
      vfFactor += this.vf_of_I[x] * Math.pow(current,x);
    }
    return vfFactor;
  }

  estLifeTime(I,temp){
    if(I === undefined) { I = this.non.i; }
    if(temp === undefined) { temp = this.nom.temp };

    return "50,000";
  }

} // end of LED object definition

//
// General functions
//

function getURIParams(param) {
  // from https://www.creativejuiz.fr/blog/en/javascript-en/read-url-get-parameters-with-javascript
  var vars = {};
	window.location.href.replace( location.hash, '' ).replace(
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if ( param ) {
		return vars[param] ? vars[param] : null;
	}
	return vars;
}

function roundTo(number,places){
  return Math.round(number * Math.pow(10,places)) / Math.pow(10,places);
}

function formatInt(int,places){
  // fromat so that 50000 becomes 50,000
  return roundTo(int,places);
}
