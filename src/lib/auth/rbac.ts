import type { AppRole } from "@/lib/auth/session"

type Permission = "analytics:read" | "staff:manage" | "menu:edit"

const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
  owner: ["analytics:read", "staff:manage", "menu:edit"],
  manager: ["analytics:read", "staff:manage"],
  staff: ["analytics:read"],
}

export const hasPermission = (role: AppRole | null, permission: Permission) =>
  role ? ROLE_PERMISSIONS[role].includes(permission) : false
