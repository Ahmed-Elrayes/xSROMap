{{--
    xSROMap - Unique Map Example
    
    This is a real-world example showing how to use xSROMap with Laravel.
    Uses the global xSROMap object for backwards compatibility.
    
    Works with both standard page loads and Livewire/Turbolinks.
--}}

<x-frontend.app-layout :title="__('Unique Map')" alias="UniqueMap">
    <div class="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-12">
                    <h1>{{ __('Unique Map') }}</h1>
                </div>
                <div class="col-md-12">
                    <div class="unique-map-container">
                        <div
                            style="position: absolute; top: 20px; left: 20px; z-index: 1000; background: linear-gradient(135deg, rgba(31,31,31,0.9), rgba(10,10,10,0.9)); padding: 15px 25px; border-radius: 8px; border: 1px solid #d4af37; box-shadow: 0 4px 15px rgba(0,0,0,0.8); width: 300px; max-width: 90vw; backdrop-filter: blur(5px);">
                            <h5 class="text-white font-weight-bold mb-3" style="font-size: 1.1rem;"><i
                                    class="fas fa-search pr-2" style="color: #ff4e00;"></i> Search Unique</h5>

                            <div class="form-group mb-0">
                                <select id="uniqueSelect" class="form-control custom-dark-select">
                                    <option value="" disabled selected>Select a Unique...</option>
                                </select>
                            </div>
                        </div>

                        <!-- The Map -->
                        <div id="map-wrapper" style="width: 100%; height: 100%;">
                            <div id="map" style="height: 100%; width: 100%; display: block; background: #000;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    @push('theme::css')
        {{-- Leaflet CSS is included via sromap.js import --}}
        <link rel="stylesheet" type="text/css" href="{{ asset('css/components.css') }}">
        <style>
            #map {
                height: 450px;
                display: block;
                bottom: 0;
                top: 0;
                left: 0;
                right: 0;
            }
        </style>
    @endpush
    
    @push('theme::javascript')
        <script type="module">
            // Real names mapping for uniques
            const mobNamesMap = {
                'MOB_CH_TIGERWOMAN': 'Tiger Girl',
                'MOB_CH_TIGERWOMAN_STR': 'Tiger Girl [STR]',
                'MOB_OA_URUCHI': 'Uruchi',
                'MOB_OA_URUCHI_STR': 'Uruchi [STR]',
                'MOB_KK_ISYUTARU': 'Isyutaru',
                'MOB_KK_ISYUTARU_STR': 'Isyutaru [STR]',
                'MOB_TK_BONELORD': 'Lord Yarkan',
                'MOB_TK_BONELORD_STR': 'Lord Yarkan [STR]',
                'MOB_RM_TAHOMET': 'Demon Shaitan',
                'MOB_RM_TAHOMET_STR': 'Demon Shaitan [STR]',
                'MOB_AM_IVY': 'Captain Ivy',
                'MOB_AM_IVY_STR': 'Captain Ivy [STR]',
                'MOB_EU_KERBEROS': 'Cerberus',
                'MOB_EU_KERBEROS_STR': 'Cerberus [STR]',
                'MOB_RM_ROC': 'Roc',
                'MOB_TQ_WHITESNAKE': 'Medusa',
                'MOB_ARABIA_GEENIE': 'Geenie',
                'MOB_ARABIA_GIANT_DEMON': 'Giant Demon',
                'MOB_ARABIA_HARRISON': 'Harrison',
                'MOB_ARABIA_KARKADANN': 'Karkadann',
                'MOB_ARABIA_KHULOOD': 'Khulood',
                'MOB_ARABIA_KIDEMONAS': 'Kidemonas',
                'MOB_ARABIA_LAUNATUNE': 'Launatune',
                'MOB_ARABIA_MAD_GENERAL': 'Mad General',
                'MOB_ARABIA_MUSTAFA': 'Mustafa',
                'MOB_ARABIA_THIEF_BOSS': 'Thief Boss',
                'MOB_ARABIA_VENEFICA': 'Venefica',
                'MOB_ARABIA_VENEFICA_DEMON': 'Venefica Demon',
                'MOB_EU_PT_TIGERWOMAN': 'Tiger Girl (Party)',
                'MOB_EU_PT_URUCHI': 'Uruchi (Party)',
                'MOB_EU_PT_ISYUTARU': 'Isyutaru (Party)',
                'MOB_EU_PT_BONELORD': 'Lord Yarkan (Party)',
                'MOB_EU_PT_TAHOMET': 'Demon Shaitan (Party)',
                'MOB_EU_PT_IVY': 'Captain Ivy (Party)',
                'MOB_EU_PT_KERBEROS': 'Cerberus (Party)',
                'MOB_SD_ISI': 'Isis',
                'MOB_SD_ANUBIS': 'Anubis',
                'MOB_SD_HAROERIS': 'Haroeris',
                'MOB_SD_SETH': 'Seth',
                'MOB_SD_NEITH': 'Neith',
                'MOB_SD_SELKET': 'Selket'
            };

            function formatMobName(code) {
                if (mobNamesMap[code]) return mobNamesMap[code];
                const parts = code.split('_');
                if (parts.length > 2 && parts[0] === 'MOB') {
                    parts.shift();
                    parts.shift();
                }
                return parts.join(' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
            }

            // Store markers for cleanup
            let uniqueMarkers = [];
            let mobsDataGlobal = [];

            $(document).ready(function () {
                // Prevent default link behavior on map clicks
                $('#map').click(function (e) {
                    if ($(e.target).attr('href') === "#") e.preventDefault();
                });

                // Set the image host BEFORE initializing
                xSROMap.ImageHost = '{{ asset("storage/minimap") }}';

                // Initialize the map (handles re-initialization automatically for Livewire/Turbolinks)
                xSROMap.init('map', 114, 47.25);
                xSROMap.SetZoomLimit(2, 5);

                // Set initial view after a short delay
                setTimeout(() => {
                    xSROMap.SetView(2592.75, -5.25);
                }, 500);

                // Fetch the Unique Spawns Data
                fetch("{{ route('unique-map.uniques') }}")
                    .then(response => response.json())
                    .then(data => initUniqueUI(data.mobs))
                    .catch(err => console.error("Error loading mobs:", err));
            });

            function initUniqueUI(mobsData) {
                mobsDataGlobal = mobsData;
                const selectElement = $('#uniqueSelect');

                mobsData.forEach((mob) => {
                    if (!mob.spawns || mob.spawns.length === 0) return;

                    const displayName = formatMobName(mob.mob_code);
                    const optionText = `${displayName} (${mob.spawns.length} Spawns)`;
                    selectElement.append(new Option(optionText, mob.mob_code));
                });

                selectElement.on('change', function () {
                    const mobCode = $(this).val();
                    if (mobCode) drawSpawns(mobCode);
                });
            }

            function drawSpawns(mobCode) {
                const mob = mobsDataGlobal.find(m => m.mob_code === mobCode);
                if (!mob || !mob.spawns) return;

                // Clear previous markers
                xSROMap.ClearDrawingShapes();
                uniqueMarkers.forEach(marker => {
                    if (marker && typeof marker.remove === "function") marker.remove();
                });
                uniqueMarkers = [];

                const displayName = formatMobName(mob.mob_code);

                // Draw spawn points
                mob.spawns.forEach((spawn) => {
                    const coord = [spawn.posx, spawn.posy, 0, spawn.region];
                    xSROMap.AddDrawingShape('Marker', coord);

                    // Customize the marker with emoji icon
                    const shapes = xSROMap.GetDrawingShapes();
                    if (shapes && shapes.length > 0) {
                        const pin = shapes[shapes.length - 1];
                        if (pin && typeof pin.setIcon === "function") {
                            const iconEmoji = L.divIcon({
                                html: '<div style="font-size: 24px; line-height: 24px; text-align: center; color: #ff0000; text-shadow: 0px 2px 4px rgba(0,0,0,0.8);">📍</div>',
                                className: 'custom-pin-icon',
                                iconSize: [24, 24],
                                iconAnchor: [12, 24]
                            });
                            pin.setIcon(iconEmoji);
                            pin.bindPopup(`<b>${displayName}</b><br>Region: ${spawn.region}`);
                            uniqueMarkers.push(pin);
                        }
                    }
                });

                // Fit bounds to show all markers
                setTimeout(() => {
                    if (uniqueMarkers.length > 0) {
                        const map = xSROMap.getMap();
                        if (map) {
                            const group = new L.featureGroup(uniqueMarkers);
                            map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 5 });
                        }
                    }
                }, 100);
            }
        </script>
    @endpush
</x-frontend.app-layout>