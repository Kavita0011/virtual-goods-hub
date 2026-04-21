import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, Shield, CreditCard, Users, Mail } from "lucide-react";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-heading text-3xl font-bold text-foreground">Terms & Conditions</h1>
          <p className="mt-2 text-muted-foreground">Last updated: April 2026</p>

          <div className="mt-8 space-y-8">
            <section className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-accent" />
                <h2 className="font-heading text-xl font-semibold">1. Acceptance of Terms</h2>
              </div>
              <p className="mt-3 text-muted-foreground">
                By accessing and using VirtualHub, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by these terms, please do not use this service.
              </p>
            </section>

            <section className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-accent" />
                <h2 className="font-heading text-xl font-semibold">2. Intellectual Property</h2>
              </div>
              <p className="mt-3 text-muted-foreground">
                All content, designs, templates, and materials available on VirtualHub are protected by copyright and intellectual property laws. 
                Buyers receive a license to use purchased products for personal or commercial purposes as specified in each product listing.
                Resale or redistribution of digital products without permission is prohibited.
              </p>
            </section>

            <section className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-accent" />
                <h2 className="font-heading text-xl font-semibold">3. Payments & Refunds</h2>
              </div>
              <p className="mt-3 text-muted-foreground">
                All payments are processed securely. We support UPI, Bank Transfer, Paytm, GPay, Wise, and PayPal. 
                Refunds are available within 7 days of purchase if the product is not as described or if technical issues prevent access.
                Digital products that have been downloaded are not eligible for refund unless specifically warranted.
              </p>
            </section>

            <section className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-accent" />
                <h2 className="font-heading text-xl font-semibold">4. Seller Obligations</h2>
              </div>
              <p className="mt-3 text-muted-foreground">
                Sellers must ensure their products do not violate third-party rights, including copyright, trademark, or patent rights.
                Sellers are responsible for delivering products promptly after payment confirmation.
                VirtualHub charges a 10% platform fee on all sales (reduced to 0% for Pro members).
              </p>
            </section>

            <section className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent" />
                <h2 className="font-heading text-xl font-semibold">5. Contact Information</h2>
              </div>
              <p className="mt-3 text-muted-foreground">
                For questions about these terms, contact us at:
                <br />
                <strong>Email:</strong> support@virtualhub.store
                <br />
                <strong>Phone/WhatsApp:</strong> +91 98765 43210
              </p>
            </section>
          </div>

          <div className="mt-12 rounded-lg bg-secondary/50 p-6 text-center">
            <p className="text-muted-foreground">
              © 2026 VirtualHub. All rights reserved.
              <br />
              VirtualHub is a registered trademark.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsPage;