/**
 * I-Trex Main Application Controller
 * Handles Navigation, View Routing, RBAC Security, Charts, and UI Interactions
 */

class ItrexApp {
  constructor() {
    this.currentView = 'intro';
    this.shiftTimerInterval = null;
    this.shiftSeconds = 0;
    this.isShiftRunning = false;
    this.charts = {};

    this.init();
  }

  init() {
    // Subscribe to state updates
    appState.subscribe(() => {
      this.updateNav();
      this.renderCurrentView();
    });

    // Handle hash routing
    window.addEventListener('hashchange', () => this.handleRouting());

    // Setup global listeners
    this.setupEventListeners();
    this.updateNav();
    this.handleRouting();
    this.initIntroCanvas();
  }

  handleRouting() {
    let hash = window.location.hash.replace('#', '').trim();
    if (!hash) hash = 'intro';

    // Route guards for private workspace
    const privateViews = ['employee-home', 'dashboard', 'admin', 'settings'];
    if (privateViews.includes(hash)) {
      if (!appState.isLoggedIn()) {
        this.showToast('Authentication Required', 'Please log in to access the private workspace.', 'warning');
        window.location.hash = '#login';
        return;
      }

      // Admin only guard
      if (hash === 'admin' && !appState.isAdmin()) {
        this.showToast('Access Denied', 'Administrator privileges required for this section.', 'error');
        window.location.hash = '#dashboard';
        return;
      }
    }

    this.switchView(hash);
  }

