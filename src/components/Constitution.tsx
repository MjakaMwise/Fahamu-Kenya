import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const articles = [
  { ref: "Chapter 9 — Executive", text: "The President is the Head of State, Commander-in-Chief, and chairs the Cabinet. Executive authority derives from the people.", color: "hsl(var(--executive))", bg: "hsl(var(--executive-bg))" },
  { ref: "Chapter 8 — Legislature", text: "Parliament consists of the National Assembly and the Senate, with power to legislate, oversee the executive, and approve budgets.", color: "hsl(var(--legislature))", bg: "hsl(var(--legislature-bg))" },
  { ref: "Chapter 10 — Judiciary", text: "Courts are established under the Constitution, independent from political control, with the Supreme Court as the final arbiter.", color: "hsl(var(--judiciary))", bg: "hsl(var(--judiciary-bg))" },
  { ref: "Chapter 11 — Devolution", text: "47 County Governments exercise functions assigned by the Fourth Schedule, each with an elected Governor and County Assembly.", color: "hsl(var(--county))", bg: "hsl(var(--county-bg))" },
];

const Constitution = () => {
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
    <section className="py-[100px] px-8 bg-card max-md:py-16 max-md:px-5" id="constitution">
      <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"}`}>
        <div className="text-center max-w-[700px] mx-auto mb-16">
          <div className="font-mono-custom text-xs font-medium uppercase tracking-[.12em] text-kenya-green mb-4">Constitutional Foundation</div>
          <h2 className="font-display leading-[1.1] tracking-tight mb-5" style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}>
            Rooted in the<br />2010 Constitution
          </h2>
          <p className="text-[17px] text-fk-slate leading-relaxed">
            Every office on this platform exists because the Constitution says so. Here's the legal backbone.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <Link
            to="/constitution"
            className="inline-flex items-center gap-2 no-underline bg-fk-charcoal text-fk-white text-sm font-medium px-5 py-2.5 rounded-pill hover:bg-fk-black transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 1.5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 1a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm.5 2.5h-1v3.5l3 1.8.5-.87-2.5-1.5V5z" fill="currentColor"/></svg>
            Explore Full Constitution →
          </Link>
        </div>
        <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-2 bg-card rounded-lg-custom overflow-hidden shadow-fk-lg border border-fk-black/[0.06]">
          <div className="bg-gradient-to-br from-fk-charcoal to-fk-black p-12 max-md:p-8 flex flex-col justify-center text-fk-white">
            <h3 className="font-display text-[28px] mb-4 leading-snug">The Supreme Law of Kenya</h3>
            <p className="text-[14.5px] text-fk-white/70 leading-relaxed">
              The 2010 Constitution established a devolved system of government, separated powers, and created independent commissions to safeguard democracy. Every position mapped here derives authority from this document.
            </p>
          </div>
          <div className="p-10 max-md:p-6 flex flex-col gap-4">
            {articles.map((a) => (
              <div key={a.ref} className="p-4 px-5 rounded-r-md" style={{ borderLeft: `3px solid ${a.color}`, background: a.bg }}>
                <div className="font-mono-custom text-[11px] font-semibold mb-1" style={{ color: a.color }}>{a.ref}</div>
                <div className="text-[13.5px] text-fk-charcoal leading-relaxed">{a.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Constitution;
