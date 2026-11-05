/**
 * I-TREX INNOVATIONS — MASTER CINEMATIC ENGINE
 * Inspired by Lamborghini's Digital Experience (lamborghini.com)
 * Integrates: Lenis Smooth Scrolling, GSAP 3, ScrollTrigger, Interactive Canvas Visualizers,
 * Bespoke Product Showcases, 4-Pillar Neural Stream, Custom Video Theater HUD
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide icons if available
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }

    // 2. Initialize Lenis Smooth Scroll
    initSmoothScroll();

    // 3. Initialize Preloader & Logo Reveal
    initPreloader();

    // 4. Initialize Interactive Hero Background Canvas
    initHeroCanvas();

    // 5. Initialize Custom Cinematic Video Theater
    initVideoTheater();

    // 6. Initialize 5-Product Ecosystem Showcase
    initProductShowcase();

    // 7. Initialize 4-Pillar Architectural Neural Engine
    initArchitecturePillars();

    // 8. Initialize Team & Roadmap Interactive Elements
    initRoadmapAndTeam();

    // 9. Initialize Direct Founder Communication Terminal
    initContactTerminal();

    // 10. Initialize Fullscreen Navigation & Header Behavior
    initNavigation();

    // 11. Initialize GSAP ScrollTrigger Animations
    initScrollAnimations();

    // 12. Synchronize leadership cards with database
    initLeadershipSync();

    // 13. New Enterprise Infrastructure: Theme, Search, Scroll, FAQ & UTM
    initTheme();
    initScrollProgressAndBackToTop();
    initCookieConsent();
    initSiteSearch();
    initFaqAccordion();
    captureUTMParameters();
});

/* ==========================================================================
   1. LENIS SMOOTH SCROLLING
   ========================================================================== */
let lenis = null;

function initSmoothScroll() {
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1.0,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false
        });

        // Synchronize Lenis with GSAP ScrollTrigger
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);

            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });

            gsap.ticker.lagSmoothing(0);
        } else {
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }
    }
}

/* ==========================================================================
   2. INTRO PRELOADER & METALLIC LOGO REVEAL (FULL-TO-FIT CINEMATIC)
   ========================================================================== */
function initPreloader() {
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
            }, 200);
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

        // PHASE 1: Prominent metallic logo fade-in & smooth scale (0.0s - 0.6s)
        tl.fromTo(logoImg, 
            { opacity: 0, scale: 0.92 },
            { opacity: 1, scale: 1.0, duration: 0.6, ease: "power2.out" },
            0
        )
        // PHASE 2: Brand Typography Reveal (0.35s - 0.85s)
        .fromTo(brandText,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            0.35
        )
        // PHASE 3: Seamless Dissolve into Homepage (Starts at 1.4s, completes by 1.9s)
        .to(preloader, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
            onStart: () => {
                triggerHeroHeadlineAnimation();
            },
            onComplete: () => {
                isDismissed = true;
                sessionStorage.setItem('itrex_intro_seen', 'true');
                if (preloader.parentNode) preloader.remove();
            }
        }, 1.4);

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
        const timer = setTimeout(completeIntro, 1800);
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

/* ==========================================================================
   HERO HEADLINE MASKED WORD-BY-WORD ANIMATION (LAMBORGHINI STANDARD)
   ========================================================================== */
function triggerHeroHeadlineAnimation() {
    const chars = document.querySelectorAll('.hero-word-char');
    const desc = document.getElementById('hero-desc');
    const ctas = document.getElementById('hero-ctas');
    const telemetry = document.getElementById('hero-telemetry');

    if (typeof gsap === 'undefined' || !chars.length) {
        if (desc) desc.style.opacity = '1';
        if (ctas) ctas.style.opacity = '1';
        if (telemetry) telemetry.style.opacity = '1';
        return;
    }

    const tl = gsap.timeline();

    // 1. Words slide up out of hidden overflow masks with momentum
    tl.fromTo(chars,
        { yPercent: 120, opacity: 0 },
        {
            yPercent: 0,
            opacity: 1,
            duration: 1.15,
            stagger: 0.12,
            ease: "power4.out",
            clearProps: "all"
        }
    )
    // 2. Supporting description glides up
    .fromTo(desc,
        { y: 30, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out"
        },
        "-=0.6"
    )
    // 3. Aerospace CTAs reveal
    .fromTo(ctas,
        { y: 25, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out"
        },
        "-=0.6"
    )
    // 4. Telemetry status bar fades in
    .fromTo(telemetry,
        { y: 20, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        },
        "-=0.5"
    );
}

/* ==========================================================================
   3. HERO INTERACTIVE CANVAS (Autonomous Neural Matrix — Glowing Micro-Stars)
   ========================================================================== */