  switchView(viewName) {
    this.currentView = viewName;

    // Reset antigravity if switching views to avoid orphaned physics
    if (antigravityEngine.isActive) {
      antigravityEngine.deactivate();
    }

    // Toggle view visibility
    document.querySelectorAll('.app-view').forEach(view => {
      view.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
      targetView.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      console.warn(`View view-${viewName} not found, defaulting to intro`);
      document.getElementById('view-intro').classList.add('active');
    }

    // Render view-specific content
    this.renderCurrentView();

    // Re-initialize Lucide icons if available
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  updateNav() {
    const isLoggedIn = appState.isLoggedIn();
    const isAdmin = appState.isAdmin();
    const user = appState.getUser();

    const publicNav = document.getElementById('nav-public-links');
    const privateNav = document.getElementById('nav-private-links');
    const authActions = document.getElementById('nav-auth-actions');
    const userProfileBadge = document.getElementById('nav-user-profile');

    if (isLoggedIn && user) {
      if (publicNav) publicNav.classList.add('hidden');
      if (privateNav) privateNav.classList.remove('hidden');
      if (authActions) authActions.classList.add('hidden');
      if (userProfileBadge) {
        userProfileBadge.classList.remove('hidden');
        document.getElementById('nav-user-name').textContent = user.name;
        document.getElementById('nav-user-avatar').textContent = user.avatar || '👤';
        const roleBadge = document.getElementById('nav-user-role-badge');
        roleBadge.textContent = user.role.toUpperCase();
        roleBadge.className = user.role === 'admin' ? 'badge-admin px-2 py-0.5 rounded text-[10px] font-mono' : 'badge-employee px-2 py-0.5 rounded text-[10px] font-mono';

        // Toggle admin-only links in nav
        const adminTab = document.getElementById('nav-link-admin');
        if (adminTab) {
          if (isAdmin) {
            adminTab.classList.remove('hidden');
          } else {
            adminTab.classList.add('hidden');
          }
        }
      }
    } else {
      if (publicNav) publicNav.classList.remove('hidden');
      if (privateNav) privateNav.classList.add('hidden');
      if (authActions) authActions.classList.remove('hidden');
      if (userProfileBadge) userProfileBadge.classList.add('hidden');
    }
  }

  renderCurrentView() {
    switch (this.currentView) {
      case 'home':
        this.renderPublicHome();
        break;
      case 'products':
        this.renderProductsView();
        break;
      case 'about':
        this.renderAboutView();
        break;
      case 'employee-home':
        this.renderEmployeeHome();
        break;
      case 'dashboard':
        this.renderEmployeeDashboard();
        break;
      case 'admin':
        this.renderAdminView();
        break;
      case 'settings':
        this.renderSettingsView();
        break;
      default:
        break;
    }
  }

  // --- View Renderers ---
  renderPublicHome() {
    const products = appState.getProducts();
    const container = document.getElementById('home-featured-products');
    if (!container) return;

    container.innerHTML = products.slice(0, 3).map(p => `
      <div class="glass-panel rounded-2xl p-6 relative overflow-hidden product-card group">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-mono text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60">${p.code}</span>
          <span class="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">${p.badge}</span>
        </div>
        <h3 class="text-xl font-bold font-heading text-white group-hover:text-cyan-300 transition-colors">${p.name}</h3>
        <p class="text-slate-400 text-sm mt-2 line-clamp-3">${p.summary}</p>
        <div class="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <span class="text-xs text-slate-500 font-mono">${p.status}</span>
          <button onclick="window.itrexApp.openProductModal('${p.id}')" class="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            Specs & Architecture &rarr;
          </button>
        </div>
      </div>
    `).join('');
  }

  renderProductsView(categoryFilter = 'all') {
    const products = appState.getProducts();
    const filtered = categoryFilter === 'all' 
      ? products 
      : products.filter(p => p.category.toLowerCase().includes(categoryFilter.toLowerCase()));

    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = filtered.map(p => `
      <div class="glass-panel rounded-2xl p-6 relative flex flex-col justify-between product-card hover:border-cyan-500/40 transition-all">
        <div>
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-mono text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60">${p.code}</span>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full ${p.badge === 'Flagship' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-300'}">${p.badge}</span>
          </div>
          <h3 class="text-xl font-bold font-heading text-white">${p.name}</h3>
          <p class="text-xs text-cyan-500/80 font-mono mt-1">${p.category} &bull; ${p.status}</p>
          <p class="text-slate-400 text-sm mt-3 leading-relaxed">${p.description}</p>
          
          <div class="mt-5 space-y-2">
            ${p.features.map(f => `
              <div class="flex items-start gap-2 text-xs text-slate-300">
                <span class="text-cyan-400 mt-0.5">&check;</span>
                <span>${f}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span class="text-[11px] text-slate-500 block uppercase font-mono">Pricing</span>
            <span class="text-sm font-semibold text-slate-200">${p.pricing}</span>
          </div>
          <button onclick="window.itrexApp.openProductModal('${p.id}')" class="btn-cyber-outline px-3 py-1.5 rounded-lg text-xs font-medium">
            Inspect Architecture
          </button>
        </div>
      </div>
    `).join('');
  }

  renderAboutView() {
    const roadmapContainer = document.getElementById('about-roadmap-timeline');
    if (!roadmapContainer) return;

    roadmapContainer.innerHTML = ITREX_INITIAL_DATA.companyRoadmap.map(r => `
      <div class="relative pl-8 pb-8 border-l border-slate-800 last:border-0 last:pb-0 roadmap-card">
        <div class="absolute -left-2 top-0 w-4 h-4 rounded-full border-2 border-cyan-400 bg-slate-900 ${r.status === 'Completed' ? 'bg-cyan-400' : ''}"></div>
        <span class="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">${r.quarter} &bull; ${r.status}</span>
        <h4 class="text-lg font-bold text-white mt-1 font-heading">${r.title}</h4>
        <p class="text-slate-400 text-sm mt-1 leading-relaxed">${r.desc}</p>
      </div>
    `).join('');
  }

  renderEmployeeHome() {
    const user = appState.getUser();
    if (!user) return;

    // Greeting with local time
    const greetingEl = document.getElementById('emp-home-greeting');
    if (greetingEl) {
      const hour = new Date().getHours();
      let greeting = 'Good Evening';
      if (hour < 12) greeting = 'Good Morning';
      else if (hour < 18) greeting = 'Good Afternoon';
      greetingEl.textContent = `${greeting}, ${user.name}!`;
    }

    document.getElementById('emp-home-title').textContent = `${user.title} · ${user.department}`;
    document.getElementById('emp-home-badge').textContent = user.role.toUpperCase();

    // Clock display
    this.updateLiveClock();

    // Recent user tasks
    const tasks = appState.getTasks(user.id);
    const taskContainer = document.getElementById('emp-home-tasks-list');
    if (taskContainer) {
      if (tasks.length === 0) {
        taskContainer.innerHTML = `<p class="text-xs text-slate-500 py-4 italic">No active tasks assigned directly. Enjoy smooth sailing!</p>`;
      } else {
        taskContainer.innerHTML = tasks.slice(0, 4).map(t => `
          <div class="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div class="space-y-1 pr-3">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full ${t.priority === 'Critical' ? 'bg-rose-500' : t.priority === 'High' ? 'bg-amber-400' : 'bg-cyan-400'}"></span>
                <h5 class="text-sm font-semibold text-slate-200">${t.title}</h5>
              </div>
              <p class="text-xs text-slate-400 line-clamp-1">${t.description}</p>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">${t.status.replace('_', ' ')}</span>
              <button onclick="window.itrexApp.cycleTaskStatus('${t.id}')" class="text-xs text-cyan-400 hover:text-cyan-300 px-2 py-1 bg-cyan-950/40 rounded border border-cyan-800/40">
                Advance &rarr;
              </button>
            </div>
          </div>
        `).join('');
      }
    }
  }

  renderEmployeeDashboard() {
    const user = appState.getUser();
    if (!user) return;

    const allTasks = appState.getTasks();
    const myTasks = allTasks.filter(t => t.assignedTo === user.id);

    // Update KPI numbers
    document.getElementById('dash-kpi-total').textContent = myTasks.length;
    document.getElementById('dash-kpi-done').textContent = myTasks.filter(t => t.status === 'done').length;
    document.getElementById('dash-kpi-prog').textContent = myTasks.filter(t => t.status === 'in_progress').length;

    // Render Kanban columns
    const statuses = ['todo', 'in_progress', 'review', 'done'];
    statuses.forEach(status => {
      const col = document.getElementById(`kanban-col-${status}`);
      if (!col) return;

      const items = myTasks.filter(t => t.status === status);
      col.innerHTML = items.length === 0 
        ? `<div class="p-3 text-center text-xs text-slate-600 border border-dashed border-slate-800 rounded-xl">Empty</div>`
        : items.map(t => `
          <div class="glass-panel p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2 mb-3">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded ${t.priority === 'Critical' ? 'bg-rose-950/70 text-rose-300 border border-rose-800/50' : 'bg-slate-800 text-slate-400'}">${t.priority}</span>
              <span class="text-[11px] text-slate-500 font-mono">Due ${t.dueDate}</span>
            </div>
            <h4 class="text-sm font-semibold text-slate-200 leading-snug">${t.title}</h4>
            <p class="text-xs text-slate-400 line-clamp-2">${t.description}</p>
            <div class="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div class="flex gap-1 flex-wrap">
                ${t.tags.map(tag => `<span class="text-[9px] px-1.5 py-0.2 rounded bg-slate-800/80 text-cyan-300 font-mono">${tag}</span>`).join('')}
              </div>
              <button onclick="window.itrexApp.cycleTaskStatus('${t.id}')" class="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium">
                Cycle &rarr;
              </button>
            </div>
          </div>
        `).join('');
    });

    // Render Productivity Chart
    this.renderProductivityChart();
  }

  renderAdminView() {
    if (!appState.isAdmin()) return;

    // Employees table
    const employees = appState.getEmployees();
    const empTable = document.getElementById('admin-employees-tbody');
    if (empTable) {
      empTable.innerHTML = employees.map(e => `
        <tr class="border-b border-slate-800/80 hover:bg-slate-900/40 transition-colors text-xs">
          <td class="py-3 px-4 flex items-center gap-2">
            <span class="text-lg">${e.avatar || '👤'}</span>
            <div>
              <span class="font-bold text-white block">${e.name}</span>
              <span class="text-slate-500 font-mono text-[10px]">${e.email}</span>
            </div>
          </td>
          <td class="py-3 px-4 text-slate-300">${e.title}</td>
          <td class="py-3 px-4 text-slate-400">${e.department}</td>
          <td class="py-3 px-4">
            <span class="${e.role === 'admin' ? 'badge-admin' : 'badge-employee'} px-2 py-0.5 rounded text-[10px] font-mono uppercase">
              ${e.role}
            </span>
          </td>
          <td class="py-3 px-4">
            <span class="inline-flex items-center gap-1.5 text-[11px] font-medium ${e.status === 'Active' ? 'text-emerald-400' : 'text-slate-500'}">
              <span class="w-1.5 h-1.5 rounded-full ${e.status === 'Active' ? 'bg-emerald-400' : 'bg-slate-600'}"></span>
              ${e.status}
            </span>
          </td>
          <td class="py-3 px-4 text-right">
            ${e.id === appState.getUser().id ? '<span class="text-slate-600 italic">Self</span>' : `
              <button onclick="window.itrexApp.toggleEmployeeRole('${e.id}')" class="text-cyan-400 hover:text-cyan-300 mr-2 font-mono text-[11px]">Toggle Role</button>
              <button onclick="window.itrexApp.deactivateEmployee('${e.id}')" class="text-rose-400 hover:text-rose-300 font-mono text-[11px]">Deactivate</button>
            `}
          </td>
        </tr>
      `).join('');
    }

    // Audit logs
    const logs = appState.getAuditLogs();
    const logContainer = document.getElementById('admin-audit-logs-list');
    if (logContainer) {
      logContainer.innerHTML = logs.slice(0, 8).map(l => `
        <div class="flex items-start gap-3 p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/60 text-xs">
          <span class="font-mono text-[10px] px-1.5 py-0.5 rounded uppercase ${l.level === 'SUCCESS' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : l.level === 'WARNING' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-slate-800 text-slate-300'}">${l.level}</span>
          <div class="flex-1 space-y-0.5">
            <div class="flex items-center justify-between">
              <span class="font-semibold text-slate-200">${l.action}</span>
              <span class="text-[10px] font-mono text-slate-500">${l.timestamp}</span>
            </div>
            <p class="text-slate-400 text-[11px]">${l.details}</p>
            <span class="text-[10px] text-cyan-400 font-mono">By: ${l.user}</span>
          </div>
        </div>
      `).join('');
    }

    // Admin metrics chart
    this.renderAdminMetricsChart();
  }

  renderSettingsView() {
    const user = appState.getUser();
    if (!user) return;

    document.getElementById('settings-profile-name').value = user.name;
    document.getElementById('settings-profile-email').value = user.email;
    document.getElementById('settings-profile-title').value = user.title || '';
    document.getElementById('settings-profile-dept').value = user.department || '';
    document.getElementById('settings-profile-bio').value = user.bio || '';
  }

  // --- Actions & Helpers ---
  cycleTaskStatus(taskId) {
    const task = appState.getTasks().find(t => t.id === taskId);
    if (!task) return;

    const sequence = ['todo', 'in_progress', 'review', 'done'];
    const currentIdx = sequence.indexOf(task.status);
    const nextStatus = sequence[(currentIdx + 1) % sequence.length];

    appState.updateTaskStatus(taskId, nextStatus);
    this.showToast('Task Updated', `Task status advanced to "${nextStatus.replace('_', ' ')}".`, 'info');
  }

  toggleEmployeeRole(empId) {
    if (!appState.isAdmin()) return;
    const emp = appState.getEmployees().find(e => e.id === empId);
    if (!emp) return;

    const newRole = emp.role === 'admin' ? 'employee' : 'admin';
    appState.updateEmployee(empId, { role: newRole });
    this.showToast('Permissions Changed', `${emp.name}'s role switched to ${newRole.toUpperCase()}.`, 'success');
  }

  deactivateEmployee(empId) {
    if (!appState.isAdmin()) return;
    try {
      appState.deleteEmployee(empId);
      this.showToast('Employee Updated', 'Account has been deactivated.', 'warning');
    } catch (e) {
      this.showToast('Action Failed', e.message, 'error');
    }
  }

  openProductModal(productId) {
    const product = appState.getProducts().find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('product-detail-modal');
    document.getElementById('modal-product-title').textContent = product.name;
    document.getElementById('modal-product-code').textContent = product.code;
    document.getElementById('modal-product-category').textContent = product.category;
    document.getElementById('modal-product-status').textContent = product.status;
    document.getElementById('modal-product-desc').textContent = product.description;
    document.getElementById('modal-product-pricing').textContent = product.pricing;
    document.getElementById('modal-product-architect').textContent = product.leadArchitect || 'Satyam';

    const featContainer = document.getElementById('modal-product-features');
    featContainer.innerHTML = product.features.map(f => `
      <li class="flex items-start gap-2 text-xs text-slate-300">
        <span class="text-cyan-400 font-bold">&check;</span>
        <span>${f}</span>
      </li>
    `).join('');

    modal.classList.remove('hidden');
  }

  closeProductModal() {
    const modal = document.getElementById('product-detail-modal');
    if (modal) modal.classList.add('hidden');
  }

  openNewEmployeeModal() {
    if (!appState.isAdmin()) return;
    document.getElementById('new-employee-modal').classList.remove('hidden');
  }

  closeNewEmployeeModal() {
    document.getElementById('new-employee-modal').classList.add('hidden');
  }

  openNewProductModal() {
    if (!appState.isAdmin()) return;
    document.getElementById('new-product-modal').classList.remove('hidden');
  }

  closeNewProductModal() {
    document.getElementById('new-product-modal').classList.add('hidden');
  }

  updateLiveClock() {
    const clockEl = document.getElementById('emp-home-clock');
    if (!clockEl) return;
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  toggleShiftTimer() {
    const btn = document.getElementById('btn-shift-timer');
    const display = document.getElementById('shift-timer-display');

    if (this.isShiftRunning) {
      clearInterval(this.shiftTimerInterval);
      this.isShiftRunning = false;
      btn.textContent = 'Resume Shift';
      btn.classList.remove('bg-rose-500');
      btn.classList.add('bg-cyan-500');
      this.showToast('Shift Paused', 'Your working session timer is currently paused.', 'info');
    } else {
      this.isShiftRunning = true;
      btn.textContent = 'Pause Shift';
      btn.classList.remove('bg-cyan-500');
      btn.classList.add('bg-rose-500');
      this.showToast('Shift Active', 'Workspace session timer started.', 'success');

      this.shiftTimerInterval = setInterval(() => {
        this.shiftSeconds++;
        const hrs = String(Math.floor(this.shiftSeconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((this.shiftSeconds % 3600) / 60)).padStart(2, '0');
        const secs = String(this.shiftSeconds % 60).padStart(2, '0');
        if (display) display.textContent = `${hrs}:${mins}:${secs}`;
      }, 1000);
    }
  }

  renderProductivityChart() {
    const canvas = document.getElementById('productivity-chart');
    if (!canvas || !window.Chart) return;

    if (this.charts.productivity) {
      this.charts.productivity.destroy();
    }

    const ctx = canvas.getContext('2d');
    this.charts.productivity = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'],
        datasets: [{
          label: 'Engineering Velocity (Story Points)',
          data: [12, 19, 15, 24, 28, 14, 32],
          borderColor: '#00f2fe',
          backgroundColor: 'rgba(0, 242, 254, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#00f2fe',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } }
          }
        }
      }
    });
  }

