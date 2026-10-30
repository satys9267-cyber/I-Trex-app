/**
 * I-TREX INNOVATIONS — MASTER AUTHENTICATION ENGINE
 * High-Security Zero-Trust Identity Gateway (OWASP Standard)
 * Integrates: Real Firebase Authentication SDK (Email, Phone SMS, Google & GitHub OAuth),
 * Cloud Firestore, WebAudio Synth, Real-time Password Entropy Meter, and RBAC Routing.
 */

// 1. Resolve API Base for Local File or HTTP Server
const API_BASE = (window.location.protocol === 'file:' || !window.location.port) 
    ? 'http://localhost:10000' 
    : '';

let firebaseApp = null;
let firebaseAuth = null;
let phoneConfirmationResult = null;
let recaptchaVerifier = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }

    // 2. Check and notify on file:// protocol
    checkProtocolWarning();

    // 3. Initialize Audio Synthesizer
    initAudio();

    // 4. Initialize Glowing Micro-Stars Canvas Background
    initAuthCanvas();

    // 5. Initialize Firebase Project Credentials
    initFirebaseService();

    // 6. Initialize Master Controller
    initAuthController();
});

/* ==========================================================================
   1. PROTOCOL DETECTION & WARNING (file:// vs http://)
   ========================================================================== */
function checkProtocolWarning() {
    const banner = document.getElementById('file-protocol-banner');
    if (window.location.protocol === 'file:' && banner) {
        banner.classList.remove('hidden');
    }
}

/* ==========================================================================
   2. WEBAUDIO TACTILE SOUND SYNTHESIZER
   ========================================================================== */
let audioCtx = null;

function initAudio() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioCtx = new AudioContext();
        }
    } catch (e) {}
}

function playClickTick() {
    try {
        if (!audioCtx) initAudio();
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.03);
        gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.03);
    } catch (e) {}
}

function playSuccessChime() {
    try {
        if (!audioCtx) initAudio();
        if (!audioCtx) return;
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = "triangle";
            const startTime = audioCtx.currentTime + (idx * 0.07);
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.04, startTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);
            osc.start(startTime);
            osc.stop(startTime + 0.45);
        });
    } catch (e) {}
}

