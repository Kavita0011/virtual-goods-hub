import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/neon/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingCart, Store, ArrowLeft, Shield, Download, Star } from "lucide-react";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams();
  const { addItem, items } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isInCart = items.some((i) => i.id === id);

  useEffect(() => {
    if (id) loadProduct();
  }, [id]);

  const loadProduct = async () => {
    const { data } = await supabase
      .from("products")
      .select("*, stores(*)")
      .eq("id", id)
      .eq("status", "published")
      .single();

    if (data) {
      setProduct(data);
      setStore((data as any).stores);

      const { data: related } = await supabase
        .from("products")
        .select("*, stores(store_name)")
        .eq("status", "published")
        .eq("category", data.category)
        .neq("id", data.id)
        .limit(4);
      setRelatedProducts(related || []);
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (!product || !store) return;
    addItem({
      id: product.id,
      title: product.title,
      price: product.price / 100,
      discountPrice: product.discount_price ? product.discount_price / 100 : undefined,
      image: product.preview_url || "/placeholder.svg",
      seller: store.store_name,
      storeId: store.id,
    });
    toast({ title: "Added to cart!" });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground">Product not found</h2>
          <Link to="/" className="mt-4 inline-block text-accent hover:underline">Back to marketplace</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const displayPrice = product.discount_price ? product.discount_price / 100 : product.price / 100;
  const originalPrice = product.price / 100;
  const hasDiscount = !!product.discount_price;
  const discountPercent = hasDiscount ? Math.round((1 - displayPrice / originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to marketplace
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--card-shadow)]">
              <img
                src={product.preview_url || "/placeholder.svg"}
                alt={product.title}
                className="aspect-square w-full object-cover"
              />
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex flex-col">
            <Badge variant="secondary" className="w-fit mb-3">
              {product.category.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </Badge>

            <h1 className="font-heading text-3xl font-extrabold text-foreground leading-tight">
              {product.title}
            </h1>

            {/* Seller info */}
            <Link to={`/store/${store?.slug}`} className="mt-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10">
                <Store className="h-3.5 w-3.5 text-accent" />
              </div>
              {store?.store_name}
            </Link>

            {/* Rating placeholder */}
            <div className="mt-3 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-4 w-4 fill-accent text-accent" />
              ))}
              <span className="ml-1 text-xs text-muted-foreground">(New)</span>
            </div>

            {/* Pricing */}
            <div className="mt-6 rounded-xl border border-border bg-card p-5">
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-4xl font-extrabold text-foreground">₹{displayPrice.toFixed(2)}</span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">₹{originalPrice.toFixed(2)}</span>
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">{discountPercent}% OFF</Badge>
                  </>
                )}
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={isInCart}
                size="lg"
                className="mt-4 w-full gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                {isInCart ? "In Cart" : "Add to Cart"}
              </Button>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5 text-accent" />
                  Instant digital download
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-accent" />
                  Secure payment
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-6">
                <h3 className="font-heading font-semibold text-foreground mb-2">About this product</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-xl font-bold text-foreground mb-6">You might also like</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`}>
                  <div className="group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-[var(--card-shadow-hover)]">
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img src={p.preview_url || "/placeholder.svg"} alt={p.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground">{(p as any).stores?.store_name}</p>
                      <h3 className="text-sm font-semibold text-foreground truncate mt-0.5">{p.title}</h3>
                      <p className="mt-1 font-heading text-sm font-bold text-foreground">
                        ₹{((p.discount_price || p.price) / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;

