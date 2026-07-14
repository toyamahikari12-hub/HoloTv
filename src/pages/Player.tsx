import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import { useChannelStore } from '../store/channelStore';

export default function Player() {
  const { channelId } = useParams();
  const { channels } = useChannelStore();
  const navigate = useNavigate();
  
  const channel = channels.find((c) => c.id === channelId);

  if (!channel) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-white text-xl">Channel not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-pink-500 hover:text-pink-400 transition"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <VideoPlayer
        url={channel.streamUrl}
        title={channel.name}
        drmConfig={channel.drm}
      />

      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{channel.name}</h1>
          <p className="text-gray-400">{channel.description}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Status</p>
            <p className="text-white font-semibold">
              {channel.isLive ? '🔴 LIVE' : '⚫ OFFLINE'}
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Quality</p>
            <p className="text-white font-semibold">{channel.quality}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Category</p>
            <p className="text-white font-semibold capitalize">{channel.category}</p>
          </div>
          {channel.isLive && channel.viewers && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Viewers</p>
              <p className="text-white font-semibold">{channel.viewers.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}