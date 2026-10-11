"use client";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function Splash({ minMs = 900 }: { minMs?: number }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), minMs);
    return () => clearTimeout(t);
  }, [minMs]);
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_50%_40%,#f5f0ff_0%,#e8deff_100%)] dark:bg-[radial-gradient(ellipse_at_50%_40%,#2a1d44_0%,#100a1a_100%)]"
      data-testid="splash"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src="/brand/logo.svg"
            alt="Kopi"
            className="h-24 w-auto drop-shadow-[0_18px_30px_rgba(124,58,237,0.35)]"
          />
        </motion.div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-6 text-3xl font-bold tracking-tight text-ink"
      >
        Kopi
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-2 text-sm text-muted"
      >
        Desk d&apos;impression — Kinshasa
      </motion.p>
      <div className="mt-8 h-1 w-28 overflow-hidden rounded-full bg-line">
        <div className="kopi-shimmer-bar h-full w-1/2 rounded-full bg-brand" />
      </div>
    </div>
  );
}
