
'use client';

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
    Siren, 
    Navigation, 
    Hospital as HospitalIcon, 
    ChevronLeft,
    RotateCcw,
    ShieldAlert,
    Loader2,
    MapPin,
    Pill,
    Droplet,
    Stethoscope,
    Activity,
    LocateFixed,
    Compass,
    Menu,
    Map as MapIcon,
    Search,
    MapPinOff,
    Target,
    X
} from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';
import { SidebarTrigger } from '@/components/ui/sidebar';

// --- CONSTANTS ---
type MedicalMode = 'hospital' | 'pharmacy' | 'blood_bank' | 'emergency' | 'doctors';

const MODE_CONFIG: Record<MedicalMode, { label: string; icon: any; tag: string; color: string; bg: string }> = {
  hospital: { label: 'Hospitals', icon: HospitalIcon, tag: '[amenity~"hospital|clinic"]', color: 'text-blue-500', bg: 'bg-blue-50/50' },
  pharmacy: { label: 'Pharmacies', icon: Pill, tag: '[amenity=pharmacy]', color: 'text-emerald-500', bg: 'bg-emerald-50/50' },
  blood_bank: { label: 'Blood Banks', icon: Droplet, tag: '[amenity=blood_bank]', color: 'text-rose-500', bg: 'bg-rose-50/50' },
  emergency: { label: 'Emergency', icon: Siren, tag: '[amenity~"ambulance_station|emergency_service"]', color: 'text-red-500', bg: 'bg-red-50/50' },
  doctors: { label: 'Specialists', icon: Stethoscope, tag: '[amenity~"doctors|dentist"]', color: 'text-purple-500', bg: 'bg-purple-50/50' },
};

