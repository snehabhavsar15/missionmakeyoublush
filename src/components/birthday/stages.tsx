import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DreamyParticles, FloatingHearts, Starfield, SparkleBurst } from "./effects";
import photo1 from "@/assets/photo1.jpg";
import photo2 from "@/assets/photo2.jpg";
import photo3 from "@/assets/photo3.jpg";
import cakeImg from "@/assets/cake.jpg";

// ===== STAGE 1: LOADING =====
export function LoadingStage({ onDone }: { onDone: () => void }) {
  const messages = [
    "initializing birthday surprise…",
    "checking if bf dada is cute enough…",
    "access granted 💌",
  ];
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const msgI = setInterval(() => setIdx((i) => Math.min(i + 1, messages.length - 1)), 1600);
    const prog = setInterval(() => setProgress((p) => Math.min(100, p + 2)), 90);
    const done = setTimeout(onDone, 5400);
    return () => {
      clearInterval(msgI);
      clearInterval(prog);
      clearTimeout(done);
    };
  }, []);
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "var(--gradient-dark)" }}>
      <Starfield density={120} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 30%, oklch(0 0 0 / 0.6))" }} />
      <div className="relative z-10 text-center max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
          className="mb-12 font-serif-display text-white/80 italic text-lg tracking-wide"
        >
          a love-letter, but make it cinematic
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="font-hand text-2xl text-glow-soft mb-8"
            style={{ color: "oklch(0.95 0.05 80)" }}
          >
            {messages[idx]}
          </motion.p>
        </AnimatePresence>
        <div className="h-[3px] w-full rounded-full overflow-hidden" style={{ background: "oklch(1 0 0 / 0.1)" }}>
          <motion.div
            className="h-full"
            style={{ background: "var(--gradient-gold)", boxShadow: "0 0 20px oklch(0.85 0.15 70)" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
      </div>
      <div className="absolute bottom-6 left-6 text-xs font-sans tracking-widest text-white/40">
        missionmakeyoublush.exe
      </div>
    </div>
  );
}

// ===== STAGE 2: PASSWORD =====
const WRONG_MSGS = ["wrong password idiot 😭", "try again cutoo", "suspicious behavior detected."];
export function PasswordStage({ onCorrect }: { onCorrect: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const tap = (n: string) => {
    if (code.length >= 4) return;
    const next = code + n;
    setCode(next);
    setError("");
    if (next.length === 4) {
      if (next === "0306") {
        setTimeout(onCorrect, 350);
      } else {
        setError(WRONG_MSGS[Math.floor(Math.random() * WRONG_MSGS.length)]);
        setShake(true);
        setTimeout(() => {
          setCode("");
          setShake(false);
        }, 700);
      }
    }
  };
  return (
    <div className="relative min-h-screen flex items-center justify-center px-5 py-10" style={{ background: "var(--gradient-dark)" }}>
      <Starfield density={80} />
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className={`glass relative z-10 w-full max-w-sm rounded-3xl p-7 ${shake ? "shake" : ""}`}
        style={{ boxShadow: "0 0 80px oklch(0.6 0.1 50 / 0.3)" }}
      >
        <h1 className="font-serif-display text-3xl text-white text-glow-soft tracking-wide mb-1 text-center">restricted access</h1>
        <p className="text-white/60 text-center font-hand text-lg mb-6">only harshu can enter.</p>

        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full transition-all"
              style={{
                background: code.length > i ? "oklch(0.85 0.15 70)" : "oklch(1 0 0 / 0.15)",
                boxShadow: code.length > i ? "0 0 12px oklch(0.85 0.15 70)" : "none",
              }}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
            <KeypadBtn key={n} onClick={() => tap(n)}>{n}</KeypadBtn>
          ))}
          <div />
          <KeypadBtn onClick={() => tap("0")}>0</KeypadBtn>
          <KeypadBtn onClick={() => { setCode(""); setError(""); }}>✕</KeypadBtn>
        </div>

        <div className="h-6 mt-4 text-center text-rose-300 font-hand text-base">
          <AnimatePresence>
            {error && (
              <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {error}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
function KeypadBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="glass rounded-2xl aspect-square text-2xl text-white font-serif-display transition-all active:scale-95 hover:bg-white/15"
      style={{ boxShadow: "inset 0 0 20px oklch(1 0 0 / 0.05)" }}
    >
      {children}
    </button>
  );
}

