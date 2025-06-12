const puppeteer = require('puppeteer');

async function inspect() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('https://www.technopolis.bg/bg/Elektricheski-skuteri-trotinetki/Elektricheski-skuter-trotinetka-SEGWAY-KICK-SCOOTER-ZT3-PRO-E/p/303087', 
            { waitUntil: 'networkidle0', timeout: 30000 });
        
        // Get product name
        const name = await page.evaluate(() => {
            const nameEl = document.querySelector('.product-page h1');
            return nameEl ? nameEl.textContent : null;
        });
        console.log('Name selector found:', name);

        // Get price
        const price = await page.evaluate(() => {
            const priceEl = document.querySelector('.product-price .price');
            return priceEl ? priceEl.textContent : null;
        });
        console.log('Price found:', price);

        // Get images
        const images = await page.evaluate(() => {
            const imageEls = document.querySelectorAll('.swiper-slide img');
            return Array.from(imageEls).map(img => img.src);
        });
        console.log('Images found:', images);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
}

inspect();
