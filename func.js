function loadDropDown2(){
  var x = document.getElementById("inputGroupSelect02");

  var option1 = document.createElement("option");
  option1.text = "LED1";
  option1.value = "LED01";

  x.add(option1);
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
