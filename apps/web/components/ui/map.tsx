"use client"

import * as React from "react"
import maplibregl from "maplibre-gl"
import { createPortal } from "react-dom"

import "maplibre-gl/dist/maplibre-gl.css"

import {
  LocateIcon,
  Maximize2Icon,
  MinusIcon,
  NavigationIcon,
  PlusIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

// ============================================================================
// Custom Styles to Override MapLibre Defaults
// ============================================================================

if (typeof document !== "undefined") {
  const style = document.createElement("style")
  style.textContent = `
    /* Remove default MapLibre popup styles */
    .maplibregl-popup-content {
      background: transparent !important;
      padding: 0 !important;
      box-shadow: none !important;
      border-radius: 0 !important;
    }

    .maplibregl-popup-tip {
      display: none !important;
    }

    .maplibregl-popup-close-button {
      color: hsl(var(--foreground)) !important;
      font-size: 20px !important;
      padding: 0 4px !important;
      right: 4px !important;
      top: 4px !important;
    }
  `
  if (!document.head.querySelector("[data-map-styles]")) {
    style.setAttribute("data-map-styles", "")
    document.head.appendChild(style)
  }
}

// ============================================================================
// Types & Interfaces
// ============================================================================

interface MapContextValue {
  map: maplibregl.Map | null
  isLoaded: boolean
}

interface MapProps extends Omit<maplibregl.MapOptions, "container" | "style"> {
  children?: React.ReactNode
  className?: string
  center?: [number, number]
  zoom?: number
  minZoom?: number
  maxZoom?: number
  styles?: {
    light?: string | maplibregl.StyleSpecification
    dark?: string | maplibregl.StyleSpecification
  }
}

interface MapMarkerProps {
  longitude: number
  latitude: number
  children?: React.ReactNode
  draggable?: boolean
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onDragStart?: (lngLat: maplibregl.LngLat) => void
  onDrag?: (lngLat: maplibregl.LngLat) => void
  onDragEnd?: (lngLat: maplibregl.LngLat) => void
}

interface MarkerContentProps {
  children?: React.ReactNode
  className?: string
}

interface MarkerPopupProps {
  children?: React.ReactNode
  className?: string
  closeButton?: boolean
  closeOnClick?: boolean
}

interface MarkerTooltipProps {
  children?: React.ReactNode
  className?: string
}

interface MarkerLabelProps {
  children?: React.ReactNode
  className?: string
  position?: "top" | "bottom" | "left" | "right"
}

interface MapControlsProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  showZoom?: boolean
  showCompass?: boolean
  showLocate?: boolean
  showFullscreen?: boolean
  onLocate?: (coords: { lng: number; lat: number }) => void
  className?: string
}

interface MapPopupProps {
  longitude: number
  latitude: number
  children?: React.ReactNode
  className?: string
  closeButton?: boolean
  onClose?: () => void
}