// ===== Wrapper for warm pastel pages =====
function WarmStage({ children, hearts = true }: { children: React.ReactNode; hearts?: boolean }) {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "var(--gradient-dream)" }}>
      <DreamyParticles count={40} />
      {hearts && <FloatingHearts count={10} />}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-5 py-12">{children}</div>
    </div>
  );
}

function NextBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="btn-cinematic mt-8 px-7 py-3 rounded-full font-serif-display text-lg tracking-wide text-white"
      style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow)" }}
    >
      {children}
    </button>
  );
}

// ===== STAGE 3: MAIN BIRTHDAY =====
export function MainStage({ onNext }: { onNext: () => void }) {
  return (
    <WarmStage>
      <div className="text-center max-w-2xl">
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4 }} className="font-serif-display italic text-xl md:text-2xl mb-8" style={{ color: "var(--ink)" }}>
          "some people become home accidentally."
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.4 }}
          className="font-serif-display text-5xl md:text-7xl font-semibold leading-[1.05] mb-5 text-glow"
          style={{ color: "var(--primary)" }}
        >
          HAPPY BIRTHDAY<br/>CUTOOO 🎂
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 1 }} className="font-hand text-2xl" style={{ color: "var(--rose)" }}>
          i love this headache 😭
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 1 }}>
          <NextBtn onClick={onNext}>continue cutoo →</NextBtn>
        </motion.div>
      </div>
    </WarmStage>
  );
}

// ===== STAGE 4: CANDLE =====
export function CandleStage({ onNext }: { onNext: () => void }) {
  const [blown, setBlown] = useState(false);
  const [shake, setShake] = useState(false);
  const [burst, setBurst] = useState(0);
  const blow = () => {
    setBlown(true);
    setShake(true);
    setBurst(Date.now());
    setTimeout(() => setShake(false), 600);
  };
  return (
    <WarmStage hearts={false}>
      <SparkleBurst trigger={burst} />
      <div className={`text-center w-full max-w-md ${shake ? "shake" : ""}`}>
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-serif-display italic text-3xl mb-6" style={{ color: "var(--ink)" }}>
          make a wish cutoo.
        </motion.h2>
        <div className="relative mx-auto w-[280px] h-[280px] md:w-[360px] md:h-[360px] mb-2">
          <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, oklch(0.85 0.15 75 / 0.6), transparent 60%)", filter: "blur(20px)" }} />
          <img src={cakeImg} alt="birthday cake" className="relative rounded-3xl w-full h-full object-cover" style={{ boxShadow: "var(--shadow-soft), 0 0 80px oklch(0.85 0.15 70 / 0.4)" }} />
          {/* candle flames overlay */}
          {!blown && (
            <div className="absolute top-[12%] left-1/2 -translate-x-1/2 flex gap-6">
              {[0,1,2].map(i => (
                <span key={i} className="flicker text-3xl" style={{ filter: "drop-shadow(0 0 14px oklch(0.85 0.2 75))" }}>🔥</span>
              ))}
            </div>
          )}
          {blown && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.9, 0], y: -80 }} transition={{ duration: 2 }} className="absolute top-[10%] left-1/2 -translate-x-1/2 text-5xl">
              💨
            </motion.div>
          )}
        </div>
        {!blown ? (
          <button onClick={blow} className="btn-cinematic mt-6 px-7 py-3 rounded-full font-serif-display text-lg text-white" style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow)" }}>
            blow candles
          </button>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <p className="font-hand text-2xl mt-4" style={{ color: "var(--rose)" }}>wish granted ✨</p>
            <NextBtn onClick={onNext}>next →</NextBtn>
          </motion.div>
        )}
      </div>
    </WarmStage>
  );
}

