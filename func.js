

function loadDropDown2(){
  var selection2 = document.getElementById("inputGroupSelect02");
  var selection1 = document.getElementById("inputGroupSelect01").value;

  clearDropDown("inputGroupSelect02");
  // https://stackoverflow.com/questions/1144705/best-way-to-store-a-key-value-array-in-javascript
  var LEDMaker = {
    Cree: "CXA1310,CXA1520,CXA1850,CXA2590,CXA3050,CXA3590",
    Citizen: "CLU028,CLU038,CLU048,CLU058",
    Nichia: "NJCWS024Z-V1,NVCWL024Z-V1,NVEWJ048Z-V1",
    Bridgelux: "Vero 10,Vero 13,Vero 18,Vero 29" }

  var options2 = LEDMaker[selection1].split(",");
// Add original option back
  var option1 = document.createElement("option");
  option1.text = "Choose...";
  option1.selected = true;
  selection2.add(option1);

// loop to add all elements to dropdown based on original dropdown input
  for (var x in options2) {
    var option1 = document.createElement("option");
    option1.text = options2[x];
    option1.value = options2[x];
    selection2.add(option1);
    }
}

function clearDropDown(dropDownId){
  var dropDown = document.getElementById(dropDownId);

  for (var x in dropDown) {
    dropDown.remove(x);
  }
}

function changeProgressBar(progressBarId, newValue){
  $('#' + progressBarId).width(newValue + "%").attr("aria-valuenow", newValue);
}

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
