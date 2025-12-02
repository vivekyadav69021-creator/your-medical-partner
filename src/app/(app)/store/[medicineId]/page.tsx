
'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ShoppingCart, Info, User, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { medicines, Medicine } from '@/lib/medicine-data';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';

const MedicineCard = ({ id, name, price, category }: { id: string, name: string, price: string, category: string }) => {
  const image = PlaceHolderImages.find(img => img.id === id);

  return (
    <Link href={`/store/${id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col">
        <CardHeader className="p-0">
          {image ? (
            <Image
              src={image.imageUrl}
              alt={image.description}
              width={400}
              height={400}
              className="rounded-t-lg aspect-square object-cover"
              data-ai-hint={image.imageHint}
            />
          ) : (
            <div className="rounded-t-lg aspect-square object-cover bg-secondary flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No Image</p>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-1 flex flex-col">
          <CardTitle className="text-base font-semibold line-clamp-2">{name}</CardTitle>
          <CardDescription className="text-xs mt-1">{category}</CardDescription>
          <p className="text-base font-bold mt-auto pt-2">{price}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="flex items-start gap-4">
        <div className="text-primary mt-1">{icon}</div>
        <div>
            <p className="font-semibold">{label}</p>
            <p className="text-sm text-muted-foreground">{value}</p>
        </div>
    </div>
);


export default function MedicineDetailPage({ params }: { params: { medicineId: string } }) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const medicine = medicines.find(m => m.id === params.medicineId);

  if (!medicine) {
    notFound();
  }
  
  const handleAddToCart = () => {
    addToCart(medicine as Medicine);
    toast({
        title: "Added to Cart",
        description: `${medicine.name} has been added to your cart.`,
    });
  };

  const image = PlaceHolderImages.find(img => img.id === medicine.id);
  const similarProducts = medicines.filter(m => m.category === medicine.category && m.id !== medicine.id).slice(0, 4);

  return (
    <div className="space-y-12">
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/store">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Store
          </Link>
        </Button>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            {image && (
              <Card>
                <CardContent className="p-0">
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    width={600}
                    height={600}
                    className="rounded-lg object-cover w-full aspect-square"
                    data-ai-hint={image.imageHint}
                  />
                </CardContent>
              </Card>
            )}
          </div>
          <div className="space-y-6">
            <div>
              <Badge>{medicine.category}</Badge>
              <h1 className="text-4xl font-bold tracking-tight font-headline mt-2">{medicine.name}</h1>
            </div>
            
            <p className="text-muted-foreground">{medicine.description}</p>
            
            <div>
              <p className="text-3xl font-bold">{medicine.price}</p>
            </div>
            <Button size="lg" className="w-full" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <div className="text-xs text-muted-foreground text-center">
              Please consult your doctor before use.
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Info className="h-5 w-5"/>How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <InfoRow icon={<User className="w-5 h-5"/>} label="Who Can Use" value={medicine.who_can_use} />
                <InfoRow icon={<Clock className="w-5 h-5"/>} label="General Dose" value={medicine.general_dose} />
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive"/>Safety & Side Effects</CardTitle>
            </CardHeader>
            <CardContent>
                <Alert variant="destructive">
                    <AlertTitle>Safety Advice</AlertTitle>
                    <AlertDescription>{medicine.safety_advice}</AlertDescription>
                </Alert>
                 <div className="mt-4">
                    <h4 className="font-semibold mb-2">Common Side Effects:</h4>
                    <p className="text-sm text-muted-foreground">{medicine.side_effects}</p>
                 </div>
            </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-6">Similar Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {similarProducts.length > 0 ? (
            similarProducts.map(med => <MedicineCard key={med.id} {...med} />)
          ) : (
            <p className="text-muted-foreground col-span-full">No similar products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
