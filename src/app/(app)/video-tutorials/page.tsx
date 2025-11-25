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
import { PlayCircle, Video } from 'lucide-react';

export default function VideoTutorialsPage() {
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);

  const handleVideoClick = (video: VideoTutorial) => {
    setSelectedVideo(video);
  };

  const handleCloseDialog = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Video Tutorials</h1>
        <p className="text-muted-foreground">
          Learn from experts on a variety of health and wellness topics.
        </p>
      </div>

      {videoTutorialsData.map(category => (
        <div key={category.id} className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{category.title}</h2>
            <p className="text-muted-foreground">{category.description}</p>
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
                          alt={video.title}
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
                    <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                    <CardDescription className="text-sm mt-1 line-clamp-3">{video.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      <Dialog open={!!selectedVideo} onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
            <DialogDescription>{selectedVideo?.description}</DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center mt-4">
            <p className="text-muted-foreground">Video player will be here soon.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
