
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LocateFixed, Siren, Map, Navigation, AlertTriangle } from 'lucide-react';

// Helper to prevent XSS
function escapeHtml(s: string | null | undefined): string {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

type Hospital = {
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
  distance: number;
};

const NearbyHospitalPage: React.FC = () => {
  const [status, setStatus] = useState<string>('Initializing...');
  const [nearestHospital, setNearestHospital] = useState<Hospital | null>(null);
  const [locationError, setLocationError] = useState(false);

  const mapRef = useRef<any>(null); // For Leaflet map instance
  const markersLayerRef = useRef<any>(null); // For Leaflet layer group
  const userLocationRef = useRef<{ lat: number; lng: number } | null>(null);
  const radiusRef = useRef<string>('5000');

  const haversineDist = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    function toRad(x: number) { return (x * Math.PI) / 180; }
    const R = 6371e3; // meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const overpassQuery = (lat: number, lng: number, radius: number) => {
    return `[out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radius},${lat},${lng});
        way["amenity"="hospital"](around:${radius},${lat},${lng});
        relation["amenity"="hospital"](around:${radius},${lat},${lng});
      );
      out center tags;`;
  };

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
  
  const initMap = useCallback((lat: number, lng: number) => {
    const L = (window as any).L;
    if (!L || mapRef.current) return;

    const map = L.map('map', { zoomControl: true }).setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    mapRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);
    
    if (markersLayerRef.current) {
        const userMarker = L.circleMarker([lat, lng], { radius: 7, color: '#0b84ff', fillColor: '#0b84ff', fillOpacity: 0.9 }).bindPopup('You are here');
        markersLayerRef.current.addLayer(userMarker);
    }
  }, []);

  const searchNearby = useCallback(async () => {
    const L = (window as any).L;
    if (!L) return;
      
    const radius = parseInt(radiusRef.current || '5000', 10);
    if (!userLocationRef.current) {
      setStatus('Location not available.');
      return;
    }

    setStatus('Searching nearby hospitals...');
    setNearestHospital(null);

    try {
      const q = overpassQuery(userLocationRef.current.lat, userLocationRef.current.lng, radius);
      const data = await fetchOverpass(q);
      const elements = (data.elements || [])
        .map((el: any) => {
          const lat = el.lat ?? (el.center && el.center.lat);
          const lon = el.lon ?? (el.center && el.center.lon);
          return { id: el.id, lat, lon, tags: el.tags || {} };
        })
        .filter((e: any) => e.lat && e.lon && e.tags.name);

      if (markersLayerRef.current) {
        markersLayerRef.current.clearLayers();
        markersLayerRef.current.addLayer(L.circleMarker([userLocationRef.current.lat, userLocationRef.current.lng], { radius: 7, color: '#0b84ff', fillColor: '#0b84ff', fillOpacity: 0.9 }).bindPopup('You are here'));
      }

      if (elements.length === 0) {
        setStatus(`No hospitals found within ${radius / 1000} km.`);
        return;
      }

      const processed: Hospital[] = elements.map((e: any) => ({ ...e, distance: Math.round(haversineDist(userLocationRef.current!.lat, userLocationRef.current!.lng, e.lat, e.lon)) }))
        .sort((a: Hospital, b: Hospital) => a.distance - b.distance);
      
      if (markersLayerRef.current) {
        processed.forEach((p, idx) => {
          const name = p.tags.name || `Hospital ${idx + 1}`;
          const marker = L.marker([p.lat, p.lon]).bindPopup(`<strong>${name}</strong><br/>${p.distance} m`);
          markersLayerRef.current.addLayer(marker);
        });
      }

      if (mapRef.current && markersLayerRef.current.getLayers().length > 1) {
          try {
            const group = new L.featureGroup(markersLayerRef.current.getLayers());
            mapRef.current.fitBounds(group.getBounds().pad(0.2));
          } catch(e) { console.error("FitBounds error", e); }
      }

      const nearest = processed[0];
      setNearestHospital(nearest);
      setStatus(`Found ${processed.length} hospital(s). Nearest: ${nearest.tags.name} • ${nearest.distance}m`);

    } catch (err) {
      console.error(err);
      setStatus('Error fetching nearby hospitals. Try again later.');
    }
  }, []);
  
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined' || !(window as any).L) {
        setStatus('Map library not loaded yet.');
        return;
    }
    
    setStatus('Requesting location permission...');
    if (!navigator.geolocation) {
      setStatus('Geolocation not supported in this browser.');
      setLocationError(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLocationRef.current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        initMap(pos.coords.latitude, pos.coords.longitude);
        searchNearby();
      },
      (err) => {
        setStatus('Location permission denied. Please enable location services in your browser settings.');
        setLocationError(true);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, [initMap, searchNearby]);

  const handleCallEmergency = () => {
    if (confirm('Call emergency number 112?')) {
      window.location.href = 'tel:112';
    }
  };
  
  const handleNavigate = (hospital: Hospital) => {
     window.open(`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lon}`, '_blank');
  }

  const handleCenterMap = (hospital: Hospital) => {
      if(mapRef.current) {
        mapRef.current.setView([hospital.lat, hospital.lon], 16);
      }
  }


  return (
    <>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Nearby Hospitals</h1>
        
        <Card>
            <CardHeader>
                <CardTitle>Hospital Finder</CardTitle>
                <CardDescription>Your location and the nearest hospital found via OpenStreetMap.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-2">
                        <label htmlFor="radiusSelect" className="text-sm font-medium">Search Radius:</label>
                        <Select defaultValue={radiusRef.current} onValueChange={(val) => { radiusRef.current = val; }}>
                            <SelectTrigger id="radiusSelect" className="w-[120px]">
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
                     <div className="flex-1 flex items-center gap-2">
                         <Button onClick={searchNearby} className="w-full md:w-auto" disabled={locationError}>
                            <LocateFixed className="mr-2 h-4 w-4"/>
                            Refresh Nearby
                         </Button>
                         <Button onClick={handleCallEmergency} variant="destructive" className="w-full md:w-auto">
                            <Siren className="mr-2 h-4 w-4"/>
                            Call Emergency
                         </Button>
                    </div>
                 </div>

                <div id="map" className="h-[420px] w-full rounded-lg border bg-secondary"></div>

                <div className="mt-4">
                    <p className="text-sm font-semibold text-muted-foreground">{status}</p>
                    {locationError && (
                      <Alert variant="destructive" className="mt-4">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Location Error</AlertTitle>
                          <AlertDescription>
                            Could not access your location. Please ensure location services are enabled in your browser and system settings.
                          </AlertDescription>
                      </Alert>
                    )}
                    {nearestHospital && (
                         <Card className="mt-2">
                            <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex-1">
                                    <p className="font-bold text-lg">{escapeHtml(nearestHospital.tags.name)}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{escapeHtml(nearestHospital.tags['addr:full'] || nearestHospital.tags.vicinity || 'Address not available')}</p>
                                    <p className="text-sm font-semibold mt-2">Distance: {nearestHospital.distance} m</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                                    <Button onClick={() => handleNavigate(nearestHospital)}>
                                        <Navigation className="mr-2 h-4 w-4"/>
                                        Navigate
                                    </Button>
                                    <Button variant="outline" onClick={() => handleCenterMap(nearestHospital)}>
                                        <Map className="mr-2 h-4 w-4"/>
                                        Center on Map
                                    </Button>
                                </div>
                            </CardContent>
                         </Card>
                    )}
                </div>
                
                 <p className="text-xs text-muted-foreground text-center pt-4">
                    Map data &copy; OpenStreetMap contributors. For informational use only.
                </p>
            </CardContent>
        </Card>
      </div>
    </>
  );
};

export default NearbyHospitalPage;
