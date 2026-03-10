# xSROMap Laravel Integration

This directory contains example files for integrating xSROMap with Laravel + Vite.

## Files

| File | Description | Copy To |
|------|-------------|---------|
| `sromap.js` | Main integration script | `resources/js/sromap.js` |
| `sromap.blade.php` | Reusable Blade component | `resources/views/components/sromap.blade.php` |
| `example-standard.blade.php` | Standard usage example | - |
| `example-livewire.blade.php` | Livewire component view | `resources/views/livewire/unique-map.blade.php` |
| `UniqueMap.php` | Livewire component class | `app/Livewire/UniqueMap.php` |

## Installation

### 1. Install npm packages

```bash
npm install xsromap leaflet
```

### 2. Copy the integration script

```bash
cp examples/laravel/sromap.js resources/js/sromap.js
```

### 3. Import in app.js

```javascript
// resources/js/app.js
import './bootstrap';
import './sromap';
```

### 4. Copy minimap tiles

```bash
# Copy your minimap tiles to public storage
cp -r /path/to/minimap/tiles storage/app/public/minimap/

# Create symlink
php artisan storage:link
```

## Usage

### Standard Usage (Global xSROMap)

```html
<div id="map" style="height: 500px;"></div>

<script type="module">
    // Set image host BEFORE init
    xSROMap.ImageHost = '/storage/minimap';
    
    // Initialize
    xSROMap.init('map', 114, 47.25);
    
    // Use methods
    xSROMap.FlyView(6434, 1044);
    xSROMap.AddNPC('npc1', '<b>Blacksmith</b>', 6500, 1000);
</script>
```

### With Blade Component

```blade
{{-- Auto-initialized --}}
<x-sromap x="6434" y="1044" height="600px" />

{{-- With Livewire --}}
<x-sromap id="my-map" :wire="true" />
```

### With Livewire

```blade
{{-- In Livewire component view --}}
<div id="map" data-sromap wire:ignore style="height: 500px;"></div>

@push('scripts')
<script>
    Livewire.on('flyTo', (data) => {
        window.xSROMap.FlyView(data.x, data.y);
    });
</script>
@endpush
```

### Multiple Independent Maps

```javascript
// Use initSROMap for independent instances
const map1 = window.initSROMap('map-1', { initialX: 6434, initialY: 1044 });
const map2 = window.initSROMap('map-2', { initialX: 114, initialY: 47.25 });

// Each map is independent
map1.FlyView(-5184, 2889);
map2.AddNPC('npc1', 'Hello', 150, 50);
```

## API

### Global xSROMap Object

```javascript
xSROMap.ImageHost = '/path/to/tiles/';  // Set before init
xSROMap.init(elementId, x, y, z?, region?)
xSROMap.SetView(x, y, z?, region?)
xSROMap.FlyView(x, y, z?, region?)
xSROMap.SetZoomLimit(min, max)
xSROMap.AddNPC(id, html, x, y, z?, region?)
xSROMap.AddPlayer(id, html, x, y, z?, region?)
xSROMap.MovePlayer(id, x, y, z?, region?)
xSROMap.RemovePlayer(id)
xSROMap.AddTeleport(html, type, x, y, z?, region?)
xSROMap.AddLocation(id, html, x, y, z?, region?)
xSROMap.RemoveLocation(id)
xSROMap.AddDrawingShape(type, coords, param?)
xSROMap.GetDrawingShapes()
xSROMap.ClearDrawingShapes()
xSROMap.getMap()  // Get Leaflet map instance
xSROMap.destroy() // Cleanup for SPA/Livewire
```

### Events

```javascript
// Map ready event
window.addEventListener('sromap:ready', (e) => {
    const { map, element, xSROMap } = e.detail;
    console.log('Map ready:', element.id);
});
```
