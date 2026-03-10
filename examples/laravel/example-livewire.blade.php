{{--
    xSROMap Livewire Component View Example
    
    This example shows how to use xSROMap inside a Livewire component.
    The key is using wire:ignore to prevent Livewire from touching the map DOM.
    
    Copy to: resources/views/livewire/unique-map.blade.php
--}}

<div>
    {{-- Search Panel --}}
    <div class="map-container" style="position: relative; height: 600px;">
        <div style="position: absolute; top: 20px; left: 20px; z-index: 1000; background: rgba(0,0,0,0.85); padding: 15px; border-radius: 8px; border: 1px solid #d4af37; width: 300px;">
            <h5 class="text-white font-bold mb-3">
                <i class="fas fa-search mr-2" style="color: #ff4e00;"></i>
                Search Unique
            </h5>
            
            <select 
                wire:model.live="selectedMob" 
                class="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            >
                <option value="">Select a Unique...</option>
                @foreach($mobs as $mob)
                    <option value="{{ $mob['code'] }}">
                        {{ $mob['name'] }} ({{ count($mob['spawns']) }} spawns)
                    </option>
                @endforeach
            </select>
        </div>
        
        {{-- Map Container - wire:ignore is CRITICAL --}}
        <div id="map-wrapper" style="width: 100%; height: 100%;" wire:ignore>
            <div 
                id="unique-map"
                data-sromap
                data-x="114"
                data-y="47.25"
                data-imghost="{{ asset('storage/minimap') }}/"
                style="height: 100%; width: 100%; display: block; background: #000;"
            ></div>
        </div>
    </div>
</div>

@push('scripts')
<script>
    document.addEventListener('livewire:initialized', () => {
        let mapInstance = null;
        let currentMarkers = [];
        
        // Initialize map when ready
        window.addEventListener('sromap:ready', (e) => {
            if (e.detail.element.id === 'unique-map') {
                mapInstance = e.detail.map;
                mapInstance.SetZoomLimit(2, 5);
                console.log('Unique map initialized');
            }
        });
        
        // Listen for Livewire events
        Livewire.on('mobSelected', (data) => {
            if (!mapInstance) return;
            
            // Clear previous markers
            clearMarkers();
            
            // Draw new spawn points
            const spawns = data.spawns || [];
            spawns.forEach((spawn, idx) => {
                mapInstance.AddDrawingShape('Marker', [spawn.x, spawn.y, spawn.z || 0, spawn.region]);
                
                // Get the marker we just added and customize it
                const shapes = mapInstance.GetDrawingShapes();
                if (shapes.length > 0) {
                    const marker = shapes[shapes.length - 1];
                    if (marker && typeof marker.setIcon === 'function') {
                        const icon = L.divIcon({
                            html: '<div style="font-size: 24px; text-align: center; color: #ff0000; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">📍</div>',
                            className: 'custom-pin-icon',
                            iconSize: [24, 24],
                            iconAnchor: [12, 24]
                        });
                        marker.setIcon(icon);
                        marker.bindPopup(`<b>${data.name}</b><br>Region: ${spawn.region}`);
                        currentMarkers.push(marker);
                    }
                }
            });
            
            // Fit bounds to show all markers
            if (currentMarkers.length > 0) {
                setTimeout(() => {
                    const group = new L.featureGroup(currentMarkers);
                    const map = mapInstance.getMap();
                    if (map) {
                        map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 5 });
                    }
                }, 100);
            }
        });
        
        // Listen for fly to location
        Livewire.on('flyToLocation', (data) => {
            if (mapInstance) {
                mapInstance.FlyView(data.x, data.y, data.z, data.region);
            }
        });
        
        function clearMarkers() {
            if (mapInstance) {
                mapInstance.ClearDrawingShapes();
            }
            currentMarkers.forEach(marker => {
                if (marker && typeof marker.remove === 'function') {
                    marker.remove();
                }
            });
            currentMarkers = [];
        }
    });
</script>
@endpush
