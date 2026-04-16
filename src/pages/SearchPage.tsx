import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, SearchX } from "lucide-react";

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

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) search();
    else setLoading(false);
  }, [query]);

  const search = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*, stores(store_name, id)")
      .eq("status", "published")
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order("created_at", { ascending: false })
      .limit(40);
    setProducts(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Search results for "<span className="text-accent">{query}</span>"
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{products.length} products found</p>

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
            <div className="py-20 text-center">
              <SearchX className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No products found. Try a different search term.</p>
              <Link to="/" className="mt-4 inline-block text-accent hover:underline text-sm">Browse all products</Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
