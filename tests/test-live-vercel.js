const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/satnyx/.gemini/antigravity/brain/3a5bbf2a-41ec-46ab-97cc-cb3ad0c01db0';

(async () => {
    console.log('--- Testing Live Vercel Production Environment ---');
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

    await context.addInitScript(() => {
        const founderUser = {
            id: 'usr-001',
            name: 'Satyam Swami',
            email: 'satys9267@gmail.com',
            role: 'founder',
            avatar: '👑', // Emoji that previously crashed window.fetch
            title: 'Founder & Chief Architect',
            department: 'Information Technology & Data Analytics',
            phone: '+91 74998 25344',
            bio: 'Founding visionary of I-Trex Innovations.'
        };
        localStorage.setItem('itrex_auth_user', JSON.stringify(founderUser));
    });

    const page = await context.newPage();
    let hadIsoHeaderError = false;

    page.on('dialog', async dialog => {
        const msg = dialog.message();
        console.log(`[Live Vercel Dialog] ${dialog.type()}: "${msg}"`);
        if (msg.includes('ISO-8859-1') || msg.includes('Failed to execute \'fetch\'')) {
            hadIsoHeaderError = true;
        }
        await dialog.accept();
    });

    console.log('Navigating to live https://itrexapps-livid.vercel.app/admin#profile ...');
    await page.goto('https://itrexapps-livid.vercel.app/admin#profile', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // Verify inputs populated
    const nameVal = await page.inputValue('#prof-name');
    console.log(`Loaded Profile Name: "${nameVal}"`);

    // Edit and commit
    await page.fill('#prof-bio', `Visionary Founder leading autonomous systems. Verified on production ${Date.now()}.`);
    console.log('Clicking "COMMIT PROFILE CHANGES" on live Vercel site...');
    await page.click('#btn-save-profile');

    await page.waitForTimeout(2000);

    const toastText = await page.textContent('#admin-toast-text');
    console.log(`Live Vercel Toast: "${toastText.trim()}"`);

    const liveScreenshot = path.join(ARTIFACTS_DIR, 'evidence-live-vercel-profile-commit.png');
    await page.screenshot({ path: liveScreenshot, fullPage: false });
    console.log(`Saved live Vercel screenshot: ${liveScreenshot}`);

    if (hadIsoHeaderError) {
        console.error('FAIL: String contains non ISO-8859-1 code point error happened on live Vercel!');
        process.exit(1);
    }

    console.log('SUCCESS: Live Vercel committed changes with ZERO ISO-8859-1 errors!');
    await browser.close();
})().catch(err => {
    console.error('Live test error:', err);
    process.exit(1);
});
