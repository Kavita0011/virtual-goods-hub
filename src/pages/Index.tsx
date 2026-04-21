import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/neon/client";
import { Loader2, Mail, Phone, ArrowRight, CheckCircle, Star, Users, Package, CreditCard, Shield, Zap, FileText, Palette, Gift, Headphones, TrendingUp, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Index = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSending, setContactSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*, stores(store_name)")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(8);
    setProducts(data || []);
    setLoading(false);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSending(true);
    
    const { error } = await supabase.from("contact_messages").insert({
      name: contactForm.name,
      email: contactForm.email,
      message: contactForm.message,
      status: "unread"
    });

    setContactSending(false);
    if (!error) {
      setContactSent(true);
      setContactForm({ name: "", email: "", message: "" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      {/* Trending Products */}
      <section id="products" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-foreground">Trending Digital Products</h2>
            <p className="mt-2 text-muted-foreground">Discover premium templates, designs, and resources from top creators</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  seller={(product as any).stores?.store_name || "Unknown"}
                  price={product.price / 100}
                  discountPrice={product.discount_price ? product.discount_price / 100 : undefined}
                  image={product.preview_url || "/placeholder.svg"}
                  category={product.category}
                  storeId={(product as any).stores?.id}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-muted-foreground">
              No products yet. <Link to="/auth" className="text-accent">Start selling!</Link>
            </div>
          )}

          <div className="mt-10 text-center">
            <Link to="/#products">
              <Button variant="outline" size="lg">View All Products <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sell Section */}
      <section id="sell" className="py-20 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-sm font-medium text-pink-700 mb-4">
                <Zap className="h-4 w-4" /> Start Selling Today
              </div>
              <h2 className="font-heading text-4xl font-bold text-foreground">
                Turn Your Creativity Into <span className="text-pink-600">Income</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join thousands of digital creators earning on VirtualHub. Sell templates, graphics, ebooks, and more to millions of buyers worldwide.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100"><CheckCircle className="h-5 w-5 text-pink-600" /></div>
                  <div><p className="font-medium">0% Setup Fee</p><p className="text-sm text-muted-foreground">Start free</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100"><CreditCard className="h-5 w-5 text-purple-600" /></div>
                  <div><p className="font-medium">Instant Payments</p><p className="text-sm text-muted-foreground">UPI, Bank, Wise</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100"><Users className="h-5 w-5 text-pink-600" /></div>
                  <div><p className="font-medium">Millions of Buyers</p><p className="text-sm text-muted-foreground">Global reach</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100"><Shield className="h-5 w-5 text-purple-600" /></div>
                  <div><p className="font-medium">Secure Platform</p><p className="text-sm text-muted-foreground">Fraud protection</p></div>
                </div>
              </div>
              <div className="mt-8 flex gap-4">
                <Link to="/auth"><Button size="lg" className="bg-pink-600 hover:bg-pink-700">Start Selling Free</Button></Link>
                <Link to="/seller/guide"><Button size="lg" variant="outline">Seller Guide</Button></Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-xl bg-white p-6 shadow-lg"><FileText className="h-10 w-10 text-pink-600" /><p className="mt-3 font-semibold">Ebooks</p><p className="text-sm text-muted-foreground">Digital books & guides</p></div>
                <div className="rounded-xl bg-white p-6 shadow-lg"><Palette className="h-10 w-10 text-purple-600" /><p className="mt-3 font-semibold">Graphics</p><p className="text-sm text-muted-foreground">Design templates</p></div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="rounded-xl bg-white p-6 shadow-lg"><Package className="h-10 w-10 text-pink-600" /><p className="mt-3 font-semibold">Templates</p><p className="text-sm text-muted-foreground">Canva & PSD files</p></div>
                <div className="rounded-xl bg-white p-6 shadow-lg"><Gift className="h-10 w-10 text-purple-600" /><p className="mt-3 font-semibold">Assets</p><p className="text-sm text-muted-foreground">UI kits & more</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground">Why Choose VirtualHub?</h2>
            <p className="mt-2 text-muted-foreground">The #1 marketplace for digital creators in India and globally</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100"><Star className="h-8 w-8 text-pink-600" /></div>
              <h3 className="font-heading text-xl font-semibold">4.9★ Rating</h3>
              <p className="mt-2 text-muted-foreground">Loved by 50,000+ creators worldwide with exceptional reviews</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100"><Shield className="h-8 w-8 text-purple-600" /></div>
              <h3 className="font-heading text-xl font-semibold">Secure Payments</h3>
              <p className="mt-2 text-muted-foreground">100% safe transactions with fraud protection and buyer guarantees</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100"><TrendingUp className="h-8 w-8 text-pink-600" /></div>
              <h3 className="font-heading text-xl font-semibold">Fast Growth</h3>
              <p className="mt-2 text-muted-foreground">Join 10,000+ sellers earning passive income from digital products</p>
            </div>
          </div>

          <div className="mt-16 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 p-10 text-center text-white">
            <h3 className="font-heading text-2xl font-bold">Trusted by Creators Worldwide</h3>
            <div className="mt-8 flex flex-wrap justify-center gap-8 text-center">
              <div><p className="text-4xl font-bold">10K+</p><p className="text-sm opacity-80">Products</p></div>
              <div><p className="text-4xl font-bold">5K+</p><p className="text-sm opacity-80">Sellers</p></div>
              <div><p className="text-4xl font-bold">50K+</p><p className="text-sm opacity-80">Buyers</p></div>
              <div><p className="text-4xl font-bold">₹1Cr+</p><p className="text-sm opacity-80">Earnings Paid</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground">We're Here to Help</h2>
            <p className="mt-2 text-muted-foreground">Get support whenever you need it</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100 mb-4"><Headphones className="h-6 w-6 text-pink-600" /></div>
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="mt-2 text-sm text-muted-foreground">Our team is available round the clock to assist you with any queries.</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 mb-4"><FileText className="h-6 w-6 text-purple-600" /></div>
              <h3 className="font-semibold">Seller Resources</h3>
              <p className="mt-2 text-sm text-muted-foreground">Access guides, tutorials, and best practices to grow your sales.</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100 mb-4"><Shield className="h-6 w-6 text-pink-600" /></div>
              <h3 className="font-semibold">Buyer Protection</h3>
              <p className="mt-2 text-sm text-muted-foreground">Get refunds within 7 days if products don't meet expectations.</p>
            </div>
          </div>

          <div className="mt-12 flex justify-center gap-4">
            <Link to="/seller/guide"><Button variant="outline">Seller Guide</Button></Link>
            <Link to="/#contact"><Button>Contact Us</Button></Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <div className="text-center mb-10">
              <h2 className="font-heading text-3xl font-bold text-foreground">Contact Us</h2>
              <p className="mt-2 text-muted-foreground">Have questions? We'd love to hear from you</p>
            </div>
            
            {contactSent ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                <h3 className="mt-4 font-semibold text-green-700">Message Sent!</h3>
                <p className="mt-2 text-green-600">We'll get back to you within 24 hours.</p>
                <Button className="mt-4" variant="outline" onClick={() => setContactSent(false)}>Send Another</Button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="rounded-xl border border-border bg-card p-8">
                <div className="grid gap-4">
                  <div>
                    <label className="text-sm font-medium">Your Name</label>
                    <Input required value={contactForm.name} onChange={(e) => setContactForm({...contactForm, name: e.target.value})} placeholder="John Doe" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email Address</label>
                    <Input required type="email" value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})} placeholder="john@example.com" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <Textarea required value={contactForm.message} onChange={(e) => setContactForm({...contactForm, message: e.target.value})} placeholder="How can we help you?" className="mt-1" rows={4} />
                  </div>
                  <Button type="submit" disabled={contactSending} className="w-full bg-pink-600 hover:bg-pink-700">
                    {contactSending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : <>Send Message <Mail className="ml-2 h-4 w-4" /></>}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-10 flex flex-wrap justify-center gap-8 text-center">
              <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-5 w-5 text-pink-600" /> support@virtualhub.store</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-5 w-5 text-pink-600" /> +91 98765 43210</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-white">Ready to Start?</h2>
          <p className="mt-2 text-white/80">Join thousands of creators earning on VirtualHub today</p>
          <div className="mt-6 flex justify-center gap-4">
            <Link to="/auth"><Button size="lg" className="bg-white text-pink-600 hover:bg-white/90">Get Started Free</Button></Link>
            <Link to="/#products"><Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">Browse Products</Button></Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;