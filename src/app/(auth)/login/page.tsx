import { redirect } from "next/navigation"
import { AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/components/auth/login-form"
import { getServerUser } from "@/lib/auth/session"

export default async function LoginPage() {
  const user = await getServerUser()
  if (user) {
    redirect("/dashboard")
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to manage your premium cafe operations.">
      <LoginForm />
    </AuthShell>
  )
}
