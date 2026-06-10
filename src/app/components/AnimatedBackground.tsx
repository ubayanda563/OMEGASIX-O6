import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';

export function AnimatedBackground() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base background */}
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{ background: isDark ? '#000000' : '#ffffff' }}
      />

      {/* Dark mode: Ember glow rising from bottom */}
      {isDark && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 100%, rgba(255, 69, 0, 0.6) 0%, transparent 60%),
              radial-gradient(circle at 50% 100%, rgba(255, 140, 0, 0.4) 0%, transparent 70%),
              radial-gradient(circle at 50% 100%, rgba(255, 215, 0, 0.3) 0%, transparent 80%)
            `,
          }}
        />
      )}

      {/* Light mode: Morning Haze */}
      {!isDark && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 100%, rgba(253, 224, 71, 0.4) 0%, transparent 60%),
              radial-gradient(circle at 50% 100%, rgba(251, 191, 36, 0.4) 0%, transparent 70%),
              radial-gradient(circle at 50% 100%, rgba(244, 114, 182, 0.5) 0%, transparent 80%)
            `,
          }}
        />
      )}

      {/* Drifting ambient blobs — sit on top of the haze gradient */}
      <motion.div
        animate={{ x: [0, '5%', '-5%', 0], y: [0, '10%', '5%', '-10%'], scale: [1, 1.05, 0.95, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] }}
        className="absolute -top-[10%] -left-[10%] rounded-full blur-[90px]"
        style={{ width: '50vw', height: '50vw', background: 'var(--blob-1)', opacity: isDark ? 0.18 : 0.22, willChange: 'transform' }}
      />
      <motion.div
        animate={{ x: [0, '-8%', '5%', 0], y: [0, '12%', '5%', '10%'], scale: [1, 1.1, 0.95, 1.05, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95], delay: 5 }}
        className="absolute -bottom-[10%] -right-[10%] rounded-full blur-[90px]"
        style={{ width: '45vw', height: '45vw', background: 'var(--blob-2)', opacity: isDark ? 0.2 : 0.18, willChange: 'transform' }}
      />
      <motion.div
        animate={{ x: [0, '6%', '-5%', 0], y: [0, '-8%', '5%', 0], scale: [1, 1.15, 1.05, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95], delay: 10 }}
        className="absolute top-[30%] left-[40%] rounded-full blur-[90px]"
        style={{ width: '35vw', height: '35vw', background: 'var(--blob-3)', opacity: isDark ? 0.12 : 0.14, willChange: 'transform' }}
      />
    </div>
  );
}
