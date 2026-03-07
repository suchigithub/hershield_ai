const { execSync } = require('child_process');
const path = require('path');

// Build frontend before deploying
const frontendDir = path.join(__dirname, '..', 'frontend');
console.log('[Hershild] Building frontend...');
execSync('npm install && npm run build', { cwd: frontendDir, stdio: 'inherit' });
console.log('[Hershild] Frontend build complete.');
