import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Package, Store, ShoppingBag, Crown, LogOut, ArrowUpCircle } from "lucide-react";

const Dashboard = () => {
  const { profile, signOut, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isSeller = profile?.role === "seller" || profile?.role === "admin";
  const isBuyer = profile?.role === "buyer" || profile?.role === "admin";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Welcome, {profile?.full_name || "User"} 👋
            </h1>
            <p className="mt-1 text-muted-foreground">
              Role: <span className="capitalize font-medium text-accent">{profile?.role}</span>
              {" · "}
              Membership: <span className="capitalize font-medium">{profile?.membership_status}</span>
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Seller Section */}
        <div className="mt-8">
          <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
            <Store className="h-5 w-5" />
            Seller Dashboard
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {isSeller ? (
              <>
                <DashCard
                  icon={<Store className="h-6 w-6" />}
                  title="My Store"
                  desc="Manage your store and settings"
                  onClick={() => navigate("/seller/store")}
                />
                <DashCard
                  icon={<Package className="h-6 w-6" />}
                  title="My Products"
                  desc="List and manage your products"
                  onClick={() => navigate("/seller/products")}
                />
                <DashCard
                  icon={<Crown className="h-6 w-6" />}
                  title="Upgrade to Pro"
                  desc="Unlimited products, lower fees"
                  onClick={() => navigate("/seller/upgrade")}
                  accent
                />
              </>
            ) : (
              <DashCard
                icon={<ArrowUpCircle className="h-6 w-6" />}
                title="Become a Seller"
                desc="Start selling your digital products"
                onClick={() => navigate("/seller/become")}
                accent
              />
            )}
          </div>
        </div>

        {/* Buyer Section */}
        <div className="mt-8">
          <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Buyer Dashboard
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {isBuyer && (
              <>
                <DashCard
                  icon={<ShoppingBag className="h-6 w-6" />}
                  title="My Orders"
                  desc="View your purchase history"
                  onClick={() => navigate("/orders")}
                />
                <DashCard
                  icon={<Package className="h-6 w-6" />}
                  title="My Library"
                  desc="Re-download purchased files"
                  onClick={() => navigate("/library")}
                />
                <DashCard
                  icon={<Crown className="h-6 w-6" />}
                  title="Become a Member"
                  desc="Get 10% off all products"
                  onClick={() => navigate("/membership")}
                  accent
                />
              </>
            )}
          </div>
        </div>

        {/* Admin Section */}
        {profile?.role === "admin" && (
          <div className="mt-8">
            <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Admin Dashboard
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <DashCard
                icon={<Store className="h-6 w-6" />}
                title="Manage Stores"
                desc="View and control all stores"
                onClick={() => navigate("/admin/stores")}
              />
              <DashCard
                icon={<Package className="h-6 w-6" />}
                title="Manage Products"
                desc="View all products on platform"
                onClick={() => navigate("/admin/products")}
              />
              <DashCard
                icon={<ShoppingBag className="h-6 w-6" />}
                title="All Orders"
                desc="View platform-wide orders"
                onClick={() => navigate("/admin/orders")}
              />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

const DashCard = ({ icon, title, desc, onClick, accent }: { icon: any; title: string; desc: string; onClick: () => void; accent?: boolean }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-start gap-3 rounded-xl border p-6 text-left transition-all hover:shadow-lg ${
      accent ? "border-accent/30 bg-accent/5 hover:border-accent/50" : "border-border bg-card"
    }`}
  >
    <div className={`p-2 rounded-lg ${accent ? "bg-accent/10" : "bg-secondary"}`}>{icon}</div>
    <div>
      <h3 className="font-heading font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{desc}</p>
    </div>
  </button>
);

export default Dashboard;