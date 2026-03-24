import { useState, useRef, useEffect, useCallback } from "react";
import { Search } from "lucide-react";

interface TreeNode {
  id: string;
  cls: string;
  pos: string;
  name: string;
  sal?: string;
  children: TreeNode[];
}

const colorMap: Record<string, string> = { ex: "#2E7D32", leg: "#1565C0", jud: "#6A1B9A", sec: "#C62828", cty: "#00695C", adm: "#EF6C00", ind: "#558B2F" };
const bgMap: Record<string, string> = { ex: "#E8F5E9", leg: "#E3F2FD", jud: "#F3E5F5", sec: "#FFEBEE", cty: "#E0F2F1", adm: "#FFF3E0", ind: "#F1F8E9" };

const legendItems = [
  { cls: "all", color: "#888", label: "All" },
  { cls: "ex", color: "#2E7D32", label: "Executive" },
  { cls: "leg", color: "#1565C0", label: "Legislature" },
  { cls: "jud", color: "#6A1B9A", label: "Judiciary" },
  { cls: "sec", color: "#C62828", label: "Security" },
  { cls: "cty", color: "#00695C", label: "County" },
  { cls: "adm", color: "#EF6C00", label: "Administration" },
  { cls: "ind", color: "#558B2F", label: "Independent" },
];

