const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    const mobileWidths = [360, 375, 390, 400, 412, 430];

    console.log('Testing Mobile Header Across Real Mobile Viewports:\n');
    let allPassed = true;

    for (const width of mobileWidths) {
        const page = await browser.newPage({ viewport: { width, height: 750 } });
        await page.goto('http://localhost:10000/index.html', { waitUntil: 'domcontentloaded' });
        const skipBtn = await page.$('#skip-intro-btn');
        if (skipBtn) await skipBtn.click().catch(() => {});
        await page.waitForTimeout(400);

        const logoBox = await page.locator('#main-header a[href="#home"] img').boundingBox();
        const btnBox = await page.locator('#main-header a[href="#contact"]').boundingBox();
        const menuBox = await page.locator('#main-header #menu-toggle-btn').boundingBox();

        const menuRight = menuBox.x + menuBox.width;
        const logoLeft = logoBox.x;
        const logoRight = logoBox.x + logoBox.width;
        const btnLeft = btnBox.x;

        const leftSpace = logoLeft - menuRight;
        const rightSpace = btnLeft - logoRight;

        const isColliding = leftSpace < 10 || rightSpace < 10;
        if (isColliding) allPassed = false;

        console.log(`[Width ${width}px]`);
        console.log(`  Menu: [${menuBox.x.toFixed(0)} - ${menuRight.toFixed(0)}] | Logo: [${logoLeft.toFixed(0)} - ${logoRight.toFixed(0)}] | Btn: [${btnLeft.toFixed(0)} - ${(btnBox.x + btnBox.width).toFixed(0)}]`);
        console.log(`  Left Clearance: ${leftSpace.toFixed(1)}px | Right Clearance: ${rightSpace.toFixed(1)}px`);
        console.log(`  Status: ${isColliding ? '❌ COLLISION DETECTED!' : '✅ PERFECT SPACING'}\n`);

        await page.screenshot({ path: `tests/evidence/evidence-header-${width}px.png` });
        await page.close();
    }

    await browser.close();

    if (!allPassed) {
        console.error('FAIL: Header items collided on one or more viewports!');
        process.exit(1);
    } else {
        console.log('====================================================');
        console.log('ALL MOBILE VIEWPORTS PASSED WITH ZERO COLLISION!');
        console.log('====================================================');
    }
})();
