class LED {
    constructor(name, model = null, version = null) {
        this.name = name;
        this.model = model;
        this.version = version;
        this.min = {
            vf: 0,
            flux: 0,
            temp: { "Tj": 0, "Tc": 0 }
        };
        this.nom = {
            vf: 0,
            i: 0,
            flux: 0,
            CCT: 0,
            CRI: 0,
            TjTc: "Tj",
            temp: { "Tj": 0, "Tc": 0 }
        };
        this.max = {
            vf: 0,
            i: 0,
            temp: { "Tj": 0, "Tc": 0 }
        };
        this.flux_of_I = {};
        this.flux_of_Tj = {};
        this.vf_of_I = {};
        this.vf_of_Tj = 0;
        this.Rth_of_I = {};
        if (model !== null && version !== null) {
            this.model = model;
            this.version = version;
            Object.assign(this, getVersionAttrs(model, version));
        }
        let tempOffSet = this.Rth(this.nom.i) * (this.nom.i / 1000) * this.nom.vf;
        if (debugFlag) {
            console.log("LED constructor has run.");
        }
        if (this.nom.TjTc == "Tj") {
            if (this.nom.temp["Tj"] === undefined) {
                this.nom.temp["Tj"] = 25;
            }
            this.nom.temp["Tc"] = this.nom.temp["Tj"] + tempOffSet;
        }
        else if (this.nom.TjTc == "Tc") {
            if (this.nom.temp["Tc"] === undefined) {
                this.nom.temp["Tc"] = 60;
            }
            this.nom.temp["Tj"] = this.nom.temp["Tc"] - tempOffSet;
        }
        else {
            console.log("Unexpected value '" + this.nom.TjTc + "', should be either 'Tj' or 'Tc'.");
        }
    }
    setTemp(temp = this.nom.temp[this.nom.TjTc], tempType = this.nom.TjTc) {
        this.now.TjTc = tempType;
        this.now.temp[tempType] = temp;
    }
    setTemps(current = this.now.i, temp = this.now.temp["Tj"], tempType = "Tj") {
        let power = this.setVf(current, temp) * current / 1000;
        let tempOffset = this.Rth(current) * power;
        if (tempType == "Tj") {
            this.now.TjTc = "Tj";
            this.now.temp["Tj"] = temp;
            this.now.temp["Tc"] = temp + tempOffset;
        }
        else if (tempType == "Tc") {
            this.now.TjTc = "Tc";
            this.now.temp["Tc"] = temp;
            this.now.temp["Tj"] = temp - tempOffset;
        }
    }
    setVf(current = this.now.i, temp = this.now.temp[this.now.TjTc], tempType = this.now.TjTc) {
        let vfFactor = 0;
        let vfOffSet = 0;
        vfFactor = this.vf_of_I[1] * Math.log(current) + this.vf_of_I[0];
        vfOffSet += (temp - 25) * this.vf_of_Tj / 1000;
        this.now.vf = this.nom.vf * vfFactor + vfOffSet;
        return this.now.vf;
    }
    fluxFactor(current = this.now.i, Tj = this.now.temp["Tj"]) {
        var fluxFactorI = 0;
        var fluxFactorTemp = 0;
        for (var x in this.flux_of_Tj) {
            fluxFactorTemp += this.flux_of_Tj[x] * Math.pow(Tj, x);
        }
        for (var x in this.flux_of_I) {
            fluxFactorI += this.flux_of_I[x] * Math.pow(current, x);
        }
        return fluxFactorI * fluxFactorTemp;
    }
    Rth(current = this.now.i) {
        let Rth = 0;
        for (let x in this.Rth_of_I) {
            Rth += this.Rth_of_I[x] * Math.pow(current, x);
        }
        return Rth;
    }
    change(name, model, version) {
        this.model = model;
        this.version = version;
        Object.assign(this, getVersionAttrs(model, version));
        let tempOffSet = this.Rth(this.nom.i) * (this.nom.i / 1000) * this.nom.vf;
        if (debugFlag) {
            console.log("LED has been reloaded as model: " + model + ", and version: " + version + ".");
        }
        if (this.nom.TjTc == "Tj") {
            if (this.nom.temp["Tj"] === undefined) {
                this.nom.temp["Tj"] = 25;
            }
            this.nom.temp["Tc"] = this.nom.temp["Tj"] + tempOffSet;
        }
        else if (this.nom.TjTc == "Tc") {
            if (this.nom.temp["Tc"] === undefined) {
                this.nom.temp["Tc"] = 60;
            }
            this.nom.temp["Tj"] = this.nom.temp["Tc"] - tempOffSet;
        }
        else {
            console.log("Unexpected value '" + this.nom.TjTc + "', should be either 'Tj' or 'Tc'.");
        }
    }
    getFlux() {
        return this.now.flux;
    }
    getVf() {
        return this.now.vf;
    }
    getPow() {
        return this.now.vf * this.now.i / 1000;
    }
    calcLED(current = this.nom.i, temp = this.nom.temp["Tj"], tempType = "Tj") {
        console.log("On entering calcLED: ", this.nom);
        this.setTemps(current, temp, tempType);
        console.log("After setTemps: ", this.nom);
        this.setVf(current, temp, tempType);
        console.log("after setVf: ", this.nom);
        console.assert(tempType == "Tj" || tempType == "Tc", "TempType '" + tempType + "' is invalid. Should be 'Tj' or 'Tc'.");
        this.now.flux = this.fluxFactor(current, temp) * this.nom.flux;
        this.now.i = current;
        console.log("On leaving calcLED: ", this.nom);
    }
    estLifeTime(current = this.nom.i, temp = this.nom.temp["Tj"]) {
        if (current === undefined) {
            current = this.nom.i;
        }
        if (temp === undefined) {
            temp = this.nom.temp;
        }
        ;
        return "50000";
    }
}
//# sourceMappingURL=out.js.map