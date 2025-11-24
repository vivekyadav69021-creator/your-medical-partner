'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, LocateFixed, Siren, Phone } from 'lucide-react';


// Helper function to escape HTML, useful for preventing XSS
function escapeHtml(s: string | null | undefined): string {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}


const NearbyHospitalPage: React.FC = () => {
  const [status, setStatus] = useState<{ msg: string; isError: boolean }>({
    msg: 'Initializing...',
    isError: false,
  });
  const [allResults, setAllResults] = useState<any[]>([]);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const mapRef = useRef<any>(null); // For Leaflet map instance
  const markersLayerRef = useRef<any>(null); // For Leaflet layer group
  const userLocationRef = useRef<{ lat: number; lng: number } | null>(null);
  const radiusRef = useRef<string>('5000');
  
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

 const renderResults = useCallback((elements: any[], radius: number, L: any) => {
    if (!mapRef.current || !userLocationRef.current) return;

    if (markersLayerRef.current) {
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
    }


    if (!elements || elements.length === 0) {
      setStatus({ msg: `No hospitals found within ${radius / 1000} km.`, isError: false });
      setAllResults([]);
      setFilteredResults([]);
      return;
    }
    
    const processed = elements
      .map((e) => {
        const center = e.center || { lat: e.lat, lon: e.lon };
        if (!center || typeof center.lat === 'undefined' || typeof center.lon === 'undefined') {
          return null;
        }
        const distance = Math.round(
          haversineDist(userLocationRef.current!.lat, userLocationRef.current!.lng, center.lat, center.lon)
        );
        return { ...e, lat: center.lat, lon: center.lon, distance };
      })
      .filter(p => p !== null && p.tags && p.tags.name)
      .sort((a, b) => a.distance - b.distance);

    setStatus({ msg: `${processed.length} hospitals found.`, isError: false });

    processed.forEach((p) => {
      if (!p) return;
      const name = p.tags.name;
      const marker = L.marker([p.lat, p.lon]).bindPopup(`<strong>${escapeHtml(name)}</strong><br/>${p.distance} m`);
      if (markersLayerRef.current) {
        markersLayerRef.current.addLayer(marker);
      }
    });
    
    setAllResults(processed as any[]);
    setFilteredResults(processed as any[]);

    if (markersLayerRef.current) {
        const group = new L.featureGroup(markersLayerRef.current.getLayers());
        try {
          if (group.getLayers().length > 1) { // only fit if more than just the user marker
            mapRef.current.fitBounds(group.getBounds().pad(0.2));
          }
        } catch (e) {
          console.error("FitBounds error:", e);
        }
    }
  }, []);

  const loadNearby = useCallback(async (forceRefresh = false) => {
    const L = (window as any).L;
    if (!L || !userLocationRef.current) {
        setStatus({ msg: 'Waiting for location…', isError: false });
        return;
    }

    const radius = parseInt(radiusRef.current || '5000', 10);
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
    }
    
    if (forceRefresh) {
         sessionStorage.removeItem(key);
    }
    
    setStatus({ msg: 'Searching nearby hospitals…', isError: false });
    const q = overpassQuery(userLocationRef.current.lat, userLocationRef.current.lng, radius);

    try {
        const json = await fetchOverpass(q);
        const elements = json.elements || [];
        
        sessionStorage.setItem(key, JSON.stringify({ _ts: Date.now(), data: elements }));
        renderResults(elements, radius, L);
    } catch (err: any) {
        console.error(err);
        setStatus({ msg: `Error fetching nearby data: ${err.message}. Try again later.`, isError: true });
    }
  }, [renderResults, CACHE_TTL_MS]);

  const initMap = useCallback((lat: number, lng: number) => {
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
      if (markersLayerRef.current) {
        markersLayerRef.current.clearLayers();
      }
    }
    if (markersLayerRef.current) {
      const userMarker = L.circleMarker([lat, lng], {
        radius: 7,
        color: '#2b9edb',
        fillColor: '#2b9edb',
        fillOpacity: 0.9,
      }).bindPopup('You are here');
      markersLayerRef.current.addLayer(userMarker);
    }
  }, []);
  
  // Effect to initialize map and get location
  useEffect(() => {
    const L = (window as any).L;
    if (typeof window === 'undefined' || !L) {
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
  }, [initMap, loadNearby]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredResults(allResults);
      return;
    }
    setFilteredResults(
      allResults.filter(p =>
        p.tags.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, allResults]);

  const handleCallEmergency = () => {
    if (confirm('Call emergency number 112?')) {
      window.location.href = 'tel:112';
    }
  };
  
  const handleNavigate = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  const handleOpenOnMap = (lat: number, lng: number) => {
      if (!mapRef.current || !markersLayerRef.current) return;
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
      <div className="space-y-8">
         <h1 className="text-3xl font-bold tracking-tight font-headline">Nearby Hospitals</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Hospital Finder</CardTitle>
            <CardDescription>Use the controls below to find hospitals near your location using OpenStreetMap.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="radiusSelect" className="text-sm font-medium mr-2">Search radius:</label>
                <Select defaultValue={radiusRef.current} onValueChange={(val) => { radiusRef.current = val; loadNearby(true); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select radius" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1000">1 km</SelectItem>
                    <SelectItem value="2000">2 km</SelectItem>
                    <SelectItem value="5000">5 km</SelectItem>
                    <SelectItem value="10000">10 km</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 flex items-end gap-2">
                 <Button onClick={() => loadNearby(true)} className="w-full md:w-auto">
                    <LocateFixed className="mr-2 h-4 w-4"/>
                    Refresh Nearby
                 </Button>
                 <Button onClick={handleCallEmergency} variant="destructive" className="w-full md:w-auto">
                    <Siren className="mr-2 h-4 w-4"/>
                    Call Emergency
                 </Button>
              </div>
            </div>
            <div id="map" className="h-96 w-full rounded-lg border"></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <CardTitle>Hospitals Found</CardTitle>
             <div className="text-sm text-muted-foreground">{status.msg}</div>
             <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search in results..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
             </div>
          </CardHeader>
          <CardContent>
             <div className="flex flex-col gap-2 mt-4 max-h-96 overflow-y-auto">
              {filteredResults.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">{status.isError ? 'Could not load data.' : 'No results to display.'}</p>
              ) : (
                filteredResults.map((p, idx) => {
                  const name = p.tags.name || `Hospital ${idx + 1}`;
                  const addr = p.tags['addr:full'] || p.tags['addr:street'] || p.tags.address || p.tags.vicinity || 'Address not available';
                  const phone = p.tags.phone || p.tags['contact:phone'] || '';

                  return (
                      <div key={p.id} className="p-3 border rounded-lg flex flex-col md:flex-row justify-between gap-4 items-center">
                          <div className="flex-1">
                              <div className="font-semibold">{escapeHtml(name)} <span className="text-gray-500 font-normal text-sm">• {(p.distance / 1000).toFixed(1)} km</span></div>
                              <div className="text-sm text-muted-foreground">{escapeHtml(addr)}</div>
                              {phone && <div className="text-sm mt-1 flex items-center gap-2"><Phone className="h-3 w-3"/> {escapeHtml(phone)}</div>}
                          </div>
                           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                              <Button onClick={() => handleNavigate(p.lat, p.lon)} variant="outline" size="sm">Navigate</Button>
                              <Button onClick={() => handleOpenOnMap(p.lat, p.lon)} variant="secondary" size="sm">Show on Map</Button>
                          </div>
                      </div>
                  )
                })
              )}
             </div>
          </CardContent>
        </Card>
        
        <div className="text-xs text-muted-foreground text-center">
          Map data &copy; OpenStreetMap contributors. This is for informational use only — for emergencies call local services.
        </div>
      </div>
    </>
  );
};

export default NearbyHospitalPage;

    