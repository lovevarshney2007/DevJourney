import { Variants } from "framer-motion";

export const EASE_FAST = [0.16, 1, 0.3, 1]; // expo-out, "crisp" feel

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.18, ease: EASE_FAST } 
  },
};

export const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.035 } },
};

export const pressable: Variants = {
  rest: { scale: 1 },
  tap: { scale: 0.97, transition: { duration: 0.1, ease: EASE_FAST } },
};
