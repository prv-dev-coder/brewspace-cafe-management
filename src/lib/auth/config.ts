export const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"]

export const DEFAULT_AUTH_REDIRECT = "/dashboard"
export const DEFAULT_POST_SIGNOUT_REDIRECT = "/login"

export const PROTECTED_ROUTE_PREFIXES = ["/dashboard"]

export const APP_ROLES = ["owner", "manager", "staff"] as const
