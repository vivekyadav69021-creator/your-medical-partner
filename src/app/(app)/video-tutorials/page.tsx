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
  MessageCircle, 
  Stethoscope,
  Play,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Improved function to extract YouTube ID and get high-quality thumbnail
function getYouTubeThumbnail(url: string) {
    if (!url) return '';
    try {
        let videoId = '';
        // Handle various YouTube URL formats
        const match = url.match(/(?:v=|youtu\.be\/|embed\/|v\/|shorts\/)([A-Za-z0-9_-]{11})/);
        if (match && match[1]) {
            videoId = match[1];
        }
        
        if (videoId) {
            // Using maxresdefault for better quality, fallback to hqdefault
            return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
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
           return `https://www.youtube.com/embed/${match[1]}?rel=0&autoplay=1`;
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
    const videoIframe = document.getElementById('youtube-iframe') as HTMLIFrameElement;
    if (videoIframe) {
      videoIframe.src = '';
    }
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
    <div className="min-h-full bg-white dark:bg-slate-950 pb-32">
      <div className="max-w-xl mx-auto px-6 pt-6 space-y-6">
        
        {/* Navigation & Title */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" asChild className="h-10 w-10 rounded-full bg-gray-50 border border-gray-100">
            <Link href="/dashboard"><ChevronLeft className="h-6 w-6 text-gray-800" /></Link>
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white font-headline">Video Library</h1>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-gray-50 border border-gray-100">
            <Share2 className="h-5 w-5 text-gray-600" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input 
            placeholder="Search for health videos..." 
            className="pl-12 h-14 rounded-[1.5rem] border-none bg-gray-50 dark:bg-slate-900 shadow-sm placeholder:text-gray-400 text-gray-700 dark:text-gray-200" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <Button 
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className={cn(
                "rounded-full px-6 h-10 font-semibold transition-all whitespace-nowrap border-none",
                selectedCategory === 'all' ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-slate-900"
            )}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Button>
          {videoTutorialsData.map(category => (
            <Button 
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              className={cn(
                "rounded-full px-6 h-10 font-semibold transition-all whitespace-nowrap border-none",
                selectedCategory === category.id ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-slate-900"
              )}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.title.en}
            </Button>
          ))}
        </div>

        {/* Recommended Videos Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white px-1">Recommended Videos</h2>
          <div className="grid grid-cols-2 gap-5">
            {filteredVideos.map(video => {
              const thumbnailSrc = getYouTubeThumbnail(video.youtube_url);
              return (
                <div 
                    key={video.id} 
                    className="flex flex-col space-y-3 cursor-pointer group"
                    onClick={() => handleVideoClick(video as VideoTutorial)}
                >
                  <div className="aspect-[4/3] relative rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-slate-800 shadow-sm border border-gray-50 dark:border-slate-800">
                    {thumbnailSrc ? (
                      <Image
                        src={thumbnailSrc}
                        alt={video.title.en}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 30vw"
                        unoptimized // YouTube images sometimes block optimized requests
                      />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <PlayCircle className="w-8 h-8 text-gray-400" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-xl transform group-hover:scale-110 transition-transform">
                            <Play className="h-5 w-5 text-white fill-white ml-1" />
                        </div>
                    </div>
                  </div>
                  <div className="space-y-1 px-2">
                    <h3 className="text-[13px] font-bold text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug group-hover:text-primary transition-colors">{video.title.en}</h3>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium">
                        <span>10 min | {video.categoryTitle}</span>
                        <div className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span>10.3k views</span>
                        </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {filteredVideos.length === 0 && (
            <p className="text-center text-gray-400 py-10 italic">No videos found matching your search.</p>
          )}
        </div>

        {/* Bottom Navigation Buttons (Floating style as per image) */}
        <div className="fixed bottom-6 left-0 right-0 px-6 z-20 pointer-events-none">
            <div className="max-w-xl mx-auto flex gap-4 pointer-events-auto">
                <Button variant="outline" className="flex-1 h-14 rounded-full border-none bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 font-bold shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 text-primary" />
                    </div>
                    History
                </Button>
                <Button variant="outline" className="flex-1 h-14 rounded-full border-none bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 font-bold shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Stethoscope className="h-4 w-4 text-primary" />
                    </div>
                    AI Doctor
                </Button>
            </div>
        </div>

      </div>

      <Dialog open={!!selectedVideo} onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}>
        <DialogContent className="max-w-3xl w-full p-0 border-0 overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900">
            {selectedVideo && (
                <>
                    <div className="aspect-video bg-black overflow-hidden">
                        <iframe 
                            id="youtube-iframe"
                            src={getYouTubeEmbedUrl(selectedVideo.youtube_url)}
                            title={selectedVideo.title.en}
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    </div>
                    <div className="p-8">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">{selectedVideo.title.en}</DialogTitle>
                            <DialogDescription className="text-base text-gray-500 mt-2">
                                {selectedVideo.description.en}
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                </>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
