import { useRef, useEffect, useState } from "react";

const arms = [
  { label: "Executive", count: "22 CSs + Support", color: "#2E7D32", cls: "ex" },
  { label: "Legislature", count: "416+ Members", color: "#1565C0", cls: "leg" },
  { label: "Judiciary", count: "200+ Judges", color: "#6A1B9A", cls: "jud" },
  { label: "Security", count: "KDF + NPS + NIS", color: "#C62828", cls: "sec" },
  { label: "Counties", count: "47 Devolved Units", color: "#00695C", cls: "cty" },
  { label: "Administration", count: "16,000+ Officers", color: "#EF6C00", cls: "adm" },
  { label: "Independent", count: "11 Commissions", color: "#558B2F", cls: "ind" },
];

interface ArmsStripProps {
  onFilter?: (cls: string) => void;
}

const ArmsStrip = ({ onFilter }: ArmsStripProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-[100px] px-8 bg-fk-black max-md:py-16 max-md:px-5" id="arms">
      <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"}`}>
        <div className="text-center max-w-[700px] mx-auto mb-16">
          <div className="font-mono-custom text-xs font-medium uppercase tracking-[.12em] text-green-400 mb-4">
            Structure Overview
          </div>
          <h2 className="font-display text-fk-white leading-[1.1] tracking-tight mb-5" style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}>
            Seven Pillars of<br />Governance
          </h2>
          <p className="text-[17px] text-fk-white/60 leading-relaxed">
            Kenya's government operates through distinct arms, each with defined roles under the 2010 Constitution.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 max-w-[1100px] mx-auto max-md:gap-2.5">
          {arms.map((arm) => (
            <button
              key={arm.cls}
              onClick={() => onFilter?.(arm.cls)}
              className="bg-fk-white/[0.06] border border-fk-white/[0.08] rounded-lg p-7 max-md:p-5 text-center transition-all duration-300 hover:bg-fk-white/10 hover:-translate-y-[3px] cursor-pointer"
            >
              <div
                className="w-3.5 h-3.5 rounded-full mx-auto mb-3.5 relative"
                style={{ background: arm.color }}
              >
                <span
                  className="absolute inset-[-4px] rounded-full border-[1.5px] opacity-30"
                  style={{ borderColor: arm.color }}
                />
              </div>
              <h4 className="text-sm font-semibold text-fk-white mb-1">{arm.label}</h4>
              <div className="font-mono-custom text-[11px] text-fk-white/40">{arm.count}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArmsStrip;
