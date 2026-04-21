export type PaymentMethod = "upi" | "bank_transfer" | "wise" | "gpay" | "paytm" | "phonepe" | "google_pay"

export interface PaymentDetails {
  method: PaymentMethod
  upiId?: string
  bankName?: string
  accountNumber?: string
  ifscCode?: string
  wiseEmail?: string
  upiNumber?: string
}

export interface PaymentOrder {
  id: string
  amount: number
  buyerEmail: string
  products: { id: string; title: string; price: number }[]
  paymentMethod: PaymentMethod
  status: "pending" | "completed" | "failed"
  createdAt: Date
}

export const PAYMENT_INSTRUCTIONS: Record<PaymentMethod, { title: string; instructions: string; icon: string }> = {
  upi: {
    title: "UPI Payment",
    instructions: "Scan QR code or pay to UPI ID shown below",
    icon: "📱"
  },
  bank_transfer: {
    title: "Bank Transfer",
    instructions: "Transfer to the bank account details shown below",
    icon: "🏦"
  },
  wise: {
    title: "Wise Transfer",
    instructions: "Send payment via Wise to the email shown below",
    icon: "🌍"
  },
  gpay: {
    title: "Google Pay",
    instructions: "Send payment via GPay to the UPI/phone number shown",
    icon: "🔴"
  },
  paytm: {
    title: "Paytm",
    instructions: "Send payment via Paytm to the number shown",
    icon: "🟡"
  },
  phonepe: {
    title: "PhonePe",
    instructions: "Send payment via PhonePe to the UPI/phone shown",
    icon: "🟣"
  },
  google_pay: {
    title: "Google Pay (GPay)",
    instructions: "Send payment via Google Pay to the UPI/phone shown",
    icon: "🔴"
  }
}

export const CATEGORY_DISPLAY: Record<string, string> = {
  ebook: "Ebooks",
  template: "Templates",
  anime_art: "Anime Art",
  birthday_card: "Birthday Cards",
  anniversary_card: "Anniversary Cards",
  landing_page: "Landing Pages",
  logo_design: "Logo Design",
  podcast: "Podcasts",
  jewelry: "Jewelry",
  art: "Art",
  nail_art: "Nail Art",
  nail_design: "Nail Designs",
  shower: "Shower Designs",
  baby_shower: "Baby Shower",
  wedding: "Wedding",
  invitation: "Invitations",
  poster: "Posters",
  banner: "Banners",
  social_media: "Social Media",
  print_design: "Print Design",
  graphic_design: "Graphic Design",
  ui_ux: "UI/UX Design",
  web_design: "Web Design",
  illustration: "Illustrations",
  vector_art: "Vector Art",
  3d_model: "3D Models",
  photo_edit: "Photo Editing",
  font: "Fonts",
  texture: "Textures",
  other: "Other"
}

export const ALL_CATEGORIES = Object.keys(CATEGORY_DISPLAY)