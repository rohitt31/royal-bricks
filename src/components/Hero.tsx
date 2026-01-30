import { ArrowRight, Building2, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const stats = [
    { icon: Building2, value: "Est.", label: "2025" },
    { icon: Award, value: "100%", label: "Quality Assured" },
    { icon: TrendingUp, value: "Modern", label: "Technology" },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Royal Bricks Manufacturing"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brick-900/90 via-brick-800/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 pt-32 pb-16">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm border border-secondary/30 rounded-full px-4 py-2 mb-6 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-secondary text-sm font-medium">Premium Quality Bricks</span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Building Dreams,
            <span className="block text-secondary">One Brick at a Time</span>
          </h1>

          <p className="font-display text-2xl md:text-3xl text-primary-foreground/90 mb-2 animate-fade-up" style={{ animationDelay: "0.15s" }}>
            रॉयल ब्रिक्स - विश्वास की नींव
          </p>

          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Premium quality bricks manufactured with traditional expertise and modern technology.
            Trusted by builders across Bihar for premium quality.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-12 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-amber text-lg px-8">
              <a href="#booking" className="flex items-center gap-2">
                Book Bricks Now
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button size="lg" className="bg-white text-brick-900 hover:bg-gray-100 shadow-lg text-lg px-8 font-semibold transition-all hover:scale-105">
              <a href="#contact">Get Quote</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <stat.icon className="w-5 h-5 text-secondary" />
                  <span className="text-2xl md:text-3xl font-bold text-primary-foreground">{stat.value}</span>
                </div>
                <span className="text-sm text-primary-foreground/70">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
