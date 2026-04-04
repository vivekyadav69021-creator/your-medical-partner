
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter, notFound } from 'next/navigation';
import { medicines, Medicine } from '@/lib/medicine-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ShoppingCart, 
  Plus, 
  Heart, 
  Share2, 
  Info, 
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const SmallMedicineCard = ({ id, name, price }: { id: string, name: string, price: string }) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  return (
    <Link href={`/store/${id}`} className="min-w-[140px]">
      <Card className="rounded-[2rem] border-none shadow-sm bg-white p-3 h-full flex flex-col">
        <div className="aspect-square relative rounded-2xl bg-[#F8FBFF] mb-3 flex items-center justify-center overflow-hidden">
          {image && <Image src={image.imageUrl} alt={name} fill className="object-contain p-2" data-ai-hint={image.imageHint} />}
        </div>
        <h5 className="text-[10px] font-bold text-gray-800 line-clamp-1 mb-2">{name}</h5>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-bold text-[10px]">{price}</span>
          <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full bg-primary text-white p-0">
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </Card>
    </Link>
  );
};

export default function MedicineDetailPage() {
  const params = useParams();
  const medicineId = params.medicineId as string;
  const { addToCart, cart } = useCart();
  const { toast } = useToast();
  const medicine = medicines.find(m => m.id === medicineId);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!medicine) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart(medicine as Medicine);
    toast({
      title: "Added to Cart",
      description: `${medicine.name} has been added.`,
    });
  };

  const image = PlaceHolderImages.find(img => img.id === medicine.id);
  const popularMeds = medicines.filter(m => m.id !== medicine.id).slice(0, 4);

  return (
    <div className="min-h-full bg-[#F0F7FF] dark:bg-slate-950 pb-20">
      <div className="max-w-xl mx-auto px-4 pt-6 space-y-6">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-white shadow-sm border border-blue-50" asChild>
            <Link href="/store"><ChevronLeft className="h-6 w-6 text-gray-600" /></Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-white shadow-sm border border-blue-50">
              <Share2 className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-white shadow-sm border border-blue-50 relative" asChild>
              <Link href="/store/cart">
                <ShoppingCart className="h-5 w-5 text-gray-600" />
                {itemCount > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-[10px] text-white flex items-center justify-center rounded-full font-bold">{itemCount}</span>}
              </Link>
            </Button>
          </div>
        </div>

        {/* Featured Product Horizontal Card Style */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border-none flex items-center gap-6 relative overflow-hidden group">
          <div className="h-32 w-32 relative flex-shrink-0 bg-[#F8FBFF] rounded-[2rem] flex items-center justify-center overflow-hidden">
            {image && (
              <Image 
                src={image.imageUrl} 
                alt={medicine.name} 
                fill 
                className="object-contain p-4 group-hover:scale-110 transition-transform" 
                data-ai-hint={image.imageHint}
              />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-bold text-gray-800">{medicine.name}</h2>
            <p className="text-xs font-semibold text-blue-400">{medicine.category}</p>
            <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">{medicine.description}</p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-lg font-bold text-gray-900">{medicine.price}</span>
              <Button size="icon" className="h-8 w-8 rounded-full bg-primary shadow-md hover:scale-110 transition-all" onClick={handleAddToCart}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {/* Decorative star */}
          <Star className="absolute top-4 right-4 h-4 w-4 text-blue-50" />
        </div>

        {/* Info Tabs/Sections */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 px-1">Product Details</h3>
          <div className="grid grid-cols-1 gap-4">
            <InfoBox 
              icon={<ShieldCheck className="h-5 w-5 text-green-400" />} 
              title="Official & Safe" 
              content={medicine.safety_advice} 
            />
            <InfoBox 
              icon={<Clock className="h-5 w-5 text-orange-400" />} 
              title="Usage & Dose" 
              content={medicine.general_dose} 
            />
            <InfoBox 
              icon={<AlertCircle className="h-5 w-5 text-red-400" />} 
              title="Side Effects" 
              content={medicine.side_effects} 
            />
          </div>
        </div>

        {/* Popular Medicines Slider */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 px-1">Popular Medicines</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {popularMeds.map(med => (
              <SmallMedicineCard key={med.id} id={med.id} name={med.name} price={med.price} />
            ))}
          </div>
        </div>

        {/* Top Deals Banner style */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 px-1">Top Deals</h3>
          <div className="bg-[#1A1A1A] rounded-[2rem] p-6 text-white flex items-center justify-between relative overflow-hidden">
            <div className="space-y-1 relative z-10">
              <p className="text-[10px] font-bold text-primary tracking-widest uppercase">Limited Offer</p>
              <h4 className="text-xl font-bold">Flat 20% Off</h4>
              <p className="text-xs text-gray-400">On all health supplements</p>
            </div>
            <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center relative z-10 backdrop-blur-sm border border-white/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div className="absolute -top-10 -right-10 h-32 w-32 bg-primary/20 rounded-full blur-3xl" />
          </div>
        </div>

      </div>
    </div>
  );
}

function InfoBox({ icon, title, content }: { icon: any, title: string, content: string }) {
  return (
    <div className="bg-white rounded-[1.5rem] p-4 flex gap-4 items-start shadow-sm border border-blue-50/50">
      <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-gray-800">{title}</h4>
        <p className="text-xs text-gray-500 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

function Card({ children, className, ...props }: any) {
  return (
    <div className={cn("bg-white shadow-sm", className)} {...props}>
      {children}
    </div>
  );
}
