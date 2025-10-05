import React from 'react';
import { VideoCameraIcon, SignalIcon } from '../icons/Icons';

interface PublicLiveStreamProps {
  liveStreamUrl?: string;
}

const PublicLiveStream: React.FC<PublicLiveStreamProps> = ({ liveStreamUrl }) => {
  const getEmbedUrl = (url: string | undefined): string | null => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        const videoId = urlObj.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
      }
      if (urlObj.hostname.includes('youtu.be')) {
        const videoId = urlObj.pathname.slice(1);
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
      }
    } catch (error) {
      console.error("Invalid URL for live stream:", url);
      return null;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(liveStreamUrl);

  return (
    <section>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center">
        <VideoCameraIcon className="h-8 w-8 mr-3 text-red-500" />
        Live View
      </h2>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {embedUrl ? (
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={embedUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        ) : (
          <div className="aspect-w-16 aspect-h-9 flex flex-col items-center justify-center bg-gray-800 text-white p-8">
            <div className="relative flex items-center justify-center">
                <SignalIcon className="h-20 w-20 text-gray-600" />
                <div className="absolute top-0 right-0 -mr-2 -mt-2 px-3 py-1 bg-red-600 text-white text-sm font-bold uppercase rounded-full shadow-lg animate-pulse">
                    Live
                </div>
            </div>
            <h3 className="mt-6 text-2xl font-bold tracking-tight">NO LIVE MATCH CURRENTLY</h3>
            <p className="mt-2 text-gray-400 max-w-md text-center">
                Check back here during game time to watch the action unfold!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PublicLiveStream;