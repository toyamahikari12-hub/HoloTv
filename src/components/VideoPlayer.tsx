import React, { useEffect, useRef, useState } from 'react';
import dashjs from 'dash.js';
import shaka from 'shaka-player';
import { Play, Pause, Volume2, Settings, Maximize, Download } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  title: string;
  drmConfig?: {
    type: 'widevine' | 'playready' | 'fairplay';
    licenseUrl: string;
    headers?: Record<string, string>;
  };
}

export default function VideoPlayer({ url, title, drmConfig }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const playerRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    if (!videoRef.current) return;

    const initializePlayer = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (drmConfig) {
          await initShakaPlayer();
        } else {
          initDashPlayer();
        }
      } catch (err) {
        console.error('Player initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize player');
      } finally {
        setIsLoading(false);
      }
    };

    initializePlayer();

    return () => {
      if (playerRef.current) {
        if (playerRef.current.destroy) {
          playerRef.current.destroy();
        }
      }
    };
  }, [url, drmConfig]);

  const initShakaPlayer = async () => {
    if (!videoRef.current) return;

    try {
      await shaka.polyfill.installAll();

      if (!shaka.Player.isBrowserSupported()) {
        setError('Shaka Player tidak didukung di browser ini');
        return;
      }

      const player = new shaka.Player();
      playerRef.current = player;

      await player.attach(videoRef.current);

      if (drmConfig) {
        player.configure({
          drm: {
            servers: {
              'com.widevine.alpha': drmConfig.licenseUrl,
              'com.microsoft.playready': drmConfig.licenseUrl,
              'com.apple.fps.1_0': drmConfig.licenseUrl,
            },
            advanced: {
              'com.widevine.alpha': {
                videoRobustness: 'SW_SECURE_CRYPTO',
                audioRobustness: 'SW_SECURE_CRYPTO',
              },
            },
          },
        });

        if (drmConfig.headers) {
          player.getNetworkingEngine().registerRequestFilter((type, request) => {
            if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
              request.headers = { ...request.headers, ...drmConfig.headers };
            }
          });
        }
      }

      await player.load(url);
      console.log('Stream loaded successfully with Shaka Player');
    } catch (err) {
      console.error('Error loading stream:', err);
      setError(err instanceof Error ? err.message : 'Failed to load stream');
    }
  };

  const initDashPlayer = () => {
    if (!videoRef.current) return;

    try {
      const player = dashjs.MediaPlayer().create();
      playerRef.current = player;

      player.initialize(videoRef.current, url, true);

      player.updateSettings({
        streaming: {
          bufferingTimeMax: 8,
          bufferingTimeMin: 4,
          jumpGaps: true,
          stallThreshold: 0.5,
        },
      });

      console.log('Stream loaded successfully with dash.js');
    } catch (err) {
      console.error('Error loading stream:', err);
      setError(err instanceof Error ? err.message : 'Failed to load stream');
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      if (videoRef.current.buffered.length > 0) {
        setBuffered(videoRef.current.buffered.end(videoRef.current.buffered.length - 1));
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current?.parentElement) {
      videoRef.current.parentElement.requestFullscreen?.();
    }
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return '0:00';
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours ? hours + ':' : ''}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full bg-black rounded-xl overflow-hidden group">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/50 backdrop-blur-sm z-50 rounded-xl">
          <div className="text-center text-white">
            <p className="text-lg font-semibold">❌ Error</p>
            <p className="text-sm mt-2 max-w-md">{error}</p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
            <p className="text-white text-sm">Loading stream...</p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Custom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="relative h-1 bg-gray-700 rounded cursor-pointer group/progress">
            <div
              className="absolute h-full bg-gray-500 rounded"
              style={{ width: `${(buffered / duration) * 100}%` }}
            />
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="absolute w-full h-full opacity-0 cursor-pointer"
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-pink-500 rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition pointer-events-none"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-300 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button
              onClick={handlePlayPause}
              className="text-white hover:text-pink-500 transition transform hover:scale-110"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 group/volume">
              <Volume2 size={20} className="text-white" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/volume:w-24 transition-all h-1 bg-gray-700 rounded cursor-pointer accent-pink-500"
              />
              <span className="text-xs text-gray-300 w-8">{Math.round(volume * 100)}%</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Playback Speed */}
            <select
              value={playbackRate}
              onChange={(e) => {
                const rate = parseFloat(e.target.value);
                setPlaybackRate(rate);
                if (videoRef.current) videoRef.current.playbackRate = rate;
              }}
              className="bg-transparent text-white text-sm hover:text-pink-500 transition cursor-pointer"
            >
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>

            <button className="text-white hover:text-pink-500 transition">
              <Settings size={20} />
            </button>
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-pink-500 transition"
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Title Overlay */}
      <div className="absolute top-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <h2 className="text-white text-lg font-semibold truncate">{title}</h2>
      </div>
    </div>
  );
}