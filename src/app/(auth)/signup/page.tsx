import { redirect } from "next/navigation"
import { AuthShell } from "@/components/auth/auth-shell"
import { SignupForm } from "@/components/auth/signup-form"
import { getServerUser } from "@/lib/auth/session"

export default async function SignupPage() {
  const user = await getServerUser()
  if (user) {
    redirect("/dashboard")
  }

  return (
    <AuthShell
      title="Create account"
      subtitle="Start running your premium cafe with secure, scalable operations."
    >
      <SignupForm />
    </AuthShell>
  )
}
