"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UDomesticHubConfig = void 0;
const Circuits_1 = require("../Circuits");
class UDomesticHubConfig extends Circuits_1.UniCircuit {
    constructor() {
        super(...arguments);
        this.port = 47979;
    }
    get clientId() {
        return `circuitBenchView|${Circuits_1.Motherboard.workspace}`;
    }
}
exports.UDomesticHubConfig = UDomesticHubConfig;
