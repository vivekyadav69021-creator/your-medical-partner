'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShieldCheck, 
  Info, 
  Lock, 
  HeartPulse, 
  Scale, 
  Stethoscope, 
  Scan, 
  BrainCircuit, 
  Store,
  Fingerprint,
  Database,
  AlertTriangle,
  Mail,
  Zap,
  Sparkles,
  User,
  Cpu
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-32 animate-in fade-in duration-700 px-1 pt-4">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="h-24 w-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner border border-primary/20">
          <HeartPulse className="w-12 h-12 text-primary animate-pulse" />
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-black text-[#1A365D] dark:text-white tracking-tighter uppercase">Your Medical Partner</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Version 2.0.1 Stable • Professional Edition</p>
        </div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The ultimate AI-driven healthcare ecosystem, providing medically-vetted intelligence, advanced diagnostics, and holistic wellness tools in your pocket.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/40 dark:border-slate-800/40 shadow-sm">
          <TabsTrigger value="overview" className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="features" className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">All Features</TabsTrigger>
          <TabsTrigger value="privacy" className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Privacy & Legal</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-8 space-y-6">
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-white/80 dark:bg-slate-900/80 p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl font-black text-[#1A365D] dark:text-white uppercase tracking-tight flex items-center gap-3">
                <Info className="w-6 h-6 text-primary" /> Our Story
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              <p>
                <strong>Your Medical Partner</strong> was founded by <strong>Shailesh Yadav</strong> with a vision to democratize high-quality medical information. We bridge the gap between complex clinical data and patient understanding.
              </p>
              <p>
                Our platform utilizes proprietary <strong>Fine-tuned AI Models</strong> optimized specifically for medical interpretation, ensuring that every user has a reliable first point of contact for their health concerns.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <HighlightCard icon={User} title="Founder" desc="Shailesh Yadav" />
                <HighlightCard icon={Cpu} title="AI Technology" desc="Proprietary Fine-tuned Models" />
                <HighlightCard icon={ShieldCheck} title="High Authority" desc="Vetted by elite medical institutions." />
                <HighlightCard icon={Zap} title="Instant Intel" desc="Real-time analysis of clinical data." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="mt-8 space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <Scan className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-black text-[#1A365D] dark:text-white uppercase tracking-wider">Smart AI Diagnostics</h3>
            </div>
            <div className="grid gap-4">
              <FeatureDetail title="X-Ray Vision" desc="Deep radiographic analysis using neural networks to identify structural issues and joint spaces." />
              <FeatureDetail title="Skin & Face Scanner" desc="Dermatological analysis that identifies skin conditions and provides personalized OTC suggestions." />
              <FeatureDetail title="Lab Report Specialist" desc="Converts complex blood work into simple language, identifying biomarkers and health plans." />
              <FeatureDetail title="Injury & Emergency SOS" desc="Assesses severity of traumatic injuries and provides immediate first-aid steps." />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <Stethoscope className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-black text-[#1A365D] dark:text-white uppercase tracking-wider">Consultation & Store</h3>
            </div>
            <div className="grid gap-4">
              <FeatureDetail title="Tele-Consultation Hub" desc="Direct booking to top-tier Indian and International specialists via video call." />
              <FeatureDetail title="Smart Medical Store" desc="Pharmacy with AI prescription recognition to identify and order medicines instantly." />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <BrainCircuit className="w-5 h-5 text-teal-500" />
              <h3 className="text-lg font-black text-[#1A365D] dark:text-white uppercase tracking-wider">Wellness & Intelligence</h3>
            </div>
            <div className="grid gap-4">
              <FeatureDetail title="AI Health Assistant" desc="Polyglot voice assistant with expert modes using global data sources." />
              <FeatureDetail title="AI Psychiatrist" desc="A safe, empathetic space for mental health discussions in your native language." />
              <FeatureDetail title="Meditation & Yoga" desc="AI-suggested meditation and a comprehensive library of yoga poses with instructions." />
            </div>
          </div>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="mt-8 space-y-8">
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <Lock className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-black text-[#1A365D] dark:text-white uppercase tracking-tight">Data Protection Policy</h3>
            </div>
            
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white/80 dark:bg-slate-900/80 p-8 space-y-6">
              <PrivacyPoint icon={Fingerprint} title="Local-First Identity" desc="Most of your medical profile data is stored on your device. Only essential records are encrypted in the cloud." />
              <PrivacyPoint icon={Database} title="No Data Monetization" desc="Your history, X-rays, and reports are NEVER sold. Your health privacy is our highest priority." />
              <PrivacyPoint icon={ShieldCheck} title="Secure AI Processing" desc="Processed by our fine-tuned internal models; your data is never used to train public datasets." />
            </Card>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <Scale className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-black text-[#1A365D] dark:text-white uppercase tracking-tight">Terms & Disclaimer</h3>
            </div>
            
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white/80 dark:bg-slate-900/80 p-8">
              <div className="prose prose-sm dark:prose-invert max-w-full text-slate-600 dark:text-slate-400 space-y-4 font-medium">
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 leading-relaxed uppercase">
                    <strong>Critical Medical Disclaimer:</strong> This application is an informational tool only. AI analysis is NOT a clinical diagnosis. Founder **Shailesh Yadav** advises verifying all results with a human physician.
                  </p>
                </div>
                <ul className="list-disc pl-5 space-y-3">
                  <li>User must be 18+ to book medical consultations.</li>
                  <li>We do not provide direct prescriptions; AI findings must be reviewed by a doctor.</li>
                  <li>Misuse of AI for self-harm will result in account termination.</li>
                </ul>
              </div>
            </Card>
          </section>

          <section className="text-center py-10 space-y-4">
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Founded by Shailesh Yadav</p>
             <a href="mailto:support@medicalpartner.app" className="inline-flex items-center gap-2 text-primary font-black text-sm hover:underline">
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

function FeatureDetail({ title, desc }: { title: string, desc: string }) {
  return (
    <Card className="rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 hover:shadow-md transition-all group">
      <div className="flex items-center gap-4 mb-2">
        <div className="h-2 w-2 rounded-full bg-primary group-hover:scale-150 transition-transform" />
        <h4 className="text-base font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight">{title}</h4>
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed pl-6">
        {desc}
      </p>
    </Card>
  );
}

function PrivacyPoint({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex gap-5 items-start">
      <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0 shadow-sm">
        <Icon className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-black text-[#1A365D] dark:text-white uppercase tracking-tight">{title}</p>
        <p className="text-xs font-bold text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
