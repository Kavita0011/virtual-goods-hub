import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
      </div>

      <div className="container relative mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            <Sparkles className="h-4 w-4" />
            The marketplace for digital creators
          </div>

          <h1 className="font-heading text-4xl font-extrabold leading-tight text-primary-foreground md:text-6xl">
            Buy & Sell
            <br />
            <span className="text-gradient">Digital Products</span>
            <br />
            Effortlessly
          </h1>

          <p className="mt-6 max-w-lg text-lg text-primary-foreground/70">
            Templates, ebooks, design assets, and more. Join thousands of creators
            earning on VirtualHub — your digital storefront awaits.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/auth">
              <Button variant="hero" size="lg" className="gap-2">
                Start Selling Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/#products">
              <Button variant="hero-outline" size="lg">
                Browse Products
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-8 text-sm text-primary-foreground/60">
            <div>
              <span className="block text-2xl font-bold text-primary-foreground">10K+</span>
              Products Listed
            </div>
            <div className="h-8 w-px bg-primary-foreground/20" />
            <div>
              <span className="block text-2xl font-bold text-primary-foreground">5K+</span>
              Sellers
            </div>
            <div className="h-8 w-px bg-primary-foreground/20" />
            <div>
              <span className="block text-2xl font-bold text-primary-foreground">50K+</span>
              Happy Buyers
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
