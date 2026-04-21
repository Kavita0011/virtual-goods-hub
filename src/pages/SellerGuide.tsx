import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Store, Upload, CreditCard, Package, FileText, 
  Settings, TrendingUp, HelpCircle, ArrowLeft,
  CheckCircle, Download, Image, Palette, Crown
} from "lucide-react";

const SellerGuide = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <Store className="h-8 w-8" />,
      title: "1. Set Up Your Store",
      description: "Create your seller profile with your business name, logo, and description. Add your contact details for customer inquiries.",
      link: "/seller/store",
      linkText: "Go to Store Settings"
    },
    {
      icon: <Upload className="h-8 w-8" />,
      title: "2. Upload Your Products",
      description: "Add your digital products with clear images, descriptions, and pricing. You can upload templates, graphics, PDFs, and more.",
      link: "/seller/products",
      linkText: "Go to Products"
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "3. Set Up Payments",
      description: "Connect your payment methods. We support UPI, Bank Transfer, Paytm, GPay, Wise, and PayPal for easy withdrawals.",
      link: "/checkout",
      linkText: "Learn About Payments"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "4. Start Selling & Grow",
      description: "Promote your products, respond to buyers, and track your sales. Use social media to reach more customers.",
      link: "/dashboard",
      linkText: "View Dashboard"
    }
  ];

  const faqs = [
    {
      q: "What file formats can I sell?",
      a: "You can sell PDFs, JPG, PNG, PSD, AI, EPS, SVG, ZIP, and most common digital formats."
    },
    {
      q: "How do I get paid?",
      a: "Payments are processed via UPI, Bank Transfer, Wise, Paytm, or PayPal. Minimum payout is ₹500."
    },
    {
      q: "What is the platform fee?",
      a: "We charge 10% on each sale. Free sellers get 10% off with membership (₹99/month)."
    },
    {
      q: "Can I offer free products?",
      a: "Yes! Free products help attract customers. You can set any price including ₹0."
    },
    {
      q: "How do I deliver products?",
      a: "Buyers get instant access to download files after purchase. No manual delivery needed."
    },
    {
      q: "Can I update my products after listing?",
      a: "Yes, you can edit product details, pricing, and files anytime from your seller dashboard."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <FileText className="h-8 w-8 text-accent" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Seller Guide
            </h1>
            <p className="mt-2 text-muted-foreground">
              Everything you need to start selling on VirtualHub
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2" >
            {steps.map((step, index) => (
              <div 
                key={index}
                className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  {step.icon}
                </div>
                <h3 className="font-heading text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                <Button 
                  variant="link" 
                  className="mt-4 h-auto p-0 text-accent"
                  onClick={() => navigate(step.link)}
                >
                  {step.linkText} →
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
              <HelpCircle className="h-6 w-6" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details 
                  key={index}
                  className="group rounded-lg border border-border bg-card overflow-hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-4 font-medium hover:bg-secondary/50">
                    {faq.q}
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="px-4 pb-4 text-sm text-muted-foreground">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="mt-16 rounded-xl border border-accent/30 bg-accent/5 p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Crown className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold">Upgrade to Pro</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Get 10% off platform fees, priority support, and unlimited product uploads. 
                  Just ₹99/month or ₹899/year.
                </p>
                <Button className="mt-4" onClick={() => navigate("/seller/upgrade")}>
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SellerGuide;