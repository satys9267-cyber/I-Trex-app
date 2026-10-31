# I-Trex Innovations — Unified Cloud Deployment & Database Guide (Render + Vercel)

This document provides complete instructions to deploy the entire **I-Trex Innovations** platform to **Render** (Node.js API & Managed Cloud Database) and **Vercel** (High-Performance Edge CDN Frontend), ensuring continuous deployment whenever code is updated.

---

## 🏛️ Architecture Overview

```
                                +------------------------------------+
                                |           Global Visitors          |
                                +-----------------+------------------+
                                                  |
                                                  v
                     +----------------------------------------------------+
                     |                 VERCEL EDGE CDN                    |
                     |  - High-speed static delivery                      |
                     |  - Lamborghini-aesthetic landing, products, auth   |
                     |  - /api/* transparent rewrites to Render           |
                     +----------------------------+-----------------------+
                                                  | /api rewrites
                                                  v
                     +----------------------------------------------------+
                     |               RENDER WEB SERVICE                   |
                     |  - Node.js Express API (server.js)                 |
                     |  - Dynamic Product, Approvals, Admin RBAC          |
                     |  - Multi-engine DB connector                       |
                     +----------------------------+-----------------------+
                                                  |
                                                  v
                     +----------------------------------------------------+
                     |             RENDER MANAGED POSTGRESQL              |
                     |  - Tables: users, products, employees, tasks,      |
                     |    approvals, inquiries, audit logs                |
                     +----------------------------------------------------+
```

---

## 🔑 Configured Executive Credentials

The system includes pre-seeded, air-gapped credentials:

| Executive Role | Identifier / Email | Clearance / Role | Access Level |
| :--- | :--- | :--- | :--- |
| **Founder** | `satys9267@gmail.com` | `founder` / `admin` | Full Master Admin Enclave (`admin.html`) |
| **Co-Founder** | `ishwarip267@gmail.com` | `co-founder` / `admin` | Full Master Admin Enclave (`admin.html`) |
| **Co-Founder Pass**| `Ishwari@27` | *Fixed credential* | Verified local & remote |
| **Employees** | Created via Registration | `employee` / `user` | Employee Portal (`dashboard.html` only) |
| **Public / Guest**| Unauthenticated | `guest` | Landing (`index.html`) & Showroom (`products.html`) |

> **Air-Gapped Route Security**:
> - Any visitor or unauthorized user attempting to access `admin.html` is instantly intercepted and redirected to `login.html?denied=admin_enclave_restricted`.
> - Standard users logging in are routed exclusively to `dashboard.html`.
> - Only `satys9267@gmail.com` and `ishwarip267@gmail.com` (or verified admin sessions) can unlock `admin.html`.

---

## 🚀 Part 1: Deploy Backend & Database on Render

Render hosts the Node.js API and the PostgreSQL database.

### Step 1.1: Push Local Changes to GitHub
Your repository is already connected to `https://github.com/satys9267-cyber/I-Trex-app.git`.
Run:
```powershell
git push origin master
```

### Step 1.2: Deploy via Render 1-Click Blueprint (Recommended)
1. Navigate to **[Render Dashboard](https://dashboard.render.com/)**.
2. Click **New +** (top right) $\rightarrow$ Select **Blueprint**.
3. Select your GitHub repository: `satys9267-cyber/I-Trex-app`.
4. Render will read [`render.yaml`](file:///d:/new%20project/render.yaml) automatically:
   - **Web Service**: `itrex-platform` (Node.js runtime, build: `npm install`, start: `npm start`)
   - **Database**: `itrex-postgres` (Managed PostgreSQL Free Tier)
   - It automatically injects `DATABASE_URL` from the database directly into your web service!
5. Click **Apply**.
6. When deployment finishes, your API URL will be live at:
   `https://itrex-platform.onrender.com`

*(Optional Manual Deployment)*:
If not using Blueprints, simply create a **PostgreSQL** instance on Render named `itrex-postgres`, copy its **Internal Database URL**, create a **Web Service** named `itrex-platform`, and add the Environment Variable:
- `DATABASE_URL` = `<your-postgresql-url>`
- `NODE_ENV` = `production`

---

## ⚡ Part 2: Deploy Frontend on Vercel

Vercel provides edge delivery and runs with `vercel.json` to route `/api/*` requests to Render.

### Step 2.1: Import Project on Vercel
1. Navigate to **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import your GitHub repository: `satys9267-cyber/I-Trex-app`.
4. **Project Settings**:
   - **Framework Preset**: *Other*
   - **Root Directory**: `./` (default)
   - **Build Command**: Leave empty (static HTML/CSS/JS)
   - **Output Directory**: Leave empty
5. Click **Deploy**.

### Step 2.2: Verify API Rewrites (`vercel.json`)
The included [`vercel.json`](file:///d:/new%20project/vercel.json) automatically proxies all frontend requests to Render:
```json
{
  "version": 2,
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://itrex-platform.onrender.com/api/$1"
    },
    {
      "source": "/products",
      "destination": "/products.html"
    },
    {
      "source": "/login",
      "destination": "/login.html"
    },
    {
      "source": "/dashboard",
      "destination": "/dashboard.html"
    }
  ]
}
```
*Note*: If your Render service has a custom name or custom domain, simply update line 7 in `vercel.json` with your custom Render URL.

---

## 🔄 Part 3: Continuous Deployment Workflow (Post-Deployment Updates)

Once both platforms are connected to your GitHub repository:

1. **Make Any Code Change** locally in your workspace.
2. **Commit and Push**:
   ```powershell
   git add .
   git commit -m "feat: your new feature or update"
   git push origin master
   ```
3. **Automated Magic**:
   - **Vercel** detects the push and immediately redeploys the frontend CDN in under 30 seconds.
   - **Render** detects the push, runs `npm install`, and restarts the server with zero downtime.
   - Database tables and existing records remain safely stored in Render PostgreSQL.

---

## 🧪 Part 4: Verification Checklist

| Component | Test Method | Expected Result |
| :--- | :--- | :--- |
| **Public Showcase** | Open `/` or `/products` | Lamborghini aerospace UI, interactive models, real-time products |
| **Intro Animation** | Refresh `/index.html` | 3-second glow breathing animation, smooth text reveal |
| **Admin Route Isolation** | Open `/admin.html` directly in Incognito | Instantly bounced to `/login.html?denied=admin_enclave_restricted` |
| **Co-Founder Login** | Login with `ishwarip267@gmail.com` / `Ishwari@27` | Successfully enters `/admin.html#home`, role `CO-FOUNDER` displayed |
| **Founder Login** | Login with `satys9267@gmail.com` | Enters `/admin.html#home`, role `FOUNDER` displayed |
| **Standard User Login**| Register new user & login | Lands on `/dashboard.html`, strictly barred from `/admin.html` |
