import Hero from "@/components/sections/Hero";
import Experience from "@/components/sections/Experience";
import Stacks from "@/components/sections/Stacks";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Experience />
      <Stacks />
      <FeaturedProjects />
      <Contact />
    </>
  );
}
