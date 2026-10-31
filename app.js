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

        // PHASE 1: Initial Appearance (0.0s - 1.0s) - Prominent logo fade-in & scale
        tl.fromTo(logoImg, 
            { opacity: 0, scale: 0.90, filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.25))' },
            { opacity: 1, scale: 1.0, filter: 'drop-shadow(0 0 45px rgba(255,255,255,0.55))', duration: 1.0, ease: "power2.out" },
            0
        )
        // PHASE 2: Brand Typography Reveal (0.8s - 1.6s)
        .fromTo(brandText,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
            0.8
        )
        // Extended +3.0s Majestic Presentation with Ambient Specular Breathing (1.6s - 4.8s)
        .to(logoImg, {
            scale: 1.025,
            filter: 'drop-shadow(0 0 65px rgba(0,242,254,0.45)) drop-shadow(0 0 30px rgba(255,255,255,0.7))',
            duration: 1.6,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 1
        }, 1.6)
        // PHASE 3: Seamless Dissolve & Overlap (Starts at 4.8s — exactly +3.0s extended from original 1.8s)
        .to(preloader, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onStart: () => {
                // PHASE 4: Seamless Homepage Reveal overlaps with preloader dissolve
                triggerHeroHeadlineAnimation();
            },
            onComplete: () => {
                isDismissed = true;
                sessionStorage.setItem('itrex_intro_seen', 'true');
                if (preloader.parentNode) preloader.remove();
            }
        }, 4.8);

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
        const timer = setTimeout(completeIntro, 5600); // Extended by 3000ms
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
        category: "DETERMINISTIC NEURAL MICROKERNEL",
        tagline: "Sub-millisecond thread scheduling, zero-trust hardware memory isolation, and predictive neural load balancing.",
        telemetry: [
            { label: "CONTEXT SWITCH", val: "0.35 ms", note: "Deterministic Guarantee" },
            { label: "ISOLATION LEVEL", val: "RING 0", note: "Hardware Enclave" },
            { label: "MEMORY OVERHEAD", val: "1.4 MB", note: "Bare-Metal Rust" }
        ],
        features: [
            "Predictive neural task scheduler pre-empting execution spikes",
            "Zero-trust microkernel memory isolation with hardware enclaves",
            "Hardware-level DMA validation bypassing OS kernel bloat",
            "Autonomous self-governing sandbox for distributed agent fleets"
        ],
        accentColor: "#00f2fe",
        detailLink: "products.html#trexos",
        simType: "kernel"
    },
    {
        id: "trexcore",
        code: "TRX-02",
        title: "TrexCore",
        category: "PLANETARY EDGE CLOUD FABRIC & STATE MESH",
        tagline: "Geo-distributed serverless runtime synchronizing state in sub-12ms across worldwide nodes with peer-to-peer mTLS WireGuard mesh.",
        telemetry: [
            { label: "GLOBAL SYNC", val: "11.4 ms", note: "Worldwide Median" },
            { label: "EDGE PRESENCE", val: "180+ POPS", note: "Anycast Routed" },
            { label: "FAILOVER TIME", val: "< 45 ms", note: "Zero Packet Loss" }
        ],
        features: [
            "Hyper-converged distributed compute mesh with automated geo-sharding",
            "Sub-12ms global state reconciliation via WireGuard mTLS fabric",
            "Cold starts reduced to under 2ms globally with instant memory resume",
            "Autonomous multi-cloud failover and compliance residency guarantees"
        ],
        accentColor: "#f97316",
        detailLink: "products.html#trexcore",
        simType: "mesh"
    },
    {
        id: "trexvision",
        code: "TRX-03",
        title: "TrexVision",
        category: "SPATIAL INTELLIGENCE & SLAM ENGINE",
        tagline: "Multimodal 3D spatial perception, point-cloud odometry, and visual telemetry processing locked at 120 FPS on local edge silicons.",
        telemetry: [
            { label: "FRAME RATE", val: "120 FPS", note: "Zero Jitter Sync" },
            { label: "ODOMETRY DRIFT", val: "< 0.04%", note: "Full Trajectory" },
            { label: "SENSOR FUSION", val: "LIDAR+RGBD", note: "Hardware Native" }
        ],
        features: [
            "WebGPU/Vulkan accelerated real-time 3D pose and environment meshing",
            "Multimodal sensor fusion combining LiDAR, stereo optics, and IMU",
            "Low-precision quantized neural inference running directly at the edge",
            "Zero cloud telemetry leakage mode for aerospace, robotics, and defense"
        ],
        accentColor: "#38bdf8",
        detailLink: "products.html#trexvision",
        simType: "spatial"
    },
    {
        id: "trexshield",
        code: "TRX-04",
        title: "TrexShield",
        category: "EBPF ZERO-TRUST HARDWARE ENCLAVE & DEFENSE",
        tagline: "Autonomous kernel-level threat isolation utilizing eBPF system call verification with sub-4ms automated container quarantine.",
        telemetry: [
            { label: "QUARANTINE SPEED", val: "3.8 ms", note: "Autonomous Response" },
            { label: "EBPF INTROSPECTION", val: "100%", note: "Kernel Syscall Coverage" },
            { label: "COMPLIANCE LEVEL", val: "FEDRAMP", note: "ISO 27001 Cryptographic" }
        ],
        features: [
            "Autonomous kernel honeypot injection upon unauthorized probe detection",
            "Zero-overhead eBPF packet introspection and memory boundary locks",
            "Instant cryptographic quarantine of compromised micro-containers",
            "Real-time compliance attestations generated directly at Ring 0"
        ],
        accentColor: "#10b981",
        detailLink: "products.html#trexshield",
        simType: "security"
    },
    {
        id: "trexconnect",
        code: "TRX-05",
        title: "TrexConnect",
        category: "ULTRA-LOW LATENCY MULTIPLEXED PROTOCOL MESH",
        tagline: "High-throughput binary protocol engine bridging edge robotics fleets, IoT gateways, and telemetry pipelines with zero-copy serialization.",
        telemetry: [
            { label: "THROUGHPUT", val: "1.8M MSG/S", note: "Saturated Wire Speed" },
            { label: "SERIALIZATION", val: "ZERO-COPY", note: "Direct DMA Buffer" },
            { label: "TRANSPORT", val: "QUIC/TLS 1.3", note: "Quantum-Resistant" }
        ],
        features: [
            "Zero-copy binary packet serialization bypassing userland memory copies",
            "Multiplexed bidirectional QUIC and TLS 1.3 encrypted event channels",
            "Cross-cloud VPC bridging with sub-millisecond edge queue dispatch",
            "Telemetry multiplexing engineered for drone fleets and industrial automation"
        ],
        accentColor: "#e2e8f0",
        detailLink: "products.html#trexconnect",
        simType: "protocol"
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
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <!-- Left Editorial & Specifications Column -->
            <div class="lg:col-span-7 space-y-8">
                <div>
                    <div class="flex items-center gap-3 mb-3">
                        <span class="tech-tag" style="--color-neon-cyan: ${prod.accentColor}">${prod.code} // ${prod.category}</span>
                    </div>
                    <h3 class="font-display font-extrabold text-4xl sm:text-6xl text-white uppercase tracking-tight leading-none">
                        ${prod.title}
                    </h3>
                    <p class="text-neutral-400 font-sans text-base sm:text-lg mt-4 leading-relaxed max-w-2xl">
                        ${prod.tagline}
                    </p>
                </div>

                <!-- Real-time Telemetry Metrics Pill Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    ${prod.telemetry.map(t => `
                        <div class="telemetry-pill corner-brackets">
                            <span class="block font-mono text-[10px] text-neutral-400 uppercase tracking-widest">${t.label}</span>
                            <span class="block font-display font-bold text-xl sm:text-2xl text-white mt-1">${t.val}</span>
                            <span class="block font-mono text-[9px] text-neutral-500 mt-0.5">${t.note}</span>
                        </div>
                    `).join('')}
                </div>

                <!-- Architectural Capabilities Checklist -->
                <div class="space-y-3 pt-2">
                    <span class="block font-mono text-[11px] uppercase tracking-widest text-neutral-400">ENGINEERING SPECIFICATIONS</span>
                    <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-neutral-300">
                        ${prod.features.map(f => `
                            <li class="flex items-start gap-2.5">
                                <span class="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" style="background: ${prod.accentColor}; box-shadow: 0 0 8px ${prod.accentColor}"></span>
                                <span class="font-sans leading-snug">${f}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <!-- Direct CTA to Dedicated Products Experience -->
                <div class="pt-4 flex flex-wrap items-center gap-4">
                    <a href="${prod.detailLink}" class="chamfer-btn-primary">
                        <span>INSPECT SPECIFICATIONS</span>
                        <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </a>
                    <a href="products.html" class="chamfer-btn-outline">
                        <span>VIEW ALL PRODUCTS</span>
                    </a>
                </div>
            </div>

            <!-- Right Interactive Graphic Canvas Stage -->
            <div class="lg:col-span-5 relative">
                <div class="aerodynamic-frame p-6 sm:p-8 min-h-[380px] sm:min-h-[440px] flex flex-col justify-between relative overflow-hidden">
                    <!-- Top HUD Label -->
                    <div class="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-[10px] text-neutral-400">
                        <span class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full animate-ping" style="background: ${prod.accentColor}"></span>
                            SYSTEM DIAGNOSTIC ACTIVE
                        </span>
                        <span>FREQ: 120.00 GHZ</span>
                    </div>

                    <!-- Canvas Graphic Simulation -->
                    <div class="relative w-full h-[260px] sm:h-[300px] flex items-center justify-center">
                        <canvas id="product-canvas-sim" class="w-full h-full"></canvas>
                        
                        <!-- Center Floating Badge -->
                        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span class="font-display font-black text-6xl sm:text-7xl opacity-10 text-white select-none">
                                ${prod.code}
                            </span>
                        </div>
                    </div>

                    <!-- Bottom Status Bar -->
                    <div class="border-t border-white/10 pt-3 flex items-center justify-between font-mono text-[10px] text-neutral-400">
                        <span>ARCH: BARE-METAL POSIX-FREE</span>
                        <span style="color: ${prod.accentColor}">READY // 100% HEALTH</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    initProductCanvasSimulation(prod.simType, prod.accentColor);
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

        if (type === 'kernel') {
            // Rotating nested cyber rings representing deterministic microkernel CPU queues
            for (let r = 30; r <= 110; r += 26) {
                ctx.beginPath();
                ctx.arc(cx, cy, r, time * (r % 2 === 0 ? 0.6 : -0.6), time * (r % 2 === 0 ? 0.6 : -0.6) + Math.PI * 1.4);
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            // Central Ring 0 Core
            ctx.beginPath();
            ctx.arc(cx, cy, 14, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = color;
            ctx.shadowBlur = 18;
            ctx.fill();
            ctx.shadowBlur = 0;

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
        title: "TrexOS Kernel",
        tag: "01 // DETERMINISTIC MICROKERNEL",
        desc: "Sub-millisecond thread scheduling with zero-trust hardware memory isolation and Rust-native safety guarantees.",
        metric: "0.35ms Latency",
        color: "#00f2fe"
    },
    {
        title: "TrexCore Mesh",
        tag: "02 // PLANETARY STATE FABRIC",
        desc: "Geo-distributed serverless runtime synchronizing distributed state across 180+ global edge pops in sub-12ms.",
        metric: "11.4ms Global Sync",
        color: "#f97316"
    },
    {
        title: "TrexShield SecOps",
        tag: "03 // EBPF KERNEL ENCLAVE",
        desc: "Autonomous system call introspection with automated threat quarantine in under 4ms and cryptographic attestations.",
        metric: "3.8ms Quarantine",
        color: "#10b981"
    },
    {
        title: "TrexVision SLAM",
        tag: "04 // SPATIAL PERCEPTION ENGINE",
        desc: "120 FPS 3D odometry, LiDAR & RGB-D sensor fusion, and spatial telemetry pipeline for autonomous robotics.",
        metric: "120 FPS Locked",
        color: "#38bdf8"
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
        if (freqDisplay) freqDisplay.textContent = `PULSE ACTIVE: ${(64.28 + idx * 8.4).toFixed(2)} GHz`;
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
   8. DIRECT FOUNDER COMMUNICATION TERMINAL
   ========================================================================== */
function initContactTerminal() {
    const form = document.getElementById('founder-contact-form');
    const statusModal = document.getElementById('contact-status-modal');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('contact-name')?.value || 'Guest';
        const email = document.getElementById('contact-email')?.value || '';
        const category = document.getElementById('contact-category')?.value || 'Inquiry';
        const message = document.getElementById('contact-message')?.value || '';

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>TRANSMITTING TLS 1.3...</span>`;
        }

        let transmissionId = '0x' + Math.random().toString(16).substring(2, 10).toUpperCase();

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, category, message })
            });
            const data = await res.json();
            if (data && data.id) {
                transmissionId = data.id.toUpperCase();
            }
        } catch (err) {
            console.warn('[I-Trex Contact] Local fallback used:', err);
        }

        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>TRANSMIT SECURE MESSAGE</span><i data-lucide="send" class="w-4 h-4"></i>`;
        }

        // Reset form
        form.reset();

        // Display confirmation modal
        if (statusModal) {
            const modalText = document.getElementById('contact-modal-text');
            if (modalText) {
                modalText.innerHTML = `
                    Transmission ID: <strong>${transmissionId}</strong><br>
                    Encrypted payload for <strong>Satyam</strong> (Founder & Chief Systems Architect) queued successfully.
                `;
            }
            statusModal.classList.remove('hidden');
            statusModal.classList.add('flex');
        } else {
            alert(`Transmission sent directly to Satyam (satys9267@gmail.com). We will reach out to ${email} shortly.`);
        }

        if (window.lucide) window.lucide.createIcons();
    });

    window.closeContactModal = function() {
        if (statusModal) {
            statusModal.classList.add('hidden');
            statusModal.classList.remove('flex');
        }
    };
}

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
    const menuLinks = document.querySelectorAll('.lamborghini-menu-row, .lamborghini-sub-row, .nav-drawer-link');
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

    // 1. Kicker Tech Tags (Aerospace telemetry acquisition)
    const techTags = document.querySelectorAll('.tech-tag');
    techTags.forEach(tag => {
        gsap.fromTo(tag,
            { y: 16, opacity: 0, filter: "blur(4px)", letterSpacing: "0.14em" },
            {
                scrollTrigger: {
                    trigger: tag,
                    start: "top 90%",
                    end: "bottom 10%",
                    toggleActions: "play reverse play reverse"
                },
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                letterSpacing: "0.22em",
                duration: 0.75,
                ease: "power2.out"
            }
        );
    });

    // 2. Section Titles (Editorial headings)
    const sectionTitles = document.querySelectorAll('.title-section, section h2');
    sectionTitles.forEach(title => {
        // Skip hero headline which has its own word-by-word masked reveal
        if (title.id === 'hero-headline') return;

        gsap.fromTo(title,
            { y: 35, opacity: 0, filter: "blur(6px)" },
            {
                scrollTrigger: {
                    trigger: title,
                    start: "top 88%",
                    end: "bottom 10%",
                    toggleActions: "play reverse play reverse"
                },
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.85,
                ease: "power3.out"
            }
        );
    });

    // 3. Sub-Headings (H3 and H4 inside sections)
    const subHeadings = document.querySelectorAll('section h3:not(.hero-word-char), section h4');
    subHeadings.forEach(sub => {
        gsap.fromTo(sub,
            { y: 22, opacity: 0, filter: "blur(4px)" },
            {
                scrollTrigger: {
                    trigger: sub,
                    start: "top 90%",
                    end: "bottom 10%",
                    toggleActions: "play reverse play reverse"
                },
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.75,
                ease: "power2.out"
            }
        );
    });

    // 4. Section Lead Paragraphs & Descriptions
    const leadTexts = document.querySelectorAll('section > div > div > p, section p.text-neutral-400');
    leadTexts.forEach(p => {
        if (p.id === 'hero-desc') return;

        gsap.fromTo(p,
            { y: 22, opacity: 0, filter: "blur(4px)" },
            {
                scrollTrigger: {
                    trigger: p,
                    start: "top 88%",
                    end: "bottom 10%",
                    toggleActions: "play reverse play reverse"
                },
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.8,
                ease: "power3.out"
            }
        );
    });

    // 5. Quotations & Founding Manifesto Statements
    const quotes = document.querySelectorAll('blockquote');
    quotes.forEach(quote => {
        gsap.fromTo(quote,
            { x: -28, opacity: 0, filter: "blur(6px)" },
            {
                scrollTrigger: {
                    trigger: quote,
                    start: "top 88%",
                    end: "bottom 10%",
                    toggleActions: "play reverse play reverse"
                },
                x: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.95,
                ease: "power3.out"
            }
        );
    });

    // 6. Grid Cards (Architecture Pillars, Capabilities, Roadmap, Team, Contact Cards)
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
            gsap.fromTo(card,
                { y: 28, opacity: 0, filter: "blur(4px)" },
                {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%",
                        end: "bottom 10%",
                        toggleActions: "play reverse play reverse"
                    },
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 0.8,
                    delay: (idx % 3) * 0.05,
                    ease: "power3.out"
                }
            );
        });
    });

    // 7. Hero Section Exit / Re-enter Transition
    const heroContent = document.querySelector('#home .relative.z-10');
    if (heroContent) {
        gsap.to(heroContent, {
            scrollTrigger: {
                trigger: '#home',
                start: "center center",
                end: "bottom 15%",
                scrub: 1.2
            },
            y: -50,
            opacity: 0,
            filter: "blur(6px)"
        });
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