// ===== STAGE 5: DO YOU MISS ME =====
const MISS_POPUPS = ["wrong.", "illegal option.", "don't lie.", "be serious."];
export function MissMeStage({ onNext }: { onNext: () => void }) {
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [popups, setPopups] = useState<{ id: number; msg: string; x: number; y: number }[]>([]);
  const [yes, setYes] = useState(false);
  const dodge = () => {
    const x = (Math.random() - 0.5) * 280;
    const y = (Math.random() - 0.5) * 180;
    setNoPos({ x, y });
    const id = Date.now();
    const msg = MISS_POPUPS[Math.floor(Math.random() * MISS_POPUPS.length)];
    setPopups((p) => [...p, { id, msg, x: Math.random() * 70 + 10, y: Math.random() * 60 + 15 }]);
    setTimeout(() => setPopups((p) => p.filter((x) => x.id !== id)), 1800);
  };
  return (
    <WarmStage>
      <div className="text-center w-full max-w-md relative">
        <h2 className="font-serif-display text-4xl md:text-5xl mb-10" style={{ color: "var(--primary)" }}>
          do you miss me?
        </h2>
        <div className="relative flex items-center justify-center gap-6 h-32">
          <motion.button
            whileHover={{ scale: 1.08 }}
            onClick={() => setYes(true)}
            className="px-8 py-4 rounded-full text-xl font-serif-display text-white"
            style={{ background: "var(--rose)", boxShadow: "0 0 30px oklch(0.7 0.18 25 / 0.5)" }}
          >
            YES 💗
          </motion.button>
          <motion.button
            animate={{ x: noPos.x, y: noPos.y }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onMouseEnter={dodge}
            onTouchStart={dodge}
            onClick={dodge}
            className="px-8 py-4 rounded-full text-xl font-serif-display glass-warm"
            style={{ color: "var(--ink)" }}
          >
            NO 🙄
          </motion.button>
        </div>
        <AnimatePresence>
          {popups.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: (Math.random() - 0.5) * 14 }}
              exit={{ opacity: 0, scale: 0.4 }}
              className="absolute glass-warm rounded-xl px-4 py-2 font-hand text-base pointer-events-none"
              style={{ left: `${p.x}%`, top: `${p.y}%`, color: "var(--rose)" }}
            >
              {p.msg}
            </motion.div>
          ))}
        </AnimatePresence>
        {yes && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-hand text-2xl mt-10" style={{ color: "var(--rose)" }}>knew it 😏</p>
            <NextBtn onClick={onNext}>next →</NextBtn>
          </motion.div>
        )}
      </div>
    </WarmStage>
  );
}

