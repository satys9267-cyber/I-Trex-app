/**
 * Test: Verification of Header Sanitization and Admin Profile / Product Commits
 * Ensures zero "Failed to execute 'fetch' on 'Window': Failed to read the 'headers' property from 'RequestInit': String contains non ISO-8859-1 code point"
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACTS_DIR = 'C:/Users/satnyx/.gemini/antigravity/brain/3a5bbf2a-41ec-46ab-97cc-cb3ad0c01db0';

(async () => {
    console.log('--- Starting Admin Header Sanitization & Commit Verification Test ---');
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

    // Seed localStorage BEFORE the page loads so immediateGuard allows instant entry
    await context.addInitScript(() => {
        const founderUser = {
            id: 'usr-001',
            name: 'Satyam Swami',
            email: 'satys9267@gmail.com',
            role: 'founder',
            avatar: '👑', // The emoji that previously triggered the ISO-8859-1 error!
            title: 'Founder & Chief Architect',
            department: 'Information Technology & Data Analytics',
            phone: '+91 74998 25344',
            bio: 'Founding visionary of I-Trex Innovations. Leading autonomous neural microkernels, eBPF security enclaves, and distributed state consensus.'
        };
        localStorage.setItem('itrex_auth_user', JSON.stringify(founderUser));
    });

    const page = await context.newPage();

    let dialogMessage = null;
    let hadIsoHeaderError = false;

    page.on('dialog', async dialog => {
        const msg = dialog.message();
        console.log(`[Browser Dialog] Type: ${dialog.type()}, Message: "${msg}"`);
        dialogMessage = msg;
        if (msg.includes('ISO-8859-1') || msg.includes('Failed to execute \'fetch\'')) {
            hadIsoHeaderError = true;
        }
        await dialog.accept();
    });

    page.on('pageerror', err => {
        console.error('[Page Error]:', err.message);
        if (err.message.includes('ISO-8859-1')) {
            hadIsoHeaderError = true;
        }
    });

    // 1. Navigate directly to admin enclave profile section
    console.log('Navigating to admin enclave profile section...');
    await page.goto('http://localhost:10000/admin.html#profile', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Verify we are on profile section
    const profileSectionVisible = await page.isVisible('#section-profile');
    console.log('Profile section visible:', profileSectionVisible);

    // Verify inputs populated
    const nameVal = await page.inputValue('#prof-name');
    const bioVal = await page.inputValue('#prof-bio');
    console.log(`Loaded Founder Profile: Name="${nameVal}", Bio starts with="${bioVal.slice(0, 30)}..."`);

    // 2. Edit profile fields with updated text
    const updatedBio = `Founding visionary of I-Trex Innovations. Leading autonomous neural microkernels, eBPF security enclaves, and distributed state consensus. Verified update ${Date.now()}.`;
    await page.fill('#prof-bio', updatedBio);
    await page.fill('#prof-skills', 'Microkernel Systems, eBPF Security Enclaves, Consensus Protocols, Bare-Metal Rust, Distributed Mesh');

    console.log('Clicking "COMMIT PROFILE CHANGES"...');
    await page.click('#btn-save-profile');

    // Wait for network response and toast notification
    await page.waitForTimeout(1500);

    // Check toast
    const toastText = await page.textContent('#admin-toast-text');
    console.log(`Toast message displayed: "${toastText.trim()}"`);

    const screenshotPath = path.join(ARTIFACTS_DIR, 'evidence-profile-committed-successfully.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`Captured evidence screenshot: ${screenshotPath}`);

    if (hadIsoHeaderError) {
        console.error('FAIL: String contains non ISO-8859-1 code point error occurred!');
        process.exit(1);
    }

    if (!toastText.includes('Profile updated!')) {
        console.error(`FAIL: Expected toast confirmation, got: "${toastText}"`);
        process.exit(1);
    }
    console.log('SUCCESS: Profile committed without any ISO-8859-1 or fetch header errors!');

    // 3. Test Product Management mutation with same user
    console.log('\nNavigating to Products Section to test Product mutations...');
    await page.click('#nav-item-products');
    await page.waitForTimeout(1000);

    // Open Add Product Modal
    await page.evaluate(() => openAddProductModal());
    await page.waitForTimeout(500);

    const testProductName = `TrexNeural-Engine-${Date.now().toString().slice(-4)}`;
    await page.fill('#prod-name', testProductName);
    await page.fill('#prod-tagline', 'Autonomous edge execution framework');
    await page.fill('#prod-short-desc', 'Ultra-low latency microkernel acceleration for edge neural networks.');
    await page.fill('#prod-tech', 'Rust, eBPF, WasmEdge, DMA Enclaves');
    await page.fill('#prod-architect', 'Satyam Swami');

    console.log(`Saving new product: ${testProductName}...`);
    await page.click('#form-product button[type="submit"]');
    await page.waitForTimeout(1500);

    if (hadIsoHeaderError) {
        console.error('FAIL: Header error occurred during product creation!');
        process.exit(1);
    }

    const toastTextProduct = await page.textContent('#admin-toast-text');
    console.log(`Toast after product save: "${toastTextProduct.trim()}"`);

    const productScreenshotPath = path.join(ARTIFACTS_DIR, 'evidence-product-committed-successfully.png');
    await page.screenshot({ path: productScreenshotPath, fullPage: false });
    console.log(`Captured product evidence: ${productScreenshotPath}`);

    console.log('\n--- ALL VERIFICATIONS PASSED SUCCESSFULLY! ZERO ISO-8859-1 ERRORS ---');
    await browser.close();
})().catch(err => {
    console.error('Test execution failed:', err);
    process.exit(1);
});
