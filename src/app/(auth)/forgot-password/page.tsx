import { AuthShell } from "@/components/auth/auth-shell"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Reset password" subtitle="Get a secure reset link delivered to your email.">
      <ForgotPasswordForm />
    </AuthShell>
  )
}
