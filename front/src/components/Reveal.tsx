import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  as?: 'div' | 'section' | 'span' | 'p' | 'h1' | 'h2';
};

/** Scroll-triggered fade-up. Honors prefers-reduced-motion. */
export function Reveal({ children, delay = 0, y = 24, as = 'div' }: Props) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;

  return (
    <Comp
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}
