import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  ExternalLink,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubClause {
  letter: string;
  text: string;
}

interface Clause {
  number: number | null;
  text: string;
  sub_clauses?: SubClause[];
}

interface Article {
  number: number;
  title: string;
  part?: number;
  clauses: Clause[];
  simple_explanation?: string;
}

interface ChapterPart {
  number: number;
  title: string;
  articles: number[];
}

interface Chapter {
  number: number;
  roman: string;
  title: string;
  parts?: ChapterPart[];
  articles: Article[];
}

interface ConstitutionData {
  title: string;
  year: number;
  gazette?: string;
  assented?: string;
  preamble: string;
  chapters: Chapter[];
}

interface TooltipState {
  x: number;
  y: number;
  text: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildArticleMap(chapters: Chapter[]): Map<number, Article> {
  const map = new Map<number, Article>();
  chapters.forEach((ch) => ch.articles.forEach((a) => map.set(a.number, a)));
  return map;
}

function articleMatches(art: Article, q: string): boolean {
  if (!q) return true;
  const lq = q.toLowerCase();
  if (art.title.toLowerCase().includes(lq)) return true;
  if (art.simple_explanation?.toLowerCase().includes(lq)) return true;
  return art.clauses.some(
    (c) =>
      c.text.toLowerCase().includes(lq) ||
      (c.sub_clauses || []).some((sc) => sc.text.toLowerCase().includes(lq))
  );
}

// ─── Highlight ────────────────────────────────────────────────────────────────

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 text-fk-charcoal rounded-sm px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ─── ParsedText (cross-references) ───────────────────────────────────────────

function ParsedText({
  text,
  articleMap,
  onArticleOpen,
}: {
  text: string;
  articleMap: Map<number, Article>;
  onArticleOpen: (a: Article) => void;
}) {
  const parts = text.split(/(Article\s+\d+)/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^Article\s+(\d+)$/);
        if (match) {
          const n = parseInt(match[1], 10);
          const art = articleMap.get(n);
          if (art) {
            return (
              <button
                key={i}
                onClick={() => onArticleOpen(art)}
                className="text-green-700 font-semibold underline decoration-dotted underline-offset-2 hover:text-green-900 cursor-pointer transition-colors"
              >
                {part}
              </button>
            );
          }
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// ─── Article Modal ────────────────────────────────────────────────────────────

interface ModalProps {
  article: Article;
  articleMap: Map<number, Article>;
  onClose: () => void;
  onArticleOpen: (a: Article) => void;
}

function ArticleModal({ article, articleMap, onClose, onArticleOpen }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll while modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-start justify-center pt-16 pb-10 px-4 bg-fk-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-card w-full max-w-[680px] rounded-xl shadow-fk-xl border border-border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-border">
          <div>
            <div className="font-mono-custom text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Article {article.number}
            </div>
            <h2 className="font-display text-[22px] text-foreground leading-tight">
              {article.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Plain-language explanation */}
        {article.simple_explanation && (
          <div className="mx-6 mt-5 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="font-mono-custom text-[9px] font-semibold uppercase tracking-widest text-green-700 mb-1.5">
              Plain Language
            </div>
            <p className="text-[13.5px] text-green-900 leading-relaxed">
              {article.simple_explanation}
            </p>
          </div>
        )}

        {/* Clauses */}
        <div className="px-6 py-5 space-y-3">
          {article.clauses.map((clause, ci) => (
            <div key={ci} className="flex gap-3">
              {clause.number != null && (
                <span className="font-mono-custom text-[11px] text-muted-foreground shrink-0 pt-[3px] w-6 text-right">
                  ({clause.number})
                </span>
              )}
              <div className="flex-1">
                <p className="text-[14px] text-foreground leading-relaxed">
                  <ParsedText
                    text={clause.text}
                    articleMap={articleMap}
                    onArticleOpen={onArticleOpen}
                  />
                </p>
                {clause.sub_clauses && clause.sub_clauses.length > 0 && (
                  <div className="mt-2 ml-1 space-y-1.5 border-l-2 border-border pl-3">
                    {clause.sub_clauses.map((sc) => (
                      <div key={sc.letter} className="flex gap-2.5">
                        <span className="font-mono-custom text-[10px] text-muted-foreground shrink-0 pt-[3px]">
                          ({sc.letter})
                        </span>
                        <p className="text-[13.5px] text-foreground/80 leading-relaxed">
                          <ParsedText
                            text={sc.text}
                            articleMap={articleMap}
                            onArticleOpen={onArticleOpen}
                          />
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  data: ConstitutionData;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  expandedChapters: Set<number>;
  onToggleChapter: (n: number) => void;
  matchingArticleNumbers: Set<number> | null;
  onArticleClick: (n: number) => void;
}

function ConstitutionSidebar({
  data,
  searchQuery,
  onSearchChange,
  expandedChapters,
  onToggleChapter,
  matchingArticleNumbers,
  onArticleClick,
}: SidebarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-4 py-3 border-b border-fk-white/[0.08] shrink-0">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-fk-white/35 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search articles…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-fk-white/[0.07] border border-fk-white/[0.12] rounded-lg pl-8 pr-7 py-2 text-[13px] text-fk-white placeholder:text-fk-white/25 focus:outline-none focus:border-green-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => { onSearchChange(""); inputRef.current?.focus(); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-fk-white/35 hover:text-fk-white cursor-pointer transition-colors"
            >
              <X size={12} />
            </button>
          )}
        </div>
        {searchQuery && matchingArticleNumbers && (
          <p className="font-mono-custom text-[10px] text-fk-white/30 mt-1.5 pl-1">
            {matchingArticleNumbers.size} article{matchingArticleNumbers.size !== 1 ? "s" : ""} matched
          </p>
        )}
      </div>

      {/* Chapter navigation */}
      <nav className="flex-1 overflow-y-auto py-1" aria-label="Chapter navigation">
        {data.chapters.map((ch) => {
          const visible = ch.articles.filter(
            (a) => !matchingArticleNumbers || matchingArticleNumbers.has(a.number)
          );
          if (searchQuery && visible.length === 0) return null;
          const isExpanded = expandedChapters.has(ch.number);

          return (
            <div key={ch.number} className="border-b border-fk-white/[0.05] last:border-0">
              {/* Chapter header */}
              <button
                onClick={() => onToggleChapter(ch.number)}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-fk-white/[0.04] transition-colors group cursor-pointer"
              >
                <ChevronRight
                  size={12}
                  className="text-fk-white/25 shrink-0 transition-transform duration-150"
                  style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
                />
                <span className="font-mono-custom text-[9px] text-green-400/60 shrink-0 uppercase tracking-wider">
                  {ch.number}
                </span>
                <span className="text-[11.5px] font-medium text-fk-white/65 group-hover:text-fk-white/90 leading-snug flex-1 min-w-0 truncate transition-colors">
                  {ch.title}
                </span>
              </button>

              {/* Articles (expanded) */}
              {isExpanded && (
                <div className="pb-1">
                  {ch.parts && ch.parts.length > 0 ? (
                    ch.parts.map((pt) => {
                      const partArts = ch.articles.filter(
                        (a) =>
                          a.part === pt.number &&
                          (!matchingArticleNumbers || matchingArticleNumbers.has(a.number))
                      );
                      if (searchQuery && partArts.length === 0) return null;
                      return (
                        <div key={pt.number}>
                          <div className="px-9 pt-2 pb-0.5">
                            <span className="font-mono-custom text-[9px] uppercase tracking-wider text-fk-white/20">
                              Part {pt.number} — {pt.title}
                            </span>
                          </div>
                          {partArts.map((art) => (
                            <button
                              key={art.number}
                              onClick={() => onArticleClick(art.number)}
                              className="w-full flex items-baseline gap-2 px-4 pl-9 py-1.5 text-left hover:bg-green-900/20 group transition-colors cursor-pointer"
                            >
                              <span className="font-mono-custom text-[9.5px] text-green-400/50 shrink-0 group-hover:text-green-400 transition-colors">
                                {art.number}
                              </span>
                              <span className="text-[11.5px] text-fk-white/50 group-hover:text-fk-white/85 leading-snug transition-colors">
                                {searchQuery ? (
                                  <Highlight text={art.title} query={searchQuery} />
                                ) : (
                                  art.title
                                )}
                              </span>
                            </button>
                          ))}
                        </div>
                      );
                    })
                  ) : (
                    visible.map((art) => (
                      <button
                        key={art.number}
                        onClick={() => onArticleClick(art.number)}
                        className="w-full flex items-baseline gap-2 px-4 pl-9 py-1.5 text-left hover:bg-green-900/20 group transition-colors cursor-pointer"
                      >
                        <span className="font-mono-custom text-[9.5px] text-green-400/50 shrink-0 group-hover:text-green-400 transition-colors">
                          {art.number}
                        </span>
                        <span className="text-[11.5px] text-fk-white/50 group-hover:text-fk-white/85 leading-snug transition-colors">
                          {searchQuery ? (
                            <Highlight text={art.title} query={searchQuery} />
                          ) : (
                            art.title
                          )}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-fk-white/[0.06] shrink-0">
        <p className="font-mono-custom text-[9px] text-fk-white/20 leading-relaxed">
          264 articles · 18 chapters
          <br />
          Source: kenyalaw.org · CC BY-NC-SA 4.0
        </p>
      </div>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

const ConstitutionPage = () => {
  const [data, setData] = useState<ConstitutionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(
    new Set([1, 2, 3])
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<Article | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  useEffect(() => {
    fetch("/data/constitution.json")
      .then((r) => r.json())
      .then((json: ConstitutionData) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const articleMap = useMemo(() => {
    if (!data) return new Map<number, Article>();
    return buildArticleMap(data.chapters);
  }, [data]);

  // Auto-expand all chapters when searching
  useEffect(() => {
    if (searchQuery && data) {
      setExpandedChapters(new Set(data.chapters.map((c) => c.number)));
    }
  }, [searchQuery, data]);

  const matchingArticleNumbers = useMemo<Set<number> | null>(() => {
    if (!data || !searchQuery) return null;
    const set = new Set<number>();
    data.chapters.forEach((ch) =>
      ch.articles.forEach((a) => {
        if (articleMatches(a, searchQuery)) set.add(a.number);
      })
    );
    return set;
  }, [data, searchQuery]);

  const openModal = useCallback((article: Article) => {
    setActiveModal(article);
    setSidebarOpen(false);
  }, []);

  const closeModal = useCallback(() => setActiveModal(null), []);

  const toggleChapter = useCallback((n: number) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  }, []);

  const scrollToArticle = useCallback((n: number) => {
    const el = document.getElementById(`article-${n}`);
    if (el) {
      // Offset for the fixed header (58px)
      const y = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: "smooth" });
      setSidebarOpen(false);
    }
  }, []);

  const showTooltip = useCallback((e: React.MouseEvent, text: string) => {
    setTooltip({ x: e.clientX, y: e.clientY, text });
  }, []);

  const moveTooltip = useCallback((e: React.MouseEvent) => {
    setTooltip((t) => (t ? { ...t, x: e.clientX, y: e.clientY } : null));
  }, []);

  const hideTooltip = useCallback(() => setTooltip(null), []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-3">
        <BookOpen size={32} className="text-green-700 animate-pulse" />
        <p className="font-mono-custom text-sm text-muted-foreground">
          Loading constitution…
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-destructive text-sm">
          Failed to load constitution data. Please refresh.
        </p>
      </div>
    );
  }

  const HEADER_H = 58; // px — keep in sync with the header below

  return (
    <div className="min-h-screen bg-background" onMouseLeave={hideTooltip}>

      {/* ── Fixed header ── */}
      <header
        style={{ height: HEADER_H }}
        className="fixed top-0 left-0 right-0 z-[1000] flex items-center gap-3 px-5 bg-fk-white/88 backdrop-blur-[20px] backdrop-saturate-[1.4] border-b border-fk-black/[0.07]"
      >
        <Link
          to="/"
          className="flex items-center gap-1.5 text-fk-slate hover:text-fk-charcoal transition-colors text-sm no-underline shrink-0"
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline font-medium">Home</span>
        </Link>

        <div className="h-4 w-px bg-fk-black/15 mx-0.5 hidden sm:block" />

        <div className="flex items-center gap-2 shrink-0 min-w-0">
          <svg className="w-6 h-6 shrink-0" viewBox="0 0 36 36" fill="none">
            <path
              d="M18 2L4 8v10c0 9.33 5.97 18.05 14 20 8.03-1.95 14-10.67 14-20V8L18 2z"
              fill="hsl(var(--kenya-green))"
              opacity=".12"
            />
            <path
              d="M18 4L6 9.2v8.8c0 8.2 5.1 15.9 12 17.6 6.9-1.7 12-9.4 12-17.6V9.2L18 4z"
              stroke="hsl(var(--kenya-green))"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M12 18h12M18 12v12"
              stroke="hsl(var(--kenya-green))"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="18" cy="18" r="3" fill="hsl(var(--kenya-red))" />
          </svg>
          <span className="font-display text-[17px] tracking-tight text-fk-charcoal truncate">
            Constitution of Kenya, 2010
          </span>
        </div>

        <div className="flex-1" />

        {/* Search — desktop */}
        <div className="relative hidden lg:block w-52">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-fk-slate pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search articles…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-fk-black/[0.05] border border-border rounded-lg pl-8 pr-8 py-1.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-fk-black/[0.06] text-fk-charcoal transition-colors cursor-pointer"
          aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* ── Page body ── */}
      <div className="flex" style={{ paddingTop: HEADER_H }}>

        {/* ── Desktop sidebar ── */}
        <aside
          className="hidden lg:flex flex-col w-64 xl:w-[272px] shrink-0 bg-fk-charcoal border-r border-fk-white/[0.07] overflow-hidden"
          style={{
            position: "sticky",
            top: HEADER_H,
            height: `calc(100vh - ${HEADER_H}px)`,
          }}
        >
          <ConstitutionSidebar
            data={data}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            expandedChapters={expandedChapters}
            onToggleChapter={toggleChapter}
            matchingArticleNumbers={matchingArticleNumbers}
            onArticleClick={scrollToArticle}
          />
        </aside>

        {/* ── Mobile sidebar overlay ── */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-[900] bg-fk-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <aside
              className="fixed left-0 bottom-0 z-[950] w-[280px] bg-fk-charcoal overflow-hidden lg:hidden flex flex-col border-r border-fk-white/[0.07] shadow-fk-xl"
              style={{ top: HEADER_H }}
            >
              <ConstitutionSidebar
                data={data}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                expandedChapters={expandedChapters}
                onToggleChapter={toggleChapter}
                matchingArticleNumbers={matchingArticleNumbers}
                onArticleClick={scrollToArticle}
              />
            </aside>
          </>
        )}

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 px-5 sm:px-8 lg:px-12 xl:px-16 py-10 max-w-[900px]">

          {/* Page intro */}
          <div className="mb-10">
            <div className="font-mono-custom text-xs font-medium uppercase tracking-[.12em] text-green-700 mb-3">
              {data.gazette ?? "Kenya Gazette"} · Promulgated {data.assented ?? "2010-08-27"}
            </div>
            <h1
              className="font-display text-foreground leading-tight mb-4"
              style={{ fontSize: "clamp(26px, 3.5vw, 42px)" }}
            >
              {data.title}, {data.year}
            </h1>

            {data.preamble && (
              <details className="group mt-2">
                <summary className="list-none cursor-pointer text-[13.5px] text-muted-foreground hover:text-foreground flex items-center gap-1.5 select-none transition-colors">
                  <ChevronRight
                    size={13}
                    className="transition-transform duration-150 group-open:rotate-90 shrink-0"
                  />
                  Read Preamble
                </summary>
                <blockquote className="mt-3 pl-4 border-l-2 border-green-300 text-[13.5px] text-fk-slate leading-relaxed italic">
                  {data.preamble}
                </blockquote>
              </details>
            )}
          </div>

          {/* Mobile search */}
          <div className="relative lg:hidden mb-6">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search articles…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-fk-black/[0.05] border border-border rounded-lg pl-9 pr-8 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Search result count */}
          {searchQuery && matchingArticleNumbers && (
            <p className="font-mono-custom text-xs text-muted-foreground mb-6">
              {matchingArticleNumbers.size} article
              {matchingArticleNumbers.size !== 1 ? "s" : ""} matching &ldquo;{searchQuery}&rdquo;
            </p>
          )}

          {/* ── Chapters ── */}
          {data.chapters.map((ch) => {
            const visibleArticles = ch.articles.filter(
              (a) => !matchingArticleNumbers || matchingArticleNumbers.has(a.number)
            );
            if (searchQuery && visibleArticles.length === 0) return null;

            return (
              <section key={ch.number} id={`chapter-${ch.number}`} className="mb-14">

                {/* Chapter heading */}
                <div className="flex items-baseline gap-3 mb-6 pb-3 border-b-2 border-green-700/15">
                  <span className="font-mono-custom text-[11px] font-semibold text-green-700/70 uppercase tracking-widest shrink-0">
                    Chapter {ch.roman}
                  </span>
                  <h2
                    className="font-display text-foreground leading-tight"
                    style={{ fontSize: "clamp(17px, 2vw, 24px)" }}
                  >
                    {ch.title}
                  </h2>
                </div>

                {/* Articles */}
                <div className="space-y-5">
                  {visibleArticles.map((art) => {
                    const isHighlighted =
                      !!searchQuery && !!matchingArticleNumbers?.has(art.number);

                    return (
                      <article
                        key={art.number}
                        id={`article-${art.number}`}
                        className={`rounded-xl border overflow-hidden transition-all duration-200 ${
                          isHighlighted
                            ? "border-green-300 shadow-sm ring-1 ring-green-200"
                            : "border-border"
                        }`}
                      >
                        {/* Article header — clickable → modal */}
                        <div
                          className="flex items-start gap-3 px-5 pt-4 pb-3 cursor-pointer group hover:bg-green-50/60 active:bg-green-50 transition-colors"
                          onClick={() => openModal(art)}
                          onMouseEnter={
                            art.simple_explanation
                              ? (e) => showTooltip(e, art.simple_explanation!)
                              : undefined
                          }
                          onMouseMove={art.simple_explanation ? moveTooltip : undefined}
                          onMouseLeave={art.simple_explanation ? hideTooltip : undefined}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") openModal(art);
                          }}
                          aria-label={`Open Article ${art.number}: ${art.title}`}
                        >
                          <span className="font-mono-custom text-[10px] font-semibold text-green-700 bg-green-100 rounded px-1.5 py-0.5 shrink-0 mt-0.5 group-hover:bg-green-200 transition-colors">
                            Art. {art.number}
                          </span>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-[14.5px] font-semibold text-foreground group-hover:text-green-800 leading-snug transition-colors underline decoration-dotted decoration-green-300/60 underline-offset-2">
                              {searchQuery ? (
                                <Highlight text={art.title} query={searchQuery} />
                              ) : (
                                art.title
                              )}
                            </h3>
                            {art.simple_explanation && (
                              <p className="text-[12px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                                {searchQuery ? (
                                  <Highlight
                                    text={art.simple_explanation}
                                    query={searchQuery}
                                  />
                                ) : (
                                  art.simple_explanation
                                )}
                              </p>
                            )}
                          </div>

                          <ExternalLink
                            size={13}
                            className="text-muted-foreground/30 group-hover:text-green-600 shrink-0 mt-1 transition-colors"
                            aria-hidden
                          />
                        </div>

                        {/* Clauses */}
                        <div className="px-5 pb-5 pt-3 space-y-2.5 border-t border-border/40">
                          {art.clauses.map((clause, ci) => (
                            <div key={ci} className="flex gap-3">
                              {clause.number != null && (
                                <span className="font-mono-custom text-[11px] text-muted-foreground shrink-0 pt-[3px] w-5 text-right">
                                  ({clause.number})
                                </span>
                              )}
                              <div className="flex-1">
                                <p className="text-[13.5px] text-foreground/85 leading-relaxed">
                                  <ParsedText
                                    text={clause.text}
                                    articleMap={articleMap}
                                    onArticleOpen={openModal}
                                  />
                                </p>
                                {clause.sub_clauses && clause.sub_clauses.length > 0 && (
                                  <div className="mt-2 ml-1 space-y-1.5 border-l-2 border-border/60 pl-3">
                                    {clause.sub_clauses.map((sc) => (
                                      <div key={sc.letter} className="flex gap-2.5">
                                        <span className="font-mono-custom text-[10px] text-muted-foreground shrink-0 pt-[3px]">
                                          ({sc.letter})
                                        </span>
                                        <p className="text-[13px] text-foreground/75 leading-relaxed">
                                          <ParsedText
                                            text={sc.text}
                                            articleMap={articleMap}
                                            onArticleOpen={openModal}
                                          />
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-border text-center">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {data.title}, {data.year} ·{" "}
              {data.gazette ?? "Kenya Gazette Vol. CXII—No. 88"} ·{" "}
              Source: Kenya Law (kenyalaw.org) · CC BY-NC-SA 4.0
            </p>
          </div>
        </main>
      </div>

      {/* ── Article Modal ── */}
      {activeModal && (
        <ArticleModal
          article={activeModal}
          articleMap={articleMap}
          onClose={closeModal}
          onArticleOpen={openModal}
        />
      )}

      {/* ── Floating Tooltip ── */}
      {tooltip && (
        <div
          className="fixed z-[9999] max-w-[280px] bg-fk-charcoal text-fk-white/90 text-[12px] rounded-lg px-3 py-2.5 shadow-fk-lg pointer-events-none leading-relaxed border border-fk-white/[0.1]"
          style={{
            left: Math.min(tooltip.x + 14, window.innerWidth - 300),
            top: Math.max(tooltip.y - 70, 8),
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

export default ConstitutionPage;
