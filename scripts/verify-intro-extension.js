const { chromium } = require('playwright');

(async () => {
    console.log('Verifying exact +3.0s intro animation in Chrome...');
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('http://localhost:10000/index.html');
    
    // Check at 2.0s: preloader is active
    await page.waitForTimeout(2000);
    const isVisibleAt2s = await page.$eval('#intro-preloader', el => el && window.getComputedStyle(el).opacity !== '0');
    console.log('Intro preloader visible at 2.0s:', isVisibleAt2s);

    // Check at 4.0s: preloader is still active (during the +3s extension!)
    await page.waitForTimeout(2000);
    const isVisibleAt4s = await page.$eval('#intro-preloader', el => el && window.getComputedStyle(el).opacity !== '0');
    console.log('Intro preloader visible at 4.0s (extended +3s phase):', isVisibleAt4s);

    // Check at 6.0s: preloader has dissolved cleanly and unmounted
    await page.waitForTimeout(2200);
    const isGoneAt6s = (await page.$('#intro-preloader')) === null;
    console.log('Intro preloader unmounted cleanly after ~5.6s - 6.0s:', isGoneAt6s);

    console.log('Console errors:', consoleErrors.length);
    await browser.close();

    if (isVisibleAt2s && isVisibleAt4s && isGoneAt6s && consoleErrors.length === 0) {
        console.log('✓ INTRO TIME EXTENSION VERIFICATION SUCCEEDED');
    } else {
        console.error('✗ Unexpected verification result');
        process.exit(1);
    }
})();
