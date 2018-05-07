// https://stackoverflow.com/questions/7627161/get-id-of-element-that-called-a-function

// simplified utility function to register an event handler cross-browser
function setEventHandler(obj, name, fn) {
// Inputs: element ID, event name, function to execute
    if (typeof obj == "string") {
        obj = document.getElementById(obj);
    }
    if (obj.addEventListener) {
        return(obj.addEventListener(name, fn));
    } else if (obj.attachEvent) {
        return(obj.attachEvent("on" + name, function() {return(fn.call(obj));}));
    }
}

// register your event handler

// Populate LED Models once LED Make has been selected
setEventHandler("inputGroupSelect01","change",function () {loadDropDown('inputGroupSelect02',getLEDModels(dropDownSelection('inputGroupSelect01')))});

// Populate LED Versions once LED Make has been selected
setEventHandler("inputGroupSelect02","change",function () {loadDropDown('inputGroupSelect03',getLEDVersions(dropDownSelection('inputGroupSelect02')))});

// Populate LED info section once LED Version has been selected
setEventHandler("inputGroupSelect03","change",function () {alert("LED Version changed!")});
