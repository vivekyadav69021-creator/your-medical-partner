'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
    Siren, 
    Navigation, 
    AlertTriangle, 
    Hospital as HospitalIcon, 
    Search,
    ChevronLeft,
    Activity,
    RotateCcw,
    ShieldAlert,
    Loader2,
    MapPin,
    PhoneCall
} from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// API Configuration
const TOMTOM_API_KEY = process.env.NEXT_PUBLIC_TOMTOM_API_KEY || 'czghQOGKafhd2gnuLjpMzF2bIly8lhp3';

type Hospital = {
  id: string;
  dist: number;
  poi: {
    name: string;
    phone?: string;
    categories?: string[];
  };
  address: {
    freeformAddress: string;
  };
  position: {
    lat: number;
    lon: number;
  };
};

export default function NearbyHospitalPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Ready');
  const [radius, setRadius] = useState<string>('5000');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const fetchHospitals = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    setErrorMessage(null);
    setStatus('Scanning medical network...');

    try {
      // TomTom POI Search Endpoint for Hospitals (Category 7311)
      const url = `https://api.tomtom.com/search/2/poiSearch/hospital.json?key=${TOMTOM_API_KEY}&lat=${lat}&lon=${lon}&radius=${radius}&categorySet=7311&limit=20`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - Please verify connectivity.`);
      }

      const data = await response.json();
      
      // Safety Guard: Robust optional chaining and fallback for results
      const results = data?.results || [];
      
      if (results.length === 0) {
        setStatus(`No facilities found within ${parseInt(radius)/1000}km.`);
      } else {
        setHospitals(results);
        setStatus(`Found ${results.length} medical facilities.`);
      }
    } catch (error: any) {
      console.error("TomTom Fetch Exception:", error);
      setErrorMessage(error?.message || "Failed to reach TomTom servers.");
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: "Network busy or API limit reached. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  }, [radius, toast]);

  const handleGetLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoading(true);
    setStatus('Acquiring GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchHospitals(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation Lookup Error:", error);
        setIsLoading(false);
        let msg = "Location access denied.";
        if (error.code === 1) msg = "Please enable location services in your device settings.";
        if (error.code === 3) msg = "GPS lookup timed out. Check your signal.";
        setErrorMessage(msg);
        toast({
          variant: "destructive",
          title: "Location Error",
          description: msg
        });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [fetchHospitals, toast]);

  // Auto-initiate search on mount
  useEffect(() => {
    handleGetLocation();
  }, [handleGetLocation]);

  const handleCallEmergency = () => {
    if (confirm('Start emergency call to 112?')) {
      window.location.href = 'tel:112';
    }
  };

  const openInMaps = (h: Hospital) => {
    const lat = h?.position?.lat;
    const lon = h?.position?.lon;
    if (lat && lon) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');
    }
  };

  const filteredHospitals = hospitals?.filter(h => 
    h?.poi?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h?.address?.freeformAddress?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-b from-[#f0f4ff] via-[#fdfbff] to-[#fff5f7] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b] overflow-x-hidden safe-top font-body">
      
      {/* Premium Header */}
      <header className="sticky top-0 z-50 px-4 py-4 bg-white/40 dark:bg-[#1e1f20]/40 backdrop-blur-2xl border-b border-white/20 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="active:scale-90 transition-transform">
            <Button variant="ghost" size="icon" className="rounded-full h-11 w-11 bg-white/60 dark:bg-slate-800 shadow-sm border border-white/20">
              <ChevronLeft className="h-6 w-6 text-[#1A365D] dark:text-white" />
            </Button>
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-xl font-black text-[#1A365D] dark:text-white tracking-tight uppercase leading-none">Emergency Hub</h1>
            <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">Nearby Care Locator</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleGetLocation} 
            disabled={isLoading}
            className="rounded-full h-10 w-10 bg-white/60 dark:bg-slate-800 border border-white/20 shadow-sm active:rotate-180 transition-transform duration-500"
          >
            <RotateCcw className={cn("h-4 w-4 text-primary", isLoading && "animate-spin")} />
          </Button>
          <Button onClick={handleCallEmergency} variant="destructive" size="sm" className="rounded-full font-black text-[9px] uppercase tracking-widest px-5 h-10 shadow-lg shadow-red-500/20 active:scale-95 transition-all">
            <Siren className="w-3.5 h-3.5 mr-1.5 animate-pulse" /> SOS
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto w-full px-5 pt-8 space-y-8">
        
        {/* Status Tracker */}
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
                <div className={cn("h-2 w-2 rounded-full", isLoading ? "bg-primary animate-ping" : "bg-emerald-500")} />
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.1em]">{status}</span>
            </div>
            {hospitals.length > 0 && (
                <Badge variant="outline" className="text-[9px] font-bold border-primary/20 bg-primary/5 text-primary rounded-full px-3">{hospitals.length} Clinical Nodes</Badge>
            )}
        </div>

        {/* Global Error Handler */}
        {errorMessage && (
          <Alert className="rounded-[2.5rem] border-none bg-rose-50/80 dark:bg-rose-950/20 p-6 border-dashed border-2 border-rose-100 animate-in slide-in-from-top-4 duration-500">
            <AlertTriangle className="h-5 w-5 text-rose-500" />
            <AlertTitle className="text-xs font-black uppercase text-rose-700 dark:text-rose-300">Signal Blocked</AlertTitle>
            <AlertDescription className="text-[11px] font-bold text-rose-600/80 dark:text-rose-400 mt-1 leading-relaxed">
              {errorMessage}
            </AlertDescription>
            <Button onClick={handleGetLocation} className="mt-5 w-full rounded-2xl bg-rose-500 text-white h-12 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 active:scale-95 transition-all">Retry Locate</Button>
          </Alert>
        )}

        {/* Dynamic Filters */}
        <div className="flex items-center gap-3">
            <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input
                    placeholder="Search hospitals..."
                    className="rounded-[1.8rem] h-14 pl-12 bg-white/70 dark:bg-slate-900/70 border-none shadow-inner text-sm font-bold placeholder:text-slate-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Select value={radius} onValueChange={(val) => { setRadius(val); }}>
                <SelectTrigger className="w-[110px] h-14 rounded-[1.8rem] bg-white/70 dark:bg-slate-900/70 border-none font-black text-[10px] uppercase shadow-sm">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl backdrop-blur-xl bg-white/90">
                    <SelectItem value="2000">2 KM</SelectItem>
                    <SelectItem value="5000">5 KM</SelectItem>
                    <SelectItem value="10000">10 KM</SelectItem>
                    <SelectItem value="20000">20 KM</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {/* Results Stream */}
        <div className="space-y-5 pb-20">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="p-6 rounded-[2.5rem] bg-white/50 dark:bg-slate-900/50 border border-white dark:border-slate-800 space-y-4 animate-pulse">
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
                <div className="flex gap-2 pt-2">
                    <Skeleton className="h-10 flex-1 rounded-2xl" />
                    <Skeleton className="h-10 flex-1 rounded-2xl" />
                </div>
              </div>
            ))
          ) : (
            filteredHospitals?.map((hospital) => (
              <div key={hospital?.id} className="group p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[2.8rem] border border-white dark:border-slate-800 shadow-xl transition-all hover:shadow-2xl hover:scale-[1.01] animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="h-9 w-9 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner shrink-0">
                        <HospitalIcon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight truncate">
                        {hospital?.poi?.name || "Medical Center"}
                      </h3>
                    </div>
                    
                    <div className="flex items-start gap-2.5 px-1">
                      <MapPin className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />
                      <p className="text-[11px] font-bold text-slate-400 leading-relaxed">
                        {hospital?.address?.freeformAddress || "Address details loading..."}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-100/50 dark:border-blue-800">
                          <Navigation className="w-3 h-3 text-primary animate-pulse" />
                          <span className="text-[9px] font-black text-primary uppercase tracking-widest">
                            {hospital?.dist ? (hospital.dist < 1000 ? `${hospital.dist} Meters` : `${(hospital.dist/1000).toFixed(1)} KM`) : "Calculating..."} Away
                          </span>
                        </div>
                        {hospital?.poi?.phone && (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-100/50 dark:border-blue-800">
                            <Activity className="w-3 h-3 text-emerald-500" />
                            <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Verified Facility</span>
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-8">
                  <Button 
                    onClick={() => openInMaps(hospital)}
                    className="rounded-[1.5rem] h-12 bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5 mr-2" /> Route Plan
                  </Button>
                  {hospital?.poi?.phone ? (
                    <Button 
                        asChild
                        variant="outline" 
                        className="rounded-[1.5rem] h-12 border-primary/20 text-primary font-black uppercase text-[10px] tracking-widest bg-white/40 dark:bg-slate-800/40 backdrop-blur-md active:scale-95 transition-all"
                    >
                        <a href={`tel:${hospital.poi.phone}`}>
                            <PhoneCall className="w-3.5 h-3.5 mr-2" /> Call Now
                        </a>
                    </Button>
                  ) : (
                    <Button 
                        disabled
                        variant="outline" 
                        className="rounded-[1.5rem] h-12 border-slate-100 text-slate-300 font-black uppercase text-[10px] tracking-widest bg-slate-50/50 opacity-50"
                    >
                        <PhoneCall className="w-3.5 h-3.5 mr-2" /> No Phone
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}

          {!isLoading && hospitals.length === 0 && !errorMessage && (
            <div className="py-24 text-center space-y-8 animate-in zoom-in-95 duration-700">
                <div className="h-24 w-24 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner border border-blue-100/50">
                    <HospitalIcon className="w-12 h-12 text-primary opacity-30" />
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-black text-slate-600 dark:text-slate-200 uppercase tracking-[0.2em]">Scanner Synchronized</p>
                    <p className="text-[10px] text-slate-400 font-bold max-w-[200px] mx-auto leading-relaxed">
                        Tap below to perform a real-time clinical scan of your current radius.
                    </p>
                </div>
                <Button 
                    onClick={handleGetLocation} 
                    className="rounded-full px-12 h-16 bg-primary text-white font-black uppercase text-[11px] tracking-[0.25em] shadow-2xl shadow-primary/30 active:scale-95 transition-all"
                >
                    Initialize Radar Scan
                </Button>
            </div>
          )}
        </div>

        {/* Global Security Notice */}
        <div className="px-2 pt-6">
            <Alert className="rounded-[2.8rem] border-none bg-blue-50/50 dark:bg-blue-900/10 p-8 border-dashed border-2 border-blue-100 dark:border-blue-900/50">
                <div className="flex flex-col items-center gap-4 text-center">
                    <ShieldAlert className="h-8 w-8 text-primary opacity-30" />
                    <p className="text-[10px] font-black uppercase text-blue-500/80 dark:text-blue-400 tracking-[0.3em] leading-loose">
                        Mapping data provided by TomTom NV. In life-threatening emergencies, do not wait—contact local emergency services (112) immediately.
                    </p>
                </div>
            </Alert>
        </div>

      </main>
    </div>
  );
}

function Badge({ children, variant = 'default', className }: { children: React.ReactNode, variant?: string, className?: string }) {
    return (
        <div className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            className
        )}>
            {children}
        </div>
    )
}
