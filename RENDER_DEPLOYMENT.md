# Deploying I-Trex Innovations & Database on Render.com

This guide provides simple, step-by-step instructions to deploy your **I-Trex Platform** and its **Managed PostgreSQL Database** on [Render.com](https://render.com).

---

## 🏗️ Architecture Overview

The platform uses a **Dual-Mode Database & Real-Time Sync Engine**:
1. **Client-Side Real-Time Mesh**: Uses `BroadcastChannel` and `localStorage`/`IndexedDB` so that multiple browser tabs, team members, and windows sync instantly in real-time without reloading.
2. **Cloud-Side PostgreSQL Database**: When deployed on Render with `DATABASE_URL`, `server.js` automatically creates all required relational tables (`users`, `tasks`, `notes`, `shifts`, `activity_logs`, `contact_inquiries`) and stores every user action permanently.

---

## 🚀 1-Click Deployment with `render.yaml` Blueprint

Because this repository includes [`render.yaml`](file:///d:/new%20project/render.yaml), Render can automatically create both the **Web Service** and the **Managed PostgreSQL Database** together!

### Step 1: Push Code to GitHub
1. Connect your repository on GitHub (`I-Trex-app`) and push your code:
   ```bash
   git remote set-url origin https://github.com/satys9267-cyber/I-Trex-app.git
   git branch -M main
   git push origin main --force
   ```

### Step 2: Connect to Render.com
1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click the **"New +"** button at the top right and select **"Blueprint"**.
3. Connect your GitHub account and select your `I-Trex-app` repository.
4. Render will read `render.yaml` and show:
   * **Web Service**: `itrex-platform` (Node.js runtime)
   * **Database**: `itrex-postgres` (Free Tier Managed PostgreSQL)
5. Click **"Apply"**.

### Step 3: That's It!
* Render will provision your PostgreSQL database.
* It automatically injects the secret `DATABASE_URL` directly into your web service.
* Render builds your app (`npm install`) and starts your server (`node server.js`).
* You will receive a live URL: `https://itrex-platform.onrender.com`.

---

## 🛠️ Manual Deployment (Alternative Option)

If you prefer to configure manually on Render without the Blueprint:

### 1. Create the Database on Render
1. In Render Dashboard, click **New +** → **PostgreSQL**.
2. Name: `itrex-postgres`
3. Database: `itrex_db`
4. User: `itrex_admin`
5. Plan: **Free**
6. Click **Create Database**.
7. Once created, copy the **Internal Database URL** (e.g., `postgresql://itrex_admin:...@dpg-...-a/itrex_db`).

### 2. Create the Web Service on Render
1. Click **New +** → **Web Service**.
2. Select your GitHub repository (`I-Trex-app`).
3. Settings:
   * **Name**: `itrex-platform`
   * **Environment**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
4. Under **Environment Variables**, add:
   * `DATABASE_URL` = (Paste your copied PostgreSQL URL)
   * `NODE_ENV` = `production`
5. Click **Create Web Service**.

---

## 🗄️ Database Tables Created Automatically

When `server.js` boots with `DATABASE_URL`, it automatically runs the schema initialization:

| Table | Purpose |
| :--- | :--- |
| `users` | User profiles, passwords, roles (`admin`/`employee`), titles, bios, total shift hours |
| `tasks` | Sprint Kanban items (status: `todo`, `in_progress`, `review`, `completed`), priorities, assignees |
| `notes` | Real-time collaborative scratchpad & team broadcast messages |
| `shifts` | Working session stopwatch records & duration metrics |
| `activity_logs` | Zero-Trust system audit trail recording every user action |
| `contact_inquiries` | Inquiries submitted via the public contact terminal |
