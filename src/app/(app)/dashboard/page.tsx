import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SignOutButton } from "@/components/auth/signout-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { getServerUser, getUserRole } from "@/lib/auth/session"

export default async function DashboardPage() {
  const user = await getServerUser()
  const role = getUserRole(user) ?? "owner"

  return (
    <main className="min-h-screen bg-background p-4 sm:p-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Premium Cafe Platform</p>
            <h1 className="text-3xl font-semibold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SignOutButton />
          </div>
        </header>

        <Card className="border-white/20 bg-white/50 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Welcome
              <Badge variant="secondary">{role}</Badge>
            </CardTitle>
            <CardDescription>
              Session persistence and protected routing are active. This is ready for role-based expansion.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Signed in as <span className="font-medium text-foreground">{user?.email ?? "unknown user"}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Role metadata source: <code>user.app_metadata.role</code>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
