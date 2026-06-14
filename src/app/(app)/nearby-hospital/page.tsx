'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    AlertTriangle, 
    Hospital as HospitalIcon, 
    ChevronLeft,
    RotateCcw,
    ShieldAlert,
    Loader2,
    MapPin,
    PhoneCall,
    Pill,
    Droplet,
    Stethoscope,
    Activity,
    Clock,
    Search,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// --- CONSTANTS & COORDINATES ---

const VAPI_COORDINATES: [number, number] = [20.3712, 72.9102];

type MedicalMode = 'hospital' | 'pharmacy' | 'blood_bank' | 'emergency' | 'doctors';

const MODE_CONFIG: Record<MedicalMode, { label: string; icon: any; tag: string; color: string }> = {
  hospital: { label: 'Hospitals', icon: HospitalIcon, tag: '[amenity~"hospital|clinic"]', color: 'text-blue-500' },
  pharmacy: { label: 'Pharmacies', icon: Pill, tag: '[amenity=pharmacy]', color: 'text-emerald-500' },
  blood_bank: { label: 'Blood Banks', icon: Droplet, tag: '[amenity=blood_bank]', color: 'text-rose-500' },
  emergency: { label: 'Emergency', icon: Siren, tag: '[amenity~"ambulance_station|emergency_service"]', color: 'text-red-500' },
  doctors: { label: 'Specialists', icon: Stethoscope, tag: '[amenity~"doctors|dentist"]', color: 'text-purple-500' },
};

// Precise Distance Calculator
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// --- DYNAMIC MAP COMPONENT ---

