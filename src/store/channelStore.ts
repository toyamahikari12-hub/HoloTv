import { create } from 'zustand';

export interface Channel {
  id: string;
  name: string;
  icon: string;
  streamUrl: string;
  description: string;
  category: 'gaming' | 'music' | 'creative' | 'talk';
  drm?: {
    type: 'widevine' | 'playready' | 'fairplay';
    licenseUrl: string;
    headers?: Record<string, string>;
  };
  isLive: boolean;
  viewers?: number;
  quality: 'SD' | 'HD' | '4K' | 'AUTO';
}

interface ChannelStore {
  channels: Channel[];
  selectedChannel: Channel | null;
  favorites: string[];
  selectChannel: (channel: Channel) => void;
  toggleFavorite: (channelId: string) => void;
  setChannels: (channels: Channel[]) => void;
}

export const useChannelStore = create<ChannelStore>((set) => ({
  channels: [
    {
      id: 'miko',
      name: 'Sakura Miko',
      icon: '🌸',
      streamUrl: 'https://example.com/stream/miko.mpd',
      description: 'Shrine Maiden of Hololive',
      category: 'gaming',
      isLive: true,
      viewers: 25000,
      quality: 'HD',
      drm: {
        type: 'widevine',
        licenseUrl: 'https://example.com/license/widevine',
      },
    },
    {
      id: 'suisei',
      name: 'Hoshimachi Suisei',
      icon: '⭐',
      streamUrl: 'https://example.com/stream/suisei.mpd',
      description: 'Comet of Hololive',
      category: 'music',
      isLive: false,
      quality: '4K',
      drm: {
        type: 'playready',
        licenseUrl: 'https://example.com/license/playready',
      },
    },
    {
      id: 'aqua',
      name: 'Minato Aqua',
      icon: '💎',
      streamUrl: 'https://example.com/stream/aqua.mpd',
      description: 'Genius Shrine Priestess',
      category: 'gaming',
      isLive: true,
      viewers: 18000,
      quality: 'AUTO',
      drm: {
        type: 'widevine',
        licenseUrl: 'https://example.com/license/widevine',
      },
    },
    {
      id: 'fubuki',
      name: 'Shirakami Fubuki',
      icon: '🦊',
      streamUrl: 'https://example.com/stream/fubuki.mpd',
      description: 'White Fox Goddess',
      category: 'creative',
      isLive: true,
      viewers: 22000,
      quality: 'HD',
    },
    {
      id: 'pekora',
      name: 'Usada Pekora',
      icon: '🐰',
      streamUrl: 'https://example.com/stream/pekora.mpd',
      description: 'Usada Conglomerate President',
      category: 'gaming',
      isLive: false,
      quality: 'AUTO',
    },
    {
      id: 'haato',
      name: 'Akai Haato',
      icon: '🎎',
      streamUrl: 'https://example.com/stream/haato.mpd',
      description: 'Hololive 1st Gen',
      category: 'talk',
      isLive: true,
      viewers: 15000,
      quality: 'HD',
    },
  ],
  selectedChannel: null,
  favorites: [],
  selectChannel: (channel) => set({ selectedChannel: channel }),
  toggleFavorite: (channelId) =>
    set((state) => ({
      favorites: state.favorites.includes(channelId)
        ? state.favorites.filter((id) => id !== channelId)
        : [...state.favorites, channelId],
    })),
  setChannels: (channels) => set({ channels }),
}));