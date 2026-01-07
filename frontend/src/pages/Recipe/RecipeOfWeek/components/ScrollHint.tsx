import { motion } from "framer-motion";

export function ScrollHint() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 0.5, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="fixed bottom-8 text-[#3b6c55] text-[14px] flex items-center gap-2 z-20"
      style={{ right: "var(--side-padding)", fontWeight: 500 }}
    >
      <span>SCROLL</span>
    </motion.div>
  );
}
