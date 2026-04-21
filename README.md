# VirtualHub - Digital Marketplace

A full-featured digital products marketplace built with React, Neon database, and Cloudflare hosting.

## 🔴 Live Demo

**Frontend:** https://virtual-hub.pages.dev  
**API:** https://virtual-hub-api.devappkavita.workers.dev

---

## 📋 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@virtualhub.com | admin123 |
| **Buyer** | buyer@test.com | buyer123 |
| **Seller** | seller@test.com | seller123 |

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite + TypeScript + TailwindCSS
- **Database:** Neon (PostgreSQL)
- **Hosting:** Cloudflare Pages + Workers
- **Auth:** Custom JWT (localStorage-based)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build for production
npm run build

# Deploy to Cloudflare
npx wrangler pages deploy dist
npx wrangler deploy
```

---

## 📁 Project Structure

```
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React contexts (Auth, Cart)
│   ├── integrations/     # Database client
│   ├── lib/              # Utilities
│   ├── pages/            # Page components
│   └── App.tsx          # Main app with routes
├── workers/             # Cloudflare Worker API
├── public/              # Static assets
└── wrangler.toml        # Cloudflare config
```

---

## 🗄️ Database Schema

### Tables
- **users** - User accounts (email, password_hash, role)
- **profiles** - User profiles (full_name, avatar, role, membership)
- **stores** - Seller stores (store_name, slug, description)
- **products** - Digital products (title, price, category, file_url)
- **orders** - Purchase orders with payment details
- **order_items** - Individual items in orders
- **payment_verifications** - UTR verification queue
- **gift_codes** - Product codes (released after payment verified)
- **subscriptions** - Membership plans
- **contact_messages** - Contact form submissions

---

## 💳 Payment Flow (UPI)

1. Buyer adds product → Checkout
2. Select UPI payment → Opens UPI app with fixed amount
3. Enter UTR number → Submit for verification
4. Admin verifies in database → Status: "verified"
5. Product code revealed to buyer

---

## 🎨 Features

- [x] Single-page landing with SEO optimization
- [x] Multi-role system (Admin, Seller, Buyer)
- [x] Product browsing with categories
- [x] Shopping cart
- [x] UPI payment with verification
- [x] Admin payment verification dashboard
- [x] Product code generation
- [x] Contact form with database storage
- [x] Seller dashboard with product management
- [x] Buyer dashboard with orders/library
- [x] Responsive design (mobile-friendly)
- [x] Custom favicon (purple-pink gradient)

---

## 🔧 Environment Variables

```
NEON_DATABASE_URL=postgresql://neondb_owner:xxx@ep-tiny-base-xxx.neon.tech/neondb?sslmode=require
```

---

## 📄 License

MIT License - VirtualHub 2026
