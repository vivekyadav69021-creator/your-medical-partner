
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
import { videoTutorialsData, VideoTutorial, VideoCategory } from '@/lib/video-data';
import { PlayCircle, Video, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function getYouTubeThumbnail(url: string) {
    const videoId = url.split('embed/')[1];
    if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return ''; // Fallback for invalid URLs
}


export default function VideoTutorialsPage() {
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleVideoClick = (video: VideoTutorial) => {
    setSelectedVideo(video);
  };

  const handleCloseDialog = () => {
    setSelectedVideo(null);
  };
  
  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  }
  
  const allVideos = videoTutorialsData.flatMap(category => category.videos.map(video => ({...video, categoryId: category.id, categoryTitle: category.title})));

  const filteredVideos = selectedCategory === 'all'
    ? allVideos
    : allVideos.filter(video => video.categoryId === selectedCategory);


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
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
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
            <Button variant="outline" onClick={toggleLanguage}>
              <Languages className="mr-2 h-4 w-4" />
              {lang === 'en' ? 'हिंदी में' : 'In English'}
            </Button>
        </div>
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
                    {lang === 'en' ? 'No videos found for this category.' : 'इस श्रेणी के लिए कोई वीडियो नहीं मिला।'}
                </p>
            )}
        </div>


      <Dialog open={!!selectedVideo} onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}>
        <DialogContent className="max-w-3xl w-full">
            {selectedVideo && (
                <>
                    <DialogHeader>
                        <DialogTitle>{lang === 'en' ? selectedVideo.title.en : selectedVideo.title.hi}</DialogTitle>
                        <DialogDescription>{lang === 'en' ? selectedVideo.description.en : selectedVideo.description.hi}</DialogDescription>
                    </DialogHeader>
                    <div className="aspect-video bg-secondary rounded-lg overflow-hidden mt-4">
                        <iframe 
                            src={selectedVideo.youtube_url}
                            title={lang === 'en' ? selectedVideo.title.en : selectedVideo.title.hi}
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    </div>
                </>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
