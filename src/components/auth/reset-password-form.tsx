"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { AuthField } from "@/components/auth/auth-field"
import { PasswordInput } from "@/components/auth/password-input"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { resetPasswordSchema, type ResetPasswordSchema } from "@/lib/validations/auth"

export function ResetPasswordForm() {
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()
  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  const onSubmit = form.handleSubmit(async ({ password }) => {
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("Password updated successfully.")
    router.push("/dashboard")
    router.refresh()
  })

  return (
    <form className="space-y-2" onSubmit={onSubmit}>
      <AuthField id="password" label="New password" error={form.formState.errors.password?.message}>
        <PasswordInput id="password" placeholder="Enter new password" {...form.register("password")} />
      </AuthField>

      <AuthField
        id="confirmPassword"
        label="Confirm password"
        error={form.formState.errors.confirmPassword?.message}
      >
        <PasswordInput
          id="confirmPassword"
          placeholder="Confirm new password"
          {...form.register("confirmPassword")}
        />
      </AuthField>

      <Button className="mt-2 w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Updating password..." : "Update password"}
      </Button>
    </form>
  )
}
