import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const sampleProducts = [
  { title: "Professional Resume Template - Modern CV Design", seller: "DesignStudio", price: 999, discountPrice: 499, image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop", category: "Templates", rating: 4.8 },
  { title: "Digital Illustration Pack - Anime Characters Vol.1", seller: "AnimeArts", price: 1499, image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=300&fit=crop", category: "Anime Art", rating: 4.9 },
  { title: "Complete SEO Guide - Ebook for Beginners", seller: "MarketingPro", price: 799, discountPrice: 399, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop", category: "Ebooks", rating: 4.5 },
  { title: "Birthday Card Collection - 50 Editable Designs", seller: "CardCraft", price: 599, image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=300&fit=crop", category: "Templates", rating: 4.7 },
  { title: "SaaS Landing Page - Tailwind CSS Template", seller: "WebDevPro", price: 2499, discountPrice: 1999, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop", category: "Landing Pages", rating: 4.6 },
  { title: "Minimalist Logo Pack - 100 Vector Logos", seller: "LogoMaster", price: 1999, image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop", category: "Logo Design", rating: 4.8 },
  { title: "Podcast Intro Music - 10 Royalty-Free Tracks", seller: "SoundWave", price: 899, discountPrice: 699, image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=300&fit=crop", category: "Podcasts", rating: 4.4 },
  { title: "Wedding Invitation Kit - Floral Edition", seller: "EventDesigns", price: 1299, image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&h=300&fit=crop", category: "Templates", rating: 4.9 },
];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? sampleProducts
    : sampleProducts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      <section id="products" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">Trending Products</h2>
              <p className="mt-1 text-sm text-muted-foreground">Discover top-selling digital products</p>
            </div>
          </div>

          <div className="mt-6">
            <CategoryFilter active={activeCategory} onSelect={setActiveCategory} />
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product, i) => (
              <ProductCard key={i} {...product} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              No products found in this category yet.
            </div>
          )}
        </div>
      </section>

      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