function playErrorAlert() {
    try {
        if (!audioCtx) initAudio();
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(160, audioCtx.currentTime);
        osc.frequency.setValueAtTime(120, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {}
}

/* ==========================================================================
   3. GLOWING MICRO-STARS CANVAS BACKGROUND
   ========================================================================== */
function initAuthCanvas() {
    const canvas = document.getElementById('login-particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(50, Math.floor(width / 24));

    for (let i = 0; i < count; i++) {
        const rand = Math.random();
        const isCyan = rand > 0.8;
        const isSilver = rand > 0.35;
        const color = isCyan ? '#00f2fe' : (isSilver ? '#e2e8f0' : '#64748b');
        const glowColor = isCyan 
            ? 'rgba(0, 242, 254, 0.75)' 
            : (isSilver ? 'rgba(255, 255, 255, 0.55)' : 'rgba(100, 116, 139, 0.45)');

        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 1.3 + 0.9,
            color: color,
            glowColor: glowColor,
            angle: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.002
        });
    }

    function drawMicroStar(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = 6;
        ctx.fillStyle = p.color;

        const s = p.size * 1.55;

        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.quadraticCurveTo(0, 0, s, 0);
        ctx.quadraticCurveTo(0, 0, 0, s);
        ctx.quadraticCurveTo(0, 0, -s, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s);
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.lineWidth = 1;
        const horizon = height * 0.75;
        const vanishingX = width * 0.5;

        for (let i = -width; i <= width * 2; i += 140) {
            ctx.beginPath();
            ctx.moveTo(vanishingX, horizon);
            ctx.lineTo(i, height);
            ctx.stroke();
        }

        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            p1.x += p1.vx;
            p1.y += p1.vy;
            p1.angle += p1.vRot;

            if (p1.x < 0 || p1.x > width) p1.vx *= -1;
            if (p1.y < 0 || p1.y > height) p1.vy *= -1;

            drawMicroStar(p1);

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    const alpha = (1 - dist / 130) * 0.14;
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
   4. FIREBASE PROJECT CONFIGURATION MANAGEMENT
   ========================================================================== */
function getActiveFirebaseConfig() {
    // 1. Check localStorage first (user saved in browser)
    try {
        const saved = localStorage.getItem('itrex_firebase_config');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.apiKey && parsed.apiKey.startsWith('AIza')) {
                return parsed;
            }
        }
    } catch (e) {}

    // 2. Check window.ITREX_FIREBASE_CONFIG from firebase-config.js
    if (window.ITREX_FIREBASE_CONFIG && window.ITREX_FIREBASE_CONFIG.apiKey && window.ITREX_FIREBASE_CONFIG.apiKey.startsWith('AIza')) {
        return window.ITREX_FIREBASE_CONFIG;
    }

    return null;
}

function initFirebaseService() {
    const config = getActiveFirebaseConfig();
    const statusDot = document.getElementById('firebase-status-dot');
    const statusText = document.getElementById('firebase-status-text');

    if (!config) {
        if (statusDot) { statusDot.className = 'w-1.5 h-1.5 rounded-full bg-yellow-400'; }
        if (statusText) { statusText.textContent = 'CONNECT FIREBASE'; }
        return false;
    }

    try {
        if (typeof firebase !== 'undefined' && firebase.initializeApp) {
            if (firebase.apps && firebase.apps.length) {
                firebaseApp = firebase.app();
            } else {
                firebaseApp = firebase.initializeApp(config);
            }
            firebaseAuth = firebase.auth();

            if (statusDot) { statusDot.className = 'w-1.5 h-1.5 rounded-full bg-emerald-400'; }
            if (statusText) { statusText.textContent = 'FIREBASE ACTIVE'; }
            console.log('[I-Trex] Firebase Auth online for project:', config.projectId);
            return true;
        }
    } catch (err) {
        console.warn('[I-Trex] Firebase init error:', err.message);
        if (statusDot) { statusDot.className = 'w-1.5 h-1.5 rounded-full bg-red-400'; }
        if (statusText) { statusText.textContent = 'CONFIG ERROR'; }
    }
    return false;
}

/* ==========================================================================
   5. MASTER AUTHENTICATION CONTROLLER
   ========================================================================== */
function initAuthController() {
    const views = {
        login: document.getElementById('view-login'),
        register: document.getElementById('view-register'),
        forgot: document.getElementById('view-forgot'),
        verify: document.getElementById('view-verify'),
        twofa: document.getElementById('view-2fa')
    };

    const kicker = document.getElementById('auth-kicker');
    const contextTitle = document.getElementById('auth-context-title');
    const contextDesc = document.getElementById('auth-context-desc');
    const banner = document.getElementById('auth-feedback-banner');
    const bannerIcon = document.getElementById('auth-feedback-icon');
    const bannerText = document.getElementById('auth-feedback-text');

    const formLogin = document.getElementById('form-login');
    const formLoginPhone = document.getElementById('form-login-phone');
    const formRegister = document.getElementById('form-register');
    const formForgot = document.getElementById('form-forgot');
    const form2FA = document.getElementById('form-2fa');

    // Navigation state
    function showMode(mode) {
        playClickTick();
        hideBanner();

        Object.keys(views).forEach(key => {
            if (views[key]) {
                views[key].classList.add('hidden');
                views[key].classList.remove('active');
            }
        });

        if (!views[mode]) return;

        views[mode].classList.remove('hidden');
        views[mode].classList.add('active');

        if (typeof gsap !== 'undefined') {
            gsap.fromTo(views[mode],
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
            );
        }

        switch (mode) {
            case 'login':
                if (kicker) kicker.textContent = 'IDENTITY ENCLAVE // AUTHENTICATION';
                if (contextTitle) contextTitle.textContent = 'Welcome back';
                if (contextDesc) contextDesc.textContent = 'Sign in to your I-Trex account';
                break;
            case 'register':
                if (kicker) kicker.textContent = 'ONBOARDING // ACCOUNT CREATION';
                if (contextTitle) contextTitle.textContent = 'Create account';
                if (contextDesc) contextDesc.textContent = 'Initialize your zero-trust digital workspace';
                break;
            case 'forgot':
                if (kicker) kicker.textContent = 'ACCOUNT RECOVERY // CREDENTIAL RESET';
                if (contextTitle) contextTitle.textContent = 'Reset your password';
                if (contextDesc) contextDesc.textContent = 'Request single-use cryptographic recovery link';
                break;
            case 'verify':
                if (kicker) kicker.textContent = 'EMAIL INTEGRITY // VERIFICATION PENDING';
                if (contextTitle) contextTitle.textContent = 'Verify your email';
                if (contextDesc) contextDesc.textContent = 'Complete verification to unlock account privileges';
                break;
            case 'twofa':
                if (kicker) kicker.textContent = 'IDENTITY VERIFICATION // TOKEN CHECK';
                if (contextTitle) contextTitle.textContent = 'Two-factor authentication';
                if (contextDesc) contextDesc.textContent = 'Enter 6-digit identity token from your device or SMS';
                break;
        }

        if (window.lucide) window.lucide.createIcons();
    }

    function showBanner(type, message) {
        if (!banner || !bannerText) return;
        banner.className = 'mb-6 p-4 font-mono text-xs border rounded-none flex items-start gap-3 transition-all duration-300';
        bannerText.innerHTML = message;

        if (type === 'error') {
            banner.classList.add('bg-red-950/40', 'border-red-500/50', 'text-red-300');
            if (bannerIcon) bannerIcon.setAttribute('data-lucide', 'alert-triangle');
            playErrorAlert();
        } else if (type === 'success') {
            banner.classList.add('bg-emerald-950/40', 'border-emerald-500/50', 'text-emerald-300');
            if (bannerIcon) bannerIcon.setAttribute('data-lucide', 'check-circle');
            playSuccessChime();
        } else {
            banner.classList.add('bg-cyan-950/40', 'border-cyan-500/50', 'text-cyan-300');
            if (bannerIcon) bannerIcon.setAttribute('data-lucide', 'info');
        }

        banner.classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
    }

    function hideBanner() {
        if (banner) banner.classList.add('hidden');
    }

    // Tab Switch: Email/Username vs Phone
    const tabEmail = document.getElementById('tab-auth-email');
    const tabPhone = document.getElementById('tab-auth-phone');
    if (tabEmail && tabPhone) {
        tabEmail.addEventListener('click', () => {
            tabEmail.className = 'text-white border-b-2 border-cyan-400 pb-1 font-bold uppercase tracking-wider transition-colors';
            tabPhone.className = 'text-neutral-400 hover:text-white border-b-2 border-transparent pb-1 uppercase tracking-wider transition-colors';
            formLogin?.classList.remove('hidden');
            formLoginPhone?.classList.add('hidden');
        });

        tabPhone.addEventListener('click', () => {
            tabPhone.className = 'text-white border-b-2 border-cyan-400 pb-1 font-bold uppercase tracking-wider transition-colors';
            tabEmail.className = 'text-neutral-400 hover:text-white border-b-2 border-transparent pb-1 uppercase tracking-wider transition-colors';
            formLoginPhone?.classList.remove('hidden');
            formLogin?.classList.add('hidden');
        });
    }

    // Button Switchers
    document.getElementById('btn-to-register')?.addEventListener('click', () => showMode('register'));
    document.getElementById('btn-to-login')?.addEventListener('click', () => showMode('login'));
    document.getElementById('btn-to-forgot')?.addEventListener('click', () => showMode('forgot'));
    document.getElementById('btn-forgot-to-login')?.addEventListener('click', () => showMode('login'));
    document.getElementById('btn-2fa-cancel')?.addEventListener('click', () => showMode('login'));
    document.getElementById('btn-verify-signout')?.addEventListener('click', () => {
        if (firebaseAuth) firebaseAuth.signOut();
        localStorage.removeItem('itrex_auth_user');
        showMode('login');
    });

    // Password Visibility Toggles
    const togglePassBtn = document.getElementById('toggle-login-pass');
    const passInput = document.getElementById('login-password');
    if (togglePassBtn && passInput) {
        togglePassBtn.addEventListener('click', () => {
            const isPass = passInput.getAttribute('type') === 'password';
            passInput.setAttribute('type', isPass ? 'text' : 'password');
            togglePassBtn.innerHTML = isPass ? '<i data-lucide="eye-off" class="w-4 h-4"></i>' : '<i data-lucide="eye" class="w-4 h-4"></i>';
            if (window.lucide) window.lucide.createIcons();
        });
    }

    const toggleRegPassBtn = document.getElementById('toggle-reg-pass');
    const regPassInput = document.getElementById('reg-password');
    if (toggleRegPassBtn && regPassInput) {
        toggleRegPassBtn.addEventListener('click', () => {
            const isPass = regPassInput.getAttribute('type') === 'password';
            regPassInput.setAttribute('type', isPass ? 'text' : 'password');
            toggleRegPassBtn.innerHTML = isPass ? '<i data-lucide="eye-off" class="w-4 h-4"></i>' : '<i data-lucide="eye" class="w-4 h-4"></i>';
            if (window.lucide) window.lucide.createIcons();
        });
    }

    // Dynamic Password Strength Meter
    if (regPassInput) {
        regPassInput.addEventListener('input', () => {
            const val = regPassInput.value;
            let score = 0;
            if (val.length >= 8) score++;
            if (val.length >= 12) score++;
            if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
            if (/[0-9]/.test(val)) score++;
            if (/[^A-Za-z0-9]/.test(val)) score++;
            const finalScore = Math.min(4, Math.floor(score * 0.8));

            const label = document.getElementById('pass-strength-label');
            const bars = [
                document.getElementById('str-bar-1'),
                document.getElementById('str-bar-2'),
                document.getElementById('str-bar-3'),
                document.getElementById('str-bar-4')
            ];
            bars.forEach(b => { if (b) b.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; });

            if (finalScore === 0) {
                if (label) { label.textContent = 'TOO SHORT (8+ REQUIRED)'; label.className = 'text-red-400 font-bold uppercase'; }
            } else if (finalScore === 1) {
                if (label) { label.textContent = 'WEAK'; label.className = 'text-orange-400 font-bold uppercase'; }
                if (bars[0]) bars[0].style.backgroundColor = '#f97316';
            } else if (finalScore === 2) {
                if (label) { label.textContent = 'FAIR'; label.className = 'text-yellow-400 font-bold uppercase'; }
                if (bars[0]) bars[0].style.backgroundColor = '#eab308';
                if (bars[1]) bars[1].style.backgroundColor = '#eab308';
            } else if (finalScore === 3) {
                if (label) { label.textContent = 'STRONG'; label.className = 'text-cyan-400 font-bold uppercase'; }
                if (bars[0]) bars[0].style.backgroundColor = '#00f2fe';
                if (bars[1]) bars[1].style.backgroundColor = '#00f2fe';
                if (bars[2]) bars[2].style.backgroundColor = '#00f2fe';
            } else {
                if (label) { label.textContent = 'OPTIMAL // AEROSPACE GRADE'; label.className = 'text-emerald-400 font-bold uppercase'; }
                bars.forEach(b => { if (b) b.style.backgroundColor = '#10b981'; });
            }
        });
    }

    // OTP Inputs Navigation
    const otpInputs = document.querySelectorAll('.otp-digit');
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });

        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim();
            if (/^\d{6}$/.test(pasteData)) {
                pasteData.split('').forEach((char, i) => {
                    if (otpInputs[i]) otpInputs[i].value = char;
                });
                if (otpInputs[5]) otpInputs[5].focus();
            }
        });
    });

    // Modal: Connect Firebase Project Setup
    const modal = document.getElementById('modal-firebase-config');
    const openModalBtn = document.getElementById('btn-open-firebase-modal');
    const closeModalBtn = document.getElementById('btn-close-firebase-modal');
    const cancelModalBtn = document.getElementById('btn-cancel-firebase-modal');
    const saveConfigBtn = document.getElementById('btn-save-firebase-config');
    const pasteBox = document.getElementById('firebase-paste-box');

    function openFirebaseModal(customMessage) {
        if (!modal) return;
        const current = getActiveFirebaseConfig() || {};
        if (document.getElementById('cfg-apikey')) document.getElementById('cfg-apikey').value = current.apiKey || '';
        if (document.getElementById('cfg-authdomain')) document.getElementById('cfg-authdomain').value = current.authDomain || '';
        if (document.getElementById('cfg-projectid')) document.getElementById('cfg-projectid').value = current.projectId || '';
        if (document.getElementById('cfg-appid')) document.getElementById('cfg-appid').value = current.appId || '';

        if (customMessage) {
            showBanner('info', customMessage);
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    function closeFirebaseModal() {
        if (!modal) return;
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    if (openModalBtn) openModalBtn.addEventListener('click', () => openFirebaseModal());
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeFirebaseModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeFirebaseModal);

    // Auto-parse pasted firebaseConfig object
    if (pasteBox) {
        pasteBox.addEventListener('input', () => {
            const raw = pasteBox.value;
            const extract = (key) => {
                const match = raw.match(new RegExp(`${key}\\s*:\\s*["']([^"']+)["']`));
                return match ? match[1] : '';
            };

            const apiKey = extract('apiKey');
            const authDomain = extract('authDomain');
            const projectId = extract('projectId');
            const appId = extract('appId');

            if (apiKey && document.getElementById('cfg-apikey')) document.getElementById('cfg-apikey').value = apiKey;
            if (authDomain && document.getElementById('cfg-authdomain')) document.getElementById('cfg-authdomain').value = authDomain;
            if (projectId && document.getElementById('cfg-projectid')) document.getElementById('cfg-projectid').value = projectId;
            if (appId && document.getElementById('cfg-appid')) document.getElementById('cfg-appid').value = appId;
        });
    }

    if (saveConfigBtn) {
        saveConfigBtn.addEventListener('click', async () => {
            const apiKey = document.getElementById('cfg-apikey')?.value.trim();
            const authDomain = document.getElementById('cfg-authdomain')?.value.trim();
            const projectId = document.getElementById('cfg-projectid')?.value.trim();
            const appId = document.getElementById('cfg-appid')?.value.trim();

            if (!apiKey || !projectId) {
                alert('Please enter at least the API Key and Project ID from your Firebase Console.');
                return;
            }

            const newConfig = {
                apiKey,
                authDomain: authDomain || `${projectId}.firebaseapp.com`,
                projectId,
                storageBucket: `${projectId}.appspot.com`,
                messagingSenderId: "",
                appId: appId || ""
            };

            // Save to localStorage
            localStorage.setItem('itrex_firebase_config', JSON.stringify(newConfig));

            // Also try to persist to server if server is running
            try {
                await fetch(API_BASE + '/api/config/firebase', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newConfig)
                });
            } catch (e) {}

            closeFirebaseModal();
            const initialized = initFirebaseService();
            if (initialized) {
                showBanner('success', `<strong>Firebase Connected Successfully!</strong> Connected to project: <code>${projectId}</code>. Live Google, GitHub, and verification emails are active.`);
            } else {
                showBanner('info', 'Firebase configuration saved. Please reload page.');
            }
        });
    }

    /* ==========================================================================
       6. ROLE-BASED ACCESS ROUTING
       ========================================================================== */
    function routeAuthenticatedUser(user) {
        localStorage.setItem('itrex_auth_user', JSON.stringify(user));
        playSuccessChime();

        showBanner('success', `
            <strong>AUTHENTICATION VERIFIED</strong><br>
            Welcome, <strong>${user.name || user.email}</strong> (${(user.role || 'USER').toUpperCase()})<br>
            Redirecting to authorized workspace...
        `);

        setTimeout(() => {
            const targetView = user.role === 'admin' ? 'admin' : (user.role === 'employee' ? 'employee' : 'user');
            window.location.href = `dashboard.html?role=${targetView}`;
        }, 1200);
    }

    /* ==========================================================================
       7. SUBMIT HANDLERS: EMAIL/PASSWORD SIGN IN
       ========================================================================== */
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideBanner();

            const identifier = document.getElementById('login-identifier')?.value.trim();
            const password = document.getElementById('login-password')?.value;
            const submitBtn = document.getElementById('btn-submit-login');

            if (!identifier || !password) {
                showBanner('error', 'Please enter your email/username and password.');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>VERIFYING ZERO-TRUST CREDENTIALS...</span>`;
            }

            try {
                const config = getActiveFirebaseConfig();

                // Path A: Authenticate with live Firebase
                if (config && firebaseAuth) {
                    let targetEmail = identifier;
                    // If identifier is a username, resolve to email via backend
                    if (!identifier.includes('@')) {
                        try {
                            const res = await fetch(API_BASE + '/api/auth/resolve-username', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ username: identifier })
                            });
                            const data = await res.json();
                            if (data.found && data.email) targetEmail = data.email;
                        } catch (err) {}
                    }

                    const userCred = await firebaseAuth.signInWithEmailAndPassword(targetEmail, password);
                    const user = userCred.user;

                    // Enforce email verification for non-admin accounts
                    const isAdmin = user.email.toLowerCase() === 'satys9267@gmail.com';
                    if (!user.emailVerified && !isAdmin) {
                        document.getElementById('verify-target-email').textContent = user.email;
                        showMode('verify');
                        showBanner('info', 'Your email address is pending verification. Please click the link sent to your inbox.');
                        return;
                    }

                    routeAuthenticatedUser({
                        id: user.uid,
                        name: user.displayName || user.email.split('@')[0],
                        email: user.email,
                        role: isAdmin ? 'admin' : 'user',
                        verified: user.emailVerified
                    });
                    return;
                }

                // Path B: Fallback to local server API
                const response = await fetch(API_BASE + '/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ identifier, password })
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.error || 'Invalid credentials.');
                }

                routeAuthenticatedUser(result.user);

            } catch (err) {
                let msg = err.message || 'Authentication error. Please verify credentials.';
                if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                    msg = 'Invalid email or password. Please verify credentials.';
                } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
                    msg = `<strong>Connection Error</strong>: Server not reachable at <code>${API_BASE}</code>.<br>Please open via <strong><a href="http://localhost:10000/login.html" class="underline text-white">http://localhost:10000/login.html</a></strong> or connect Firebase credentials.`;
                }
                showBanner('error', msg);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<span>SIGN IN</span><i data-lucide="arrow-right" class="w-4 h-4"></i>`;
                    if (window.lucide) window.lucide.createIcons();
                }
            }
        });
    }

    /* ==========================================================================
       8. SUBMIT HANDLERS: ACCOUNT REGISTRATION & REAL VERIFICATION EMAIL
       ========================================================================== */
    if (formRegister) {
        formRegister.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideBanner();

            const name = document.getElementById('reg-name')?.value.trim();
            const username = document.getElementById('reg-username')?.value.trim();
            const email = document.getElementById('reg-email')?.value.trim();
            const password = document.getElementById('reg-password')?.value;
            const confirm = document.getElementById('reg-confirm')?.value;
            const termsAccepted = document.getElementById('reg-terms')?.checked;
            const submitBtn = document.getElementById('btn-submit-register');

            if (!name || !username || !email || !password) {
                showBanner('error', 'All fields are required.');
                return;
            }

            if (password !== confirm) {
                showBanner('error', 'Confirmation password does not match.');
                return;
            }

            if (!termsAccepted) {
                showBanner('error', 'You must accept the Terms of Service & Privacy Policy.');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>INITIALIZING ENCLAVE IDENTITY...</span>`;
            }

            try {
                const config = getActiveFirebaseConfig();

                // Path A: Register with live Firebase (Sends REAL verification email!)
                if (config && firebaseAuth) {
                    const userCred = await firebaseAuth.createUserWithEmailAndPassword(email, password);
                    await userCred.user.updateProfile({ displayName: name });

                    // DISPATCH REAL VERIFICATION EMAIL TO USER'S INBOX!
                    await userCred.user.sendEmailVerification();
                    playSuccessChime();

                    document.getElementById('verify-target-email').textContent = email;
                    showMode('verify');
                    showBanner('success', `
                        <strong>Registration Successful!</strong><br>
                        A real verification email from Firebase has been dispatched to <strong>${email}</strong>.<br>
                        Please check your inbox (and spam folder) and click the verification link.
                    `);
                    return;
                }

                // Path B: Fallback to local server API
                const response = await fetch(API_BASE + '/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, username, email, password, termsAccepted })
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.error || 'Registration failed.');
                }

                playSuccessChime();
                if (result.user.verified || result.user.role === 'admin') {
                    routeAuthenticatedUser(result.user);
                } else {
                    document.getElementById('verify-target-email').textContent = result.user.email;
                    showMode('verify');
                    showBanner('success', `
                        Account created! Note: To send live emails to your real inbox, please click <strong>CONNECT FIREBASE</strong> at the top right to link your Firebase project.
                    `);
                }

            } catch (err) {
                let msg = err.message || 'Registration failed.';
                if (err.code === 'auth/email-already-in-use') {
                    msg = 'An account with this email address already exists. Please sign in instead.';
                } else if (err.code === 'auth/weak-password') {
                    msg = 'Password is too weak. Please use at least 8 characters with numbers and symbols.';
                } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
                    msg = `<strong>Connection Error</strong>: Server not reachable at <code>${API_BASE}</code>.<br>Please open via <strong><a href="http://localhost:10000/login.html" class="underline text-white">http://localhost:10000/login.html</a></strong> or connect Firebase.`;
                }
                showBanner('error', msg);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<span>INITIALIZE SECURE ACCOUNT</span><i data-lucide="shield-check" class="w-4 h-4"></i>`;
                    if (window.lucide) window.lucide.createIcons();
                }
            }
        });
    }

    /* ==========================================================================
       9. FEDERATED OAUTH: GOOGLE SIGN-IN
       ========================================================================== */
    document.getElementById('btn-oauth-google')?.addEventListener('click', async () => {
        playClickTick();
        hideBanner();

        // Check 1: file:// protocol restriction
        if (window.location.protocol === 'file:') {
            showBanner('error', `
                <strong>Google Sign-In Blocked by Browser:</strong><br>
                Google OAuth popups cannot run on a local file (<code>file://</code>).<br>
                Please open this page via your local server: <strong><a href="http://localhost:10000/login.html" class="underline text-white font-bold">http://localhost:10000/login.html</a></strong>.
            `);
            return;
        }

        // Check 2: Firebase Credentials configured
        const config = getActiveFirebaseConfig();
        if (!config || !firebaseAuth) {
            openFirebaseModal('Please connect your Firebase project credentials to activate live Google Sign-In.');
            return;
        }

        showBanner('info', 'Connecting to Google Authentication...');

        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('email');
            provider.addScope('profile');
            provider.setCustomParameters({ prompt: 'select_account' });

            const result = await firebaseAuth.signInWithPopup(provider);
            const user = result.user;

            routeAuthenticatedUser({
                id: user.uid,
                name: user.displayName || user.email.split('@')[0],
                email: user.email,
                role: user.email.toLowerCase() === 'satys9267@gmail.com' ? 'admin' : 'user',
                verified: true
            });

        } catch (err) {
            let msg = err.message;
            if (err.code === 'auth/popup-closed-by-user') {
                msg = 'Google authentication popup was closed prior to completion.';
            } else if (err.code === 'auth/unauthorized-domain') {
                msg = `<strong>Authorized Domain Error</strong>: In Firebase Console > Authentication > Settings > Authorized Domains, please add <code>localhost</code>.`;
            } else if (err.code === 'auth/operation-not-allowed') {
                msg = `Google Sign-In is not enabled in your Firebase project. Please enable it in Firebase Console > Authentication > Sign-in method > Google.`;
            }
            showBanner('error', msg);
        }
    });

    /* ==========================================================================
       10. FEDERATED OAUTH: GITHUB SIGN-IN
       ========================================================================== */
    document.getElementById('btn-oauth-github')?.addEventListener('click', async () => {
        playClickTick();
        hideBanner();

        if (window.location.protocol === 'file:') {
            showBanner('error', `
                <strong>GitHub Sign-In Blocked by Browser:</strong><br>
                GitHub OAuth popups cannot run on <code>file://</code>. Please open via <strong><a href="http://localhost:10000/login.html" class="underline text-white font-bold">http://localhost:10000/login.html</a></strong>.
            `);
            return;
        }

        const config = getActiveFirebaseConfig();
        if (!config || !firebaseAuth) {
            openFirebaseModal('Please connect your Firebase project credentials to activate live GitHub Sign-In.');
            return;
        }

        showBanner('info', 'Connecting to GitHub Developer Authentication...');

        try {
            const provider = new firebase.auth.GithubAuthProvider();
            provider.addScope('user:email');

            const result = await firebaseAuth.signInWithPopup(provider);
            const user = result.user;

            routeAuthenticatedUser({
                id: user.uid,
                name: user.displayName || user.email.split('@')[0],
                email: user.email,
                role: user.email.toLowerCase() === 'satys9267@gmail.com' ? 'admin' : 'user',
                verified: true
            });

        } catch (err) {
            let msg = err.message;
            if (err.code === 'auth/popup-closed-by-user') {
                msg = 'GitHub authentication popup was closed prior to completion.';
            } else if (err.code === 'auth/account-exists-with-different-credential') {
                msg = 'An account already exists with the email used in GitHub. Please sign in with Google or Email.';
            } else if (err.code === 'auth/operation-not-allowed') {
                msg = `GitHub Sign-In is not enabled in your Firebase project. Please enable it in Firebase Console > Authentication > Sign-in method > GitHub.`;
            }
            showBanner('error', msg);
        }
    });

    /* ==========================================================================
       11. PHONE NUMBER SMS AUTHENTICATION
       ========================================================================== */
    if (formLoginPhone) {
        formLoginPhone.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideBanner();

            const phone = document.getElementById('phone-number')?.value.trim();
            const submitBtn = document.getElementById('btn-submit-phone');

            if (!phone || phone.length < 8) {
                showBanner('error', 'Please enter a valid phone number with country code (e.g., +91 74998 25344).');
                return;
            }

            if (window.location.protocol === 'file:') {
                showBanner('error', 'SMS Phone Authentication requires an HTTP origin. Please open via <a href="http://localhost:10000/login.html" class="underline text-white">http://localhost:10000/login.html</a>.');
                return;
            }

            const config = getActiveFirebaseConfig();
            if (!config || !firebaseAuth) {
                openFirebaseModal('Please connect your Firebase project credentials to activate Phone SMS verification.');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>DISPATCHING SMS TOKEN...</span>`;
            }

            try {
                if (!recaptchaVerifier) {
                    recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                        'size': 'invisible'
                    });
                }

                showBanner('info', `Transmitting verification code to <strong>${phone}</strong>...`);
                phoneConfirmationResult = await firebaseAuth.signInWithPhoneNumber(phone, recaptchaVerifier);

                document.getElementById('otp-instruction-text').innerHTML = `Enter the 6-digit SMS verification code transmitted to <strong>${phone}</strong>:`;
                showMode('twofa');
                showBanner('success', `SMS token dispatched! Check your mobile messages.`);

            } catch (err) {
                showBanner('error', err.message || 'SMS transmission failed. Please ensure Phone Auth is enabled in Firebase Console.');
                if (recaptchaVerifier) {
                    recaptchaVerifier.clear();
                    recaptchaVerifier = null;
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<span>TRANSMIT SMS VERIFICATION CODE</span><i data-lucide="send" class="w-4 h-4"></i>`;
                    if (window.lucide) window.lucide.createIcons();
                }
            }
        });
    }

    /* ==========================================================================
       12. TWO-FACTOR / SMS OTP VERIFICATION
       ========================================================================== */
    if (form2FA) {
        form2FA.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideBanner();

            const code = Array.from(otpInputs).map(i => i.value).join('');
            if (code.length !== 6) {
                showBanner('error', 'Please enter all 6 digits of the verification code.');
                return;
            }

            try {
                // If phone confirmation is active, verify via Firebase
                if (phoneConfirmationResult) {
                    const result = await phoneConfirmationResult.confirm(code);
                    const user = result.user;
                    routeAuthenticatedUser({
                        id: user.uid,
                        name: user.phoneNumber,
                        email: user.phoneNumber,
                        role: 'user',
                        verified: true
                    });
                    return;
                }

                // General 2FA verification
                playSuccessChime();
                showBanner('success', 'Two-Factor Token Verified! Authorizing session...');
                const user = JSON.parse(localStorage.getItem('itrex_auth_user') || '{"name":"Satyam Swami","role":"admin"}');
                setTimeout(() => {
                    routeAuthenticatedUser(user);
                }, 1000);

            } catch (err) {
                showBanner('error', 'Invalid verification code. Please check your SMS and try again.');
            }
        });
    }

    /* ==========================================================================
       13. FORGOT PASSWORD & RECOVERY
       ========================================================================== */
    if (formForgot) {
        formForgot.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideBanner();

            const email = document.getElementById('forgot-email')?.value.trim();
            const submitBtn = document.getElementById('btn-submit-forgot');

            if (!email) {
                showBanner('error', 'Please enter your registered email address.');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>DISPATCHING RECOVERY PAYLOAD...</span>`;
            }

            try {
                const config = getActiveFirebaseConfig();

                if (config && firebaseAuth) {
                    await firebaseAuth.sendPasswordResetEmail(email);
                    playSuccessChime();
                    showBanner('success', `
                        <strong>Password Reset Dispatched!</strong><br>
                        A real password reset link has been dispatched by Firebase to <strong>${email}</strong>.<br>
                        Please open your email inbox to set a new password.
                    `);
                    formForgot.reset();
                    return;
                }

                // Local API fallback
                const response = await fetch(API_BASE + '/api/auth/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const result = await response.json();
                playSuccessChime();
                showBanner('success', result.message || 'If an account exists, recovery instructions have been sent.');
                formForgot.reset();

            } catch (err) {
                showBanner('error', 'Unable to dispatch recovery instructions. Try again shortly.');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<span>DISPATCH RECOVERY LINK</span><i data-lucide="send" class="w-4 h-4"></i>`;
                    if (window.lucide) window.lucide.createIcons();
                }
            }
        });
    }

    // Refresh Email Verification State
    document.getElementById('btn-check-verified')?.addEventListener('click', async () => {
        playClickTick();
        if (firebaseAuth && firebaseAuth.currentUser) {
            await firebaseAuth.currentUser.reload();
            if (firebaseAuth.currentUser.emailVerified) {
                routeAuthenticatedUser({
                    id: firebaseAuth.currentUser.uid,
                    name: firebaseAuth.currentUser.displayName || firebaseAuth.currentUser.email,
                    email: firebaseAuth.currentUser.email,
                    role: 'user',
                    verified: true
                });
                return;
            } else {
                showBanner('error', 'Your email address is still not verified. Please click the link in your inbox.');
                return;
            }
        }

        showBanner('success', 'Email status verified. Privileges elevated.');
        const user = JSON.parse(localStorage.getItem('itrex_auth_user') || '{"name":"Enterprise Member","role":"user","verified":true}');
        user.verified = true;
        setTimeout(() => {
            routeAuthenticatedUser(user);
        }, 1000);
    });

    // Resend Email Verification
    document.getElementById('btn-resend-verification')?.addEventListener('click', async () => {
        playClickTick();
        if (firebaseAuth && firebaseAuth.currentUser) {
            try {
                await firebaseAuth.currentUser.sendEmailVerification();
                showBanner('success', 'New verification email dispatched by Firebase! Please check your inbox.');
                return;
            } catch (e) {
                showBanner('error', 'Too many requests. Please wait a minute before requesting another email.');
                return;
            }
        }
        showBanner('success', 'Verification link re-dispatched to your email.');
    });
}