// --- DYNAMIC MAP COMPONENT ---
const MapComponent = dynamic(() => Promise.resolve(({ center, elements, userIcon, poiIcon, openInMaps }: any) => {
  const { MapContainer, TileLayer, Marker, Popup, useMap } = require('react-leaflet');
  
  function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
      if (center && map) {
          map.setView(center, 15);
          map.invalidateSize();
      }
    }, [center, map]);
    return null;
  }

  return (
    <MapContainer 
      center={center} 
      zoom={15} 
      className="w-full h-full" 
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeView center={center} />
      <Marker position={center} icon={userIcon} />
      {elements?.map((el: any) => {
        const pos: [number, number] = [el.lat || el.center?.lat, el.lon || el.center?.lon];
        if (!pos[0] || !pos[1]) return null;
        return (
          <Marker key={el.id} position={pos} icon={poiIcon}>
            <Popup className="medical-popup">
              <div className="p-2 space-y-2 min-w-[150px]">
                <p className="font-black text-[11px] uppercase text-primary leading-tight">{el.tags?.name || "Medical Site"}</p>
                <Button size="sm" className="w-full h-8 text-[9px] uppercase font-black rounded-lg bg-primary" onClick={() => openInMaps(el)}>
                    <Navigation className="w-3 h-3 mr-1" /> Route
                </Button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}), { ssr: false });

// --- MAIN PAGE ---
export default function NearbyHospitalPage() {
  const [elements, setElements] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [activeMode, setActiveMode] = useState<MedicalMode>('hospital');
  const [radius, setRadius] = useState<string>('5000');
  const [status, setStatus] = useState('Standby');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const [L, setL] = useState<any>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const leaflet = require('leaflet');
        setL(leaflet);
    }
    syncGPS();
  }, []);

  const icons = useMemo(() => {
    if (!L) return { user: null, poi: null };
    const user = L.divIcon({
      className: 'user-marker',
      html: `<div class="relative h-10 w-10 flex items-center justify-center"><div class="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div><div class="h-5 w-5 bg-primary rounded-full border-4 border-white shadow-2xl z-10"></div></div>`,
      iconSize: [40, 40], iconAnchor: [20, 20],
    });
    const poi = L.divIcon({
      className: 'poi-marker',
      html: `<div class="flex items-center justify-center transition-transform hover:scale-110 drop-shadow-xl"><svg width="34" height="42" viewBox="0 0 34 42" fill="none"><path d="M17 0C7.611 0 0 7.611 0 17C0 29.75 17 42 17 42C17 42 34 29.75 34 17C34 7.611 26.388 0 17 0Z" fill="#ef4444"/><circle cx="17" cy="17" r="7" fill="white"/><path d="M17 13V21M14 17H20" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/></svg></div>`,
      iconSize: [34, 42], iconAnchor: [17, 42], popupAnchor: [0, -42],
    });
    return { user, poi };
  }, [L]);

  const fetchOSMNodes = useCallback(async (lat: number, lon: number, mode: MedicalMode, rad: string) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    setStatus(`Radar Scanning...`);
    
    try {
      const tag = MODE_CONFIG[mode].tag;
      const query = `[out:json][timeout:30];(node(around:${rad},${lat},${lon})${tag};way(around:${rad},${lat},${lon})${tag};relation(around:${rad},${lat},${lon})${tag};);out center;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Radar failed");
      
      const data = await response.json();
      const results = (data?.elements || []).map((el: any) => {
        const elLat = el.lat || el.center?.lat;
        const elLon = el.lon || el.center?.lon;
        
        // Accurate Distance
        const dist = (function(lat1: number, lon1: number, lat2: number, lon2: number) {
          const R = 6371; 
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
          return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        })(lat, lon, elLat, elLon);

        const addr = [
          el.tags?.["addr:street"], 
          el.tags?.["addr:suburb"], 
          el.tags?.["addr:neighbourhood"],
          el.tags?.["addr:city"]
        ].filter(Boolean).join(', ');

        return { ...el, calculatedDist: dist, derivedAddress: addr || "Address Unknown" };
      }).sort((a: any, b: any) => a.calculatedDist - b.calculatedDist);

      setElements(results);
      setStatus(results.length > 0 ? `Detected ${results.length} Sites` : "Radar Clear");
    } catch (err) {
      setStatus("Radar Error");
      toast({ variant: 'destructive', title: 'Connection weak, try again.' });
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [toast]);

  const syncGPS = useCallback(() => {
    setIsLoading(true);
    setStatus('Linking GPS...');
    setLocationDenied(false);

    if (!navigator.geolocation) {
        setStatus('GPS Error');
        setIsLoading(false);
        return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setLocationDenied(false);
        setStatus('GPS Active');
        fetchOSMNodes(coords[0], coords[1], activeMode, radius);
      },
      (err) => {
        console.warn("GPS Fail:", err);
        setIsLoading(false);
        setLocationDenied(true);
        setStatus('GPS Offline');
        setUserLocation(null);
        toast({ title: 'GPS Failed', description: "Switch to manual search above." });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, [activeMode, radius, fetchOSMNodes, toast]);

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setStatus('Searching Map...');
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
        const data = await res.json();
        if (data && data.length > 0) {
            const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            setUserLocation(coords);
            setLocationDenied(false);
            setStatus(`Found: ${searchQuery}`);
            fetchOSMNodes(coords[0], coords[1], activeMode, radius);
        } else {
            toast({ variant: 'destructive', title: 'Place Not Found' });
        }
    } catch (e) {
        toast({ variant: 'destructive', title: 'Search Link Failed' });
    } finally {
        setIsSearching(false);
    }
  };

  const openInMaps = (el: any) => {
    const lat = el.lat || el.center?.lat;
    const lon = el.lon || el.center?.lon;
    const name = el.tags?.name || "Hospital";
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}+${lat},${lon}`, '_blank');
  };

  return (
    <div className="fixed inset-0 h-[100dvh] w-full flex flex-col bg-white dark:bg-[#020617] overflow-hidden font-body safe-top">
      
      {/* 1. COMPACT SEARCH HEADER */}
      <header className="shrink-0 pt-4 pb-2 px-4 flex flex-col gap-3 z-50">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Link href="/dashboard">
                    <div className="h-10 w-10 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                        <ChevronLeft className="h-6 w-6 text-[#1A365D] dark:text-slate-100" />
                    </div>
                </Link>
                <div className="space-y-0">
                    <h1 className="text-lg font-black text-[#1A365D] dark:text-white uppercase leading-none tracking-tighter">Medical Radar</h1>
                    <p className={cn("text-[8px] font-black uppercase tracking-widest", status === 'GPS Offline' ? 'text-red-500' : 'text-slate-400')}>{status}</p>
                </div>
            </div>
            <SidebarTrigger className="h-10 w-10 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                <Menu className="h-5 w-5 text-primary" />
            </SidebarTrigger>
        </div>

        {/* Manual Search Bar - Fallback for No GPS */}
        <form onSubmit={handleManualSearch} className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
            <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter city or area if GPS fails..." 
                className="h-11 pl-11 pr-24 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none shadow-inner font-bold text-xs"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && <button type="button" onClick={() => setSearchQuery('')} className="p-2 text-slate-400"><X className="w-3 h-3"/></button>}
                <Button type="submit" disabled={isSearching} className="h-9 rounded-xl bg-[#1A365D] dark:bg-primary text-white font-black text-[9px] uppercase px-4 border-none">
                    {isSearching ? <Loader2 className="w-3 h-3 animate-spin"/> : 'Search'}
                </Button>
            </div>
        </form>
      </header>

      {/* 2. MODE SELECTOR */}
      <div className="shrink-0 py-1">
          <div className="flex items-center gap-2 overflow-x-auto px-4 scrollbar-hide no-scrollbar">
            {(Object.keys(MODE_CONFIG) as MedicalMode[]).map((m) => {
              const cfg = MODE_CONFIG[m];
              const isActive = activeMode === m;
              return (
                <button 
                  key={m} 
                  onClick={() => { setActiveMode(m); if(userLocation) fetchOSMNodes(userLocation[0], userLocation[1], m, radius); }} 
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap text-[9px] font-black uppercase tracking-widest shrink-0 border",
                    isActive ? "bg-primary text-white border-primary shadow-md" : "bg-white dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800"
                  )}
                >
                  <cfg.icon className="w-3 h-3" /> {cfg.label}
                </button>
              );
            })}
          </div>
      </div>

      {/* 3. RADAR MAP SCREEN (38vh) */}
      <div className="shrink-0 px-4 w-full h-[38vh] relative z-10 mt-1">
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 relative bg-slate-50 dark:bg-slate-900">
                {userLocation && icons.user ? (
                    <MapComponent center={userLocation} elements={elements} userIcon={icons.user} poiIcon={icons.poi} openInMaps={openInMaps} />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-6 text-center p-8 bg-slate-50 dark:bg-slate-900/50">
                        {locationDenied ? (
                            <>
                                <div className="h-20 w-20 bg-rose-50 dark:bg-rose-950/20 rounded-[2rem] flex items-center justify-center text-rose-500 shadow-inner animate-pulse">
                                    <MapPinOff className="w-10 h-10" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black uppercase text-[#1A365D] dark:text-slate-200">Signal Patch Failed</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed max-w-[220px] mx-auto">GPS Signal blocked. Use manual search above or retry GPS below.</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={syncGPS} className="rounded-full h-11 px-8 font-black uppercase text-[10px] bg-primary shadow-xl">Retry GPS</Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-6">
                                <div className="relative">
                                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                                    <Target className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                                </div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Calibrating Radar...</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
      </div>

      {/* 4. FLOATING RADAR CONTROLS */}
      <div className="shrink-0 px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-0.5 px-3 rounded-full shadow-lg border border-slate-100 dark:border-slate-800">
                <LocateFixed className="w-3.5 h-3.5 text-primary" />
                <Select value={radius} onValueChange={(val) => { setRadius(val); if(userLocation) fetchOSMNodes(userLocation[0], userLocation[1], activeMode, val); }}>
                    <SelectTrigger className="h-8 w-28 bg-transparent border-none font-black text-[9px] uppercase shadow-none focus:ring-0">
                        <SelectValue placeholder="Range" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                        <SelectItem value="2000" className="font-bold text-[9px] uppercase">2 KM Radius</SelectItem>
                        <SelectItem value="5000" className="font-bold text-[9px] uppercase">5 KM Radius</SelectItem>
                        <SelectItem value="10000" className="font-bold text-[9px] uppercase">10 KM Radius</SelectItem>
                        <SelectItem value="25000" className="font-bold text-[9px] uppercase">25 KM Radius</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button variant="outline" size="icon" onClick={syncGPS} disabled={isLoading} className="h-10 w-10 rounded-full bg-white dark:bg-slate-900 shadow-xl border-slate-100 dark:border-slate-800">
                <RotateCcw className={cn("h-4.5 w-4.5 text-primary", isLoading && "animate-spin")} />
            </Button>
      </div>

      {/* 5. BOTTOM LIST */}
      <div className="flex-1 min-h-0 bg-white dark:bg-slate-950 rounded-t-[3rem] shadow-[0_-25px_50px_rgba(0,0,0,0.1)] relative z-20 flex flex-col border-t border-slate-50 dark:border-slate-900 transition-all duration-700 animate-in slide-in-from-bottom-5">
            <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto mt-4 mb-2 shrink-0" />

            <div className="px-7 pb-3 shrink-0 flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-primary" /> Radar Results
                </h3>
                {elements.length > 0 && <Badge className="bg-primary/5 text-primary text-[9px] font-black border-none px-3 py-1 rounded-lg">{elements.length} Found</Badge>}
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-32 space-y-3 no-scrollbar">
                {isLoading ? (
                    <div className="space-y-3 pt-1">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-24 rounded-3xl animate-pulse bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800" />
                        ))}
                    </div>
                ) : elements.length > 0 ? (
                    <div className="space-y-3 pt-1">
                        {elements.map((el) => {
                            const cfg = MODE_CONFIG[activeMode];
                            return (
                                <div key={el.id} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group active:scale-[0.98]">
                                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner", cfg.bg, cfg.color)}>
                                        <cfg.icon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1 min-w-0 pr-1">
                                        <h4 className="text-[13px] font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight truncate leading-tight mb-1">
                                            {el.tags?.name || "Medical Site"}
                                        </h4>
                                        <p className="text-[9px] font-bold truncate uppercase text-slate-400 mb-3">
                                            {el.derivedAddress}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full">
                                                <Activity className="h-2.5 w-2.5 text-primary" />
                                                <span className="text-[8px] font-black text-primary uppercase">{el.calculatedDist?.toFixed(2)} KM Away</span>
                                            </div>
                                            <Button onClick={() => openInMaps(el)} size="sm" className="h-8 rounded-xl bg-[#1A365D] text-white px-5 text-[9px] font-black uppercase tracking-widest border-none shadow-lg active:scale-95 transition-all">
                                                <Navigation className="h-3 w-3 mr-1.5" /> Route
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-24 text-center space-y-5">
                        <div className="h-20 w-20 bg-slate-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto opacity-30">
                            <Activity className="h-10 w-10 text-slate-400" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">
                                {userLocation ? "No Medical Sites Found" : "Radar Signal Standby"}
                            </p>
                            {!userLocation && (
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Search by city name above if signal is low.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .medical-popup .leaflet-popup-content-wrapper {
            border-radius: 20px;
            padding: 4px;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3);
            border: 2px solid white;
        }
        .medical-popup .leaflet-popup-tip { display: none; }
      `}</style>
    </div>
  );
}

