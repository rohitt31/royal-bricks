import { Ruler, Weight, Thermometer, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import bricksStack from "@/assets/bricks-stack.jpg";

const Products = () => {
  const products = [
    {
      name: "First Class Bricks",
      hindi: "प्रथम श्रेणी ईंट",
      description: "Premium quality bricks with perfect shape and high compressive strength. Ideal for load-bearing walls and structural work.",
      specs: [
        { icon: Ruler, label: "Size", value: "230×110×75mm" },
        { icon: Weight, label: "Weight", value: "3.2-3.5 kg" },
        { icon: Thermometer, label: "Firing", value: "1100°C" },
        { icon: Layers, label: "Strength", value: ">100 kg/cm²" },
      ],
      image: "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=400&q=80",
      popular: true,
    },
    {
      name: "Second Class Bricks",
      hindi: "द्वितीय श्रेणी ईंट",
      description: "Good quality bricks suitable for general construction, partition walls, and non-structural work.",
      specs: [
        { icon: Ruler, label: "Size", value: "230×110×75mm" },
        { icon: Weight, label: "Weight", value: "3.0-3.2 kg" },
        { icon: Thermometer, label: "Firing", value: "900°C" },
        { icon: Layers, label: "Strength", value: ">70 kg/cm²" },
      ],
      image: "https://plus.unsplash.com/premium_photo-1673629471167-73d09a05b38a?w=400&q=80",
      popular: false,
    },
    {
      name: "Medium Class Bricks",
      hindi: "मध्यम श्रेणी ईंट",
      description: "Economical bricks suitable for non-load bearing walls and temporary structures.",
      specs: [
        { icon: Ruler, label: "Size", value: "250×125×75mm" },
        { icon: Weight, label: "Weight", value: "3.4-3.6 kg" },
        { icon: Thermometer, label: "Firing", value: "850°C" },
        { icon: Layers, label: "Strength", value: ">50 kg/cm²" },
      ],
      image: "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=400&q=80",
      popular: false,
    },
  ];

  return (
    <section id="products" className="py-20 bg-brick-50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Products</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Premium Quality
            <span className="text-gradient-brick"> Bricks</span>
          </h2>
          <div className="section-divider mb-4" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from our range of high-quality bricks, manufactured to meet
            the highest standards of construction excellence.
          </p>
        </div>

        {/* Featured Image */}
        <div className="mb-12 relative rounded-2xl overflow-hidden shadow-xl max-w-3xl mx-auto">
          <img
            src={bricksStack}
            alt="Royal Bricks Quality Products"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brick-900/70 to-transparent flex items-center">
            <div className="p-8">
              <h3 className="font-display text-2xl font-bold text-primary-foreground mb-2">
                Crafted with Excellence
              </h3>
              <p className="text-primary-foreground/80 max-w-md">
                Each brick is carefully manufactured using traditional methods
                combined with modern quality control.
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card
              key={index}
              className="relative overflow-hidden hover-lift transition-all border-primary shadow-brick"
            >


              {product.popular && (
                <div className="absolute top-4 right-4 bg-gradient-amber text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                  Most Popular
                </div>
              )}

              <CardHeader className="pb-4">
                <CardTitle className="flex flex-col">
                  <span className="font-display text-xl">{product.name}</span>
                  <span className="text-sm text-muted-foreground font-normal mt-1">
                    {product.hindi}
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground mb-6">
                  {product.description}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {product.specs.map((spec, specIndex) => (
                    <div key={specIndex} className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-brick-100 flex items-center justify-center">
                        <spec.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{spec.label}</p>
                        <p className="font-medium text-foreground">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action */}
                <div className="pt-4 mt-auto">
                  <Button asChild className="w-full bg-gradient-brick" variant="default">
                    <a href="#booking">Order Now</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bulk Order CTA */}
        <div className="mt-12 text-center bg-gradient-brick rounded-2xl p-8 shadow-brick">
          <h3 className="font-display text-2xl font-bold text-primary-foreground mb-2">
            Need Bulk Orders?
          </h3>
          <p className="text-primary-foreground/80 mb-6">
            Contact us for special pricing on orders of 10,000+ bricks
          </p>
          <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <a href="#contact">Get Bulk Quote</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;
