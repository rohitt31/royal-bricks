import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

// Lazy load components that are below the fold
const About = lazy(() => import("@/components/About"));
const Products = lazy(() => import("@/components/Products"));
const Process = lazy(() => import("@/components/Process"));
const BookingForm = lazy(() => import("@/components/BookingForm"));
const Contact = lazy(() => import("@/components/Contact"));
const Footer = lazy(() => import("@/components/Footer"));

// Simple loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<LoadingFallback />}>
          <About />
          <Products />
          <Process />
          <BookingForm />
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={<LoadingFallback />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
