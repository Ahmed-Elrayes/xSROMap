/**
 * xSROMap - Vite Example
 * 
 * This example demonstrates how to use xSROMap with Vite and ES6 modules.
 * 
 * To run this example:
 * 1. npm install
 * 2. npm run dev
 * 3. Open http://localhost:5173/examples/vite-example/
 */

import { createXSROMap, CoordinateUtils } from '../../src/index.js';
import 'leaflet/dist/leaflet.css';

// Create the map instance
const map = createXSROMap('map', {
  // Point to your minimap tiles directory
  imgHost: '../../assets/img/silkroad/minimap/',
  // Initial view coordinates (Hotan)
  initialX: 114,
  initialY: 47.25
});

// Make map available globally for demo buttons
window.xSROMapInstance = map;

// Demo: Navigate to different towns
window.flyToJangan = () => {
  map.FlyView(6434, 1044);
};

window.flyToHotan = () => {
  map.FlyView(114, 47.25);
};

window.flyToSamarkand = () => {
  map.FlyView(-5184, 2889);
};

window.flyToConstantinople = () => {
  map.FlyView(-10681, 2584);
};

// Demo: Add a random player marker
let playerCount = 0;
window.addRandomPlayer = () => {
  const id = `player_${++playerCount}`;
  const x = Math.random() * 10000 - 5000;
  const y = Math.random() * 5000;
  
  map.AddPlayer(id, `<b>Player ${playerCount}</b><br>Random location`, x, y);
  map.FlyView(x, y);
  
  console.log(`Added player at:`, CoordinateUtils.gameToSRO(x, y));
};

// Example: Add some NPCs
map.AddNPC('blacksmith_jangan', '<b>Blacksmith NPC</b><br>Jangan City', 6500, 1000);
map.AddNPC('merchant_hotan', '<b>Merchant NPC</b><br>Hotan City', 150, 50);

// Example: Add a teleport
map.AddTeleport('<b>Dimensional Gate</b><br>Fast travel', 0, 6434, 1044);

// Log coordinate conversion example
console.log('Coordinate conversion example:');
console.log('Game coords (6434, 1044) =>', CoordinateUtils.gameToSRO(6434, 1044));
