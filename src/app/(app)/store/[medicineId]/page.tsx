
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { medicines as staticMedicines, Medicine } from '@/lib/medicine-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ShoppingCart, 
  Plus, 
  Share2, 
  AlertCircle,
  ShieldCheck,
  Loader2,
  Package,
  Clock
} from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

const SmallMedicineCard = ({ id, name, price, imageUrl }: { id: string, name: string, price: string, imageUrl?: string }) => {
  const staticImage = PlaceHolderImages.find(img => img.id === id);
  return (
    <Link href={`/store/${id}`} className="min-w-[140px] block group">
      <div className="rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 h-full flex flex-col shadow-sm transition-all group-hover:shadow-md">
        <div className="aspect-square relative rounded-2xl bg-slate-50 dark:bg-slate-800 mb-3 flex items-center justify-center overflow-hidden border border-white/50 dark:border-slate-700/50 shadow-inner">
          {(imageUrl || staticImage) ? (
            <Image 
                src={imageUrl || staticImage?.imageUrl || ''} 
                alt={name} 
                fill 
                className="object-contain p-2 group-hover:scale-110 transition-transform" 
                unoptimized
            />
          ) : <Package className="w-6 h-6 text-slate-200" />}
        </div>
        <h5 className="text-[10px] font-black text-[#1A365D] dark:text-slate-100 line-clamp-1 mb-2 uppercase tracking-tight">{name}</h5>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-black text-[10px] text-primary">{price}</span>
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Plus className="h-3 w-3" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function MedicineDetailPage() {
  const params = useParams();
  const medicineId = params.medicineId as string;
  const { addToCart, cart } = useCart();
  const { toast } = useToast();
  const firestore = useFirestore();

  const staticMedicine = staticMedicines.find(m => m.id === medicineId);

  const medicineDocRef = useMemoFirebase(() => {
    if (staticMedicine || !firestore) return null;
    return doc(firestore, 'medicines', medicineId);
  }, [firestore, medicineId, staticMedicine]);

  const { data: dbMedicine, isLoading: isDbLoading } = useDoc<any>(medicineDocRef);

  const medicine = staticMedicine || dbMedicine;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = () => {
    if (!medicine) return;
    addToCart(medicine as Medicine);
    toast({
      title: "Added to Bag",
      description: `${medicine.name} is ready for checkout.`,
    });
  };

  if (isDbLoading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-[#020617]">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Identifying Unit...</p>
        </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-[#020617] space-y-6">
        <div className="h-20 w-20 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-500 shadow-inner">
            <AlertCircle className="h-10 w-10" />
        </div>
        <div className="space-y-2">
            <h1 className="text-2xl font-black text-[#1A365D] dark:text-white uppercase tracking-tight">Access Denied</h1>
            <p className="text-sm font-medium text-slate-400 max-w-xs uppercase">Product restricted or removed from production inventory.</p>
        </div>
        <Button asChild className="rounded-2xl h-14 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl">
            <Link href="/store">Back to Store</Link>
        </Button>
      </div>
    );
  }

  const staticImage = PlaceHolderImages.find(img => img.id === medicine.id);
  const imageUrl = medicine.imageUrl || staticImage?.imageUrl;
  const popularMeds = staticMedicines.filter(m => m.id !== medicine.id).slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pb-40 font-body safe-top overflow-x-hidden">
      <div className="max-w-xl mx-auto px-5 pt-8 space-y-8">
        
        <div className="flex items-center justify-between">
          <Link href="/store" className="active:scale-90 transition-transform">
            <div className="h-11 w-11 md:h-12 md:w-12 rounded-2xl bg-white dark:bg-slate-900 shadow-md border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                <ChevronLeft className="h-6 w-6 text-[#1A365D] dark:text-slate-100" />
            </div>
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-2xl h-10 w-10 md:h-11 md:w-11 bg-white dark:bg-slate-900 shadow-md border border-slate-100 dark:border-slate-800">
              <Share2 className="h-5 w-5 text-primary" />
            </Button>
            <Link href="/store/cart" className="relative active:scale-90 transition-transform">
              <div className="h-10 w-10 md:h-11 md:w-11 rounded-2xl bg-white dark:bg-slate-900 shadow-md border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-red-500 text-white flex items-center justify-center rounded-full text-[8px] font-black border-2 border-white dark:border-[#020617] animate-in zoom-in">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-6 md:p-8 shadow-2xl border-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 rounded-bl-full pointer-events-none" />
          
          <div className="flex flex-col items-center gap-6 md:gap-8 relative z-10">
            <div className="h-48 md:h-64 w-full relative bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] flex items-center justify-center overflow-hidden shadow-inner border border-white dark:border-slate-800">
              {imageUrl ? (
                <Image 
                  src={imageUrl} 
                  alt={medicine.name} 
                  fill 
                  className="object-contain p-6 md:p-8 group-hover:scale-110 transition-transform duration-1000" 
                  unoptimized
                />
              ) : <Package className="w-16 h-16 text-slate-200" />}
              
              <Badge className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-primary text-[7px] md:text-[8px] font-black uppercase border-none px-3 h-6 rounded-lg shadow-sm">
                {medicine.category}
              </Badge>
            </div>

            <div className="w-full space-y-4 text-center">
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-black text-[#1A365D] dark:text-white uppercase tracking-tight leading-tight">{medicine.name}</h2>
                <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{medicine.official || 'Clinical Approved Asset'}</p>
              </div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed px-1">{medicine.description}</p>
              
              <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800 gap-4">
                <div className="text-center md:text-left w-full md:w-auto">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Market Cost</p>
                  <span className="text-2xl font-black text-[#1A365D] dark:text-primary tracking-tighter">{medicine.price}</span>
                </div>
                <Button size="lg" className="w-full md:w-auto rounded-2xl h-14 md:h-16 px-8 bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all font-black uppercase text-[10px] md:text-[11px] tracking-widest gap-3" onClick={handleAddToCart}>
                  <Plus className="h-5 w-5" /> Add to Bag
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-1">
          <div className="flex items-center gap-3">
             <div className="h-4 w-1 bg-primary rounded-full" />
             <h3 className="text-[11px] md:text-sm font-black text-[#1A365D] dark:text-white uppercase tracking-widest">Intelligence Report</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <InfoBox 
              icon={<ShieldCheck className="h-5 w-5 text-emerald-500" />} 
              title="Official Advisor" 
              content={medicine.safety_advice || "Professional consultation recommended before usage."} 
              bg="bg-emerald-50/50"
            />
            <InfoBox 
              icon={<Clock className="h-5 w-5 text-orange-500" />} 
              title="Standard Cycle" 
              content={medicine.general_dose || "Refer to the digital or physical label for cycle info."} 
              bg="bg-orange-50/50"
            />
          </div>
        </div>

        <div className="space-y-5">
            <div className="flex items-center gap-3 px-1">
                <div className="h-4 w-1 bg-primary rounded-full" />
                <h2 className="text-[11px] md:text-sm font-black uppercase text-[#1A365D] dark:text-slate-100 tracking-widest">Similar Units</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scrollbar-hide">
                {popularMeds.map(med => (
                    <SmallMedicineCard key={med.id} id={med.id} name={med.name} price={med.price} />
                ))}
            </div>
        </div>
      </div>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function InfoBox({ icon, title, content, bg }: { icon: any, title: string, content: string, bg: string }) {
  return (
    <div className={cn("rounded-[2rem] p-5 md:p-6 flex gap-4 md:gap-5 items-start border border-white dark:border-slate-800 shadow-sm", bg)}>
      <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-sm border border-slate-50 dark:border-slate-700">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="text-[12px] md:text-[13px] font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight leading-none">{title}</h4>
        <p className="text-[10px] md:text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-tighter">{content}</p>
      </div>
    </div>
  );
}
