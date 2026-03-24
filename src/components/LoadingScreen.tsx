import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onDone: () => void;
}

const LoadingScreen = ({ onDone }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Animate the progress bar over ~2 seconds then trigger fade-out
    const start = performance.now();
    const duration = 2200;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        setFading(true);
        setTimeout(onDone, 500); // wait for fade-out animation
      }
    };

    requestAnimationFrame(tick);
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-fk-black px-6"
      style={{
        transition: "opacity 0.5s ease",
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      {/* Logo mark */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-9 h-9 rounded-[10px] bg-kenya-green flex items-center justify-center">
          <span className="text-white font-bold text-[18px] leading-none select-none">F</span>
        </div>
        <span className="font-display text-[22px] text-white tracking-tight">Fahamu Kenya</span>
      </div>

      {/* Tagline */}
      <p className="font-mono text-[11px] uppercase tracking-[.15em] text-white/40 mb-8">
        Loading civic data…
      </p>

      {/* Progress bar */}
      <div className="w-[220px] h-[3px] bg-white/10 rounded-full overflow-hidden mb-12">
        <div
          className="h-full bg-kenya-green rounded-full"
          style={{ width: `${progress}%`, transition: "width 0.05s linear" }}
        />
      </div>

      {/* Disclaimer box */}
      <div className="max-w-[480px] border border-white/10 rounded-xl px-6 py-5 bg-white/[0.03] text-center">
        <div className="font-mono text-[9.5px] uppercase tracking-[.14em] text-white/40 mb-3">
          Data Disclaimer
        </div>
        <p className="text-[13px] text-white/60 leading-relaxed">
          All information displayed on this platform is sourced from publicly available Kenyan
          government websites, official gazette notices, Parliament records, and the
          Salaries &amp; Remuneration Commission (SRC). Data is provided for civic awareness
          purposes only. While we strive for accuracy, figures may not reflect the most
          recent changes. Always verify with official government sources.
        </p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4">
          {["parliament.go.ke", "src.go.ke", "president.go.ke", "judiciary.go.ke"].map((src) => (
            <span key={src} className="font-mono text-[10px] text-white/25">{src}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
