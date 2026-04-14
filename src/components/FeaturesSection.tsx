import { motion } from "framer-motion";
import { Shield, Zap, CreditCard, Download } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Start Free, Grow Fast",
    description: "List up to 5 products free. Upgrade to Pro for unlimited listings and lower fees.",
  },
  {
    icon: Shield,
    title: "Secure File Delivery",
    description: "Your digital products are delivered securely. Buyers re-download anytime from their Virtual Vault.",
  },
  {
    icon: CreditCard,
    title: "Instant Payouts",
    description: "Get paid directly to your account. Transparent commission with no hidden charges.",
  },
  {
    icon: Download,
    title: "Member Discounts",
    description: "Buyers with membership get 10-15% off all products across the marketplace.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-secondary/50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground">Why Sell on VirtualHub?</h2>
          <p className="mt-2 text-muted-foreground">Everything you need to launch your digital business</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-6 shadow-[var(--card-shadow)] transition-shadow hover:shadow-[var(--card-shadow-hover)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
