
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
import { ArrowLeft, ShoppingCart, Info, User, Clock, Calendar, ShieldCheck } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { medicines } from '@/lib/medicine-data';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

const MedicineCard = ({ id, name, price, category }: { id: string, name: string, price: string, category: string }) => {
  const image = PlaceHolderImages.find(img => img.id === id);

  return (
    <Link href={`/store/${id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
        <CardHeader>
          {image && (
            <Image
              src={image.imageUrl}
              alt={image.description}
              width={400}
              height={400}
              className="rounded-md aspect-square object-cover"
              data-ai-hint={image.imageHint}
            />
          )}
        </CardHeader>
        <CardContent>
          <CardTitle className="text-lg">{name}</CardTitle>
          <CardDescription>{category}</CardDescription>
          <p className="text-lg font-bold mt-2">{price}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="flex items-start gap-3">
        <div className="text-primary mt-1">{icon}</div>
        <div>
            <p className="font-semibold">{label}</p>
            <p className="text-sm text-muted-foreground">{value}</p>
        </div>
    </div>
);


export default function MedicineDetailPage({ params }: { params: { medicineId: string } }) {
  const medicine = medicines.find(m => m.id === params.medicineId);

  if (!medicine) {
    notFound();
  }

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
            
             <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <InfoRow icon={<Info className="w-5 h-5"/>} label="Use For" value={medicine.use_for} />
                    <InfoRow icon={<User className="w-5 h-5"/>} label="Who Can Use" value={medicine.who_can_use} />
                    <InfoRow icon={<Clock className="w-5 h-5"/>} label="General Dose" value={medicine.general_dose} />
                    <InfoRow icon={<Calendar className="w-5 h-5"/>} label="Expiry" value={medicine.expiry} />
                    <InfoRow icon={<ShieldCheck className="w-5 h-5"/>} label="Official" value={medicine.official} />
                </CardContent>
             </Card>

            <div>
              <p className="text-3xl font-bold">{medicine.price}</p>
            </div>
            <Button size="lg" className="w-full">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Buy Now
            </Button>
            <div className="text-xs text-muted-foreground text-center">
              Please consult your doctor before use.
            </div>
          </div>
        </div>
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