const data: TreeNode = {
  id:'president', cls:'ex', pos:'President', name:'H.E. Dr. William Samoei Ruto, C.G.H.', sal:'KSh 1,443,750/mo',
  children:[
    {id:'dp', cls:'ex', pos:'Deputy President', name:'Prof. Kithure Kindiki, E.G.H.', sal:'KSh 1,227,188/mo', children:[]},
    {id:'hps', cls:'ex', pos:'Head of Public Service', name:'Felix Koskei', sal:'KSh 765,188/mo', children:[]},
    {id:'cos', cls:'ex', pos:'Chief of Staff, State House', name:'Njee Muturi', children:[]},
    {id:'ag', cls:'ex', pos:'Attorney General', name:'Dorcas Agik Oduor', sal:'KSh 924,000/mo', children:[]},
    {
      id:'cabinet', cls:'ex', pos:'Cabinet (22 Cabinet Secretaries)', name:'Chaired by the President', sal:'KSh 924,000/mo each',
      children:[
        {id:'cs1', cls:'ex', pos:'Prime CS — Foreign & Diaspora Affairs', name:'Dr. Musalia Mudavadi, E.G.H.', children:[]},
        {id:'cs2', cls:'ex', pos:'Interior & National Administration', name:'Onesimus Kipchumba Murkomen, E.G.H.',
          children:[
            {id:'cc', cls:'adm', pos:'County Commissioner (×47)', name:'Career civil servants', sal:'KSh 89,748–120,270/mo',
              children:[
                {id:'dcc', cls:'adm', pos:'Deputy County Commissioner (×290+)', name:'Varies by sub-county', sal:'KSh 77,527–109,089/mo',
                  children:[
                    {id:'chief', cls:'adm', pos:'Chief — Location (×6,000+)', name:'Varies by location', sal:'KSh 30,000–70,000/mo',
                      children:[
                        {id:'ac', cls:'adm', pos:'Assistant Chief — Sub-Location (×10,000+)', name:'Varies', sal:'KSh 26,000–47,000/mo',
                          children:[
                            {id:'ve', cls:'adm', pos:'Village Elder / Nyumba Kumi', name:'Community volunteers', sal:'Unpaid', children:[]}
                          ]}
                      ]}
                  ]}
              ]}
          ]},
        {id:'cs3', cls:'ex', pos:'National Treasury & Economic Planning', name:"John Mbadi Ng'ongo, E.G.H.", children:[]},
        {id:'cs4', cls:'ex', pos:'Health', name:'Aden Bare Duale, E.G.H.', children:[]},
        {id:'cs5', cls:'ex', pos:'Defence', name:'Roselinda Soipan Tuya, E.G.H.', children:[]},
        {id:'cs6', cls:'ex', pos:'Environment, Climate Change & Forestry', name:'Dr. Deborah Mlongo Barasa, E.G.H.', children:[]},
        {id:'cs7', cls:'ex', pos:'Education', name:'Julius Migosi Ogamba', children:[]},
        {id:'cs8', cls:'ex', pos:'Agriculture & Livestock', name:'Mutahi Kagwe', children:[]},
        {id:'cs9', cls:'ex', pos:'Roads & Transport', name:'Davis Kirui Chirchir, E.G.H.', children:[]},
        {id:'cs10', cls:'ex', pos:'Lands, Public Works, Housing', name:'Alice Wahome, E.G.H.', children:[]},
        {id:'cs11', cls:'ex', pos:'Energy & Petroleum', name:'James Opiyo Wandayi', children:[]},
        {id:'cs12', cls:'ex', pos:'Water, Sanitation & Irrigation', name:'Eric Muriithi Muuga', children:[]},
        {id:'cs13', cls:'ex', pos:'Investments, Trade & Industry', name:'Lee Kinyanjui', children:[]},
        {id:'cs14', cls:'ex', pos:'ICT & Digital Economy', name:'William Kabogo Gitau', children:[]},
        {id:'cs15', cls:'ex', pos:'Mining, Blue Economy & Maritime', name:'Hassan Ali Joho', children:[]},
        {id:'cs16', cls:'ex', pos:'Co-operatives & MSMEs', name:'Wycliffe Ambetsa Oparanya, E.G.H.', children:[]},
        {id:'cs17', cls:'ex', pos:'Youth Affairs, Creative Economy & Sports', name:'Salim Mvurya, E.G.H.', children:[]},
        {id:'cs18', cls:'ex', pos:'Tourism & Wildlife', name:'Rebecca Miano', children:[]},
        {id:'cs19', cls:'ex', pos:'EAC, ASALs & Regional Development', name:'Beatrice Askul Moe', children:[]},
        {id:'cs20', cls:'ex', pos:'Labour & Social Protection', name:'Dr. Alfred Mutua', children:[]},
        {id:'cs21', cls:'ex', pos:'Gender, Culture, Arts & Heritage', name:'Nombuyekezo Titi Maswanya', children:[]},
        {id:'cs22', cls:'ex', pos:'Public Service & Human Capital', name:'Geoffrey Kiringa Ruku', children:[]}
      ]
    },
    {
      id:'nsc', cls:'sec', pos:'National Security Council', name:'Chaired by the President',
      children:[
        {id:'ig', cls:'sec', pos:'Inspector General of Police', name:'Douglas Kanja Kirocho',
          children:[
            {id:'digkps', cls:'sec', pos:'Dep. IG — Kenya Police Service', name:'Eliud Kipkoech Lagat', children:[]},
            {id:'digaps', cls:'sec', pos:'Dep. IG — Administration Police Service', name:'Gilbert Masengeli', children:[]},
            {id:'dci', cls:'sec', pos:'Director, DCI', name:'Amin Mohammed Ibrahim', children:[]}
          ]},
        {id:'nis', cls:'sec', pos:'Director General, NIS', name:'Noordin M. Haji', children:[]},
        {id:'ckdf', cls:'sec', pos:'Chief of Kenya Defence Forces', name:'Gen. Charles Muriu Kahariri',
          children:[
            {id:'army', cls:'sec', pos:'Commander, Kenya Army', name:'Maj-Gen Peter Njiru Muteti', children:[]},
            {id:'airforce', cls:'sec', pos:'Commander, Kenya Air Force', name:'Air Marshal Johnson Kavuludi', children:[]},
            {id:'navy', cls:'sec', pos:'Commander, Kenya Navy', name:'Vice Admiral Linet Munyasia', children:[]}
          ]}
      ]
    },
    {
      id:'parl', cls:'leg', pos:'Parliament of Kenya', name:'Independent — President opens sessions',
      children:[
        {id:'na', cls:'leg', pos:'National Assembly', name:"Speaker: Dr. Moses Wetang'ula, E.G.H.", sal:'Speaker: KSh 1,208,362/mo',
          children:[
            {id:'dspna', cls:'leg', pos:'Deputy Speaker, NA', name:'Gladys Shollei', children:[]},
            {id:'majldr', cls:'leg', pos:'Majority Leader, NA', name:"Kimani Ichung'wah", sal:'KSh 739,600/mo', children:[]},
            {id:'minldr', cls:'leg', pos:'Minority Leader, NA', name:'Junet Mohamed', sal:'KSh 739,600/mo', children:[]},
            {id:'mps', cls:'leg', pos:'Members of Parliament (349)', name:'290 constituency + 47 Women Reps + 12 Nominated', sal:'KSh 739,600/mo each', children:[]}
          ]},
        {id:'sen', cls:'leg', pos:'Senate', name:'Speaker: Amason Jeffah Kingi, E.G.H.', sal:'Speaker: KSh 1,208,362/mo',
          children:[
            {id:'dspsen', cls:'leg', pos:'Deputy Speaker, Senate', name:'Kathuri Murungi', children:[]},
            {id:'smajldr', cls:'leg', pos:'Majority Leader, Senate', name:'Aaron Cheruiyot', sal:'KSh 739,600/mo', children:[]},
            {id:'sminldr', cls:'leg', pos:'Minority Leader, Senate', name:'Edwin Sifuna', sal:'KSh 739,600/mo', children:[]},
            {id:'senators', cls:'leg', pos:'Senators (67)', name:'47 elected + 16 women + 2 youth + 2 PWD', sal:'KSh 739,600/mo each', children:[]}
          ]}
      ]
    },
    {
      id:'jud', cls:'jud', pos:'Judiciary (Independent)', name:'President appoints via JSC + Parliament approval',
      children:[
        {id:'cj', cls:'jud', pos:'Chief Justice & President, Supreme Court', name:'Lady Justice Martha Karambu Koome', sal:'~KSh 1,403,942/mo',
          children:[
            {id:'dcj', cls:'jud', pos:'Deputy Chief Justice', name:'Lady Justice Philomena Mbete Mwilu', sal:'~KSh 1,304,185/mo', children:[]},
            {id:'sc1', cls:'jud', pos:'Justice of the Supreme Court', name:'Justice Mohammed Khadhar Ibrahim', sal:'~KSh 1,100,000–1,200,000/mo', children:[]},
            {id:'sc2', cls:'jud', pos:'Justice of the Supreme Court', name:'Justice Smokin Charles Wanjala', children:[]},
            {id:'sc3', cls:'jud', pos:'Justice of the Supreme Court', name:"Justice Njoki Ndung'u", children:[]},
            {id:'sc4', cls:'jud', pos:'Justice of the Supreme Court', name:'Justice Isaac Lenaola', children:[]},
            {id:'sc5', cls:'jud', pos:'Justice of the Supreme Court', name:'Justice William Ouko', children:[]},
            {id:'coa', cls:'jud', pos:'Court of Appeal (~50 Justices)', name:'President: Justice Daniel Musinga', sal:'~KSh 850,000–950,000/mo',
              children:[
                {id:'hc', cls:'jud', pos:'High Court (~150 Judges)', name:'Principal Judge: Justice Eric Ogolla', sal:'~KSh 600,000–800,000/mo',
                  children:[
                    {id:'elc', cls:'jud', pos:'Employment & Labour Relations Court', name:'Various Judges', children:[]},
                    {id:'elrc', cls:'jud', pos:'Environment & Land Court', name:'Various Judges', children:[]},
                    {id:'mag', cls:'jud', pos:'Magistrates Courts (nationwide)', name:'Chief & Senior Resident Magistrates', sal:'KSh 150,000–350,000/mo', children:[]},
                    {id:'kad', cls:'jud', pos:'Kadhis Courts (Muslim family law)', name:'Chief Kadhi + Kadhis', children:[]}
                  ]}
              ]}
          ]}
      ]
    },
    {
      id:'counties', cls:'cty', pos:'47 County Governments (Devolved)', name:'Fourth Schedule, Constitution 2010',
      children:[
        {id:'gov', cls:'cty', pos:'County Governor (×47)', name:'Elected per county', sal:'~KSh 990,000/mo',
          children:[
            {id:'dgov', cls:'cty', pos:'Deputy Governor (×47)', name:'Runs with Governor', sal:'~KSh 684,233/mo', children:[]},
            {id:'cecm', cls:'cty', pos:'County Executive Committee Members', name:'~10 per county (≈470 total)', sal:'~KSh 422,526/mo', children:[]},
            {id:'ccos', cls:'cty', pos:'County Chief Officers', name:'Head county departments', children:[]}
          ]},
        {id:'cassembly', cls:'cty', pos:'County Assembly', name:'Speaker + MCAs',
          children:[
            {id:'caspeaker', cls:'cty', pos:'County Assembly Speaker (×47)', name:'Elected by MCAs', sal:'~KSh 549,283/mo', children:[]},
            {id:'mcas', cls:'cty', pos:'Members of County Assembly (MCAs)', name:'~1,450 total across 47 counties', sal:'~KSh 164,588/mo', children:[]}
          ]}
      ]
    },
    {
      id:'indep', cls:'ind', pos:'Independent Constitutional Offices & Commissions', name:'Chapter 15, Constitution 2010',
      children:[
        {id:'dpp', cls:'ind', pos:'Director of Public Prosecutions (DPP)', name:'Renson M. Ingonga', children:[]},
        {id:'audgen', cls:'ind', pos:'Auditor General', name:'Nancy Gathungu', children:[]},
        {id:'cob', cls:'ind', pos:'Controller of Budget', name:"FCPA Dr. Margaret Nyakang'o", children:[]},
        {id:'iebc', cls:'ind', pos:'IEBC Chairperson', name:'Erastus Edung Ethekon (+ 6 Commissioners)', children:[]},
        {id:'eacc', cls:'ind', pos:'EACC Chair', name:'Archbishop (Rtd) Eliud Wabukala', children:[]},
        {id:'src', cls:'ind', pos:'SRC Chair', name:'Lyn Mengich', children:[]},
        {id:'nlc', cls:'ind', pos:'NLC Chair', name:'Samuel Tororei', children:[]},
        {id:'psc', cls:'ind', pos:'Public Service Commission Chair', name:'Anthony Muchiri', children:[]},
        {id:'ncic', cls:'ind', pos:'NCIC Chair', name:'Samuel Kobia', children:[]},
        {id:'ipoa', cls:'ind', pos:'IPOA Chair', name:'Anne Makori', children:[]},
        {id:'ombuds', cls:'ind', pos:'Commission on Administrative Justice (Ombudsman)', name:'Ben Sihanya', children:[]}
      ]
    }
  ]
};

