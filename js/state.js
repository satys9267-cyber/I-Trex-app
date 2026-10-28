/**
 * I-Trex State Management & LocalStorage Persistence Engine
 */

class AppState {
  constructor() {
    this.storageKey = 'itrex_platform_data_v1';
    this.authKey = 'itrex_auth_session_v1';
    this.listeners = [];
    this.init();
  }

  init() {
    const saved = localStorage.getItem(this.storageKey);
    if (!saved) {
      this.data = JSON.parse(JSON.stringify(ITREX_INITIAL_DATA));
      this.persist();
    } else {
      try {
        this.data = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved state, resetting to initial data', e);
        this.data = JSON.parse(JSON.stringify(ITREX_INITIAL_DATA));
        this.persist();
      }
    }

    // Load active session if any
    const savedAuth = localStorage.getItem(this.authKey);
    this.currentUser = null;
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        // Verify user still exists in employees list
        const match = this.data.employees.find(e => e.id === parsedAuth.id && e.status === 'Active');
        if (match) {
          this.currentUser = match;
        } else {
          localStorage.removeItem(this.authKey);
        }
      } catch (e) {
        localStorage.removeItem(this.authKey);
      }
    }

    // Default settings if missing
    if (!this.data.settings) {
      this.data.settings = {
        theme: 'cyber-dark',
        antigravitySensitivity: 'medium',
        soundEffects: true,
        twoFactorAuth: false,
        telemetryTracking: true
      };
      this.persist();
    }
  }

  persist() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  notify() {
    this.persist();
    this.listeners.forEach(fn => fn(this));
  }

  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== fn);
    };
  }

  // --- Auth Management ---
  login(email, password) {
    const cleanEmail = email.trim().toLowerCase();
    const user = this.data.employees.find(e => e.email.toLowerCase() === cleanEmail && e.password === password);
    
    if (!user) {
      return { success: false, message: 'Invalid credentials. Check your email or password.' };
    }

    if (user.status !== 'Active') {
      return { success: false, message: 'Account is deactivated. Contact Administrator.' };
    }

    this.currentUser = user;
    localStorage.setItem(this.authKey, JSON.stringify({ id: user.id, role: user.role }));
    
    this.addAuditLog(
      'AUTH_LOGIN',
      `${user.name} (${user.role.toUpperCase()}) authenticated successfully via secure terminal.`,
      'INFO'
    );

    this.notify();
    return { success: true, user };
  }

  logout() {
    if (this.currentUser) {
      this.addAuditLog(
        'AUTH_LOGOUT',
        `${this.currentUser.name} signed out from workspace.`,
        'INFO'
      );
    }
    this.currentUser = null;
    localStorage.removeItem(this.authKey);
    this.notify();
  }

  isLoggedIn() {
    return !!this.currentUser;
  }

  isAdmin() {
    return this.currentUser && this.currentUser.role === 'admin';
  }

  getUser() {
    return this.currentUser;
  }

  // --- Products Management ---
  getProducts() {
    return this.data.products;
  }

  addProduct(product) {
    if (!this.isAdmin()) throw new Error('Unauthorized: Admin access required.');
    const newProd = {
      ...product,
      id: 'prod-' + Date.now().toString(36)
    };
    this.data.products.unshift(newProd);
    this.addAuditLog('PRODUCT_CREATE', `Product "${newProd.name}" was added to company catalog.`, 'SUCCESS');
    this.notify();
    return newProd;
  }

  updateProduct(id, updates) {
    if (!this.isAdmin()) throw new Error('Unauthorized: Admin access required.');
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.products[idx] = { ...this.data.products[idx], ...updates };
      this.addAuditLog('PRODUCT_UPDATE', `Product "${this.data.products[idx].name}" specifications updated.`, 'INFO');
      this.notify();
    }
  }

  deleteProduct(id) {
    if (!this.isAdmin()) throw new Error('Unauthorized: Admin access required.');
    const prod = this.data.products.find(p => p.id === id);
    if (prod) {
      this.data.products = this.data.products.filter(p => p.id !== id);
      this.addAuditLog('PRODUCT_DELETE', `Product "${prod.name}" was archived from catalog.`, 'WARNING');
      this.notify();
    }
  }

  // --- Employees & Role-Based Access ---
  getEmployees() {
    return this.data.employees;
  }

  addEmployee(empData) {
    if (!this.isAdmin()) throw new Error('Unauthorized: Admin access required.');
    const newEmp = {
      ...empData,
      id: 'emp-' + (this.data.employees.length + 1).toString().padStart(3, '0'),
      joinedDate: new Date().toISOString().split('T')[0]
    };
    this.data.employees.push(newEmp);
    this.addAuditLog('EMPLOYEE_ONBOARD', `New account created for ${newEmp.name} [Role: ${newEmp.role}].`, 'SUCCESS');
    this.notify();
    return newEmp;
  }

  updateEmployee(id, updates) {
    if (!this.isAdmin() && (!this.currentUser || this.currentUser.id !== id)) {
      throw new Error('Unauthorized.');
    }
    const idx = this.data.employees.findIndex(e => e.id === id);
    if (idx !== -1) {
      this.data.employees[idx] = { ...this.data.employees[idx], ...updates };
      // If updating currently logged in user, refresh session
      if (this.currentUser && this.currentUser.id === id) {
        this.currentUser = this.data.employees[idx];
      }
      this.addAuditLog('EMPLOYEE_UPDATE', `Profile details updated for ${this.data.employees[idx].name}.`, 'INFO');
      this.notify();
    }
  }

  deleteEmployee(id) {
    if (!this.isAdmin()) throw new Error('Unauthorized: Admin access required.');
    if (this.currentUser && this.currentUser.id === id) {
      throw new Error('Action aborted: You cannot delete your own active administrator account.');
    }
    const target = this.data.employees.find(e => e.id === id);
    if (target) {
      target.status = 'Deactivated';
      this.addAuditLog('EMPLOYEE_DEACTIVATE', `Employee account for ${target.name} deactivated.`, 'WARNING');
      this.notify();
    }
  }

  // --- Task Operations ---
  getTasks(filterUserId = null) {
    if (filterUserId) {
      return this.data.tasks.filter(t => t.assignedTo === filterUserId);
    }
    return this.data.tasks;
  }

  updateTaskStatus(taskId, newStatus) {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (task) {
      const oldStatus = task.status;
      task.status = newStatus;
      this.addAuditLog('TASK_PROGRESS', `Task "${task.title}" shifted from ${oldStatus} to ${newStatus}.`, 'INFO');
      this.notify();
    }
  }

  addTask(taskData) {
    const newTask = {
      ...taskData,
      id: 'tsk-' + Date.now().toString(36)
    };
    this.data.tasks.unshift(newTask);
    this.addAuditLog('TASK_CREATE', `New sprint assignment added: "${newTask.title}".`, 'INFO');
    this.notify();
    return newTask;
  }

  // --- Audit Logs ---
  addAuditLog(action, details, level = 'INFO') {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    const user = this.currentUser ? `${this.currentUser.name} (${this.currentUser.role})` : 'Guest / System';
    
    this.data.auditLogs.unshift({
      id: 'log-' + Date.now().toString(36),
      timestamp,
      user,
      action,
      details,
      level
    });

    // Keep log buffer bounded to latest 60 items
    if (this.data.auditLogs.length > 60) {
      this.data.auditLogs.pop();
    }
  }

  getAuditLogs() {
    return this.data.auditLogs;
  }

  // --- Settings ---
  updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.addAuditLog('SETTINGS_UPDATE', `System and workspace configuration updated.`, 'INFO');
    this.notify();
  }

  getSettings() {
    return this.data.settings;
  }

  // --- Factory Reset ---
  resetToDefaults() {
    this.data = JSON.parse(JSON.stringify(ITREX_INITIAL_DATA));
    this.persist();
    this.notify();
  }
}

// Global state singleton
const appState = new AppState();
