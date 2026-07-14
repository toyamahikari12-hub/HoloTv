import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useChannelStore } from '../store/channelStore';
import type { Channel } from '../store/channelStore';

interface ChannelCardProps {
  channel: Channel;
  onClick: () => void;
}

export default function ChannelCard({ channel, onClick }: ChannelCardProps) {
  const { favorites, toggleFavorite } = useChannelStore();
  const isFavorite = favorites.includes(channel.id);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden cursor-pointer border border-gray-700 hover:border-pink-500/50 transition"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-0 group-hover:opacity-100 transition" />

      {/* Card Content */}
      <div className="p-6 h-48 flex flex-col justify-between relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="text-4xl">{channel.icon}</div>
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(channel.id);
            }}
            className={`p-2 rounded-full transition ${
              isFavorite ? 'bg-pink-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </motion.button>
        </div>

        {/* Footer */}
        <div>
          <h3 className="text-lg font-bold text-white truncate">{channel.name}</h3>
          <p className="text-sm text-gray-400 truncate">{channel.description}</p>

          {/* Status Badge */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {channel.isLive ? (
              <>
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-red-500">
                  LIVE - {channel.viewers?.toLocaleString()}
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-gray-500 rounded-full" />
                <span className="text-xs font-semibold text-gray-500">OFFLINE</span>
              </>
            )}
            <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-1 rounded ml-auto">
              {channel.quality}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}