
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
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

function getYouTubeThumbnail(url: string) {
    try {
        const urlObject = new URL(url);
        let videoId = urlObject.searchParams.get('v');
        if (urlObject.hostname === 'youtu.be') {
            videoId = urlObject.pathname.slice(1);
        } else if (url.includes('embed/')) {
            videoId = url.split('embed/')[1];
        }
        
        if (videoId) {
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
        const urlObject = new URL(url);
        let videoId = urlObject.searchParams.get('v');
         if (urlObject.hostname === 'youtu.be') {
            videoId = urlObject.pathname.slice(1);
        } else if (url.includes('embed/')) {
            videoId = url.split('embed/')[1];
        }
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`;
        }
    } catch (e) {
        const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
        if (match && match[1]) {
           return `https://www.youtube.com/embed/${match[1]}?rel=0&autoplay=1`;
        }
    }
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
    <div className="min-h-full bg-white pb-24">
      <div className="max-w-xl mx-auto px-6 pt-6 space-y-6">
        
        {/* Navigation & Title */}
        <div className="space-y-4">
          <Button variant="ghost" size="icon" asChild className="-ml-2 h-10 w-10 rounded-full">
            <Link href="/dashboard"><ChevronLeft className="h-6 w-6 text-gray-800" /></Link>
          </Button>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 font-headline">Video Tutorials</h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input 
            placeholder="Search for health videos..." 
            className="pl-12 h-14 rounded-2xl border-none bg-gray-50 shadow-sm placeholder:text-gray-400 text-gray-700" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button 
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className={cn(
                "rounded-lg px-6 h-10 font-semibold transition-all whitespace-nowrap",
                selectedCategory === 'all' ? "bg-primary text-white" : "border-gray-100 bg-white text-gray-500 hover:bg-gray-50"
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
                "rounded-lg px-6 h-10 font-semibold transition-all whitespace-nowrap",
                selectedCategory === category.id ? "bg-primary text-white" : "border-gray-100 bg-white text-gray-500 hover:bg-gray-50"
              )}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.title.en}
            </Button>
          ))}
        </div>

        {/* Recommended Videos Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Recommended Videos</h2>
          <div className="grid grid-cols-2 gap-4">
            {filteredVideos.map(video => {
              const thumbnailSrc = getYouTubeThumbnail(video.youtube_url);
              return (
                <div 
                    key={video.id} 
                    className="flex flex-col space-y-3 cursor-pointer group"
                    onClick={() => handleVideoClick(video as VideoTutorial)}
                >
                  <div className="aspect-[4/3] relative rounded-3xl overflow-hidden bg-gray-100 shadow-sm border border-gray-50">
                    {thumbnailSrc && (
                      <Image
                        src={thumbnailSrc}
                        alt={video.title.en}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                            <Play className="h-6 w-6 text-white fill-white ml-1" />
                        </div>
                    </div>
                  </div>
                  <div className="space-y-1 px-1">
                    <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug">{video.title.en}</h3>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium">
                        <span>10 min | {video.categoryTitle}</span>
                        <span>10.3k</span>
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

        {/* Bottom Navigation Buttons (Fixed Style) */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-lg border-t border-gray-50 flex gap-4 max-w-xl mx-auto z-20">
            <Button variant="outline" className="flex-1 h-14 rounded-full border-gray-100 bg-white text-gray-700 font-bold shadow-sm flex items-center justify-center gap-3">
                <MessageCircle className="h-5 w-5 text-primary" />
                Chat History
            </Button>
            <Button variant="outline" className="flex-1 h-14 rounded-full border-gray-100 bg-white text-gray-700 font-bold shadow-sm flex items-center justify-center gap-3">
                <Stethoscope className="h-5 w-5 text-primary" />
                Chat with AI Doctor
            </Button>
        </div>

      </div>

      <Dialog open={!!selectedVideo} onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}>
        <DialogContent className="max-w-3xl w-full p-0 border-0 overflow-hidden rounded-[2.5rem]">
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
