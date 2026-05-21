import { Route, Routes } from 'react-router';
import { Navbar } from './sections/Navbar';
import { Hero } from './sections/Hero';
import { Features } from './sections/Features';
import { IntegrationsMarquee } from './sections/IntegrationsMarquee';
import { Memory } from './sections/Memory';
import { Benefits } from './sections/Benefits';
import { CityConnections } from './sections/CityConnections';
import { Blog } from './sections/Blog';
import { Footer } from './sections/Footer';
import { PixelDither } from './components/PixelDither';
import { Analytics } from '@vercel/analytics/react';
import { PricingPage } from './pages/PricingPage';
import { AccountPage } from './pages/AccountPage';

function HomePage() {
  return (
    <>
      <Hero />
      <div className="relative z-10 bg-cream">
        <Features />
        <IntegrationsMarquee />
        <Memory />
        <Benefits />
        <CityConnections />
        <Blog />
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
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
      <Analytics />
    </div>
  );
}

export default App;
