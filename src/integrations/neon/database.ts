import { neon } from "@neondatabase/serverless";

const DATABASE_URL = import.meta.env.VITE_NEON_DATABASE_URL;

const sql = neon(DATABASE_URL || "");

export { sql };

export type QueryResult<T> = {
  data: T | null;
  error: Error | null;
};

export const createQueryBuilder = () => {
  return new NeonQueryBuilder(sql);
};

class NeonQueryBuilder {
  private sql: ReturnType<typeof neon>;
  private tableName: string = "";
  private selectFields: string = "*";
  private filters: string[] = [];
  private orderByField: string = "";
  private orderDirection: "asc" | "desc" = "asc";
  private limitValue?: number;
  private offsetValue?: number;
  private insertData?: Record<string, any>;
  private updateData?: Record<string, any>;

  constructor(sqlFn: ReturnType<typeof neon>) {
    this.sql = sqlFn;
  }

  from(table: string) {
    this.tableName = table;
    return this;
  }

  select(fields: string = "*") {
    this.selectFields = fields;
    return this;
  }

  eq(field: string, value: any) {
    this.filters.push(`${field} = '${this.escapeValue(value)}'`);
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.orderByField = field;
    if (options?.ascending !== undefined) {
      this.orderDirection = options.ascending ? "asc" : "desc";
    }
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
    return this as any;
  }

  async then<T>(resolve: (value: { data: T; error: null }) => any, reject: any) {
    try {
      let query = `SELECT ${this.selectFields} FROM ${this.tableName}`;

      if (this.filters.length > 0) {
        query += ` WHERE ${this.filters.join(" AND ")}`;
      }

      if (this.orderByField) {
        query += ` ORDER BY ${this.orderByField} ${this.orderDirection.toUpperCase()}`;
      }

      if (this.limitValue !== undefined) {
        query += ` LIMIT ${this.limitValue}`;
      }

      if (this.offsetValue !== undefined) {
        query += ` OFFSET ${this.offsetValue}`;
      }

      const result = await this.sql(query);
      resolve({ data: result as T, error: null });
    } catch (error) {
      reject({ data: null, error });
    }
  }

  private escapeValue(value: any): string {
    if (value === null) return "NULL";
    if (typeof value === "number") return String(value);
    if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
    return `'${String(value).replace(/'/g, "''")}'`;
  }
}

export const db = {
  from: (table: string) => createQueryBuilder().from(table),
};

export const storage = {
  from: (bucket: string) => ({
    upload: async (path: string, file: File | Blob, options?: { upsert?: boolean }) => {
      console.warn("Storage not implemented for Neon. Use external storage like Cloudflare R2 or S3.");
      return { data: { path }, error: null };
    },
    getPublicUrl: (path: string) => {
      return { data: { publicUrl: path } };
    },
  }),
};

export { supabase } from "./client";
