# xSROMap
The easy way to explore the [**Silkroad Online**](http://www.joymax.com/silkroad/) world map.

## Installation

### NPM (ES6/Vite/Modern Bundlers)

```bash
npm install xsromap
```

### CDN (Browser)

```html
<!-- Leaflet (required) -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<!-- xSROMap -->
<script src="https://unpkg.com/xsromap/dist/xsromap.umd.cjs"></script>
```

## Usage

### ES6 Module (Vite, Webpack, etc.)

```javascript
import { createXSROMap, CoordinateUtils } from 'xsromap';
import 'leaflet/dist/leaflet.css';

// Create map instance
const map = createXSROMap('map', {
  imgHost: '/path/to/minimap/tiles/',
  initialX: 114,
  initialY: 47.25
});

// Navigate to a location
map.FlyView(6434, 1044); // Jangan

// Add markers
map.AddNPC('npc1', '<b>Blacksmith</b>', 6500, 1100);
map.AddPlayer('player1', '<b>JellyBitz</b>', 116.75, 117);

// Use coordinate utilities
const sroCoord = CoordinateUtils.gameToSRO(6434, 1044);
console.log(sroCoord); // { x, y, z, region, posX, posY }
```

### Browser (UMD)

```html
<div id="map" style="width: 100%; height: 100vh;"></div>

<script>
  // xSROMap is available globally
  const map = xSROMap.createXSROMap('map', {
    imgHost: 'assets/img/silkroad/minimap/'
  });
  
  map.FlyView(6434, 1044);
</script>
```

### TypeScript Support

The package includes TypeScript declarations out of the box:

```typescript
import { createXSROMap, XSROMapInstance, SROCoord } from 'xsromap';

const map: XSROMapInstance = createXSROMap('map');
```

### Laravel + Vite Integration

> Complete examples available in [`examples/laravel/`](examples/laravel/)

**1. Install packages**

```bash
npm install xsromap leaflet
```

**2. Copy the integration script**

Copy [`examples/laravel/sromap.js`](examples/laravel/sromap.js) to `resources/js/sromap.js`

**3. Import in `resources/js/app.js`**

```javascript
import './bootstrap';
import './sromap';
```

**4. Copy minimap tiles**

```bash
cp -r /path/to/minimap/tiles storage/app/public/minimap/
php artisan storage:link
```

**5. Standard Usage (Global xSROMap)**

```html
<div id="map" style="height: 500px;"></div>

<script type="module">
    // Set image host BEFORE init
    xSROMap.ImageHost = '/storage/minimap';
    
    // Initialize the map (Hotan by default)
    xSROMap.init('map', 114, 47.25);
    xSROMap.SetZoomLimit(2, 6);
    
    // Add markers
    xSROMap.AddNPC('npc1', '<b>Blacksmith</b>', 6500, 1000);
    xSROMap.FlyView(6434, 1044); // Navigate to Jangan
</script>
```

**6. With Blade Component**

Copy [`examples/laravel/sromap.blade.php`](examples/laravel/sromap.blade.php) to `resources/views/components/sromap.blade.php`

```blade
{{-- Auto-initialized --}}
<x-sromap x="6434" y="1044" height="600px" />

{{-- Multiple maps --}}
<x-sromap id="map-jangan" x="6434" y="1044" />
<x-sromap id="map-hotan" x="114" y="47.25" />

{{-- With Livewire (wire:ignore is automatic) --}}
<x-sromap id="livewire-map" :wire="true" />
```

**7. With Livewire**

See complete example: [`examples/laravel/example-livewire.blade.php`](examples/laravel/example-livewire.blade.php)

```blade
{{-- The key is wire:ignore to prevent Livewire from touching the map DOM --}}
<div id="map" data-sromap wire:ignore style="height: 500px;"></div>

@push('scripts')
<script>
    Livewire.on('flyToLocation', (data) => {
        xSROMap.FlyView(data.x, data.y);
    });
    
    Livewire.on('mobSelected', (data) => {
        xSROMap.ClearDrawingShapes();
        data.spawns.forEach(spawn => {
            xSROMap.AddDrawingShape('Marker', [spawn.x, spawn.y, 0, spawn.region]);
        });
    });
</script>
@endpush
```

**8. Passing data from Controller**

```php
// Controller
public function show() {
    return view('map', ['npcs' => Npc::all()]);
}
```

```blade
{{-- Blade --}}
<div id="map" style="height: 100vh;"></div>

<script type="module">
    xSROMap.ImageHost = '{{ asset("storage/minimap") }}';
    xSROMap.init('map');
    
    @foreach($npcs as $npc)
        xSROMap.AddNPC('{{ $npc->id }}', '<b>{{ $npc->name }}</b>', {{ $npc->x }}, {{ $npc->y }});
    @endforeach
</script>
```

## Building from Source

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build library
npm run build
```

---

### Features
- Navigate through towns, areas, and other popular locations
- Search filter by locations or NPC's
- Search by coordinates (both supported: PosX,PosY or X,Y,Z,Region)
- Teleport actions with NPC's included
- Show coordinates by click
- Zoom levels
- Script editor (Create, Export, Import working even with bots)
- Works on mobile devices

> Are you looking for a [**DEMO**](http://JellyBitz.github.io/xSROMap)?

---
### Getting Started

**xSROMap.js** library contains the following methods, basic to create fully functional map.

| Method | Return | Description
| :---- | :---: | :--- |
| init(`TagID`) | - | Initialize the silkroad map at the specified html tag with viewpoint at Hotan
| init(`TagID,PosX,PosY`) | - | Overload, with view at **in game** (**IG**) coords
| init(`TagID,X,Y,Z,Region`) | - | Overload, with view at **internal client** (**IC**) coords
| SetZoomLimit(`MinZoom,MaxZoom`) | - | Limit the zoom min. and max. Values [0-9]
| SetView(`PosX,PosY`) | - | Set the view instantly using IG coords
| SetView(`X,Y,Z,Region`) | - | Overload, using IC coords
| FlyView(`PosX,PosY`) | - | Set the view flying using IG coords
| FlyView(`X,Y,Z,Region`) | - | Overload, using IC coords
| AddNPC(`NpcID,HTMLPopup,PosX,PosY`) | - | Add NPC marker
| AddNPC(`NpcID,HTMLPopup,X,Y,Z,Region`) | - | Overload, using IC coords
| GoToNPC(`NpcID`) | `Boolean` | Set the view on NPC and highlight him, return `True` if the ID exists
| AddTeleport(`HTMLPopup,Type,PosX,PosY`) | - | Add Teleport marker, `Type` is a number (0-6) which specify the icon shown
| AddTeleport(`HTMLPopup,Type,X,Y,Z,Region`) | - | Overload, using IC coords
| AddPlayer(`PlayerID,HTMLPopup,PosX,PosY`) | - | Add Player marker
| MovePlayer(`PlayerID,PosX,PosY`) | - | Moves a player by his ID, to the IC coords even through differents areas
| MovePlayer(`PlayerID,X,Y,Z,Region`) | - | Overload, using IC coords
| GoToPlayer(`PlayerID`) | `Boolean` | Set the view on Player and highlight him, return `True` if the ID exists
| RemovePlayer(`PlayerID`) | - | Removes the Player marker

**Note:** The map accepts **GET** parameters, to share shortcut/link locations between users. Both coordinate types are supported and the link will be pointing the current map site.

> The methods and functionalities not mentioned here are focused at user features. Explore the code for more info.

---
### Generating Game Data (Any server)

**1.)** To implement NPC's and Teleports for specific server, you should count with these essential files that can be extracted from **media.pk2** client file:

- **characterdata_all.txt**
- **textdata_equip&skill_all.txt**
- **textdata_object_all.txt**
- **textzonename_all.txt**
- **npcpos.txt**
- **teleportdata.txt**
- **teleportbuilding.txt**
- **teleportlink.txt**

`characterdata_all.txt` is a compilation of multiples files, like:  
`characterdata_100.txt`  
`characterdata_200.txt`  
`characterdata_300.txt`  
`...`

You should join them all into one big file to fill our requirements.  
Please, keep in mind the files needs to be **lowercased** to get it work in the next step.

Recommended to use _**CMD.exe**_ with `copy` command which merge multiple files automagically.
> `copy /b characterdata*.txt characterdata_all.txt`

**2.)** Go to the following repository at **Repl.it**
> https://repl.it/@JellyBitz/xSROMap-Gen

.. and choose whatever option you think easier:
 
> **1.-** Download **main.exe**  
> **2.-** Locate the program at the folder with all mentioned required files  
> **3.-** Execute the program


> **1.-** Fork the repository  
> **2.-** Upload and replace the required files  
> **3.-** Click at RUN (green) button

**3.)** If everything is right, you'll get new **.js** files, which has a *Copy&Paste* javascript variable.

- **NPCs.js :**  
Contains an object array. The object has as attributes:  
`name` of NPC  
`x, z, y, region` from internal client coords position

- **TP.js :**  
Contains an object array. The object has as attributes:  
`name` of the Gate  
`x, z, y, region` from internal client coords position  
`type` number [0-6] linked to the gate icon  
`teleport` object array to the teleporting areas with `name` of the Area and `x, z, y, region` from the spawn position

- **NPCsLinked.js :**  
Same as **NPCs.js** but the objects also contains the attribute `teleport` explained above

**4.)** Iterate the variable you need and add to the map.
> Check [main.js](https://github.com/JellyBitz/xSROMap/blob/master/assets/js/main.js) for more code references.

### Upcoming
- Show/hide NPC's or Teleports

---
> ### Do you like this project ?  
> ### Support me! [Buy me a coffee <img src="https://twemoji.maxcdn.com/2/72x72/2615.png" width="18" height="18">](https://www.buymeacoffee.com/JellyBitz "Coffee <3")
> 
> ### Made with [<img title="Yes, Code!" src="https://twemoji.maxcdn.com/2/72x72/1f499.png" width="18" height="18">](#) .. Pull if you want! [<img title="I'm JellyBitz" src="https://twemoji.maxcdn.com/2/72x72/1f575.png" width="18" height="18">](#)
