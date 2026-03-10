/**
 * xSROMap - Laravel Integration
 * 
 * This file provides xSROMap integration for Laravel with Vite.
 * Supports both standard usage and Livewire components.
 * 
 * Installation:
 * 1. Copy this file to: resources/js/sromap.js
 * 2. Import in app.js: import './sromap';
 * 3. Run: npm install xsromap leaflet
 * 
 * @author Ahmed-Elrayes
 * @see https://github.com/Ahmed-Elrayes/xSROMap
 */

import { createXSROMap, CoordinateUtils } from 'xsromap';
import 'leaflet/dist/leaflet.css';

/**
 * xSROMap Global Instance
 * Provides backwards-compatible API matching the original xSROMap.js
 */
const xSROMap = {
    // Configuration
    ImageHost: '/storage/minimap/',
    
    // Internal state
    _instance: null,
    _elementId: null,
    
    /**
     * Initialize the map on an element
     * @param {string} elementId - DOM element ID
     * @param {number} [x=114] - Initial X coordinate
     * @param {number} [y=47.25] - Initial Y coordinate  
     * @param {number} [z=null] - Initial Z coordinate
     * @param {number} [region=null] - Initial region
     */
    init(elementId, x = 114, y = 47.25, z = null, region = null) {
        // Handle Livewire/Turbolinks re-initialization
        const container = document.getElementById(elementId);
        if (container && container._leaflet_id) {
            // Clear existing map instance
            const wrapper = container.parentElement;
            if (wrapper) {
                wrapper.innerHTML = `<div id="${elementId}" style="${container.getAttribute('style') || 'height: 100%; width: 100%;'}"></div>`;
            }
        }
        
        this._elementId = elementId;
        this._instance = createXSROMap(elementId, {
            imgHost: this.ImageHost.endsWith('/') ? this.ImageHost : this.ImageHost + '/',
            initialX: x,
            initialY: y,
            initialZ: z,
            initialRegion: region
        });
        
        // Store on element for direct access
        const el = document.getElementById(elementId);
        if (el) {
            el._sromap = this._instance;
        }
        
        // Dispatch ready event
        window.dispatchEvent(new CustomEvent('sromap:ready', {
            detail: { 
                map: this._instance, 
                element: el,
                xSROMap: this
            }
        }));
        
        return this._instance;
    },
    
    /**
     * Get the underlying Leaflet map instance
     * @returns {L.Map|null}
     */
    getMap() {
        return this._instance?.getMap() || null;
    },
    
    // Proxy all methods to the instance
    SetZoomLimit(minZoom, maxZoom) {
        this._instance?.SetZoomLimit(minZoom, maxZoom);
    },
    
    SetView(x, y, z = null, region = null) {
        this._instance?.SetView(x, y, z, region);
    },
    
    FlyView(x, y, z = null, region = null) {
        this._instance?.FlyView(x, y, z, region);
    },
    
    AddNPC(id, html, x, y, z = null, region = null) {
        this._instance?.AddNPC(id, html, x, y, z, region);
    },
    
    GoToNPC(id) {
        return this._instance?.GoToNPC(id) || false;
    },
    
    AddTeleport(html, type, x, y, z = null, region = null) {
        this._instance?.AddTeleport(html, type, x, y, z, region);
    },
    
    AddPlayer(id, html, x, y, z = null, region = null) {
        this._instance?.AddPlayer(id, html, x, y, z, region);
    },
    
    MovePlayer(id, x, y, z = null, region = null) {
        this._instance?.MovePlayer(id, x, y, z, region);
    },
    
    GoToPlayer(id) {
        return this._instance?.GoToPlayer(id) || false;
    },
    
    RemovePlayer(id) {
        this._instance?.RemovePlayer(id);
    },
    
    AddLocation(id, html, x, y, z = null, region = null) {
        this._instance?.AddLocation(id, html, x, y, z, region);
    },
    
    RemoveLocation(id) {
        this._instance?.RemoveLocation(id);
    },
    
    LinkToClipboard(x, y, z = null, region = null) {
        this._instance?.LinkToClipboard(x, y, z, region);
    },
    
    ShowDrawingToolbar(position, drawMarker, drawCircleMarker, drawPolyline, drawRectangle, drawPolygon, drawCircle, canEdit, canDrag, canCut, canDelete) {
        this._instance?.ShowDrawingToolbar(position, drawMarker, drawCircleMarker, drawPolyline, drawRectangle, drawPolygon, drawCircle, canEdit, canDrag, canCut, canDelete);
    },
    
    HideDrawingToolbar() {
        this._instance?.HideDrawingToolbar();
    },
    
    AddDrawingShape(type, param1, param2 = null) {
        this._instance?.AddDrawingShape(type, param1, param2);
    },
    
    GetDrawingShapes() {
        return this._instance?.GetDrawingShapes() || [];
    },
    
    ConvertLatLngToCoords(latlng) {
        return this._instance?.ConvertLatLngToCoords(latlng);
    },
    
    ClearDrawingShapes() {
        this._instance?.ClearDrawingShapes();
    },
    
    /**
     * Destroy the current map instance
     * Useful for Livewire/SPA cleanup
     */
    destroy() {
        if (this._instance) {
            const map = this._instance.getMap();
            if (map) {
                map.remove();
            }
            this._instance = null;
        }
        if (this._elementId) {
            const el = document.getElementById(this._elementId);
            if (el) {
                delete el._sromap;
                delete el._leaflet_id;
            }
        }
    }
};