interface MapRouteProps {
  id: string
  coordinates: [number, number][]
  color?: string
  width?: number
  opacity?: number
  dashArray?: number[]
  interactive?: boolean
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

interface MapClusterLayerProps<T = unknown> {
  data: GeoJSON.FeatureCollection<GeoJSON.Point, T> | string
  clusterRadius?: number
  clusterMaxZoom?: number
  clusterColors?: [string, string, string]
  clusterThresholds?: [number, number]
  pointColor?: string
  onPointClick?: (
    feature: GeoJSON.Feature<GeoJSON.Point, T>,
    lngLat: maplibregl.LngLat
  ) => void
  onClusterClick?: (clusterId: number, lngLat: maplibregl.LngLat) => void
}

// ============================================================================
// Context
// ============================================================================

const MapContext = React.createContext<MapContextValue>({
  map: null,
  isLoaded: false,
})

// ============================================================================
// useMap Hook
// ============================================================================

function useMap() {
  const context = React.useContext(MapContext)
  if (!context) {
    throw new Error("useMap must be used within a Map component")
  }
  return context
}

// ============================================================================
// Map Component (Root)
// ============================================================================

// OpenFreeMap - Free, open-source map tiles with no API key required
// https://openfreemap.org - MIT License: https://github.com/hyperknot/openfreemap/blob/main/LICENSE.md
const DEFAULT_LIGHT_STYLE = "https://tiles.openfreemap.org/styles/positron"
const DEFAULT_DARK_STYLE = "https://tiles.openfreemap.org/styles/dark"

function Map({
  children,
  className,
  center = [-122.4194, 37.7749], // San Francisco
  zoom = 12,
  minZoom = 0,
  maxZoom = 22,
  styles,
  ...props
}: MapProps) {
  const mapContainer = React.useRef<HTMLDivElement>(null)
  const mapInstance = React.useRef<maplibregl.Map | null>(null)
  const [isLoaded, setIsLoaded] = React.useState(false)

  // Detect theme
  const getTheme = React.useCallback(() => {
    if (typeof window === "undefined") return "light"
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
  }, [])

  // Initialize map
  React.useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return

    const theme = getTheme()
    const styleUrl =
      theme === "dark"
        ? styles?.dark || DEFAULT_DARK_STYLE
        : styles?.light || DEFAULT_LIGHT_STYLE

    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center,
      zoom,
      minZoom,
      maxZoom,
      ...props,
    })

    mapInstance.current.on("load", () => {
      setIsLoaded(true)
    })

    return () => {
      if (mapInstance.current) {
        try {
          mapInstance.current.remove()
        } catch (error) {
          // Suppress abort errors during cleanup
          if (error instanceof Error && !error.message.includes("aborted")) {
            console.error("Error removing map:", error)
          }
        } finally {
          mapInstance.current = null
          setIsLoaded(false)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle theme changes
  React.useEffect(() => {
    if (!mapInstance.current || !isLoaded) return

    const observer = new MutationObserver(() => {
      const theme = getTheme()
      const styleUrl =
        theme === "dark"
          ? styles?.dark || DEFAULT_DARK_STYLE
          : styles?.light || DEFAULT_LIGHT_STYLE

      mapInstance.current?.setStyle(styleUrl)
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [isLoaded, getTheme, styles])

  return (
    <MapContext.Provider value={{ map: mapInstance.current, isLoaded }}>
      <div
        ref={mapContainer}
        data-slot="map"
        className={cn("relative h-full w-full", className)}
      >
        {isLoaded && children}
      </div>
    </MapContext.Provider>
  )
}

// ============================================================================
// MapMarker Components
// ============================================================================

interface MarkerContextValue {
  marker: maplibregl.Marker | null
  markerElement: HTMLDivElement | null
}

const MarkerContext = React.createContext<MarkerContextValue | null>(null)

function MapMarker({
  longitude,
  latitude,
  children,
  draggable = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onDragStart,
  onDrag,
  onDragEnd,
}: MapMarkerProps) {
  const { map, isLoaded } = useMap()
  const markerRef = React.useRef<maplibregl.Marker | null>(null)
  const markerElementRef = React.useRef<HTMLDivElement | null>(null)
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0)

  React.useEffect(() => {
    if (!map || !isLoaded) return

    // Create marker element container
    const el = document.createElement("div")
    el.style.cursor = "pointer"
    markerElementRef.current = el

    // Create marker
    markerRef.current = new maplibregl.Marker({
      element: el,
      draggable,
    })
      .setLngLat([longitude, latitude])
      .addTo(map)

    // Event handlers
    if (onClick) {
      el.addEventListener("click", onClick)
    }
    if (onMouseEnter) {
      el.addEventListener("mouseenter", onMouseEnter)
    }
    if (onMouseLeave) {
      el.addEventListener("mouseleave", onMouseLeave)
    }

    // Drag handlers
    if (onDragStart) {
      markerRef.current.on("dragstart", () => {
        onDragStart(markerRef.current!.getLngLat())
      })
    }
    if (onDrag) {
      markerRef.current.on("drag", () => {
        onDrag(markerRef.current!.getLngLat())
      })
    }
    if (onDragEnd) {
      markerRef.current.on("dragend", () => {
        onDragEnd(markerRef.current!.getLngLat())
      })
    }

    forceUpdate()

    return () => {
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
      markerElementRef.current = null
    }
  }, [
    map,
    isLoaded,
    longitude,
    latitude,
    draggable,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onDragStart,
    onDrag,
    onDragEnd,
  ])

  // Update position when coordinates change
  React.useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat([longitude, latitude])
    }
  }, [longitude, latitude])

  if (!isLoaded || !markerElementRef.current) return null

  return (
    <MarkerContext.Provider
      value={{
        marker: markerRef.current,
        markerElement: markerElementRef.current,
      }}
    >
      {children}
    </MarkerContext.Provider>
  )
}

function MarkerContent({ children, className }: MarkerContentProps) {
  const context = React.useContext(MarkerContext)

  if (!context?.markerElement) return null

  return createPortal(
    <div data-slot="marker-content" className={cn(className)}>
      {children || (
        <div className="bg-primary size-4 rounded-full border-2 border-white shadow-lg" />
      )}
    </div>,
    context.markerElement
  )
}

function MarkerPopup({
  children,
  className,
  closeButton = false,
  closeOnClick = true,
}: MarkerPopupProps) {
  const context = React.useContext(MarkerContext)
  const { map } = useMap()
  const popupRef = React.useRef<maplibregl.Popup | null>(null)
  const popupContainerRef = React.useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = React.useState(false)

  if (!context) {
    throw new Error("MarkerPopup must be used within a MapMarker")
  }

  const { marker, markerElement } = context

  React.useEffect(() => {
    if (!map || !marker || !markerElement) return

    // Create popup container (plain, no styling)
    const popupEl = document.createElement("div")
    popupContainerRef.current = popupEl

    popupRef.current = new maplibregl.Popup({
      closeButton,
      closeOnClick,
      offset: 25,
    })
      .setMaxWidth("none")
      .setDOMContent(popupEl)

    // Toggle popup on marker click
    const handleClick = (e: MouseEvent) => {
      e.stopPropagation()
      if (!popupRef.current || !marker) return

      if (isOpen) {
        popupRef.current.remove()
        setIsOpen(false)
      } else {
        popupRef.current.setLngLat(marker.getLngLat()).addTo(map)
        setIsOpen(true)
      }
    }

    markerElement.addEventListener("click", handleClick)

    // Handle close
    popupRef.current.on("close", () => {
      setIsOpen(false)
    })

    return () => {
      markerElement.removeEventListener("click", handleClick)
      if (popupRef.current) {
        popupRef.current.remove()
        popupRef.current = null
      }
      popupContainerRef.current = null
    }
  }, [map, marker, markerElement, closeButton, closeOnClick])

  if (!popupContainerRef.current) return null

  return createPortal(
    <div
      className={cn(
        "animate-in fade-in-0 zoom-in-95 bg-popover text-popover-foreground border-border rounded-lg border p-3 text-sm shadow-lg",
        className
      )}
    >
      {children}
    </div>,
    popupContainerRef.current
  )
}

function MarkerTooltip({ children, className }: MarkerTooltipProps) {
  const context = React.useContext(MarkerContext)
  const { map } = useMap()
  const tooltipRef = React.useRef<maplibregl.Popup | null>(null)
  const tooltipContainerRef = React.useRef<HTMLDivElement | null>(null)

  if (!context) {
    throw new Error("MarkerTooltip must be used within a MapMarker")
  }

  const { marker, markerElement } = context

  React.useEffect(() => {
    if (!map || !marker || !markerElement) return

    // Create tooltip container (plain, no styling)
    const tooltipEl = document.createElement("div")
    tooltipContainerRef.current = tooltipEl

    tooltipRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 15,
    })
      .setMaxWidth("none")
      .setDOMContent(tooltipEl)

    const handleMouseEnter = () => {
      if (tooltipRef.current && marker) {
        tooltipRef.current.setLngLat(marker.getLngLat()).addTo(map)
      }
    }

    const handleMouseLeave = () => {
      if (tooltipRef.current) {
        tooltipRef.current.remove()
      }
    }

    markerElement.addEventListener("mouseenter", handleMouseEnter)
    markerElement.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      markerElement.removeEventListener("mouseenter", handleMouseEnter)
      markerElement.removeEventListener("mouseleave", handleMouseLeave)
      if (tooltipRef.current) {
        tooltipRef.current.remove()
        tooltipRef.current = null
      }
      tooltipContainerRef.current = null
    }
  }, [map, marker, markerElement])

  if (!tooltipContainerRef.current) return null

  return createPortal(
    <div
      className={cn(
        "animate-in fade-in-0 zoom-in-95 bg-foreground text-background rounded-md px-2 py-1 text-xs shadow-md",
        className
      )}
    >
      {children}
    </div>,
    tooltipContainerRef.current
  )
}

