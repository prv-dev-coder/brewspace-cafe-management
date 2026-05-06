import { requireUser, getUserRole } from "@/lib/auth/session"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()
  const role = getUserRole(user) ?? "owner"

  return (
    <DashboardShell
      user={{
        name: (user.user_metadata?.full_name as string | undefined) ?? "Cafe Admin",
        email: user.email ?? "admin@brewspace.com",
        role,
      }}
    >
      {children}
    </DashboardShell>
  )
}
