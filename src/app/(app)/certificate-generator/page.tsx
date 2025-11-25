'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/firebase';
import { jsPDF } from 'jspdf';
import { useToast } from '@/hooks/use-toast';
import { Award, Download, Upload } from 'lucide-react';

export default function CertificateGeneratorPage() {
  const { user } = useUser();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [lessonTitle, setLessonTitle] = useState('Nutrition Basics');
  const [score, setScore] = useState(100);
  const [status, setStatus] = useState('Ready');
  const [isLoading, setIsLoading] = useState(false);
  
  const lastPdfBlob = useRef<Blob | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.displayName || user.email || '');
    }
  }, [user]);

  const createCertificatePdf = async () => {
    setStatus('Creating PDF...');
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, W, H, 'F');

    doc.setFontSize(28);
    doc.setTextColor(10, 40, 80);
    doc.text('Certificate of Completion', W / 2, 90, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text('This is to certify that', W / 2, 130, { align: 'center' });

    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.text(name, W / 2, 170, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('has successfully completed the lesson:', W / 2, 205, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(10, 40, 80);
    doc.text(lessonTitle, W / 2, 230, { align: 'center' });

    const dateStr = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Score: ${score}%`, W / 2, 260, { align: 'center' });
    doc.text(`Issued: ${dateStr}`, W / 2, 280, { align: 'center' });

    doc.setFontSize(12);
    doc.text('Your Medical Partner', W - 220, H - 120);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.line(W - 320, H - 140, W - 20, H - 140);
    doc.text('Authorized Signature', W - 220, H - 120 + 18);
    
    return doc.output('blob');
  };

  const handleGenerate = async () => {
    if (!name || !lessonTitle) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please enter a name and lesson title.',
      });
      return;
    }

    setIsLoading(true);
    setStatus('Preparing...');
    try {
      const pdfBlob = await createCertificatePdf();
      lastPdfBlob.current = pdfBlob;

      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${lessonTitle.replace(/\s+/g, '_')}_certificate.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      
      setStatus('Certificate generated and downloaded.');
       toast({
        title: 'Certificate Generated',
        description: 'Your PDF has been downloaded.',
      });
    } catch (err: any) {
      setStatus(`Error: ${err.message || 'Could not generate PDF.'}`);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: err.message || 'Could not generate PDF.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (lastPdfBlob.current) {
      const url = URL.createObjectURL(lastPdfBlob.current);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificate.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } else {
      toast({
        variant: 'destructive',
        title: 'No Certificate Found',
        description: 'Please generate a certificate first.',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Certificate Generator</h1>
        <p className="text-muted-foreground">
          Create and download certificates for lesson completion.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Details</CardTitle>
          <CardDescription>
            Enter the details to generate a new certificate.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="certName">Recipient Name</Label>
              <Input id="certName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certScore">Score (%)</Label>
              <Input id="certScore" type="number" min="0" max="100" value={score} onChange={(e) => setScore(Number(e.target.value))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="certLesson">Lesson Title</Label>
            <Input id="certLesson" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} placeholder="e.g. Nutrition Basics" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <div className="flex gap-2">
            <Button onClick={handleGenerate} disabled={isLoading}>
              <Award className="mr-2" />
              {isLoading ? 'Generating...' : 'Generate Certificate'}
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2" />
              Download Latest
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{status}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
