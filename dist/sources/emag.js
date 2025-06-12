"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmagSource = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
class EmagSource {
    canHandle(url) {
        return url.includes('emag.bg');
    }
    async scrape(url) {
        const browser = await puppeteer_1.default.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const name = await page.$eval('h1', el => el.textContent?.trim() || '');
        const price = await page.$eval('.product-new-price', el => el.textContent?.trim() || '');
        const images = await page.$$eval('.product-gallery-image img', imgs => imgs.map(img => img.src));
        await browser.close();
        return { url, name, price, images };
    }
}
exports.EmagSource = EmagSource;
