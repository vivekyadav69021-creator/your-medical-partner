'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { videoTutorialsData, VideoTutorial } from '@/lib/video-data';
import { 
  PlayCircle, 
  ChevronLeft, 
  Search, 
  Play,
  Share2,
  Clock,
  Eye,
  CheckCircle2,
  Filter,
  Sparkles,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  MoreVertical,
  X,
  Send,
  User,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

// --- UTILS ---
function getYouTubeThumbnail(url: string, quality: 'max' | 'sd' = 'max') {
    if (!url) return '';
    const match = url.match(/(?:v=|youtu\.be\/|embed\/|v\/|shorts\/)([A-Za-z0-9_-]{11})/);
    const videoId = match ? match[1] : '';
    if (videoId) {
        return quality === 'max' 
            ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
            : `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    return '';
}

function getYouTubeEmbedUrl(url: string | null): string {
    if (!url) return '';
    const match = url.match(/(?:v=|youtu\.be\/|embed\/|v\/|shorts\/)([A-Za-z0-9_-]{11})/);
    if (match && match[1]) {
       return `https://www.youtube.com/embed/${match[1]}?rel=0&autoplay=1&modestbranding=1&controls=1`;
    }
    return url || '';
}

// --- MAIN COMPONENT ---
export default function VideoTutorialsPage() {
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Interactive States
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, string[]>>({});
  const [newComment, setNewComment] = useState('');

  const handleVideoClick = (video: any) => {
    setSelectedVideo(video);
  };

  const handleLike = (videoId: string) => {
    setLikes(prev => ({ ...prev, [videoId]: !prev[videoId] }));
  };

  const postComment = (videoId: string) => {
    if (!newComment.trim()) return;
    setComments(prev => ({
        ...prev,
        [videoId]: [newComment, ...(prev[videoId] || [])]
    }));
    setNewComment('');
  };

  const allVideos = useMemo(() => 
    videoTutorialsData.flatMap(category => 
        category.videos.map(video => ({
            ...video, 
            categoryId: category.id, 
            categoryTitle: category.title.en 
        }))
    ), []);

  const filteredVideos = allVideos
    .filter(video => selectedCategory === 'all' || video.categoryId === selectedCategory)
    .filter(video => {
        const title = video.title.en.toLowerCase();
        return title.includes(searchTerm.toLowerCase());
    });

  const shortsVideos = allVideos.slice(0, 8); // Showing more shorts

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] pb-40 font-body overflow-x-hidden safe-top">
      
      {/* Premium Header - Removed AI and Profile icons */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#020617]/95 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <div className="h-10 w-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-sm">
                <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-lg font-black text-[#1A365D] dark:text-white uppercase leading-none tracking-tighter">Health Vision</h1>
            <div className="flex items-center gap-1">
                <div className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Global Feed</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="w-full">
        
        {/* Full-width Search Section */}
        <div className="px-4 pt-6 pb-2">
            <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                <Input 
                    placeholder="Search tutorials, first-aid, yoga..." 
                    className="pl-14 h-16 rounded-full border-none bg-slate-50 dark:bg-slate-900 text-base font-bold transition-all focus-visible:ring-2 focus-visible:ring-primary/20" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* Dynamic Category Scroll */}
        <ScrollArea className="w-full whitespace-nowrap p-4">
            <div className="flex gap-2.5">
              {['all', ...videoTutorialsData.map(c => c.id)].map(catId => (
                <button 
                  key={catId}
                  onClick={() => setSelectedCategory(catId)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                    selectedCategory === catId 
                      ? "bg-[#1A365D] dark:bg-primary text-white shadow-xl" 
                      : "bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-transparent"
                  )}
                >
                  {catId === 'all' ? 'Explore All' : videoTutorialsData.find(c => c.id === catId)?.title.en}
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>

        {/* --- SHORTS SECTION --- */}
        <section className="py-6 border-y border-slate-50 dark:border-slate-800/50 my-2">
            <div className="px-4 mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-1 bg-red-500 rounded-full" />
                    <h2 className="text-lg font-black text-[#1A365D] dark:text-white uppercase tracking-tight">Health Shorts</h2>
                </div>
            </div>
            <ScrollArea className="w-full whitespace-nowrap px-4">
                <div className="flex gap-4">
                    {shortsVideos.map((short) => (
                        <div 
                            key={`short-${short.id}`} 
                            className="w-36 aspect-[9/16] relative rounded-3xl overflow-hidden shadow-xl shrink-0 group cursor-pointer active:scale-95 transition-transform"
                            onClick={() => handleVideoClick(short)}
                        >
                            <Image 
                                src={getYouTubeThumbnail(short.youtube_url, 'sd')} 
                                alt="Short" 
                                fill 
                                className="object-cover transition-transform duration-700 group-hover:scale-110" 
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-3 right-3 text-white">
                                <p className="text-[10px] font-black leading-tight line-clamp-2 uppercase">{short.title.en}</p>
                                <p className="text-[7px] font-bold text-white/60 mt-1 uppercase flex items-center gap-1">
                                    <Eye className="w-2 h-2" /> 50K Views
                                </p>
                            </div>
                            <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <Play className="h-3 w-3 text-white fill-white" />
                            </div>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
        </section>

        {/* --- MAIN IMMERSIVE FEED (Edge-to-Edge) --- */}
        <section className="space-y-4">
            {filteredVideos.map((video, idx) => (
                <div 
                    key={video.id} 
                    className="flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-700 w-full cursor-pointer group"
                    onClick={() => handleVideoClick(video)}
                >
                    {/* Full Width Edge-to-Edge Thumbnail */}
                    <div className="aspect-video relative w-full overflow-hidden bg-slate-100 dark:bg-slate-900 group-active:opacity-90">
                        <Image
                            src={getYouTubeThumbnail(video.youtube_url)}
                            alt={video.title.en}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-1000"
                            unoptimized
                        />
                        <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/80 backdrop-blur-md rounded text-[9px] font-black text-white uppercase tracking-widest">
                            10:00
                        </div>
                    </div>

                    {/* Meta Data Row */}
                    <div className="p-5 flex gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 border border-blue-100/50 shadow-sm">
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1 min-w-0">
                            <h3 className="text-base font-black text-[#1A365D] dark:text-slate-100 leading-tight truncate uppercase tracking-tight">
                                {video.title.en}
                            </h3>
                            <div className="flex items-center gap-2 text-slate-400">
                                <span className="text-[9px] font-black uppercase tracking-widest text-primary">Your Medical Partner</span>
                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                <span className="text-[9px] font-bold uppercase tracking-tighter">240K Views • 1 Year ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </section>

        {filteredVideos.length === 0 && (
            <div className="py-40 flex flex-col items-center justify-center text-center px-6">
                <Search className="w-16 h-16 text-slate-200 mb-4" />
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">No matching results</h3>
                <p className="text-[10px] text-slate-300 mt-1 uppercase">Try checking your spelling or selecting another category</p>
                <Button variant="link" onClick={() => {setSearchTerm(''); setSelectedCategory('all');}} className="mt-4 text-primary font-black uppercase tracking-widest text-xs">Clear All</Button>
            </div>
        )}
      </div>

      {/* --- PREMIUM WATCH SCREEN DIALOG --- */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-screen-2xl w-full h-full p-0 border-none rounded-none bg-white dark:bg-[#020617] overflow-hidden flex flex-col shadow-2xl z-[100]">
            {selectedVideo && (
                <div className="flex flex-col h-full">
                    {/* Fixed Video Player Area */}
                    <div className="w-full aspect-video bg-black relative group/player shrink-0">
                        <iframe 
                            src={getYouTubeEmbedUrl(selectedVideo.youtube_url)}
                            title={selectedVideo.title.en}
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                        {/* Close button inside player area for quick exit */}
                        <div className="absolute top-4 right-4">
                            <Button variant="ghost" size="icon" onClick={() => setSelectedVideo(null)} className="rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Scrollable Watch Info & Endless Suggestions */}
                    <ScrollArea className="flex-1">
                        <div className="pb-40">
                            {/* Title & Stats Section */}
                            <div className="p-5 space-y-4">
                                <h2 className="text-xl font-black text-[#1A365D] dark:text-white leading-tight uppercase tracking-tight">
                                    {selectedVideo.title.en}
                                </h2>
                                <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-tighter">
                                    <span>2.5M Views</span>
                                    <span>•</span>
                                    <span>Dec 2024</span>
                                    <span className="ml-auto text-primary font-black text-[11px] tracking-widest">#HealthVision</span>
                                </div>

                                {/* Action Buttons Grid (YouTube Style) */}
                                <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => handleLike(selectedVideo.id)}
                                        className={cn("rounded-full h-11 px-6 border-slate-100 dark:border-slate-800 gap-2", likes[selectedVideo.id] && "bg-primary text-white border-primary")}
                                    >
                                        <ThumbsUp className={cn("h-4 w-4", likes[selectedVideo.id] && "fill-white")} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{likes[selectedVideo.id] ? 'Liked' : '1.2K'}</span>
                                    </Button>
                                    <Button variant="outline" className="rounded-full h-11 px-6 border-slate-100 dark:border-slate-800 gap-2">
                                        <Share2 className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Share</span>
                                    </Button>
                                    <Button variant="outline" className="rounded-full h-11 px-6 border-slate-100 dark:border-slate-800 gap-2">
                                        <Bookmark className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Save</span>
                                    </Button>
                                </div>
                            </div>

                            <div className="h-2 bg-slate-50 dark:bg-slate-900/50" />

                            {/* Creator / Description Section */}
                            <div className="p-5 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-11 w-11 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                                            <CheckCircle2 className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-[#1A365D] dark:text-white uppercase tracking-tight">Your Medical Partner</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Official Clinic • Verified</p>
                                        </div>
                                    </div>
                                    <Button className="rounded-full h-10 px-6 font-black uppercase text-[10px] tracking-widest shadow-xl">Consult Specialist</Button>
                                </div>

                                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {selectedVideo.description.en}
                                    </p>
                                </div>
                            </div>

                            <div className="h-2 bg-slate-50 dark:bg-slate-900/50" />

                            {/* --- REAL WORKING COMMENTS SECTION --- */}
                            <div className="p-5 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[11px] font-black uppercase text-[#1A365D] dark:text-slate-100 tracking-[0.2em]">Community Feedback</h4>
                                    <span className="text-[10px] font-bold text-slate-400">{(comments[selectedVideo.id]?.length || 0) + 2} Comments</span>
                                </div>

                                {/* Input Box */}
                                <div className="flex items-start gap-4">
                                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black shrink-0">Y</div>
                                    <div className="flex-1 space-y-3">
                                        <Textarea 
                                            placeholder="Add a medical query or feedback..." 
                                            className="min-h-[80px] rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus-visible:ring-1 focus-visible:ring-primary/20 text-xs font-bold p-4" 
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                        />
                                        <div className="flex justify-end">
                                            <Button 
                                                size="sm" 
                                                onClick={() => postComment(selectedVideo.id)}
                                                className="rounded-full h-9 px-6 bg-primary font-black uppercase text-[9px] tracking-widest shadow-lg shadow-primary/20"
                                            >
                                                <Send className="h-3 w-3 mr-2" /> Post
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Comments List */}
                                <div className="space-y-6 pt-4">
                                    {(comments[selectedVideo.id] || []).map((c, i) => (
                                        <div key={`user-c-${i}`} className="flex gap-4 animate-in slide-in-from-top-2">
                                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black shrink-0">Y</div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-primary uppercase">You</span>
                                                    <span className="text-[8px] font-bold text-slate-300 uppercase">Just Now</span>
                                                </div>
                                                <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed">{c}</p>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <div className="flex gap-4">
                                        <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black shrink-0">D</div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-[#1A365D] dark:text-slate-100 uppercase">Dr. Shivam Yadav</span>
                                                <Badge className="bg-primary/10 text-primary text-[6px] h-3.5 uppercase font-black px-1.5">Official</Badge>
                                                <span className="text-[8px] font-bold text-slate-300 uppercase">2 Hours Ago</span>
                                            </div>
                                            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed">This is a great instructional video. Please remember to consult in person for specific concerns.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="h-2 bg-slate-50 dark:bg-slate-900/50" />

                            {/* --- UNLIMITED RECOMMENDATIONS (All Library Videos) --- */}
                            <div className="p-5 space-y-6">
                                <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Endless Health Vision</h4>
                                <div className="space-y-5">
                                    {allVideos.filter(v => v.id !== selectedVideo.id).map((rec) => (
                                        <div 
                                            key={`rec-${rec.id}`} 
                                            className="flex gap-4 group cursor-pointer active:opacity-70"
                                            onClick={() => {
                                                setSelectedVideo(rec);
                                                // Scroll to top of the watch content
                                                const scrollViewport = document.querySelector('[data-radix-scroll-area-viewport]');
                                                if (scrollViewport) scrollViewport.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                        >
                                            <div className="w-40 aspect-video relative rounded-2xl overflow-hidden shrink-0 shadow-md">
                                                <Image src={getYouTubeThumbnail(rec.youtube_url, 'sd')} alt="Rec" fill className="object-cover" unoptimized />
                                                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-[7px] font-black text-white">10:00</div>
                                            </div>
                                            <div className="space-y-1 min-w-0 py-1">
                                                <h5 className="text-[12px] font-black text-[#1A365D] dark:text-white leading-tight line-clamp-2 uppercase tracking-tight">{rec.title.en}</h5>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Medical Partner • Verified</p>
                                                <p className="text-[7px] font-bold text-slate-300 uppercase">240K Views • 1 Year ago</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
