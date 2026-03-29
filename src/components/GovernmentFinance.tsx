import { useRef, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, BarChart2, AlertTriangle, Landmark, Activity, Banknote } from "lucide-react";

// ── Static data from finance.json ─────────────────────────────────────────────

const revenueTrendData = [
  { year: "2022/23", collected: 2166, target: null },
  { year: "2023/24", collected: 2407, target: 2768 },
  { year: "2024/25", collected: 2571, target: 2555 },
];

const taxBreakdownData = [
  { head: "Customs", amount: 879.3 },
  { head: "PAYE", amount: 561.0 },
  { head: "Dom. VAT", amount: 327.3 },
  { head: "Corp Tax", amount: 304.8 },
];

const debtTrendData = [
  { year: "2022/23", debt: 10278.9, debtToGdp: 72.0 },
  { year: "2023/24", debt: 10580.5, debtToGdp: 66.9 },
  { year: "2024/25", debt: 11814.5, debtToGdp: 67.8 },
];

const debtCompositionData = [
  { year: "2022/23", domestic: 4728, external: 5551 },
  { year: "2023/24", domestic: 5408.8, external: 5171.7 },
  { year: "2024/25", domestic: 6326.0, external: 5488.5 },
];

const debtServiceData = [
  { year: "2022/23", external: null, domestic: null, total: 1199.4 },
  { year: "2023/24", external: 755.9, domestic: 807.4, total: 1563.3 },
  { year: "2024/25", external: 579.0, domestic: 1143.1, total: 1722.1 },
];

const budgetAllocData = [
  { sector: "Debt Service & Pensions", amount: 1213.4, pct: 30.4 },
  { sector: "Infrastructure", amount: 477.2, pct: 11.96 },
  { sector: "County Govts", amount: 444.5, pct: 11.13 },
  { sector: "National Security", amount: 362.6, pct: 9.08 },
  { sector: "Health", amount: 127.0, pct: 3.18 },
  { sector: "Housing", amount: 92.1, pct: 2.31 },
  { sector: "Energy", amount: 70.3, pct: 1.76 },
  { sector: "Agriculture", amount: 54.6, pct: 1.37 },
  { sector: "Manufacturing", amount: 23.7, pct: 0.59 },
];

const BAR_COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f97316", "#a855f7", "#14b8a6", "#eab308", "#ec4899", "#6366f1"];
const TAX_COLORS = ["#3b82f6", "#22c55e", "#f97316", "#a855f7"];

const statCards = [
  {
    label: "KRA Revenue",
    value: "KES 2.57T",
    sub: "FY 2024/25 · 100.6% of target",
    Icon: TrendingUp,
    color: "text-green-400",
    border: "border-green-400/30",
  },
  {
    label: "Total Budget",
    value: "KES 3.99T",
    sub: "FY 2024/25 estimate",
    Icon: Banknote,
    color: "text-blue-400",
    border: "border-blue-400/30",
  },
  {
    label: "Fiscal Deficit",
    value: "KES 768.6B",
    sub: "4.3% of GDP",
    Icon: AlertTriangle,
    color: "text-orange-400",
    border: "border-orange-400/30",
  },
  {
    label: "Public Debt",
    value: "KES 11.81T",
    sub: "67.8% of GDP · June 2025",
    Icon: Landmark,
    color: "text-red-400",
    border: "border-red-400/30",
  },
  {
    label: "Debt Service",
    value: "KES 1.72T",
    sub: "FY 2024/25 total payments",
    Icon: Activity,
    color: "text-purple-400",
    border: "border-purple-400/30",
  },
  {
    label: "GDP Growth",
    value: "5.4%",
    sub: "FY 2024/25",
    Icon: BarChart2,
    color: "text-teal-400",
    border: "border-teal-400/30",
  },
];

// ── Shared axis / grid styles ─────────────────────────────────────────────────

const TICK = { fill: "rgba(255,255,255,0.35)", fontSize: 11 };
const GRID_STROKE = "rgba(255,255,255,0.07)";

// ── Custom tooltip ────────────────────────────────────────────────────────────

const DarkTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number | null; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-fk-charcoal border border-fk-white/10 rounded-lg px-4 py-3 shadow-fk-lg">
      <p className="font-mono-custom text-[10px] uppercase tracking-wider text-fk-white/50 mb-2">{label}</p>
      {payload
        .filter((p) => p.value != null)
        .map((p) => (
          <div key={p.name} className="flex items-center gap-2 mb-1 last:mb-0">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
            <span className="text-fk-white/60 text-xs">{p.name}:</span>
            <span className="text-fk-white font-semibold text-xs">
              {Number(p.value).toLocaleString()}
            </span>
          </div>
        ))}
    </div>
  );
};

// ── Chart card wrapper ────────────────────────────────────────────────────────

