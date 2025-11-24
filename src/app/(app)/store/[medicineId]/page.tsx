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
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { medicines } from '@/lib/medicine-data';
import { notFound } from 'next/navigation';

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
              <p className="text-sm text-muted-foreground font-medium">{medicine.category}</p>
              <h1 className="text-4xl font-bold tracking-tight font-headline">{medicine.name}</h1>
            </div>
            <p className="text-muted-foreground">{medicine.description}</p>
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
