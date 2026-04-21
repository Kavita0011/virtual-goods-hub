import { neon } from "@neondatabase/serverless";
const sql = neon("postgresql://neondb_owner:npg_uTEn0C8lkDPz@ep-tiny-base-an19hzph-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require");

await sql(`
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
)
`);
console.log("✅ contact_messages table created");