function MarkerLabel({
  children,
  className,
  position = "top",
}: MarkerLabelProps) {
  const context = React.useContext(MarkerContext)

  if (!context?.markerElement) return null

  const positionClasses = {
    top: "-top-8 left-1/2 -translate-x-1/2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }

  return createPortal(
    <div
      data-slot="marker-label"
      className={cn(
        "bg-background text-foreground border-border pointer-events-none absolute rounded-md border px-2 py-1 text-xs font-medium whitespace-nowrap shadow-sm",
        positionClasses[position],
        className
      )}
    >
      {children}
    </div>,
    context.markerElement
  )
}

// ============================================================================
// MapControls Component
// ============================================================================

function MapControls({
  position = "bottom-right",
  showZoom = true,
  showCompass = false,
  showLocate = false,
  showFullscreen = false,
  onLocate,
  className,
}: MapControlsProps) {
  const { map } = useMap()

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  }

  const handleZoomIn = () => {
    if (map) map.zoomIn()
  }

  const handleZoomOut = () => {
    if (map) map.zoomOut()
  }

  const handleResetNorth = () => {
    if (map) map.resetNorth()
  }

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lng: position.coords.longitude,
            lat: position.coords.latitude,
          }

          if (map) {
            map.flyTo({ center: [coords.lng, coords.lat], zoom: 14 })
          }

          if (onLocate) {
            onLocate(coords)
          }
        },
        (error) => {
          console.error("Error getting location:", error)
        }
      )
    }
  }

  const handleFullscreen = () => {
    const container = map?.getContainer()
    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div
      data-slot="map-controls"
      className={cn(
        "absolute z-10 flex flex-col gap-2",
        positionClasses[position],
        className
      )}
    >
      {showZoom && (
        <div className="bg-background border-border flex flex-col overflow-hidden rounded-lg border shadow-md">
          <button
            type="button"
            onClick={handleZoomIn}
            className="hover:bg-accent hover:text-accent-foreground flex h-8 w-8 items-center justify-center border-b transition-colors"
            aria-label="Zoom in"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="hover:bg-accent hover:text-accent-foreground flex h-8 w-8 items-center justify-center transition-colors"
            aria-label="Zoom out"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {showCompass && (
        <button
          type="button"
          onClick={handleResetNorth}
          className="bg-background border-border hover:bg-accent hover:text-accent-foreground flex h-8 w-8 items-center justify-center rounded-lg border shadow-md transition-colors"
          aria-label="Reset north"
        >
          <NavigationIcon className="h-4 w-4" />
        </button>
      )}

      {showLocate && (
        <button
          type="button"
          onClick={handleLocate}
          className="bg-background border-border hover:bg-accent hover:text-accent-foreground flex h-8 w-8 items-center justify-center rounded-lg border shadow-md transition-colors"
          aria-label="Locate me"
        >
          <LocateIcon className="h-4 w-4" />
        </button>
      )}

      {showFullscreen && (
        <button
          type="button"
          onClick={handleFullscreen}
          className="bg-background border-border hover:bg-accent hover:text-accent-foreground flex h-8 w-8 items-center justify-center rounded-lg border shadow-md transition-colors"
          aria-label="Toggle fullscreen"
        >
          <Maximize2Icon className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// ============================================================================
// MapPopup Component (Standalone)
// ============================================================================

function MapPopup({
  longitude,
  latitude,
  children,
  className,
  closeButton = true,
  onClose,
}: MapPopupProps) {
  const { map, isLoaded } = useMap()
  const popupRef = React.useRef<maplibregl.Popup | null>(null)
  const popupContainerRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!map || !isLoaded) return

    const popupEl = document.createElement("div")
    popupContainerRef.current = popupEl

    popupRef.current = new maplibregl.Popup({
      closeButton,
      closeOnClick: true,
    })
      .setMaxWidth("none")
      .setLngLat([longitude, latitude])
      .setDOMContent(popupEl)
      .addTo(map)

    if (onClose) {
      popupRef.current.on("close", onClose)
    }

    return () => {
      if (popupRef.current) {
        popupRef.current.remove()
        popupRef.current = null
      }
      popupContainerRef.current = null
    }
  }, [map, isLoaded, longitude, latitude, closeButton, onClose])

  if (!popupContainerRef.current) return null

  return createPortal(
    <div
      className={cn(
        "animate-in fade-in-0 zoom-in-95 bg-popover text-popover-foreground border-border rounded-lg border p-3 text-sm shadow-lg",
        className
      )}
    >
      {children}
    </div>,
    popupContainerRef.current
  )
}

// ============================================================================
// MapRoute Component
// ============================================================================

function MapRoute({
  id,
  coordinates,
  color = "#3b82f6",
  width = 3,
  opacity = 1,
  dashArray,
  interactive = true,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: MapRouteProps) {
  const { map, isLoaded } = useMap()

  React.useEffect(() => {
    if (!map || !isLoaded) return

    const sourceId = `route-${id}`
    const layerId = `route-layer-${id}`

    // Add source
    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates,
          },
        },
      })
    }

    // Add layer
    if (!map.getLayer(layerId)) {
      map.addLayer({
        id: layerId,
        type: "line",
        source: sourceId,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": color,
          "line-width": width,
          "line-opacity": opacity,
          ...(dashArray && { "line-dasharray": dashArray }),
        },
      })
    }

    // Event handlers
    if (interactive) {
      if (onClick) {
        map.on("click", layerId, onClick)
      }
      if (onMouseEnter) {
        map.on("mouseenter", layerId, () => {
          map.getCanvas().style.cursor = "pointer"
          onMouseEnter()
        })
      }
      if (onMouseLeave) {
        map.on("mouseleave", layerId, () => {
          map.getCanvas().style.cursor = ""
          onMouseLeave()
        })
      }
    }

    return () => {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId)
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId)
      }
    }
  }, [
    map,
    isLoaded,
    id,
    coordinates,
    color,
    width,
    opacity,
    dashArray,
    interactive,
    onClick,
    onMouseEnter,
    onMouseLeave,
  ])

  return null
}

