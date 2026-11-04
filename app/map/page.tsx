'use client';

import { useEffect, useEffectEvent, useRef, useState, Suspense } from 'react';
import type { LayerGroup, Map as LeafletMap } from 'leaflet';
import { supabase } from '../lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import WorkspaceShell from '../../components/WorkspaceShell';
import 'leaflet/dist/leaflet.css';

function MapContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const docId = searchParams.get('id');
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const layerGroup = useRef<LayerGroup | null>(null);
  
  const [docData, setDocData] = useState<{ title: string; county: string; category: string; geom: unknown } | null>(null);
  const [status, setStatus] = useState('Initializing Map Engine...');

  const loadParcelData = useEffectEvent(async () => {
    if (!docId) {
      setStatus('No document ID provided.');
      return;
    }

    setStatus('Fetching spatial geometry from PostGIS...');
    const leafletModule = await import('leaflet');
    const L = leafletModule.default;
    const { data: doc, error: docErr } = await supabase
      .from('spatial_documents')
      .select('*')
      .eq('id', docId)
      .single();

    if (docErr || !doc) {
      setStatus(`Error: ${docErr?.message || 'Document not found'}`);
      return;
    }

    setDocData(doc);
    if (doc.geom) {
      const docLayer = L.geoJSON(doc.geom, {
        style: { color: "#16a34a", weight: 3, fillOpacity: 0.35 }
      }).bindPopup(`<b>${doc.title}</b><br>County: ${doc.county}`).addTo(layerGroup.current!);

      mapInstance.current?.fitBounds(docLayer.getBounds(), { padding: [50, 50] });
      setStatus(`Rendered ${doc.title}. Ready for overlay analysis.`);
    } else {
      setStatus(`${doc.title} has metadata, but no spatial coordinates are digitized yet.`);
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    // Dynamically import Leaflet to prevent Next.js server-side crashes
    import('leaflet').then((leafletModule) => {
      const mapElement = mapRef.current;
      if (!mapElement) return;
      const L = leafletModule.default;
      if (!mapInstance.current) {
        // Initialize Map
        mapInstance.current = L.map(mapElement).setView([-0.29, 36.09], 11);
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19,
          attribution: 'Tiles © Esri'
        }).addTo(mapInstance.current);

        layerGroup.current = L.layerGroup().addTo(mapInstance.current);
      }

      void loadParcelData();
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [docId]);

  const loadCorridors = async () => {
    if (!mapInstance.current) return;
    setStatus('Loading KeNHA Corridors...');
    
    // Import Leaflet dynamically for the button click
    const leafletModule = await import('leaflet');
    const L = leafletModule.default;

    const { data, error } = await supabase.from('parastatal_corridors').select('*');
    if (error) return setStatus(`Error: ${error.message}`);

    data.forEach(item => {
      L.geoJSON(item.geom, {
        style: { color: "#d97706", weight: 3, fillColor: "#fbbf24", fillOpacity: 0.45 }
      }).bindPopup(`<b>${item.agency} Corridor Reserve</b><br>${item.corridor_name}`).addTo(layerGroup.current!);
    });
    
    setStatus(`Overlayed ${data.length} corridor reserves.`);
  };

  return (
    <WorkspaceShell compact>
    <div className="flex h-[calc(100dvh-4rem)] min-h-0 flex-col bg-[#f3f6fa] lg:flex-row">
      <div className="flex h-[48%] w-full shrink-0 flex-col border-b border-[#cbd5e1] bg-white lg:h-full lg:w-[340px] lg:border-b-0 lg:border-r">
        <div className="border-b border-[#e2e8f0] p-5">
          <button 
            onClick={() => router.push('/dashboard')}
            className="mb-4 flex items-center text-xs font-semibold text-[#006194] hover:text-[#00527c]"
          >
            ← Back to Database
          </button>
          <h2 className="text-base font-bold leading-tight text-[#0b1c30]">Spatial overlay viewer</h2>
          <p className="mt-1 text-[10px] uppercase tracking-wide text-[#64748b]">PostGIS spatial record</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5">
          {docData && (
            <div className="mb-5 border border-[#dbe3eb] bg-[#f8fafc] p-3">
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#64748b]">Active target</h3>
              <p className="text-xs font-semibold text-[#0f172a]">{docData.title}</p>
              <p className="mt-1 text-[10px] text-[#526174]">{docData.county} · {docData.category}</p>
            </div>
          )}

          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-wide text-[#64748b]">Overlay controls</h3>
          <button 
            onClick={loadCorridors}
            className="mb-3 w-full border border-[#f2d5a5] bg-[#fff8e9] px-3 py-2.5 text-xs font-semibold text-[#9a5c00] transition-colors hover:bg-[#fff1d2]"
          >
            Overlay KeNHA Road Reserves
          </button>
          
          <button 
            className="mb-3 w-full cursor-not-allowed border border-[#dbe3eb] bg-[#f1f5f9] px-3 py-2.5 text-xs font-semibold text-[#7b8794]"
          >
            Run Encroachment Check (ST_Intersects)
          </button>
        </div>

        <div className="border-t border-[#e2e8f0] bg-[#f8fafc] p-4 text-[11px] leading-relaxed">
          <span className={status.includes('Error') || status.includes('⚠️') ? 'text-[#9a5c00]' : 'text-[#28704c]'}>
            <span className="font-bold uppercase tracking-wide">Status · </span>{status}
          </span>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 bg-[#e5ece8]">
        <div ref={mapRef} className="absolute inset-0" />
      </div>
    </div>
    </WorkspaceShell>
  );
}

// Next.js requires useSearchParams to be wrapped in a Suspense boundary
export default function MapPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Loading Map Engine...</div>}>
      <MapContent />
    </Suspense>
  );
}