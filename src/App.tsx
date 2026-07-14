import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Analytics } from '@vercel/analytics/react';
import { PixelDither } from '@/components/PixelDither';
import { Seo } from '@/components/Seo';
import { DITHER_PRESETS, ROUTE_SEO, ROUTES } from '@/content/site';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';
import { ChotuProof } from '@/sections/ChotuProof';
import { CompanyClose } from '@/sections/CompanyClose';
import { Footer } from '@/sections/Footer';
import { Hero } from '@/sections/Hero';
import { ModelsResearch } from '@/sections/ModelsResearch';
import { Navbar } from '@/sections/Navbar';
import { Systems } from '@/sections/Systems';

const ChotuPage = lazy(() =>
  import('@/pages/ChotuPage').then((module) => ({ default: module.ChotuPage })),
);
const ModelsPage = lazy(() =>
  import('@/pages/ModelsPage').then((module) => ({ default: module.ModelsPage })),
);
const PricingPage = lazy(() =>
  import('@/pages/PricingPage').then((module) => ({ default: module.PricingPage })),
);
const AccountPage = lazy(() =>
  import('@/pages/AccountPage').then((module) => ({ default: module.AccountPage })),
);
const PrivacyPage = lazy(() =>
  import('@/pages/PrivacyPage').then((module) => ({ default: module.PrivacyPage })),
);
const BlogIndexPage = lazy(() =>
  import('@/pages/BlogIndexPage').then((module) => ({ default: module.BlogIndexPage })),
);
const BlogArticlePage = lazy(() =>
  import('@/pages/BlogArticlePage').then((module) => ({ default: module.BlogArticlePage })),
);

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]']);

function HomePage() {
  return (
    <>
      <Seo {...ROUTE_SEO.home} jsonLd={[organizationJsonLd(), websiteJsonLd()]} />
      <Hero />
      <Systems />
      <ChotuProof />
      <ModelsResearch />
      <CompanyClose />
      <div aria-hidden="true" className="pointer-events-none relative -mb-px h-32 overflow-hidden bg-[#e6dfd5] md:h-52">
        <PixelDither {...DITHER_PRESETS.footer} className="opacity-100" />
      </div>
      <Footer />
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

function RouteLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-cream px-5 pt-24 text-[#171411]">
      <div className="text-center">
        <img src="/assets/sankhya-logo.png" alt="" className="mx-auto size-9" width="36" height="36" />
        <p className="mt-5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#746d65]">Opening Sankhya</p>
      </div>
    </main>
  );
}

function Deferred({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteLoading />}>{children}</Suspense>;
}

function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <Routes>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.chotu} element={<Deferred><PageWithFooter><ChotuPage /></PageWithFooter></Deferred>} />
        <Route path={ROUTES.models} element={<Deferred><PageWithFooter><ModelsPage /></PageWithFooter></Deferred>} />
        <Route path={ROUTES.pricing} element={<Deferred><PageWithFooter><PricingPage /></PageWithFooter></Deferred>} />
        <Route path={ROUTES.account} element={<Deferred><AccountPage /></Deferred>} />
        <Route path={ROUTES.privacy} element={<Deferred><PageWithFooter><PrivacyPage /></PageWithFooter></Deferred>} />
        <Route path={ROUTES.research} element={<Deferred><PageWithFooter><BlogIndexPage /></PageWithFooter></Deferred>} />
        <Route path="/blog/:slug" element={<Deferred><PageWithFooter><BlogArticlePage /></PageWithFooter></Deferred>} />
        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
      {LOCAL_HOSTNAMES.has(window.location.hostname) ? null : <Analytics />}
    </div>
  );
}

export default App;
