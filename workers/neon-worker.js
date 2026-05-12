import { neon } from "@neondatabase/serverless";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/db") return handleDatabaseRequest(request, env);
    if (path === "/auth/signup") return handleSignup(request, env);
    if (path === "/auth/login") return handleLogin(request, env);
    if (path === "/auth/update-role") return handleUpdateRole(request, env);

    if (path === "/health") {
      return new Response(JSON.stringify({ status: "ok", db: !!env.DATABASE_URL }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers: corsHeaders });
  },
};

async function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function handleSignup(request, env) {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const { email, password, fullName, role } = await request.json();
    if (!email || !password || !fullName) return json({ error: "Missing fields" }, 400);

    const sql = neon(env.DATABASE_URL);

    const existing = await sql("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.length > 0) return json({ error: "Email already registered" }, 409);

    const user = await sql(
      `INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role`,
      [email, password, fullName, role || "buyer"]
    );

    await sql(
      `INSERT INTO profiles (user_id, full_name, role) VALUES ($1, $2, $3)`,
      [user[0].id, fullName, role || "buyer"]
    );

    return json({ user: user[0], token: user[0].id, expiresAt: Date.now() + 7 * 86400000 });
  } catch (e: any) { return json({ error: e.message }, 500); }
}

async function handleLogin(request, env) {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const { email, password } = await request.json();
    if (!email || !password) return json({ error: "Missing fields" }, 400);

    const sql = neon(env.DATABASE_URL);
    const user = await sql("SELECT id, email, full_name, role FROM users WHERE email = $1 AND password_hash = $2", [email, password]);

    if (user.length === 0) return json({ error: "Invalid email or password" }, 401);

    const profile = await sql("SELECT * FROM profiles WHERE user_id = $1", [user[0].id]);

    return json({
      user: user[0],
      profile: profile.length > 0 ? profile[0] : null,
      token: user[0].id,
      expiresAt: Date.now() + 7 * 86400000,
    });
  } catch (e: any) { return json({ error: e.message }, 500); }
}

async function handleUpdateRole(request, env) {
  if (request.method !== "PATCH") return json({ error: "Method not allowed" }, 405);
  try {
    const { userId, newRole } = await request.json();
    if (!userId || !newRole) return json({ error: "Missing fields" }, 400);

    const sql = neon(env.DATABASE_URL);
    await sql("UPDATE users SET role = $1 WHERE id = $2", [newRole, userId]);
    await sql("UPDATE profiles SET role = $1 WHERE user_id = $2", [newRole, userId]);

    return json({ success: true, role: newRole });
  } catch (e: any) { return json({ error: e.message }, 500); }
}

async function handleDatabaseRequest(request, env) {
  const { searchParams } = new URL(request.url);
  const table = searchParams.get("table");
  const select = searchParams.get("select") || "*";
  const single = searchParams.get("single") === "true";

  if (!table) return json({ error: "Table is required" }, 400);
  if (!env.DATABASE_URL) return json({ error: "Database not configured" }, 500);

  const sql = neon(env.DATABASE_URL);

  try {
    let result;

    switch (request.method) {
      case "GET": {
        const joinMatch = select.match(/(\w+)\((\w+)\)/);
        if (joinMatch) {
          const mainTable = table;
          const joinTable = joinMatch[1];
          const joinAlias = joinMatch[2];
          let query = `SELECT ${mainTable}.*, row_to_json(${joinTable}.*) as ${joinAlias} FROM ${mainTable} LEFT JOIN ${joinTable} ON ${mainTable}.${joinTable.slice(0, -1)}_id = ${joinTable}.id`;

          const filters = [];
          const values = [];
          for (const [key, value] of searchParams.entries()) {
            if (key.startsWith("filter_")) {
              const field = key.replace("filter_", "");
              values.push(value);
              filters.push(`${mainTable}.${field} = $${values.length}`);
            }
          }
          if (filters.length > 0) query += ` WHERE ${filters.join(" AND ")}`;

          const order = searchParams.get("order");
          if (order) {
            const [field, direction] = order.split(".");
            query += ` ORDER BY ${mainTable}.${field} ${direction || "asc"}`;
          }
          const limit = searchParams.get("limit");
          if (limit) query += ` LIMIT ${parseInt(limit)}`;
          if (single) query += " LIMIT 1";

          result = await sql(query, values);
        } else {
          let query = `SELECT ${select} FROM ${table}`;
          const filters = [];
          const values = [];

          for (const [key, value] of searchParams.entries()) {
            if (key.startsWith("filter_")) {
              const field = key.replace("filter_", "");
              values.push(value);
              filters.push(`${field} = $${values.length}`);
            }
          }
          if (filters.length > 0) query += ` WHERE ${filters.join(" AND ")}`;

          const order = searchParams.get("order");
          if (order) {
            const [field, direction] = order.split(".");
            query += ` ORDER BY ${field} ${direction || "asc"}`;
          }
          const limit = searchParams.get("limit");
          if (limit) query += ` LIMIT ${parseInt(limit)}`;
          if (single) query += " LIMIT 1";

          result = await sql(query, values);
        }

        if (single) result = result?.length > 0 ? result[0] : null;
        break;
      }

      case "POST": {
        const body = await request.json();
        const keys = Object.keys(body);
        const values = Object.values(body);
        const cols = keys.join(", ");
        const ph = keys.map((_, i) => `$${i + 1}`).join(", ");
        result = await sql(`INSERT INTO ${table} (${cols}) VALUES (${ph}) RETURNING *`, values);
        break;
      }

      case "PATCH": {
        const body = await request.json();
        const keys = Object.keys(body);
        const values = Object.values(body);
        const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");

        let query = `UPDATE ${table} SET ${updates} RETURNING *`;
        const filters = [];
        for (const [key, value] of searchParams.entries()) {
          if (key.startsWith("filter_")) {
            const field = key.replace("filter_", "");
            filters.push(`${field} = $${values.length + 1}`);
            values.push(value);
          }
        }
        if (filters.length > 0) query += ` WHERE ${filters.join(" AND ")}`;
        result = await sql(query, values);
        break;
      }

      case "DELETE": {
        let query = `DELETE FROM ${table} RETURNING *`;
        const values = [];
        const filters = [];
        for (const [key, value] of searchParams.entries()) {
          if (key.startsWith("filter_")) {
            const field = key.replace("filter_", "");
            filters.push(`${field} = $${values.length + 1}`);
            values.push(value);
          }
        }
        if (filters.length > 0) query += ` WHERE ${filters.join(" AND ")}`;
        result = await sql(query, values);
        break;
      }

      default:
        return json({ error: "Method not allowed" }, 405);
    }

    return json(result);
  } catch (error: any) {
    return json({ error: error.message }, 500);
  }
}