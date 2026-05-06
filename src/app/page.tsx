import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getServerUser } from "@/lib/auth/session"
import { ThemeToggle } from "@/components/theme-toggle"

export default async function Home() {
  const user = await getServerUser()
  if (user) {
    redirect("/dashboard")
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.2),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.2),transparent_35%)]" />
      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>

      <Card className="z-10 w-full max-w-2xl border-white/20 bg-white/50 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/40">
        <CardHeader>
          <CardTitle className="text-3xl">Brewspace Premium</CardTitle>
          <CardDescription>
            Modern authentication foundation for your cafe SaaS platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="flex-1">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/signup">Create account</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
