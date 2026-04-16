import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/neon/client";
import { useToast } from "@/hooks/use-toast";
import { Package, Plus, Trash2, Edit, Loader2, Upload, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Constants } from "@/integrations/neon/types";

const CATEGORIES = Constants.public.Enums.product_category;

const SellerProducts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "other" as string,
    price: "",
    discount_price: "",
    status: "draft" as string,
  });

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    const { data: storeData } = await supabase
      .from("stores")
      .select("*")
      .eq("seller_id", user!.id)
      .maybeSingle();

    if (!storeData) {
      setLoading(false);
      return;
    }
    setStore(storeData);

    const { data: prods } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", storeData.id)
      .order("created_at", { ascending: false });

    setProducts(prods || []);
    setLoading(false);
  };

  const resetForm = () => {
    setForm({ title: "", description: "", category: "other", price: "", discount_price: "", status: "draft" });
    setEditingId(null);
    setPreviewFile(null);
    setProductFile(null);
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) throw error;
    if (bucket === "product-previews") {
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      return urlData.publicUrl;
    }
    return data.path;
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.price) {
      toast({ title: "Title and price are required", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      let preview_url: string | undefined;
      let file_url: string | undefined;

      if (previewFile) {
        const path = `${store.id}/${Date.now()}-${previewFile.name}`;
        preview_url = await uploadFile(previewFile, "product-previews", path);
      }
      if (productFile) {
        const path = `${store.id}/${Date.now()}-${productFile.name}`;
        file_url = await uploadFile(productFile, "product-files", path);
      }

      const payload: any = {
        store_id: store.id,
        title: form.title,
        description: form.description,
        category: form.category,
        price: Math.round(parseFloat(form.price) * 100),
        discount_price: form.discount_price ? Math.round(parseFloat(form.discount_price) * 100) : null,
        status: form.status,
      };
      if (preview_url) payload.preview_url = preview_url;
      if (file_url) payload.file_url = file_url;

      if (editingId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingId);
        if (error) throw error;
        toast({ title: "Product updated!" });
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
        toast({ title: "Product created!" });
      }

      resetForm();
      setDialogOpen(false);
      loadData();
    } catch (err: any) {
      const msg = err.message?.includes("5 products")
        ? "Basic stores are limited to 5 products. Upgrade to Pro!"
        : err.message;
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: any) => {
    setForm({
      title: product.title,
      description: product.description || "",
      category: product.category,
      price: (product.price / 100).toFixed(2),
      discount_price: product.discount_price ? (product.discount_price / 100).toFixed(2) : "",
      status: product.status,
    });
    setEditingId(product.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting product", variant: "destructive" });
    } else {
      toast({ title: "Product deleted" });
      loadData();
    }
  };

  const toggleStatus = async (product: any) => {
    const newStatus = product.status === "published" ? "unpublished" : "published";
    await supabase.from("products").update({ status: newStatus }).eq("id", product.id);
    loadData();
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
          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Create a store first</h2>
          <p className="text-muted-foreground mb-4">You need a store before listing products.</p>
          <Button onClick={() => window.location.href = "/seller/store"}>Create Store</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent/10 p-2">
              <Package className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">My Products</h1>
              <p className="text-sm text-muted-foreground">
                {products.length}{store.commission_tier === "basic" ? " / 5" : ""} products
              </p>
            </div>
          </div>

          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Product" : "New Product"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Product title" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price ($)</Label>
                    <Input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Discount Price ($)</Label>
                    <Input type="number" step="0.01" min="0" value={form.discount_price} onChange={(e) => setForm({ ...form, discount_price: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Preview Image</Label>
                  <Input type="file" accept="image/*" onChange={(e) => setPreviewFile(e.target.files?.[0] || null)} />
                </div>
                <div className="space-y-2">
                  <Label>Product File (digital download)</Label>
                  <Input type="file" onChange={(e) => setProductFile(e.target.files?.[0] || null)} />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSave} disabled={saving} className="w-full">
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  {editingId ? "Update Product" : "Create Product"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-heading font-semibold text-foreground">No products yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Click "Add Product" to list your first digital product.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                {p.preview_url && (
                  <img src={p.preview_url} alt={p.title} className="h-16 w-16 rounded-lg object-cover" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{p.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {p.category.replace(/_/g, " ")}
                    </Badge>
                    <Badge variant={p.status === "published" ? "default" : "outline"} className="text-xs">
                      {p.status}
                    </Badge>
                    <span className="text-sm font-medium text-accent">
                      ${(p.price / 100).toFixed(2)}
                      {p.discount_price && (
                        <span className="ml-1 text-muted-foreground line-through">${(p.discount_price / 100).toFixed(2)}</span>
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => toggleStatus(p)} title={p.status === "published" ? "Unpublish" : "Publish"}>
                    {p.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SellerProducts;

