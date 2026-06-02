import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CinematicWipe, FakePopups, HeartCursor, SparkleBurst } from "./effects";
import {
  LoadingStage, PasswordStage, MainStage, CandleStage, MissMeStage,
  WheelStage, GiftStage, CameraStage, LetterStage, SwordStage, EndingStage,
} from "./stages";

// Drop a file at /public/music.mp3 (e.g. "Until I Found You") and it autoplays.
const MUSIC_SRC = "/music.mp3";

type Stage =
  | "loading" | "password" | "main" | "candle" | "miss" | "wheel"
  | "gift" | "camera" | "letter" | "sword" | "ending";

export default function Experience() {
  const [stage, setStage] = useState<Stage>("loading");
  const [wipe, setWipe] = useState(false);
  const [warmWipe, setWarmWipe] = useState(false);
  const [burst, setBurst] = useState(0);
  const [shake, setShake] = useState(false);
  const [finale, setFinale] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const go = (next: Stage) => {
    setWipe(true);
    setTimeout(() => {
      setStage(next);
      setWipe(false);
    }, 900);
  };

  const onPasswordOk = () => {
    setWarmWipe(true);
    setBurst(Date.now());
    setMusicOn(true);
    setTimeout(() => {
      setStage("main");
      setTimeout(() => setWarmWipe(false), 200);
    }, 1400);
  };

  useEffect(() => {
    if (musicOn && audioRef.current) {
      audioRef.current.volume = 0;
      audioRef.current.play().catch(() => {});
      let v = 0;
      const i = setInterval(() => {
        v = Math.min(0.5, v + 0.04);
        if (audioRef.current) audioRef.current.volume = v;
        if (v >= 0.5) clearInterval(i);
      }, 200);
      return () => clearInterval(i);
    }
  }, [musicOn]);

  const dramaticShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const isWarm = stage !== "loading" && stage !== "password" && stage !== "sword";

  return (
    <div className={shake ? "shake" : ""}>
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="auto" />
      <HeartCursor />
      <FakePopups enabled={isWarm} />
      <SparkleBurst trigger={burst} />
      <CinematicWipe show={wipe} color="oklch(0.05 0.01 260)" />
      <CinematicWipe show={warmWipe} color="oklch(0.95 0.08 75 / 0.95)" />

      {/* music toggle */}
      {stage !== "loading" && stage !== "password" && (
        <button
          onClick={() => {
            if (!audioRef.current) return;
            if (audioRef.current.paused) { audioRef.current.play(); setMusicOn(true); }
            else { audioRef.current.pause(); setMusicOn(false); }
          }}
          className="fixed bottom-4 left-4 z-[250] glass-warm rounded-full w-11 h-11 flex items-center justify-center text-lg"
          aria-label="toggle music"
        >
          {musicOn ? "🎵" : "🔇"}
        </button>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, filter: "blur(24px)", scale: 1.02 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          exit={{ opacity: 0, filter: "blur(24px)", scale: 0.98 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {stage === "loading" && <LoadingStage onDone={() => go("password")} />}
          {stage === "password" && <PasswordStage onCorrect={onPasswordOk} />}
          {stage === "main" && <MainStage onNext={() => go("candle")} />}
          {stage === "candle" && <CandleStage onNext={() => go("miss")} />}
          {stage === "miss" && <MissMeStage onNext={() => go("wheel")} />}
          {stage === "wheel" && <WheelStage onNext={() => go("gift")} onShake={dramaticShake} />}
          {stage === "gift" && (
            <GiftStage
              onPick={(g) => go(g === "camera" ? "camera" : g === "letter" ? "letter" : "sword")}
              onFinish={() => go("ending")}
            />
          )}
          {stage === "camera" && <CameraStage onBack={() => go("gift")} />}
          {stage === "letter" && <LetterStage onBack={() => go("gift")} />}
          {stage === "sword" && <SwordStage onBack={() => go("gift")} />}
          {stage === "ending" && (
            <EndingStage
              finale={finale}
              onSurprise={() => { setFinale(true); setBurst(Date.now()); dramaticShake(); }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}