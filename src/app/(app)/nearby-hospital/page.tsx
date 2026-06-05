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
import { 
    LocateFixed, 
    Siren, 
    Map as MapIcon, 
    Navigation, 
    AlertTriangle, 
    Hospital as HospitalIcon, 
    Search,
    ChevronLeft,
    Activity,
    RotateCcw,
    ShieldAlert,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";

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
  const [isLoading, setIsLoading] = useState(false);

  const mapRef = useRef<any>(null); 
  const markersLayerRef = useRef<any>(null); 
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
    const url = 'https://overpass-api.de/interpreter';
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

    const map = L.map('hospital-map', { zoomControl: false }).setView([lat, lng], 14);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    mapRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);
    
    // Custom User Marker
    const userIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #2488E8; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(36,136,232,0.5);"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    });

    if (markersLayerRef.current) {
        L.marker([lat, lng], { icon: userIcon }).bindPopup('Your Location').addTo(markersLayerRef.current);
    }
  }, []);

  const searchNearby = useCallback(async () => {
    const L = (window as any).L;
    if (!L) return;
    
    setIsLoading(true);
    setLocationError(false);

    // Prompt for location if not available
    if (!userLocationRef.current) {
        setStatus('Acquiring your location...');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                userLocationRef.current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                initMap(pos.coords.latitude, pos.coords.longitude);
                performHospitalSearch();
            },
            (err) => {
                setStatus('Location permission denied.');
                setLocationError(true);
                setIsLoading(false);
            },
            { timeout: 10000, maximumAge: 0 }
        );
        return;
    }

    performHospitalSearch();
  }, []);

  const performHospitalSearch = async () => {
    if (!userLocationRef.current) return;
    const L = (window as any).L;
    const radius = parseInt(radiusRef.current || '5000', 10);

    setStatus('Searching nearby emergency care...');
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
        // Re-add user marker
        const userIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: #2488E8; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(36,136,232,0.5);"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });
        L.marker([userLocationRef.current.lat, userLocationRef.current.lng], { icon: userIcon }).bindPopup('You').addTo(markersLayerRef.current);
      }

      if (elements.length === 0) {
        setStatus(`No hospitals found in ${radius / 1000}km.`);
        setIsLoading(false);
        return;
      }

      const processed: Hospital[] = elements.map((e: any) => ({ 
          ...e, 
          distance: Math.round(haversineDist(userLocationRef.current!.lat, userLocationRef.current!.lng, e.lat, e.lon)) 
      })).sort((a: Hospital, b: Hospital) => a.distance - b.distance);
      
      if (markersLayerRef.current) {
        processed.forEach((p) => {
          const name = p.tags.name || 'Hospital';
          const hospitalIcon = L.divIcon({
              className: 'h-marker',
              html: `<div style="background-color: #ef4444; width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid white;"></div>`,
              iconSize: [8, 8]
          });
          L.marker([p.lat, p.lon], { icon: hospitalIcon }).bindPopup(`<strong>${name}</strong><br/>${p.distance}m away`).addTo(markersLayerRef.current);
        });
      }

      if (mapRef.current && markersLayerRef.current.getLayers().length > 1) {
          try {
            const group = new L.featureGroup(markersLayerRef.current.getLayers());
            mapRef.current.fitBounds(group.getBounds().pad(0.1));
          } catch(e) {}
      }

      setHospitals(processed);
      setStatus(`Found ${processed.length} hospitals nearby.`);
      setIsLoading(false);

    } catch (err) {
      console.error(err);
      setStatus('Network error. Retrying...');
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
        if (typeof window !== 'undefined' && (window as any).L) {
            searchNearby();
        }
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchNearby]);

  const handleCallEmergency = () => {
    if (confirm('Initiate Emergency Call to 112?')) {
      window.location.href = 'tel:112';
    }
  };
  
  const handleNavigate = (hospital: Hospital) => {
     window.open(`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lon}`, '_blank');
  }

  const handleShowOnMap = (hospital: Hospital) => {
      if(mapRef.current) {
        mapRef.current.setView([hospital.lat, hospital.lon], 16);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  }
  
  const filteredHospitals = hospitals.filter(h =>
    (h.tags.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full pb-32 animate-in fade-in duration-700 font-body flex flex-col" style={{ background: 'var(--dashboard-bg)', backgroundAttachment: 'fixed' }}>
      
      {/* Premium Header */}
      <header className="sticky top-0 z-50 px-4 pt-4 pb-4 bg-white/40 dark:bg-[#1e1f20]/40 backdrop-blur-xl border-b border-white/20 safe-top">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
             <Link href="/dashboard">
              <button className="rounded-full h-11 w-11 bg-white/60 dark:bg-[#3c4043]/60 shadow-sm border border-white/20 shrink-0 flex items-center justify-center">
                <ChevronLeft className="h-6 w-6 text-[#1A365D] dark:text-white" />
              </button>
            </Link>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                  <HospitalIcon className="h-5 w-5 text-primary" />
                  <h1 className="text-lg font-black text-[#1A365D] dark:text-white tracking-tight truncate">Hospital Finder</h1>
              </div>
              <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] truncate">Emergency SOS Locator</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={searchNearby} disabled={isLoading} className="rounded-full h-10 w-10 bg-white/60 dark:bg-slate-800/60 border border-white/20 shadow-sm">
                <RotateCcw className={cn("h-4 w-4 text-primary", isLoading && "animate-spin")} />
            </Button>
            <Button onClick={handleCallEmergency} variant="destructive" size="sm" className="rounded-full font-black text-[9px] uppercase tracking-widest px-4 h-9 shadow-lg shadow-red-500/20">
                <Siren className="w-3.5 h-3.5 mr-1.5" /> SOS
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto w-full px-4 pt-6 space-y-6 flex-1">
        
        {/* Map Container - Sleek Border */}
        <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl h-80 bg-slate-100">
            <div id="hospital-map" className="w-full h-full z-10" />
            <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-center">
                <div className="px-4 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full shadow-lg border border-white/20">
                    <p className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-3 h-3" /> {status}
                    </p>
                </div>
            </div>
        </div>

        {locationError && (
            <Alert className="rounded-[2.2rem] border-none bg-rose-50/50 dark:bg-rose-950/20 p-6 border-dashed border-2 border-rose-100 animate-in slide-in-from-top-2">
                <AlertTriangle className="h-5 w-5 text-rose-500" />
                <AlertTitle className="text-xs font-black uppercase text-rose-700 dark:text-rose-400">Location Access Required</AlertTitle>
                <AlertDescription className="text-[11px] font-bold text-rose-600 dark:text-rose-300 leading-relaxed mt-1">
                    Nearby hospitals cannot be found without GPS. Please enable Location in your device settings and tap Refresh.
                </AlertDescription>
                <Button onClick={searchNearby} className="mt-4 w-full rounded-2xl bg-rose-500 text-white h-10 text-[10px] font-black uppercase">Try Again</Button>
            </Alert>
        )}

        {/* Search & Results */}
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <Input
                        placeholder="Search found hospitals..."
                        className="rounded-full h-12 pl-12 bg-white/60 dark:bg-slate-900/60 border-none shadow-inner text-sm font-bold"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select defaultValue={radiusRef.current} onValueChange={(val) => { radiusRef.current = val; searchNearby(); }}>
                    <SelectTrigger className="w-[100px] h-12 rounded-full bg-white/60 dark:bg-slate-900/60 border-none font-black text-[10px] uppercase shadow-sm">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                        <SelectItem value="2000">2 km</SelectItem>
                        <SelectItem value="5000">5 km</SelectItem>
                        <SelectItem value="10000">10 km</SelectItem>
                        <SelectItem value="20000">20 km</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-4">
                {filteredHospitals.map(hospital => (
                    <div key={hospital.id} className="p-6 bg-white/80 dark:bg-slate-900/80 rounded-[2.2rem] border border-white dark:border-slate-800 shadow-xl group transition-all active:scale-[0.98]">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <HospitalIcon className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-sm font-black text-[#1A365D] dark:text-white uppercase tracking-tight">{hospital.tags.name}</h3>
                                </div>
                                <p className="text-[11px] font-bold text-slate-400 leading-relaxed pl-1">
                                    {hospital.tags['addr:full'] || hospital.tags['addr:street'] || 'Address Available on Map'}
                                </p>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/20 rounded-full border border-emerald-100 dark:border-emerald-800">
                                    <Navigation className="w-2.5 h-2.5 text-emerald-500" />
                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{hospital.distance} Meters Away</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Button onClick={() => handleNavigate(hospital)} className="rounded-2xl h-11 bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">
                                <Navigation className="w-3.5 h-3.5 mr-2" /> Route
                            </Button>
                            <Button variant="outline" onClick={() => handleShowOnMap(hospital)} className="rounded-2xl h-11 border-primary/20 text-primary font-black uppercase text-[10px] tracking-widest bg-white dark:bg-slate-800">
                                <LocateFixed className="w-3.5 h-3.5 mr-2" /> Focus
                            </Button>
                        </div>
                    </div>
                ))}
                
                {hospitals.length > 0 && filteredHospitals.length === 0 && (
                    <div className="py-12 text-center space-y-3">
                         <div className="h-12 w-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                            <Search className="w-5 h-5 text-slate-300" />
                         </div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No matching results found</p>
                    </div>
                )}
                
                {hospitals.length === 0 && !isLoading && !locationError && (
                    <div className="py-20 text-center space-y-4">
                        <div className="h-16 w-16 bg-blue-50 dark:bg-blue-900/20 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-inner">
                            <LocateFixed className="w-8 h-8 text-primary opacity-40" />
                        </div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Ready to find care</p>
                        <Button onClick={searchNearby} className="rounded-full px-8 h-12 bg-primary/10 text-primary border-none font-black uppercase text-[10px] tracking-widest">
                            Scan Area
                        </Button>
                    </div>
                )}
            </div>
        </div>

        <Alert className="rounded-[2.5rem] border-none bg-blue-50/50 dark:bg-blue-900/10 p-8 border-dashed border-2 border-blue-100 dark:border-blue-800">
            <div className="flex flex-col items-center gap-4 text-center">
                <ShieldAlert className="h-8 w-8 text-primary opacity-40" />
                <p className="text-[10px] font-black uppercase text-blue-500/80 tracking-[0.3em] leading-relaxed">
                    Map data provided by OpenStreetMap. In critical emergencies, always prioritize calling 112 over browsing digital maps.
                </p>
            </div>
        </Alert>

      </main>
    </div>
  );
};

export default NearbyHospitalPage;
