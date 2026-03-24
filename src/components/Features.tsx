import { useRef, useEffect, useState } from "react";

const features = [
  {
    icon: "🏛️",
    title: "Transparency",
    desc: "Every public servant's salary is paid by taxpayers. Knowing how much they earn — from KSh 1.4M for the President to unpaid Village Elders — is your constitutional right.",
    gradient: "from-kenya-green to-kenya-red",
    iconBg: "bg-arm-executive-bg",
    iconColor: "text-arm-executive",
  },
  {
    icon: "⚖️",
    title: "Accountability",
    desc: "Understanding the chain of command helps you know exactly who to petition when things go wrong — from your MCA all the way up to the Cabinet Secretary.",
    gradient: "from-arm-legislature to-arm-judiciary",
    iconBg: "bg-arm-legislature-bg",
    iconColor: "text-arm-legislature",
  },
  {
    icon: "🗳️",
    title: "Participation",
    desc: "Devolution gave power to 47 counties. But real power belongs to citizens who understand the system well enough to demand their rights and services.",
    gradient: "from-arm-county to-arm-independent",
    iconBg: "bg-arm-county-bg",
    iconColor: "text-arm-county",
  },
];

const RevealCard = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"}`}
    >
      {children}
    </div>
  );
};

const Features = () => {
  return (
    <section className="py-[100px] px-8 max-md:py-16 max-md:px-5" id="why">
      <RevealCard>
        <div className="text-center max-w-[700px] mx-auto mb-16">
          <div className="font-mono-custom text-xs font-medium uppercase tracking-[.12em] text-kenya-green mb-4">
            Why It Matters
          </div>
          <h2 className="font-display leading-[1.1] tracking-tight mb-5" style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}>
            Democracy Starts With<br />Knowing
          </h2>
          <p className="text-[17px] text-fk-slate leading-relaxed">
            You can't hold leaders accountable if you don't know who they are, what they earn, or what they're mandated to do.
          </p>
        </div>
      </RevealCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
        {features.map((f) => (
          <RevealCard key={f.title}>
            <div className="group bg-card border border-fk-black/[0.06] rounded-lg-custom p-9 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-fk-lg hover:border-transparent">
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className={`w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-2xl mb-5 ${f.iconBg}`}>
                {f.icon}
              </div>
              <h3 className="font-display text-[22px] mb-3 text-fk-black">{f.title}</h3>
              <p className="text-[14.5px] text-fk-slate leading-relaxed">{f.desc}</p>
            </div>
          </RevealCard>
        ))}
      </div>
    </section>
  );
};

export default Features;
