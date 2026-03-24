import { useState, useCallback } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ArmsStrip from "@/components/ArmsStrip";
import CommandTree from "@/components/CommandTree";
import SalaryInsights from "@/components/SalaryInsights";
import Quiz from "@/components/Quiz";
import CountyExplorer from "@/components/CountyExplorer";
import MCAExplorer from "@/components/MCAExplorer";
import ParastatalPayroll from "@/components/ParastatalPayroll";
import Constitution from "@/components/Constitution";
import Footer from "@/components/Footer";

const Index = () => {
  const [filterCls, setFilterCls] = useState<string | undefined>();
  const [loaded, setLoaded] = useState(false);
  const handleLoadDone = useCallback(() => setLoaded(true), []);

  return (
    <div className="overflow-x-hidden">
      {!loaded && <LoadingScreen onDone={handleLoadDone} />}
      <Navbar />
      <Hero />
      <Features />
      <ArmsStrip onFilter={(cls) => setFilterCls(cls)} />
      <CommandTree filterCls={filterCls} />
      <SalaryInsights />
      <ParastatalPayroll />
      <CountyExplorer />
      <MCAExplorer />
      <Quiz />
      <Constitution />
      <Footer />
    </div>
  );
};

export default Index;
