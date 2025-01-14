const fs = require('fs');
const path = require('path');

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}

// Base64 encoded 1x1 transparent PNG
const TRANSPARENT_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// Function to write base64 to file
function writeBase64ToFile(filename) {
  const filePath = path.join(assetsDir, filename);
  const buffer = Buffer.from(TRANSPARENT_PNG, 'base64');
  fs.writeFileSync(filePath, buffer);
  console.log(`Created ${filename}`);
}

// Generate required assets
const requiredAssets = [
  'icon.png',
  'splash.png',
  'adaptive-icon.png',
  'notification-icon.png',
  'favicon.png'
];

requiredAssets.forEach(writeBase64ToFile);

console.log('Asset generation complete');