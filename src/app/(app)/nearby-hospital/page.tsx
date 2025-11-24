
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
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
import { Input } from '@/components/ui/input';
import { LocateFixed, Siren, Map, Navigation, AlertTriangle, Hospital as HospitalIcon, Search } from 'lucide-react';

type Hospital = {
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
  distance: number;
};

const NearbyHospitalPage: React.FC = () => {
  const [status, setStatus] = useState<string>('Initializing...');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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
    setHospitals([]);

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

      setHospitals(processed);
      setStatus(`Found ${processed.length} hospital(s) nearby.`);

    } catch (err) {
      console.error(err);
      setStatus('Error fetching nearby hospitals. Try again later.');
    }
  }, []);
  
  useEffect(() => {
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

  const handleShowOnMap = (hospital: Hospital) => {
      if(mapRef.current && markersLayerRef.current) {
        mapRef.current.setView([hospital.lat, hospital.lon], 16);
        markersLayerRef.current.eachLayer((layer: any) => {
            if (layer.getLatLng && layer.getLatLng().lat === hospital.lat && layer.getLatLng().lng === hospital.lon) {
                layer.openPopup();
            }
        });
      }
  }
  
  const filteredHospitals = hospitals.filter(h =>
    h.tags.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Nearby Hospitals</h1>
      
      <Card>
        <CardHeader>
            <CardTitle>Hospital Finder</CardTitle>
            <CardDescription>Find hospitals near your location using OpenStreetMap.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-2">
                    <label htmlFor="radiusSelect" className="text-sm font-medium">Radius:</label>
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
                 <Button onClick={searchNearby} disabled={locationError}>
                    <LocateFixed className="mr-2 h-4 w-4"/>
                    Refresh
                 </Button>
                 <div className="md:ml-auto">
                    <Button onClick={handleCallEmergency} variant="destructive">
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
                        Could not access your location. Please enable location services and refresh the page.
                      </AlertDescription>
                  </Alert>
                )}
            </div>
            
            {hospitals.length > 0 && (
                <div className="space-y-4">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="Search found hospitals..."
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>

                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                        {filteredHospitals.map(hospital => (
                            <Card key={hospital.id}>
                               <CardContent className="p-3 flex flex-col md:flex-row items-center justify-between gap-3">
                                <div className="flex-1">
                                    <p className="font-bold text-base flex items-center gap-2"><HospitalIcon className="w-5 h-5 text-primary" />{hospital.tags.name}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{hospital.tags['addr:full'] || hospital.tags.vicinity || 'Address not available'}</p>
                                    <p className="text-sm font-semibold mt-1">Distance: {hospital.distance} m</p>
                                </div>
                                <div className="flex flex-shrink-0 gap-2 w-full md:w-auto">
                                    <Button onClick={() => handleNavigate(hospital)} className="flex-1">
                                        <Navigation className="mr-2 h-4 w-4"/>
                                        Navigate
                                    </Button>
                                    <Button variant="outline" onClick={() => handleShowOnMap(hospital)} className="flex-1">
                                        <Map className="mr-2 h-4 w-4"/>
                                        Map
                                    </Button>
                                </div>
                            </CardContent>
                            </Card>
                        ))}
                         {filteredHospitals.length === 0 && (
                            <p className="text-center text-muted-foreground py-4">No hospitals match your search.</p>
                        )}
                    </div>
                </div>
            )}
            
             <p className="text-xs text-muted-foreground text-center pt-4">
                Map data &copy; OpenStreetMap contributors. For informational use only.
            </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NearbyHospitalPage;

    