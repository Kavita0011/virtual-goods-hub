import { neon } from "@neondatabase/serverless";
const sql = neon("postgresql://neondb_owner:npg_uTEn0C8lkDPz@ep-tiny-base-an19hzph-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require");

const users = await sql("SELECT email, role, full_name FROM users ORDER BY created_at");
console.log(users.map(u => `${u.role}: ${u.email}`).join('\n'));