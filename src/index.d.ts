import * as L from 'leaflet';

/**
 * SRO Coordinate object
 */
export interface SROCoord {
  x: number;
  y: number;
  z: number;
  region: number;
  posX?: number;
  posY?: number;
}

/**
 * xSROMap initialization options
 */
export interface XSROMapOptions {
  /** Base URL for map tiles (default: 'assets/img/silkroad/minimap/') */
  imgHost?: string;
  /** Initial X coordinate (default: 114) */
  initialX?: number;
  /** Initial Y coordinate (default: 47.25) */
  initialY?: number;
  /** Initial Z coordinate (default: null) */
  initialZ?: number | null;
  /** Initial region (default: null) */
  initialRegion?: number | null;
}

/**
 * xSROMap instance interface
 */
export interface XSROMapInstance {
  /**
   * Get the underlying Leaflet map instance
   */
  getMap(): L.Map;

  /**
   * Set zoom limits
   * @param minZoom - Minimum zoom level (0-9)
   * @param maxZoom - Maximum zoom level (0-9)
   */
  SetZoomLimit(minZoom: number, maxZoom: number): void;

  /**
   * Set the view instantly
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param z - Z coordinate (optional)
   * @param region - Region ID (optional)
   */
  SetView(x: number, y: number, z?: number | null, region?: number | null): void;

  /**
   * Fly to a location with animation
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param z - Z coordinate (optional)
   * @param region - Region ID (optional)
   */
  FlyView(x: number, y: number, z?: number | null, region?: number | null): void;

  /**
   * Add an NPC marker
   * @param id - Unique identifier
   * @param html - Popup HTML content
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param z - Z coordinate (optional)
   * @param region - Region ID (optional)
   */
  AddNPC(id: string | number, html: string, x: number, y: number, z?: number | null, region?: number | null): void;

  /**
   * Navigate to an NPC
   * @param id - NPC identifier
   * @returns Whether the NPC was found
   */
  GoToNPC(id: string | number): boolean;

  /**
   * Add a teleport marker
   * @param html - Popup HTML content
   * @param type - Teleport type (0: gate, 1: fortress, 2: ress, 3: glory, 4: fortress small, 5: ground, 6: tahomet)
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param z - Z coordinate (optional)
   * @param region - Region ID (optional)
   */
  AddTeleport(html: string, type: number, x: number, y: number, z?: number | null, region?: number | null): void;

  /**
   * Add a player marker
   * @param id - Unique identifier
   * @param html - Popup HTML content
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param z - Z coordinate (optional)
   * @param region - Region ID (optional)
   */
  AddPlayer(id: string | number, html: string, x: number, y: number, z?: number | null, region?: number | null): void;

  /**
   * Move a player marker
   * @param id - Player identifier
   * @param x - New X coordinate
   * @param y - New Y coordinate
   * @param z - New Z coordinate (optional)
   * @param region - New region ID (optional)
   */
  MovePlayer(id: string | number, x: number, y: number, z?: number | null, region?: number | null): void;

  /**
   * Navigate to a player
   * @param id - Player identifier
   * @returns Whether the player was found
   */
  GoToPlayer(id: string | number): boolean;

  /**
   * Remove a player marker
   * @param id - Player identifier
   */
  RemovePlayer(id: string | number): void;

  /**
   * Add a location marker
   * @param id - Unique identifier
   * @param html - Popup HTML content
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param z - Z coordinate (optional)
   * @param region - Region ID (optional)
   */
  AddLocation(id: string | number, html: string, x: number, y: number, z?: number | null, region?: number | null): void;

  /**
   * Remove a location marker
   * @param id - Location identifier
   */
  RemoveLocation(id: string | number): void;

  /**
   * Copy a shareable link to the clipboard
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param z - Z coordinate (optional)
   * @param region - Region ID (optional)
   */
  LinkToClipboard(x: number, y: number, z?: number | null, region?: number | null): void;

  /**
   * Show the drawing toolbar (requires Leaflet.pm)
   */
  ShowDrawingToolbar(
    position: string,
    drawMarker: boolean,
    drawCircleMarker: boolean,
    drawPolyline: boolean,
    drawRectangle: boolean,
    drawPolygon: boolean,
    drawCircle: boolean,
    canEdit: boolean,
    canDrag: boolean,
    canCut: boolean,
    canDelete: boolean
  ): void;

  /**
   * Hide the drawing toolbar
   */
  HideDrawingToolbar(): void;

  /**
   * Add a drawing shape
   * @param type - Shape type: 'Marker', 'Polyline', 'Polygon', 'Circle'
   * @param param1 - Coordinates array
   * @param param2 - Description (for Marker/Polyline/Polygon) or radius (for Circle)
   */
  AddDrawingShape(type: 'Marker' | 'Polyline' | 'Polygon' | 'Circle', param1: number[], param2?: string | number | null): void;

  /**
   * Get all drawing shapes from the current layer
   */
  GetDrawingShapes(): L.Layer[];

  /**
   * Convert Leaflet LatLng to SRO coordinates
   * @param latlng - Leaflet LatLng object
   */
  ConvertLatLngToCoords(latlng: L.LatLng): SROCoord;

  /**
   * Clear all drawing shapes
   */
  ClearDrawingShapes(): void;
}

/**
 * Coordinate conversion utilities
 */
export interface CoordinateUtilsType {
  /**
   * Convert game coordinates to SRO internal coordinates
   * @param posX - Game world X position
   * @param posY - Game world Y position
   */
  gameToSRO(posX: number, posY: number): SROCoord;

  /**
   * Convert SRO coordinates to game world coordinates
   * @param x - SRO X coordinate
   * @param y - SRO Y coordinate
   * @param region - Region ID
   */
  sroToGame(x: number, y: number, region: number): { posX: number; posY: number };
}

/**
 * Creates a new xSROMap instance
 * @param elementId - The DOM element ID to render the map
 * @param options - Configuration options
 */
export function createXSROMap(elementId: string, options?: XSROMapOptions): XSROMapInstance;

/**
 * Coordinate conversion utilities
 */
export const CoordinateUtils: CoordinateUtilsType;

export default createXSROMap;
