/**
 * I-Trex Innovations — Comprehensive Playwright Verification Suite
 * Executes automated end-to-end testing with Microsoft Edge (Chromium) on D: drive
 */

// Route all temp directories to D: drive where 357 GB is available
process.env.TEMP = 'D:\\temp';
process.env.TMP = 'D:\\temp';

const { chromium } = require('playwright');
const express = require('express');
const path = require('path');
const http = require('http');
const fs = require('fs');

async function runTests() {
    console.log('===============================================================');
    console.log('   I-TREX INNOVATIONS — END-TO-END PLAYWRIGHT VERIFICATION     ');
    console.log('===============================================================\n');

    // 1. Spin up an internal Express test server on port 3042
    const app = express();
    app.use(express.static(path.join(__dirname)));
    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(3042, resolve));
    console.log('✓ Internal verification server started at http://localhost:3042\n');

    let context;
    let hasFailure = false;
    const userDataDir = path.join('D:\\temp', 'edge_profile_' + Date.now());

    try {
        if (!fs.existsSync(userDataDir)) {
            fs.mkdirSync(userDataDir, { recursive: true });
        }

        console.log(`Launching Edge using D: workspace profile: ${userDataDir}...`);
        context = await chromium.launchPersistentContext(userDataDir, {
            channel: 'msedge',
            headless: true,
            viewport: { width: 1440, height: 900 },
            args: [
                `--disk-cache-dir=D:\\temp\\edge_cache`,
                '--disable-gpu-shader-disk-cache',
                '--disable-features=OptimizationHints'
            ]
        });

        const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

        // Collect console logs, responses and errors
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log(`  [Browser Error]:`, msg.text());
            }
        });

        page.on('response', resp => {
            if (resp.status() === 404) {
                console.log(`  [404 Notice]: ${resp.url()}`);
            }
        });

        // -------------------------------------------------------------
        // TEST SUITE 1: HOMEPAGE (index.html)
        // -------------------------------------------------------------
        console.log('--- TEST SUITE 1: HOMEPAGE (index.html) ---');
        await page.goto('http://localhost:3042/index.html', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1000); // Allow preloader animation

        // 1.1 Page Title
        const title = await page.title();
        console.log(`[1.1] Page Title: "${title}"`);
        if (!title.includes('I-Trex Innovations')) {
            throw new Error(`Title does not contain I-Trex Innovations: ${title}`);
        }
        console.log('  ✓ Page title verified successfully.');

        // 1.2 GSAP & Lenis Engine Check
        const lenisCheck = await page.evaluate(() => {
            return {
                lenisDefined: typeof Lenis !== 'undefined',
                gsapDefined: typeof gsap !== 'undefined',
                scrollTriggerDefined: typeof ScrollTrigger !== 'undefined'
            };
        });
        console.log(`[1.2] Animation Engines: Lenis=${lenisCheck.lenisDefined}, GSAP=${lenisCheck.gsapDefined}, ScrollTrigger=${lenisCheck.scrollTriggerDefined}`);
        if (!lenisCheck.lenisDefined || !lenisCheck.gsapDefined || !lenisCheck.scrollTriggerDefined) {
            throw new Error('Animation libraries failed to initialize in DOM context.');
        }
        console.log('  ✓ GSAP, ScrollTrigger & Lenis successfully synchronized.');

        // 1.3 Team Roster Verification (Strictly Satyam Swami & Ishwari Patil)
        const teamCards = await page.locator('#team-grid > div').all();
        console.log(`[1.3] Team member count: ${teamCards.length} (Expected: 2)`);
        if (teamCards.length !== 2) {
            throw new Error(`Expected exactly 2 core team members, but found: ${teamCards.length}`);
        }

        const teamMember1Text = await teamCards[0].innerText();
        const teamMember2Text = await teamCards[1].innerText();

        console.log(`  Member 1:\n    ${teamMember1Text.replace(/\n/g, ' ')}`);
        console.log(`  Member 2:\n    ${teamMember2Text.replace(/\n/g, ' ')}`);

        if (!teamMember1Text.includes('Satyam Swami') || !teamMember1Text.toLowerCase().includes('founder')) {
            throw new Error('Member 1 is not Satyam Swami as Founder.');
        }
        if (!teamMember2Text.includes('Ishwari Patil') || !teamMember2Text.toLowerCase().includes('co-founder')) {
            throw new Error('Member 2 is not Ishwari Patil as Co-Founder.');
        }
        console.log('  ✓ Core leadership team verified: Satyam Swami (Founder) & Ishwari Patil (Co-Founder).');

        // 1.4 Light / Dark Theme Solar Eclipse Toggle
        const htmlHasDarkBefore = await page.evaluate(() => document.documentElement.classList.contains('dark'));
        await page.click('#theme-toggle-btn');
        await page.waitForTimeout(300);
        const htmlHasDarkAfter = await page.evaluate(() => document.documentElement.classList.contains('dark'));
        console.log(`[1.4] Solar Eclipse Theme Toggle: Before=${htmlHasDarkBefore} -> After=${htmlHasDarkAfter}`);
        if (htmlHasDarkBefore === htmlHasDarkAfter) {
            throw new Error('Theme toggle failed to flip dark class on html root.');
        }
        console.log('  ✓ Solar Eclipse theme toggle active and responsive.');

        // -------------------------------------------------------------
        // TEST SUITE 2: AUTHENTICATION TERMINAL & SECURITY AUDIT (login.html)
        // -------------------------------------------------------------
        console.log('\n--- TEST SUITE 2: LOGIN TERMINAL & SECURITY AUDIT (login.html) ---');
        await page.goto('http://localhost:3042/login.html', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1000);

        // 2.1 Security Audit: Zero Leaked Credentials or Demo Accounts in UI
        const pageText = await page.content();
        const forbiddenPatterns = [
            '1-Click Evaluation Credentials',
            'admin@itrex.internal',
            'employee@itrex.internal',
            'Elena Vance',
            'Password@123'
        ];

        console.log('[2.1] Scanning DOM for credentials / demo account leaks...');
        for (const pattern of forbiddenPatterns) {
            if (pageText.includes(pattern)) {
                throw new Error(`SECURITY LEAK: Found forbidden demo text in login page: "${pattern}"`);
            }
        }
        console.log('  ✓ Security audit passed: Zero demo account credentials exposed in UI.');

        // 2.2 Placeholder Check
        const signinEmailPlaceholder = await page.getAttribute('#signin-email', 'placeholder');
        console.log(`[2.2] Sign-in email placeholder: "${signinEmailPlaceholder}"`);
        if (signinEmailPlaceholder.includes('@itrex.internal') || signinEmailPlaceholder.includes('satys9267')) {
            throw new Error(`Placeholder reveals credentials: ${signinEmailPlaceholder}`);
        }
        console.log('  ✓ Sign-in placeholder is generic and secure.');

        // 2.3 Tab Switching (Sign In <-> Create Account)
        console.log('[2.3] Testing Tab Navigation...');
        await page.click('#tab-btn-register');
        await page.waitForTimeout(300);
        const isRegisterVisible = await page.isVisible('#form-register-container');
        const isSigninHidden = await page.isHidden('#form-signin-container');
        console.log(`  Create Account Tab Active: registerVisible=${isRegisterVisible}, signinHidden=${isSigninHidden}`);
        if (!isRegisterVisible || !isSigninHidden) {
            throw new Error('Tab switching to Create Account failed.');
        }

        // 2.4 Password Strength Meter
        console.log('[2.4] Testing Dynamic Password Strength Meter...');
        await page.fill('#reg-password', 'abc');
        await page.waitForTimeout(100);
        const weakText = await page.innerText('#password-strength-text');
        console.log(`  Weak input ("abc"): ${weakText}`);

        await page.fill('#reg-password', 'Enterprise@Trex2026!');
        await page.waitForTimeout(100);
        const strongText = await page.innerText('#password-strength-text');
        console.log(`  Strong input ("Enterprise@Trex2026!"): ${strongText}`);

        if (!strongText.includes('Military-Grade') && !strongText.includes('FIPS')) {
            throw new Error(`Password strength meter failed to recognize military grade password: ${strongText}`);
        }
        console.log('  ✓ Password strength algorithm verified.');

        // 2.5 Google Sign-In Direct Flow
        console.log('[2.5] Testing Google Identity Integration...');
        await page.click('#tab-btn-signin');
        await page.waitForTimeout(200);

        // Open Google modal
        await page.click('button.btn-google-auth');
        await page.waitForTimeout(300);
        const isGoogleModalOpen = await page.isVisible('#google-account-modal');
        console.log(`  Google Modal Opened: ${isGoogleModalOpen}`);
        if (!isGoogleModalOpen) {
            throw new Error('Google OAuth modal failed to open.');
        }

        // Fill Google email input with Satyam's email
        await page.fill('#google-auth-input', 'satys9267@gmail.com');
        await page.click('#btn-google-dialog-submit');
        await page.waitForTimeout(1500); // Wait for redirect to dashboard

        const redirectedUrl = page.url();
        console.log(`  Redirected destination: ${redirectedUrl}`);
        if (!redirectedUrl.includes('dashboard.html')) {
            throw new Error(`Google OAuth did not redirect to dashboard. Current URL: ${redirectedUrl}`);
        }
        console.log('  ✓ Google OAuth verification and session redirection confirmed.');

        // -------------------------------------------------------------
        // TEST SUITE 3: WORKSPACE DASHBOARD (dashboard.html)
        // -------------------------------------------------------------
        console.log('\n--- TEST SUITE 3: WORKSPACE DASHBOARD (dashboard.html) ---');
        await page.waitForTimeout(800);

        const greetingText = await page.innerText('#dash-greeting-text');
        const roleBadge = await page.innerText('#dash-role-badge');
        console.log(`[3.1] Dashboard Greeting: "${greetingText}"`);
        console.log(`[3.2] Security Role Badge: "${roleBadge}"`);

        if (!greetingText.includes('Satyam')) {
            throw new Error(`Dashboard did not greet Satyam: ${greetingText}`);
        }
        if (!roleBadge.includes('ADMIN')) {
            throw new Error(`Expected ADMIN badge, found: ${roleBadge}`);
        }
        console.log('  ✓ Workspace identity verified for Satyam Swami (Administrator).');

        // Check Lenis in Dashboard
        const dashLenisCheck = await page.evaluate(() => typeof Lenis !== 'undefined');
        console.log(`[3.3] Dashboard Lenis Integration: ${dashLenisCheck}`);
        if (!dashLenisCheck) {
            throw new Error('Lenis is not loaded on Dashboard.');
        }
        console.log('  ✓ Smooth scroll engine active across entire platform.');

        // Capture evidence screenshot
        await page.screenshot({ path: path.join(__dirname, 'playwright-verification-success.png') });
        console.log('\n📸 Verification screenshot saved as: playwright-verification-success.png');

    } catch (err) {
        hasFailure = true;
        console.error('\n❌ PLAYWRIGHT TEST ERROR:', err.message);
    } finally {
        if (context) await context.close();
        server.close();
    }

    if (hasFailure) {
        process.exit(1);
    } else {
        console.log('\n===============================================================');
        console.log('   🎉 ALL PLAYWRIGHT END-TO-END TESTS PASSED (100% SUCCESS)    ');
        console.log('===============================================================\n');
    }
}

runTests();
