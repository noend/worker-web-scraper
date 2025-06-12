"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSourceFactory = void 0;
const emag_1 = require("./emag");
const technopolis_1 = require("./technopolis");
class ProductSourceFactory {
    constructor() {
        this.sources = [new emag_1.EmagSource(), new technopolis_1.TechnopolisSource()];
    }
    getSource(url) {
        return this.sources.find(source => source.canHandle(url));
    }
}
exports.ProductSourceFactory = ProductSourceFactory;
