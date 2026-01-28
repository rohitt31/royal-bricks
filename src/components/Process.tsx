import { ClipboardList, Factory, Truck, CheckCircle } from "lucide-react";

const Process = () => {
  const steps = [
    {
      icon: ClipboardList,
      step: "01",
      title: "Place Order",
      hindi: "ऑर्डर करें",
      description: "Submit your brick requirements through our online form or call us directly. Specify quantity, type, and delivery location.",
    },
    {
      icon: Factory,
      step: "02",
      title: "Manufacturing",
      hindi: "निर्माण",
      description: "Your bricks are crafted in our modern kilns with careful attention to quality. Each batch is tested for strength and durability.",
    },
    {
      icon: Truck,
      step: "03",
      title: "Delivery",
      hindi: "डिलीवरी",
      description: "Once ready, your order is carefully loaded and transported to your construction site with proper handling.",
    },
    {
      icon: CheckCircle,
      step: "04",
      title: "Quality Check",
      hindi: "गुणवत्ता जांच",
      description: "Upon delivery, inspect the bricks with our team. We ensure every brick meets our quality standards.",
    },
  ];

  return (
    <section id="process" className="py-20 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">How It Works</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Simple Ordering
            <span className="text-gradient-brick"> Process</span>
          </h2>
          <div className="section-divider mb-4" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From order to delivery, we make getting quality bricks simple and hassle-free.
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-brick-200 via-primary to-brick-200" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Step Card */}
                <div className="relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all hover-lift text-center lg:text-left">
                  {/* Icon Circle */}
                  <div className="relative mx-auto lg:mx-0 w-20 h-20 rounded-full bg-gradient-brick flex items-center justify-center mb-4 shadow-brick">
                    <step.icon className="w-8 h-8 text-primary-foreground" />
                    
                    {/* Step Number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-amber">
                      <span className="text-secondary-foreground font-bold text-sm">{step.step}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-bold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-3">{step.hindi}</p>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>

                {/* Arrow for Desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 -right-4 z-10">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="mt-16 bg-brick-50 rounded-2xl p-8 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h4 className="text-3xl font-bold text-primary mb-2">24-48 hrs</h4>
            <p className="text-muted-foreground">Order Processing</p>
          </div>
          <div>
            <h4 className="text-3xl font-bold text-primary mb-2">100 km</h4>
            <p className="text-muted-foreground">Free Delivery Radius</p>
          </div>
          <div>
            <h4 className="text-3xl font-bold text-primary mb-2">1000+</h4>
            <p className="text-muted-foreground">Minimum Order</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
