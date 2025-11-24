'use client';

import React, { useActionState, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Scan, Sparkles, Upload, FileImage, X, Bot, Terminal } from 'lucide-react';
import { diseaseScannerAction } from './actions';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialState = {
  response: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
          Scanning...
        </>
      ) : (
        <>
          <Scan className="mr-2 h-5 w-5" />
          Scan Disease
        </>
      )}
    </Button>
  );
}

export default function DiseaseScannerPage() {
  const [state, formAction] = useActionState(diseaseScannerAction, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
      setPreview(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
  }

  const handleFormAction = (formData: FormData) => {
    if (preview) {
      formData.append('photoDataUri', preview);
    }
    formAction(formData);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">AI Disease Scanner</h1>
        <p className="text-muted-foreground">
          Upload an image of a skin condition or other visible symptom for an AI-powered analysis.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <form ref={formRef} action={handleFormAction}>
            <CardHeader>
              <CardTitle>Scan a Symptom</CardTitle>
              <CardDescription>
                Upload a clear image and describe the issue.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="symptom-image">Symptom Image</Label>
                {preview ? (
                   <div className="relative">
                     <Image src={preview} alt="Symptom preview" width={200} height={200} className="rounded-md border aspect-square object-cover w-full" />
                     <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={handleRemoveImage}>
                       <X className="h-4 w-4"/>
                       <span className="sr-only">Remove image</span>
                     </Button>
                   </div>
                ) : (
                  <div 
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary/80"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (MAX. 5MB)</p>
                    </div>
                     <input ref={fileInputRef} id="symptom-image" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Describe Your Symptoms</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="e.g., 'This rash appeared on my arm 2 days ago. It's red, itchy, and has small bumps. It hasn't spread.'"
                  rows={5}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
            <CardDescription>
              The AI's analysis will appear here. This is not a medical diagnosis.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1">
                <div className="pr-4">
                  {!state.response && !state.error && (
                    <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                      <Bot className="mx-auto h-12 w-12" />
                      <p className="mt-4">Your scan results will be shown here.</p>
                    </div>
                  )}
                  {state.response && (
                    <article className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{state.response}</ReactMarkdown>
                    </article>
                  )}
                  {state.error && (
                    <Alert variant="destructive" className="h-full">
                      <Terminal className="h-4 w-4" />
                      <AlertTitle>Scan Failed</AlertTitle>
                      <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
