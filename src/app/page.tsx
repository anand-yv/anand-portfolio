import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { About } from "@/components/sections/about";
import { Journey } from "@/components/sections/journey";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Marquee />
      <About />
      <Journey />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </div>
  );
}
