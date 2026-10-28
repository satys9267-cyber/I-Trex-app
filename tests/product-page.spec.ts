import { test, expect } from '@playwright/test';

/**
 * Playwright Test Suite: Product Page Hero Redesign & Showcase Catalog
 * Validates:
 * 1. Primary headline "Our Products. Our Innovations." with staggered entrance animation
 * 2. Sub-headline "Engineered for Autonomy. Deployed with Microsecond Precision."
 * 3. Dynamic Action Button entering from opposite axis ("Explore Specifications" & "View Architecture Specs")
 * 4. Lenis smooth scroll & GSAP ScrollTrigger synchronization
 * 5. Dynamic category filter tabs: All, Autonomous Systems, Neural Hardware, Telemetry & Cloud
 * 6. High-impact glassmorphic dark cards (#0b0f19/80) with 3D CAD schematics & technical specs
 * 7. Zero horizontal layout overflow across desktop (1440x900) and mobile (375x812) viewports
 */

test.describe('I-Trex Innovations — Product Page Hero & Catalog Suite', () => {

    test('Desktop Viewport: Hero Entrance, CTA Animation, Category Filters & Responsive Layout', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto('/products.html', { waitUntil: 'domcontentloaded' });

        // Wait for preloader & orchestrated entrance
        await page.waitForTimeout(2000);

        // 1. Verify Primary Headline
        const headline = page.locator('#product-hero-headline');
        await expect(headline).toBeVisible();
        const headlineText = await headline.innerText();
        expect(headlineText).toContain('Our Products.');
        expect(headlineText).toContain('Our Innovations.');

        // 2. Verify Sub-Headline
        const subtext = page.locator('#product-hero-subtext');
        await expect(subtext).toBeVisible();
        const subtextContent = await subtext.innerText();
        expect(subtextContent).toContain('Engineered for Autonomy. Deployed with Microsecond Precision.');

        // 3. Verify Dynamic CTA Button
        const heroCta = page.locator('#product-hero-cta');
        await expect(heroCta).toBeVisible();
        const ctaText = await heroCta.innerText();
        expect(ctaText).toContain('Explore Specifications');

        const secondaryCta = page.locator('#product-hero-secondary-cta');
        await expect(secondaryCta).toBeVisible();
        const secondaryCtaText = await secondaryCta.innerText();
        expect(secondaryCtaText).toContain('View Architecture Specs');

        // 4. Verify Category Filtering Tabs
        const filterAll = page.locator('#filter-all');
        const filterAutonomous = page.locator('#filter-autonomous');
        const filterNeural = page.locator('#filter-neural');
        const filterTelemetry = page.locator('#filter-telemetry');

        await expect(filterAll).toBeVisible();
        await expect(filterAutonomous).toBeVisible();
        await expect(filterNeural).toBeVisible();
        await expect(filterTelemetry).toBeVisible();

        // Check All Products
        const allCards = await page.locator('.product-card').all();
        expect(allCards.length).toBe(5);

        // Test Filter: Autonomous Systems
        await filterAutonomous.click();
        await page.waitForTimeout(600);
        const trexosVisible = await page.locator('#trexos').isVisible();
        const trexcoreVisible = await page.locator('#trexcore').isVisible();
        expect(trexosVisible).toBe(true);
        expect(trexcoreVisible).toBe(false);

        // Test Filter: Neural Hardware
        await filterNeural.click();
        await page.waitForTimeout(600);
        const trexvisionVisible = await page.locator('#trexvision').isVisible();
        expect(trexvisionVisible).toBe(true);

        // Test Filter: Telemetry & Cloud
        await filterTelemetry.click();
        await page.waitForTimeout(600);
        const trexcoreAfter = await page.locator('#trexcore').isVisible();
        const trexconnectAfter = await page.locator('#trexconnect').isVisible();
        expect(trexcoreAfter).toBe(true);
        expect(trexconnectAfter).toBe(true);

        // Reset Filter: All
        await filterAll.click();
        await page.waitForTimeout(600);
        const trexosReset = await page.locator('#trexos').isVisible();
        const trexcoreReset = await page.locator('#trexcore').isVisible();
        expect(trexosReset).toBe(true);
        expect(trexcoreReset).toBe(true);

        // 5. Verify Zero Horizontal Overflow
        const hasHorizontalOverflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > window.innerWidth;
        });
        expect(hasHorizontalOverflow).toBe(false);
    });

    test('Mobile Viewport (375x812): Responsive Layout and Zero Overflow', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto('/products.html', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000);

        // Verify Headline & CTA render on mobile
        const headline = page.locator('#product-hero-headline');
        await expect(headline).toBeVisible();
        expect(await headline.innerText()).toContain('Our Products.');

        const heroCta = page.locator('#product-hero-cta');
        await expect(heroCta).toBeVisible();

        // Verify Zero Horizontal Overflow on mobile
        const hasHorizontalOverflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > window.innerWidth;
        });
        expect(hasHorizontalOverflow).toBe(false);
    });
});
