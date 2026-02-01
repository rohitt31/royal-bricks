import { CheckCircle2, Shield, Factory, Users } from "lucide-react";
import kilnFactory from "@/assets/kiln-factory.jpg";

const About = () => {
  const features = [
    {
      icon: Factory,
      title: "Modern Manufacturing",
      description: "State-of-the-art brick kilns with high production capacity",
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "Every brick undergoes rigorous quality checks",
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Skilled craftsmen dedicated to quality",
    },
  ];

  const highlights = [
    "ISO Quality Standards",
    "Eco-Friendly Production",
    "Timely Delivery",
    "Competitive Pricing",
    "Bulk Order Discounts",
    "Pan-Bihar Delivery",
  ];

  return (
    <section id="about" className="py-20 bg-background brick-pattern">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">About Us</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Bihar's Trusted Brick
            <span className="text-gradient-brick"> Manufacturer</span>
          </h2>
          <div className="section-divider mb-4" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Royal Bricks is a modern brick manufacturing facility established in 2030.
            We are committed to delivering premium quality bricks using state-of-the-art technology
            for builders across the region.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="relative animate-fade-up">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src={kilnFactory}
                alt="Royal Bricks Manufacturing Facility"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brick-900/60 to-transparent" />

              {/* Floating Card */}
              <div className="absolute bottom-6 left-6 right-6 glass-card rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-brick flex items-center justify-center shadow-brick">
                    <span className="text-primary-foreground font-display font-bold text-xl">New</span>
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground">Established 2025</p>
                    <p className="text-sm text-muted-foreground">Modern Brick Manufacturing</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute -z-10 -bottom-6 -right-6 w-48 h-48 bg-secondary/20 rounded-2xl" />
          </div>

          {/* Content Section */}
          <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <h3 className="font-display text-2xl font-bold text-foreground mb-4">
              Pro. Abhishek Kumar
            </h3>
            <p className="text-muted-foreground mb-6">
              Under the visionary leadership of Pro. Abhishek Kumar, Royal Bricks
              brings fresh innovation to the brick manufacturing industry in Bihar.
              Our dedication to quality and modern production methods drives us
              to deliver the best products to our customers.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-4 rounded-xl bg-card border border-border hover:shadow-lg transition-all hover-lift">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-brick-100 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-3">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
