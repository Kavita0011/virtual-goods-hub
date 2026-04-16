import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Package, Store, ShoppingBag, Crown, LogOut } from "lucide-react";

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

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {profile?.role === "seller" && (
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
          )}

          {profile?.role === "buyer" && (
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

          {profile?.role === "admin" && (
            <>
              <DashCard
                icon={<Store className="h-6 w-6" />}
                title="Manage Stores"
                desc="View and control all stores"
                onClick={() => navigate("/admin/stores")}
              />
              <DashCard
                icon={<Package className="h-6 w-6" />}
                title="Manage Products"
                desc="Review and moderate products"
                onClick={() => navigate("/admin/products")}
              />
              <DashCard
                icon={<ShoppingBag className="h-6 w-6" />}
                title="All Orders"
                desc="View platform-wide orders"
                onClick={() => navigate("/admin/orders")}
              />
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const DashCard = ({
  icon,
  title,
  desc,
  onClick,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
  accent?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-start gap-3 rounded-xl border p-6 text-left transition-all hover:shadow-[var(--card-shadow-hover)] ${
      accent
        ? "border-accent/30 bg-accent/5 hover:border-accent/50"
        : "border-border bg-card"
    }`}
  >
    <div className={`rounded-lg p-2 ${accent ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
      {icon}
    </div>
    <div>
      <h3 className="font-heading font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  </button>
);

export default Dashboard;

