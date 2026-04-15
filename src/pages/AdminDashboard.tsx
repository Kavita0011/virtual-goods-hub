import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Users, Store, Package, ShoppingBag, Loader2, Ban, CheckCircle } from "lucide-react";

const AdminDashboard = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [profRes, storeRes, prodRes, orderRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("stores").select("*").order("created_at", { ascending: false }),
      supabase.from("products").select("*, stores(store_name)").order("created_at", { ascending: false }),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
    ]);
    setProfiles(profRes.data || []);
    setStores(storeRes.data || []);
    setProducts(prodRes.data || []);
    setOrders(orderRes.data || []);
    setLoading(false);
  };

  const toggleProductStatus = async (product: any) => {
    const newStatus = product.status === "published" ? "unpublished" : "published";
    const { error } = await supabase.from("products").update({ status: newStatus }).eq("id", product.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: `Product ${newStatus}` });
      loadAll();
    }
  };

  const toggleStoreTier = async (store: any) => {
    const newTier = store.commission_tier === "pro" ? "basic" : "pro";
    const { error } = await supabase.from("stores").update({ commission_tier: newTier }).eq("id", store.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: `Store tier set to ${newTier}` });
      loadAll();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (profile?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground">Access Denied</h2>
        </div>
        <Footer />
      </div>
    );
  }

  const totalRevenue = orders.reduce((s, o) => s + o.total_amount, 0) / 100;
  const totalFees = orders.reduce((s, o) => s + o.platform_fee_collected, 0) / 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard icon={<Users className="h-5 w-5" />} label="Users" value={profiles.length} />
          <StatCard icon={<Store className="h-5 w-5" />} label="Stores" value={stores.length} />
          <StatCard icon={<Package className="h-5 w-5" />} label="Products" value={products.length} />
          <StatCard icon={<ShoppingBag className="h-5 w-5" />} label="Revenue" value={`$${totalRevenue.toFixed(2)}`} sub={`$${totalFees.toFixed(2)} fees`} />
        </div>

        <Tabs defaultValue="users">
          <TabsList className="mb-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="stores">Stores</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <div className="rounded-xl border border-border bg-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/30">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Membership</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((p) => (
                    <tr key={p.id} className="border-b border-border/50">
                      <td className="px-4 py-3 text-foreground">{p.full_name || "—"}</td>
                      <td className="px-4 py-3"><Badge variant="secondary">{p.role}</Badge></td>
                      <td className="px-4 py-3"><Badge variant="outline">{p.membership_status}</Badge></td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="stores">
            <div className="space-y-3">
              {stores.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{s.store_name}</h3>
                    <p className="text-sm text-muted-foreground">/store/{s.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={s.commission_tier === "pro" ? "default" : "secondary"}>{s.commission_tier}</Badge>
                    <Button variant="outline" size="sm" onClick={() => toggleStoreTier(s)}>
                      Switch to {s.commission_tier === "pro" ? "Basic" : "Pro"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="space-y-3">
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {(p as any).stores?.store_name || "Unknown store"} · ${(p.price / 100).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={p.status === "published" ? "default" : "outline"}>{p.status}</Badge>
                    <Button variant="outline" size="sm" onClick={() => toggleProductStatus(p)}>
                      {p.status === "published" ? <Ban className="mr-1 h-3 w-3" /> : <CheckCircle className="mr-1 h-3 w-3" />}
                      {p.status === "published" ? "Unpublish" : "Publish"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="rounded-xl border border-border bg-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/30">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Order ID</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fee</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-border/50">
                      <td className="px-4 py-3 text-foreground font-mono text-xs">{o.id.slice(0, 8)}…</td>
                      <td className="px-4 py-3 text-foreground">${(o.total_amount / 100).toFixed(2)}</td>
                      <td className="px-4 py-3 text-accent">${(o.platform_fee_collected / 100).toFixed(2)}</td>
                      <td className="px-4 py-3"><Badge variant="outline">{o.status}</Badge></td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

const StatCard = ({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string | number; sub?: string }) => (
  <div className="rounded-xl border border-border bg-card p-5">
    <div className="flex items-center gap-2 text-muted-foreground mb-2">{icon}<span className="text-sm">{label}</span></div>
    <p className="font-heading text-2xl font-bold text-foreground">{value}</p>
    {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
  </div>
);

export default AdminDashboard;
