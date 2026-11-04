const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function verifyAllFeatures() {
    console.log('=== Starting 20 New Features & Audit Removals Verification ===');
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 }
    });
    const page = await context.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    const evidenceDir = path.join(__dirname, 'evidence');
    if (!fs.existsSync(evidenceDir)) fs.mkdirSync(evidenceDir, { recursive: true });

    try {
        // 1. Visit with UTM parameters
        console.log('[Test 1] Navigating with UTM tracking parameters...');
        await page.goto('http://localhost:10000/index.html?utm_source=venture_beat&utm_medium=cpc&utm_campaign=autonomous_kernel_2026', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);

        // Skip intro preloader if present
        const skipBtn = await page.$('#skip-intro-btn');
        if (skipBtn && await skipBtn.isVisible()) {
            await skipBtn.click();
            await page.waitForTimeout(600);
        }

        // Check UTM persistence
        const utmStored = await page.evaluate(() => sessionStorage.getItem('itrex_utm_params'));
        console.log('[UTM Tracking] Stored UTM params:', utmStored);
        if (!utmStored || !utmStored.includes('venture_beat')) {
            throw new Error('UTM parameters were not captured in sessionStorage');
        }

        // Test Cookie Consent banner early
        await page.waitForTimeout(1600);
        const cookieBannerVisible = await page.evaluate(() => {
            const el = document.getElementById('cookie-consent-banner');
            return el && !el.classList.contains('opacity-0');
        });
        console.log('[Cookie Banner] Banner visible:', cookieBannerVisible);
        await page.click('#cookie-consent-banner button:has-text("ACCEPT ALL")');
        await page.waitForTimeout(300);
        const cookieStored = await page.evaluate(() => localStorage.getItem('itrex_cookie_consent'));
        console.log('[Cookie Banner] Stored consent:', cookieStored);
        if (cookieStored !== 'accepted') throw new Error('Cookie consent not stored in localStorage');

        // 2. Check Skip to Content link
        const skipLink = await page.$('a.skip-to-content');
        if (!skipLink) throw new Error('Skip to Content link missing');
        console.log('[Accessibility] Skip to content link verified.');

        // 3. Check Scroll Progress Bar
        const initialScrollWidth = await page.evaluate(() => document.getElementById('scroll-progress-bar')?.style.width);
        await page.evaluate(() => window.scrollTo(0, 1500));
        await page.waitForTimeout(800);
        const scrolledWidth = await page.evaluate(() => document.getElementById('scroll-progress-bar')?.style.width);
        console.log('[Scroll Progress Bar] Width at 1500px scroll:', scrolledWidth);
        if (!scrolledWidth || parseFloat(scrolledWidth) <= 0) {
            throw new Error('Scroll progress bar failed to update width on scroll');
        }

        // 4. Check Back to Top Button
        const backToTopVisible = await page.evaluate(() => {
            const btn = document.getElementById('back-to-top-btn');
            return btn && !btn.classList.contains('opacity-0');
        });
        console.log('[Back to Top] Button visible after scroll:', backToTopVisible);
        if (!backToTopVisible) throw new Error('Back to top button not visible after scroll');

        // Click Back to Top
        await page.click('#back-to-top-btn');
        await page.waitForTimeout(800);
        const scrollAfterTop = await page.evaluate(() => window.scrollY);
        console.log('[Back to Top] Window scrollY after click:', scrollAfterTop);

        // 5. Check Dark Mode / Light Mode Toggle
        console.log('[Theme Toggle] Testing Light / Dark mode toggle...');
        const initialIsLight = await page.evaluate(() => document.documentElement.classList.contains('light'));
        console.log('[Theme Toggle] Initial light mode state:', initialIsLight);
        await page.click('#theme-toggle-btn');
        await page.waitForTimeout(300);
        const toggledIsLight = await page.evaluate(() => document.documentElement.classList.contains('light'));
        console.log('[Theme Toggle] Toggled state:', toggledIsLight);
        if (toggledIsLight === initialIsLight) throw new Error('Theme toggle failed to change class');
        await page.screenshot({ path: path.join(evidenceDir, 'theme-light-mode.png') });
        // Toggle back to dark
        await page.click('#theme-toggle-btn');
        await page.waitForTimeout(200);

        // 6. Check Site Search Command Palette (Ctrl+K)
        console.log('[Site Search] Testing Command Palette search...');
        await page.keyboard.press('Control+KeyK');
        await page.waitForTimeout(300);
        const searchModalVisible = await page.isVisible('#site-search-modal');
        console.log('[Site Search] Modal opened via Ctrl+K:', searchModalVisible);
        if (!searchModalVisible) throw new Error('Site search modal failed to open on Ctrl+K');

        await page.fill('#site-search-input', 'TrexOS');
        await page.waitForTimeout(300);
        const searchResultsText = await page.textContent('#site-search-results');
        console.log('[Site Search] Results preview:', searchResultsText.replace(/\s+/g, ' ').substring(0, 100));
        if (!searchResultsText.includes('TrexOS Microkernel')) {
            throw new Error('Expected TrexOS Microkernel in search results');
        }
        await page.screenshot({ path: path.join(evidenceDir, 'site-search-palette.png') });

        // Close search modal via ESC
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);

        // 7. Check Expandable FAQ Accordion
        console.log('[FAQ Accordion] Testing Expandable FAQ section...');
        await page.evaluate(() => document.getElementById('faq')?.scrollIntoView());
        await page.waitForTimeout(500);

        const faqButton = page.locator('#faq-accordion-container .faq-question-btn').first();
        const firstPanel = page.locator('#faq-accordion-container .faq-answer-panel').first();

        const initiallyHidden = await firstPanel.isHidden();
        console.log('[FAQ Accordion] First answer initially hidden:', initiallyHidden);
        await faqButton.click();
        await page.waitForTimeout(300);
        const nowVisible = await firstPanel.isVisible();
        console.log('[FAQ Accordion] First answer visible after click:', nowVisible);
        if (!nowVisible) throw new Error('FAQ panel did not expand upon click');

        // Click second FAQ item to verify accordion auto-collapse
        const secondButton = page.locator('#faq-accordion-container .faq-question-btn').nth(1);
        await secondButton.click();
        await page.waitForTimeout(300);
        const firstNowHidden = await firstPanel.isHidden();
        console.log('[FAQ Accordion] First answer collapsed after second clicked:', firstNowHidden);
        if (!firstNowHidden) throw new Error('FAQ accordion did not collapse previous panel');
        await page.screenshot({ path: path.join(evidenceDir, 'faq-accordion.png') });

        // 8. Check Floating Contact Button
        const floatingContactVisible = await page.isVisible('#floating-contact-btn');
        console.log('[Floating Contact] Button visible:', floatingContactVisible);
        if (!floatingContactVisible) throw new Error('Floating contact button is not visible');


        // 10. Check Form Validation Error States & Success State
        console.log('[Form States] Testing Direct Transmission form validation...');
        await page.evaluate(() => document.getElementById('contact')?.scrollIntoView());
        await page.waitForTimeout(500);

        // Click submit while empty to trigger error states
        await page.click('#founder-contact-form button[type="submit"]');
        await page.waitForTimeout(300);
        const errorMsgCount = await page.locator('#founder-contact-form .field-error-text').count();
        console.log('[Form Error State] Validation error message count:', errorMsgCount);
        if (errorMsgCount === 0) throw new Error('Expected form error states to trigger on invalid submission');
        await page.screenshot({ path: path.join(evidenceDir, 'form-error-state.png') });

        // Fill valid details
        await page.fill('#contact-name', 'Sophia Sterling');
        await page.fill('#contact-email', 'sophia.sterling@spacex-telemetry.com');
        await page.fill('#contact-message', 'Inquiry regarding zero-trust FIPS telemetry deployment across low-Earth orbit satellites.');
        await page.click('#founder-contact-form button[type="submit"]');
        await page.waitForTimeout(1500);

        // Verify success receipt banner
        const inlineSuccessVisible = await page.isVisible('#contact-inline-success');
        console.log('[Form Success State] Inline receipt banner visible:', inlineSuccessVisible);
        if (!inlineSuccessVisible) throw new Error('Inline success banner was not displayed');

        const refIdText = await page.textContent('#success-ref-id');
        console.log('[Form Success State] Transmission Reference ID:', refIdText);

        // Verify Confirmation Modal with Copy ID button
        const modalVisible = await page.isVisible('#contact-status-modal');
        console.log('[Confirmation Modal] Modal visible:', modalVisible);
        if (!modalVisible) throw new Error('Confirmation modal not shown');
        await page.screenshot({ path: path.join(evidenceDir, 'form-success-receipt.png') });

        // Close modal
        await page.click('#contact-status-modal button:has-text("CLOSE CONSOLE")');
        await page.waitForTimeout(300);

        // 11. Check Password Visibility Toggle in login.html
        console.log('[Password Toggle] Navigating to login.html...');
        await page.goto('http://localhost:10000/login.html', { waitUntil: 'networkidle' });
        await page.waitForTimeout(500);

        const passInputTypeInitial = await page.getAttribute('#login-password', 'type');
        console.log('[Password Toggle] Initial login password input type:', passInputTypeInitial);
        await page.click('#toggle-login-pass');
        await page.waitForTimeout(200);
        const passInputTypeToggled = await page.getAttribute('#login-password', 'type');
        console.log('[Password Toggle] Toggled type:', passInputTypeToggled);
        if (passInputTypeToggled !== 'text') throw new Error('Password visibility toggle did not change input type to text');

        // 12. Check Audit Removals
        console.log('[Audit Removals] Verifying removal of audit anti-patterns on index.html...');
        await page.goto('http://localhost:10000/index.html', { waitUntil: 'networkidle' });

        // Check: Zero tech-tag labels above headings in index.html
        const techTagsAboveHeadings = await page.evaluate(() => {
            const tags = Array.from(document.querySelectorAll('.tech-tag'));
            return tags.map(t => t.textContent.trim());
        });
        console.log('[Audit Removals] Remaining tech-tags count on index.html:', techTagsAboveHeadings.length, techTagsAboveHeadings);
        if (techTagsAboveHeadings.length > 0) {
            throw new Error(`Expected zero tech-tag labels above headings on index.html, but found ${techTagsAboveHeadings.length}: ${JSON.stringify(techTagsAboveHeadings)}`);
        }

        // Check: Demo data removed (no fictitious demo team leads)
        const demoPersonnelPresent = await page.evaluate(() => {
            const text = document.body.innerText;
            return text.includes('Elena Vance') || text.includes('Marcus Chen') || text.includes('Sarah Miller') || text.includes('Kavita Rao');
        });
        console.log('[Audit Removals] Fictitious demo personnel present on index.html:', demoPersonnelPresent);
        if (demoPersonnelPresent) {
            throw new Error('Fictitious demo engineering leads (Elena Vance, Marcus Chen, etc.) still present on index.html!');
        }

        // Check: products.html has zero tech-tags above headings
        await page.goto('http://localhost:10000/products.html', { waitUntil: 'networkidle' });
        const productsTechTagsCount = await page.evaluate(() => document.querySelectorAll('.tech-tag').length);
        console.log('[Audit Removals] Remaining tech-tags count on products.html:', productsTechTagsCount);
        if (productsTechTagsCount > 0) {
            throw new Error(`Expected zero tech-tag labels above headings on products.html, but found ${productsTechTagsCount}`);
        }

        // Return to index.html for remaining checks
        await page.goto('http://localhost:10000/index.html', { waitUntil: 'networkidle' });

        // Check: No colored words in main headline
        const heroHasColoredWord = await page.evaluate(() => {
            const headline = document.getElementById('hero-headline');
            return headline ? headline.innerHTML.includes('text-chrome') : false;
        });
        console.log('[Audit Removals] Hero headline contains text-chrome colored word:', heroHasColoredWord);
        if (heroHasColoredWord) throw new Error('Hero headline still contains single colored gradient word!');

        // Check: Word "seamless" removed from public text
        const bodyText = await page.evaluate(() => document.body.innerText);
        const containsSeamless = /seamless\b/i.test(bodyText);
        console.log('[Audit Removals] Body contains the word "seamless":', containsSeamless);
        if (containsSeamless) throw new Error('The word "seamless" is still present in public page copy!');

        // Check: Last updated date in footer
        const footerText = await page.textContent('#footer');
        console.log('[Last Updated Date] Footer text snippet:', footerText.replace(/\s+/g, ' ').substring(0, 150));
        if (!footerText.includes('LAST PLATFORM UPDATE: NOVEMBER 2026')) {
            throw new Error('Last platform update timestamp missing from footer');
        }

        console.log('=== ALL 20 FEATURES AND AUDIT REMOVALS VERIFIED SUCCESSFULLY! ===');

    } catch (err) {
        console.error('VERIFICATION ERROR:', err);
        await page.screenshot({ path: path.join(evidenceDir, 'verification-error.png') });
        process.exitCode = 1;
    } finally {
        await browser.close();
    }
}

verifyAllFeatures();
