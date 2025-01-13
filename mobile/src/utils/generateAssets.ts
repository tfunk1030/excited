import { writeFileSync } from 'fs';
import { join } from 'path';

const ASSETS_DIR = join(__dirname, '../../assets');

// Simple 1024x1024 white square with a gray border
const icon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAYAAAB/HSuDAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAA==`;

// Simple 1242x2436 splash screen
const splash = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABNIAAACyCAYAAADP7vEwAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAA==`;

// Simple 108x108 adaptive icon
const adaptiveIcon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGwAAABsCAYAAACPZlfNAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAA==`;

function generateAssets() {
  writeFileSync(join(ASSETS_DIR, 'icon.png'), Buffer.from(icon.split(',')[1], 'base64'));
  writeFileSync(join(ASSETS_DIR, 'splash.png'), Buffer.from(splash.split(',')[1], 'base64'));
  writeFileSync(join(ASSETS_DIR, 'adaptive-icon.png'), Buffer.from(adaptiveIcon.split(',')[1], 'base64'));
  writeFileSync(join(ASSETS_DIR, 'favicon.png'), Buffer.from(icon.split(',')[1], 'base64'));
}

generateAssets();