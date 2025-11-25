'use client';
import { useEffect, useState } from 'react';
import { getHealthPlan, type HealthPlanOutput } from '../actions';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Sparkles, Utensils, Zap, Brain, Download, ArrowLeft, Terminal } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

function PlanSkeleton() {
    return (
        <div className="space-y-4">
            <div className="w-full h-24 bg-secondary rounded-lg animate-pulse"></div>
            <div className="space-y-3">
                {[...Array(7)].map((_, i) => (
                    <div key={i} className="w-full h-28 bg-secondary rounded-lg animate-pulse"></div>
                ))}
            </div>
        </div>
    );
}

export default function ViewHealthPlanPage() {
  const params = useParams();
  const planId = Array.isArray(params.planId) ? params.planId[0] : params.planId;
  const [plan, setPlan] = useState<HealthPlanOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlan() {
      if (!planId) return;
      try {
        setLoading(true);
        const fetchedPlan = await getHealthPlan(planId);
        if (fetchedPlan) {
          setPlan(fetchedPlan);
        } else {
          setError('The requested health plan could not be found. It may have expired. Please generate a new one.');
        }
      } catch (e) {
        setError('An unexpected error occurred while fetching your plan.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchPlan();
  }, [planId]);

  const downloadPlan = () => {
    if (!plan) return;

    let content = `${plan.planTitle}\n\n`;
    content += `SUMMARY:\n${plan.summary}\n\n`;
    content += "===================================\n\n";

    plan.daily_plans.forEach(day => {
        content += `${day.day.toUpperCase()}\n`;
        content += `- Diet: ${day.diet}\n`;
        content += `- Exercise: ${day.exercise}\n`;
        content += `- Wellness Tip: ${day.wellness_tip}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'My-AI-Health-Plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
            <div>
                 <Button variant="ghost" asChild>
                    <Link href="/health-score">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Planner
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight font-headline mt-2">Your AI Health Plan</h1>
            </div>
            {plan && (
                <Button onClick={downloadPlan}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Plan
                </Button>
            )}
        </div>
        
        {loading && <PlanSkeleton />}

        {error && !loading && (
             <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle className="text-destructive">Plan Not Found</CardTitle>
                    <CardDescription>
                    There was an issue loading your health plan.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                    <Terminal className="w-12 h-12 text-destructive" />
                    <p className="text-muted-foreground">{error}</p>
                    <Button asChild>
                        <Link href="/health-score">Generate a New Plan</Link>
                    </Button>
                </CardContent>
            </Card>
        )}

        {plan && !loading && (
             <div className="w-full space-y-4">
                <Alert className="border-primary/50 bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <AlertTitle className="text-primary font-bold">{plan.planTitle}</AlertTitle>
                    <AlertDescription className="text-foreground">
                      {plan.summary}
                    </AlertDescription>
                </Alert>
                <div className="space-y-3">
                {plan.daily_plans.map((dayPlan: any) => (
                    <Card key={dayPlan.day} className="bg-background/80 backdrop-blur-sm">
                        <CardHeader className="p-4">
                            <CardTitle className="text-lg">{dayPlan.day}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-3 text-sm">
                            <div className="flex items-start gap-3"><Utensils className="w-5 h-5 mt-0.5 text-primary"/><span><strong>Diet:</strong> {dayPlan.diet}</span></div>
                            <div className="flex items-start gap-3"><Zap className="w-5 h-5 mt-0.5 text-primary"/><span><strong>Exercise:</strong> {dayPlan.exercise}</span></div>
                            <div className="flex items-start gap-3"><Brain className="w-5 h-5 mt-0.5 text-primary"/><span><strong>Wellness:</strong> {dayPlan.wellness_tip}</span></div>
                        </CardContent>
                    </Card>
                ))}
                </div>
            </div>
        )}
    </div>
  );
}
