import { motion } from 'motion/react';
import { Home, Search, Library, Heart, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { GlassPanel } from './GlassPanel';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'library', icon: Library, label: 'Library' },
  { id: 'favorites', icon: Heart, label: 'Favorites' },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="hidden md:flex flex-col gap-4 p-4 w-64 h-full">
      <GlassPanel className="flex-1 p-4">
        <div className="flex flex-col gap-2 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="relative px-4 py-3 rounded-full text-left transition-colors group z-[2]"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.92 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-pill"
                    className="absolute inset-0 rounded-full z-[1]"
                    style={{
                      background: 'var(--pill-bg)',
                      boxShadow: 'var(--pill-shadow)',
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 25,
                      mass: 0.8,
                    }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-3">
                  <Icon
                    size={20}
                    strokeWidth={2.2}
                    className={`transition-colors ${
                      isActive ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'
                    }`}
                  />
                  <span
                    className={`transition-colors font-semibold text-[15px] ${
                      isActive ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </GlassPanel>

      <GlassPanel className="p-4">
        <motion.button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-3 rounded-full hover:bg-glass-bg/30 transition-colors"
          whileTap={{ scale: 0.92 }}
        >
          <span className="text-text-primary text-[15px] font-semibold">Theme</span>
          <div className="relative w-10 h-10 flex items-center justify-center">
            <motion.div
              animate={{
                rotate: theme === 'light' ? 0 : 90,
                scale: theme === 'light' ? 1 : 0,
                opacity: theme === 'light' ? 1 : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
              }}
              className="absolute"
            >
              <Sun size={20} strokeWidth={2.2} className="text-accent-secondary" />
            </motion.div>
            <motion.div
              animate={{
                rotate: theme === 'dark' ? 0 : -90,
                scale: theme === 'dark' ? 1 : 0,
                opacity: theme === 'dark' ? 1 : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
              }}
              className="absolute"
            >
              <Moon size={20} strokeWidth={2.2} className="text-accent-tertiary" />
            </motion.div>
          </div>
        </motion.button>
      </GlassPanel>
    </div>
  );
}
