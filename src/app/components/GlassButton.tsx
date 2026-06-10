import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  className?: string;
  variant?: 'default' | 'pill';
}

export function GlassButton({
  children,
  onClick,
  active = false,
  className = '',
  variant = 'default',
}: GlassButtonProps) {
  const baseStyles = variant === 'pill' ? 'rounded-full' : 'rounded-xl';

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className={`
        px-4 py-2.5 font-semibold text-[15px]
        transition-all duration-300
        relative overflow-hidden
        ${baseStyles}
        ${className}
      `}
      style={{
        background: active ? 'var(--pill-bg)' : 'var(--glass-bg)',
        backdropFilter: 'blur(50px) saturate(200%)',
        WebkitBackdropFilter: 'blur(50px) saturate(200%)',
        boxShadow: active ? 'var(--pill-shadow)' : `
          0 10px 30px -10px var(--glass-shadow),
          inset 0 1px 1px var(--glass-highlight),
          inset 0 0 0 1px var(--glass-border)
        `,
        color: 'var(--text-primary)',
      }}
    >
      {active && (
        <motion.div
          layoutId="button-pill"
          className="absolute inset-0 rounded-full"
          style={{
            background: 'var(--pill-bg)',
            boxShadow: 'var(--pill-shadow)',
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
          }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
