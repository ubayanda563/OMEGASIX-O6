import { ReactNode, useState, MouseEvent } from 'react';
import { motion } from 'motion/react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  withGlare?: boolean;
}

export function GlassPanel({ children, className = '', hover = false, withGlare = true }: GlassPanelProps) {
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!withGlare) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x, y });
  };

  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      className={`
        relative overflow-hidden rounded-2xl
        ${className}
      `}
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(50px) saturate(200%)',
        WebkitBackdropFilter: 'blur(50px) saturate(200%)',
        boxShadow: `
          0 40px 80px -20px var(--glass-shadow),
          0 10px 30px -10px var(--glass-shadow),
          inset 0 2px 3px -1px var(--glass-highlight),
          inset 0 -2px 4px -1px var(--glass-caustic),
          inset 0 0 0 1px var(--glass-border)
        `,
      }}
    >
      {/* Curved aqua reflection (wet look) */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none z-[6]"
        style={{
          height: '46%',
          borderRadius: '1rem 1rem 0.75rem 0.75rem / 1rem 1rem 0.375rem 0.375rem',
          background: 'linear-gradient(180deg, var(--reflection-start) 0%, var(--reflection-end) 100%)',
          margin: '1px',
        }}
      />

      {/* Interactive glare effect */}
      {withGlare && (
        <div
          className="absolute inset-0 pointer-events-none z-[5] rounded-2xl overflow-hidden transition-opacity duration-300"
          style={{
            opacity: isHovering ? 1 : 0,
            background: `radial-gradient(circle 90px at ${glarePosition.x}% ${glarePosition.y}%, var(--glare-color) 0%, transparent 100%)`,
            mixBlendMode: 'overlay',
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