const NodeComponent = ({ node, openNodes, toggle, searchQuery, filterCls }: {
  node: TreeNode;
  openNodes: Set<string>;
  toggle: (id: string) => void;
  searchQuery: string;
  filterCls: string;
}) => {
  const hasCh = node.children.length > 0;
  const isOpen = openNodes.has(node.id);
  const c = colorMap[node.cls] || "#444";
  const bg = bgMap[node.cls] || "#F5F5F5";

  const searchText = `${node.pos} ${node.name} ${node.sal || ""}`.toLowerCase();
  const matchesSearch = !searchQuery || searchText.includes(searchQuery.toLowerCase());
  const matchesFilter = filterCls === "all" || node.cls === filterCls;

  const hasMatchingDescendant = useCallback((n: TreeNode): boolean => {
    const text = `${n.pos} ${n.name} ${n.sal || ""}`.toLowerCase();
    if (searchQuery && text.includes(searchQuery.toLowerCase())) return true;
    if (filterCls !== "all" && n.cls === filterCls) return true;
    return n.children.some(ch => hasMatchingDescendant(ch));
  }, [searchQuery, filterCls]);

  const shouldShow = matchesSearch && matchesFilter || hasMatchingDescendant(node);
  if (!shouldShow && (searchQuery || filterCls !== "all")) return null;

  return (
    <div className="relative pl-[22px]">
      <div className="absolute left-[7px] top-0 bottom-0 border-l-[1.5px] border-fk-sand" />
      <div
        className="flex items-start gap-2 py-1 cursor-pointer relative rounded-sm hover:bg-fk-black/[0.02]"
        onClick={() => hasCh && toggle(node.id)}
      >
        <div className="absolute left-[-15px] top-[14px] w-[15px] border-t-[1.5px] border-fk-sand" />
        {hasCh ? (
          <span
            className={`w-5 h-5 rounded-[5px] flex items-center justify-center text-[10px] shrink-0 mt-0.5 border-[1.5px] cursor-pointer transition-all duration-200 hover:scale-110 ${
              isOpen ? "text-fk-white" : ""
            }`}
            style={{
              color: isOpen ? undefined : c,
              borderColor: c,
              background: isOpen ? c : "transparent",
            }}
          >
            <span style={isOpen ? { filter: "invert(1)" } : {}}>{isOpen ? "▼" : "▶"}</span>
          </span>
        ) : (
          <span className="w-5 shrink-0" />
        )}
        <div>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-[12.5px] font-semibold whitespace-nowrap border transition-all duration-200 hover:opacity-85 hover:translate-x-0.5"
            style={{ background: bg, color: c, borderColor: c }}
          >
            {node.pos}
          </span>
          <div className="text-[11.5px] text-fk-slate pt-1 leading-relaxed max-w-[320px]">
            {node.name}
            {node.sal && <span className="font-mono-custom text-[10.5px] text-muted-foreground whitespace-nowrap"> · {node.sal}</span>}
          </div>
        </div>
      </div>
      {hasCh && isOpen && (
        <div>
          {node.children.map(ch => (
            <NodeComponent key={ch.id} node={ch} openNodes={openNodes} toggle={toggle} searchQuery={searchQuery} filterCls={filterCls} />
          ))}
        </div>
      )}
    </div>
  );
};

