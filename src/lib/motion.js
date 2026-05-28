export const ease = [0.25, 0.1, 0.25, 1]

export const duration = {
  fast: 0.18,
  normal: 0.28,
  slow: 0.4,
}

export const spring = { type: 'spring', stiffness: 420, damping: 32 }

export const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
}

export const fadeDown = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
}

export const slideInLeft = {
  initial: { opacity: 0, x: -14 },
  animate: { opacity: 1, x: 0 },
}

export const stagger = {
  container: {
    initial: {},
    animate: {
      transition: { staggerChildren: 0.05, delayChildren: 0.08 },
    },
  },
  item: {
    initial: { opacity: 0, y: 8 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: duration.normal, ease },
    },
  },
}

export const tap = { scale: 0.98 }
export const hoverLift = { y: -2 }

export function transition(delay = 0) {
  return { duration: duration.normal, ease, delay }
}
