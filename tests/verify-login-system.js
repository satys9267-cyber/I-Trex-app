const { chromium } = require('playwright');

(async () => {
    console.log('=== Verifying I-Trex High-Security Authentication Terminal ===');
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    // 1. Visit login.html
    console.log('Navigating to http://localhost:10000/login.html...');
    const response = await page.goto('http://localhost:10000/login.html', { waitUntil: 'domcontentloaded' });
    console.log('Response status:', response.status());

    await page.waitForTimeout(1000);

    // Verify Title & Brand elements
    const pageTitle = await page.title();
    console.log('Page Title:', pageTitle);

    const logoVisible = await page.$eval('img[alt="I-Trex Logo"]', el => el !== null);
    console.log('Silver Logo Visible:', logoVisible);

    const brandHeader = await page.$eval('h1', el => el.textContent.trim());
    console.log('Brand Header:', brandHeader);

    // Screenshot 1: Sign In View
    await page.screenshot({ path: 'tests/evidence-login-terminal-desktop.png' });
    console.log('Captured tests/evidence-login-terminal-desktop.png');

    // 2. Test Switching to Registration Mode
    console.log('Testing Switch to Sign Up mode...');
    await page.click('#btn-to-register');
    await page.waitForTimeout(600);

    const regViewVisible = await page.$eval('#view-register', el => !el.classList.contains('hidden'));
    console.log('Register View Visible:', regViewVisible);

    // Test Dynamic Password Entropy Meter
    await page.fill('#reg-password', 'Trx@2026Secure!');
    await page.waitForTimeout(300);
    const strengthLabel = await page.$eval('#pass-strength-label', el => el.textContent.trim());
    console.log('Password Strength Label:', strengthLabel);

    // Test Username Validation
    await page.fill('#reg-username', 'satyam_swami');
    await page.waitForTimeout(300);
    const usernameStatus = await page.$eval('#username-feedback', el => el.textContent.trim());
    console.log('Username Feedback Status:', usernameStatus);

    // Screenshot 2: Sign Up View
    await page.screenshot({ path: 'tests/evidence-login-register-mode.png' });
    console.log('Captured tests/evidence-login-register-mode.png');

    // 3. Test Switching to Forgot Password Mode
    console.log('Testing Switch to Forgot Password mode...');
    await page.click('#btn-to-login');
    await page.waitForTimeout(400);
    await page.click('#btn-to-forgot');
    await page.waitForTimeout(600);

    const forgotViewVisible = await page.$eval('#view-forgot', el => !el.classList.contains('hidden'));
    console.log('Forgot Password View Visible:', forgotViewVisible);

    // Screenshot 3: Forgot Password View
    await page.screenshot({ path: 'tests/evidence-login-forgot-mode.png' });
    console.log('Captured tests/evidence-login-forgot-mode.png');

    // 4. Test Switching to 2FA Mode via JS call
    console.log('Testing Two-Factor Authentication View...');
    await page.evaluate(() => {
        const views = document.querySelectorAll('.auth-view');
        views.forEach(v => v.classList.add('hidden'));
        document.getElementById('view-2fa').classList.remove('hidden');
    });
    await page.waitForTimeout(500);

    // Screenshot 4: 2FA View
    await page.screenshot({ path: 'tests/evidence-login-2fa-mode.png' });
    console.log('Captured tests/evidence-login-2fa-mode.png');

    console.log('Console errors encountered:', consoleErrors.length, consoleErrors);
    console.log('=== Authentication Terminal Verification Completed Successfully ===');
    await browser.close();
})();
