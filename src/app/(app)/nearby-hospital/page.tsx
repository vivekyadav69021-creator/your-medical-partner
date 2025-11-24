'use client';

import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

// Helper function to escape HTML, useful for preventing XSS
function escapeHtml(s: string | null | undefined) {
  if (!s) return '';
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

const NearbyHospitalPage: React.FC = () => {
  const [status, setStatus] = useState<{ msg: string; isError: boolean }>({
    msg: 'Initializing...',
    isError: false,
  });
  const [results, setResults] = useState<any[]>([]);

  const mapRef = useRef<any>(null); // For Leaflet map instance
  const markersLayerRef = useRef<any>(null); // For Leaflet layer group
  const userLocationRef = useRef<{ lat: number; lng: number } | null>(null);
  const radiusRef = useRef<HTMLSelectElement>(null);
  
  const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

  // Function to get Haversine distance
  const haversineDist = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    function toRad(x: number) {
      return (x * Math.PI) / 180;
    }
    const R = 6371e3; // meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Overpass query function
  const overpassQuery = (lat: number, lng: number, radius: number) => {
    return `[out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radius},${lat},${lng});
        way["amenity"="hospital"](around:${radius},${lat},${lng});
        relation["amenity"="hospital"](around:${radius},${lat},${lng});
      );
      out center tags;`;
  };

  // Fetch from Overpass API
  const fetchOverpass = async (query: string) => {
    const url = 'https://overpass-api.de/api/interpreter';
    const resp = await fetch(url, {
      method: 'POST',
      body: query,
      headers: { 'Content-Type': 'text/plain' },
    });
    if (!resp.ok) throw new Error('Overpass API error: ' + resp.status);
    return resp.json();
  };

  // Cache key generator
  const cacheKey = (lat: number, lng: number, radius: number) => {
    const latr = Math.round(lat * 10000) / 10000;
    const lngr = Math.round(lng * 10000) / 10000;
    return `osm_nearby_${latr}_${lngr}_${radius}`;
  };

  const renderResults = (elements: any[], radius: number, L: any) => {
    if (!mapRef.current || !userLocationRef.current) return;

    markersLayerRef.current.clearLayers();
    // Re-add user marker
    markersLayerRef.current.addLayer(
      L.circleMarker([userLocationRef.current.lat, userLocationRef.current.lng], {
        radius: 7,
        color: '#2b9edb',
        fillColor: '#2b9edb',
        fillOpacity: 0.9,
      }).bindPopup('You are here')
    );

    if (!elements || elements.length === 0) {
      setStatus({ msg: `No hospitals found within ${radius} meters.`, isError: false });
      setResults([]);
      return;
    }
    
    setStatus({ msg: `${elements.length} hospitals found.`, isError: false });

    const processed = elements
      .map((e) => {
        const distance = Math.round(
          haversineDist(userLocationRef.current!.lat, userLocationRef.current!.lng, e.lat, e.lon)
        );
        return { ...e, distance };
      })
      .sort((a, b) => a.distance - b.distance);

    processed.forEach((p, idx) => {
      const name = p.tags.name || `Hospital ${idx + 1}`;
      const marker = L.marker([p.lat, p.lon]).bindPopup(`<strong>${escapeHtml(name)}</strong><br/>${p.distance} m`);
      markersLayerRef.current.addLayer(marker);
    });
    
    setResults(processed);

    const group = new L.featureGroup(markersLayerRef.current.getLayers());
    try {
      mapRef.current.fitBounds(group.getBounds().pad(0.2));
    } catch (e) {}
  };


  const loadNearby = async (forceRefresh = false) => {
    const L = (window as any).L;
    if (!L || !userLocationRef.current) {
        setStatus({ msg: 'Waiting for location…', isError: false });
        return;
    }

    const radius = parseInt(radiusRef.current?.value || '5000', 10);
    const key = cacheKey(userLocationRef.current.lat, userLocationRef.current.lng, radius);
    
    if (!forceRefresh) {
        const cached = sessionStorage.getItem(key);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                if (Date.now() - parsed._ts < CACHE_TTL_MS) {
                    renderResults(parsed.data, radius, L);
                    return;
                }
            } catch (e) {
                console.error("Cache parse error:", e);
            }
        }
    } else {
         sessionStorage.removeItem(key);
    }
    
    setStatus({ msg: 'Searching nearby hospitals…', isError: false });
    const q = overpassQuery(userLocationRef.current.lat, userLocationRef.current.lng, radius);

    try {
        const json = await fetchOverpass(q);
        const elements = (json.elements || [])
            .map((el: any) => {
                const lat = el.lat ?? (el.center && el.center.lat);
                const lon = el.lon ?? (el.center && el.center.lon);
                return { id: el.id, lat, lon, tags: el.tags || {} };
            })
            .filter((e: any) => e.lat && e.lon);
        
        sessionStorage.setItem(key, JSON.stringify({ _ts: Date.now(), data: elements }));
        renderResults(elements, radius, L);
    } catch (err: any) {
        console.error(err);
        setStatus({ msg: `Error fetching nearby data: ${err.message}. Try again later.`, isError: true });
    }
  };

  const initMap = (lat: number, lng: number) => {
    const L = (window as any).L;
    if (!L) return;

    if (!mapRef.current) {
      const map = L.map('map', { zoomControl: true }).setView([lat, lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);
      mapRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    } else {
      mapRef.current.setView([lat, lng], 13);
      markersLayerRef.current.clearLayers();
    }
    const userMarker = L.circleMarker([lat, lng], {
      radius: 7,
      color: '#2b9edb',
      fillColor: '#2b9edb',
      fillOpacity: 0.9,
    }).bindPopup('You are here');
    markersLayerRef.current.addLayer(userMarker);
  };
  
  // Effect to initialize map and get location
  useEffect(() => {
    const L = (window as any).L;
    if (typeof window === 'undefined' || !L) {
      // Leaflet not loaded yet
      return;
    }

    setStatus({ msg: 'Requesting location permission…', isError: false });
    if (!navigator.geolocation) {
      setStatus({ msg: 'Geolocation not supported in this browser.', isError: true });
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLocationRef.current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        initMap(pos.coords.latitude, pos.coords.longitude);
        loadNearby();
      },
      (err) => {
        console.error(err);
        setStatus({ msg: 'Location permission denied or unavailable. Please enable it in your browser settings.', isError: true });
      },
      { timeout: 10000, maximumAge: 60000 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCallEmergency = () => {
    if (confirm('Call emergency number 112?')) {
      window.location.href = 'tel:112';
    }
  };
  
  const handleNavigate = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  const handleOpenOnMap = (lat: number, lng: number) => {
      if (!mapRef.current) return;
      mapRef.current.setView([lat,lng], 16);
      markersLayerRef.current.eachLayer((mk: any) => {
        if (mk.getLatLng && Math.abs(mk.getLatLng().lat - lat) < 1e-6 && Math.abs(mk.getLatLng().lng - lng) < 1e-6) {
          if (mk.openPopup) mk.openPopup();
        }
      });
  };

  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-sA+4m4bFh3h2Xk5j2gQKq6VbGk0k1sKk6kG6k6H4VvY=" crossOrigin=""/>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-o9N1jQ1qk3XG1zqg9Qwz0o9r1q1p1o0r1q0p0q1r1s8=" crossOrigin=""></script>
      </Head>
      <div className="space-y-8 osm-nearby-container">
         <h1 className="text-3xl font-bold tracking-tight font-headline">Nearby Hospitals</h1>
        
        <div className="flex gap-3 flex-wrap mb-2 items-center">
            <div>
                <label htmlFor="radiusSelect" className="text-sm font-medium mr-2">Search radius (meters):</label>
                <select id="radiusSelect" ref={radiusRef} defaultValue="5000" className="p-2 border rounded-md">
                    <option value="1000">1,000</option>
                    <option value="2000">2,000</option>
                    <option value="5000">5,000</option>
                    <option value="10000">10,000</option>
                </select>
            </div>
            <div>
                <button onClick={() => loadNearby(true)} className="px-3 py-2 bg-blue-500 text-white rounded-md">Refresh Nearby</button>
            </div>
            <div className="ml-auto">
                <button onClick={handleCallEmergency} className="px-3 py-2 bg-red-600 text-white rounded-md">Call Emergency</button>
            </div>
        </div>

        <div id="map" className="h-96 rounded-lg border border-gray-300"></div>

        <div>
            <h4 className="font-bold text-lg">Hospitals found:</h4>
            <div id="list" aria-live="polite">
                {status.isError ? (
                    <div className="text-red-700">{status.msg}</div>
                ) : (
                    <div className="text-gray-700">{status.msg}</div>
                )}
                 <div className="flex flex-col gap-2 mt-4">
                  {results.map((p, idx) => {
                    const name = p.tags.name || `Hospital ${idx + 1}`;
                    const addr = p.tags['addr:full'] || p.tags['addr:street'] || p.tags.address || p.tags.vicinity || 'Address not available';
                    const phone = p.tags.phone || p.tags['contact:phone'] || '';

                    return (
                        <div key={p.id} className="p-2 border-b flex justify-between gap-2 items-center">
                            <div className="flex-1">
                                <div className="font-semibold">{escapeHtml(name)} <span className="text-gray-500 font-normal text-sm">• {p.distance} m</span></div>
                                <div className="text-sm text-gray-600">{escapeHtml(addr)}</div>
                                {phone && <div className="text-sm mt-1">📞 {escapeHtml(phone)}</div>}
                            </div>
                             <div className="flex flex-col gap-2">
                                <button onClick={() => handleNavigate(p.lat, p.lon)} className="px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded-md bg-white">Navigate</button>
                                <button onClick={() => handleOpenOnMap(p.lat, p.lon)} className="px-3 py-1 text-sm border border-green-500 text-green-500 rounded-md bg-white">Open on Map</button>
                            </div>
                        </div>
                    )
                  })}
                 </div>
            </div>
        </div>
        
        <div className="text-xs text-gray-500 mt-3">
          Note: Results come from OpenStreetMap via Overpass API. This is for informational use only — for emergencies call local services.
        </div>
      </div>
      
      <style jsx global>{`
        /* Include the CSS directly or link to it */
        .osm-nearby-container {
          font-family: system-ui, -apple-system, Roboto, 'Segoe UI', Arial;
          max-width: 900px;
          margin: 0 auto;
        }
        @media (max-width:640px) {
          .osm-nearby-container { padding:12px; }
          #map { height:280px; }
        }
      `}</style>
    </>
  );
};

export default NearbyHospitalPage;
