"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

export default function MapDigitizer({ embedded = false, inWorkspace = false }) {
  const mapRef = useRef(null);
  const overlayRef = useRef(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [opacity, setOpacity] = useState(0.7);
  const [bounds, setBounds] = useState(null);
  const [hasOverlay, setHasOverlay] = useState(false);
  const [georeferenceStatus, setGeoreferenceStatus] = useState("");

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize Map centered on Nairobi
      const map = L.map("digitizer-map").setView([-1.2921, 36.8219], 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
      mapRef.current = map;

      // Initialize Drawing Layer
      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      const drawControl = new L.Control.Draw({
        edit: { featureGroup: drawnItems },
        draw: { polygon: true, rectangle: true, marker: true, polyline: true, circle: false, circlemarker: false }
      });
      map.addControl(drawControl);

      const updateOutput = () => setGeoJsonData(drawnItems.toGeoJSON());
      map.on(L.Draw.Event.CREATED, (e) => {
        drawnItems.addLayer(e.layer);
        updateOutput();
      });
      map.on(L.Draw.Event.EDITED, updateOutput);
      map.on(L.Draw.Event.DELETED, updateOutput);
    }
  }, []);

  // Place the raster over the map's current geographic view.
  const applyRasterTransformation = (imgUrl = null) => {
    if (!mapRef.current) return;

    const urlToUse = imgUrl || (overlayRef.current ? overlayRef.current._url : null);
    if (!urlToUse) return;

    if (overlayRef.current) {
      mapRef.current.removeLayer(overlayRef.current);
    }

    overlayRef.current = L.imageOverlay(urlToUse, mapRef.current.getBounds(), { opacity }).addTo(mapRef.current);
    setHasOverlay(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setGeoreferenceStatus(`Loading ${file.name}...`);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64DataUrl = event.target.result;
      applyRasterTransformation(base64DataUrl); 

      // 1. Calculate the native aspect ratio of the raster image to prevent stretching
      const img = new window.Image();
      img.onload = async () => {
        const aspectRatio = img.naturalWidth / img.naturalHeight;

        try {
          const response = await fetch('/api/georeference', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: file.name, imageData: base64DataUrl })
          });
          
          const data = await response.json();
          if (!response.ok || !data.success) {
            throw new Error(data.error || "Automatic georeferencing is unavailable.");
          }
          
          // 2. Find the geographic centroid (center point) of the AI/OSM bounding box
          const centerLat = (data.bounds.north + data.bounds.south) / 2;
          const centerLng = (data.bounds.east + data.bounds.west) / 2;

          // 3. Force a proportional bounding box (~1.5km wide) around that centroid
          const fixedWidthDeg = 0.015; 
          const fixedHeightDeg = fixedWidthDeg / aspectRatio;

          const proportionalBounds = {
            south: centerLat - (fixedHeightDeg / 2),
            north: centerLat + (fixedHeightDeg / 2),
            west: centerLng - (fixedWidthDeg / 2),
            east: centerLng + (fixedWidthDeg / 2)
          };

          setBounds(proportionalBounds);
          setGeoreferenceStatus("Automatic placement complete.");
          if (mapRef.current && overlayRef.current) {
            const leafletBounds = [
              [proportionalBounds.south, proportionalBounds.west], 
              [proportionalBounds.north, proportionalBounds.east]
            ];
            overlayRef.current.setBounds(leafletBounds);
            mapRef.current.fitBounds(leafletBounds);
          }
        } catch (err) {
          console.error("Georeferencing request failed:", err);
          setGeoreferenceStatus("Automatic placement unavailable. You can position the raster manually on the map.");
        }
      };

      img.onerror = () => setGeoreferenceStatus("Image preview failed. Choose a supported image file.");
      
      // Trigger the image load for calculation
      img.src = base64DataUrl;
    };
    reader.onerror = () => setGeoreferenceStatus("The selected image could not be read.");
    reader.readAsDataURL(file);
  };

  const handleGeoJsonDownload = () => {
    if (!geoJsonData?.features?.length) return;

    const file = new Blob([JSON.stringify(geoJsonData, null, 2)], { type: "application/geo+json" });
    const url = window.URL.createObjectURL(file);
    const downloadLink = window.document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "digitized-features.geojson";
    downloadLink.click();
    window.setTimeout(() => window.URL.revokeObjectURL(url), 0);
  };

  return (
    <div className={`flex w-full flex-col overflow-hidden bg-[#f3f6fa] font-sans text-[#0b1c30] ${embedded ? "h-full min-h-[520px]" : inWorkspace ? "h-[calc(100dvh-4rem)]" : "h-[100dvh]"}`}>
      {!embedded && !inWorkspace && <header className="z-[1001] flex h-[58px] shrink-0 items-center justify-between border-b border-[#293a33] bg-[#17251f] px-4 text-white sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#75bd91] text-[11px] font-black tracking-wide text-[#183323]">SSI</div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold sm:text-sm">Spatial Intelligence Hub</p>
            <p className="hidden text-[10px] text-[#a6b8ae] sm:block">Workspace <span className="px-1 text-[#688174]">/</span> Raster digitizer</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 border-l border-[#34473e] pl-3 sm:gap-3 sm:pl-5">
          <span className="hidden rounded border border-[#3b5547] bg-[#21362b] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#b9d7c5] sm:inline">2D workspace</span>
          <span className="flex items-center gap-2 text-[11px] text-[#b7c8bf]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#75bd91]" />
            <span className="hidden sm:inline">Map ready</span>
          </span>
        </div>
      </header>}

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <section className="relative z-0 min-h-0 flex-[0_0_43%] bg-[#e5ece8] md:flex-1">
          <div id="digitizer-map" className="absolute inset-0" aria-label="Spatial map" />
          <div className="pointer-events-none absolute left-3 top-3 z-[1000] sm:left-5 sm:top-5">
            <div className="flex items-center gap-2 rounded border border-white/80 bg-white/95 px-3 py-2 shadow-[0_2px_12px_rgba(21,40,31,0.14)] backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#62a97d] ring-2 ring-[#dff0e5]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#355247]">OpenStreetMap</span>
              <span className="h-3 border-l border-[#dce5df]" />
              <span className="text-[10px] font-medium text-[#718178]">Base layer</span>
            </div>
          </div>
        </section>

        <aside className="z-10 flex min-h-0 flex-1 flex-col overflow-hidden border-t border-[#d2ddd6] bg-[#fbfcfb] md:w-[380px] md:flex-none md:border-l md:border-t-0 lg:w-[410px]">
          <div className="flex shrink-0 items-center justify-between border-b border-[#e1e8e4] px-5 py-4">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#6b8176]">Digitizing workspace</p>
              <h1 className="text-lg font-semibold tracking-tight text-[#1d3027]">Raster georeferencing</h1>
            </div>
            <span className="rounded border border-[#dce8e1] bg-[#f0f7f3] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#426756]">Draft</span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <section className="border-b border-[#e6ece8] px-5 py-4">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-[#e7f0ea] text-[10px] font-bold tabular-nums text-[#3d7057]">01</span>
                <label htmlFor="raster-file" className="text-sm font-semibold text-[#263b32]">Source image</label>
              </div>
              <input
                id="raster-file"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="block w-full cursor-pointer rounded border border-[#d8e1dc] bg-white text-xs text-[#52645b] file:mr-3 file:border-0 file:border-r file:border-[#d8e1dc] file:bg-[#eff5f1] file:px-3 file:py-2.5 file:text-xs file:font-semibold file:text-[#315c47] hover:file:bg-[#e5efe9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3c8962]"
              />
              {georeferenceStatus && <p className="mt-2 text-[10px] leading-4 text-[#526174]" role="status">{georeferenceStatus}</p>}
              <div className="mb-1 mt-4 flex items-center justify-between">
                <label htmlFor="overlay-opacity" className="text-xs font-medium text-[#53665c]">Overlay opacity</label>
                <output htmlFor="overlay-opacity" className="text-xs font-semibold tabular-nums text-[#315c47]">
                  {Math.round(Number(opacity) * 100)}%
                </output>
              </div>
              <input
                id="overlay-opacity"
                aria-label="Overlay opacity"
                type="range" min="0" max="1" step="0.1" value={opacity}
                onChange={(e) => {
                  setOpacity(e.target.value);
                  if (overlayRef.current) overlayRef.current.setOpacity(e.target.value);
                }}
                className="w-full accent-[#37845f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3c8962]"
              />
            </section>

            <section className="border-b border-[#e6ece8] px-5 py-4">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-[#e7f0ea] text-[10px] font-bold tabular-nums text-[#3d7057]">02</span>
                <h2 className="text-sm font-semibold text-[#263b32]">Spatial placement</h2>
              </div>
              {bounds && (
                <details className="mb-3 rounded border border-[#e1e8e4] bg-white px-3 py-2 text-xs text-[#53665c]">
                  <summary className="cursor-pointer font-medium text-[#426756]">Detected geographic bounds</summary>
                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                    <div><dt className="text-[#7a8b82]">South</dt><dd className="font-mono tabular-nums">{Number(bounds.south).toFixed(5)}</dd></div>
                    <div><dt className="text-[#7a8b82]">North</dt><dd className="font-mono tabular-nums">{Number(bounds.north).toFixed(5)}</dd></div>
                    <div><dt className="text-[#7a8b82]">West</dt><dd className="font-mono tabular-nums">{Number(bounds.west).toFixed(5)}</dd></div>
                    <div><dt className="text-[#7a8b82]">East</dt><dd className="font-mono tabular-nums">{Number(bounds.east).toFixed(5)}</dd></div>
                  </dl>
                </details>
              )}
              <button
                disabled={!hasOverlay}
                onClick={() => {
                  // Grab the current map view bounds and apply them to the image overlay.
                  if (mapRef.current && overlayRef.current) {
                    const currentBounds = mapRef.current.getBounds();
                    overlayRef.current.setBounds(currentBounds);
                  }
                }}
                className="w-full rounded bg-[#244d3b] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#193d2d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3c8962] disabled:cursor-not-allowed disabled:bg-[#dbe3eb] disabled:text-[#7b8794]"
              >
                Snap image to current view
              </button>
            </section>

            <section className="flex min-h-[240px] flex-col px-5 py-4 md:min-h-0 md:flex-1">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-[#e7f0ea] text-[10px] font-bold tabular-nums text-[#3d7057]">03</span>
                  <h2 className="text-sm font-semibold text-[#263b32]">Digitized features</h2>
                </div>
                <span className="text-[11px] tabular-nums text-[#718178]">{geoJsonData?.features?.length ?? 0} features</span>
              </div>
              <textarea
                aria-label="Extracted GeoJSON coordinates"
                readOnly
                value={geoJsonData ? JSON.stringify(geoJsonData, null, 2) : "No features yet"}
                className="min-h-28 w-full flex-1 resize-y rounded border border-[#293e35] bg-[#172821] p-3 font-mono text-[11px] leading-relaxed text-[#b8e4c9] placeholder:text-[#8ba095] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3c8962]"
              />
              <button
                type="button"
                onClick={handleGeoJsonDownload}
                disabled={!geoJsonData?.features?.length}
                className="mt-3 w-full rounded bg-[#006194] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#00527c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7] disabled:cursor-not-allowed disabled:bg-[#e2e8f0] disabled:text-[#718096]"
              >
                Download GeoJSON
              </button>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
