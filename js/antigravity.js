/**
 * I-Trex Antigravity Engine
 * Inspired by Google Antigravity (Mr.doob) with Modern High-Precision Physics & Multi-G Simulation
 */

class AntigravityEngine {
  constructor() {
    this.isActive = false;
    this.gravityMode = 'earth'; // 'earth' (1g), 'zero' (0g), 'reverse' (-1g), 'moon' (0.16g)
    this.elements = [];
    this.animationFrameId = null;
    this.mouse = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      lastX: 0,
      lastY: 0,
      isDown: false,
      draggedItem: null,
      offsetX: 0,
      offsetY: 0
    };

    this.audioCtx = null;
    this.soundEnabled = true;

    this.initHUD();
    this.bindEvents();
  }

  // Web Audio sci-fi sound synthesizer
  playSound(type) {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;

      if (type === 'activate') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'restore') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.4);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'toss') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(180, now + 0.15);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'collide') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {
      // Audio might be blocked until user interacts
    }
  }

  initHUD() {
    // Floating HUD controller
    const hud = document.createElement('div');
    hud.id = 'antigravity-hud-container';
    hud.className = 'antigravity-hud';
    hud.innerHTML = `
      <div class="flex items-center gap-2 pr-2 border-r border-slate-700/80 text-xs font-mono">
        <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" id="hud-pulse-dot"></span>
        <span class="text-slate-300 font-semibold uppercase tracking-wider text-[11px]" id="hud-status-text">Gravity: Normal</span>
      </div>
      
      <div class="flex items-center gap-1.5" id="hud-control-buttons">
        <button id="btn-toggle-antigravity" class="btn-cyber-primary px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-lg" title="Toggle Google Antigravity Physics Mode">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          <span id="btn-antigravity-text">Zero-G Mode</span>
        </button>

        <div id="hud-physics-options" class="hidden flex items-center gap-1">
          <button data-mode="earth" class="hud-mode-btn px-2.5 py-1 text-[11px] rounded bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700 active" title="Earth Gravity (1.0G)">1G Earth</button>
          <button data-mode="zero" class="hud-mode-btn px-2.5 py-1 text-[11px] rounded bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700" title="Zero Gravity (Float)">0G Space</button>
          <button data-mode="reverse" class="hud-mode-btn px-2.5 py-1 text-[11px] rounded bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700" title="Reverse Anti-Gravity (-1.0G)">-1G Invert</button>
          <button data-mode="moon" class="hud-mode-btn px-2.5 py-1 text-[11px] rounded bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700" title="Moon Gravity (0.16G)">🌙 Moon</button>
          <button id="btn-shockwave" class="px-2.5 py-1 text-[11px] rounded bg-purple-950/80 text-purple-200 border border-purple-500/50 hover:bg-purple-900" title="Trigger Kinetic Blast Shockwave">💥 Blast</button>
          <button id="btn-restore-grid" class="px-2.5 py-1 text-[11px] rounded bg-slate-700/80 text-white border border-slate-500 hover:bg-slate-600" title="Reassemble all items back to exact positions">🔄 Assemble</button>
        </div>
      </div>
    `;

    document.body.appendChild(hud);

    // Event hooks for HUD
    document.getElementById('btn-toggle-antigravity').addEventListener('click', () => {
      this.toggle();
    });

    document.getElementById('btn-restore-grid').addEventListener('click', () => {
      this.deactivate();
    });

    document.getElementById('btn-shockwave').addEventListener('click', () => {
      this.triggerShockwave(window.innerWidth / 2, window.innerHeight / 2, 28);
    });

    hud.querySelectorAll('.hud-mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.target.getAttribute('data-mode');
        this.setGravityMode(mode);
        hud.querySelectorAll('.hud-mode-btn').forEach(b => b.classList.remove('text-cyan-300', 'border-cyan-400', 'bg-cyan-950/50'));
        e.target.classList.add('text-cyan-300', 'border-cyan-400', 'bg-cyan-950/50');
      });
    });
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.vx = (e.clientX - this.mouse.lastX) * 0.8;
      this.mouse.vy = (e.clientY - this.mouse.lastY) * 0.8;
      this.mouse.lastX = e.clientX;
      this.mouse.lastY = e.clientY;
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      if (this.isActive && this.mouse.isDown && this.mouse.draggedItem) {
        const item = this.mouse.draggedItem;
        item.x = this.mouse.x - this.mouse.offsetX;
        item.y = this.mouse.y - this.mouse.offsetY;
        item.vx = this.mouse.vx;
        item.vy = this.mouse.vy;
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isActive && this.mouse.draggedItem) {
        const item = this.mouse.draggedItem;
        item.vx = Math.min(Math.max(this.mouse.vx * 1.3, -35), 35);
        item.vy = Math.min(Math.max(this.mouse.vy * 1.3, -35), 35);
        item.angularVelocity = (Math.random() - 0.5) * 0.15 + (this.mouse.vx * 0.005);
        item.isPinned = false;
        this.playSound('toss');
      }
      this.mouse.isDown = false;
      this.mouse.draggedItem = null;
    });

    window.addEventListener('resize', () => {
      if (this.isActive) {
        this.updateBoundaries();
      }
    });
  }

  toggle() {
    if (this.isActive) {
      this.deactivate();
    } else {
      this.activate();
    }
  }

  activate() {
    if (this.isActive) return;
    this.isActive = true;
    document.body.classList.add('antigravity-active');
    this.playSound('activate');

    // Update HUD
    const hudStatus = document.getElementById('hud-status-text');
    const hudBtnText = document.getElementById('btn-antigravity-text');
    const hudOptions = document.getElementById('hud-physics-options');
    const hudDot = document.getElementById('hud-pulse-dot');

    if (hudStatus) hudStatus.textContent = 'Zero-G: ACTIVE';
    if (hudBtnText) hudBtnText.textContent = 'Exit Zero-G';
    if (hudOptions) hudOptions.classList.remove('hidden');
    if (hudDot) {
      hudDot.classList.remove('bg-emerald-400');
      hudDot.classList.add('bg-cyan-400');
    }

    // Collect interactable cards, headers, buttons across visible view
    this.gatherPhysicsElements();

    // Start tick loop
    this.lastTime = performance.now();
    this.runPhysicsLoop();

    // Subtle initial pop to initiate the tumble
    this.triggerShockwave(window.innerWidth / 2, window.innerHeight * 0.4, 12);
  }

  deactivate() {
    if (!this.isActive) return;
    this.isActive = false;
    this.playSound('restore');

    // Cancel animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Update HUD
    const hudStatus = document.getElementById('hud-status-text');
    const hudBtnText = document.getElementById('btn-antigravity-text');
    const hudOptions = document.getElementById('hud-physics-options');
    const hudDot = document.getElementById('hud-pulse-dot');

    if (hudStatus) hudStatus.textContent = 'Gravity: Normal';
    if (hudBtnText) hudBtnText.textContent = 'Zero-G Mode';
    if (hudOptions) hudOptions.classList.add('hidden');
    if (hudDot) {
      hudDot.classList.remove('bg-cyan-400');
      hudDot.classList.add('bg-emerald-400');
    }

    // Smoothly restore elements back to original positions
    this.elements.forEach(item => {
      item.el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s';
      item.el.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
      item.el.style.zIndex = '';

      setTimeout(() => {
        if (!this.isActive) {
          item.el.style.position = '';
          item.el.style.left = '';
          item.el.style.top = '';
          item.el.style.width = '';
          item.el.style.transition = '';
          item.el.classList.remove('physics-target');
        }
      }, 650);
    });

    this.elements = [];
    document.body.classList.remove('antigravity-active');
  }

  gatherPhysicsElements() {
    this.elements = [];

    // Target elements with class 'antigravity-card', glass panels, or interactive blocks
    const selectors = [
      '.antigravity-target',
      '.hero-stat-card',
      '.product-card',
      '.glass-panel',
      '.quick-action-card',
      '.roadmap-card',
      '.kpi-card',
      '.team-card'
    ];

    const nodes = document.querySelectorAll(selectors.join(', '));
    const activeView = document.querySelector('.app-view.active') || document.body;

    nodes.forEach((el, index) => {
      // Only include elements currently visible in layout
      if (el.offsetParent === null || !activeView.contains(el)) return;
      if (el.closest('#antigravity-hud-container') || el.closest('#app-navigation')) return;

      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const origX = rect.left;
      const origY = rect.top;

      // Lock current fixed dimensions so flow doesn't collapse
      el.style.width = `${rect.width}px`;
      el.style.height = `${rect.height}px`;
      el.style.position = 'fixed';
      el.style.left = `${origX}px`;
      el.style.top = `${origY}px`;
      el.style.margin = '0';
      el.style.zIndex = `${10 + (index % 20)}`;
      el.classList.add('physics-target');

      const item = {
        el,
        width: rect.width,
        height: rect.height,
        x: origX,
        y: origY,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4 - 2,
        angle: 0,
        angularVelocity: (Math.random() - 0.5) * 0.05,
        mass: Math.max(1, (rect.width * rect.height) / 8000),
        restitution: 0.65, // Bounciness
        friction: 0.985,
        isPinned: false
      };

      // Mouse drag handlers on each element
      el.onmousedown = (e) => {
        if (!this.isActive) return;
        e.preventDefault();
        this.mouse.isDown = true;
        this.mouse.draggedItem = item;
        this.mouse.offsetX = e.clientX - item.x;
        this.mouse.offsetY = e.clientY - item.y;
        item.isPinned = true;
        item.vx = 0;
        item.vy = 0;
        el.style.zIndex = '999';
        this.playSound('toss');
      };

      this.elements.push(item);
    });
  }

  setGravityMode(mode) {
    this.gravityMode = mode;
    this.playSound('activate');
  }

  triggerShockwave(originX, originY, forceMagnitude = 20) {
    if (!this.isActive || this.elements.length === 0) return;
    this.playSound('activate');

    this.elements.forEach(item => {
      const centerX = item.x + item.width / 2;
      const centerY = item.y + item.height / 2;
      const dx = centerX - originX;
      const dy = centerY - originY;
      const dist = Math.max(20, Math.sqrt(dx * dx + dy * dy));

      const blast = (forceMagnitude / dist) * 80;
      item.vx += (dx / dist) * blast;
      item.vy += (dy / dist) * blast;
      item.angularVelocity += (Math.random() - 0.5) * 0.2;
    });
  }

  updateBoundaries() {
    const maxX = window.innerWidth;
    const maxY = window.innerHeight;

    this.elements.forEach(item => {
      if (item.x + item.width > maxX) item.x = maxX - item.width;
      if (item.x < 0) item.x = 0;
      if (item.y + item.height > maxY) item.y = maxY - item.height;
      if (item.y < 0) item.y = 0;
    });
  }

  runPhysicsLoop() {
    if (!this.isActive) return;

    let gravityY = 0.5; // standard earth
    let gravityX = 0;

    switch (this.gravityMode) {
      case 'zero':
        gravityY = 0;
        break;
      case 'reverse':
        gravityY = -0.55;
        break;
      case 'moon':
        gravityY = 0.12;
        break;
      case 'earth':
      default:
        gravityY = 0.55;
        break;
    }

    const maxX = window.innerWidth;
    const maxY = window.innerHeight;

    for (let i = 0; i < this.elements.length; i++) {
      const item = this.elements[i];

      if (item !== this.mouse.draggedItem) {
        // Apply acceleration
        item.vx += gravityX;
        item.vy += gravityY;

        // Apply friction / drag
        item.vx *= item.friction;
        item.vy *= item.friction;
        item.angularVelocity *= 0.98;

        // Update positions
        item.x += item.vx;
        item.y += item.vy;
        item.angle += item.angularVelocity;

        // Wall collisions
        // Floor
        if (item.y + item.height > maxY) {
          item.y = maxY - item.height;
          item.vy = -item.vy * item.restitution;
          item.vx *= 0.9;
          item.angularVelocity += item.vx * 0.01;
          if (Math.abs(item.vy) > 3) this.playSound('collide');
        }

        // Ceiling
        if (item.y < 0) {
          item.y = 0;
          item.vy = -item.vy * item.restitution;
          item.vx *= 0.9;
          if (Math.abs(item.vy) > 3) this.playSound('collide');
        }

        // Right wall
        if (item.x + item.width > maxX) {
          item.x = maxX - item.width;
          item.vx = -item.vx * item.restitution;
          if (Math.abs(item.vx) > 3) this.playSound('collide');
        }

        // Left wall
        if (item.x < 0) {
          item.x = 0;
          item.vx = -item.vx * item.restitution;
          if (Math.abs(item.vx) > 3) this.playSound('collide');
        }
      }

      // Render updated transform
      item.el.style.transform = `translate3d(${item.x - parseFloat(item.el.style.left)}px, ${item.y - parseFloat(item.el.style.top)}px, 0) rotate(${item.angle}rad)`;
    }

    this.animationFrameId = requestAnimationFrame(() => this.runPhysicsLoop());
  }
}

// Global antigravity engine instance
const antigravityEngine = new AntigravityEngine();
