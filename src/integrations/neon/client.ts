const API_BASE_URL = import.meta.env.VITE_API_URL || "https://virtual-hub-api.devappkavita.workers.dev";

async function api(method: string, path: string, body?: any) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const result = await res.json();
  if (result?.error) return { data: null, error: { message: result.error } };
  return { data: result, error: null };
}

function buildQuery(table: string, params: Record<string, string>) {
  const qs = new URLSearchParams({ table, ...params }).toString();
  return `${API_BASE_URL}/db?${qs}`;
}

export const supabase = {
  from: (table: string) => {
    const ctx: Record<string, any> = { filters: {}, select: "*", single: false };

    const end = async () => {
      const p: Record<string, string> = { table, select: ctx.select };
      if (ctx.single) p.single = "true";
      if (ctx.order) p.order = ctx.order;
      if (ctx.limit !== undefined) p.limit = String(ctx.limit);
      Object.entries(ctx.filters).forEach(([k, v]) => (p[`filter_${k}`] = v));
      return api("GET", `/db?${new URLSearchParams(p).toString()}`);
    };

    return {
      select: (fields: string) => ({
        eq: (key: string, value: unknown) => {
          ctx.filters[key] = String(value);
          return {
            order: (field: string, opts?: { ascending?: boolean }) => {
              ctx.order = `${field}.${opts?.ascending ? "asc" : "desc"}`;
              return {
                limit: (count: number) => { ctx.limit = count; const e = { execute: end, then: (resolve: any) => end().then(resolve) }; return e; },
                execute: end,
              };
            },
            execute: end,
          };
        },
        execute: end,
      }),
      insert: (data: Record<string, unknown>) => ({
        then: (resolve: any) => api("POST", `/db?table=${table}`, data).then(r => resolve(Array.isArray(r) ? { data: r[0] } : r)),
        execute: async () => { const r = await api("POST", `/db?table=${table}`, data); return Array.isArray(r) ? { data: r[0], error: null } : r; },
      }),
    };
  },
  auth: {
    signup: (email: string, password: string, fullName: string, role?: string) =>
      api("POST", "/auth/signup", { email, password, fullName, role: role || "buyer" }),
    login: (email: string, password: string) =>
      api("POST", "/auth/login", { email, password }),
    updateRole: (userId: string, newRole: string) =>
      api("PATCH", "/auth/update-role", { userId, newRole }),
  },
};