const Footer = () => {
  return (
    <footer className="bg-fk-black text-fk-white/50 pt-16 pb-8 px-8 max-md:px-5">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex justify-between items-start mb-12 flex-wrap gap-8 max-md:flex-col">
          <div>
            <h3 className="font-display text-2xl text-fk-white mb-2">Fahamu Kenya</h3>
            <p className="text-sm max-w-[340px] leading-relaxed">
              A non-partisan civic awareness platform. No ads, no politics — just facts about your government, freely accessible to every Kenyan.
            </p>
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-fk-white uppercase tracking-wider mb-4">Explore</h4>
            <div className="flex flex-col gap-1">
              {[
                { label: "Command Structure", href: "#structure" },
                { label: "Salary Data", href: "#salaries" },
                { label: "Civic Quiz", href: "#quiz" },
                { label: "Constitution", href: "#constitution" },
              ].map((link) => (
                <a key={link.href} href={link.href} className="text-fk-white/40 no-underline text-sm py-1 hover:text-fk-white transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-fk-white uppercase tracking-wider mb-4">Resources</h4>
            <div className="flex flex-col gap-1">
              {[
                { label: "Kenya Law Reform", href: "http://www.klrc.go.ke/" },
                { label: "SRC Official Site", href: "https://www.src.go.ke/" },
                { label: "Kenya Law", href: "http://kenyalaw.org/" },
              ].map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-fk-white/40 no-underline text-sm py-1 hover:text-fk-white transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-fk-white/[0.08] pt-6 flex justify-between items-center flex-wrap gap-3 text-[13px]">
          <span>© 2026 Fahamu Kenya — Open Civic Data</span>
          <div className="flex h-1 max-w-[200px] w-full rounded-sm overflow-hidden">
            <span className="flex-1 bg-fk-black" />
            <span className="flex-1 bg-kenya-red" />
            <span className="flex-1 bg-fk-white" />
            <span className="flex-1 bg-kenya-green" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