// ===== STAGE 6: SPIN WHEEL =====
const WHEEL = ["kisses", "hugs", "clingy gf mode", "forehead kisses", "emotional paragraph", "virtual cuddle"];
const WHEEL_COLORS = ["#d4a373", "#e9c9a8", "#c98a7d", "#e6b89c", "#b08968", "#ddb892"];
export function WheelStage({ onNext, onShake }: { onNext: () => void; onShake: () => void }) {
  const [rot, setRot] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [done, setDone] = useState(false);
  const [marks, setMarks] = useState<{ id: number; x: number; y: number; r: number }[]>([]);
  const [mwah, setMwah] = useState<{ id: number; x: number; y: number }[]>([]);

  const spin = () => {
    if (spinning || done) return;
    setSpinning(true);
    const seg = 360 / WHEEL.length;
    // KISSES is index 0; we want pointer at top to land on it
    const target = 360 * 6 + (360 - seg / 2) - 0; // multiple rotations
    setRot(target);
    setTimeout(() => {
      setSpinning(false);
      setDone(true);
      onShake();
      // splatter lipstick + mwahs
      const ms: { id: number; x: number; y: number; r: number }[] = [];
      for (let i = 0; i < 30; i++) ms.push({ id: i + Date.now(), x: Math.random() * 100, y: Math.random() * 100, r: (Math.random() - 0.5) * 60 });
      setMarks(ms);
      const mw: { id: number; x: number; y: number }[] = [];
      for (let i = 0; i < 14; i++) mw.push({ id: i + Date.now() + 1000, x: Math.random() * 90 + 5, y: Math.random() * 80 + 10 });
      setMwah(mw);
    }, 4400);
  };

  return (
    <WarmStage hearts={false}>
      <FloatingHearts count={done ? 30 : 8} />
      <div className="text-center w-full max-w-md relative">
        <h2 className="font-serif-display text-3xl mb-2" style={{ color: "var(--primary)" }}>spin the wheel of love</h2>
        <p className="font-hand text-lg mb-6" style={{ color: "var(--rose)" }}>completely fair. trust.</p>

        <div className="relative mx-auto w-[280px] h-[280px] md:w-[340px] md:h-[340px]">
          {/* pointer */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 text-4xl" style={{ filter: "drop-shadow(0 0 8px oklch(0.85 0.15 70))" }}>▼</div>
          <motion.div
            className="w-full h-full rounded-full relative"
            style={{
              boxShadow: "var(--shadow-glow), inset 0 0 40px oklch(1 0 0 / 0.4)",
              border: "6px solid oklch(0.95 0.05 80)",
            }}
            animate={{ rotate: rot }}
            transition={{ duration: 4.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full rounded-full">
              {WHEEL.map((label, i) => {
                const seg = 360 / WHEEL.length;
                const start = i * seg - 90;
                const end = start + seg;
                const r = 100;
                const x1 = 100 + r * Math.cos((start * Math.PI) / 180);
                const y1 = 100 + r * Math.sin((start * Math.PI) / 180);
                const x2 = 100 + r * Math.cos((end * Math.PI) / 180);
                const y2 = 100 + r * Math.sin((end * Math.PI) / 180);
                const mid = start + seg / 2;
                const tx = 100 + 60 * Math.cos((mid * Math.PI) / 180);
                const ty = 100 + 60 * Math.sin((mid * Math.PI) / 180);
                return (
                  <g key={i}>
                    <path d={`M100,100 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`} fill={WHEEL_COLORS[i]} stroke="oklch(0.95 0.05 80)" strokeWidth="1" />
                    <text x={tx} y={ty} textAnchor="middle" fontSize="9" fill="white" transform={`rotate(${mid + 90}, ${tx}, ${ty})`} style={{ fontFamily: "Cormorant Garamond, serif" }}>
                      {label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </motion.div>
          {/* center button */}
          <button
            onClick={spin}
            disabled={spinning || done}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full font-serif-display text-white text-sm z-10"
            style={{ background: "var(--gradient-gold)", boxShadow: "0 0 30px oklch(0.85 0.15 70)" }}
          >
            SPIN
          </button>
        </div>

        <AnimatePresence>
          {done && (
            <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}>
              <h3 className="font-serif-display text-3xl md:text-4xl mt-8 text-glow-red" style={{ color: "var(--rose)" }}>
                YOU WON 100000 KISSES 💋
              </h3>
              <NextBtn onClick={onNext}>next →</NextBtn>
            </motion.div>
          )}
        </AnimatePresence>

        {/* chaos overlay */}
        <div className="pointer-events-none fixed inset-0 z-[150]">
          {marks.map((m) => (
            <span key={m.id} className="lipstick" style={{ left: `${m.x}%`, top: `${m.y}%`, transform: `rotate(${m.r}deg)` }}>💋</span>
          ))}
          {mwah.map((m) => (
            <motion.span
              key={m.id}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1.2, y: -30 }}
              transition={{ duration: 1.4 }}
              className="absolute font-hand text-3xl"
              style={{ left: `${m.x}%`, top: `${m.y}%`, color: "var(--rose)", textShadow: "0 0 18px oklch(0.7 0.2 25 / 0.6)" }}
            >
              MWAHHH
            </motion.span>
          ))}
        </div>
      </div>
    </WarmStage>
  );
}

// ===== Floating "choose another gift" back button =====
export function FloatingBackButton({ onClick, tone = "warm" }: { onClick: () => void; tone?: "warm" | "dark" }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: -12, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 0.6, duration: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`fixed top-4 left-4 z-[260] rounded-full px-4 py-2 font-hand text-sm md:text-base ${tone === "dark" ? "glass" : "glass-warm"} float`}
      style={{
        color: tone === "dark" ? "white" : "var(--ink)",
        boxShadow: "0 0 24px oklch(0.85 0.15 70 / 0.35)",
      }}
      aria-label="choose another gift"
    >
      ← choose another gift
    </motion.button>
  );
}

// ===== STAGE 7: CHOOSE GIFT =====
export function GiftStage({ onPick, onFinish }: { onPick: (g: "camera" | "letter" | "sword") => void; onFinish: () => void }) {
  const gifts = [
    { id: "camera" as const, icon: "📸", label: "CAMERA" },
    { id: "letter" as const, icon: "💌", label: "LETTER BOTTLE" },
    { id: "sword" as const, icon: "⚔️", label: "ANIME SWORD" },
  ];
  return (
    <WarmStage>
      <div className="text-center w-full max-w-3xl">
        <h2 className="font-serif-display text-4xl md:text-5xl mb-3" style={{ color: "var(--primary)" }}>choose your gift cutoo.</h2>
        <p className="font-hand text-lg mb-10" style={{ color: "var(--rose)" }}>(pick all three. obviously.)</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {gifts.map((g, i) => (
            <motion.button
              key={g.id}
              initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.3 + i * 0.25, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -10, scale: 1.05 }}
              onClick={() => onPick(g.id)}
              className="glass-warm rounded-3xl p-8 float"
              style={{ animationDelay: `${i * 0.6}s`, boxShadow: "var(--shadow-soft)" }}
            >
              <div className="text-7xl mb-4" style={{ filter: "drop-shadow(0 0 24px oklch(0.85 0.15 70 / 0.7))" }}>{g.icon}</div>
              <div className="font-serif-display text-xl tracking-widest" style={{ color: "var(--ink)" }}>{g.label}</div>
            </motion.button>
          ))}
        </div>
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 1 }}
          onClick={onFinish}
          className="btn-cinematic mt-10 px-7 py-3 rounded-full font-serif-display text-white"
          style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow)" }}
        >
          i opened them all →
        </motion.button>
      </div>
    </WarmStage>
  );
}

