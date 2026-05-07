"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthField } from "@/components/auth/auth-field"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { forgotPasswordSchema, type ForgotPasswordSchema } from "@/lib/validations/auth"

export function ForgotPasswordForm() {
  const supabase = createBrowserSupabaseClient()
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  const onSubmit = form.handleSubmit(async ({ email }) => {
    const origin = window.location.origin
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/reset-password`,
    })

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("Password reset link sent. Check your inbox.")
    form.reset()
  })

  return (
    <form className="space-y-2" onSubmit={onSubmit}>
      <AuthField id="email" label="Email" error={form.formState.errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" placeholder="owner@brewspace.com" {...form.register("email")} />
      </AuthField>

      <Button className="mt-2 w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Sending link..." : "Send reset link"}
      </Button>

      <p className="pt-2 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  )
}
