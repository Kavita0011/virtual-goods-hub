import { neon } from "@neondatabase/serverless";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/db") {
      return handleDatabaseRequest(request, env);
    }

    if (path === "/health") {
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};

async function handleDatabaseRequest(request, env) {
  const { searchParams } = new URL(request.url);
  const table = searchParams.get("table");
  const select = searchParams.get("select") || "*";
  const single = searchParams.get("single") === "true";

  if (!table) {
    return new Response(JSON.stringify({ error: "Table is required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!env.DATABASE_URL) {
    return new Response(JSON.stringify({ error: "Database not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const sql = neon(env.DATABASE_URL);

  try {
    let result;

    switch (request.method) {
      case "GET": {
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

        if (filters.length > 0) {
          query += ` WHERE ${filters.join(" AND ")}`;
        }

        const order = searchParams.get("order");
        if (order) {
          query += ` ORDER BY ${order.replace(".", " ")}`;
        }

        const limit = searchParams.get("limit");
        if (limit) {
          query += ` LIMIT ${parseInt(limit)}`;
        }

        const offset = searchParams.get("offset");
        if (offset) {
          query += ` OFFSET ${parseInt(offset)}`;
        }

        if (single) {
          query += " LIMIT 1";
        }

        result = await sql(query, values);
        if (single && result.length > 0) {
          result = result[0];
        } else if (single) {
          result = null;
        }
        break;
      }

      case "POST": {
        const body = await request.json();
        const keys = Object.keys(body);
        const values = Object.values(body);
        const columns = keys.join(", ");
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

        const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
        result = await sql(query, values);
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

        if (filters.length > 0) {
          query += ` WHERE ${filters.join(" AND ")}`;
        }

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

        if (filters.length > 0) {
          query += ` WHERE ${filters.join(" AND ")}`;
        }

        result = await sql(query, values);
        break;
      }

      default:
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}
