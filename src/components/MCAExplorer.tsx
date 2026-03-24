import { useState, useRef, useEffect, useMemo } from "react";
import { Search, Users, Building2, ChevronDown, X, Banknote, BookOpen, Calendar, UserCheck, FileText, MapPin } from "lucide-react";
import { useGovernmentData, MP } from "@/hooks/useGovernmentData";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// ── helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => `KSh ${n.toLocaleString()}`;

const isWomenRep = (mp: MP) => mp.constituency.includes("(CWR)");
const isNominated = (mp: MP) => mp.constituency === "Nominated" || mp.county === null;

function getRoleLabel(mp: MP): string {
  if (isNominated(mp)) return "Nominated Member of Parliament";
  if (isWomenRep(mp)) return "County Women Representative";
  return "Member of Parliament";
}

function getRoleDescription(mp: MP): string {
  if (isNominated(mp))
    return "Nominated to Parliament by political parties in proportion to their seats, to represent special interests including women, youth, and persons with disabilities.";
  if (isWomenRep(mp))
    return "Elected county-wide to represent the interests of women in the National Assembly, per Article 97(1)(b) of the Constitution.";
  return "Elected by registered voters in a constituency to represent the people and their interests in the National Assembly, debate legislation, approve the budget, and provide oversight of the Executive.";
}

// ── MP Detail Modal ───────────────────────────────────────────────────────────

interface MPModalProps {
  mp: MP | null;
  open: boolean;
  onClose: () => void;
  salaryGross: number;
  salaryBreakdown: { basic: number; house_allowance: number; market_adjustment: number };
  constitutionalBasis: string;
  term: string;
  appointmentMethod: string;
  notes: string;
  salarySource: string;
}

