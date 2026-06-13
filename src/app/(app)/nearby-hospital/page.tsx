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
    ExternalLink,
    Loader2
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
  const [isMapReady, setIsMapReady] = useState(false);

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
    try {
        const url = 'https://overpass-api.de/interpreter';
        const resp = await fetch(url, {
          method: 'POST',
          body: query,
          headers: { 'Content-Type': 'text/plain' },
        });
        if (!resp.ok) return null;
        return await resp.json();
    } catch (e) {
        console.error("Overpass API Error:", e);
        return null;
    }
  };
  
  const initMap = useCallback((lat: number, lng: number) => {
    const L = (window as any).L;
    if (!L || mapRef.current) return;

    try {
        const map = L.map('hospital-map', { zoomControl: false }).setView([lat, lng], 14);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap',
        }).addTo(map);
        mapRef.current = map;
        markersLayerRef.current = L.layerGroup().addTo(map);
        setIsMapReady(true);
        
        // Custom User Marker
        const userIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: #2488E8; width: 14px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 15px rgba(36,136,232,0.6);"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });

        if (markersLayerRef.current) {
            L.marker([lat, lng], { icon: userIcon }).bindPopup('You are here').addTo(markersLayerRef.current);
        }
    } catch (e) {
        console.error("Map Init Error:", e);
    }
  }, []);

  const searchNearby = useCallback(async () => {
    const L = (window as any).L;
    if (!L) return;
    
    setIsLoading(true);
    setLocationError(false);
    setStatus('Acquiring location...');

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            userLocationRef.current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            if (!mapRef.current) {
                initMap(pos.coords.latitude, pos.coords.longitude);
            }
            performHospitalSearch();
        },
        (err) => {
            console.error("Geolocation Error:", err);
            setStatus('Location permission required.');
            setLocationError(true);
            setIsLoading(false);
        },
        { timeout: 8000, maximumAge: 0 }
    );
  }, [initMap]);

  const performHospitalSearch = async () => {
    if (!userLocationRef.current) return;
    const L = (window as any).L;
    const radius = parseInt(radiusRef.current || '5000', 10);

    setStatus('Scanning nearby care...');
    setHospitals([]);

    try {
      const q = overpassQuery(userLocationRef.current.lat, userLocationRef.current.lng, radius);
      const data = await fetchOverpass(q);

      if (!data) {
          setStatus('Network busy. Please retry.');
          setIsLoading(false);
          return;
      }

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
            html: `<div style="background-color: #2488E8; width: 14px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 15px rgba(36,136,232,0.6);"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });
        L.marker([userLocationRef.current.lat, userLocationRef.current.lng], { icon: userIcon }).bindPopup('Your Position').addTo(markersLayerRef.current);
      }

      if (elements.length === 0) {
        setStatus(`None found in ${radius / 1000}km.`);
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
              html: `<div style="background-color: #ef4444; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(239,68,68,0.4);"></div>`,
              iconSize: [10, 10]
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
      setStatus(`Found ${processed.length} hospitals.`);
      setIsLoading(false);

    } catch (err) {
      console.error("Search Logic Error:", err);
      setStatus('Unable to scan. Retry.');
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Wait for Leaflet to load from CDN script in layout
    const checkLeaflet = setInterval(() => {
        if ((window as any).L) {
            clearInterval(checkLeaflet);
            searchNearby();
        }
    }, 500);
    return () => clearInterval(checkLeaflet);
  }, [searchNearby]);

  const handleCallEmergency = () => {
    if (confirm('Start Emergency Call to 112?')) {
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
      
      {/* Native App Header */}
      <header className="sticky top-0 z-50 px-4 pt-4 pb-4 bg-white/40 dark:bg-[#1e1f20]/40 backdrop-blur-xl border-b border-white/20 safe-top">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
             <Link href="/dashboard">
              <button className="rounded-full h-11 w-11 bg-white/60 dark:bg-[#3c4043]/60 shadow-sm border border-white/20 shrink-0 flex items-center justify-center active:scale-95 transition-transform">
                <ChevronLeft className="h-6 w-6 text-[#1A365D] dark:text-white" />
              </button>
            </Link>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                  <HospitalIcon className="h-5 w-5 text-primary" />
                  <h1 className="text-lg font-black text-[#1A365D] dark:text-white tracking-tight truncate">Hospital Finder</h1>
              </div>
              <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] truncate">Emergency Location Hub</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={searchNearby} disabled={isLoading} className="rounded-full h-10 w-10 bg-white/60 dark:bg-slate-800/60 border border-white/20 shadow-sm">
                <RotateCcw className={cn("h-4 w-4 text-primary", isLoading && "animate-spin")} />
            </Button>
            <Button onClick={handleCallEmergency} variant="destructive" size="sm" className="rounded-full font-black text-[9px] uppercase tracking-widest px-4 h-9 shadow-lg shadow-red-500/20 active:scale-95">
                <Siren className="w-3.5 h-3.5 mr-1.5" /> SOS
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto w-full px-4 pt-6 space-y-6 flex-1">
        
        {/* Map UI Container */}
        <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl h-80 bg-slate-100 dark:bg-slate-900 group">
            <div id="hospital-map" className="w-full h-full z-10" />
            
            {/* Status Overlay */}
            <div className="absolute top-4 left-4 z-20">
                <div className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full shadow-lg border border-white/20 flex items-center gap-2">
                    {isLoading ? <Loader2 className="w-3 h-3 text-primary animate-spin" /> : <Activity className="w-3 h-3 text-primary" />}
                    <p className="text-[8px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                        {status}
                    </p>
                </div>
            </div>

            {!isMapReady && !locationError && (
                <div className="absolute inset-0 z-30 bg-slate-50/50 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-[10px] font-black uppercase text-slate-400">Loading Map Engine...</p>
                </div>
            )}
        </div>

        {locationError && (
            <Alert className="rounded-[2.2rem] border-none bg-rose-50/50 dark:bg-rose-950/20 p-6 border-dashed border-2 border-rose-100 animate-in slide-in-from-top-2">
                <AlertTriangle className="h-5 w-5 text-rose-500" />
                <AlertTitle className="text-xs font-black uppercase text-rose-700 dark:text-rose-400">Location Missing</AlertTitle>
                <AlertDescription className="text-[11px] font-bold text-rose-600 dark:text-rose-300 leading-relaxed mt-1">
                    Nearby care providers cannot be mapped without GPS. Please enable Location in your settings and tap the scan button.
                </AlertDescription>
                <Button onClick={searchNearby} className="mt-4 w-full rounded-2xl bg-rose-500 text-white h-11 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20">Try Again</Button>
            </Alert>
        )}

        {/* Filters & Results Grid */}
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <Input
                        placeholder="Search found care..."
                        className="rounded-full h-12 pl-12 bg-white/60 dark:bg-slate-900/60 border-none shadow-inner text-sm font-bold"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select defaultValue={radiusRef.current} onValueChange={(val) => { radiusRef.current = val; searchNearby(); }}>
                    <SelectTrigger className="w-[110px] h-12 rounded-full bg-white/60 dark:bg-slate-900/60 border-none font-black text-[10px] uppercase shadow-sm">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                        <SelectItem value="2000">2 KM</SelectItem>
                        <SelectItem value="5000">5 KM</SelectItem>
                        <SelectItem value="10000">10 KM</SelectItem>
                        <SelectItem value="25000">25 KM</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-4 pt-2">
                {filteredHospitals.map(hospital => (
                    <div key={hospital.id} className="p-6 bg-white/80 dark:bg-slate-900/80 rounded-[2.2rem] border border-white dark:border-slate-800 shadow-xl group transition-all active:scale-[0.98]">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <HospitalIcon className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-sm font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight">{hospital.tags.name}</h3>
                                </div>
                                <p className="text-[11px] font-bold text-slate-400 leading-relaxed pl-1">
                                    {hospital.tags['addr:full'] || hospital.tags['addr:street'] || 'Location marked on map'}
                                </p>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-100/50 dark:border-emerald-800">
                                    <Navigation className="w-2.5 h-2.5 text-emerald-500" />
                                    <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{hospital.distance} Meters Away</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Button onClick={() => handleNavigate(hospital)} className="rounded-2xl h-11 bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90">
                                <Navigation className="w-3.5 h-3.5 mr-2" /> Route
                            </Button>
                            <Button variant="outline" onClick={() => handleShowOnMap(hospital)} className="rounded-2xl h-11 border-primary/20 text-primary font-black uppercase text-[10px] tracking-widest bg-white/40 dark:bg-slate-800/40 backdrop-blur-md">
                                <LocateFixed className="w-3.5 h-3.5 mr-2" /> Focus
                            </Button>
                        </div>
                    </div>
                ))}
                
                {hospitals.length > 0 && filteredHospitals.length === 0 && (
                    <div className="py-12 text-center space-y-3 animate-in fade-in">
                         <div className="h-14 w-14 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <Search className="w-6 h-6 text-slate-300" />
                         </div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No matching hospitals found in list</p>
                    </div>
                )}
                
                {hospitals.length === 0 && !isLoading && !locationError && (
                    <div className="py-20 text-center space-y-6 animate-in zoom-in-95 duration-500">
                        <div className="h-20 w-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner border border-blue-100/50">
                            <HospitalIcon className="w-10 h-10 text-primary opacity-40" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Ready to scan area</p>
                            <p className="text-[9px] text-slate-300 font-bold max-w-xs mx-auto">We use OpenStreetMap data to find clinical facilities around your GPS coordinates.</p>
                        </div>
                        <Button onClick={searchNearby} className="rounded-full px-12 h-14 bg-primary text-white font-black uppercase text-[11px] tracking-widest shadow-xl shadow-primary/30 active:scale-95 transition-all">
                            Start Radar Scan
                        </Button>
                    </div>
                )}
            </div>
        </div>

        <Alert className="rounded-[2.5rem] border-none bg-blue-50/50 dark:bg-blue-900/10 p-8 border-dashed border-2 border-blue-100 dark:border-blue-800">
            <div className="flex flex-col items-center gap-4 text-center">
                <ShieldAlert className="h-8 w-8 text-primary opacity-40" />
                <p className="text-[10px] font-black uppercase text-blue-500/80 tracking-[0.3em] leading-relaxed">
                    Map data provided by OpenStreetMap Contributors. In critical medical emergencies, always call 112 immediately.
                </p>
            </div>
        </Alert>

      </main>
    </div>
  );
};

export default NearbyHospitalPage;
