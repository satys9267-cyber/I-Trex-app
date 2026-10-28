# I-Trex Innovations · Unified Startup & Workspace Platform

> **Founder**: Satyam  
> **Architecture**: One Website · Two Environments (Public Showcase + Private Operating Workspace)  
> **Interactive Engine**: Google Antigravity Real-Time Physics & Multi-G Simulation

---

## 🌟 Overview

The **I-Trex Platform** is engineered to unify external customer and investor discovery with internal employee operations under a single high-performance codebase.

### Environment 1: Public Platform
- **Cinematic Introduction Page (`#intro`)**: Ambient particle canvas, company mission, quick gateway portals, and interactive zero-g floating chips.
- **Flagship Startup Homepage (`#home`)**: Live enterprise metrics (84,200+ edge nodes, 0.42ms kernel scheduler latency, 99.998% uptime SLA), architecture breakdown, and featured innovations.
- **Product Ecosystem & Tech Specs (`#products`)**: Dynamic catalog featuring **TrexOS Neural Kernel**, **TrexCore Cloud Mesh**, **TrexVision Spatial Engine**, and **TrexShield Autonomous SecOps** with live architecture inspection modals.
- **Company Story & Roadmap (`#about`)**: Satyam's origin vision, core architectural pillars, and interactive milestone timeline (2025–2027).
- **Careers & Contact (`#contact`)**: Interactive job board with open engineering roles and direct founder inquiry messaging.

### Environment 2: Private Workspace & RBAC
- **Unified Authentication Terminal (`#login`)**:
  - One-click demo credentials for instant testing.
  - Role-Based Access Control (RBAC) enforcing distinct privilege layers between staff and administrators.
- **Employee Workspace Hub (`#employee-home`)**:
  - Local digital clock and time-aware greeting.
  - Interactive shift timer with start, pause, and elapsed time tracking.
  - Quick action shortcuts and team activity pulse.
- **Personal Engineering Dashboard (`#dashboard`)**:
  - Dynamic Kanban execution board (To Do, In Progress, Review, Shipped).
  - Productivity metrics and interactive Chart.js velocity visualization.
- **Administrator Command Center (`#admin`)**:
  - **Restricted root access** (only visible and accessible to `admin`).
  - Real-time **Employee Directory Management**: onboard staff, switch roles between Employee/Admin with 1 click, and deactivate accounts.
  - Product Catalog CMS: publish new technologies to the public website.
  - Live Zero-Trust audit log stream and subsystem telemetry graphs.
- **Settings & Preferences (`#settings`)**:
  - Profile customization (name, title, department, bio).
  - Multi-Factor Hardware Enclave (2FA) toggle.
  - Physics sound synthesis options and demonstration database reset.

---

## 🌌 The Google Antigravity Physics Engine

Inspired by the iconic **Google Antigravity** simulation, clicking **"Zero-G Mode"** or **"Trigger Antigravity"** on any page activates the real-time 2D physics engine:
1. **Interactive Tumble**: UI cards, metrics panels, badges, and buttons detach from the CSS grid and react to gravity.
2. **Mouse Drag & Throw**: Pick up any card, fling it across the screen, and watch it bounce off the walls and floor with realistic momentum and elasticity.
3. **Multi-G Gravitational Modes**:
   - `1G Earth`: Natural downward gravity with realistic tumbling and collisions.
   - `0G Space`: Weightless floating drift.
   - `-1G Invert`: Anti-gravity pulling cards upward to the ceiling!
   - `🌙 Moon`: Low-gravity bouncy lunar float (0.16G).
4. **💥 Kinetic Blast Shockwave**: Click "Blast" to send all nearby widgets exploding outward in a radial burst.
5. **🔄 Reassemble Grid**: Click "Assemble" or toggle off to smoothly glide every element back into its exact CSS grid position.
6. **Web Audio Synthesizer**: Built-in futuristic sound frequencies for tosses, collisions, and zero-g activation.

---

## 🔑 Quick Login Credentials

| Role | Name | Email | Password | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** (Founder) | **Satyam** | `admin@itrex.internal` | `admin` | Full Root: Admin Command Center, Employee HR, Product CMS, Audit Logs, Personal Dashboard |
| **Employee** | **Elena Vance** | `employee@itrex.internal` | `employee` | Staff: Workspace Home, Personal Kanban Dashboard, Shift Timer, Profile Settings |

---

## 🚀 How to Launch & Explore

### Option 1: Double-click `index.html`
Simply open `index.html` in any web browser (Google Chrome, Microsoft Edge, Brave, etc.). Everything runs client-side with persistent `localStorage`.

### Option 2: Run Local Server via PowerShell
Open PowerShell in this folder and run:
```powershell
.\start-server.ps1
```
This automatically starts a local HTTP server on `http://localhost:8080` and opens your browser.

---

## 📁 Project Structure

```
d:\I-Trex website\
├── index.html            # Main single-page application & all view containers
├── css/
│   └── styles.css        # Futuristic cyber styles, glassmorphism, glows & animations
├── js/
│   ├── data.js           # Seed data: products, employees, tasks, roadmap, audit logs
│   ├── state.js          # Persistent LocalStorage state engine & RBAC manager
│   ├── antigravity.js    # Google Antigravity real-time physics engine & HUD
│   └── app.js            # Client-side router, view renderers, modals & charts
├── start-server.ps1      # Lightweight local PowerShell web server
└── README.md             # Complete documentation & architecture guide
```
