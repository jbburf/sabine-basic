

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

function showLEDInfo(callingElement){
  var LEDName = document.getElementById("inputGroupSelect02").value;

  document.getElementById("LED-info").style.display = "block";
  document.getElementById("LEDImage").src = "assets/LED-" + LEDName + ".jpg";
  document.getElementById("inputVoltage").innerHTML = "24 volts";
  document.getElementById("nomCurrent").innerHTML = "1500 mA";
  document.getElementById("nomFlux").innerHTML = getNomFlux(LEDName);

}

function changeBSProgressBar(progressBarId, newValue){
  $('#' + progressBarId).width(newValue + "%").attr("aria-valuenow", newValue);
}
