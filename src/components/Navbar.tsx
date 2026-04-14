import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Menu, X, Store, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
            <Store className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground">
            Virtual<span className="text-accent">Hub</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Link to="/" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Marketplace
          </Link>
          <Link to="/categories" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Categories
          </Link>
          {user && profile?.role === "seller" && (
            <Link to="/dashboard" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Seller Dashboard
            </Link>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Search className="h-5 w-5" />
          </Button>
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  {profile?.full_name || "Dashboard"}
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="hero" size="sm">
                Get Started
              </Button>
            </Link>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            <Link to="/" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground">Marketplace</Link>
            <Link to="/categories" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground">Categories</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground">Dashboard</Link>
                <Button variant="outline" size="sm" className="mt-2 w-full" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="hero" size="sm" className="mt-2 w-full">Get Started</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
