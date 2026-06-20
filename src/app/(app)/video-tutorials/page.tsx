'use client';

import { useState } from 'react';
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
  DialogDescription,
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
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// Improved function to extract YouTube ID and get high-quality thumbnail
function getYouTubeThumbnail(url: string) {
    if (!url) return '';
    try {
        let videoId = '';
        const match = url.match(/(?:v=|youtu\.be\/|embed\/|v\/|shorts\/)([A-Za-z0-9_-]{11})/);
        if (match && match[1]) {
            videoId = match[1];
        }
        if (videoId) {
            return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
        return '';
    } catch (e) {
        return '';
    }
}

function getYouTubeEmbedUrl(url: string | null): string {
    if (!url) return '';
    try {
        const match = url.match(/(?:v=|youtu\.be\/|embed\/|v\/|shorts\/)([A-Za-z0-9_-]{11})/);
        if (match && match[1]) {
           return `https://www.youtube.com/embed/${match[1]}?rel=0&autoplay=1&modestbranding=1`;
        }
    } catch (e) {}
    return url;
}

export default function VideoTutorialsPage() {
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleVideoClick = (video: VideoTutorial) => {
    setSelectedVideo(video);
  };

  const handleCloseDialog = () => {
    setSelectedVideo(null);
  };
  
  const allVideos = videoTutorialsData.flatMap(category => 
    category.videos.map(video => ({
        ...video, 
        categoryId: category.id, 
        categoryTitle: category.title.en 
    }))
  );

  const filteredVideos = allVideos
    .filter(video => selectedCategory === 'all' || video.categoryId === selectedCategory)
    .filter(video => {
        const title = video.title.en.toLowerCase();
        return title.includes(searchTerm.toLowerCase());
    });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pb-40 font-body">
      {/* Header - Native Style */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <div className="h-10 w-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-lg font-black text-[#1A365D] dark:text-white uppercase leading-none tracking-tighter">Health Vision</h1>
            <div className="flex items-center gap-1">
                <div className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Medical Learning Feed</p>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <Share2 className="h-4 w-4 text-slate-500" />
        </Button>
      </header>

      <div className="max-w-2xl mx-auto pt-6 space-y-8 px-4">
        
        {/* Modern Search Bar */}
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/5 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Search health tutorials..." 
              className="pl-14 h-16 rounded-[2rem] border-none bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/40 dark:shadow-none placeholder:text-slate-400 text-base font-bold transition-all focus-visible:ring-primary/10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Category Pills - Horizontal Scroll */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
               <Filter className="w-3 h-3" /> Filter Topics
             </h3>
          </div>
          <ScrollArea className="w-full whitespace-nowrap pb-4">
            <div className="flex gap-2.5">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={cn(
                    "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                    selectedCategory === 'all' 
                      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                      : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800"
                )}
              >
                All Videos
              </button>
              {videoTutorialsData.map(category => (
                <button 
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                    selectedCategory === category.id 
                      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                      : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800"
                  )}
                >
                  {category.title.en}
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </div>

        {/* Video Feed Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-black text-[#1A365D] dark:text-white tracking-tight">Recommended For You</h2>
            <Badge variant="outline" className="rounded-full text-[8px] font-black uppercase border-primary/20 bg-primary/5 text-primary tracking-widest px-3 py-1">
              {filteredVideos.length} Results
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {filteredVideos.map((video, idx) => {
              const thumbnailSrc = getYouTubeThumbnail(video.youtube_url);
              return (
                <div 
                    key={video.id} 
                    className="group flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards"
                    style={{ animationDelay: `${idx * 100}ms` }}
                    onClick={() => handleVideoClick(video as VideoTutorial)}
                >
                  {/* Premium Video Thumbnail Card */}
                  <div className="aspect-video relative rounded-[2.5rem] overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-2xl transition-transform active:scale-[0.98] cursor-pointer">
                    <Image
                      src={thumbnailSrc || `https://picsum.photos/seed/${video.id}/1280/720`}
                      alt={video.title.en}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                      sizes="(max-width: 768px) 100vw, 800px"
                      unoptimized
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    
                    {/* Duration Badge */}
                    <div className="absolute bottom-6 right-6 px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-xl border border-white/20 flex items-center gap-2">
                        <Clock className="w-3 h-3 text-white" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">10:00</span>
                    </div>

                    {/* Category Overlay */}
                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-primary/90 backdrop-blur-md rounded-full shadow-xl">
                        <span className="text-[8px] font-black text-white uppercase tracking-widest">{video.categoryTitle}</span>
                    </div>

                    {/* Centered Play Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-16 w-16 rounded-[2rem] bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/40 shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-500">
                            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-inner">
                                <Play className="h-6 w-6 text-primary fill-primary ml-1" />
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Metadata & Title */}
                  <div className="px-3 flex gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/5">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <h3 className="text-lg font-black text-[#1A365D] dark:text-slate-100 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {video.title.en}
                        </h3>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">12K Views</span>
                            </div>
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">2 Days ago</span>
                        </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredVideos.length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-20 w-20 bg-slate-100 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center text-slate-300">
                    <Search className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No matching videos</p>
                    <p className="text-[10px] font-bold text-slate-300 uppercase">Try a different search term</p>
                </div>
                <Button variant="link" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} className="text-primary font-black uppercase text-[10px] tracking-widest">Clear Filters</Button>
            </div>
          )}
        </div>

        {/* Footer Brand Label */}
        <div className="py-10 text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Verified Medical Education</span>
            </div>
            <p className="text-[8px] font-bold text-slate-300 uppercase max-w-[200px] mx-auto leading-relaxed">
                All content is vetted by health professionals for educational accuracy.
            </p>
        </div>
      </div>

      {/* Full-Screen Video Modal - Improved for Mobile */}
      <Dialog open={!!selectedVideo} onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}>
        <DialogContent className="max-w-4xl w-[95vw] h-fit max-h-[90vh] p-0 border-none overflow-hidden rounded-[3rem] bg-white dark:bg-[#0f172a] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
            {selectedVideo && (
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="aspect-video bg-black relative group/player">
                        <iframe 
                            src={getYouTubeEmbedUrl(selectedVideo.youtube_url)}
                            title={selectedVideo.title.en}
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                        <button 
                            onClick={handleCloseDialog}
                            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover/player:opacity-100 transition-opacity"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none text-[8px] font-black uppercase tracking-widest px-3">Official Tutorial</Badge>
                                    <Badge variant="outline" className="border-slate-200 text-slate-400 text-[8px] font-black uppercase tracking-widest px-3">HD Ready</Badge>
                                </div>
                                <h2 className="text-2xl font-black text-[#1A365D] dark:text-white tracking-tight leading-tight">
                                    {selectedVideo.title.en}
                                </h2>
                            </div>

                            <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Video Insight
                                </h4>
                                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {selectedVideo.description.en}
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <Button className="flex-1 h-14 rounded-2xl bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all">
                                    <Share2 className="w-4 h-4 mr-2" /> Share Lesson
                                </Button>
                                <Button variant="outline" onClick={handleCloseDialog} className="flex-1 h-14 rounded-2xl border-slate-200 dark:border-slate-800 font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">
                                    Minimize
                                </Button>
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

function X(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
