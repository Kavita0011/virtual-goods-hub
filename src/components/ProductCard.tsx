import { motion } from "framer-motion";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  title: string;
  seller: string;
  price: number;
  discountPrice?: number;
  image: string;
  category: string;
  rating: number;
}

const ProductCard = ({ title, seller, price, discountPrice, image, category, rating }: ProductCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group overflow-hidden rounded-xl border border-border bg-card shadow-[var(--card-shadow)] transition-shadow hover:shadow-[var(--card-shadow-hover)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-card/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
            {category}
          </span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-primary/0 opacity-0 transition-all group-hover:bg-primary/40 group-hover:opacity-100">
          <Button variant="hero" size="sm" className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground">{seller}</p>
        <h3 className="mt-1 font-heading text-sm font-semibold text-foreground line-clamp-2">{title}</h3>
        <div className="mt-2 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="text-xs font-medium text-foreground">{rating}</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          {discountPrice ? (
            <>
              <span className="font-heading text-lg font-bold text-foreground">₹{discountPrice}</span>
              <span className="text-sm text-muted-foreground line-through">₹{price}</span>
            </>
          ) : (
            <span className="font-heading text-lg font-bold text-foreground">₹{price}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
