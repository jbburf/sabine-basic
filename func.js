

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

function showLEDInfo(){
  var model = document.getElementById("inputGroupSelect02").value;
  var version = document.getElementById("inputGroupSelect03").value;

  LEDobj = getVersionAttrs(model,version);

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

  setSlider("tempSlider",-40,25,125);
  setSlider("currentSlider",LEDobj.minCurrent,LEDobj.nomCurrent,LEDobj.maxCurrent);
}

function setSlider(sliderID, min, current, max){
  var slider = document.getElementById(sliderID);

  slider.min = min;
  slider.value = current;
  slider.max = max;
}

function roundTo(number,places){
  return Math.round(number * Math.pow(10,places)) / Math.pow(10,places);
}

function changeBSProgressBar(progressBarId, newValue){
  $('#' + progressBarId).width(newValue + "%").attr("aria-valuenow", newValue);
}
