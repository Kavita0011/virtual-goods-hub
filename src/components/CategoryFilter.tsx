import { motion } from "framer-motion";
import { BookOpen, Palette, FileText, Music, Gift, Layout, Mic, Layers, Heart, Globe } from "lucide-react";

const categories = [
  { name: "All", icon: Layers },
  { name: "Ebooks", icon: BookOpen },
  { name: "Templates", icon: FileText },
  { name: "Anime Art", icon: Palette },
  { name: "Birthday Cards", icon: Gift },
  { name: "Anniversary Cards", icon: Heart },
  { name: "Landing Pages", icon: Layout },
  { name: "Logo Design", icon: Globe },
  { name: "Podcasts", icon: Mic },
  { name: "Other", icon: Music },
];

interface CategoryFilterProps {
  active: string;
  onSelect: (category: string) => void;
}

const CategoryFilter = ({ active, onSelect }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat, i) => {
        const Icon = cat.icon;
        const isActive = active === cat.name;
        return (
          <motion.button
            key={cat.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelect(cat.name)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              isActive
                ? "bg-accent text-accent-foreground shadow-md"
                : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {cat.name}
          </motion.button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
