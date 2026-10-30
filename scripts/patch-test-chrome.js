const fs = require('fs');
const path = require('path');

const testPath = path.join(__dirname, '..', 'tests', 'test-admin-and-security.js');
let code = fs.readFileSync(testPath, 'utf8');

code = code.replace(
    'const browser = await chromium.launch({ headless: true });',
    "const browser = await chromium.launch({ channel: 'chrome', headless: true });"
);

fs.writeFileSync(testPath, code, 'utf8');
console.log('Successfully updated test script to use channel: chrome!');
