
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Minus, Plus, Trash2, ArrowRight, ShoppingCart } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Shopping Cart</h1>
        <p className="text-muted-foreground">Review your items before proceeding to checkout.</p>
      </div>

      {cart.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">Your cart is empty</h2>
            <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild className="mt-6">
              <Link href="/store">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => {
              const image = PlaceHolderImages.find(img => img.id === item.id);
              const price = parseFloat(item.price.replace('₹', ''));

              return (
                <Card key={item.id}>
                  <CardContent className="p-4 flex gap-4 items-center">
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                        data-ai-hint={image.imageHint}
                      />
                    )}
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.price}</p>
                       <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                            className="w-16 h-8 text-center"
                          />
                          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-bold">₹{(price * item.quantity).toFixed(2)}</p>
                        <Button variant="ghost" size="icon" className="text-destructive mt-2" onClick={() => removeFromCart(item.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Subtotal</p>
                  <p>₹{cartTotal.toFixed(2)}</p>
                </div>
                 <div className="flex justify-between">
                  <p className="text-muted-foreground">Shipping</p>
                  <p>₹50.00</p>
                </div>
                 <div className="flex justify-between">
                  <p className="text-muted-foreground">Taxes</p>
                  <p>₹{(cartTotal * 0.05).toFixed(2)}</p>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <p>Total</p>
                  <p>₹{(cartTotal + 50 + cartTotal * 0.05).toFixed(2)}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                   <Link href="/store/checkout">
                     Proceed to Checkout
                     <ArrowRight className="ml-2 h-4 w-4" />
                   </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
