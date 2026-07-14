import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ChannelCard from '../components/ChannelCard';
import { useChannelStore } from '../store/channelStore';
import { useNavigate } from 'react-router-dom';

export default function Channels() {
  const { channels, selectChannel } = useChannelStore();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['gaming', 'music', 'creative', 'talk'] as const;
  const filteredChannels = selectedCategory
    ? channels.filter((c) => c.category === selectedCategory)
    : channels;

  const handleChannelClick = (channel: any) => {
    selectChannel(channel);
    navigate(`/player/${channel.id}`);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-6">All Channels</h1>
        
        {/* Category Filter */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-full font-semibold transition-all whitespace-nowrap ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All
          </motion.button>
          
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition-all capitalize whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Channels Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredChannels.map((channel) => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            onClick={() => handleChannelClick(channel)}
          />
        ))}
      </motion.div>

      {filteredChannels.length === 0 && (
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-400 text-lg">No channels found in this category</p>
        </div>
      )}
    </div>
  );
}