  renderAdminMetricsChart() {
    const canvas = document.getElementById('admin-metrics-chart');
    if (!canvas || !window.Chart) return;

    if (this.charts.admin) {
      this.charts.admin.destroy();
    }

    const ctx = canvas.getContext('2d');
    this.charts.admin = new window.Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Kernel I/O', 'Edge Mesh', 'Vision API', 'Zero-Trust Shield', 'Agent Mesh'],
        datasets: [{
          label: 'Throughput (k req/s)',
          data: [420, 310, 185, 540, 290],
          backgroundColor: [
            'rgba(0, 242, 254, 0.7)',
            'rgba(79, 172, 254, 0.7)',
            'rgba(121, 40, 202, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(245, 158, 11, 0.7)'
          ],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { family: 'Space Grotesk', size: 11 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } }
          }
        }
      }
    });
  }

  initIntroCanvas() {
    const canvas = document.getElementById('intro-particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 65;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1,
        color: i % 3 === 0 ? 'rgba(0, 242, 254, 0.7)' : i % 3 === 1 ? 'rgba(121, 40, 202, 0.7)' : 'rgba(79, 172, 254, 0.5)'
      });
    }

    const drawParticles = () => {
      if (this.currentView !== 'intro') {
        requestAnimationFrame(drawParticles);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Connect lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 242, 254, ${0.2 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw points
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      requestAnimationFrame(drawParticles);
    };

    drawParticles();
  }

  showToast(title, message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const colors = {
      success: 'border-emerald-500 bg-emerald-950/80 text-emerald-200',
      error: 'border-rose-500 bg-rose-950/80 text-rose-200',
      warning: 'border-amber-500 bg-amber-950/80 text-amber-200',
      info: 'border-cyan-500 bg-slate-900/90 text-cyan-200'
    };

    toast.className = `p-4 rounded-xl border backdrop-blur-xl shadow-2xl flex items-start gap-3 transition-all transform translate-y-2 opacity-0 text-xs ${colors[type] || colors.info}`;
    toast.innerHTML = `
      <div class="space-y-0.5 flex-1">
        <h5 class="font-bold uppercase tracking-wider text-[11px]">${title}</h5>
        <p class="text-slate-300">${message}</p>
      </div>
      <button class="text-slate-400 hover:text-white text-sm font-bold">&times;</button>
    `;

    toast.querySelector('button').onclick = () => toast.remove();
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  setupEventListeners() {
    // Demo quick logins
    const btnDemoAdmin = document.getElementById('btn-demo-admin');
    if (btnDemoAdmin) {
      btnDemoAdmin.addEventListener('click', () => {
        document.getElementById('login-email').value = 'admin@itrex.internal';
        document.getElementById('login-password').value = 'admin';
        document.getElementById('login-form').dispatchEvent(new Event('submit'));
      });
    }

    const btnDemoEmp = document.getElementById('btn-demo-employee');
    if (btnDemoEmp) {
      btnDemoEmp.addEventListener('click', () => {
        document.getElementById('login-email').value = 'employee@itrex.internal';
        document.getElementById('login-password').value = 'employee';
        document.getElementById('login-form').dispatchEvent(new Event('submit'));
      });
    }

    // Login submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;

        const result = appState.login(email, pass);
        if (result.success) {
          this.showToast('Authentication Verified', `Welcome back, ${result.user.name}!`, 'success');
          // Route based on role
          if (result.user.role === 'admin') {
            window.location.hash = '#admin';
          } else {
            window.location.hash = '#employee-home';
          }
        } else {
          this.showToast('Login Failed', result.message, 'error');
        }
      });
    }

    // Logout
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        appState.logout();
        this.showToast('Signed Out', 'You have been disconnected from the workspace.', 'info');
        window.location.hash = '#home';
      });
    }

    // Add employee form
    const formNewEmp = document.getElementById('form-new-employee');
    if (formNewEmp) {
      formNewEmp.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('new-emp-name').value;
        const email = document.getElementById('new-emp-email').value;
        const role = document.getElementById('new-emp-role').value;
        const title = document.getElementById('new-emp-title').value;
        const dept = document.getElementById('new-emp-dept').value;

        try {
          appState.addEmployee({
            name,
            email,
            password: 'password123',
            role,
            title,
            department: dept,
            status: 'Active',
            avatar: role === 'admin' ? '👑' : '💻'
          });
          this.closeNewEmployeeModal();
          formNewEmp.reset();
          this.showToast('Employee Added', `${name} can now sign in with password: password123`, 'success');
        } catch (err) {
          this.showToast('Failed to Add', err.message, 'error');
        }
      });
    }

    // Add product form
    const formNewProd = document.getElementById('form-new-product');
    if (formNewProd) {
      formNewProd.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('new-prod-name').value;
        const code = document.getElementById('new-prod-code').value;
        const category = document.getElementById('new-prod-category').value;
        const summary = document.getElementById('new-prod-summary').value;
        const pricing = document.getElementById('new-prod-pricing').value;

        try {
          appState.addProduct({
            name,
            code,
            category,
            badge: 'New Innovation',
            status: 'Internal Preview',
            rating: 5.0,
            summary,
            description: summary,
            features: ['Autonomous orchestration', 'Real-time telemetry integration'],
            pricing
          });
          this.closeNewProductModal();
          formNewProd.reset();
          this.showToast('Product Deployed', `${name} was published to company catalog.`, 'success');
        } catch (err) {
          this.showToast('Failed to Create', err.message, 'error');
        }
      });
    }

    // Profile settings form
    const formSettings = document.getElementById('form-settings-profile');
    if (formSettings) {
      formSettings.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = appState.getUser();
        if (!user) return;

        const name = document.getElementById('settings-profile-name').value;
        const title = document.getElementById('settings-profile-title').value;
        const department = document.getElementById('settings-profile-dept').value;
        const bio = document.getElementById('settings-profile-bio').value;

        appState.updateEmployee(user.id, { name, title, department, bio });
        this.showToast('Settings Saved', 'Your workspace profile has been updated.', 'success');
      });
    }

    // Reset database button
    const btnReset = document.getElementById('btn-reset-db');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('Are you sure you want to restore default demo records? All created employees and tasks will be reset.')) {
          appState.resetToDefaults();
          this.showToast('Database Restored', 'Platform state has been reset to initial factory configuration.', 'info');
        }
      });
    }

    // Shift timer
    const btnTimer = document.getElementById('btn-shift-timer');
    if (btnTimer) {
      btnTimer.addEventListener('click', () => this.toggleShiftTimer());
    }

    // Periodically update live clocks
    setInterval(() => {
      if (this.currentView === 'employee-home') {
        this.updateLiveClock();
      }
    }, 1000);
  }
}

// Instantiate and expose globally
window.addEventListener('DOMContentLoaded', () => {
  window.itrexApp = new ItrexApp();
});