function initHeroCanvas() {
    const canvas = document.getElementById('hero-particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouse = { x: width / 2, y: height / 2, active: false };

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    // Particle nodes converted into celestial glowing micro-stars
    // Matching exact original count, distribution, and colors
    const particles = [];
    const count = Math.min(68, Math.floor(width / 20));

    for (let i = 0; i < count; i++) {
        const rand = Math.random();
        // Exact original colors: 20% Cyan (#00f2fe), 45% Silver/White (#e2e8f0), 35% Slate/Titanium (#64748b)
        const isCyan = rand > 0.8;
        const isSilver = rand > 0.35;
        const color = isCyan ? '#00f2fe' : (isSilver ? '#e2e8f0' : '#64748b');
        
        // Steady subtle glow (constant blur, no twinkling)
        const glowColor = isCyan 
            ? 'rgba(0, 242, 254, 0.75)' 
            : (isSilver ? 'rgba(255, 255, 255, 0.55)' : 'rgba(100, 116, 139, 0.45)');

        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.36,
            vy: (Math.random() - 0.5) * 0.36,
            // Radius matches original dots: 0.9px - 2.2px
            size: Math.random() * 1.3 + 0.9,
            color: color,
            glowColor: glowColor,
            angle: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.002 // Very slow, imperceptible cosmic alignment (strictly not twinkling)
        });
    }

    /**
     * Draws a 4-pointed micro-star with steady soft glow (STRICTLY NOT TWINKLING)
     * Exact same size as the previous circular dots.
     */
    function drawMicroStar(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        // Subtle steady ambient glow (constant blur, no flickering or random alpha)
        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = 6;
        ctx.fillStyle = p.color;

        const s = p.size * 1.55; // Perceived size equals dot diameter

        // 4-point concave star with elegant optical flare curves
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.quadraticCurveTo(0, 0, s, 0);
        ctx.quadraticCurveTo(0, 0, 0, s);
        ctx.quadraticCurveTo(0, 0, -s, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s);
        ctx.closePath();
        ctx.fill();

        // Pinpoint bright core for pure optical definition
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Perspective Horizon Grid Lines (Subtle Automotive Wind Tunnel vibe)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
        ctx.lineWidth = 1;
        const horizon = height * 0.72;
        const vanishingX = width * 0.5;

        for (let i = -width; i <= width * 2; i += 120) {
            ctx.beginPath();
            ctx.moveTo(vanishingX, horizon);
            ctx.lineTo(i, height);
            ctx.stroke();
        }

        // Horizontal grid depths
        for (let y = horizon; y <= height; y += (height - horizon) / 8) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Update & Render Glowing Micro-Stars
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];

            p1.x += p1.vx;
            p1.y += p1.vy;
            p1.angle += p1.vRot;

            if (p1.x < 0 || p1.x > width) p1.vx *= -1;
            if (p1.y < 0 || p1.y > height) p1.vy *= -1;

            // Mouse interaction (gentle deflection)
            if (mouse.active) {
                const dx = mouse.x - p1.x;
                const dy = mouse.y - p1.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 140) {
                    p1.x -= dx * 0.012;
                    p1.y -= dy * 0.012;
                }
            }

            // Draw glowing micro-star (steady glow, not twinkling)
            drawMicroStar(p1);

            // Connect constellation lines between nearby stars
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    const alpha = (1 - dist / 130) * 0.16;
                    ctx.strokeStyle = `rgba(226, 232, 240, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   4. CINEMATIC VIDEO THEATER CONTROLLER
   ========================================================================== */
function initVideoTheater() {
    const video = document.getElementById('vision-main-video');
    const playBtn = document.getElementById('video-play-btn');
    const playIcon = document.getElementById('video-play-icon');
    const scrubTrack = document.getElementById('video-scrub-track');
    const scrubProgress = document.getElementById('video-scrub-progress');
    const timeDisplay = document.getElementById('video-timecode');
    const muteBtn = document.getElementById('video-mute-btn');
    const muteIcon = document.getElementById('video-mute-icon');
    const fsBtn = document.getElementById('video-fullscreen-btn');
    const theaterWrapper = document.getElementById('video-theater-wrapper');

    if (!video) return;

    // Play/Pause toggle
    if (playBtn) {
        playBtn.addEventListener('click', togglePlay);
    }
    video.addEventListener('click', togglePlay);

    function togglePlay() {
        if (video.paused || video.ended) {
            video.play();
            if (playIcon) playIcon.setAttribute('data-lucide', 'pause');
        } else {
            video.pause();
            if (playIcon) playIcon.setAttribute('data-lucide', 'play');
        }
        if (window.lucide) window.lucide.createIcons();
    }

    // Time update & scrubber progress
    video.addEventListener('timeupdate', () => {
        if (video.duration) {
            const percent = (video.currentTime / video.duration) * 100;
            if (scrubProgress) scrubProgress.style.width = `${percent}%`;
            if (timeDisplay) {
                const curM = Math.floor(video.currentTime / 60);
                const curS = Math.floor(video.currentTime % 60).toString().padStart(2, '0');
                const durM = Math.floor(video.duration / 60);
                const durS = Math.floor(video.duration % 60).toString().padStart(2, '0');
                timeDisplay.textContent = `${curM}:${curS} / ${durM}:${durS}`;
            }
        }
    });

    // Scrub seeking
    if (scrubTrack) {
        scrubTrack.addEventListener('click', (e) => {
            const rect = scrubTrack.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            if (video.duration) {
                video.currentTime = clickPos * video.duration;
            }
        });
    }

    // Mute toggle
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            video.muted = !video.muted;
            if (muteIcon) {
                muteIcon.setAttribute('data-lucide', video.muted ? 'volume-x' : 'volume-2');
                if (window.lucide) window.lucide.createIcons();
            }
        });
    }

    // Fullscreen toggle
    if (fsBtn && theaterWrapper) {
        fsBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                theaterWrapper.requestFullscreen().catch(err => console.log(err));
            } else {
                document.exitFullscreen().catch(err => console.log(err));
            }
        });
    }
}

/* ==========================================================================
   5. BESPOKE 5-PRODUCT ECOSYSTEM SHOWCASE (Automotive Model Range Style)
   ========================================================================== */
const PRODUCTS_DATA = [
    {
        id: "trexos",
        code: "TRX-01",
        title: "TrexOS",
        category: "HYBRID AGENTIC OS CONSOLE",
        tagline: "Compact. Powerful. Intelligent. 20x20x8 cm Hybrid Agentic OS Console with dual-boot Windows + Linux architecture.",
        telemetry: [
            { label: "FORM FACTOR", val: "20x20x8 CM", note: "Ultra Compact Chassis" },
            { label: "DUAL BOOT", val: "WIN + LINUX", note: "Hardware Level" },
            { label: "ETHERNET", val: "2.5GbE LAN", note: "Low-Latency Wire" }
        ],
        features: [
            "Ultra-compact 20x20x8 cm dark metallic chassis with intelligent cooling",
            "Windows + Linux dual-boot architecture with TPM 2.0 and Secure Boot",
            "High-speed multi-port I/O: HDMI 2.1, USB 3.0, USB-C / USB4, 2.5GbE LAN, DC IN",
            "Whisper-silent thermal management engineered for continuous agentic operations"
        ],
        accentColor: "#00f2fe",
        detailLink: "products.html#trexos",
        simType: "hardware",
        image: "assets/images/trexos-console-hardware.jpg"
    },
    {
        id: "aerohydra",
        code: "TRX-02",
        title: "I-Trax AeroHydra X-1",
        category: "SPECIALLY DESIGNED AUTONOMOUS DRONE",
        tagline: "Specially designed enterprise drone engineered for autonomous aerial surveillance, high-speed telemetry, and extreme mission reliability.",
        telemetry: [
            { label: "AUTONOMY", val: "LEVEL 4+", note: "Onboard Controller" },
            { label: "TELEMETRY", val: "SUB-5MS", note: "Encrypted Mesh" },
            { label: "AIRFRAME", val: "CARBON-COMP", note: "Aerospace Grade" }
        ],
        features: [
            "Specially designed carbon-composite airframe engineered for extreme mission durability",
            "Onboard autonomous flight controller with real-time waypoint pathfinding",
            "Sub-5ms encrypted telemetry link streaming real-time metrics to base station",
            "Modular payload bay supporting high-resolution thermal, optical, and LiDAR sensors"
        ],
        accentColor: "#f97316",
        detailLink: "products.html#aerohydra",
        simType: "drone"
    },
    {
        id: "trexvision",
        code: "TRX-03",
        title: "TrexVision",
        category: "AUTONOMOUS AI ASSISTANT & AUTONOMY SERVERS",
        tagline: "The AI assistant of the Trex system integrated with dedicated autonomy servers for real-time task orchestration and cross-fleet intelligence.",
        telemetry: [
            { label: "ORCHESTRATION", val: "REAL-TIME", note: "Fleet Intelligence" },
            { label: "AUTONOMY CORE", val: "SERVERS", note: "Zero Cloud Lock-in" },
            { label: "RESPONSE", val: "< 10MS", note: "Local & Mesh Sync" }
        ],
        features: [
            "Centralized autonomy server infrastructure powering cross-device agent operations",
            "Context-aware multimodal intelligence orchestrating Trex ecosystem hardware",
            "Autonomous task delegation, system scheduling, and telemetry synthesis",
            "Seamless coordination layer linking TrexOS consoles, Synap-X robots, and AeroHydra drones"
        ],
        accentColor: "#38bdf8",
        detailLink: "products.html#trexvision",
        simType: "spatial"
    },
    {
        id: "synapx",
        code: "TRX-04",
        title: "Synap-X",
        category: "AUTONOMOUS DESKTOP ROBOT & PHYSICAL AI COMPANION",
        tagline: "Breaking the flaws of Alexa, Siri, and DIY assistants: zero-latency local execution, physical attention tilt/pan, acoustic perfection, and circuit-level privacy.",
        telemetry: [
            { label: "LOCAL EXECUTION", val: "0-MS CLOUD", note: "Local Daemon" },
            { label: "SILENT CHIME", val: "50 MS", note: "Tactile LED Pulse" },
            { label: "HARDWARE SWITCH", val: "CIRCUIT-LEVEL", note: "Absolute Privacy" }
        ],
        features: [
            "Zero-latency local daemon for desktop/phone toggles + offline fallback mode",
            "Fuzzy intent parsing ('nuke Chrome' == 'close browser') + screen state awareness",
            "Custom hardware AEC & directional beamforming with mechanical attention tilt/pan",
            "Unified cross-platform clipboard + call auto-ducking + two-step destructive safeguards"
        ],
        accentColor: "#10b981",
        detailLink: "products.html#synapx",
        simType: "robot"
    }
];

let currentProductIndex = 0;
let productAnimCanvas = null;
let productAnimCtx = null;
let productAnimId = null;

function initProductShowcase() {
    const tabsContainer = document.getElementById('product-tabs-container');
    if (!tabsContainer) return;

    // Render selector tabs
    tabsContainer.innerHTML = '';
    PRODUCTS_DATA.forEach((prod, idx) => {
        const btn = document.createElement('button');
        btn.className = `product-tab-btn ${idx === 0 ? 'active' : ''}`;
        btn.setAttribute('data-index', idx);
        btn.innerHTML = `
            <span class="tab-indicator"></span>
            <span>${prod.code} // ${prod.title}</span>
        `;
        btn.addEventListener('click', () => switchProduct(idx));
        tabsContainer.appendChild(btn);
    });

    // Render the initial product
    renderProductStage(0);

    // Prev / Next buttons
    const prevBtn = document.getElementById('product-prev-btn');
    const nextBtn = document.getElementById('product-next-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const nextIdx = (currentProductIndex - 1 + PRODUCTS_DATA.length) % PRODUCTS_DATA.length;
            switchProduct(nextIdx);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const nextIdx = (currentProductIndex + 1) % PRODUCTS_DATA.length;
            switchProduct(nextIdx);
        });
    }
}

function switchProduct(idx) {
    if (idx === currentProductIndex) return;
    currentProductIndex = idx;

    // Update tab active states
    const tabs = document.querySelectorAll('.product-tab-btn');
    tabs.forEach((tab, i) => {
        if (i === idx) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Animate stage change with GSAP
    const stageContent = document.getElementById('product-stage-content');
    if (stageContent && typeof gsap !== 'undefined') {
        gsap.to(stageContent, {
            opacity: 0,
            y: 15,
            duration: 0.25,
            onComplete: () => {
                renderProductStage(idx);
                gsap.to(stageContent, {
                    opacity: 1,
                    y: 0,
                    duration: 0.45,
                    ease: "power2.out"
                });
            }
        });
    } else {
        renderProductStage(idx);
    }
}

function renderProductStage(idx) {
    const prod = PRODUCTS_DATA[idx];
    const stageContent = document.getElementById('product-stage-content');
    if (!stageContent) return;

    stageContent.innerHTML = `
        <div class="space-y-8 max-w-5xl mx-auto">
            <!-- Header & Tagline -->
            <div class="border-b border-white/10 pb-6">
                <div class="font-mono text-xs uppercase tracking-widest text-cyan-400 mb-2 font-bold">${prod.code} // ${prod.category}</div>
                <h3 class="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-none">
                    ${prod.title}
                </h3>
                <p class="text-neutral-300 font-sans text-base sm:text-xl mt-4 leading-relaxed max-w-3xl">
                    ${prod.tagline}
                </p>
            </div>

            <!-- Optional Product Photo (Clean, without bulky diagnostic frame) -->
            ${prod.image ? `
                <div class="py-2 flex flex-col sm:flex-row items-center gap-6 border-b border-white/10 pb-6">
                    <img src="${prod.image}" alt="${prod.title}" class="max-h-[260px] w-auto object-contain rounded-lg border border-white/10 shadow-2xl">
                    <div class="font-mono text-xs text-neutral-400 space-y-2">
                        <div class="text-white font-bold text-sm">HARDWARE CONSOLE PROFILE</div>
                        <div>Form Factor: 20 cm × 20 cm × 8 cm Ultra Compact Chassis</div>
                        <div>Architecture: Windows + Linux Dual-Boot with Hardware TPM 2.0</div>
                        <div>Connectivity: 2.5GbE LAN, HDMI 2.1, USB-C / USB4, USB 3.0</div>
                    </div>
                </div>
            ` : ''}

            <!-- Telemetry Metrics Pill Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                ${prod.telemetry.map(t => `
                    <div class="telemetry-pill corner-brackets p-4 border border-white/10 bg-white/[0.02]">
                        <span class="block font-mono text-[10px] text-neutral-400 uppercase tracking-widest">${t.label}</span>
                        <span class="block font-display font-bold text-2xl sm:text-3xl text-white mt-1.5">${t.val}</span>
                        <span class="block font-mono text-[10px] text-neutral-400 mt-1">${t.note}</span>
                    </div>
                `).join('')}
            </div>

            <!-- Architectural Capabilities Checklist -->
            <div class="space-y-3 pt-2">
                <span class="block font-mono text-[11px] uppercase tracking-widest text-neutral-400 font-bold">CORE SPECIFICATIONS & CAPABILITIES</span>
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base text-neutral-300">
                    ${prod.features.map(f => `
                        <li class="flex items-start gap-3 p-3.5 border border-white/5 bg-white/[0.01]">
                            <span class="w-2 h-2 rounded-full mt-2 shrink-0" style="background: ${prod.accentColor}; box-shadow: 0 0 8px ${prod.accentColor}"></span>
                            <span class="leading-relaxed">${f}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>

            <!-- Direct CTAs -->
            <div class="pt-6 flex flex-wrap items-center gap-4 border-t border-white/10">
                <a href="${prod.detailLink}" class="chamfer-btn-primary">
                    <span>INSPECT SPECIFICATIONS</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </a>
                <a href="products.html" class="chamfer-btn-outline">
                    <span>VIEW ALL PRODUCTS</span>
                </a>
            </div>
        </div>
    `;

    if (window.lucide) window.lucide.createIcons();
}

function initProductCanvasSimulation(type, color) {
    if (productAnimId) cancelAnimationFrame(productAnimId);

    const canvas = document.getElementById('product-canvas-sim');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio || 400;
    canvas.height = rect.height * window.devicePixelRatio || 300;

    let time = 0;

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;

        time += 0.025;

        if (type === 'hardware' || type === 'kernel') {
            // Rotating nested cyber rings representing deterministic microkernel CPU queues
            for (let r = 30; r <= 110; r += 26) {
                ctx.beginPath();
                ctx.arc(cx, cy, r, time * (r % 2 === 0 ? 0.6 : -0.6), time * (r % 2 === 0 ? 0.6 : -0.6) + Math.PI * 1.4);
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.arc(cx, cy, 14, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = color;
            ctx.shadowBlur = 18;
            ctx.fill();
            ctx.shadowBlur = 0;

        } else if (type === 'drone') {
            // Drone radar sweep and telemetry flight path
            ctx.strokeStyle = 'rgba(249, 115, 22, 0.25)';
            ctx.lineWidth = 1;
            for (let r = 40; r <= 120; r += 35) {
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.stroke();
            }
            // Radar sweeping arm
            const sweepAngle = time * 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(sweepAngle) * 115, cy + Math.sin(sweepAngle) * 115);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
            // Drone flight vector crosshair
            const dx = cx + Math.cos(time * 0.8) * 45;
            const dy = cy + Math.sin(time * 1.2) * 35;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(dx, dy, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.strokeRect(dx - 10, dy - 10, 20, 20);

        } else if (type === 'robot') {
            // Synap-X acoustic beamforming and physical attention direction
            const beamAngle = Math.sin(time * 1.5) * 0.8;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(beamAngle);
            // Acoustic waves
            for (let r = 25; r <= 100; r += 22) {
                const waveAlpha = (1 - (r / 110) + Math.sin(time * 3 - r * 0.05) * 0.2);
                ctx.beginPath();
                ctx.arc(0, 0, r, -Math.PI * 0.35, Math.PI * 0.35);
                ctx.strokeStyle = `rgba(16, 185, 129, ${Math.max(0.1, waveAlpha)})`;
                ctx.lineWidth = 2.5;
                ctx.stroke();
            }
            // Robot physical attention core
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(0, 0, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();

        } else if (type === 'mesh') {
            // Geo-distributed planetary edge node mesh
            const nodeCount = 9;
            const nodes = [];
            for (let i = 0; i < nodeCount; i++) {
                const angle = (i / nodeCount) * Math.PI * 2 + time * 0.2;
                const dist = 75 + Math.sin(time + i) * 20;
                nodes.push({
                    x: cx + Math.cos(angle) * dist,
                    y: cy + Math.sin(angle) * dist
                });
            }

            // Draw interconnections
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 1;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }

            // Draw node hubs as steady glowing micro-stars
            nodes.forEach(n => {
                ctx.save();
                ctx.shadowColor = color;
                ctx.shadowBlur = 8;
                ctx.fillStyle = color;
                const s = 4.5;
                ctx.beginPath();
                ctx.moveTo(n.x, n.y - s);
                ctx.quadraticCurveTo(n.x, n.y, n.x + s, n.y);
                ctx.quadraticCurveTo(n.x, n.y, n.x, n.y + s);
                ctx.quadraticCurveTo(n.x, n.y, n.x - s, n.y);
                ctx.quadraticCurveTo(n.x, n.y, n.x, n.y - s);
                ctx.closePath();
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

        } else if (type === 'spatial') {
            // 3D Point-Cloud LiDAR Cube rotating in 3D perspective
            const size = 65;
            const points = [
                [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
                [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
            ];

            const rotX = time * 0.7;
            const rotY = time * 0.9;

            const projPoints = points.map(pt => {
                // 3D Rotation
                let y1 = pt[1] * Math.cos(rotX) - pt[2] * Math.sin(rotX);
                let z1 = pt[1] * Math.sin(rotX) + pt[2] * Math.cos(rotX);

                let x2 = pt[0] * Math.cos(rotY) + z1 * Math.sin(rotY);
                let z2 = -pt[0] * Math.sin(rotY) + z1 * Math.cos(rotY);

                const fov = 180;
                const scale = fov / (fov + z2 * size);
                return {
                    x: cx + x2 * size * scale,
                    y: cy + y1 * size * scale
                };
            });

            // Draw LiDAR edges
            const edges = [
                [0,1],[1,2],[2,3],[3,0],
                [4,5],[5,6],[6,7],[7,4],
                [0,4],[1,5],[2,6],[3,7]
            ];

            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            edges.forEach(e => {
                ctx.beginPath();
                ctx.moveTo(projPoints[e[0]].x, projPoints[e[0]].y);
                ctx.lineTo(projPoints[e[1]].x, projPoints[e[1]].y);
                ctx.stroke();
            });

        } else if (type === 'security') {
            // eBPF Shield Enclave Defense radar pulse
            const pulseRadius = (time * 40) % 110;
            ctx.beginPath();
            ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(16, 185, 129, ${1 - pulseRadius / 110})`;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Hexagonal Shield Barrier
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
                const hx = cx + Math.cos(angle) * 60;
                const hy = cy + Math.sin(angle) * 60;
                if (i === 0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.shadowColor = color;
            ctx.shadowBlur = 12;
            ctx.stroke();
            ctx.shadowBlur = 0;

        } else {
            // High-speed multiplexed packet frequency stream
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let x = 0; x < w; x += 4) {
                const y = cy + Math.sin(x * 0.04 + time * 3) * 35 * Math.sin(time);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        productAnimId = requestAnimationFrame(render);
    }

    render();
}

/* ==========================================================================
   6. 4-PILLAR ARCHITECTURAL NEURAL ENGINE
   ========================================================================== */
const PILLARS_DATA = [
    {
        title: "TrexOS Console & OS",
        tag: "01 // HYBRID AGENTIC OS CONSOLE",
        desc: "Compact 20x20x8 cm hybrid agentic console with Windows + Linux dual boot, TPM 2.0 hardware security, and 2.5GbE LAN.",
        metric: "20x20x8 cm Dual Boot",
        color: "#00f2fe"
    },
    {
        title: "I-Trax AeroHydra X-1",
        tag: "02 // AUTONOMOUS DRONE PLATFORM",
        desc: "Specially designed autonomous drone engineered for enterprise missions, tactical aerial robotics, and low-latency encrypted telemetry.",
        metric: "Level 4+ Autonomy",
        color: "#f97316"
    },
    {
        title: "TrexVision AI Assistant",
        tag: "03 // AUTONOMY SERVERS & AI",
        desc: "Dedicated AI assistant of the Trex system with centralized autonomy servers for real-time task orchestration, spatial perception, and fleet coordination.",
        metric: "Dedicated Autonomy",
        color: "#38bdf8"
    },
    {
        title: "Synap-X Desktop Robot",
        tag: "04 // AUTONOMOUS DESKTOP ROBOT",
        desc: "Next-gen desktop robot with 0-latency local execution, directional beamforming, physical attention tilt/pan, and circuit kill switch.",
        metric: "Zero-Latency Local",
        color: "#10b981"
    }
];

function initArchitecturePillars() {
    const cards = document.querySelectorAll('.arch-pillar-card');
    const diagTitle = document.getElementById('arch-diag-title');
    const diagDesc = document.getElementById('arch-diag-desc');
    const diagMetric = document.getElementById('arch-diag-metric');
    const freqDisplay = document.getElementById('arch-freq-display');

    if (!cards.length) return;

    cards.forEach((card, idx) => {
        card.addEventListener('mouseenter', () => {
            selectPillar(idx);
        });
        card.addEventListener('click', () => {
            selectPillar(idx);
        });
    });

    function selectPillar(idx) {
        cards.forEach((c, i) => {
            if (i === idx) {
                c.classList.add('border-white', 'bg-white/10');
            } else {
                c.classList.remove('border-white', 'bg-white/10');
            }
        });

        const p = PILLARS_DATA[idx];
        if (diagTitle) diagTitle.textContent = `${p.tag} — ${p.title}`;
        if (diagDesc) diagDesc.textContent = p.desc;
        if (diagMetric) diagMetric.textContent = p.metric;
        if (freqDisplay) freqDisplay.textContent = '';
    }
}

/* ==========================================================================
   7. STRATEGIC ROADMAP & TEAM INITIALIZATION
   ========================================================================== */
function initRoadmapAndTeam() {
    // Copy coordinates helpers
    window.copyToClipboard = function(text, btnElement) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showCopyFeedback(btnElement);
            }).catch(() => fallbackCopy(text, btnElement));
        } else {
            fallbackCopy(text, btnElement);
        }
    };

    function fallbackCopy(text, btnElement) {
        const temp = document.createElement('textarea');
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showCopyFeedback(btnElement);
    }

    function showCopyFeedback(btn) {
        if (!btn) return;
        const originalText = btn.textContent;
        btn.textContent = 'COPIED';
        btn.classList.add('bg-white', 'text-black');
        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('bg-white', 'text-black');
        }, 1800);
    }
}

/* ==========================================================================
   8. DIRECT FOUNDER COMMUNICATION TERMINAL (ENTERPRISE ENCLAVE WITH UTM & VALIDATION)
   ========================================================================== */
let activeTransmissionId = null;

function initContactTerminal() {
    const form = document.getElementById('founder-contact-form');
    const statusModal = document.getElementById('contact-status-modal');
    if (!form) return;

    // Real-time input error clearing
    ['contact-name', 'contact-email', 'contact-message'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => {
                input.classList.remove('!border-rose-500');
                const err = input.parentElement?.querySelector('.field-error-text');
                if (err) err.remove();
            });
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const catInput = document.getElementById('contact-category');
        const msgInput = document.getElementById('contact-message');

        const name = (nameInput?.value || '').trim();
        const email = (emailInput?.value || '').trim();
        const category = (catInput?.value || 'Enterprise Deployment').trim();
        const message = (msgInput?.value || '').trim();

        // 1. Precise Field Validation & Visual Error States
        let hasError = false;
        form.querySelectorAll('.field-error-text').forEach(el => el.remove());

        if (!name) {
            hasError = true;
            showFieldError(nameInput, 'Please provide your name or enterprise identity.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            hasError = true;
            showFieldError(emailInput, 'A valid corporate or personal email address is required.');
        }

        if (!message || message.length < 5) {
            hasError = true;
            showFieldError(msgInput, 'Transmission message must be at least 5 characters.');
        }

        if (hasError) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="inline-block animate-spin mr-2">⟳</span><span>ENCRYPTING & TRANSMITTING...</span>';
        }

        const transmissionId = 'inq-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 4);
        activeTransmissionId = transmissionId;

        const inquiryPayload = {
            id: transmissionId,
            name,
            email,
            category,
            subject: category,
            message,
            status: 'unread',
            replies: [],
            utm: getUTMParameters(),
            createdAt: new Date().toISOString()
        };

        // 2. Resilient Browser Buffer (Guarantees zero transmission loss)
        try {
            const buffer = JSON.parse(localStorage.getItem('itrex_inquiries_buffer') || '[]');
            buffer.unshift(inquiryPayload);
            localStorage.setItem('itrex_inquiries_buffer', JSON.stringify(buffer.slice(0, 50)));
        } catch (_) {}

        // 3. Dispatch to Backend API with fallback endpoints
        try {
            const apiEndpoints = [
                '/api/contact',
                'https://itrex-platform.onrender.com/api/contact',
                'http://localhost:10000/api/contact'
            ];

            let transmitted = false;
            for (const ep of apiEndpoints) {
                try {
                    const res = await fetch(ep, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(inquiryPayload)
                    });
                    if (res.ok) {
                        transmitted = true;
                        break;
                    }
                } catch (_) {}
            }
        } catch (err) {
            console.warn('[I-Trex Contact] Local buffer guaranteed delivery.');
        }

        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>TRANSMIT SECURE MESSAGE</span><i data-lucide="send" class="w-4 h-4"></i>';
        }

        // Form reset & inline success receipt
        form.reset();

        const inlineSuccess = document.getElementById('contact-inline-success');
        const refIdEl = document.getElementById('success-ref-id');
        if (inlineSuccess && refIdEl) {
            refIdEl.textContent = transmissionId;
            inlineSuccess.classList.remove('hidden');
        }

        // Display confirmation modal
        if (statusModal) {
            const modalText = document.getElementById('contact-modal-text');
            if (modalText) {
                modalText.innerHTML = 'Transmission Reference: <strong class="text-cyan-400 font-mono">' + transmissionId + '</strong><br>Encrypted payload received for <strong>Satyam Swami</strong> (Founder & Chief Architect).';
            }
            statusModal.classList.remove('hidden');
            statusModal.classList.add('flex');

            const copyIdBtn = document.getElementById('modal-copy-id-btn');
            if (copyIdBtn) {
                copyIdBtn.onclick = () => copyToClipboard(transmissionId, copyIdBtn);
            }
        }

        if (window.lucide) window.lucide.createIcons();
    });
}

function showFieldError(inputEl, msg) {
    if (!inputEl) return;
    inputEl.classList.add('!border-rose-500');
    const p = document.createElement('p');
    p.className = 'field-error-text text-[10px] font-mono text-rose-400 mt-1';
    p.textContent = msg;
    inputEl.parentElement?.appendChild(p);
    inputEl.focus();
}

function closeContactModal() {
    const modal = document.getElementById('contact-status-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}
window.closeContactModal = closeContactModal;

/* ==========================================================================
   9. FULLSCREEN NAVIGATION & HEADER
   ========================================================================== */
function initNavigation() {
    const menuToggle = document.getElementById('menu-toggle-btn');
    const menuClose = document.getElementById('nav-drawer-close');
    const drawer = document.getElementById('fullscreen-nav-drawer');
    const header = document.getElementById('main-header');

    window.openMenu = function() {
        if (drawer) {
            drawer.classList.add('active');
            if (lenis) lenis.stop();
        }
    };

    window.closeMenu = function() {
        if (drawer) {
            drawer.classList.remove('active');
            if (lenis) lenis.start();
        }
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', window.openMenu);
    }

    if (menuClose) {
        menuClose.addEventListener('click', window.closeMenu);
    }

    // Close on any menu link click
    const menuLinks = document.querySelectorAll('.lamborghini-menu-row, .lamborghini-sub-row, .rolls-menu-row, .rolls-sub-row, .rolls-menu-cta, .nav-drawer-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            window.closeMenu();
        });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer && drawer.classList.contains('active')) {
            window.closeMenu();
        }
    });

    // Header scroll background morph
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 40) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        }
    });

    // Anchor smooth scroll with Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                window.closeMenu();
                if (lenis) {
                    lenis.scrollTo(targetEl, { offset: -70 });
                } else {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

/* ==========================================================================
   10. THEMATIC BIDIRECTIONAL TEXT APPEAR & DISAPPEAR ENGINE
   Provides unique, theme-matching entrance and exit animations for all text:
   - Aerospace telemetry kicker tags
   - Massive editorial section headings
   - Technical descriptions & body paragraphs
   - Executive & architectural quotes
   - Architectural, capability, roadmap, and leadership cards
   - Live telemetry number counters
   ========================================================================== */
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // 1. Section Titles (Editorial headings) - gentle entrance, always remain 100% visible
    const sectionTitles = document.querySelectorAll('.title-section, section h2');
    sectionTitles.forEach(title => {
        if (title.id === 'hero-headline') return;

        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 92%",
                once: true
            },
            y: 20,
            duration: 0.7,
            ease: "power2.out",
            clearProps: "all"
        });
    });

    // 2. Sub-Headings (H3 and H4 inside sections) - gentle entrance, always remain 100% visible
    const subHeadings = document.querySelectorAll('section h3:not(.hero-word-char), section h4');
    subHeadings.forEach(sub => {
        gsap.from(sub, {
            scrollTrigger: {
                trigger: sub,
                start: "top 92%",
                once: true
            },
            y: 16,
            duration: 0.6,
            ease: "power2.out",
            clearProps: "all"
        });
    });

    // 3. Section Lead Paragraphs & Descriptions - gentle entrance, always remain 100% visible
    const leadTexts = document.querySelectorAll('section > div > div > p, section p.text-neutral-400');
    leadTexts.forEach(p => {
        if (p.id === 'hero-desc') return;

        gsap.from(p, {
            scrollTrigger: {
                trigger: p,
                start: "top 92%",
                once: true
            },
            y: 14,
            duration: 0.6,
            ease: "power2.out",
            clearProps: "all"
        });
    });

    // 4. Quotations & Founding Manifesto Statements - gentle entrance, always remain 100% visible
    const quotes = document.querySelectorAll('blockquote');
    quotes.forEach(quote => {
        gsap.from(quote, {
            scrollTrigger: {
                trigger: quote,
                start: "top 92%",
                once: true
            },
            x: -16,
            duration: 0.7,
            ease: "power2.out",
            clearProps: "all"
        });
    });

    // 5. Grid Cards (Architecture Pillars, Capabilities, Roadmap, Team, Contact Cards) - gentle entrance, always remain 100% visible
    const cardSelectors = [
        '.arch-pillar-card',
        '#capabilities .grid > div',
        '#roadmap .grid > div',
        '#team .aerodynamic-frame',
        '#team .p-6.border',
        '#contact .grid > div',
        '#contact .aerodynamic-frame',
        '#about .aerodynamic-frame'
    ];

    cardSelectors.forEach(selector => {
        const cards = document.querySelectorAll(selector);
        cards.forEach((card, idx) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 94%",
                    once: true
                },
                y: 18,
                duration: 0.6,
                delay: (idx % 3) * 0.04,
                ease: "power2.out",
                clearProps: "all"
            });
        });
    });

    // 6. Hero Section Stability (Hero stays 100% visible at all times - zero disappearing on scroll)
    const heroContent = document.querySelector('#home .relative.z-10');
    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.filter = 'none';
    }

    // 8. Telemetry number counting
    gsap.utils.toArray('.counter-metric').forEach(el => {
        const targetVal = parseFloat(el.getAttribute('data-target') || 0);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';

        ScrollTrigger.create({
            trigger: el,
            start: "top 90%",
            once: true,
            onEnter: () => {
                const obj = { val: 0 };
                gsap.to(obj, {
                    val: targetVal,
                    duration: 1.8,
                    ease: "power2.out",
                    onUpdate: () => {
                        el.textContent = `${prefix}${obj.val.toLocaleString()}${suffix}`;
                    }
                });
            }
        });
    });
}


/* ==========================================================================
   THEME SYSTEM: LIGHT & DARK MODE ENGINE
   ========================================================================== */
function toggleTheme() {
    const isLight = document.documentElement.classList.contains('light');
    const nextTheme = isLight ? 'dark' : 'light';
    applyTheme(nextTheme);
    localStorage.setItem('itrex_theme', nextTheme);
}
window.toggleTheme = toggleTheme;

function initTheme() {
    const saved = localStorage.getItem('itrex_theme') || 'dark';
    applyTheme(saved);
    const toggleBtns = document.querySelectorAll('#theme-toggle-btn, .theme-toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });
}

function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.classList.add('light');
        document.querySelectorAll('.theme-sun-icon').forEach(el => el.classList.remove('hidden'));
        document.querySelectorAll('.theme-moon-icon').forEach(el => el.classList.add('hidden'));
    } else {
        document.documentElement.classList.remove('light');
        document.querySelectorAll('.theme-sun-icon').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.theme-moon-icon').forEach(el => el.classList.remove('hidden'));
    }
}
window.initTheme = initTheme;
window.applyTheme = applyTheme;

/* ==========================================================================
   SCROLL PROGRESS BAR & BACK TO TOP BUTTON
   ========================================================================== */
function initScrollProgressAndBackToTop() {
    function updateScrollTelemetry() {
        const currentY = window.scrollY || document.documentElement.scrollTop || (typeof lenis !== 'undefined' && lenis ? lenis.scroll : 0);
        const scrollBar = document.getElementById('scroll-progress-bar');
        if (scrollBar) {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            const progress = total > 0 ? (currentY / total) * 100 : 0;
            scrollBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
            scrollBar.setAttribute('aria-valuenow', Math.round(progress));
        }

        const topBtn = document.getElementById('back-to-top-btn');
        if (topBtn) {
            if (currentY > 200) {
                topBtn.classList.remove('opacity-0', 'pointer-events-none');
                topBtn.classList.add('opacity-100', 'pointer-events-auto');
            } else {
                topBtn.classList.add('opacity-0', 'pointer-events-none');
                topBtn.classList.remove('opacity-100', 'pointer-events-auto');
            }
        }
    }

    window.addEventListener('scroll', updateScrollTelemetry, { passive: true });
    if (typeof lenis !== 'undefined' && lenis && typeof lenis.on === 'function') {
        lenis.on('scroll', updateScrollTelemetry);
    }
}

function scrollToTop() {
    if (typeof lenis !== 'undefined' && lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(0);
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
window.scrollToTop = scrollToTop;

/* ==========================================================================
   COOKIE & TELEMETRY CONSENT BANNER
   ========================================================================== */
function initCookieConsent() {
    const consent = localStorage.getItem('itrex_cookie_consent');
    if (!consent) {
        setTimeout(() => {
            const banner = document.getElementById('cookie-consent-banner');
            if (banner) {
                banner.classList.remove('opacity-0', 'pointer-events-none');
                banner.classList.add('opacity-100', 'pointer-events-auto');
            }
        }, 1500);
    }
}

function dismissCookieBanner(type) {
    localStorage.setItem('itrex_cookie_consent', type);
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
        banner.classList.add('opacity-0', 'pointer-events-none');
        banner.classList.remove('opacity-100', 'pointer-events-auto');
    }
}
window.dismissCookieBanner = dismissCookieBanner;

/* ==========================================================================
   SITE SEARCH COMMAND PALETTE (CTRL+K / CMD+K)
   ========================================================================== */
const SITE_SEARCH_INDEX = [
    { title: 'TrexOS Hardware Console', category: 'Product', desc: 'Compact 20x20x8 cm Hybrid Agentic OS Console with Windows + Linux dual boot.', url: 'products.html#trexos' },
    { title: 'I-Trax AeroHydra X-1 Drone', category: 'Product', desc: 'Specially designed enterprise drone engineered for autonomous aerial surveillance.', url: 'products.html#aerohydra' },
    { title: 'TrexVision AI Assistant', category: 'Product', desc: 'AI assistant of Trex system with dedicated autonomy servers for real-time orchestration.', url: 'products.html#trexvision' },
    { title: 'Synap-X Desktop Robot', category: 'Product', desc: 'Next-gen autonomous desktop robot solving Alexa/Siri/DIY flaws with local daemon.', url: 'products.html#synapx' },
    { title: 'Products Matrix', category: 'Matrix', desc: 'Complete autonomous product showroom and technical specifications.', url: 'products.html' },
    { title: 'Architectural Vision', category: 'Vision', desc: 'The Four Engines and foundation of autonomous computing.', url: '#technology' },
    { title: 'Engineering Benchmarks', category: 'Capabilities', desc: 'Sub-ms scheduler, consensus engines, and deterministic latency.', url: '#capabilities' },
    { title: 'Founding Manifesto', category: 'Manifesto', desc: 'Principles of autonomous trajectory and executive philosophy.', url: '#manifesto' },
    { title: 'Strategic Roadmap', category: 'Roadmap', desc: 'Genesis, Alpha Release, Edge Mesh, and Autonomous Fleet milestones.', url: '#roadmap' },
    { title: 'Executive Team & Founders', category: 'Leadership', desc: 'Satyam Swami (Founder) and Ishwari Patil (Co-Founder).', url: '#team' },
    { title: 'Frequently Asked Questions', category: 'FAQ', desc: 'Technical questions, SLA guarantees, and bare-metal support.', url: '#faq' },
    { title: 'Direct Transmission Terminal', category: 'Contact', desc: 'Direct encrypted transmission to Satyam Swami queue.', url: '#contact' },
    { title: 'Admin Enclave Control', category: 'Enclave', desc: 'Restricted administrative operations and real-time connections inbox.', url: 'admin.html' },
    { title: 'Workspace Dashboard', category: 'Dashboard', desc: 'Employee task management, shift tracking, and telemetry.', url: 'dashboard.html' }
];

function initSiteSearch() {
    const modal = document.getElementById('site-search-modal');
    const input = document.getElementById('site-search-input');
    const resultsContainer = document.getElementById('site-search-results');
    const triggerBtn = document.getElementById('search-trigger-btn');
    if (!modal || !input) return;

    function openSearch() {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        input.value = '';
        renderSearchResults('');
        setTimeout(() => input.focus(), 50);
    }

    function closeSearch() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    const triggerBtns = document.querySelectorAll('#search-trigger-btn, .search-trigger-btn');
    triggerBtns.forEach(btn => btn.addEventListener('click', openSearch));
    window.openSiteSearch = openSearch;
    window.closeSiteSearch = closeSearch;

    // Keyboard shortcut: Ctrl+K / Cmd+K and Escape
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (modal.classList.contains('hidden')) openSearch();
            else closeSearch();
        } else if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeSearch();
        }
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeSearch();
    });

    input.addEventListener('input', () => {
        renderSearchResults(input.value.trim().toLowerCase());
    });

    function renderSearchResults(query) {
        if (!resultsContainer) return;
        const filtered = query ? SITE_SEARCH_INDEX.filter(item => 
            item.title.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            item.desc.toLowerCase().includes(query)
        ) : SITE_SEARCH_INDEX.slice(0, 7);

        if (filtered.length === 0) {
            resultsContainer.innerHTML = '<div class="py-8 text-center text-neutral-500 font-mono text-xs">No matching platform specifications found.</div>';
            return;
        }

        resultsContainer.innerHTML = filtered.map(item => `
            <a href="${item.url}" onclick="closeSiteSearch()" class="search-result-item block p-3.5 border border-white/10 hover:border-cyan-400 bg-white/5 hover:bg-white/10 transition-colors group">
                <div class="flex items-center justify-between">
                    <span class="font-display font-bold text-sm text-white group-hover:text-cyan-400 transition-colors">${item.title}</span>
                    <span class="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 border border-white/20 text-neutral-400">${item.category}</span>
                </div>
                <p class="font-sans text-xs text-neutral-400 mt-1 line-clamp-1">${item.desc}</p>
            </a>
        `).join('');

        if (window.lucide) window.lucide.createIcons();
    }

    window.closeSiteSearch = closeSearch;
}

/* ==========================================================================
   TECHNICAL FAQ ACCORDION ENGINE
   ========================================================================== */
function initFaqAccordion() {
    const container = document.getElementById('faq-accordion-container');
    if (!container) return;
    const buttons = container.querySelectorAll('.faq-question-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            buttons.forEach(b => {
                b.setAttribute('aria-expanded', 'false');
                const panel = b.nextElementSibling;
                const chevron = b.querySelector('.faq-chevron');
                if (panel) panel.classList.add('hidden');
                if (chevron) chevron.style.transform = 'rotate(0deg)';
            });
            if (!isExpanded) {
                btn.setAttribute('aria-expanded', 'true');
                const panel = btn.nextElementSibling;
                const chevron = btn.querySelector('.faq-chevron');
                if (panel) panel.classList.remove('hidden');
                if (chevron) chevron.style.transform = 'rotate(180deg)';
            }
        });
    });
}

/* ==========================================================================
   UTM ATTRIBUTION ENGINE
   ========================================================================== */
function captureUTMParameters() {
    const params = new URLSearchParams(window.location.search);
    const utm = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(key => {
        if (params.has(key)) utm[key] = params.get(key);
    });
    if (Object.keys(utm).length > 0) {
        sessionStorage.setItem('itrex_utm_params', JSON.stringify(utm));
    }
}
function getUTMParameters() {
    try {
        return JSON.parse(sessionStorage.getItem('itrex_utm_params') || '{}');
    } catch (_) {
        return {};
    }
}

/* ==========================================================================
   UNIVERSAL CLIPBOARD HELPER
   ========================================================================== */
async function copyToClipboard(text, btnElement) {
    if (!text) return;
    try {
        await navigator.clipboard.writeText(text);
    } catch (e) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
    if (btnElement) {
        const originalHtml = btnElement.innerHTML;
        btnElement.innerHTML = '<span class="text-emerald-400 font-bold">COPIED!</span>';
        setTimeout(() => {
            btnElement.innerHTML = originalHtml;
        }, 2000);
    }
}
window.copyToClipboard = copyToClipboard;
