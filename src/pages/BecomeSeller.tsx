import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Store, ArrowLeft, Loader2 } from "lucide-react";

const BecomeSeller = () => {
  const { profile, updateRole, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isAlreadySeller = profile?.role === "seller" || profile?.role === "admin";

  const handleBecomeSeller = async () => {
    setLoading(true);
    const { error } = await updateRole("seller");
    setLoading(false);
    
    if (error) {
      alert(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Store className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">You're now a seller!</h2>
          <p className="mt-2 text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  if (isAlreadySeller) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-10">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <Store className="h-8 w-8 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">You're already a seller!</h2>
            <p className="mt-2 text-muted-foreground">You can access your seller dashboard now.</p>
            <Button onClick={() => navigate("/seller/store")} className="mt-6">
              Go to My Store
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mx-auto max-w-lg">
          <div className="rounded-xl border border-border bg-card p-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <Store className="h-8 w-8 text-accent" />
            </div>
            
            <h1 className="text-center font-heading text-2xl font-bold text-foreground">
              Become a Seller
            </h1>
            <p className="mt-2 text-center text-muted-foreground">
              Start selling your digital products on Virtual Goods Hub
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">1</div>
                <div>
                  <h3 className="font-medium">Create your store</h3>
                  <p className="text-sm text-muted-foreground">Set up your seller profile</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">2</div>
                <div>
                  <h3 className="font-medium">Upload products</h3>
                  <p className="text-sm text-muted-foreground">Add your digital designs</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">3</div>
                <div>
                  <h3 className="font-medium">Start earning</h3>
                  <p className="text-sm text-muted-foreground">Accept payments via UPI, Wise & more</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleBecomeSeller} 
              disabled={loading}
              className="mt-8 w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                "Become a Seller"
              )}
            </Button>
            
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Free forever. 10% platform fee on sales.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BecomeSeller;