// ============================================================================
// MapClusterLayer Component
// ============================================================================

function MapClusterLayer<T = unknown>({
  data,
  clusterRadius = 50,
  clusterMaxZoom = 14,
  clusterColors = ["#51bbd6", "#f1f075", "#f28cb1"],
  clusterThresholds = [100, 750],
  pointColor = "#3b82f6",
  onPointClick,
  onClusterClick,
}: MapClusterLayerProps<T>) {
  const { map, isLoaded } = useMap()

  React.useEffect(() => {
    if (!map || !isLoaded) return

    const sourceId = "clusters"
    const clusterLayerId = "clusters-layer"
    const clusterCountLayerId = "cluster-count"
    const pointLayerId = "unclustered-point"

    // Add source
    map.addSource(sourceId, {
      type: "geojson",
      data:
        typeof data === "string" ? data : (data as GeoJSON.FeatureCollection),
      cluster: true,
      clusterMaxZoom,
      clusterRadius,
    })

    // Add cluster circles
    map.addLayer({
      id: clusterLayerId,
      type: "circle",
      source: sourceId,
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          clusterColors[0],
          clusterThresholds[0],
          clusterColors[1],
          clusterThresholds[1],
          clusterColors[2],
        ],
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
        "circle-opacity": 0.8,
      },
    })

    // Add cluster count
    map.addLayer({
      id: clusterCountLayerId,
      type: "symbol",
      source: sourceId,
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
      paint: {
        "text-color": "#ffffff",
      },
    })

    // Add unclustered points
    map.addLayer({
      id: pointLayerId,
      type: "circle",
      source: sourceId,
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": pointColor,
        "circle-radius": 6,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
      },
    })

    // Click handlers
    if (onClusterClick) {
      map.on("click", clusterLayerId, (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: [clusterLayerId],
        })

        if (features.length > 0) {
          const clusterId = features[0].properties?.cluster_id
          const source = map.getSource(sourceId) as maplibregl.GeoJSONSource

          source
            .getClusterExpansionZoom(clusterId)
            .then((zoom) => {
              const coordinates = (
                features[0].geometry as GeoJSON.Point
              ).coordinates.slice() as [number, number]

              map.easeTo({
                center: coordinates,
                zoom,
              })

              onClusterClick(
                clusterId,
                new maplibregl.LngLat(coordinates[0], coordinates[1])
              )
            })
            .catch((err) => {
              console.error("Error getting cluster expansion zoom:", err)
            })
        }
      })
    }

    if (onPointClick) {
      map.on("click", pointLayerId, (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0] as unknown as GeoJSON.Feature<
            GeoJSON.Point,
            T
          >
          const coordinates = feature.geometry.coordinates.slice() as [
            number,
            number,
          ]

          onPointClick(
            feature,
            new maplibregl.LngLat(coordinates[0], coordinates[1])
          )
        }
      })
    }

    // Cursor
    map.on("mouseenter", clusterLayerId, () => {
      map.getCanvas().style.cursor = "pointer"
    })
    map.on("mouseleave", clusterLayerId, () => {
      map.getCanvas().style.cursor = ""
    })
    map.on("mouseenter", pointLayerId, () => {
      map.getCanvas().style.cursor = "pointer"
    })
    map.on("mouseleave", pointLayerId, () => {
      map.getCanvas().style.cursor = ""
    })

    return () => {
      if (map.getLayer(pointLayerId)) map.removeLayer(pointLayerId)
      if (map.getLayer(clusterCountLayerId))
        map.removeLayer(clusterCountLayerId)
      if (map.getLayer(clusterLayerId)) map.removeLayer(clusterLayerId)
      if (map.getSource(sourceId)) map.removeSource(sourceId)
    }
  }, [
    map,
    isLoaded,
    data,
    clusterRadius,
    clusterMaxZoom,
    clusterColors,
    clusterThresholds,
    pointColor,
    onPointClick,
    onClusterClick,
  ])

  return null
}

// ============================================================================
// Exports
// ============================================================================

export {
  Map,
  useMap,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  MarkerLabel,
  MapControls,
  MapPopup,
  MapRoute,
  MapClusterLayer,
}

export type {
  MapProps,
  MapMarkerProps,
  MarkerContentProps,
  MarkerPopupProps,
  MarkerTooltipProps,
  MarkerLabelProps,
  MapControlsProps,
  MapPopupProps as StandaloneMapPopupProps,
  MapRouteProps,
  MapClusterLayerProps,
}
