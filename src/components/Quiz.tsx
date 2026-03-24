import { useState, useRef, useEffect } from "react";

const quizQuestions = [
  {
    q: "How many counties does Kenya have under the 2010 Constitution?",
    options: ["42", "47", "52", "44"],
    correct: 1,
    explanation: "Kenya has 47 counties established by the First Schedule of the 2010 Constitution, each with its own elected Governor and County Assembly.",
  },
  {
    q: "Who is the current Deputy President of Kenya?",
    options: ["Rigathi Gachagua", "Prof. Kithure Kindiki", "Musalia Mudavadi", "Gideon Moi"],
    correct: 1,
    explanation: "Prof. Kithure Kindiki serves as Deputy President after Rigathi Gachagua was removed from office through impeachment in 2024.",
  },
  {
    q: "Which body is responsible for setting public officers' salaries?",
    options: ["Parliament", "The President", "Salaries & Remuneration Commission (SRC)", "The Treasury"],
    correct: 2,
    explanation: "The SRC is an independent constitutional commission under Chapter 15 that sets and reviews remuneration for all state officers.",
  },
  {
    q: "How many members sit in Kenya's National Assembly?",
    options: ["250", "349", "416", "290"],
    correct: 1,
    explanation: "The National Assembly has 349 members: 290 elected from constituencies, 47 Women Representatives, and 12 Nominated members.",
  },
  {
    q: "What is the lowest level of field administration in Kenya?",
    options: ["Chief", "Sub-County Administrator", "Village Elder / Nyumba Kumi", "Assistant Chief"],
    correct: 2,
    explanation: "Village Elders and Nyumba Kumi representatives are community-selected volunteers at the grassroots level — and they serve unpaid.",
  },
];

const Quiz = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const q = quizQuestions[currentQ];
  const progress = showResult ? 100 : (currentQ / quizQuestions.length) * 100;

  const handleAnswer = (idx: number) => {
    if (answered !== null) return;
    setAnswered(idx);
    if (idx === q.correct) setScore((s) => s + 1);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= quizQuestions.length) {
      setShowResult(true);
    } else {
      setCurrentQ((c) => c + 1);
      setAnswered(null);
    }
  };

  const restart = () => {
    setCurrentQ(0);
    setScore(0);
    setAnswered(null);
    setShowResult(false);
  };

  const pct = Math.round((score / quizQuestions.length) * 100);

  return (
    <section className="py-[100px] px-8 max-md:py-16 max-md:px-5" id="quiz">
      <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"}`}>
        <div className="text-center max-w-[700px] mx-auto mb-16">
          <div className="font-mono-custom text-xs font-medium uppercase tracking-[.12em] text-kenya-green mb-4">Test Yourself</div>
          <h2 className="font-display leading-[1.1] tracking-tight mb-5" style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}>
            How Well Do You Know<br />Your Government?
          </h2>
          <p className="text-[17px] text-fk-slate leading-relaxed">
            Five quick questions to test your civic knowledge. No sign-ups, no gimmicks — just awareness.
          </p>
        </div>

        <div className="max-w-[680px] mx-auto bg-card rounded-lg-custom border border-fk-black/[0.06] shadow-fk-lg overflow-hidden">
          <div className="h-1 bg-fk-sand">
            <div className="h-full bg-kenya-green rounded-sm transition-all duration-400" style={{ width: `${progress}%` }} />
          </div>

          <div className="p-10 max-md:p-7 text-center">
            {showResult ? (
              <>
                <div className="font-display text-[64px] text-kenya-green mb-4">
                  {score}/{quizQuestions.length}
                </div>
                <h3 className="font-display text-[28px] mb-3">
                  {pct >= 80 ? "Excellent! You know your government." : pct >= 60 ? "Good effort! Keep learning." : "Time to explore the structure above!"}
                </h3>
                <p className="text-fk-slate text-[15px] mb-7">
                  You scored {pct}% — {score} out of {quizQuestions.length} correct answers.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <button onClick={restart} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-pill bg-fk-charcoal text-fk-white font-semibold text-[15px] border-none cursor-pointer shadow-fk-md hover:-translate-y-0.5 hover:bg-fk-black hover:shadow-fk-lg transition-all duration-300">
                    Try Again
                  </button>
                  <a href="#structure" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-pill bg-transparent text-fk-charcoal font-semibold text-[15px] no-underline border-[1.5px] border-fk-sand hover:bg-fk-white hover:border-fk-charcoal transition-all duration-300">
                    Explore the Tree
                  </a>
                </div>
              </>
            ) : (
              <>
                <div className="font-mono-custom text-xs text-muted-foreground mb-3">
                  Question {currentQ + 1} of {quizQuestions.length}
                </div>
                <div className="font-display text-2xl mb-8 text-fk-black leading-snug">{q.q}</div>
                <div className="flex flex-col gap-3 max-w-[460px] mx-auto">
                  {q.options.map((opt, i) => {
                    let classes = "p-3.5 px-5 border-[1.5px] border-fk-sand rounded-lg text-[14.5px] font-medium cursor-pointer transition-all duration-250 text-left bg-card text-fk-charcoal";
                    if (answered !== null) {
                      classes += " pointer-events-none";
                      if (i === q.correct) classes = classes.replace("border-fk-sand", "border-arm-executive") + " bg-arm-executive-bg text-arm-executive";
                      else if (i === answered) classes = classes.replace("border-fk-sand", "border-arm-security") + " bg-arm-security-bg text-arm-security";
                    } else {
                      classes += " hover:border-fk-charcoal hover:bg-background";
                    }
                    return (
                      <button key={i} onClick={() => handleAnswer(i)} className={classes}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {answered !== null && (
                  <div className={`mt-5 p-4 px-5 rounded-lg text-sm leading-relaxed ${answered === q.correct ? "bg-arm-executive-bg text-arm-executive" : "bg-arm-security-bg text-arm-security"}`}>
                    {q.explanation}
                  </div>
                )}
                {answered !== null && (
                  <button onClick={nextQuestion} className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 rounded-pill bg-fk-charcoal text-fk-white font-semibold text-[15px] border-none cursor-pointer shadow-fk-md hover:-translate-y-0.5 transition-all duration-300">
                    {currentQ + 1 >= quizQuestions.length ? "See Results" : "Next Question →"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Quiz;
