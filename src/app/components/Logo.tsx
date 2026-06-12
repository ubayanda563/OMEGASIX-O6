interface LogoProps {
  compact?: boolean;
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* O6 mark */}
      <div
        className="relative flex items-center justify-center flex-shrink-0"
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
          boxShadow: '0 4px 16px color-mix(in srgb, var(--accent-primary) 40%, transparent), inset 0 1px 1px rgba(255,255,255,0.3)',
        }}
      >
        <span
          style={{
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: '-0.5px',
            color: '#fff',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          O6
        </span>
      </div>

      {!compact && (
        <div className="flex flex-col leading-none">
          <span
            style={{
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: '-0.3px',
              color: 'var(--text-primary)',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Resonance
          </span>
          <span
            style={{
              fontWeight: 500,
              fontSize: 10,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            Offline Player
          </span>
        </div>
      )}
    </div>
  );
}
