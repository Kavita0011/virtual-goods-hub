import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

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
      query = query.eq("category", dbCategory);
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
                    title={product.title}
                    seller={(product as any).stores?.store_name || "Unknown"}
                    price={product.price / 100}
                    discountPrice={product.discount_price ? product.discount_price / 100 : undefined}
                    image={product.preview_url || "/placeholder.svg"}
                    category={DISPLAY_CATEGORY[product.category] || product.category}
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

      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
