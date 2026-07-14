import React from 'react';
import { Home, Tv, Star, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Tv, label: 'Channels', path: '/channels' },
  { icon: Star, label: 'Favorites', path: '/favorites' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-black/50 backdrop-blur-md border-r border-pink-500/20 pt-24 p-6 z-40 overflow-y-auto">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 8 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                    : 'text-gray-300 hover:bg-gray-800/50'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <motion.button
        whileHover={{ x: 8 }}
        className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800/50 rounded-lg transition-all mt-8"
      >
        <LogOut size={20} />
        <span className="font-medium">Logout</span>
      </motion.button>
    </aside>
  );
}