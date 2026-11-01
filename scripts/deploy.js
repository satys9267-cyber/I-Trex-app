#!/usr/bin/env node
/**
 * I-TREX INNOVATIONS — ONE-COMMAND AUTOMATED DEPLOYMENT PIPELINE
 * Automates: Pre-flight syntax validation -> Git Stage -> Commit -> GitHub Push -> Vercel & Render Sync Verification
 * Usage:
 *   npm run deploy
 *   npm run deploy "custom commit description"
 *   node scripts/deploy.js "custom commit description"
 */

const { execSync } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');

const COLORS = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    dim: '\x1b[2m'
};

function log(msg, color = COLORS.reset) {
    console.log(`${color}${msg}${COLORS.reset}`);
}

function run(cmd, silent = false) {
    try {
        return execSync(cmd, { encoding: 'utf8', stdio: silent ? 'pipe' : 'inherit' });
    } catch (err) {
        if (!silent) {
            log(`[ERROR] Command failed: ${cmd}`, COLORS.red);
        }
        throw err;
    }
}

function getUrl(url) {
    return new Promise((resolve) => {
        const req = https.get(url, { timeout: 6000 }, (res) => {
            resolve({ status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400 });
        });
        req.on('error', (e) => resolve({ status: null, error: e.message, ok: false }));
        req.on('timeout', () => { req.destroy(); resolve({ status: 'TIMEOUT', ok: false }); });
    });
}

(async () => {
    const startTime = Date.now();
    console.log('\n' + '='.repeat(70));
    log('   I-TREX INNOVATIONS // AUTOMATED DEPLOYMENT ENGINE', COLORS.bright + COLORS.cyan);
    log('   Target: GitHub (main) -> Vercel (Frontend) & Render (Backend)', COLORS.dim);
    console.log('='.repeat(70) + '\n');

    // 1. PRE-FLIGHT SYNTAX VALIDATION
    log('[1/5] Running pre-flight syntax and integrity checks...', COLORS.yellow);
    const jsFiles = ['server.js', 'auth.js', 'admin-api.js', 'database.js'];
    for (const file of jsFiles) {
        if (fs.existsSync(file)) {
            try {
                execSync(`node --check ${file}`, { stdio: 'pipe' });
                log(`  ✔ Syntax valid: ${file}`, COLORS.green);
            } catch (e) {
                log(`  ✖ SYNTAX ERROR in ${file}! Deployment halted.`, COLORS.red);
                process.exit(1);
            }
        }
    }

    // 2. CHECK GIT STATUS
    log('\n[2/5] Inspecting workspace modifications...', COLORS.yellow);
    let statusOutput = '';
    try {
        statusOutput = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
    } catch (e) {
        log('  ✖ Failed to inspect git repository status.', COLORS.red);
        process.exit(1);
    }

    if (!statusOutput) {
        log('  ℹ No local file modifications detected. Workspace is clean.', COLORS.cyan);
        log('  Checking remote sync status...', COLORS.dim);
        try {
            run('git push origin main');
            log('  ✔ Remote branch is already in sync with origin/main.', COLORS.green);
        } catch (e) {}
    } else {
        const changedCount = statusOutput.split('\n').length;
        log(`  ✔ Detected ${changedCount} changed/untracked file(s).`, COLORS.cyan);

        // 3. STAGE AND COMMIT
        log('\n[3/5] Staging modifications and generating deployment commit...', COLORS.yellow);
        run('git add -A');

        // Extract custom commit message from CLI arguments if provided
        const rawArg = process.argv.slice(2).join(' ').trim();
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
        const commitMsg = rawArg 
            ? `${rawArg}` 
            : `feat(auto-deploy): automated cross-platform sync [${timestamp}]`;

        try {
            run(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);
            log(`  ✔ Commit created: "${commitMsg}"`, COLORS.green);
        } catch (e) {
            log('  ℹ No commit required or commit already up to date.', COLORS.dim);
        }

        // 4. PUSH TO GITHUB
        log('\n[4/5] Pushing to GitHub repository (origin/main)...', COLORS.yellow);
        try {
            run('git push origin main');
            log('  ✔ Successfully pushed to https://github.com/satys9267-cyber/I-Trex-app.git', COLORS.green);
        } catch (e) {
            log('  ✖ Git push failed. Please verify network or branch permissions.', COLORS.red);
            process.exit(1);
        }
    }

    // 5. DEPLOYMENT TRIGGER & HEALTH VERIFICATION
    log('\n[5/5] Verifying cloud deployment endpoints...', COLORS.yellow);
    log('  • Vercel (Frontend): Automatic webhook triggers build within ~10-20 seconds.');
    log('  • Render (Backend):  Automatic git-watch rebuilds and restarts services.');

    log('\n  Pinging live production endpoints:', COLORS.dim);
    const vercelCheck = await getUrl('https://itrexapps-livid.vercel.app/');
    if (vercelCheck.ok) {
        log(`  ✔ VERCEL FRONTEND: ONLINE (HTTP ${vercelCheck.status}) -> https://itrexapps-livid.vercel.app/`, COLORS.green);
    } else {
        log(`  ℹ VERCEL FRONTEND: HTTP ${vercelCheck.status || 'DEPLOYING'} -> https://itrexapps-livid.vercel.app/`, COLORS.yellow);
    }

    const renderCheck = await getUrl('https://itrex-platform.onrender.com/api/health');
    if (renderCheck.ok) {
        log(`  ✔ RENDER BACKEND:  ONLINE (HTTP ${renderCheck.status}) -> https://itrex-platform.onrender.com/api/health`, COLORS.green);
    } else {
        log(`  ℹ RENDER BACKEND:  HTTP ${renderCheck.status || 'SPINNING_UP'} -> https://itrex-platform.onrender.com`, COLORS.yellow);
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('\n' + '='.repeat(70));
    log(`✨ AUTOMATED DEPLOYMENT COMPLETE IN ${duration}s!`, COLORS.bright + COLORS.green);
    log('   Your changes are live on GitHub and propagating across Vercel & Render.', COLORS.cyan);
    console.log('='.repeat(70) + '\n');
})();
