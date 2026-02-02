import { useState } from "react";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { bookingsAPI } from "@/lib/api";
import constructionSite from "@/assets/construction-site.jpg";

const BookingForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingNumber, setBookingNumber] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    brickType: "",
    quantity: "",
    address: "",
    area: "",
    city: "Patna",
    state: "Bihar",
    pincode: "",
    notes: "",
  });

  // Calculate price based on brick type and quantity
  const calculatePrice = (brickType: string, quantity: number) => {
    const prices: Record<string, number> = {
      'first-class': 10,
      'second-class': 8,
      'fly-ash': 7,
      'red-brick': 9,
    };
    return (prices[brickType] || 10) * quantity;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const quantity = parseInt(formData.quantity);
      const totalAmount = calculatePrice(formData.brickType, quantity);

      const response = await bookingsAPI.create({
        customerName: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        brickType: formData.brickType,
        quantity: quantity,
        deliveryAddress: formData.address.trim(),
        area: formData.area.trim() || 'Patna',
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode.trim() || '800001',
        totalAmount: totalAmount,
        specialInstructions: formData.notes.trim() || undefined,
      });

      if (response.success && response.data.booking) {
        setBookingNumber(response.data.booking.bookingNumber);
        toast({
          title: "Booking Submitted! ✓",
          description: `Your booking ${response.data.booking.bookingNumber} has been received. Our team will contact you shortly.`,
        });
        setIsSubmitted(true);
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <section id="booking" className="py-20 bg-background">
        <div className="container max-w-2xl">
          <div className="text-center p-12 bg-card rounded-2xl border border-border shadow-xl">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">
              Booking Received!
            </h3>
            <p className="text-lg font-semibold text-primary mb-2">
              {bookingNumber}
            </p>
            <p className="text-muted-foreground mb-6">
              Thank you for your order. Our team will contact you within 24 hours
              to confirm the details and arrange delivery.
            </p>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setBookingNumber("");
                setFormData({
                  name: "",
                  phone: "",
                  email: "",
                  brickType: "",
                  quantity: "",
                  address: "",
                  notes: "",
                });
              }}
              variant="outline"
            >
              Place Another Order
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Book Now</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Order Your
            <span className="text-gradient-brick"> Bricks Today</span>
          </h2>
          <div className="section-divider mb-4" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fill out the form below and we'll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl animate-fade-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Phone */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@royalbricks.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              {/* Brick Type & Quantity */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Brick Type *</Label>
                  <Select
                    value={formData.brickType}
                    onValueChange={(value) => handleChange("brickType", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select brick type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first-class">First Class Bricks</SelectItem>
                      <SelectItem value="second-class">Second Class Bricks</SelectItem>
                      <SelectItem value="fly-ash">Fly Ash Bricks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (Number of Bricks) *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1000"
                    placeholder="Minimum 1000"
                    value={formData.quantity}
                    onChange={(e) => handleChange("quantity", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter complete delivery address with landmark"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  required
                  rows={3}
                />
              </div>

              {/* Area & Pincode */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area">Area/Locality *</Label>
                  <Input
                    id="area"
                    placeholder="e.g., Kankarbagh, Boring Road"
                    value={formData.area}
                    onChange={(e) => handleChange("area", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    type="text"
                    placeholder="800020"
                    value={formData.pincode}
                    onChange={(e) => handleChange("pincode", e.target.value)}
                    required
                    maxLength={6}
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requirements or instructions"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  rows={2}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-brick shadow-brick hover:shadow-lg transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Booking
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Info Side */}
          <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative rounded-2xl overflow-hidden shadow-xl mb-6">
              <img
                src={constructionSite}
                alt="Construction with Royal Bricks"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brick-900/80 to-transparent flex items-end">
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-primary-foreground">
                    Quality You Can Trust
                  </h3>
                  <p className="text-primary-foreground/80 text-sm">
                    Building Bihar's future, one brick at a time
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Contact Info */}
            <div className="bg-brick-50 rounded-2xl p-6">
              <h4 className="font-display font-semibold text-foreground mb-4">
                Need Immediate Assistance?
              </h4>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Call us directly for urgent orders:
                </p>
                <a
                  href="tel:+918298344803"
                  className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-brick flex items-center justify-center">
                    <span className="text-primary-foreground text-lg">📞</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">+91 8298344803</p>
                    <p className="text-xs text-muted-foreground">Available 8 AM - 8 PM</p>
                  </div>
                </a>
                <a
                  href="https://wa.me/918298344803"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-primary-foreground text-lg">💬</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">WhatsApp Us</p>
                    <p className="text-xs text-muted-foreground">Quick Response</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
