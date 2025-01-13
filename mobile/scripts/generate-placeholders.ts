import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

async function generatePlaceholders() {
  const assetsDir = join(__dirname, '../assets');
  mkdirSync(assetsDir, { recursive: true });

  // Generate a simple white square for each required image
  const images = {
    'icon.png': [1024, 1024],
    'splash.png': [1242, 2436],
    'adaptive-icon.png': [108, 108],
    'favicon.png': [48, 48]
  };

  for (const [filename, [width, height]] of Object.entries(images)) {
    await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .png()
    .toFile(join(assetsDir, filename));
  }
}

generatePlaceholders().catch(console.error); 