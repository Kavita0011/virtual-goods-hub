import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/neon/client";
import { Loader2, Users, Package, CreditCard, Shield, Star, ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CATEGORY_MAP: Record<string, string> = {
  "All": "",
  "Ebooks": "ebook",
  "Templates": "template",
  "Anime Art": "anime_art",
  "Birthday Cards": "birthday_card",
  "Anniversary Cards": "anniversary_card",
  "Landing Pages": "landing_page",
  "Logo Design": "logo_design",
  "Podcasts": "podcast",
  "Other": "other",
};

const DISPLAY_CATEGORY: Record<string, string> = {
  ebook: "Ebooks",
  template: "Templates",
  anime_art: "Anime Art",
  birthday_card: "Birthday Cards",
  anniversary_card: "Anniversary Cards",
  landing_page: "Landing Pages",
  logo_design: "Logo Design",
  podcast: "Podcasts",
  other: "Other",
};

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [activeCategory]);

  const loadProducts = async () => {
    setLoading(true);
    let query = supabase
      .from("products")
      .select("*, stores(store_name)")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(20);

    const dbCategory = CATEGORY_MAP[activeCategory];
    if (dbCategory) {
      query = query.eq("category", dbCategory as any);
    }

    const { data } = await query;
    setProducts(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      <section id="products" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">Trending Products</h2>
              <p className="mt-1 text-sm text-muted-foreground">Discover top-selling digital products</p>
            </div>
          </div>

          <div className="mt-6">
            <CategoryFilter active={activeCategory} onSelect={setActiveCategory} />
          </div>

          <div className="mt-8">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : products.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    seller={(product as any).stores?.store_name || "Unknown"}
                    price={product.price / 100}
                    discountPrice={product.discount_price ? product.discount_price / 100 : undefined}
                    image={product.preview_url || "/placeholder.svg"}
                    category={DISPLAY_CATEGORY[product.category] || product.category}
                    storeId={(product as any).stores?.id}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-muted-foreground">
                No products found in this category yet.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground">How It Works</h2>
            <p className="mt-2 text-muted-foreground">Buy and sell digital products in 3 simple steps</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-heading text-lg font-semibold">1. Create Account</h3>
              <p className="mt-2 text-sm text-muted-foreground">Sign up free and set up your seller profile in minutes</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                <Package className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-heading text-lg font-semibold">2. Upload Products</h3>
              <p className="mt-2 text-sm text-muted-foreground">Add templates, designs, ebooks and more</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                <CreditCard className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-heading text-lg font-semibold">3. Get Paid</h3>
              <p className="mt-2 text-sm text-muted-foreground">Receive payments via UPI, Bank Transfer, Wise</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/auth">
              <Button size="lg" className="gap-2">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground">Why Choose VirtualHub</h2>
            <p className="mt-2 text-muted-foreground">The trusted platform for digital creators in India</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <Star className="mx-auto h-8 w-8 text-accent" />
              <h3 className="mt-3 font-semibold">4.9★ Rating</h3>
              <p className="mt-1 text-sm text-muted-foreground">Loved by 50,000+ creators</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <Shield className="mx-auto h-8 w-8 text-accent" />
              <h3 className="mt-3 font-semibold">Secure Payments</h3>
              <p className="mt-1 text-sm text-muted-foreground">100% safe transactions</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <Package className="mx-auto h-8 w-8 text-accent" />
              <h3 className="mt-3 font-semibold">Instant Delivery</h3>
              <p className="mt-1 text-sm text-muted-foreground">Auto-download after purchase</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <Users className="mx-auto h-8 w-8 text-accent" />
              <h3 className="mt-3 font-semibold">0% Setup Fee</h3>
              <p className="mt-1 text-sm text-muted-foreground">Start selling for free</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold text-foreground">Contact Us</h2>
              <p className="mt-2 text-muted-foreground">Have questions? We'd love to hear from you</p>
            </div>
            
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <Mail className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground">support@virtualhub.store</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <Phone className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone / WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium">Office</h3>
                    <p className="text-sm text-muted-foreground">Mumbai, Maharashtra, India</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-lg bg-secondary/50 p-4">
                <p className="text-sm text-muted-foreground text-center">
                  <strong>Business Hours:</strong> Mon - Sat, 10 AM - 7 PM IST
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;