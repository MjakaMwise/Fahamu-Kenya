import { useState, useRef, useEffect } from "react";
import { Search, MapPin, User, Users, ChevronDown } from "lucide-react";
import { useGovernmentData, CountyMember } from "@/hooks/useGovernmentData";

const CountyExplorer = () => {
  const { counties, senators, salaries, loading } = useGovernmentData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCounty, setSelectedCounty] = useState<CountyMember | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = counties.filter(c =>
    c.county.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.governor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectCounty = (county: CountyMember) => {
    setSelectedCounty(county);
    setDropdownOpen(false);
    setSearchQuery("");
  };

  const senator = selectedCounty
    ? senators.find(s => s.county_code === selectedCounty.county_code)
    : null;

  if (loading) {
    return (
      <section className="py-[100px] px-8 bg-background max-md:py-16 max-md:px-5" id="counties-explorer">
        <div className="text-center text-muted-foreground">Loading county data…</div>
      </section>
    );
  }

  return (
    <section className="py-[100px] px-8 bg-background max-md:py-16 max-md:px-5" id="counties-explorer" ref={ref}>
      <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"}`}>
        <div className="text-center max-w-[700px] mx-auto mb-16">
          <div className="font-mono text-xs font-medium uppercase tracking-[.12em] text-kenya-green mb-4">
            Devolved Government
          </div>
          <h2 className="font-display leading-[1.1] tracking-tight mb-5" style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}>
            County Explorer
          </h2>
          <p className="text-[17px] text-fk-slate leading-relaxed">
            Select any of Kenya's 47 counties to see its Governor, Deputy Governor, Senator, and party affiliation.
          </p>
        </div>

        <div className="max-w-[900px] mx-auto">
          {/* County Selector */}
          <div className="relative mb-8" ref={dropdownRef}>
            <div
              className="flex items-center gap-3 bg-card border border-border rounded-lg-custom px-5 py-4 cursor-pointer shadow-fk-sm hover:shadow-fk-md transition-all"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <MapPin size={20} className="text-arm-county shrink-0" />
              <span className={`flex-1 text-[15px] font-body ${selectedCounty ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                {selectedCounty ? `${selectedCounty.county} County` : "Choose a county…"}
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
                  {filtered.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">No counties found</div>
                  ) : (
                    filtered.map(county => (
                      <button
                        key={county.county_code}
                        onClick={() => selectCounty(county)}
                        className={`w-full text-left px-5 py-3 flex items-center justify-between text-sm font-body transition-colors hover:bg-accent/50 ${
                          selectedCounty?.county_code === county.county_code ? "bg-accent font-semibold" : ""
                        }`}
                      >
                        <span className="text-foreground">{county.county}</span>
                        <span className="text-[11px] text-muted-foreground font-mono">#{county.county_code.toString().padStart(3, "0")}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* County Details */}
          {selectedCounty ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in duration-500">
              {/* Governor */}
              <div className="bg-card border border-border rounded-lg-custom p-6 shadow-fk-sm hover:shadow-fk-md transition-all group">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-full bg-arm-county-bg flex items-center justify-center">
                    <User size={18} className="text-arm-county" />
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[.1em] text-arm-county font-medium">Governor</div>
                </div>
                <h3 className="font-display text-[20px] text-foreground leading-tight mb-1 group-hover:text-arm-county transition-colors">
                  {selectedCounty.governor}
                </h3>
                <p className="text-[13px] text-muted-foreground font-body">
                  {selectedCounty.party} · {selectedCounty.county} County
                </p>
                {selectedCounty.notes && (
                  <p className="text-[12px] text-muted-foreground/70 font-body mt-1 italic">{selectedCounty.notes}</p>
                )}
              </div>

              {/* Deputy Governor */}
              <div className="bg-card border border-border rounded-lg-custom p-6 shadow-fk-sm hover:shadow-fk-md transition-all group">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-full bg-arm-county-bg flex items-center justify-center">
                    <User size={18} className="text-arm-county" />
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[.1em] text-arm-county font-medium">Deputy Governor</div>
                </div>
                <h3 className="font-display text-[20px] text-foreground leading-tight mb-1 group-hover:text-arm-county transition-colors">
                  {selectedCounty.deputy_governor}
                </h3>
                <p className="text-[13px] text-muted-foreground font-body">
                  Deputy Governor, {selectedCounty.county} County
                </p>
              </div>

              {/* Senator */}
              <div className="bg-card border border-border rounded-lg-custom p-6 shadow-fk-sm hover:shadow-fk-md transition-all group">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-full bg-arm-county-bg flex items-center justify-center">
                    <Users size={18} className="text-arm-county" />
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[.1em] text-arm-county font-medium">Senator</div>
                </div>
                <h3 className="font-display text-[20px] text-foreground leading-tight mb-1 group-hover:text-arm-county transition-colors">
                  {senator?.senator || "—"}
                </h3>
                <p className="text-[13px] text-muted-foreground font-body">
                  {senator?.party || ""} · {selectedCounty.county} County
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-card border border-border rounded-lg-custom shadow-fk-sm">
              <MapPin size={40} className="mx-auto text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground text-[15px] font-body">Select a county above to explore its leadership</p>
            </div>
          )}

          {/* County quick stats */}
          {selectedCounty && (
            <div className="mt-5 bg-card border border-border rounded-lg-custom p-5 px-6 flex flex-wrap items-center gap-6 text-[13px] shadow-fk-sm animate-in fade-in duration-500">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-arm-county" />
                <span className="text-muted-foreground">County Code:</span>
                <span className="font-mono font-semibold text-foreground">#{selectedCounty.county_code.toString().padStart(3, "0")}</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Party:</span>
                <span className="font-semibold text-foreground">{selectedCounty.party}</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">MCA Salary (est.):</span>
                <span className="font-mono font-semibold text-foreground">KSh {salaries.mca.toLocaleString()}/mo</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CountyExplorer;
