import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============ HEART CURSOR TRAIL ============
export function HeartCursor() {
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const idRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    document.body.classList.add("heart-cursor-active");
    let last = 0;
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const now = performance.now();
      if (now - last < 60) return;
      last = now;
      const id = ++idRef.current;
      setHearts((h) => [...h.slice(-12), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setHearts((h) => h.filter((p) => p.id !== id)), 900);
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.body.classList.remove("heart-cursor-active");
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <div
        className="absolute text-lg"
        style={{
          left: pos.x - 8,
          top: pos.y - 8,
          filter: "drop-shadow(0 0 6px oklch(0.7 0.18 25 / 0.8))",
        }}
      >
        ♥
      </div>
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          initial={{ opacity: 0.9, scale: 1, x: h.x - 6, y: h.y - 6 }}
          animate={{ opacity: 0, scale: 0.4, y: h.y - 40 }}
          transition={{ duration: 0.9 }}
          className="absolute text-rose-400 text-sm"
          style={{ color: "oklch(0.72 0.16 25)" }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
}

// ============ STARFIELD ============
export function Starfield({ density = 80, color = "white" }: { density?: number; color?: string }) {
  const stars = useMemo(
    () =>
      Array.from({ length: density }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 4,
        dur: 2 + Math.random() * 3,
      })),
    [density],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            background: color,
            boxShadow: `0 0 ${s.size * 4}px ${color}`,
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ============ FLOATING HEARTS ============
export function FloatingHearts({ count = 14 }: { count?: number }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        dur: 8 + Math.random() * 8,
        size: 12 + Math.random() * 18,
        opacity: 0.4 + Math.random() * 0.5,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{ y: "-15vh", opacity: [0, h.opacity, h.opacity, 0] }}
          transition={{ duration: h.dur, delay: h.delay, repeat: Infinity, ease: "easeInOut" }}
          className="absolute"
          style={{
            left: `${h.left}%`,
            fontSize: h.size,
            color: "oklch(0.72 0.16 25 / 0.85)",
            filter: "drop-shadow(0 0 8px oklch(0.7 0.18 25 / 0.5))",
          }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  );
}

// ============ DREAMY PARTICLES (warm) ============
export function DreamyParticles({ count = 50 }: { count?: number }) {
  const parts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 5,
        dur: 6 + Math.random() * 8,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {parts.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: [-20, -80, -20], opacity: [0, 0.9, 0], x: [0, 10, -10, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity }}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: "oklch(0.92 0.08 75)",
            boxShadow: `0 0 ${p.size * 5}px oklch(0.85 0.12 70 / 0.7)`,
          }}
        />
      ))}
    </div>
  );
}

// ============ SPARKLES burst ============
export function SparkleBurst({ trigger }: { trigger: number }) {
  const [items, setItems] = useState<number[]>([]);
  useEffect(() => {
    if (!trigger) return;
    const arr = Array.from({ length: 40 }, (_, i) => i + Date.now());
    setItems(arr);
    const t = setTimeout(() => setItems([]), 1600);
    return () => clearTimeout(t);
  }, [trigger]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[100]">
      {items.map((id) => {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const dx = (Math.random() - 0.5) * 300;
        const dy = (Math.random() - 0.5) * 300;
        return (
          <motion.span
            key={id}
            initial={{ x: `${x}vw`, y: `${y}vh`, opacity: 1, scale: 0 }}
            animate={{ x: `calc(${x}vw + ${dx}px)`, y: `calc(${y}vh + ${dy}px)`, opacity: 0, scale: 1.4 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute text-lg"
            style={{ color: "oklch(0.92 0.12 75)", filter: "drop-shadow(0 0 10px oklch(0.85 0.15 70))" }}
          >
            ✦
          </motion.span>
        );
      })}
    </div>
  );
}

// ============ FAKE POPUP NOTIFICATIONS ============
const POPUP_MSGS = [
  "bf dada detected.",
  "too handsome detected.",
  "warning : clingy gf nearby.",
  "you are cute unfortunately.",
  "suspicious cuteness levels.",
  "system overload : he smiled.",
];
export function FakePopups({ enabled = true }: { enabled?: boolean }) {
  const [popups, setPopups] = useState<{ id: number; msg: string }[]>([]);
  useEffect(() => {
    if (!enabled) return;
    const i = setInterval(() => {
      const id = Date.now();
      const msg = POPUP_MSGS[Math.floor(Math.random() * POPUP_MSGS.length)];
      setPopups((p) => [...p, { id, msg }]);
      setTimeout(() => setPopups((p) => p.filter((x) => x.id !== id)), 3500);
    }, 7000);
    return () => clearInterval(i);
  }, [enabled]);
  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[200] flex flex-col gap-2 max-w-[80vw]">
      <AnimatePresence>
        {popups.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}
            className="glass-warm px-4 py-2 rounded-2xl shadow-lg text-sm font-hand"
            style={{ color: "var(--ink)" }}
          >
            💌 {p.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ============ CINEMATIC TRANSITION OVERLAY ============
export function CinematicWipe({ show, color = "white" }: { show: boolean; color?: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="fixed inset-0 z-[300] pointer-events-none"
          style={{ background: color, backdropFilter: "blur(30px)" }}
        />
      )}
    </AnimatePresence>
  );
}