// ===== STAGE 8: CAMERA =====
const PHOTOS = [
  { src: photo1, caption: "my fav view fr.", rot: -4 },
  { src: photo2, caption: "okay calm down gym daddy.", rot: 3 },
  { src: photo3, caption: "this photo healed me btw.", rot: -2 },
];
export function CameraStage({ onBack }: { onBack: () => void }) {
  const [i, setI] = useState(0);
  const [flash, setFlash] = useState(false);
  const next = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
    setTimeout(() => setI((x) => (x + 1) % PHOTOS.length), 220);
  };
  const p = PHOTOS[i];
  return (
    <WarmStage>
      {flash && <div className="fixed inset-0 z-[400] bg-white pointer-events-none" />}
      <FloatingBackButton onClick={onBack} />
      <div className="text-center w-full max-w-md">
        <h2 className="font-serif-display text-3xl mb-6" style={{ color: "var(--primary)" }}>roll of film 📸</h2>
        <div className="relative mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: p.rot }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.7 }}
              className="bg-white p-3 pb-16 rounded-sm relative mx-auto"
              style={{ width: "min(78vw, 320px)", boxShadow: "var(--shadow-soft)" }}
            >
              <span className="absolute -top-2 left-6 w-16 h-5 -rotate-6" style={{ background: "oklch(0.9 0.04 80 / 0.7)" }} />
              <span className="absolute -top-2 right-8 w-12 h-5 rotate-3" style={{ background: "oklch(0.9 0.04 80 / 0.7)" }} />
              <img src={p.src} alt={p.caption} loading="lazy" className="w-full aspect-[3/4] object-cover" style={{ filter: "contrast(1.05) saturate(0.92) sepia(0.1)" }} />
              <p className="absolute bottom-3 left-0 right-0 text-center font-hand text-xl" style={{ color: "var(--ink)" }}>{p.caption}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-center mt-8">
          <button onClick={next} className="btn-cinematic px-6 py-3 rounded-full font-serif-display text-white" style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow)" }}>
            next photo →
          </button>
        </div>
      </div>
    </WarmStage>
  );
}