const MapComponent = dynamic(() => Promise.resolve(({ center, elements, userIcon, poiIcon, openInMaps }: any) => {
  const { MapContainer, TileLayer, Marker, Popup, useMap } = require('react-leaflet');
  
  function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
      if (center && map) {
          map.setView(center, 14);
      }
    }, [center, map]);
    return null;
  }

  return (
    <MapContainer center={center} zoom={14} className="w-full h-full" zoomControl={false}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; OSM'
      />
      <ChangeView center={center} />
      
      <Marker position={center} icon={userIcon}>
        <Popup>
            <div className="text-center p-1">
                <p className="font-black text-[10px] uppercase text-primary">Your Location</p>
            </div>
        </Popup>
      </Marker>
      
      {elements?.map((el: any) => {
        const pos: [number, number] = [el.lat || el.center?.lat, el.lon || el.center?.lon];
        if (!pos[0] || !pos[1]) return null;
        return (
          <Marker key={el.id} position={pos} icon={poiIcon}>
            <Popup className="medical-popup">
              <div className="p-2 space-y-2 min-w-[140px]">
                <p className="font-black text-[11px] uppercase text-slate-800 leading-tight border-b pb-1 border-slate-100">{el.tags?.name || "Medical Node"}</p>
                <div className="flex flex-col gap-1.5">
                   <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">{el.calculatedDist?.toFixed(1)} KM Away</p>
                   <Button size="sm" className="w-full h-8 text-[9px] uppercase font-black rounded-xl shadow-lg shadow-primary/10" onClick={() => openInMaps(el)}>Get Route</Button>
                </div>
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
  const [activeMode, setActiveMode] = useState<MedicalMode>('hospital');
  const [radius, setRadius] = useState<string>('5000');
  const [status, setStatus] = useState('Initializing Radar...');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [L, setL] = useState<any>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const leaflet = require('leaflet');
        setL(leaflet);
    }
  }, []);

  // --- SVG BASED CUSTOM ICONS ---
  const icons = useMemo(() => {
    if (!L) return { user: null, poi: null };
    
    // Blue Radar Dot for User
    const user = L.divIcon({
      className: 'user-radar-marker',
      html: `
        <div class="relative flex items-center justify-center h-8 w-8">
          <div class="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
          <div class="h-4 w-4 bg-blue-600 rounded-full border-2 border-white shadow-2xl z-10"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    // High-Fidelity Medical Pin for POIs
    const poi = L.divIcon({
      className: 'medical-pin-marker',
      html: `
        <div class="flex items-center justify-center">
            <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 0C7.61116 0 0 7.61116 0 17C0 29.75 17 42 17 42C17 42 34 29.75 34 17C34 7.61116 26.3888 0 17 0Z" fill="#EF4444"/>
                <circle cx="17" cy="17" r="7" fill="white"/>
                <path d="M17 13V21M14 17H20" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </div>
      `,
      iconSize: [34, 42],
      iconAnchor: [17, 42],
      popupAnchor: [0, -42],
    });

    return { user, poi };
  }, [L]);

  const fetchOSMNodes = useCallback(async (lat: number, lon: number, mode: MedicalMode, rad: string) => {
    setIsLoading(true);
    setError(null);
    setStatus(`Scanning ${MODE_CONFIG[mode].label}...`);

    try {
      const tag = MODE_CONFIG[mode].tag;
      const query = `[out:json][timeout:30];(node(around:${rad},${lat},${lon})${tag};way(around:${rad},${lat},${lon})${tag};relation(around:${rad},${lat},${lon})${tag};);out center;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Connection unstable.");

      const data = await response.json();
      const results = (data?.elements || []).map((el: any) => ({
        ...el,
        calculatedDist: calculateDistance(lat, lon, el.lat || el.center?.lat, el.lon || el.center?.lon)
      })).sort((a: any, b: any) => a.calculatedDist - b.calculatedDist);

      setElements(results);
      setStatus(results.length === 0 ? "Empty range." : `${results.length} Nodes Discovered.`);
    } catch (err: any) {
      setError(err.message);
      toast({ variant: "destructive", title: "Radar Failure", description: "Map synchronization failed." });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const syncGPS = useCallback(() => {
    setIsLoading(true);
    setStatus('Linking GPS...');
    
    if (!navigator.geolocation) {
        setUserLocation(VAPI_COORDINATES);
        fetchOSMNodes(VAPI_COORDINATES[0], VAPI_COORDINATES[1], activeMode, radius);
        return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        fetchOSMNodes(coords[0], coords[1], activeMode, radius);
      },
      () => {
        setUserLocation(VAPI_COORDINATES);
        fetchOSMNodes(VAPI_COORDINATES[0], VAPI_COORDINATES[1], activeMode, radius);
        toast({ title: "Signal Lost", description: "Using Core Vapi Hub location." });
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, [activeMode, radius, fetchOSMNodes, toast]);

  useEffect(() => { syncGPS(); }, [activeMode, radius]);

  const openInMaps = (el: any) => {
    const lat = el.lat || el.center?.lat;
    const lon = el.lon || el.center?.lon;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-body safe-top relative">
      
      {/* Immersive Medical Header */}
      <header className="z-[1000] px-5 py-4 bg-white/90 dark:bg-[#1e1f20]/90 backdrop-blur-3xl border-b border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full h-11 w-11 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                <ChevronLeft className="h-6 w-6 text-[#1A365D]" />
            </Button>
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-xl font-black text-[#1A365D] dark:text-white uppercase leading-none tracking-tighter">Medical Radar</h1>
            <div className="flex items-center gap-2">
                <div className={cn("h-1.5 w-1.5 rounded-full", isLoading ? "bg-blue-400 animate-pulse" : "bg-emerald-500")} />
                <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">{status}</p>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={syncGPS} disabled={isLoading} className="rounded-full h-11 w-11 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm active:rotate-180 transition-transform">
            <RotateCcw className={cn("h-4.5 w-4.5 text-primary", isLoading && "animate-spin")} />
        </Button>
      </header>

      {/* Mode Navigation Bar */}
      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl py-3 px-4 border-b border-slate-100 dark:border-slate-800 z-[1001] flex gap-2.5 overflow-x-auto scrollbar-hide shrink-0">
        {(Object.keys(MODE_CONFIG) as MedicalMode[]).map((m) => {
          const cfg = MODE_CONFIG[m];
          const isActive = activeMode === m;
          return (
            <button key={m} onClick={() => setActiveMode(m)} className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full transition-all whitespace-nowrap text-[10px] font-black uppercase tracking-widest",
              isActive ? "bg-primary text-white shadow-lg scale-105" : "bg-white/80 dark:bg-slate-800/80 text-slate-500 border border-white/20"
            )}>
              <cfg.icon className={cn("w-3.5 h-3.5", isActive ? "text-white" : cfg.color)} /> {cfg.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 flex flex-col min-h-0 relative">
        
        {/* Upper Screen: Live Map */}
        <div className="relative w-full h-[35vh] z-10 border-b border-slate-100 dark:border-slate-800 shrink-0 shadow-inner">
            {userLocation && icons.user ? (
                <MapComponent center={userLocation} elements={elements} userIcon={icons.user} poiIcon={icons.poi} openInMaps={openInMaps} />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 gap-5">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Locking Satellite Link...</p>
                </div>
            )}
            
            <div className="absolute bottom-6 right-5 z-[1000]">
                <Select value={radius} onValueChange={setRadius}>
                    <SelectTrigger className="h-11 w-40 rounded-[1.2rem] bg-white/95 dark:bg-slate-900/95 border-none font-black text-[10px] uppercase shadow-2xl backdrop-blur-xl ring-4 ring-primary/5">
                        <Navigation className="w-4 h-4 mr-2 text-primary" />
                        <SelectValue placeholder="Range" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl backdrop-blur-3xl">
                        <SelectItem value="2000" className="font-bold text-[10px] uppercase">2 KM Scan</SelectItem>
                        <SelectItem value="5000" className="font-bold text-[10px] uppercase">5 KM Scan</SelectItem>
                        <SelectItem value="10000" className="font-bold text-[10px] uppercase">10 KM Scan</SelectItem>
                        <SelectItem value="20000" className="font-bold text-[10px] uppercase">20 KM Scan</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Lower Screen: Professional Results List */}
        <div className="flex-1 bg-white dark:bg-slate-950 rounded-t-[3rem] -mt-6 z-20 shadow-[0_-15px_50px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden border-t border-slate-50 dark:border-slate-800">
            
            <div className="px-8 pt-8 pb-3 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="h-5 w-1.5 bg-primary rounded-full" />
                    <h3 className="text-xs font-black uppercase text-[#1A365D] dark:text-slate-100 tracking-[0.15em]">
                        Nearby {MODE_CONFIG[activeMode].label}
                    </h3>
                </div>
                <Badge className="bg-primary/5 text-primary border-primary/20 text-[9px] font-black uppercase px-4 py-1.5 rounded-full">
                    {elements.length} Results
                </Badge>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-32 scrollbar-hide">
                {isLoading ? (
                    <div className="space-y-4 pt-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="p-6 rounded-[2.5rem] bg-slate-50/50 dark:bg-slate-900/50 space-y-4 border border-slate-100/50">
                                <div className="flex gap-4">
                                    <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-3/4 rounded-full" />
                                        <Skeleton className="h-3 w-full rounded-full" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : elements.length > 0 ? (
                    <div className="space-y-4 pt-4">
                        {elements.map((el) => (
                            <div key={el.id} className="p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm active:scale-[0.97] transition-all group overflow-hidden relative">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-20 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="flex items-start gap-5">
                                    <div className="h-14 w-14 bg-primary/10 rounded-3xl flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                                        {React.createElement(MODE_CONFIG[activeMode].icon, { className: "h-7 w-7" })}
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <h4 className="text-base font-black text-[#1A365D] dark:text-white uppercase tracking-tight truncate leading-tight">
                                            {el.tags?.name || "Premium Health Hub"}
                                        </h4>
                                        
                                        <div className="flex flex-wrap gap-2">
                                            <Badge className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 text-[8px] font-black border-none px-2.5 py-1">
                                                <Navigation className="w-2.5 h-2.5 mr-1" /> {el.calculatedDist.toFixed(1)} KM
                                            </Badge>
                                            {el.tags?.emergency === 'yes' && <Badge className="bg-red-50 text-red-600 dark:bg-red-900/20 text-[8px] font-black border-none px-2.5 py-1 uppercase"><Siren className="w-2.5 h-2.5 mr-1" /> 24/7</Badge>}
                                            {el.tags?.wheelchair === 'yes' && <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 text-[8px] font-black border-none px-2.5 py-1 uppercase">Accessible</Badge>}
                                        </div>
                                        
                                        <div className="flex items-center gap-2 opacity-50">
                                            <MapPin className="h-3.5 w-3.5" />
                                            <p className="text-[10px] font-bold truncate leading-none uppercase tracking-tighter">
                                                {el.tags?.["addr:full"] || el.tags?.["addr:street"] || "Tap for full location details"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                                    <Button onClick={() => openInMaps(el)} className="rounded-[1.2rem] h-11 bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/10 active:scale-95 transition-all">
                                        <Navigation className="h-4 w-4 mr-2" /> Start Route
                                    </Button>
                                    <Button asChild variant="outline" className="rounded-[1.2rem] h-11 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-black text-[10px] uppercase tracking-widest active:scale-95">
                                        <a href={el.tags?.phone ? `tel:${el.tags.phone}` : '#'}>
                                            <PhoneCall className={cn("h-4 w-4 mr-2", el.tags?.phone ? "text-emerald-500" : "text-slate-300")} /> 
                                            {el.tags?.phone ? "Contact" : "No Phone"}
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center space-y-8 animate-in fade-in duration-1000">
                        <div className="h-24 w-24 bg-slate-100 dark:bg-slate-900 rounded-[2.8rem] flex items-center justify-center mx-auto shadow-inner border border-white/50">
                            <ShieldAlert className="h-10 w-10 text-slate-300" />
                        </div>
                        <div className="space-y-2">
                             <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Radar Signal Empty</p>
                             <p className="text-[9px] font-bold text-slate-300 uppercase max-w-[200px] mx-auto leading-relaxed">No medical infrastructure linked in this radius.</p>
                        </div>
                        <Button onClick={syncGPS} variant="outline" className="rounded-full px-12 h-14 font-black uppercase text-[11px] tracking-widest bg-white dark:bg-slate-900 shadow-xl border-none active:scale-95 transition-all">Scan Again</Button>
                    </div>
                )}
            </div>
        </div>
      </div>

      {error && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xl p-6 flex items-center justify-center animate-in fade-in duration-300 px-8">
             <div className="rounded-[3.5rem] bg-white dark:bg-slate-900 p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] max-w-sm w-full text-center flex flex-col items-center border border-white/10">
                <div className="h-24 w-24 bg-rose-50 dark:bg-rose-900/20 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner border border-rose-100 dark:border-rose-800">
                    <AlertTriangle className="h-12 w-12 text-rose-500" />
                </div>
                <h4 className="text-xl font-black uppercase text-rose-600 tracking-tight leading-none">Radar Timeout</h4>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-4 leading-relaxed px-2">
                    Could not link with medical satellite data. Please refresh your radar signal.
                </p>
                <Button onClick={syncGPS} className="mt-10 w-full rounded-[1.8rem] bg-rose-500 text-white h-16 text-[11px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all">
                    Reset Radar
                </Button>
                <button onClick={() => setError(null)} className="mt-5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">Dismiss</button>
            </div>
        </div>
      )}
    </div>
  );
}
