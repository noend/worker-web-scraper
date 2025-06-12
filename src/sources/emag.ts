import { Product, ProductSource } from '../interfaces/product';
import puppeteer from 'puppeteer';

export class EmagSource implements ProductSource {
  canHandle(url: string) {
    return url.includes('emag.bg');
  }
  async scrape(url: string): Promise<Product> {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const name = await page.$eval('h1', el => el.textContent?.trim() || '');
    const price = await page.$eval('.product-new-price', el => el.textContent?.trim() || '');
    const images = await page.$$eval('.product-gallery-image img', imgs => imgs.map(img => img.src));
    await browser.close();
    return { url, name, price, images };
  }
}
