import { createAuthClient } from "@neondatabase/auth";

const NEON_AUTH_URL = import.meta.env.VITE_NEON_AUTH_URL;

export const authClient = createAuthClient({
  baseURL: NEON_AUTH_URL,
});

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

interface ApiResponse<T> {
  data: T | null;
  error: { message: string } | null;
}

class NeonDatabaseClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  from(table: string) {
    return new TableQuery(this.baseUrl, table);
  }

  storage = {
    from: (bucket: string) => ({
      upload: async (path: string, file: File | Blob, options?: { upsert?: boolean }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("path", path);
        formData.append("upsert", String(options?.upsert ?? false));

        const response = await fetch(`${this.baseUrl}/storage/${bucket}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          return { data: null, error: { message: "Upload failed" } };
        }

        const data = await response.json();
        return { data, error: null };
      },
      getPublicUrl: (path: string) => {
        return { data: { publicUrl: `${this.baseUrl}/storage/${bucket}/${path}` }, error: null };
      },
    }),
  };
}

class TableQuery {
  private baseUrl: string;
  private table: string;
  private filters: QueryParams = {};
  private selectFields: string = "*";
  private orderField?: string;
  private orderDirection?: "asc" | "desc";
  private limitValue?: number;
  private offsetValue?: number;
  private isSingle: boolean = false;

  constructor(baseUrl: string, table: string) {
    this.baseUrl = baseUrl;
    this.table = table;
  }

  select(fields: string) {
    this.selectFields = fields;
    return this;
  }

  eq(key: string, value: any) {
    this.filters[key] = value;
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.orderField = field;
    this.orderDirection = options?.ascending ? "asc" : "desc";
    return this;
  }

  limit(count: number) {
    this.limitValue = count;
    return this;
  }

  offset(count: number) {
    this.offsetValue = count;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  async maybeSingle(): Promise<ApiResponse<any>> {
    this.isSingle = true;
    return this.executeGet();
  }

  async insert(data: Record<string, any>): Promise<ApiResponse<any>> {
    return this.executeMutation("POST", data);
  }

  async update(data: Record<string, any>): Promise<ApiResponse<any>> {
    return this.executeMutation("PATCH", data);
  }

  async delete(): Promise<ApiResponse<any>> {
    return this.executeMutation("DELETE", {});
  }

  private async executeGet(): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams();
      params.set("table", this.table);
      params.set("select", this.selectFields);

      if (this.isSingle) {
        params.set("single", "true");
      }

      Object.entries(this.filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.set(`filter_${key}`, String(value));
        }
      });

      if (this.orderField) {
        params.set("order", `${this.orderField}.${this.orderDirection || "asc"}`);
      }
      if (this.limitValue !== undefined) {
        params.set("limit", String(this.limitValue));
      }
      if (this.offsetValue !== undefined) {
        params.set("offset", String(this.offsetValue));
      }

      const url = `${this.baseUrl}/db?${params.toString()}`;
      const authToken = this.getAuthHeader();

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { data: null, error: { message: errorText } };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message || "Unknown error" } };
    }
  }

  private async executeMutation(
    method: "POST" | "PATCH" | "DELETE",
    body: Record<string, any>
  ): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams();
      params.set("table", this.table);

      Object.entries(this.filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.set(`filter_${key}`, String(value));
        }
      });

      const url = `${this.baseUrl}/db?${params.toString()}`;
      const authToken = this.getAuthHeader();

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { data: null, error: { message: errorText } };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message || "Unknown error" } };
    }
  }

  private getAuthHeader(): string | null {
    return localStorage.getItem("auth_token");
  }
}

export const supabase = new NeonDatabaseClient(API_BASE_URL);
