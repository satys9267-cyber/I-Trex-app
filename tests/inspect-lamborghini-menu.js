const { chromium } = require('playwright');

(async () => {
    try {
        const browser = await chromium.launch({ channel: 'msedge', headless: true });
        const page = await browser.newPage();
        await page.goto('https://www.lamborghini.com/en-en', { waitUntil: 'domcontentloaded', timeout: 35000 });
        await page.waitForTimeout(2000);
        
        // Remove cookie overlays if present
        await page.evaluate(() => {
            const ot = document.getElementById('onetrust-consent-sdk');
            if (ot) ot.remove();
            const dark = document.querySelector('.onetrust-pc-dark-filter');
            if (dark) dark.remove();
        });

        // Click MENU button
        const menuBtn = await page.getByText('MENU', { exact: false }).first();
        if (menuBtn) {
            console.log('Clicking MENU button...');
            await menuBtn.click({ force: true });
            await page.waitForTimeout(2000);
            await page.screenshot({ path: 'tests/lamborghini-menu-open.png' });
            console.log('Saved tests/lamborghini-menu-open.png');
        } else {
            console.log('Menu button not found');
        }
        await browser.close();
    } catch (e) {
        console.error('Error:', e.message);
    }
})();
