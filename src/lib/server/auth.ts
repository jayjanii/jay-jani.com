/**
 * Admin API routes expect `Authorization: Bearer <password>` where the password
 * matches `ADMIN_PASSWORD` in the Cloudflare environment (not committed).
 */
export function checkAdminAuth(request: Request, adminPassword: string): boolean {
  return request.headers.get('Authorization') === `Bearer ${adminPassword}`;
}
