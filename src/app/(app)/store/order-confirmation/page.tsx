
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, ShoppingBag } from 'lucide-react';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const total = searchParams.get('total');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto bg-green-100 dark:bg-green-900 rounded-full h-16 w-16 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">Order Confirmed!</CardTitle>
          <CardDescription>Thank you for your purchase.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {orderId && (
            <p className="text-sm text-muted-foreground">
              Your Order ID is: <span className="font-mono text-foreground">{orderId}</span>
            </p>
          )}
           {total && (
            <p className="text-2xl font-bold">
              Total: ₹{total}
            </p>
          )}
          <p className="text-sm">You will receive an email confirmation shortly.</p>
          <Button asChild className="w-full">
            <Link href="/store">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
