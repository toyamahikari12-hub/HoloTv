import React from 'react';
import { motion } from 'framer-motion';
import ChannelCard from '../components/ChannelCard';
import { useChannelStore } from '../store/channelStore';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { channels, selectedChannel, selectChannel } = useChannelStore();
  const navigate = useNavigate();
  const liveChannels = channels.filter((c) => c.isLive);
  const offlineChannels = channels.filter((c) => !c.isLive);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const handleChannelClick = (channel: any) => {
    selectChannel(channel);
    navigate(`/player/${channel.id}`);
  };

  return (
    <div className="space-y-12">
      {/* Featured Section */}
      {selectedChannel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-pink-500/20 to-transparent border border-pink-500/20 cursor-pointer hover:border-pink-500/50 transition"
          onClick={() => navigate(`/player/${selectedChannel.id}`)}
        >
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <h2 className="text-4xl font-bold text-white mb-2">{selectedChannel.name}</h2>
            <p className="text-gray-300 mb-4">{selectedChannel.description}</p>
            {selectedChannel.isLive && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-500 font-semibold">
                  LIVE - {selectedChannel.viewers?.toLocaleString()} viewers
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Live Channels */}
      {liveChannels.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-gradient-to-b from-pink-500 to-purple-500 rounded" />
            Now Live
          </h3>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {liveChannels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                onClick={() => handleChannelClick(channel)}
              />
            ))}
          </motion.div>
        </div>
      )}

      {/* Offline Channels */}
      {offlineChannels.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-gray-600 rounded" />
            Upcoming
          </h3>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {offlineChannels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                onClick={() => handleChannelClick(channel)}
              />
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}