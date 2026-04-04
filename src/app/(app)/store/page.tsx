
'use client';

import React, { useState, useRef, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Upload, 
  Loader2, 
  X, 
  Camera, 
  CameraOff, 
  Plus, 
  ChevronLeft,
  ShoppingCart,
  Heart,
  LayoutGrid,
  Stethoscope,
  Pill,
  Baby,
  Sparkles
} from 'lucide-react';
import { medicines, categories } from '@/lib/medicine-data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { analyzePrescriptionAction } from './actions';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/cart-context';

const initialAnalysisState = {
  result: null,
  error: null,
};

const AIPrescriptionBanner = () => {
  const [state, formAction] = useActionState(analyzePrescriptionAction, initialAnalysisState);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { pending } = useFormStatus();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setPreview(e.target?.result as string);
        // Automatically submit when image is selected
        const formData = new FormData();
        formData.set('imageDataUri', e.target?.result as string);
        formAction(formData);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#6EA8FF] to-[#4A90E2] p-6 text-white shadow-lg mb-8">
      <div className="flex items-center gap-6 relative z-10">
        <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
          <Camera className="h-8 w-8 text-white" />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="text-xl font-bold">AI Prescription</h3>
          <Button 
            variant="secondary" 
            size="sm" 
            className="rounded-full bg-white text-primary hover:bg-white/90 font-bold px-6"
            onClick={() => fileInputRef.current?.click()}
            disabled={pending}
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Upload Prescription
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
        </div>
      </div>
      {/* Decorative blobs */}
      <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />
      <div className="absolute top-0 left-1/2 h-16 w-16 rounded-full bg-white/5 blur-lg" />
    </div>
  );
};

const CategoryItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
  <div 
    className="flex flex-col items-center gap-2 cursor-pointer transition-all group"
    onClick={onClick}
  >
    <div className={cn(
      "h-14 w-14 rounded-full flex items-center justify-center border-2 transition-all",
      active ? "bg-primary border-primary text-white shadow-md" : "bg-white border-blue-50 text-blue-400 hover:border-primary/30"
    )}>
      <Icon className={cn("h-6 w-6", active ? "text-white" : "group-hover:scale-110 transition-transform")} />
    </div>
    <span className={cn("text-xs font-semibold", active ? "text-primary" : "text-blue-400/80")}>{label}</span>
  </div>
);

const MedicineCard = ({ id, name, price, category }: { id: string, name: string, price: string, category: string }) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const med = medicines.find(m => m.id === id);
    if (med) {
      addToCart(med);
      toast({ title: "Added to Cart", description: `${name} has been added.` });
    }
  };

  return (
    <Link href={`/store/${id}`}>
      <Card className="rounded-[2rem] border-none shadow-sm hover:shadow-md transition-all h-full bg-white group overflow-hidden">
        <CardContent className="p-4 flex flex-col h-full">
          <div className="aspect-square relative rounded-2xl bg-[#F8FBFF] mb-4 flex items-center justify-center overflow-hidden">
            {image ? (
              <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-contain p-4 group-hover:scale-110 transition-transform"
                data-ai-hint={image.imageHint}
              />
            ) : (
              <Pill className="h-12 w-12 text-blue-100" />
            )}
          </div>
          <div className="space-y-1 mb-4 flex-1">
            <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{name}</h4>
            <div className="flex gap-1">
              <div className="h-1.5 w-8 rounded-full bg-blue-50" />
              <div className="h-1.5 w-12 rounded-full bg-blue-50" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <span className="font-bold text-base text-gray-900">{price}</span>
            <Button 
              size="sm" 
              className="rounded-full bg-[#E6F0FF] text-primary hover:bg-primary hover:text-white px-4 h-8 text-xs font-bold transition-all"
              onClick={handleAdd}
            >
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default function StorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredMedicines = medicines
    .filter(med => selectedCategory === 'All' || med.category === selectedCategory)
    .filter(med => med.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const categoryIcons: Record<string, any> = {
    'All': LayoutGrid,
    'Pain & Fever': Pill,
    'Hydration & Energy': Sparkles,
    'Allergy Relief': Stethoscope,
    'Skin Care': Baby,
    'Baby Care': Baby, // Example for UI mapping
  };

  return (
    <div className="min-h-full bg-[#F0F7FF] dark:bg-slate-950 pb-20">
      <div className="max-w-xl mx-auto px-4 pt-6 space-y-6">
        
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-white shadow-sm border border-blue-50" asChild>
            <Link href="/dashboard"><ChevronLeft className="h-6 w-6 text-gray-600" /></Link>
          </Button>
          <h1 className="text-xl font-bold text-gray-800">Medical Store</h1>
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-white shadow-sm border border-blue-50 relative" asChild>
            <Link href="/store/cart">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              {itemCount > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-[10px] text-white flex items-center justify-center rounded-full font-bold">{itemCount}</span>}
            </Link>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
          <Input 
            placeholder="Search for medicines or health products..." 
            className="pl-12 h-14 rounded-2xl border-none bg-white shadow-sm placeholder:text-blue-200 text-gray-700" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* AI Banner */}
        <AIPrescriptionBanner />

        {/* Shop by Category */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800 px-1">Shop by Category</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {categories.slice(0, 6).map(cat => (
              <CategoryItem 
                key={cat} 
                label={cat.split(' ')[0]} 
                icon={categoryIcons[cat] || Pill} 
                active={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              />
            ))}
          </div>
        </div>

        {/* Popular Medicines */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800 px-1">Popular Medicines</h2>
          <div className="grid grid-cols-2 gap-4">
            {filteredMedicines.map(med => (
              <MedicineCard key={med.id} {...med} />
            ))}
          </div>
          {filteredMedicines.length === 0 && (
            <p className="text-center text-blue-300 py-10 italic">No products found in this category.</p>
          )}
        </div>

      </div>
    </div>
  );
}
