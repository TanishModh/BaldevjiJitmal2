import React from 'react';
import { motion } from 'framer-motion';

// Agnes Toth luxury ease: cubic-bezier(.22, 1, .36, 1)
const AGNES_EASE = [0.22, 1, 0.36, 1];

export function MotionFade({ children, delay = 0, y = 14, duration = 0.6, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -25px 0px' }}
      transition={{ duration, delay, ease: AGNES_EASE }}
      style={{ willChange: 'opacity, transform' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Agnes Toth signature de-blur veil reveal: text materializes from a soft blur into crisp focus
export function MotionBlurFade({
  children,
  delay = 0,
  y = 18,
  duration = 0.9,
  blur = '8px',
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: `blur(${blur})` }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -25px 0px' }}
      transition={{ duration, delay, ease: AGNES_EASE }}
      style={{ willChange: 'opacity, transform, filter' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionStagger({ children, delay = 0, stagger = 0.08, className = '' }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -25px 0px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionItem({ children, className = '' }) {
  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: AGNES_EASE,
      },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      style={{ willChange: 'opacity, transform' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
