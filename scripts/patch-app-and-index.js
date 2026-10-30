const fs = require('fs');
const path = require('path');

// 1. Patch style.css
const cssPath = path.join(__dirname, '..', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');
css = css.replace(
`#intro-preloader.fade-out {
  opacity: 0;
  transform: translateY(-100%);
  pointer-events: none;
}`,
`#intro-preloader.fade-out {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1);
}`
);
fs.writeFileSync(cssPath, css, 'utf8');
console.log('✓ Updated style.css for smooth intro fade');

// 2. Patch index.html with target IDs on leadership cards
const indexPath = path.join(__dirname, '..', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

indexHtml = indexHtml.replace(
    '<h3 class="font-display font-bold text-2xl text-white">Satyam Swami</h3>',
    '<h3 id="founder-name" class="font-display font-bold text-2xl text-white">Satyam Swami</h3>'
);
indexHtml = indexHtml.replace(
    '<span class="font-mono text-xs text-neutral-400 block mt-1">Founder & Chief Systems Architect</span>',
    '<span id="founder-title" class="font-mono text-xs text-neutral-400 block mt-1">Founder & Chief Systems Architect</span>'
);
indexHtml = indexHtml.replace(
    '<p class="font-sans text-neutral-400 text-sm mt-3 leading-relaxed font-light">\n                            Founding visionary of I-Trex Innovations. Leading autonomous neural microkernels, eBPF security enclaves, and distributed state consensus.\n                        </p>',
    '<p id="founder-bio" class="font-sans text-neutral-400 text-sm mt-3 leading-relaxed font-light">\n                            Founding visionary of I-Trex Innovations. Leading autonomous neural microkernels, eBPF security enclaves, and distributed state consensus.\n                        </p>'
);
indexHtml = indexHtml.replace(
    '<div class="pt-4 border-t border-white/10 flex flex-wrap gap-2">',
    '<div id="founder-skills" class="pt-4 border-t border-white/10 flex flex-wrap gap-2">'
);

indexHtml = indexHtml.replace(
    '<h3 class="font-display font-bold text-2xl text-white">Ishwari Patil</h3>',
    '<h3 id="cofounder-name" class="font-display font-bold text-2xl text-white">Ishwari Patil</h3>'
);
indexHtml = indexHtml.replace(
    '<span class="font-mono text-xs text-neutral-400 block mt-1">Co-Founder & AI Systems Lead</span>',
    '<span id="cofounder-title" class="font-mono text-xs text-neutral-400 block mt-1">Co-Founder & AI Systems Lead</span>'
);
indexHtml = indexHtml.replace(
    '<p class="font-sans text-neutral-400 text-sm mt-3 leading-relaxed font-light">\n                            Co-founder leading cognitive spatial perception engines, 120 FPS WebGPU neural acceleration, and low-latency edge inference models.\n                        </p>',
    '<p id="cofounder-bio" class="font-sans text-neutral-400 text-sm mt-3 leading-relaxed font-light">\n                            Co-founder leading cognitive spatial perception engines, 120 FPS WebGPU neural acceleration, and low-latency edge inference models.\n                        </p>'
);
// replace second skills block
const lastSkillsMarker = '<div class="pt-4 border-t border-white/10 flex flex-wrap gap-2">';
if (indexHtml.includes(lastSkillsMarker)) {
    indexHtml = indexHtml.replace(
        lastSkillsMarker,
        '<div id="cofounder-skills" class="pt-4 border-t border-white/10 flex flex-wrap gap-2">'
    );
}

fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log('✓ Updated index.html with leadership sync target IDs');

// 3. Patch app.js
const appPath = path.join(__dirname, '..', 'app.js');
let appJs = fs.readFileSync(appPath, 'utf8');

// Replace initPreloader in app.js
const oldPreloaderStart = 'function initPreloader() {';
const oldPreloaderEnd = '/* ==========================================================================\n   HERO HEADLINE MASKED WORD-BY-WORD ANIMATION (LAMBORGHINI STANDARD)';

const newPreloaderCode = `function initPreloader() {
    const preloader = document.getElementById('intro-preloader');
    const skipBtn = document.getElementById('skip-intro-btn');
    const brandText = document.getElementById('intro-brand-text');
    const logoImg = document.getElementById('intro-logo-img');

    if (!preloader) {
        triggerHeroHeadlineAnimation();
        return;
    }

    const hasSeenIntro = sessionStorage.getItem('itrex_intro_seen');
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasSeenIntro || prefersReducedMotion) {
        preloader.style.display = 'none';
        if (preloader.parentNode) preloader.remove();
        triggerHeroHeadlineAnimation();
        return;
    }

    let isDismissed = false;

    function completeIntro() {
        if (isDismissed) return;
        isDismissed = true;
        sessionStorage.setItem('itrex_intro_seen', 'true');

        if (typeof gsap !== 'undefined') {
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.7,
                ease: "power2.inOut",
                onComplete: () => {
                    if (preloader.parentNode) preloader.remove();
                }
            });
            setTimeout(() => {
                triggerHeroHeadlineAnimation();
            }, 250);
        } else {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                if (preloader.parentNode) preloader.remove();
                triggerHeroHeadlineAnimation();
            }, 500);
        }
    }

    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline();

        // PHASE 1: Initial Appearance (0.0s - 0.8s) - Prominent logo fade-in & scale
        tl.fromTo(logoImg, 
            { opacity: 0, scale: 0.90 },
            { opacity: 1, scale: 1.0, duration: 0.8, ease: "power2.out" }
        )
        // PHASE 2: Logo Presentation (0.8s - 2.0s) - Brand typography reveal
        .fromTo(brandText,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
            "-=0.2"
        )
        // PHASE 3: Seamless Dissolve & Overlap (2.2s - 2.9s)
        .to(preloader, {
            opacity: 0,
            duration: 0.75,
            ease: "power2.inOut",
            delay: 0.9,
            onStart: () => {
                // PHASE 4: Seamless Homepage Reveal overlaps with preloader dissolve
                triggerHeroHeadlineAnimation();
            },
            onComplete: () => {
                isDismissed = true;
                sessionStorage.setItem('itrex_intro_seen', 'true');
                if (preloader.parentNode) preloader.remove();
            }
        });

        if (skipBtn) skipBtn.addEventListener('click', () => { tl.kill(); completeIntro(); });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !isDismissed) {
                tl.kill();
                completeIntro();
            }
        });

    } else {
        if (logoImg) logoImg.classList.add('scale-100');
        if (brandText) brandText.classList.remove('opacity-0');
        const timer = setTimeout(completeIntro, 2800);
        if (skipBtn) skipBtn.addEventListener('click', () => { clearTimeout(timer); completeIntro(); });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { clearTimeout(timer); completeIntro(); }
        });
    }
}

async function initLeadershipSync() {
    try {
        const response = await fetch('/api/profiles/public');
        if (!response.ok) return;
        const { founder, cofounder } = await response.json();

        if (founder) {
            const fName = document.getElementById('founder-name');
            const fTitle = document.getElementById('founder-title');
            const fBio = document.getElementById('founder-bio');
            const fSkills = document.getElementById('founder-skills');

            if (fName && founder.name) fName.textContent = founder.name;
            if (fTitle && founder.title) fTitle.textContent = founder.title;
            if (fBio && founder.bio) fBio.textContent = founder.bio;
            if (fSkills && Array.isArray(founder.skills)) {
                fSkills.innerHTML = founder.skills.map(s => '<span class="font-mono text-[10px] px-2.5 py-1 bg-white/5 border border-white/10 text-neutral-300">' + s + '</span>').join('');
            }
        }

        if (cofounder) {
            const cName = document.getElementById('cofounder-name');
            const cTitle = document.getElementById('cofounder-title');
            const cBio = document.getElementById('cofounder-bio');
            const cSkills = document.getElementById('cofounder-skills');

            if (cName && cofounder.name) cName.textContent = cofounder.name;
            if (cTitle && cofounder.title) cTitle.textContent = cofounder.title;
            if (cBio && cofounder.bio) cBio.textContent = cofounder.bio;
            if (cSkills && Array.isArray(cofounder.skills)) {
                cSkills.innerHTML = cofounder.skills.map(s => '<span class="font-mono text-[10px] px-2.5 py-1 bg-white/5 border border-white/10 text-neutral-300">' + s + '</span>').join('');
            }
        }
    } catch (e) {}
}

`;

const preloaderIdx = appJs.indexOf(oldPreloaderStart);
const heroAnimationIdx = appJs.indexOf(oldPreloaderEnd);

if (preloaderIdx !== -1 && heroAnimationIdx !== -1) {
    appJs = appJs.substring(0, preloaderIdx) + newPreloaderCode + appJs.substring(heroAnimationIdx);
    console.log('✓ Successfully replaced initPreloader and added initLeadershipSync in app.js');
}

// Add initLeadershipSync call into DOMContentLoaded
if (!appJs.includes('initLeadershipSync();')) {
    appJs = appJs.replace(
        'initScrollAnimations();',
        'initScrollAnimations();\n\n    // 12. Synchronize leadership cards with database\n    initLeadershipSync();'
    );
    console.log('✓ Added initLeadershipSync to DOMContentLoaded in app.js');
}

fs.writeFileSync(appPath, appJs, 'utf8');
console.log('Successfully updated app.js!');
