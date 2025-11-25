
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
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { PlayCircle, Video, Languages } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';

export default function VideoTutorialsPage() {
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  const handleVideoClick = (video: VideoTutorial) => {
    setSelectedVideo(video);
  };

  const handleCloseDialog = () => {
    setSelectedVideo(null);
  };
  
  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            {lang === 'en' ? 'Video Tutorials' : 'वीडियो ट्यूटोरियल'}
          </h1>
          <p className="text-muted-foreground">
            {lang === 'en' ? 'Learn from experts on a variety of health and wellness topics.' : 'विभिन्न स्वास्थ्य और कल्याण विषयों पर विशेषज्ञों से सीखें।'}
          </p>
        </div>
        <Button variant="outline" onClick={toggleLanguage}>
          <Languages className="mr-2 h-4 w-4" />
          {lang === 'en' ? 'हिंदी में देखें' : 'View in English'}
        </Button>
      </div>

      <Tabs defaultValue={videoTutorialsData[0].id} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {videoTutorialsData.map(category => (
            <TabsTrigger key={category.id} value={category.id}>{lang === 'en' ? category.title.en : category.title.hi}</TabsTrigger>
          ))}
        </TabsList>
        {videoTutorialsData.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="space-y-2 mb-6">
                <h2 className="text-2xl font-semibold tracking-tight">{lang === 'en' ? category.title.en : category.title.hi}</h2>
                <p className="text-muted-foreground">{lang === 'en' ? category.description.en : category.description.hi}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.videos.map(video => {
                const thumbnail = PlaceHolderImages.find(img => img.id === video.thumbnailId);
                return (
                  <Card
                    key={video.id}
                    className="cursor-pointer group hover:shadow-lg transition-shadow overflow-hidden"
                    onClick={() => handleVideoClick(video)}
                  >
                    <CardHeader className="p-0 relative">
                      {thumbnail ? (
                        <>
                          <Image
                            src={thumbnail.imageUrl}
                            alt={lang === 'en' ? video.title.en : video.title.hi}
                            width={400}
                            height={225}
                            className="aspect-video object-cover"
                            data-ai-hint={thumbnail.imageHint}
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
                      <CardTitle className="text-base font-semibold line-clamp-2">{lang === 'en' ? video.title.en : video.title.hi}</CardTitle>
                      <CardDescription className="text-sm mt-1 line-clamp-2">{lang === 'en' ? video.description.en : video.description.hi}</CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

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
