
'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { videoTutorialsData, VideoTutorial } from '@/lib/video-data';
import { PlayCircle, Video, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

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
        console.error('Invalid YouTube URL for thumbnail:', url);
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
        // Fallback for non-standard URLs
        const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
        if (match && match[1]) {
           return `https://www.youtube.com/embed/${match[1]}?rel=0&autoplay=1`;
        }
    }
    // If no ID is found, return the original URL assuming it might be a playlist
    return url;
}


export default function VideoTutorialsPage() {
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleVideoClick = (video: VideoTutorial) => {
    setSelectedVideo(video);
  };

  const handleCloseDialog = () => {
    // To stop video playback when closing
    const videoIframe = document.getElementById('youtube-iframe') as HTMLIFrameElement;
    if (videoIframe) {
      videoIframe.src = '';
    }
    setSelectedVideo(null);
  };
  
  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  }
  
  const allVideos = videoTutorialsData.flatMap(category => category.videos.map(video => ({...video, categoryId: category.id, categoryTitle: category.title})));

  const filteredVideos = allVideos
    .filter(video => selectedCategory === 'all' || video.categoryId === selectedCategory)
    .filter(video => {
        const title = lang === 'en' ? video.title.en : video.title.hi;
        return title.toLowerCase().includes(searchTerm.toLowerCase());
    });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            {lang === 'en' ? 'Video Tutorials' : 'वीडियो ट्यूटोरियल'}
          </h1>
          <p className="text-muted-foreground">
            {lang === 'en' ? 'Learn from experts on a variety of health and wellness topics.' : 'विभिन्न स्वास्थ्य और कल्याण विषयों पर विशेषज्ञों से सीखें।'}
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={toggleLanguage}>
              <Languages className="mr-2 h-4 w-4" />
              {lang === 'en' ? 'हिंदी में' : 'In English'}
            </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder={lang === 'en' ? "Search videos..." : "वीडियो खोजें..."}
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
            <SelectItem value="all">{lang === 'en' ? 'All Categories' : 'सभी श्रेणियाँ'}</SelectItem>
            {videoTutorialsData.map(category => (
                <SelectItem key={category.id} value={category.id}>
                    {lang === 'en' ? category.title.en : category.title.hi}
                </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => {
            const thumbnailSrc = getYouTubeThumbnail(video.youtube_url);
            return (
              <Card
                key={video.id}
                className="cursor-pointer group hover:shadow-lg transition-shadow overflow-hidden"
                onClick={() => handleVideoClick(video)}
              >
                <CardHeader className="p-0 relative">
                  {thumbnailSrc ? (
                    <>
                      <Image
                        src={thumbnailSrc}
                        alt={lang === 'en' ? video.title.en : video.title.hi}
                        width={400}
                        height={225}
                        className="aspect-video object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <PlayCircle className="w-16 h-16 text-white/70 transform transition-transform group-hover:scale-110" />
                      </div>
                    </>
                  ) : (
                    <div className="aspect-video bg-secondary flex items-center justify-center">
                      <Video className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-xs font-semibold uppercase text-primary">{lang === 'en' ? video.categoryTitle.en : video.categoryTitle.hi}</p>
                  <CardTitle className="text-base font-semibold line-clamp-2 mt-1">{lang === 'en' ? video.title.en : video.title.hi}</CardTitle>
                  <CardDescription className="text-sm mt-1 line-clamp-2">{lang === 'en' ? video.description.en : video.description.hi}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
           {filteredVideos.length === 0 && (
                <p className="col-span-full text-center text-muted-foreground py-10">
                    {lang === 'en' ? 'No videos found.' : 'कोई वीडियो नहीं मिला।'}
                </p>
            )}
        </div>


      <Dialog open={!!selectedVideo} onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}>
        <DialogContent className="max-w-3xl w-full p-0 border-0">
            {selectedVideo && (
                <>
                    <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
                        <iframe 
                            id="youtube-iframe"
                            src={getYouTubeEmbedUrl(selectedVideo.youtube_url)}
                            title={lang === 'en' ? selectedVideo.title.en : selectedVideo.title.hi}
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    </div>
                    <div className="p-6 pt-2">
                        <DialogHeader>
                            <DialogTitle>{lang === 'en' ? selectedVideo.title.en : selectedVideo.title.hi}</DialogTitle>
                            <DialogDescription>{lang === 'en' ? selectedVideo.description.en : selectedVideo.description.hi}</DialogDescription>
                        </DialogHeader>
                    </div>
                </>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

    