import { Background, Footer, TopBar } from "./components/Chrome";
import { Hero } from "./components/Hero";
import { ScaffoldLab } from "./components/ScaffoldLab";
import { Cli, Lifecycle, Proof, Queue, Scope } from "./components/Sections";

export default function App() {
  return (
    <div className="relative min-h-screen">
      <Background />
      <TopBar />
      <main className="relative z-10">
        <Hero />
        <ScaffoldLab />
        <Lifecycle />
        <Proof />
        <Scope />
        <Cli />
        <Queue />
      </main>
      <Footer />
    </div>
  );
}
