import { neon } from "@neondatabase/serverless";
const sql = neon("postgresql://neondb_owner:npg_uTEn0C8lkDPz@ep-tiny-base-an19hzph-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require");

// Create gift_codes table for admin-controlled release
await sql(`
CREATE TABLE IF NOT EXISTS gift_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  product_id UUID REFERENCES products(id),
  order_id UUID REFERENCES orders(id),
  is_released BOOLEAN DEFAULT FALSE,
  released_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
)
`);
console.log("✅ gift_codes table created");

// Create unique constraint on payment_verifications
try {
  await sql(`ALTER TABLE payment_verifications ADD CONSTRAINT unique_utr UNIQUE (utr)`);
  console.log("✅ Unique constraint on UTR");
} catch(e) {
  console.log("Constraint might already exist");
}

// Add some gift codes for products
const products = await sql("SELECT id, title FROM products LIMIT 3");
if (products.length > 0) {
  for (let i = 0; i < products.length; i++) {
    const code = `VH-GIFT-${1000 + i}`;
    try {
      await sql(`INSERT INTO gift_codes (code, product_id, created_by) VALUES ($1, $2, (SELECT id FROM users WHERE role = 'admin' LIMIT 1))`, [code, products[i].id]);
      console.log(`Created: ${code} for ${products[i].title}`);
    } catch(e) {}
  }
}

console.log("✅ Database ready!");