interface CommandTreeProps {
  filterCls?: string;
}

const CommandTree = ({ filterCls: externalFilter }: CommandTreeProps) => {
  const [openNodes, setOpenNodes] = useState<Set<string>>(() => new Set(["president", "cabinet", "nsc", "parl", "jud", "counties", "indep"]));
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCls, setFilterCls] = useState("all");
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (externalFilter) {
      setFilterCls(externalFilter);
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [externalFilter]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const toggle = (id: string) => {
    setOpenNodes(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    const ids = new Set<string>();
    const collect = (n: TreeNode) => { ids.add(n.id); n.children.forEach(collect); };
    collect(data);
    setOpenNodes(ids);
  };

  const collapseAll = () => setOpenNodes(new Set(["president"]));

  const c = colorMap.ex;

  return (
    <section className="py-[100px] px-8 bg-card max-md:py-16 max-md:px-5" id="structure" ref={ref}>
      <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"}`}>
        <div className="text-center max-w-[700px] mx-auto mb-16">
          <div className="font-mono-custom text-xs font-medium uppercase tracking-[.12em] text-kenya-green mb-4">Interactive Explorer</div>
          <h2 className="font-display leading-[1.1] tracking-tight mb-5" style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}>
            The Full<br />Command Tree
          </h2>
          <p className="text-[17px] text-fk-slate leading-relaxed">
            Click any office to expand. Search by name, position, or ministry. Every level of governance — mapped.
          </p>
        </div>

        <div className="max-w-[1000px] mx-auto bg-card rounded-lg-custom border border-fk-black/[0.06] shadow-fk-lg overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 px-6 border-b border-fk-black/[0.06] flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-background border border-fk-sand rounded-pill px-4 py-2 flex-1 max-w-[360px] focus-within:border-kenya-green focus-within:ring-[3px] focus-within:ring-kenya-green/[0.08] transition-all max-md:max-w-full">
              <Search size={16} className="text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search leaders, offices, ministries…"
                className="border-none bg-transparent font-body text-sm outline-none w-full text-foreground placeholder:text-muted-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-1.5 max-[480px]:hidden">
              <button onClick={expandAll} className="px-3.5 py-[7px] rounded-pill border border-fk-sand bg-card text-[12.5px] font-medium text-fk-slate cursor-pointer transition-all hover:bg-fk-charcoal hover:text-fk-white hover:border-fk-charcoal">
                Expand All
              </button>
              <button onClick={collapseAll} className="px-3.5 py-[7px] rounded-pill border border-fk-sand bg-card text-[12.5px] font-medium text-fk-slate cursor-pointer transition-all hover:bg-fk-charcoal hover:text-fk-white hover:border-fk-charcoal">
                Collapse All
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 px-6 py-3.5 border-b border-fk-black/[0.04] bg-fk-black/[0.01]">
            {legendItems.map(item => (
              <button
                key={item.cls}
                onClick={() => setFilterCls(item.cls)}
                className={`flex items-center gap-1.5 text-xs text-fk-slate cursor-pointer px-2.5 py-[3px] pl-[3px] rounded-pill transition-all hover:bg-fk-black/[0.04] ${filterCls === item.cls ? "bg-fk-black/[0.06] font-semibold" : ""}`}
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                {item.label}
              </button>
            ))}
          </div>

          {/* Tree body */}
          <div className="p-4 px-6 max-h-[70vh] overflow-y-auto tree-scroll max-md:px-4">
            {/* Root node */}
            <div>
              <div className="flex items-center gap-2.5 py-2 pb-3 cursor-pointer" onClick={() => toggle(data.id)}>
                <span
                  className="w-5 h-5 rounded-[5px] flex items-center justify-center text-[10px] shrink-0 border-[1.5px]"
                  style={{ color: c, borderColor: c, background: openNodes.has(data.id) ? c : "transparent" }}
                >
                  <span style={openNodes.has(data.id) ? { filter: "invert(1)" } : {}}>{openNodes.has(data.id) ? "▼" : "▶"}</span>
                </span>
                <span className="px-[18px] py-2 rounded-pill text-[15px] font-bold inline-flex items-center gap-2 border-[1.5px]" style={{ borderColor: c, color: c, background: "#C8E6C9" }}>
                  {data.pos}
                </span>
                <span className="text-[13px] text-fk-slate">
                  {data.name} <span className="font-mono-custom text-[10.5px] text-muted-foreground">· {data.sal}</span>
                </span>
              </div>
              {openNodes.has(data.id) && (
                <div>
                  {data.children.map(ch => (
                    <NodeComponent key={ch.id} node={ch} openNodes={openNodes} toggle={toggle} searchQuery={searchQuery} filterCls={filterCls} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommandTree;
