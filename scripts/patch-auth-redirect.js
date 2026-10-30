const fs = require('fs');
const path = require('path');

const authPath = path.join(__dirname, '..', 'auth.js');
let authCode = fs.readFileSync(authPath, 'utf8');

authCode = authCode.replace(
`            const targetView = user.role === 'admin' ? 'admin' : (user.role === 'employee' ? 'employee' : 'user');
            window.location.href = \`dashboard.html?role=\${targetView}\`;`,
`            const isPrivileged = user.role === 'admin' || user.role === 'founder' || user.role === 'co-founder';
            const targetPage = isPrivileged ? 'admin.html' : \`dashboard.html?role=\${user.role || 'user'}\`;
            window.location.href = targetPage;`
);

fs.writeFileSync(authPath, authCode, 'utf8');
console.log('Successfully patched auth.js redirect!');
