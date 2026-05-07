import { requireUser, getUserRole } from "@/lib/auth/session"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { fetchDashboardNotifications } from "@/lib/dashboard/queries"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()
  const role = getUserRole(user) ?? "owner"
  const notifications = await fetchDashboardNotifications(6)
  
  const supabase = await createServerSupabaseClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single()

  return (
    <DashboardShell
      user={{
        name: profile?.full_name ?? (user.user_metadata?.full_name as string | undefined) ?? "Cafe Admin",
        email: user.email ?? "admin@brewspace.com",
        role,
        avatar_url: profile?.avatar_url as string | undefined,
      }}
      notifications={notifications}
    >
      {children}
    </DashboardShell>
  )
}
