/** SSL options for managed Postgres (Railway, RDS, etc.). */
export function pgSslOptions(connectionString: string): { rejectUnauthorized: false } | undefined {
  if (/sslmode=require|ssl=true/i.test(connectionString)) {
    return { rejectUnauthorized: false };
  }
  return undefined;
}
