import { Product, ProductSource } from '../interfaces/product';
import puppeteer from 'puppeteer';

export class TechnopolisSource implements ProductSource {
  canHandle(url: string) {
    return url.includes('technopolis.bg');
  }

  async scrape(url: string): Promise<Product> {
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    try {
      // Set a common user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36');

      await page.goto(url, { 
        waitUntil: 'networkidle0', 
        timeout: 60000 
      });
      
      // Wait for any element that's guaranteed to be on the page
      await page.waitForSelector('body', { timeout: 10000 });
      
      // Add a small delay to let dynamic content load
      await page.waitForTimeout(2000);

      // Extract product details using evaluate to handle potential missing elements
      const { name, price, images } = await page.evaluate(() => {
        const nameEl = document.querySelector('h1');
        const priceEl = document.querySelector('.price-value, .product-price .price');
        const imageEls = Array.from(document.querySelectorAll('.product-gallery img, .swiper-slide img'));

        const imageUrls = imageEls
          .map(img => img.getAttribute('src') || img.getAttribute('data-src'))
          .filter((src): src is string => src !== null && !src.includes('placeholder'))
          .map(src => src.startsWith('//') ? `https:${src}` : src);

        return {
          name: nameEl?.textContent?.trim() || '',
          price: priceEl?.textContent?.trim().replace(/[^\d.,]/g, '') || '',
          images: imageUrls
        };
      });

      return { url, name, price, images };
    } catch (error) {
      console.error(`Error scraping Technopolis product: ${url}`, error);
      throw error;
    } finally {
      await browser.close();
    }
  }
}
