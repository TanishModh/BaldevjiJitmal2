import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Agnes Toth luxury ease: cubic-bezier(.22, 1, .36, 1)
const AGNES_EASE = [0.22, 1, 0.36, 1];

export function MotionFade({ children, delay = 0, y = 14, duration = 0.6, className = '' }) {
  const shouldReduceMotion = useReducedMotion();
  const [forceVisible, setForceVisible] = useState(false);

  // Safety fallback: guaranteed visibility even if IntersectionObserver fails on reload
  useEffect(() => {
    const timer = setTimeout(() => setForceVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={forceVisible ? { opacity: 1, y: 0 } : undefined}
      whileInView={{ opacity: 1, y: 0 }}
      onViewportEnter={() => setForceVisible(true)}
      viewport={{ once: true, margin: '140px 0px 60px 0px', amount: 'some' }}
      transition={{ duration, delay, ease: AGNES_EASE }}
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
  y = 14,
  duration = 0.7,
  blur = '6px',
  className = '',
}) {
  const shouldReduceMotion = useReducedMotion();
  const [forceVisible, setForceVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setForceVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y, filter: `blur(${blur})` }}
      animate={forceVisible ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      onViewportEnter={() => setForceVisible(true)}
      viewport={{ once: true, margin: '140px 0px 60px 0px', amount: 'some' }}
      transition={{ duration, delay, ease: AGNES_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionStagger({ children, delay = 0, stagger = 0.06, className = '' }) {
  const shouldReduceMotion = useReducedMotion();
  const [forceVisible, setForceVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setForceVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

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
      animate={forceVisible ? 'show' : undefined}
      whileInView="show"
      onViewportEnter={() => setForceVisible(true)}
      viewport={{ once: true, margin: '140px 0px 60px 0px', amount: 'some' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionItem({ children, className = '' }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: AGNES_EASE,
      },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
