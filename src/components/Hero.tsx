import { Users } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-[120px] pb-20 px-8 max-md:px-5 max-md:pt-[100px] max-md:pb-[60px]" id="hero">
      {/* Background gradients */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 80% 60% at 20% 80%, hsla(var(--kenya-green)/.06) 0%, transparent 70%),
          radial-gradient(ellipse 60% 50% at 80% 20%, hsla(var(--kenya-red)/.04) 0%, transparent 70%),
          radial-gradient(ellipse 90% 70% at 50% 50%, hsla(var(--black)/.02) 0%, transparent 60%)
        `
      }} />

      <div className="max-w-[900px] text-center relative z-[1]">
        <div className="inline-flex items-center gap-2 bg-fk-white border border-fk-sand px-[18px] py-1.5 pl-2 rounded-pill text-[13px] font-semibold text-kenya-green mb-8 shadow-fk-sm animate-fade-slide-up">
          <span className="w-2 h-2 bg-kenya-green rounded-full animate-pulse-dot" />
          Civic Awareness Platform
        </div>

        <h1 className="font-display text-fk-black leading-[1.05] tracking-tight mb-6 animate-fade-slide-up-1" style={{ fontSize: "clamp(42px, 7vw, 86px)" }}>
          Know Who<br /><em className="italic text-kenya-green relative">Governs</em> You
        </h1>

        <blockquote className="text-fk-slate italic font-medium mb-6 animate-fade-slide-up-1" style={{ fontSize: "clamp(14px, 1.8vw, 18px)" }}>
          "Be the change you want to see" — <span className="not-italic font-semibold text-fk-black">Sammy Masamki</span>
        </blockquote>

        <p className="text-fk-slate font-normal leading-relaxed max-w-[620px] mx-auto mb-10 animate-fade-slide-up-2" style={{ fontSize: "clamp(16px, 2.2vw, 20px)" }}>
          Every leader, every office, every salary — mapped from the President to your Village Elder. Because informed citizens build a stronger Kenya.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap animate-fade-slide-up-3">
          <a
            href="#structure"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-pill bg-fk-charcoal text-fk-white font-semibold text-[15px] no-underline shadow-fk-md hover:-translate-y-0.5 hover:bg-fk-black hover:shadow-fk-lg transition-all duration-300"
          >
            <Users size={18} />
            Explore the Structure
          </a>
          <a
            href="#quiz"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-pill bg-transparent text-fk-charcoal font-semibold text-[15px] no-underline border-[1.5px] border-fk-sand hover:bg-fk-white hover:border-fk-charcoal transition-all duration-300"
          >
            Test Your Knowledge
          </a>
        </div>

        <div className="flex justify-center gap-12 mt-16 pt-12 border-t border-fk-sand animate-fade-slide-up-4 max-md:gap-6 max-md:flex-wrap">
          {[
            { number: "7", label: "Arms of Government" },
            { number: "47", label: "Counties" },
            { number: "2,000+", label: "Offices Mapped" },
            { number: "2010", label: "Constitution" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-4xl text-fk-black leading-none max-[480px]:text-[28px]">{stat.number}</div>
              <div className="text-[13px] text-muted-foreground mt-1.5 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
