import Hero from '../components/Hero';
import Stats from '../components/Stats';
import About from '../components/About';
import VisionMission from '../components/VisionMission';
import Domains from '../components/Domains';
import CorporateTrainingGraph from '../components/CorporateTrainingGraph';
import SectionDivider from '../components/SectionDivider';
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
      <SectionDivider />
      <VisionMission />
      <SectionDivider />
      <Domains />
      <SectionDivider />
      <CorporateTrainingGraph />
      <SectionDivider />
      <Marquee />
      <Benefits />
      <Certification />
      <IndustryTraining />
      <Contact />
    </main>
  );
}
