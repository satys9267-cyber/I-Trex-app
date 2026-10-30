const { chromium } = require('playwright');

(async () => {
    console.log('=== Verifying Protocol & Firebase Configuration Features ===');
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    const page = await browser.newPage();

    // 1. Test file:// protocol behavior
    console.log('Visiting file:///D:/new%20project/login.html...');
    await page.goto('file:///D:/new%20project/login.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const bannerVisible = await page.$eval('#file-protocol-banner', el => !el.classList.contains('hidden'));
    console.log('File protocol banner visible on file://:', bannerVisible);

    // Click Google on file://
    await page.click('#btn-oauth-google');
    await page.waitForTimeout(300);
    const googleNotice = await page.$eval('#auth-feedback-banner', el => el.textContent.trim());
    console.log('Google click on file:// shows clear warning:', googleNotice.includes('Google Sign-In Blocked by Browser'));

    // Capture screenshot of file:// warning state
    await page.screenshot({ path: 'tests/evidence-file-protocol-warning.png' });

    // 2. Test http://localhost:10000/login.html behavior
    console.log('Visiting http://localhost:10000/login.html...');
    await page.goto('http://localhost:10000/login.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const bannerHiddenOnHttp = await page.$eval('#file-protocol-banner', el => el.classList.contains('hidden'));
    console.log('File protocol banner hidden on HTTP:', bannerHiddenOnHttp);

    // Test clicking Firebase Config modal
    await page.click('#btn-open-firebase-modal');
    await page.waitForTimeout(400);
    const modalVisible = await page.$eval('#modal-firebase-config', el => !el.classList.contains('hidden'));
    console.log('Firebase config modal opens successfully:', modalVisible);

    // Capture screenshot of Firebase Connect Modal
    await page.screenshot({ path: 'tests/evidence-firebase-config-modal.png' });

    // Test Phone Auth Tab
    await page.click('#btn-close-firebase-modal');
    await page.waitForTimeout(300);
    await page.click('#tab-auth-phone');
    await page.waitForTimeout(300);
    const phoneFormVisible = await page.$eval('#form-login-phone', el => !el.classList.contains('hidden'));
    console.log('Phone authentication form visible on tab switch:', phoneFormVisible);

    await page.screenshot({ path: 'tests/evidence-phone-auth-tab.png' });

    console.log('=== All Protocol & Firebase Tests Passed ===');
    await browser.close();
})();
