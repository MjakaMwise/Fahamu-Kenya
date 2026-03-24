import { useState, useRef, useEffect } from "react";
import { ChevronDown, TrendingUp, Users, DollarSign, Calendar } from "lucide-react";
import { usePayrollData, ParastatalGroup } from "@/hooks/usePayrollData";

// ── formatters ────────────────────────────────────────────────────────────────

const fmtKsh = (n: number) => `KSh ${n.toLocaleString()}`;
const fmtBillions = (n: number) => {
  if (n >= 1_000_000_000) return `KSh ${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `KSh ${(n / 1_000_000).toFixed(1)}M`;
  return `KSh ${(n / 1_000).toFixed(0)}K`;
};

// ── Institution Card ──────────────────────────────────────────────────────────

const InstitutionCard = ({ group, visible }: { group: ParastatalGroup; visible: boolean }) => {
  const [open, setOpen] = useState(false);

  const totalHeadcount = group.entries.reduce((s, e) => s + e.count, 0);

  return (
    <div
      className="bg-card border border-border rounded-xl overflow-hidden shadow-fk-sm transition-shadow hover:shadow-fk-md"
      style={{ borderTopColor: group.color, borderTopWidth: 3 }}
    >
      {/* Card header — always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left"
      >
        <div className="px-6 pt-5 pb-4">
          {/* Institution label */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: group.color }}
              />
              <span className="font-mono text-[10.5px] uppercase tracking-[.1em] font-semibold" style={{ color: group.color }}>
                {group.arm.replace("_", " ")}
              </span>
            </div>
            <ChevronDown
              size={16}
              className="text-muted-foreground transition-transform duration-200"
              style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </div>

          <h3 className="font-display text-[22px] text-foreground leading-tight mb-4">{group.name}</h3>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="font-mono text-[9.5px] uppercase tracking-[.1em] text-muted-foreground mb-1 flex items-center gap-1">
                <Users size={9} /> Headcount
              </div>
              <div className="font-display text-[20px] text-foreground">{totalHeadcount.toLocaleString()}</div>
            </div>
            <div>
              <div className="font-mono text-[9.5px] uppercase tracking-[.1em] text-muted-foreground mb-1 flex items-center gap-1">
                <DollarSign size={9} /> Monthly
              </div>
              <div className="font-mono text-[14px] font-semibold" style={{ color: group.color }}>
                {fmtBillions(group.monthlyTotal)}
              </div>
            </div>
            <div>
              <div className="font-mono text-[9.5px] uppercase tracking-[.1em] text-muted-foreground mb-1 flex items-center gap-1">
                <Calendar size={9} /> Yearly
              </div>
              <div className="font-mono text-[14px] font-semibold" style={{ color: group.color }}>
                {fmtBillions(group.yearlyTotal)}
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar showing proportion of monthly total (visual only — bar fills based on monthly) */}
        <div className="h-0.5 w-full bg-muted/50">
          <div
            className="h-full transition-all duration-700 ease-out"
            style={{
              background: group.color,
              width: visible ? "100%" : "0%",
            }}
          />
        </div>
      </button>

      {/* Expandable breakdown table */}
      {open && (
        <div className="border-t border-border">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_auto_1fr_1fr_1fr] gap-3 px-6 py-2.5 bg-muted/30 text-[10px] font-mono uppercase tracking-[.1em] text-muted-foreground">
            <span>Position</span>
            <span className="text-right">Count</span>
            <span className="text-right">Salary / Person</span>
            <span className="text-right">Total / Month</span>
            <span className="text-right">Total / Year</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {group.entries.map((entry) => {
              const monthly = entry.count * entry.salary;
              const yearly = monthly * 12;
              return (
                <div
                  key={entry.position}
                  className="grid grid-cols-[2fr_auto_1fr_1fr_1fr] gap-3 px-6 py-3 items-center text-[12.5px] hover:bg-muted/20 transition-colors"
                >
                  <div>
                    <span className="text-foreground font-medium">{entry.position}</span>
                    {entry.estimated && (
                      <span className="ml-1.5 text-[10px] text-muted-foreground font-mono">(est.)</span>
                    )}
                  </div>
                  <div className="text-right font-mono text-muted-foreground">{entry.count.toLocaleString()}</div>
                  <div className="text-right font-mono text-foreground">{fmtKsh(entry.salary)}</div>
                  <div className="text-right font-mono font-semibold" style={{ color: group.color }}>
                    {fmtBillions(monthly)}
                  </div>
                  <div className="text-right font-mono font-semibold text-foreground">
                    {fmtBillions(yearly)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals row */}
          <div className="grid grid-cols-[2fr_auto_1fr_1fr_1fr] gap-3 px-6 py-3 items-center border-t-2 bg-muted/30" style={{ borderTopColor: group.color }}>
            <div className="font-semibold text-[12.5px] text-foreground col-span-2">Institution Total</div>
            <div />
            <div className="text-right font-mono font-bold text-[13px]" style={{ color: group.color }}>
              {fmtBillions(group.monthlyTotal)}
            </div>
            <div className="text-right font-mono font-bold text-[13px] text-foreground">
              {fmtBillions(group.yearlyTotal)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Parastatal Payroll Section ────────────────────────────────────────────────

const ParastatalPayroll = () => {
  const { groups, grandMonthly, grandYearly, loading } = usePayrollData();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Relative share bar for each group (monthly)
  const maxGroupMonthly = Math.max(...groups.map((g) => g.monthlyTotal), 1);

  return (
    <section
      className="py-[100px] px-8 bg-background max-md:py-16 max-md:px-5"
      id="payroll"
      ref={sectionRef}
    >
      {loading ? (
        <div className="text-center text-muted-foreground">Loading payroll data…</div>
      ) : (
        <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"}`}>

          {/* Section header */}
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <div className="font-mono text-xs font-medium uppercase tracking-[.12em] text-kenya-green mb-4">
              Public Expenditure
            </div>
            <h2 className="font-display leading-[1.1] tracking-tight mb-5" style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}>
              Government Payroll<br />by Institution
            </h2>
            <p className="text-[17px] text-fk-slate leading-relaxed">
              Total salary expenditure per government institution — monthly and annually. Click any card to see the per-position breakdown.
            </p>
          </div>

          {/* Grand total banner */}
          <div className="max-w-[1000px] mx-auto mb-10">
            <div className="rounded-xl bg-fk-black text-white px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <TrendingUp size={22} className="text-green-400 shrink-0" />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[.12em] text-white/50 mb-1">Grand Total — All Institutions</div>
                  <div className="font-display text-[13px] text-white/70">Combined monthly payroll across {groups.reduce((s, g) => s + g.entries.reduce((ss, e) => ss + e.count, 0), 0).toLocaleString()} public positions</div>
                </div>
              </div>
              <div className="flex gap-8 shrink-0">
                <div className="text-center">
                  <div className="font-mono text-[10px] uppercase tracking-[.1em] text-white/40 mb-1">Per Month</div>
                  <div className="font-mono text-[22px] font-bold text-green-400">{fmtBillions(grandMonthly)}</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-[10px] uppercase tracking-[.1em] text-white/40 mb-1">Per Year</div>
                  <div className="font-mono text-[22px] font-bold text-white">{fmtBillions(grandYearly)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Proportional share bars */}
          <div className="max-w-[1000px] mx-auto mb-10 bg-card border border-border rounded-xl p-6 shadow-fk-sm">
            <div className="font-mono text-[10px] uppercase tracking-[.1em] text-muted-foreground mb-4">Monthly Share by Institution</div>
            <div className="space-y-3">
              {groups.map((g) => {
                const pct = ((g.monthlyTotal / grandMonthly) * 100).toFixed(1);
                const barPct = (g.monthlyTotal / maxGroupMonthly) * 100;
                return (
                  <div key={g.id} className="flex items-center gap-4">
                    <div className="w-[180px] shrink-0 text-[12px] font-medium text-foreground">{g.name}</div>
                    <div className="flex-1 h-5 bg-muted/40 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-[1s] ease-out"
                        style={{
                          width: visible ? `${barPct}%` : "0%",
                          background: g.color,
                        }}
                      />
                    </div>
                    <div className="w-[90px] shrink-0 text-right">
                      <span className="font-mono text-[12px] font-semibold" style={{ color: g.color }}>{pct}%</span>
                      <span className="font-mono text-[10px] text-muted-foreground ml-1">({fmtBillions(g.monthlyTotal)})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Institution cards */}
          <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
            {groups.map((group) => (
              <InstitutionCard key={group.id} group={group} visible={visible} />
            ))}
          </div>

          {/* Footnote */}
          <p className="max-w-[1000px] mx-auto mt-8 text-[11.5px] text-muted-foreground text-center leading-relaxed">
            Salaries sourced from SRC Gazette Notices (Aug 2023). Judiciary Court of Appeal and High Court figures use midpoint estimates.
            Governor &amp; Deputy Governor salaries per SRC FY 2023/24 schedule.
            MCAs include ~1,450 elected + ~500 nominated seats. CECMs calculated at max 10 per county × 47 counties.
          </p>

        </div>
      )}
    </section>
  );
};

export default ParastatalPayroll;
