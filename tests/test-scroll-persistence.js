const { chromium } = require('playwright');

async function testScrollPersistence() {
    console.log('=== Testing Scroll Persistence (Zero Disappearing / Zero Reversing) ===');
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    try {
        await page.goto('http://localhost:10000/index.html', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);

        // Skip intro if present
        try {
            await page.click('#skip-intro-btn', { timeout: 1200 });
        } catch (e) {}
        await page.waitForTimeout(600);

        // Check hero visibility initially
        const heroOpacityInit = await page.evaluate(() => {
            const el = document.querySelector('#home .relative.z-10');
            return window.getComputedStyle(el).opacity;
        });
        console.log('[Initial] Hero opacity:', heroOpacityInit);

        // Scroll down to 1000px
        await page.evaluate(() => window.scrollTo(0, 1000));
        await page.waitForTimeout(800);

        const heroOpacityScrolled = await page.evaluate(() => {
            const el = document.querySelector('#home .relative.z-10');
            return window.getComputedStyle(el).opacity;
        });
        console.log('[Scrolled 1000px] Hero opacity (must remain 1, not disappear):', heroOpacityScrolled);
        if (parseFloat(heroOpacityScrolled) < 0.9) {
            throw new Error(`Hero opacity disappeared on scroll! Value: ${heroOpacityScrolled}`);
        }

        // Scroll through all sections down to 3500px
        await page.evaluate(() => window.scrollTo(0, 2500));
        await page.waitForTimeout(800);

        // Check Section 04 and 05 headings and cards
        const pillarCardsVisible = await page.evaluate(() => {
            const cards = Array.from(document.querySelectorAll('.arch-pillar-card'));
            return cards.map(c => window.getComputedStyle(c).opacity);
        });
        console.log('[Scrolled 2500px] Pillar cards opacities:', pillarCardsVisible);
        for (const op of pillarCardsVisible) {
            if (parseFloat(op) < 0.9) {
                throw new Error(`Pillar card disappeared on scroll! Opacity: ${op}`);
            }
        }

        // Scroll down further to 4500px
        await page.evaluate(() => window.scrollTo(0, 4500));
        await page.waitForTimeout(800);

        // Scroll back up to 2000px to ensure nothing disappears on reverse scroll
        await page.evaluate(() => window.scrollTo(0, 2000));
        await page.waitForTimeout(800);

        const titlesAfterScrollBack = await page.evaluate(() => {
            const titles = Array.from(document.querySelectorAll('.title-section'));
            return titles.map(t => window.getComputedStyle(t).opacity);
        });
        console.log('[Scrolled Back 2000px] Section titles opacities:', titlesAfterScrollBack);
        for (const op of titlesAfterScrollBack) {
            if (parseFloat(op) < 0.9) {
                throw new Error(`Title disappeared when scrolling back! Opacity: ${op}`);
            }
        }

        console.log('✅ PASS: All elements remain permanently visible on scroll with zero disappearing!');
    } catch (err) {
        console.error('TEST ERROR:', err);
        process.exitCode = 1;
    } finally {
        await browser.close();
    }
}

testScrollPersistence();
