import { Navbar } from './sections/Navbar';
import { Hero } from './sections/Hero';
import { Features } from './sections/Features';
import { IntegrationsMarquee } from './sections/IntegrationsMarquee';
import { Benefits } from './sections/Benefits';
import { CityConnections } from './sections/CityConnections';
import { Footer } from './sections/Footer';
import { PixelDither } from './components/PixelDither';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <Hero />
      <div className="relative z-10 bg-cream">
        <Features />
        <IntegrationsMarquee />
        <Benefits />
        <CityConnections />
        <section
          aria-hidden="true"
          className="pointer-events-none relative -mb-px h-44 overflow-hidden bg-cream md:h-56"
        >
          <PixelDither
            fillColor="var(--bg-dark)"
            pattern="noise"
            seed={11}
            direction="bottom-up"
            startWeight={0.05}
            erosionWeight={0.62}
            pixelSize={18}
            className="opacity-100"
          />
        </section>
        <Footer />
      </div>
      <Analytics />
    </div>
  );
}

export default App;
