{{--
    xSROMap Standard Usage Example (No Livewire)
    
    This example shows the standard way to use xSROMap in Laravel Blade
    using the global xSROMap object similar to the original library.
--}}

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>xSROMap - Standard Example</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <style>
        .map-container {
            position: relative;
            width: 100%;
            height: 600px;
        }
        .map-controls {
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 1000;
            background: rgba(0, 0, 0, 0.8);
            padding: 15px;
            border-radius: 8px;
            color: white;
        }
        .map-controls select {
            width: 200px;
            padding: 8px;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Silkroad Online Map</h1>
        
        <div class="map-container">
            {{-- Control Panel --}}
            <div class="map-controls">
                <h5 class="font-bold mb-2">Navigate</h5>
                <select id="townSelect" class="text-black">
                    <option value="">Select a town...</option>
                    <option value="6434,1044">Jangan</option>
                    <option value="3554,2112">Donwhang</option>
                    <option value="114,47.25">Hotan</option>
                    <option value="-5184,2889">Samarkand</option>
                    <option value="-10681,2584">Constantinople</option>
                </select>
            </div>
            
            {{-- Map Element --}}
            <div id="map" style="height: 100%; width: 100%;"></div>
        </div>
    </div>

    <script type="module">
        // Wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', () => {
            // Set the image host BEFORE initializing
            xSROMap.ImageHost = '{{ asset("storage/minimap") }}';
            
            // Initialize the map (Hotan by default)
            xSROMap.init('map', 114, 47.25);
            
            // Optional: Set zoom limits
            xSROMap.SetZoomLimit(2, 6);
            
            // Add some markers
            xSROMap.AddNPC('npc1', '<b>Blacksmith</b><br>Hotan City', 150, 50);
            xSROMap.AddPlayer('player1', '<b>{{ auth()->user()->name ?? "Guest" }}</b>', 114, 47.25);
            
            // Town selector
            document.getElementById('townSelect').addEventListener('change', function() {
                if (this.value) {
                    const [x, y] = this.value.split(',').map(Number);
                    xSROMap.FlyView(x, y);
                }
            });
        });
        
        // Optional: Listen for map ready event
        window.addEventListener('sromap:ready', (e) => {
            console.log('Map initialized:', e.detail.element.id);
        });
    </script>
</body>
</html>
