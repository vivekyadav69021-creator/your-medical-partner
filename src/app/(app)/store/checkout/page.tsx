
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { Label } from '@/components/ui/label';
import { ArrowLeft, CreditCard, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = (cartTotal + 50 + cartTotal * 0.05).toFixed(2);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    toast({
        title: "Processing Payment...",
        description: "Please wait while we simulate your payment.",
    });

    setTimeout(() => {
        setIsProcessing(false);
        const orderId = `order-${Date.now()}`;
        // In a real app, save order to database here
        clearCart();
        router.push(`/store/order-confirmation?orderId=${orderId}&total=${totalAmount}`);
    }, 3000);
  };
  
  if (cart.length === 0 && !isProcessing) {
      return (
          <div className="text-center">
              <h1 className="text-2xl font-bold">Your cart is empty.</h1>
               <Button asChild variant="link">
                <Link href="/store">Go back to shopping</Link>
              </Button>
          </div>
      )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
       <div>
         <Button variant="ghost" asChild>
            <Link href="/store/cart">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Cart
            </Link>
         </Button>
        <h1 className="text-3xl font-bold tracking-tight font-headline mt-2">Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <form id="checkout-form" onSubmit={handlePayment}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" placeholder="Street address" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="pincode">Pincode</Label>
                                <Input id="pincode" type="number" required />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" required />
                        </div>
                    </CardContent>
                </form>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                    <CardDescription>This is a simulated payment flow.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button form="checkout-form" type="submit" className="w-full" size="lg" disabled={isProcessing}>
                       {isProcessing ? (
                           <><Sparkles className="mr-2 h-4 w-4 animate-pulse" /> Processing...</>
                       ) : (
                           <>
                            <Image src="https://storage.googleapis.com/studiopaas-test-assets/project-assets/upi-icon.png" alt="UPI" width={24} height={24} className="mr-2" />
                            Pay ₹{totalAmount} with UPI
                           </>
                       )}
                    </Button>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {cart.map(item => (
                   <div key={item.id} className="flex justify-between items-center text-sm">
                       <p>{item.name} <span className="text-muted-foreground">x{item.quantity}</span></p>
                       <p>₹{(parseFloat(item.price.replace('₹', '')) * item.quantity).toFixed(2)}</p>
                   </div>
               ))}
               <div className="flex justify-between font-bold text-lg pt-4 border-t">
                  <p>Total</p>
                  <p>₹{totalAmount}</p>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
