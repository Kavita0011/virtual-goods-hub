import { motion } from "framer-motion";
import { 
  Layers, BookOpen, FileText, Palette, Gift, Heart, Layout, Globe, Mic, 
  Gem, PenTool, Droplets, Baby, Mail, Scroll, Share2, Printer, Brush, 
  Smartphone, Monitor, Box, Type, Image, Camera, Font, Sparkles, X
} from "lucide-react";

const CATEGORY_GROUPS: Record<string, { name: string; icon: any }[]> = {
  "": [
    { name: "All", icon: Layers },
  ],
  "Digital Products": [
    { name: "Ebooks", icon: BookOpen },
    { name: "Templates", icon: FileText },
    { name: "Podcasts", icon: Mic },
  ],
  "Art & Design": [
    { name: "Art", icon: Palette },
    { name: "Anime Art", icon: Palette },
    { name: "Illustrations", icon: Brush },
    { name: "Vector Art", icon: PenTool },
    { name: "Graphic Design", icon: Sparkles },
    { name: "3D Models", icon: Box },
  ],
  "Cards & Invitations": [
    { name: "Birthday Cards", icon: Gift },
    { name: "Anniversary Cards", icon: Heart },
    { name: "Wedding", icon: Gem },
    { name: "Baby Shower", icon: Baby },
    { name: "Invitations", icon: Mail },
    { name: "Shower", icon: Droplets },
  ],
  "Business & Branding": [
    { name: "Logo Design", icon: Globe },
    { name: "Landing Page", icon: Layout },
    { name: "UI/UX Design", icon: Monitor },
    { name: "Web Design", icon: Monitor },
  ],
  "Print & Merchandise": [
    { name: "Poster", icon: Scroll },
    { name: "Banner", icon: Scroll },
    { name: "Social Media", icon: Share2 },
    { name: "Print Design", icon: Printer },
  ],
  "Specialty": [
    { name: "Jewelry", icon: Gem },
    { name: "Nail Art", icon: Sparkles },
    { name: "Nail Design", icon: Sparkles },
    { name: "Photo Edit", icon: Camera },
    { name: "Fonts", icon: Type },
    { name: "Textures", icon: Image },
    { name: "Other", icon: X },
  ],
};

interface CategoryFilterProps {
  active: string;
  onSelect: (category: string) => void;
}

const CategoryFilter = ({ active, onSelect }: CategoryFilterProps) => {
  return (
    <div className="space-y-6">
      {Object.entries(CATEGORY_GROUPS).map(([group, cats], groupIndex) => (
        <div key={group}>
          <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
            {group}
          </h3>
          <div className="flex flex-wrap gap-2">
            {cats.map((cat, i) => {
              const Icon = cat.icon;
              const isActive = active === cat.name;
              return (
                <motion.button
                  key={cat.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (groupIndex * 0.1) + (i * 0.03) }}
                  onClick={() => onSelect(cat.name)}
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-accent text-accent-foreground shadow-md"
                      : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {cat.name}
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryFilter;