import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/neon/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Building, Smartphone, Globe, Copy, Check, QrCode } from "lucide-react";

const PAYMENT_METHODS = [
  { 
    id: "upi", 
    label: "UPI / QR Code", 
    icon: QrCode,
    instructions: "Scan QR code with any UPI app",
    fields: []
  },
  { 
    id: "bank_transfer", 
    label: "Bank Transfer (India)", 
    icon: Building,
    instructions: "Transfer to bank account",
    fields: [
      { label: "Bank Name", value: "HDFC Bank" },
      { label: "Account Name", value: "VirtualHub Pvt Ltd" },
      { label: "Account Number", value: "1234567890" },
      { label: "IFSC Code", value: "HDFC0001234" },
    ]
  },
  { 
    id: "paytm", 
    label: "Paytm", 
    icon: Smartphone,
    instructions: "Send via Paytm",
    fields: [{ label: "Paytm Number", value: "+91 98765 43210" }]
  },
  { 
    id: "gpay", 
    label: "Google Pay / PhonePe", 
    icon: Smartphone,
    instructions: "Send via GPay or PhonePe",
    fields: [{ label: "UPI ID", value: "virtualhub@oksbi" }]
  },
  { 
    id: "wise", 
    label: "Wise (International)", 
    icon: Globe,
    instructions: "International transfer via Wise",
    fields: [{ label: "Email", value: "virtualhub@wisemail.com" }]
  },
];

const CheckoutPage = () => {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState("");

  const total = items.reduce((sum, item) => sum + (item.discountPrice ?? item.price), 0);
  const platformFee = Math.round(total * 0.10);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 2000);
    toast({ title: "Copied to clipboard!" });
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setProcessing(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          buyer_id: user.id,
          total_amount: total * 100,
          platform_fee_collected: platformFee * 100,
          status: "pending",
        })
        .maybeSingle();

      if (orderError) throw orderError;
      if (!order) throw new Error("Failed to create order");

      for (const item of items) {
        await supabase.from("order_items").insert({
          order_id: order.id,
          product_id: item.id,
          price_at_purchase: item.price * 100,
          platform_fee: platformFee * 100,
        });
      }

      clearCart();
      toast({ title: "Order placed! Payment instructions sent to your email." });
      navigate("/orders");
    } catch (error: any) {
      toast({ title: "Error", description: error.message });
    } finally {
      setProcessing(false);
    }
  };

  const selectedMethod = PAYMENT_METHODS.find(m => m.id === paymentMethod);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="font-heading text-2xl font-bold">Your cart is empty</h2>
          <Button onClick={() => navigate("/")} className="mt-4">Continue Shopping</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <h1 className="font-heading text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-heading text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-border/50">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.seller}</p>
                    </div>
                    <span className="font-semibold">₹{(item.discountPrice ?? item.price).toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Platform fee (10%): ₹{platformFee.toFixed(2)}</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-heading text-xl font-semibold mb-4">Select Payment Method</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <div key={method.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-secondary/50 cursor-pointer">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="flex items-center gap-3 cursor-pointer flex-1">
                      <method.icon className="h-5 w-5 text-accent" />
                      <span>{method.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border-2 border-accent bg-accent/5 p-6">
              <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
                {selectedMethod?.icon && <selectedMethod.icon className="h-5 w-5" />}
                {selectedMethod?.label}
              </h2>
              <p className="text-muted-foreground mb-6">{selectedMethod?.instructions}</p>

              {selectedMethod?.id === "upi" && (
                <div className="text-center py-4">
                  <div className="w-48 h-48 mx-auto bg-white rounded-lg border-2 border-dashed flex items-center justify-center">
                    <QrCode className="h-32 w-32 text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">Scan with any UPI app</p>
                </div>
              )}

              {selectedMethod?.fields && selectedMethod.fields.length > 0 && (
                <div className="space-y-3">
                  {selectedMethod.fields.map((field) => (
                    <div key={field.label} className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">{field.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold">{field.value}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(field.value)}
                        >
                          {copied === field.value ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button 
                onClick={handlePlaceOrder} 
                disabled={processing}
                className="w-full mt-6"
                size="lg"
              >
                {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {processing ? "Processing..." : `Pay ₹${total.toFixed(2)} & Place Order`}
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                You'll receive download links after payment confirmation
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;