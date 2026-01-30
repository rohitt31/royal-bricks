import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "About Us", href: "#about" },
    { label: "Products", href: "#products" },
    { label: "Process", href: "#process" },
    { label: "Contact", href: "#contact" },
  ];

  const products = [
    { label: "First Class Bricks", href: "#products" },
    { label: "Second Class Bricks", href: "#products" },
    { label: "Fly Ash Bricks", href: "#products" },
    { label: "Bulk Orders", href: "#booking" },
  ];

  return (
    <footer className="bg-brick-900 text-primary-foreground">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-amber flex items-center justify-center shadow-amber">
                <span className="text-secondary-foreground font-display font-bold text-lg">RB</span>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">Royal Bricks</h3>
                <p className="text-xs text-primary-foreground/70">रॉयल ब्रिक्स</p>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm mb-4">
              Established in 2025. Building quality for Bihar's future.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Our Products</h4>
            <ul className="space-y-2">
              {products.map((product, index) => (
                <li key={index}>
                  <a
                    href={product.href}
                    className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                  >
                    {product.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact Us</h4>
            <div className="space-y-3">
              <a
                href="tel:+918298344803"
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                +91 8298344803
              </a>
              <a
                href="mailto:akuph95@gmail.com"
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                akuph95@gmail.com
              </a>
              <div className="flex items-start gap-3 text-primary-foreground/70 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>जफराबाद हॉस्पिटल, देसरी (वैशाली), Bihar, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {currentYear} Royal Bricks. All rights reserved.
          </p>
          <p className="text-primary-foreground/60 text-sm">
            Pro. Abhishek Kumar | Proprietor
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
