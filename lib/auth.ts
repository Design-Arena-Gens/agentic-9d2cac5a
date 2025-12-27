export function validatePassword(password: string): boolean {
  // In production, this would check against a secure auth system
  const adminPassword = process.env.ADMIN_PASSWORD || 'chess2024admin';
  return password === adminPassword;
}

export function setAuthCookie(response: Response) {
  // Simple cookie-based auth for demo
  const headers = new Headers(response.headers);
  headers.set('Set-Cookie', 'auth=authenticated; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function checkAuth(request: Request): boolean {
  const cookies = request.headers.get('cookie') || '';
  return cookies.includes('auth=authenticated');
}
