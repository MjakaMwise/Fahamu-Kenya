import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Why It Matters", href: "#why" },
  { label: "Structure", href: "#structure" },
  { label: "Salaries", href: "#salaries" },
  { label: "Counties", href: "#counties-explorer" },
  { label: "MPs & MCAs", href: "#mca-explorer" },
  { label: "Quiz", href: "#quiz" },
  { label: "Constitution", href: "#constitution" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-8 transition-all duration-400 ${
        scrolled
          ? "py-2.5 bg-fk-white/85 backdrop-blur-[20px] backdrop-saturate-[1.4] border-b border-fk-black/[0.06]"
          : "py-4"
      }`}
    >
      <a href="#" className="flex items-center gap-2.5 no-underline text-fk-charcoal">
        <svg className="w-9 h-9" viewBox="0 0 36 36" fill="none">
          <path d="M18 2L4 8v10c0 9.33 5.97 18.05 14 20 8.03-1.95 14-10.67 14-20V8L18 2z" fill="hsl(var(--kenya-green))" opacity=".12"/>
          <path d="M18 4L6 9.2v8.8c0 8.2 5.1 15.9 12 17.6 6.9-1.7 12-9.4 12-17.6V9.2L18 4z" stroke="hsl(var(--kenya-green))" strokeWidth="1.5" fill="none"/>
          <path d="M12 18h12M18 12v12" stroke="hsl(var(--kenya-green))" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="18" cy="18" r="3" fill="hsl(var(--kenya-red))"/>
        </svg>
        <span className="font-display text-[22px] tracking-tight">Fahamu Kenya</span>
      </a>

      <ul className="hidden md:flex items-center gap-2 list-none">
        {navLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="no-underline text-fk-slate text-sm font-medium px-4 py-2 rounded-pill transition-all hover:bg-fk-black/5 hover:text-fk-charcoal"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <button
        className="md:hidden bg-transparent border-none cursor-pointer p-2"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Menu"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-fk-white/95 backdrop-blur-xl border-b border-border p-4 md:hidden">
          <ul className="list-none flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block no-underline text-fk-charcoal text-sm font-medium px-4 py-3 rounded-lg hover:bg-fk-black/5"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
