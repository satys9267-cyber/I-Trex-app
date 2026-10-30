const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:10000/index.html', { waitUntil: 'domcontentloaded' });
    
    // Dismiss preloader
    const skip = await page.$('#skip-intro-btn');
    if (skip) await skip.click();

    // Wait 2.5s for complete GSAP animation to settle
    await page.waitForTimeout(2500);

    const chars = await page.$$eval('.hero-word-char', els => els.map(e => ({
        text: e.innerText,
        opacity: window.getComputedStyle(e).opacity,
        transform: window.getComputedStyle(e).transform,
        display: window.getComputedStyle(e).display
    })));
    console.log('Hero words state after animation:', chars);

    await page.screenshot({ path: 'tests/evidence-hero-animated-words.png' });
    console.log('Saved tests/evidence-hero-animated-words.png');

    await browser.close();
})();