// ===== STAGE 9: LETTER =====
const LETTER = `dear bf dada,

happy birthday cutoo 🤍

genuinely still confused how someone can be this cute and irritating together.

thank you for tolerating my drama, mood swings, random clinginess, overreactions and 482 emotional attacks daily.

honestly you deserve an award for surviving me 😭

you somehow became my favorite habit.
my favorite notification.
my favorite person to annoy.
and my safest place too.

also stop looking good randomly???
it's actually irritating.
especially that white shirt picture.
genuinely unfair behavior.

thank you for making ordinary days feel softer.
and thank you for existing, idiot.

now come here and claim your birthday kisses 😭`;
export function LetterStage({ onBack }: { onBack: () => void }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (shown >= LETTER.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), 22);
    return () => clearTimeout(t);
  }, [shown]);
  return (
    <WarmStage hearts={false}>
      <FloatingHearts count={6} />
      <FloatingBackButton onClick={onBack} />
      <div className="w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: -1 }}
          transition={{ duration: 1 }}
          className="relative p-7 md:p-10 rounded-sm"
          style={{
            background: "oklch(0.96 0.03 85)",
            backgroundImage:
              "repeating-linear-gradient(transparent 0 31px, oklch(0.85 0.04 75 / 0.35) 31px 32px)",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <span className="absolute -top-3 left-10 px-3 py-1 rotate-[-6deg] text-xs font-sans tracking-widest" style={{ background: "oklch(0.85 0.1 25 / 0.7)", color: "white" }}>love</span>
          <pre className="font-hand text-xl md:text-2xl whitespace-pre-wrap leading-[1.55]" style={{ color: "var(--ink)" }}>
            {LETTER.slice(0, shown)}
            {shown < LETTER.length && <span className="opacity-70">▍</span>}
          </pre>
        </motion.div>
      </div>
    </WarmStage>
  );
}

// ===== STAGE 10: ANIME SWORD =====
export function SwordStage({ onBack }: { onBack: () => void }) {
  const [slashed, setSlashed] = useState(false);
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "var(--gradient-dark)" }}>
      <Starfield density={60} color="oklch(0.7 0.15 25)" />
      {/* red particles */}
      <DreamyParticles count={30} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 60%, oklch(0.4 0.2 25 / 0.25), transparent 60%)" }} />
      <FloatingBackButton onClick={onBack} tone="dark" />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-5 py-12">
        <div className="text-center w-full max-w-lg">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="font-sans tracking-[0.4em] text-xs mb-4 text-rose-300/80">
            主人公 — MAIN CHARACTER ENERGY DETECTED
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-serif-display text-3xl md:text-4xl text-white text-glow-red mb-2">
            how are you this cute and<br/>irritating together.
          </motion.h2>
          <p className="font-hand text-rose-200 text-xl mt-4">you unlocked : ultimate bf dada mode.</p>

          <div className="relative mx-auto mt-10 h-[280px] w-full overflow-hidden">
            <motion.div
              initial={{ rotate: -20, opacity: 0, scale: 0.8 }}
              animate={{ rotate: -20, opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[140px]"
              style={{ filter: "drop-shadow(0 0 30px oklch(0.7 0.2 25)) drop-shadow(0 0 60px oklch(0.85 0.15 70))" }}
            >
              ⚔️
            </motion.div>
            {slashed && (
              <>
                <div className="absolute inset-0 slash" style={{ background: "linear-gradient(120deg, transparent 45%, white 49%, oklch(0.7 0.2 25) 50%, white 51%, transparent 55%)" }} />
                <motion.p initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="absolute inset-0 flex items-center justify-center font-serif-display text-2xl md:text-3xl text-white text-glow-red px-6 text-center">
                  still my favorite person though.
                </motion.p>
              </>
            )}
          </div>

          {!slashed && (
            <button onClick={() => setSlashed(true)} className="btn-cinematic mt-6 px-7 py-3 rounded-full font-serif-display text-white" style={{ background: "linear-gradient(135deg, oklch(0.45 0.18 25), oklch(0.3 0.1 25))", boxShadow: "0 0 40px oklch(0.6 0.2 25 / 0.6)" }}>
              unsheathe ⚔️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== STAGE 11: ENDING =====
export function EndingStage({ onSurprise, finale }: { onSurprise: () => void; finale: boolean }) {
  const lines = ["mission completed.", "successfully made bf dada blush.", "happy birthday cutoo 💌"];
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= lines.length - 1) return;
    const t = setTimeout(() => setStep((s) => s + 1), 2200);
    return () => clearTimeout(t);
  }, [step]);
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "linear-gradient(180deg, oklch(0.2 0.04 260), oklch(0.35 0.06 250) 50%, oklch(0.85 0.07 70))" }}>
      <Starfield density={140} />
      <FloatingHearts count={finale ? 40 : 8} />
      <DreamyParticles count={40} />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-5 py-12 text-center">
        <div className="max-w-lg">
          <AnimatePresence mode="wait">
            <motion.h2
              key={step}
              initial={{ opacity: 0, y: 20, filter: "blur(20px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(20px)" }}
              transition={{ duration: 1.2 }}
              className="font-serif-display text-4xl md:text-6xl text-white text-glow-soft leading-tight"
            >
              {lines[step]}
            </motion.h2>
          </AnimatePresence>
          {step === lines.length - 1 && !finale && (
            <motion.button
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              onClick={onSurprise}
              className="btn-cinematic mt-10 px-7 py-3 rounded-full font-serif-display text-lg text-white"
              style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-glow)" }}
            >
              click for one last surprise
            </motion.button>
          )}
          {finale && (
            <motion.p initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 1 }} className="font-hand text-3xl md:text-4xl mt-10 text-glow" style={{ color: "oklch(0.95 0.08 75)" }}>
              okay now come here idiot.
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}