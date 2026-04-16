import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/neon/client";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingBag } from "lucide-react";

const BuyerOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadOrders();
  }, [user]);

  const loadOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*, products(title, preview_url))")
      .eq("buyer_id", user!.id)
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="rounded-lg bg-accent/10 p-2">
            <ShoppingBag className="h-6 w-6 text-accent" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-heading font-semibold text-foreground">No orders yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Browse the marketplace to find products!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-mono text-muted-foreground">#{o.id.slice(0, 8)}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{o.status}</Badge>
                    <span className="font-semibold text-foreground">${(o.total_amount / 100).toFixed(2)}</span>
                  </div>
                </div>
                {o.order_items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-t border-border/50">
                    {item.products?.preview_url && (
                      <img src={item.products.preview_url} alt="" className="h-10 w-10 rounded object-cover" />
                    )}
                    <span className="text-sm text-foreground">{item.products?.title || "Product"}</span>
                    <span className="ml-auto text-sm text-muted-foreground">${(item.price_at_purchase / 100).toFixed(2)}</span>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground mt-2">{new Date(o.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BuyerOrders;

