const fs = require('fs');
const path = require('path');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

console.log('Auditing Media References across HTML files...\n');
let allPassed = true;

htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const regex = /(?:src|href|poster)=["']([^"']+\.(?:png|jpg|jpeg|svg|mp4))["']/g;
    let match;
    console.log(`Checking [${file}]:`);
    let count = 0;
    while ((match = regex.exec(content)) !== null) {
        const ref = match[1];
        if (ref.startsWith('http://') || ref.startsWith('https://')) continue;
        count++;
        const resolvedPath = path.resolve(ref);
        const exists = fs.existsSync(resolvedPath);
        if (!exists) {
            console.error(`  ❌ MISSING: ${ref}`);
            allPassed = false;
        } else {
            console.log(`  ✅ FOUND: ${ref} (${fs.statSync(resolvedPath).size} bytes)`);
        }
    }
    if (count === 0) console.log('  (No local media references found)');
    console.log('');
});

if (allPassed) {
    console.log('🎉 AUDIT COMPLETE: 100% OF LOCAL MEDIA REFERENCES EXIST ON DISK!');
} else {
    console.error('⚠️ AUDIT FAILED: Some media references were not found!');
    process.exit(1);
}
