import { motion } from 'motion/react';
import { Home, Search, Library, Heart, Sun, Moon } from 'lucide-react';
import { GlassPanel } from './GlassPanel';
import { useTheme } from '../contexts/ThemeContext';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'library', icon: Library, label: 'Library' },
  { id: 'favorites', icon: Heart, label: 'Favorites' },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 z-50">
      <GlassPanel className="px-2 py-3" withGlare={false}>
        <div className="flex items-center justify-around relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="relative flex flex-col items-center gap-1 px-4 py-2 z-[2]"
                whileTap={{ scale: 0.92 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-pill"
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
                <Icon
                  size={20}
                  strokeWidth={2.2}
                  className={`transition-colors relative z-10 ${
                    isActive ? 'text-text-primary' : 'text-text-secondary'
                  }`}
                />
                <span
                  className={`text-xs transition-colors relative z-10 font-semibold ${
                    isActive ? 'text-text-primary' : 'text-text-muted'
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}

          {/* Theme toggle */}
          <motion.button
            onClick={toggleTheme}
            className="relative flex flex-col items-center gap-1 px-4 py-2 z-[2]"
            whileTap={{ scale: 0.92 }}
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <motion.div
                animate={{ rotate: theme === 'light' ? 0 : 90, scale: theme === 'light' ? 1 : 0, opacity: theme === 'light' ? 1 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="absolute"
              >
                <Sun size={20} strokeWidth={2.2} className="text-accent-secondary" />
              </motion.div>
              <motion.div
                animate={{ rotate: theme === 'dark' ? 0 : -90, scale: theme === 'dark' ? 1 : 0, opacity: theme === 'dark' ? 1 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="absolute"
              >
                <Moon size={20} strokeWidth={2.2} className="text-accent-tertiary" />
              </motion.div>
            </div>
            <span className="text-xs text-text-muted font-semibold">Theme</span>
          </motion.button>
        </div>
      </GlassPanel>
    </div>
  );
}
