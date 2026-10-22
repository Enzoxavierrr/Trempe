import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';

type Props = {
  size?: string;
  color?: string;
  inline?: boolean;
  pulse?: boolean;
  style?: CSSProperties;
};

/**
 * The signature "brasa" (ember) dot — appears after key headlines.
 * Pulses subtly to feel like a living coal.
 */
export function BrasaDot({
  size = '0.14em',
  color = 'var(--brasa)',
  inline = true,
  pulse = true,
  style,
}: Props) {
  const base: CSSProperties = {
    display: inline ? 'inline-block' : 'block',
    width: size,
    height: size,
    borderRadius: '50%',
    background: color,
    marginLeft: inline ? '0.08em' : 0,
    verticalAlign: 'baseline',
    ...style,
  };

  if (!pulse) return <span aria-hidden="true" style={base} />;

  return (
    <motion.span
      aria-hidden="true"
      style={base}
      animate={{
        boxShadow: [
          `0 0 0 0 ${color}00`,
          `0 0 0 0.35em ${color}22`,
          `0 0 0 0 ${color}00`,
        ],
        opacity: [1, 0.85, 1],
      }}
      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}
