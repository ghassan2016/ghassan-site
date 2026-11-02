import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Flagship } from "@/components/flagship";
import { NewBuild } from "@/components/new-build";
import { About } from "@/components/about";
import { Projects } from "@/components/projects";
import { Philosophy } from "@/components/philosophy";
import { Experience } from "@/components/experience";
import { Skills } from "@/components/skills";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { ChatWidget } from "@/components/chat-widget";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Flagship />
        <NewBuild />
        <About />
        <Projects />
        <Philosophy />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
