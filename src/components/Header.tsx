import { useState, useEffect } from "react";
import { Menu, X, Phone, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#products", label: "Products" },
    { href: "#process", label: "Process" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? "bg-white/98 dark:bg-slate-950/98 backdrop-blur-xl shadow-2xl border-b border-orange-100/20"
        : "bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg shadow-lg"
        }`}
    >
      {/* Top bar - Enhanced visibility */}
      <div className="hidden md:block bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-white py-2.5 shadow-md">
        <div className="container flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a
              href="tel:+918298344803"
              className="flex items-center gap-2 hover:text-orange-100 transition-all hover:scale-105 font-medium"
            >
              <Phone className="w-4 h-4" />
              +91 8298344803
            </a>
            <a
              href="mailto:akuph95@gmail.com"
              className="flex items-center gap-2 hover:text-orange-100 transition-all hover:scale-105 font-medium"
            >
              <Mail className="w-4 h-4" />
              akuph95@gmail.com
            </a>
          </div>
          <span className="font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            जफराबाद हॉस्पिटल, देसरी (वैशाली)
          </span>
        </div>
      </div>

      {/* Main nav - Professional styling */}
      <nav className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Enhanced */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-all"></div>
              <span className="text-white font-display font-bold text-xl relative z-10">RB</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Royal Bricks
              </h1>
              <p className="text-xs text-orange-600/80 font-medium">रॉयल ब्रिक्स</p>
            </div>
          </a>

          {/* Desktop Nav - Enhanced visibility */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 font-semibold text-sm transition-all relative group rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/30"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300 group-hover:w-3/4 rounded-full" />
              </a>
            ))}
          </div>

          {/* CTA Button - Professional styling */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 hover:from-orange-700 hover:via-orange-600 hover:to-red-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
            >
              <a href="#booking" className="flex items-center gap-2">
                Book Now
                <Sparkles className="w-4 h-4" />
              </a>
            </Button>
          </div>

          {/* Mobile Menu Toggle - Enhanced */}
          <button
            className="lg:hidden p-2.5 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/50 rounded-lg transition-all hover:scale-110 border-2 border-orange-200 dark:border-orange-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu - Enhanced */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/98 dark:bg-slate-950/98 backdrop-blur-xl shadow-2xl border-t-2 border-orange-200 dark:border-orange-800 animate-fade-in">
            <div className="container py-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 font-semibold py-3 px-4 transition-all rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/30 border-l-4 border-transparent hover:border-orange-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Button
                className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 hover:from-orange-700 hover:via-orange-600 hover:to-red-700 text-white font-bold mt-2 shadow-lg"
              >
                <a href="#booking" className="flex items-center gap-2 w-full">
                  Book Now
                  <Sparkles className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
