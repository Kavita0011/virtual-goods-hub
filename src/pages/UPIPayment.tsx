import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/neon/client";
import { Camera, CheckCircle, Loader2, CreditCard, AlertCircle, ArrowLeft } from "lucide-react";

const UPI_ID = "virtualhub@xyzbank";

const UPIPayment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, profile } = useAuth();
  
  const orderId = searchParams.get("order_id");
  const amount = Number(searchParams.get("amount")) || 0;
  const productTitle = searchParams.get("product") || "VirtualHub Purchase";

  const [utr, setUtr] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleUPIIntent = () => {
    if (amount <= 0) return;

    const upiLink = `upi://pay?pa=${UPI_ID}&pn=VirtualHub&cu=INR&am=${amount.toFixed(2)}&tn=Order-${orderId || "DIRECT"}`;
    window.open(upiLink, "_blank");
  };

  const handleVerify = async () => {
    if (!utr.trim()) {
      setError("Please enter UTR number");
      return;
    }
    if (utr.length < 6 || utr.length > 20) {
      setError("UTR must be 6-20 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (!user) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from("payment_verifications")
        .insert({
          order_id: orderId,
          buyer_id: user.id,
          amount: amount * 100,
          upi_id: UPI_ID,
          utr: utr.trim(),
          screenshot_url: screenshot,
          status: "pending",
          payment_method: "UPI",
          transaction_note: `Purchase: ${productTitle}`,
        });

      if (insertError?.code === "23505") {
        setError("This UTR has already been used");
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Verification failed");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-10">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="font-heading text-2xl font-bold">Payment Submitted!</h2>
            <p className="mt-2 text-muted-foreground">
              Your payment is being verified. You'll receive your product once confirmed by admin.
            </p>
            <div className="mt-6 rounded-lg bg-secondary/50 p-4">
              <p className="text-sm text-muted-foreground">
                <strong>UTR:</strong> {utr}
                <br />
                <strong>Amount:</strong> ₹{amount.toFixed(2)}
              </p>
            </div>
            <Button onClick={() => navigate("/dashboard")} className="mt-6 w-full">
              Go to Dashboard
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="mx-auto max-w-lg">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <CreditCard className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold">Pay via UPI</h2>
                <p className="text-sm text-muted-foreground">GPay, PhonePe, Paytm</p>
              </div>
            </div>

            <div className="rounded-lg bg-secondary/50 p-4 mb-6">
              <p className="text-sm text-muted-foreground">Amount to Pay</p>
              <p className="text-2xl font-bold text-accent">₹{amount.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">{productTitle}</p>
            </div>

            <Button onClick={handleUPIIntent} className="w-full mb-6" size="lg">
              Open UPI App
            </Button>

            <div className="border-t border-border pt-6">
              <h3 className="font-medium mb-4">Verify Payment</h3>
              <p className="text-sm text-muted-foreground mb-4">
                After payment, enter the UTR number from your payment confirmation.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">UTR Number</label>
                  <Input
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    placeholder="Enter 12-digit UTR"
                    maxLength={20}
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <Button onClick={handleVerify} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Payment"
                  )}
                </Button>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Pay to UPI: {UPI_ID}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UPIPayment;