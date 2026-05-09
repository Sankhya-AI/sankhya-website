import { Navbar } from './sections/Navbar';
import type { ReactNode } from 'react';
import { Hero } from './sections/Hero';
import { Features } from './sections/Features';
import { IntegrationsMarquee } from './sections/IntegrationsMarquee';
import { Benefits } from './sections/Benefits';
import { CityConnections } from './sections/CityConnections';
import { Blog } from './sections/Blog';
import { Footer } from './sections/Footer';
import { PixelDither } from './components/PixelDither';
import { Seo } from './components/Seo';
import { organizationJsonLd, websiteJsonLd } from './lib/seo';
import { Analytics } from '@vercel/analytics/react';
import { Navigate, Route, Routes } from 'react-router';

import { BlogArticlePage } from './pages/BlogArticlePage';
import { BlogIndexPage } from './pages/BlogIndexPage';

function LandingPage() {
  return (
    <>
      <Seo jsonLd={[organizationJsonLd(), websiteJsonLd()]} />
      <Hero />
      <div className="relative z-10 bg-cream">
        <Features />
        <IntegrationsMarquee />
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

function PageWithFooter({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/blog" element={<PageWithFooter><BlogIndexPage /></PageWithFooter>} />
        <Route path="/blog/:slug" element={<PageWithFooter><BlogArticlePage /></PageWithFooter>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Analytics />
    </div>
  );
}

export default App;
