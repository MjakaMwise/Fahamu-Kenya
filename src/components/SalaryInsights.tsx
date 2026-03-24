import { useRef, useEffect, useState } from "react";

const salaryData = [
  { pos: "President", name: "H.E. Dr. William Ruto", amount: 1443750, color: "#2E7D32" },
  { pos: "Deputy President", name: "Prof. Kithure Kindiki", amount: 1227188, color: "#2E7D32" },
  { pos: "Chief Justice", name: "Lady Justice Martha Koome", amount: 1403942, color: "#6A1B9A" },
  { pos: "Speaker (NA/Senate)", name: "Dr. Wetang'ula / Sen. Kingi", amount: 1208362, color: "#1565C0" },
  { pos: "County Governor", name: "47 Governors", amount: 990000, color: "#00695C" },
  { pos: "Cabinet Secretary", name: "22 CSs", amount: 924000, color: "#2E7D32" },
  { pos: "Attorney General", name: "Dorcas Oduor", amount: 924000, color: "#2E7D32" },
  { pos: "Member of Parliament", name: "349 MPs", amount: 739600, color: "#1565C0" },
  { pos: "Deputy Governor", name: "47 Deputy Governors", amount: 684233, color: "#00695C" },
  { pos: "County Assembly Speaker", name: "47 Speakers", amount: 549283, color: "#00695C" },
  { pos: "CECM", name: "~470 County Exec Members", amount: 422526, color: "#00695C" },
  { pos: "MCA", name: "~1,450 Assembly Members", amount: 164588, color: "#00695C" },
];

const maxSalary = Math.max(...salaryData.map((s) => s.amount));

const SalaryInsights = () => {
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
    <section className="py-[100px] px-8 bg-fk-black max-md:py-16 max-md:px-5" id="salaries">
      <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"}`}>
        <div className="text-center max-w-[700px] mx-auto mb-16">
          <div className="font-mono-custom text-xs font-medium uppercase tracking-[.12em] text-green-400 mb-4">Follow The Money</div>
          <h2 className="font-display text-fk-white leading-[1.1] tracking-tight mb-5" style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}>
            What Your Leaders<br />Earn Monthly
          </h2>
          <p className="text-[17px] text-fk-white/60 leading-relaxed">
            Public salaries, paid by public taxes. These are the official Salaries & Remuneration Commission figures.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-[1100px] mx-auto">
          {salaryData.map((s, i) => (
            <div
              key={s.pos}
              className="bg-fk-white/[0.05] border border-fk-white/[0.08] rounded-lg p-6 transition-all duration-300 hover:bg-fk-white/[0.08] hover:-translate-y-0.5"
              style={{ transitionDelay: visible ? `${i * 50}ms` : "0ms" }}
            >
              <div className="text-[13px] font-semibold text-fk-white mb-1">{s.pos}</div>
              <div className="text-xs text-fk-white/40 mb-4">{s.name}</div>
              <div className="h-1.5 bg-fk-white/[0.08] rounded-full overflow-hidden mb-2.5">
                <div
                  className="h-full rounded-full transition-all duration-[1.2s] ease-out"
                  style={{
                    width: visible ? `${(s.amount / maxSalary * 100).toFixed(1)}%` : "0%",
                    background: s.color,
                  }}
                />
              </div>
              <span className="font-mono-custom text-lg font-medium text-green-400">
                KSh {s.amount.toLocaleString()}
              </span>
              <span className="text-[11px] text-fk-white/30"> /month</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SalaryInsights;