const MPModal = ({
  mp, open, onClose,
  salaryGross, salaryBreakdown,
  constitutionalBasis, term, appointmentMethod, notes, salarySource,
}: MPModalProps) => {
  if (!mp) return null;

  const displayName = mp.name.split(",").reverse().join(" ").trim();
  const initials = displayName.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  const constituency = isNominated(mp) ? "Nominated" : mp.constituency.replace(" (CWR)", "");
  const county = mp.county ?? "Nominated / National";

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-[520px] p-0 overflow-hidden rounded-xl border-border bg-card gap-0">

        {/* Header */}
        <div className="relative bg-kenya-green px-6 pt-6 pb-5">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>

          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-[18px] mb-3 select-none">
            {initials}
          </div>

          <DialogTitle className="text-white font-display text-[20px] leading-tight mb-1">
            {displayName}
          </DialogTitle>
          <DialogDescription className="text-white/70 text-[13px] font-mono">
            {getRoleLabel(mp)}
          </DialogDescription>

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-flex items-center gap-1 bg-white/15 text-white text-[11px] font-mono px-2.5 py-1 rounded-full">
              <MapPin size={10} />
              {county}
            </span>
            <span className="inline-flex items-center gap-1 bg-white/15 text-white text-[11px] font-mono px-2.5 py-1 rounded-full">
              {constituency}
            </span>
            <span className="inline-flex items-center gap-1 bg-white/15 text-white text-[11px] font-mono px-2.5 py-1 rounded-full">
              {mp.party}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">

          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[.1em] text-muted-foreground mb-2">
              <BookOpen size={12} />
              Role &amp; Responsibilities
            </div>
            <p className="text-[13.5px] text-foreground leading-relaxed">{getRoleDescription(mp)}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[.1em] text-muted-foreground mb-2">
              <Banknote size={12} />
              Monthly Salary
            </div>
            <div className="bg-muted/40 rounded-lg border border-border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-[12px] text-muted-foreground">Basic Pay</span>
                <span className="font-mono text-[13px] text-foreground">{fmt(salaryBreakdown.basic)}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-[12px] text-muted-foreground">House Allowance</span>
                <span className="font-mono text-[13px] text-foreground">{fmt(salaryBreakdown.house_allowance)}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-[12px] text-muted-foreground">Market Adjustment</span>
                <span className="font-mono text-[13px] text-foreground">{fmt(salaryBreakdown.market_adjustment)}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-kenya-green/5">
                <span className="text-[12px] font-semibold text-foreground">Gross Total</span>
                <span className="font-mono text-[15px] font-bold text-kenya-green">{fmt(salaryGross)}</span>
              </div>
            </div>
            <p className="text-[10.5px] text-muted-foreground mt-1.5">Source: {salarySource}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/40 rounded-lg border border-border p-3">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[.08em] text-muted-foreground mb-1">
                <Calendar size={11} />
                Term
              </div>
              <p className="text-[13px] text-foreground font-medium">{term}</p>
            </div>
            <div className="bg-muted/40 rounded-lg border border-border p-3">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[.08em] text-muted-foreground mb-1">
                <UserCheck size={11} />
                Seat Type
              </div>
              <p className="text-[13px] text-foreground font-medium">
                {isNominated(mp) ? "Nominated" : isWomenRep(mp) ? "Women Rep" : "Elected"}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[.1em] text-muted-foreground mb-1.5">
              <UserCheck size={12} />
              Appointment Method
            </div>
            <p className="text-[13px] text-foreground leading-relaxed">{appointmentMethod}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[.1em] text-muted-foreground mb-1.5">
              <FileText size={12} />
              Constitutional Basis
            </div>
            <p className="text-[13px] text-foreground font-mono">{constitutionalBasis}</p>
          </div>

          {notes && (
            <p className="text-[11.5px] text-muted-foreground border-t border-border pt-4 leading-relaxed">{notes}</p>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
};

// ── MCA Explorer ──────────────────────────────────────────────────────────────

const MCAExplorer = () => {
  const { mps, salaries, mpMeta, loading } = useGovernmentData();
  const [selectedCountyName, setSelectedCountyName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mpSearch, setMpSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const [selectedMP, setSelectedMP] = useState<MP | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Intersection observer — always on the outer section so ref is stable
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Close county dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const countyNames = useMemo(
    () => [...new Set(mps.map((mp) => mp.county ?? "Nominated"))].sort(),
    [mps]
  );

  const filteredCounties = countyNames.filter((name) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const countyMPs = useMemo(() => {
    if (!selectedCountyName) return [];
    return mps
      .filter((mp) => (mp.county ?? "Nominated") === selectedCountyName)
      .filter(
        (mp) =>
          mp.name.toLowerCase().includes(mpSearch.toLowerCase()) ||
          mp.constituency.toLowerCase().includes(mpSearch.toLowerCase()) ||
          mp.party.toLowerCase().includes(mpSearch.toLowerCase())
      );
  }, [mps, selectedCountyName, mpSearch]);

  const partyBreakdown = useMemo(() => {
    if (!selectedCountyName) return [];
    const allMPs = mps.filter((mp) => (mp.county ?? "Nominated") === selectedCountyName);
    const counts: Record<string, number> = {};
    allMPs.forEach((mp) => { counts[mp.party] = (counts[mp.party] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([party, count]) => ({ party, count }));
  }, [mps, selectedCountyName]);

  const totalMPs = mps.filter((mp) => (mp.county ?? "Nominated") === selectedCountyName).length;

  return (
    <section
      className="py-[100px] px-8 bg-muted/30 max-md:py-16 max-md:px-5"
      id="mca-explorer"
      ref={sectionRef}
    >
      {loading ? (
        <div className="text-center text-muted-foreground">Loading data…</div>
      ) : (
        <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"}`}>

          {/* Heading */}
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <div className="font-mono text-xs font-medium uppercase tracking-[.12em] text-kenya-green mb-4">
              Legislative Representation
            </div>
            <h2 className="font-display leading-[1.1] tracking-tight mb-5" style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}>
              MP &amp; MCA Explorer
            </h2>
            <p className="text-[17px] text-fk-slate leading-relaxed">
              Browse all {mps.length} Members of Parliament by county. Click any MP to see full details, salary breakdown, and role.
            </p>
          </div>

          <div className="max-w-[1000px] mx-auto">

            {/* County Selector */}
            <div className="relative mb-8" ref={dropdownRef}>
              <div
                className="flex items-center gap-3 bg-card border border-border rounded-lg-custom px-5 py-4 cursor-pointer shadow-fk-sm hover:shadow-fk-md transition-all"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <Building2 size={20} className="text-kenya-green shrink-0" />
                <span className={`flex-1 text-[15px] font-body ${selectedCountyName ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                  {selectedCountyName ? `${selectedCountyName} County` : "Choose a county to see its MPs…"}
                </span>
                <ChevronDown size={18} className={`text-muted-foreground transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
              </div>

              {dropdownOpen && (
                <div className="absolute z-50 top-full mt-2 w-full bg-card border border-border rounded-lg-custom shadow-fk-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                    <Search size={16} className="text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search counties…"
                      className="border-none bg-transparent font-body text-sm outline-none w-full text-foreground placeholder:text-muted-foreground"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="max-h-[280px] overflow-y-auto">
                    {filteredCounties.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-muted-foreground">No counties found</div>
                    ) : (
                      filteredCounties.map((name) => (
                        <button
                          key={name}
                          onClick={() => {
                            setSelectedCountyName(name);
                            setDropdownOpen(false);
                            setSearchQuery("");
                            setMpSearch("");
                          }}
                          className={`w-full text-left px-5 py-3 flex items-center justify-between text-sm font-body transition-colors hover:bg-accent/50 ${selectedCountyName === name ? "bg-accent font-semibold" : ""}`}
                        >
                          <span className="text-foreground">{name}</span>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            {mps.filter((m) => (m.county ?? "Nominated") === name).length} MPs
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {selectedCountyName ? (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-in fade-in duration-500">
                  <div className="bg-card border border-border rounded-lg-custom p-4 shadow-fk-sm text-center">
                    <div className="font-mono text-[10px] uppercase tracking-[.1em] text-muted-foreground mb-1">Total MPs</div>
                    <div className="font-display text-[28px] text-foreground">{totalMPs}</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg-custom p-4 shadow-fk-sm text-center">
                    <div className="font-mono text-[10px] uppercase tracking-[.1em] text-muted-foreground mb-1">Parties</div>
                    <div className="font-display text-[28px] text-foreground">{partyBreakdown.length}</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg-custom p-4 shadow-fk-sm text-center">
                    <div className="font-mono text-[10px] uppercase tracking-[.1em] text-muted-foreground mb-1">MP Salary</div>
                    <div className="font-mono text-[15px] text-foreground font-medium">KSh {(salaries.mp / 1000).toFixed(0)}K</div>
                    <div className="text-[10px] text-muted-foreground">/month gross</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg-custom p-4 shadow-fk-sm text-center">
                    <div className="font-mono text-[10px] uppercase tracking-[.1em] text-muted-foreground mb-1">MCA Salary</div>
                    <div className="font-mono text-[15px] text-foreground font-medium">KSh {(salaries.mca / 1000).toFixed(0)}K</div>
                    <div className="text-[10px] text-muted-foreground">/month gross</div>
                  </div>
                </div>

                {/* Party Breakdown */}
                <div className="bg-card border border-border rounded-lg-custom p-5 mb-6 shadow-fk-sm animate-in fade-in duration-500">
                  <div className="font-mono text-[10px] uppercase tracking-[.1em] text-muted-foreground mb-3">Party Representation</div>
                  <div className="flex flex-wrap gap-2">
                    {partyBreakdown.map(({ party, count }) => (
                      <div key={party} className="flex items-center gap-2 bg-accent/40 rounded-full px-3 py-1.5 text-[12px]">
                        <span className="font-semibold text-foreground">{party}</span>
                        <span className="text-muted-foreground">{count} seat{count > 1 ? "s" : ""}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MP Search */}
                <div className="flex items-center gap-2 bg-card border border-border rounded-lg-custom px-4 py-3 mb-4 shadow-fk-sm">
                  <Search size={16} className="text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search MPs by name, constituency, or party…"
                    className="border-none bg-transparent font-body text-sm outline-none w-full text-foreground placeholder:text-muted-foreground"
                    value={mpSearch}
                    onChange={(e) => setMpSearch(e.target.value)}
                  />
                </div>

                {/* MP List */}
                <div className="bg-card border border-border rounded-lg-custom overflow-hidden shadow-fk-sm animate-in fade-in duration-500">
                  <div className="grid grid-cols-[1fr_1fr_auto] gap-4 px-5 py-3 border-b border-border bg-muted/30 text-[11px] font-mono uppercase tracking-[.1em] text-muted-foreground">
                    <span>Name</span>
                    <span>Constituency</span>
                    <span>Party</span>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto divide-y divide-border">
                    {countyMPs.length === 0 ? (
                      <div className="px-5 py-8 text-center text-sm text-muted-foreground">No MPs found</div>
                    ) : (
                      countyMPs.map((mp, i) => (
                        <button
                          key={`${mp.name}-${i}`}
                          onClick={() => setSelectedMP(mp)}
                          className="w-full grid grid-cols-[1fr_1fr_auto] gap-4 px-5 py-3 text-[13px] font-body hover:bg-kenya-green/5 transition-colors text-left group cursor-pointer"
                        >
                          <span className="text-foreground font-medium group-hover:text-kenya-green transition-colors">{mp.name}</span>
                          <span className="text-muted-foreground">{mp.constituency}</span>
                          <span className="inline-flex items-center justify-center bg-accent/50 rounded-full px-2.5 py-0.5 text-[11px] font-mono font-medium text-foreground min-w-[50px]">
                            {mp.party}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                  <div className="px-5 py-2.5 border-t border-border bg-muted/20 text-[11px] text-muted-foreground font-mono">
                    Click any row to view full details
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-16 bg-card border border-border rounded-lg-custom shadow-fk-sm">
                <Users size={40} className="mx-auto text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground text-[15px] font-body">Select a county to browse its Members of Parliament</p>
              </div>
            )}

          </div>
        </div>
      )}

      <MPModal
        mp={selectedMP}
        open={selectedMP !== null}
        onClose={() => setSelectedMP(null)}
        salaryGross={salaries.mp}
        salaryBreakdown={mpMeta.salary_breakdown}
        constitutionalBasis={mpMeta.constitutional_basis}
        term={mpMeta.term}
        appointmentMethod={mpMeta.appointment_method}
        notes={mpMeta.notes}
        salarySource={mpMeta.salary_source}
      />
    </section>
  );
};

export default MCAExplorer;
