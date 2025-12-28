/**
 * List of protected routes that require authentication
 * Only routes starting with these paths will redirect to login if not authenticated
 */
const PROTECTED_ROUTES = [
  '/customer', // All customer pages
  '/carts',    // Cart page (if it requires auth)
];

/**
 * List of public routes that should never redirect to login
 * These routes are always accessible without authentication
 */
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify',
  '/auth/send-otp',
  '/auth/verify-otp',
  '/auth/resend-otp',
  '/auth/login-or-register',
  '/auth/otp-verify',
  '/refund-request',
  '/email/new-lab-reports-available-23-08-25',
  '/notifications/unsubscribe',
];

/**
 * Check if a given pathname is a protected route
 * @param {string} pathname - The pathname to check
 * @returns {boolean} - True if the route is protected, false otherwise
 */
export const isProtectedRoute = (pathname) => {
  if (!pathname) return false;
  
  // Check if it's a public route first
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return false;
  }
  
  // Check if it's a protected route
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
};

/**
 * Check if a given pathname is a public route
 * @param {string} pathname - The pathname to check
 * @returns {boolean} - True if the route is public, false otherwise
 */
export const isPublicRoute = (pathname) => {
  if (!pathname) return true;
  return !isProtectedRoute(pathname);
};

