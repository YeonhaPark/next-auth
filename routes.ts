export const publicRoutes = ["/"];

/**
 * These routes will redirect logged in users to the settings page.
 */
export const authRoutes = ["/auth/login", "/auth/error", "/auth/register"];

/**
 * The prefix for API authentication routes.
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after a successful login.
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
