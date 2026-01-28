import { useState } from "react";
import { Phone, Mail, MapPin, Globe, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queriesAPI } from "@/lib/api";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "+91 8298344803",
      href: "tel:+918298344803",
    },
    {
      icon: Mail,
      label: "Email",
      value: "akuph95@gmail.com",
      href: "mailto:akuph95@gmail.com",
    },
    {
      icon: MapPin,
      label: "Address",
      value: "जफराबाद हॉस्पिटल, देसरी (वैशाली), Bihar",
      href: "https://maps.google.com/?q=Desri,Vaishali,Bihar",
    },
    {
      icon: Globe,
      label: "Website",
      value: "Royalbricksonline.com",
      href: "https://royalbricksonline.com",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await queriesAPI.create({
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim(),
        subject: 'General Inquiry',
        message: formData.message.trim(),
      });

      if (response.success) {
        toast({
          title: "Message Sent! ✓",
          description: "We'll get back to you as soon as possible.",
        });
        setFormData({ name: "", phone: "", email: "", message: "" });
      }
    } catch (error: any) {
      console.error('Contact form error:', error);
      toast({
        title: "Failed to Send",
        description: error.message || "Something went wrong. Please try calling us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-20 bg-brick-50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Contact Us</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Get In
            <span className="text-gradient-brick"> Touch</span>
          </h2>
          <div className="section-divider mb-4" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions? Need a quote? We're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="animate-fade-up">
            <h3 className="font-display text-2xl font-bold text-foreground mb-6">
              Royal Bricks
            </h3>
            <p className="text-muted-foreground mb-8">
              Bihar's trusted brick manufacturer. Contact us for premium quality bricks
              at competitive prices with reliable delivery.
            </p>

            <div className="space-y-4 mb-8">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.href}
                  target={info.label === "Website" || info.label === "Address" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:shadow-lg transition-all hover-lift"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-brick flex items-center justify-center shadow-brick">
                    <info.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{info.label}</p>
                    <p className="font-medium text-foreground">{info.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Owner Info */}
            <div className="bg-gradient-brick rounded-2xl p-6 text-primary-foreground">
              <h4 className="font-display font-semibold text-lg mb-2">
                Pro. Abhishek Kumar
              </h4>
              <p className="text-primary-foreground/80 text-sm">
                Proprietor, Royal Bricks
              </p>
              <p className="text-primary-foreground/60 text-sm mt-2">
                "Quality is not just a word for us, it's our commitment to every customer."
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <h3 className="font-display text-xl font-bold text-foreground mb-6">
              Send us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Name *</Label>
                  <Input
                    id="contact-name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Phone *</Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-message">Message *</Label>
                <Textarea
                  id="contact-message"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  required
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-brick shadow-brick hover:shadow-lg transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