/**
 * Initialize a new independent map instance
 * Use this when you need multiple maps or want a fresh instance
 * 
 * @param {string|HTMLElement} element - Element ID or HTMLElement
 * @param {Object} options - Configuration options
 * @returns {Object} Map instance
 */
window.initSROMap = (element, options = {}) => {
    const el = typeof element === 'string' ? document.getElementById(element) : element;
    
    if (!el) {
        console.error('xSROMap: Element not found', element);
        return null;
    }
    
    // Handle re-initialization (Livewire/Turbolinks)
    if (el._leaflet_id) {
        const wrapper = el.parentElement;
        const style = el.getAttribute('style') || 'height: 100%; width: 100%;';
        const id = el.id;
        if (wrapper) {
            wrapper.innerHTML = `<div id="${id}" style="${style}"></div>`;
        }
        // Re-fetch the element after DOM replacement
        const newEl = document.getElementById(id);
        if (newEl) {
            return window.initSROMap(newEl, options);
        }
    }
    
    // Get options from data attributes with overrides
    const config = {
        imgHost: options.imgHost || el.dataset.imghost || '/storage/minimap/',
        initialX: parseFloat(options.initialX ?? el.dataset.x) || 114,
        initialY: parseFloat(options.initialY ?? el.dataset.y) || 47.25,
        initialZ: options.initialZ ?? el.dataset.z ?? null,
        initialRegion: options.initialRegion ?? el.dataset.region ?? null,
    };
    
    // Ensure imgHost ends with /
    if (!config.imgHost.endsWith('/')) {
        config.imgHost += '/';
    }
    
    const instance = createXSROMap(el.id, config);
    
    // Store instance on element
    el._sromap = instance;
    
    // Dispatch ready event
    window.dispatchEvent(new CustomEvent('sromap:ready', {
        detail: { map: instance, element: el }
    }));
    
    return instance;
};

// Export globals
window.xSROMap = xSROMap;
window.CoordinateUtils = CoordinateUtils;
window.createXSROMap = createXSROMap;

// Auto-initialize elements with data-sromap attribute (non-Livewire)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-sromap]:not([wire\\:ignore])').forEach(el => {
        if (!el._sromap && !el._leaflet_id) {
            window.initSROMap(el);
        }
    });
});

// Livewire v3 support
if (typeof Livewire !== 'undefined') {
    // Initialize maps after Livewire updates
    document.addEventListener('livewire:navigated', () => {
        document.querySelectorAll('[data-sromap][wire\\:ignore]').forEach(el => {
            if (!el._sromap && !el._leaflet_id) {
                window.initSROMap(el);
            }
        });
    });
    
    // Cleanup on component removal
    document.addEventListener('livewire:navigating', () => {
        document.querySelectorAll('[data-sromap]').forEach(el => {
            if (el._sromap) {
                const map = el._sromap.getMap();
                if (map) map.remove();
                delete el._sromap;
            }
        });
    });
}

// Livewire v2 support (if using Alpine)
document.addEventListener('livewire:load', () => {
    document.querySelectorAll('[data-sromap][wire\\:ignore]').forEach(el => {
        if (!el._sromap && !el._leaflet_id) {
            window.initSROMap(el);
        }
    });
});

export { xSROMap, CoordinateUtils, createXSROMap };
