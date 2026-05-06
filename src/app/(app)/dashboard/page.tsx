import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getServerUser, getUserRole } from "@/lib/auth/session"

export default async function DashboardPage() {
  const user = await getServerUser()
  const role = getUserRole(user) ?? "owner"

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <header>
        <p className="text-sm text-muted-foreground">Premium Cafe Platform</p>
        <h1 className="text-3xl font-semibold">Dashboard Overview</h1>
      </header>

      <Card className="border-white/20 bg-white/60 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Welcome
            <Badge variant="secondary">{role}</Badge>
          </CardTitle>
          <CardDescription>
            Session persistence and protected routing are active. This shell is ready for admin and customer modules.
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
  )
}
