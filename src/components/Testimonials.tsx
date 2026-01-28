import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Rajesh Kumar Sharma",
      role: "Civil Contractor",
      location: "Patna",
      content: "Royal Bricks has been my trusted supplier for 5 years. Their first-class bricks are consistently high quality. Never had a single complaint from my clients.",
      rating: 5,
    },
    {
      name: "Suresh Prasad",
      role: "Builder",
      location: "Muzaffarpur",
      content: "Timely delivery and excellent quality. The team is very professional. I recommend Royal Bricks to all builders in Bihar.",
      rating: 5,
    },
    {
      name: "Amit Verma",
      role: "Property Developer",
      location: "Vaishali",
      content: "Best brick quality in the region. Fair pricing and the customer service is outstanding. Pro. Abhishek Kumar personally ensures quality.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-brick-50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Testimonials</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            What Our
            <span className="text-gradient-brick"> Clients Say</span>
          </h2>
          <div className="section-divider mb-4" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trusted by builders, contractors, and developers across Bihar.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="relative overflow-hidden hover-lift transition-all animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-brick-100 flex items-center justify-center">
                  <Quote className="w-6 h-6 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <div className="w-12 h-12 rounded-full bg-gradient-brick flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
