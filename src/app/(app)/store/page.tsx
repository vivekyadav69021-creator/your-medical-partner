
'use client';

import React, { useState, useRef, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Upload, Loader2, X, Camera, CameraOff } from 'lucide-react';
import { medicines, categories } from '@/lib/medicine-data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { analyzePrescriptionAction } from './actions';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const initialAnalysisState = {
  result: null,
  error: null,
};

function AnalyzeButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        'Analyze Prescription'
      )}
    </Button>
  );
}

const PrescriptionAnalyzer = () => {
  const [state, formAction] = useActionState(analyzePrescriptionAction, initialAnalysisState);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (state.result) {
      setAnalysisResult(state.result);
    }
    if (state.error) {
      setAnalysisResult(null);
    }
  }, [state]);

  const stopStream = () => {
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
    }
  };
  
  const openCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          toast({ variant: 'destructive', title: "Camera Not Supported" });
          return;
      }
      stopStream();
      setIsCameraOpen(true);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          streamRef.current = stream;
      } catch (err) {
         toast({ variant: 'destructive', title: 'Camera Error', description: 'Could not access camera. Please check permissions.' });
         setIsCameraOpen(false);
      }
  };

  const closeCamera = () => {
      setIsCameraOpen(false);
      stopStream();
  };

  const takePicture = () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          setPreview(dataUrl);
          closeCamera();
        }
      }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setPreview(e.target?.result as string);
        closeCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (formData: FormData) => {
    if (!preview) {
      toast({
        variant: 'destructive',
        title: 'No Image Selected',
        description: 'Please upload or capture an image of your prescription to analyze.',
      });
      return;
    }
    formData.set('imageDataUri', preview);
    formAction(formData);
  };
  
  const handleClear = () => {
      setPreview(null);
      setAnalysisResult(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      formRef.current?.reset();
      closeCamera();
  }
  
  const matchedMedicines = analysisResult?.availableMedicines
    ? medicines.filter(med => analysisResult!.availableMedicines.some((availMed: string) => med.name.toLowerCase().includes(availMed.toLowerCase())))
    : [];

  return (
    <Card className="bg-secondary/50">
        <canvas ref={canvasRef} className="hidden"></canvas>
        <CardHeader>
            <CardTitle>AI Prescription Analyzer</CardTitle>
            <CardDescription>Upload a picture of your prescription, and our AI will find the available medicines for you.</CardDescription>
        </CardHeader>
        <form ref={formRef} action={handleFormSubmit}>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                   <Input 
                        id="prescription-upload"
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden"
                    />
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                    </Button>
                    <Button type="button" variant="outline" onClick={openCamera}>
                        <Camera className="mr-2 h-4 w-4" />
                        Use Camera
                    </Button>
                </div>

                {isCameraOpen && (
                    <div className="relative mt-2">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto rounded-md border aspect-video object-cover bg-black" />
                        <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-2">
                            <Button type="button" onClick={takePicture}>Take Picture</Button>
                            <Button type="button" variant="destructive" onClick={closeCamera}><CameraOff /></Button>
                        </div>
                    </div>
                )}

                 {preview && !isCameraOpen && (
                    <div className="relative w-fit">
                        <Image src={preview} alt="Prescription preview" width={150} height={150} className="rounded-md border-2" />
                         <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground" onClick={handleClear}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
                 <div className="flex gap-2">
                    <AnalyzeButton />
                    <Button type="button" variant="ghost" onClick={handleClear}>Clear</Button>
                </div>
                
                {state.error && (
                    <Alert variant="destructive">
                        <AlertTitle>Analysis Failed</AlertTitle>
                        <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                )}
                
                {matchedMedicines.length > 0 && (
                     <div className="w-full">
                        <h3 className="font-semibold text-lg mb-2">Suggested Kit from Your Prescription:</h3>
                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {matchedMedicines.map(med => (
                                <Card key={med.id} className="flex flex-col">
                                    <CardContent className="p-3 flex-1 flex flex-col">
                                        <Image src={PlaceHolderImages.find(p => p.id === med.id)?.imageUrl || ''} alt={med.name} width={150} height={150} className="w-full rounded-md aspect-square object-cover" data-ai-hint={PlaceHolderImages.find(p => p.id === med.id)?.imageHint || ''} />
                                        <p className="font-semibold text-sm line-clamp-2 mt-2">{med.name}</p>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{med.description}</p>
                                        <div className="mt-auto pt-2 flex items-center justify-between">
                                            <p className="font-bold text-sm">{med.price}</p>
                                            <Button size="sm" asChild variant="secondary">
                                                <Link href={`/store/${med.id}`}>View</Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                         </div>
                     </div>
                )}

                {analysisResult && analysisResult.unidentifiedMedicines.length > 0 && (
                    <Alert>
                        <AlertTitle>Medicines Not Available</AlertTitle>
                        <AlertDescription>
                            <p>The following items were identified from your prescription but are not available in our store:</p>
                            <ul className="list-disc pl-5 mt-2">
                                {analysisResult.unidentifiedMedicines.map((item: string, i: number) => <li key={i}>{item}</li>)}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

            </CardFooter>
        </form>
    </Card>
  )
}


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


export default function StorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredMedicines = medicines
    .filter(med => selectedCategory === 'All' || med.category === selectedCategory)
    .filter(med => med.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Medical Store</h1>
        <p className="text-muted-foreground">
          Order medicines and health products from the comfort of your home.
        </p>
      </div>

      <PrescriptionAnalyzer />

      <Card>
        <CardHeader>
            <CardTitle>Browse Medicines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="Search for medicines..." 
                    className="pl-10" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[240px]">
                    <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredMedicines.length > 0 ? (
                filteredMedicines.map(med => (
                    <MedicineCard key={med.id} {...med} />
                ))
                ) : (
                <p className="col-span-full text-center text-muted-foreground">No medicines found.</p>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
