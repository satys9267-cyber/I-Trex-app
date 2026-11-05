const fs = require('fs');
const path = require('path');

function searchInFiles(dir, terms) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    if (f.name === 'node_modules' || f.name === '.git' || f.name === 'tests' || f.name === 'scripts') continue;
    const full = path.join(dir, f.name);
    if (f.isDirectory()) {
      searchInFiles(full, terms);
    } else if (f.name.endsWith('.html') || f.name.endsWith('.js') || f.name.endsWith('.css') || f.name.endsWith('.json')) {
      const content = fs.readFileSync(full, 'utf8');
      terms.forEach(t => {
        if (content.toLowerCase().includes(t.toLowerCase())) {
          console.log(`Found "${t}" in ${full}`);
        }
      });
    }
  }
}

searchInFiles('.', ['SPECIFICATIONS ENGINE', 'STAGE:', 'SYSTEM DIAGNOSTIC', '20×20×8', 'MISSION']);