const ChartCard = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => (
  <div className="bg-fk-white/[0.04] border border-fk-white/[0.08] rounded-xl p-6">
    <div className="mb-5">
      <h3 className="text-fk-white font-semibold text-[15px] mb-1">{title}</h3>
      <p className="text-fk-white/40 text-xs">{subtitle}</p>
    </div>
    {children}
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

const GovernmentFinance = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-[100px] px-8 bg-fk-black max-md:py-16 max-md:px-5" id="finance">
      <div
        ref={ref}
        className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"}`}
      >
        {/* ── Header ── */}
        <div className="text-center max-w-[700px] mx-auto mb-16">
          <div className="font-mono-custom text-xs font-medium uppercase tracking-[.12em] text-green-400 mb-4">
            Public Finance
          </div>
          <h2
            className="font-display text-fk-white leading-[1.1] tracking-tight mb-5"
            style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}
          >
            Where Kenya's<br />Money Goes
          </h2>
          <p className="text-[17px] text-fk-white/60 leading-relaxed">
            Three financial years of Kenya's national revenue, expenditure, and public debt — sourced from the National Treasury and Kenya Revenue Authority official reports.
          </p>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-[1100px] mx-auto mb-16">
          {statCards.map(({ label, value, sub, Icon, color, border }, i) => (
            <div
              key={label}
              className={`bg-fk-white/[0.05] border ${border} rounded-lg p-5 transition-all duration-300 hover:bg-fk-white/[0.08] hover:-translate-y-0.5`}
              style={{ transitionDelay: visible ? `${i * 60}ms` : "0ms" }}
            >
              <Icon size={16} className={`${color} mb-3`} />
              <div className={`font-mono-custom text-xl font-semibold ${color} mb-1 leading-tight`}>{value}</div>
              <div className="text-[11px] font-semibold text-fk-white mb-0.5">{label}</div>
              <div className="text-[10px] text-fk-white/35 leading-snug">{sub}</div>
            </div>
          ))}
        </div>

        {/* ── 2-column chart grid ── */}
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Revenue Trend */}
          <ChartCard
            title="KRA Revenue Trend"
            subtitle="Collected vs target · KES Billions"
          >
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={revenueTrendData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis dataKey="year" tick={TICK} axisLine={false} tickLine={false} />
                <YAxis
                  tick={TICK}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                  tickFormatter={(v) => `${v}B`}
                  domain={[1800, 3000]}
                />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }} />
                <Line
                  type="monotone"
                  dataKey="collected"
                  name="Collected (KES B)"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: "#22c55e", r: 4 }}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Target (KES B)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={{ fill: "#3b82f6", r: 4 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* KRA Tax Heads */}
          <ChartCard
            title="KRA Tax Heads — FY 2024/25"
            subtitle="Major revenue streams · KES Billions"
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={taxBreakdownData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="head" tick={TICK} axisLine={false} tickLine={false} />
                <YAxis
                  tick={TICK}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                  tickFormatter={(v) => `${v}B`}
                />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="amount" name="Collection (KES B)" radius={[4, 4, 0, 0]}>
                  {taxBreakdownData.map((_, idx) => (
                    <Cell key={idx} fill={TAX_COLORS[idx]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Debt Growth — dual axis */}
          <ChartCard
            title="Public Debt Growth"
            subtitle="Debt stock (KES B, left) · Debt-to-GDP % (right)"
          >
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={debtTrendData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis dataKey="year" tick={TICK} axisLine={false} tickLine={false} />
                <YAxis
                  yAxisId="left"
                  tick={TICK}
                  axisLine={false}
                  tickLine={false}
                  width={70}
                  tickFormatter={(v) => `${v}B`}
                  domain={[9000, 13000]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={TICK}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                  tickFormatter={(v) => `${v}%`}
                  domain={[60, 80]}
                />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="debt"
                  name="Total Debt (KES B)"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: "#ef4444", r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="debtToGdp"
                  name="Debt-to-GDP %"
                  stroke="#f97316"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={{ fill: "#f97316", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Domestic vs External Debt */}
          <ChartCard
            title="Domestic vs External Debt"
            subtitle="Stacked composition · KES Billions"
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={debtCompositionData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="year" tick={TICK} axisLine={false} tickLine={false} />
                <YAxis
                  tick={TICK}
                  axisLine={false}
                  tickLine={false}
                  width={70}
                  tickFormatter={(v) => `${v}B`}
                />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }} />
                <Bar dataKey="domestic" name="Domestic (KES B)" stackId="a" fill="#3b82f6" />
                <Bar
                  dataKey="external"
                  name="External (KES B)"
                  stackId="a"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ── Budget Allocations — full width horizontal bar ── */}
        <div className="max-w-[1100px] mx-auto mb-6">
          <ChartCard
            title="Budget Sector Allocations — FY 2024/25"
            subtitle="How the KES 3.99T national budget was directed · KES Billions"
          >
            <ResponsiveContainer width="100%" height={290}>
              <BarChart
                data={budgetAllocData}
                layout="vertical"
                margin={{ top: 5, right: 70, bottom: 5, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
                <XAxis
                  type="number"
                  tick={TICK}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}B`}
                />
                <YAxis
                  type="category"
                  dataKey="sector"
                  tick={{ ...TICK, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={148}
                />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="amount" name="Allocation (KES B)" radius={[0, 4, 4, 0]}>
                  {budgetAllocData.map((_, idx) => (
                    <Cell key={idx} fill={BAR_COLORS[idx]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ── Debt Service Trend — full width ── */}
        <div className="max-w-[1100px] mx-auto">
          <ChartCard
            title="Debt Service Trend"
            subtitle="Annual external vs domestic debt repayments · KES Billions"
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={debtServiceData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="year" tick={TICK} axisLine={false} tickLine={false} />
                <YAxis
                  tick={TICK}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                  tickFormatter={(v) => `${v}B`}
                />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }} />
                <Bar dataKey="external" name="External Service (KES B)" stackId="a" fill="#ef4444" />
                <Bar
                  dataKey="domestic"
                  name="Domestic Service (KES B)"
                  stackId="a"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ── Sources ── */}
        <div className="max-w-[1100px] mx-auto mt-10 pt-6 border-t border-fk-white/[0.06]">
          <p className="text-center text-[11px] text-fk-white/25 leading-relaxed">
            Sources: Annual Public Debt Management Report 2023/24 &amp; 2024/25 — National Treasury · KRA Annual Revenue Performance Reports 2022/23, 2023/24 &amp; 2024/25 · Budget Highlights (Mwananchi Guide) FY 2024/25 · Central Bank of Kenya · African Development Bank (November 2025)
          </p>
        </div>
      </div>
    </section>
  );
};

export default GovernmentFinance;
