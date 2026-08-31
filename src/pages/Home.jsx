import Hero from '../components/Hero';
import Stats from '../components/Stats';
import About from '../components/About';
import CorporateTrainingGraph from '../components/CorporateTrainingGraph';
import Marquee from '../components/Marquee';
import Benefits from '../components/Benefits';
import Certification from '../components/Certification';
import IndustryTraining from '../components/IndustryTraining';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <About />
      <CorporateTrainingGraph />
      <Marquee />
      <Benefits />
      <Certification />
      <IndustryTraining />
      <Contact />
    </main>
  );
}
