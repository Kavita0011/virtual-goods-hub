import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";
import { Loader2, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const StorePage = () => {
  const { slug } = useParams();
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) loadStore();
  }, [slug]);

  const loadStore = async () => {
    const { data: storeData } = await supabase
      .from("stores")
      .select("*")
      .eq("slug", slug)
      .single();

    if (storeData) {
      setStore(storeData);
      const { data: prods } = await supabase
        .from("products")
        .select("*")
        .eq("store_id", storeData.id)
        .eq("status", "published")
        .order("created_at", { ascending: false });
      setProducts(prods || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground">Store not found</h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
            {store.logo_url ? (
              <img src={store.logo_url} alt={store.store_name} className="h-16 w-16 rounded-2xl object-cover" />
            ) : (
              <Store className="h-8 w-8 text-accent" />
            )}
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground">{store.store_name}</h1>
          {store.description && (
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">{store.description}</p>
          )}
          <Badge variant="secondary" className="mt-3">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </Badge>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-muted-foreground">No products listed yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                title={p.title}
                price={p.price / 100}
                discountPrice={p.discount_price ? p.discount_price / 100 : undefined}
                image={p.preview_url || "/placeholder.svg"}
                category={p.category.replace(/_/g, " ")}
                seller={store.store_name}
                storeId={store.id}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default StorePage;
