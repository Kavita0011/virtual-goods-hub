import { Store } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Store className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="font-heading text-lg font-bold text-foreground">
              Virtual<span className="text-accent">Hub</span>
            </span>
          </Link>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Marketplace</Link>
            <Link to="/sell" className="hover:text-foreground transition-colors">Sell</Link>
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link to="/support" className="hover:text-foreground transition-colors">Support</Link>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 VirtualHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
