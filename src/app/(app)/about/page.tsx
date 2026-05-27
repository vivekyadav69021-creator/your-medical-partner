'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShieldCheck, 
  Info, 
  Lock, 
  BookOpen, 
  HeartPulse, 
  Scale, 
  Stethoscope, 
  Scan, 
  BrainCircuit, 
  Store,
  ChevronRight,
  Fingerprint,
  Database,
  AlertTriangle,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-32 animate-in fade-in duration-700 px-1">
      {/* Hero Header */}
      <div className="text-center space-y-4 pt-4">
        <div className="h-20 w-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner border border-primary/20">
          <HeartPulse className="w-10 h-10 text-primary animate-pulse" />
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-[#1A365D] dark:text-white tracking-tighter uppercase">Your Medical Partner</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Version 2.0.1 Stable • Professional Edition</p>
        </div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          Empowering individuals with high-authority medical intelligence, advanced diagnostics, and holistic wellness tools.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/40 dark:border-slate-800/40 shadow-sm">
          <TabsTrigger value="overview" className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="features" className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Features</TabsTrigger>
          <TabsTrigger value="privacy" className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Privacy & Legal</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-8 space-y-6">
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-white/80 dark:bg-slate-900/80 p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl font-black text-[#1A365D] dark:text-white uppercase tracking-tight flex items-center gap-3">
                <Info className="w-6 h-6 text-primary" /> Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              <p>
                <strong>Your Medical Partner</strong> is a state-of-the-art digital health platform designed to bridge the gap between complex medical information and patient understanding. We believe that everyone deserves access to accurate, medically-vetted health insights anytime, anywhere.
              </p>
              <p>
                By leveraging advanced Artificial Intelligence (Genkit & Gemini), we provide tools that not only analyze data but also offer empathetic support and actionable health plans, ensuring you are never alone in your health journey.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <HighlightCard icon={ShieldCheck} title="Medically Vetted" desc="Information sourced from elite institutions like WHO and Mayo Clinic." />
                <HighlightCard icon={BrainCircuit} title="AI Powered" desc="Advanced diagnostics for X-Rays, Lab Reports, and Skin Analysis." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="mt-8 space-y-6">
          <div className="grid gap-6">
            <FeatureInfo 
              icon={BrainCircuit} 
              title="AI Health Assistant" 
              desc="A polyglot conversational agent that uses high-authority medical databases to answer health queries, identify symptoms, and provide first-aid guidance in multiple languages including Hindi and English."
            />
            <FeatureInfo 
              icon={Scan} 
              title="Advanced Disease Scanner" 
              desc="A suite of diagnostic tools: X-Ray Vision for structural scans, Skin Analysis for dermatological insights, and Lab Report OCR for interpreting complex blood work into simple language."
            />
            <FeatureInfo 
              icon={Stethoscope} 
              title="Tele-Consultation" 
              desc="Direct access to global expertise. Book virtual appointments with top-tier Indian and foreign specialists across various fields like Cardiology, Pediatrics, and more."
            />
            <FeatureInfo 
              icon={Store} 
              title="Smart Medical Store" 
              desc="A seamless e-pharmacy experience. Upload prescriptions for AI identification and order essential medicines, vitamins, and first-aid kits directly to your doorstep."
            />
          </div>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="mt-8 space-y-8">
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <Lock className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-black text-[#1A365D] dark:text-white uppercase tracking-tight">Privacy Commitment</h3>
            </div>
            
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white/80 dark:bg-slate-900/80 p-8 space-y-6">
              <div className="space-y-4">
                <PrivacyPoint 
                  icon={Fingerprint} 
                  title="Your Data, Your Control" 
                  desc="We do not sell your personal health data to third-party advertisers. Most profile information is stored locally on your device or encrypted securely on Firebase servers." 
                />
                <PrivacyPoint 
                  icon={Database} 
                  title="Secure AI Processing" 
                  desc="Images uploaded for analysis (X-rays, Skin, Reports) are processed through secure API channels and are not used to train global public models without your explicit consent." 
                />
                <PrivacyPoint 
                  icon={ShieldCheck} 
                  title="HIPAA Aligned Standards" 
                  desc="We apply professional data handling standards to ensure your medical history and identity remain confidential." 
                />
              </div>
            </Card>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <Scale className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-black text-[#1A365D] dark:text-white uppercase tracking-tight">Terms & Conditions</h3>
            </div>
            
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white/80 dark:bg-slate-900/80 p-8">
              <div className="prose prose-sm dark:prose-invert max-w-full text-slate-600 dark:text-slate-400 space-y-4 font-medium">
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 leading-relaxed uppercase">
                    <strong>Critical Disclaimer:</strong> This application is for educational and informational purposes ONLY. AI analysis is NOT a definitive diagnosis. Always consult a certified physician for medical decisions. In case of emergency, call 112 immediately.
                  </p>
                </div>
                <p>By using this application, you agree to the following:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>You understand that AI can misinterpret data and results should be verified by a doctor.</li>
                  <li>Users must be 18 years or older to book consultations or order medicines.</li>
                  <li>We reserves the right to terminate accounts that misuse the AI for generating harmful content.</li>
                  <li>Subscription fees for premium consultations are non-refundable once the session has started.</li>
                </ul>
              </div>
            </Card>
          </section>

          <section className="text-center py-10 space-y-4">
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Have questions about your privacy?</p>
             <a href="mailto:privacy@medicalpartner.app" className="inline-flex items-center gap-2 text-primary font-black text-sm hover:underline">
               <Mail className="w-4 h-4" /> support@medicalpartner.app
             </a>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HighlightCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-4">
      <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
        <Icon className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-black text-[#1A365D] dark:text-white uppercase tracking-tight">{title}</p>
        <p className="text-xs font-bold text-slate-400 leading-snug">{desc}</p>
      </div>
    </div>
  );
}

function FeatureInfo({ icon: Icon, title, desc }: any) {
  return (
    <Card className="rounded-[2.2rem] border border-white dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-6 flex items-start gap-6 group hover:bg-white dark:hover:bg-slate-900 transition-all">
      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-110">
        <Icon className="w-7 h-7" />
      </div>
      <div className="space-y-2">
        <h4 className="text-lg font-black text-[#1A365D] dark:text-white uppercase tracking-tight">{title}</h4>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
      </div>
    </Card>
  );
}

function PrivacyPoint({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex gap-5">
      <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-black text-[#1A365D] dark:text-white uppercase tracking-tight">{title}</p>
        <p className="text-xs font-bold text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
