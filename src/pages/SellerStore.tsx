import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/neon/client";
import { useToast } from "@/hooks/use-toast";
import { Store, Save, ExternalLink, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const SellerStore = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [store, setStore] = useState<any>(null);
  const [form, setForm] = useState({
    store_name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    if (user) fetchStore();
  }, [user]);

  const fetchStore = async () => {
    const { data } = await supabase
      .from("stores")
      .select("*")
      .eq("seller_id", user!.id)
      .maybeSingle();

    if (data) {
      setStore(data);
      setForm({
        store_name: data.store_name,
        slug: data.slug,
        description: data.description || "",
      });
    }
    setLoading(false);
  };

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleSave = async () => {
    if (!form.store_name.trim() || !form.slug.trim()) {
      toast({ title: "Store name and URL slug are required", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      if (store) {
        const { error } = await supabase
          .from("stores")
          .update({
            store_name: form.store_name,
            description: form.description,
            slug: form.slug,
          })
          .eq("id", store.id);
        if (error) throw error;
        toast({ title: "Store updated!" });
      } else {
        const { data, error } = await supabase
          .from("stores")
          .insert({
            seller_id: user!.id,
            store_name: form.store_name,
            slug: form.slug,
            description: form.description,
          })
          .select()
          .single();
        if (error) throw error;
        setStore(data);
        toast({ title: "Store created!" });
      }
      fetchStore();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
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
      <div className="container mx-auto max-w-2xl px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="rounded-lg bg-accent/10 p-2">
            <Store className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {store ? "Manage Your Store" : "Create Your Store"}
            </h1>
            {store && (
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={store.commission_tier === "pro" ? "default" : "secondary"}>
                  {store.commission_tier === "pro" ? "Pro Store" : "Basic Store"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {store.commission_tier === "pro" ? "15% commission · Unlimited products" : "40% commission · 5 products max"}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 rounded-xl border border-border bg-card p-6">
          <div className="space-y-2">
            <Label>Store Name</Label>
            <Input
              value={form.store_name}
              onChange={(e) => {
                setForm({
                  ...form,
                  store_name: e.target.value,
                  slug: store ? form.slug : generateSlug(e.target.value),
                });
              }}
              placeholder="My Awesome Store"
            />
          </div>

          <div className="space-y-2">
            <Label>Store URL</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">/store/</span>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: generateSlug(e.target.value) })}
                placeholder="my-store"
              />
            </div>
            {store && (
              <button
                onClick={() => navigate(`/store/${store.slug}`)}
                className="flex items-center gap-1 text-sm text-accent hover:underline"
              >
                <ExternalLink className="h-3 w-3" /> View public store page
              </button>
            )}
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Tell buyers about your store..."
              rows={4}
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {store ? "Update Store" : "Create Store"}
          </Button>
        </div>

        {store && (
          <div className="mt-6 rounded-xl border border-accent/20 bg-accent/5 p-6">
            <h3 className="font-heading font-semibold text-foreground mb-2">💡 Free Trial Info</h3>
            <p className="text-sm text-muted-foreground">
              Your first <strong>3 months are free</strong> with the Basic plan (5 products, 40% commission). 
              After that, a small monthly fee applies. Upgrade to <strong>Pro</strong> for unlimited products 
              and only 15% commission.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SellerStore;

