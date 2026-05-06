"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthField } from "@/components/auth/auth-field"
import { PasswordInput } from "@/components/auth/password-input"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { signupSchema, type SignupSchema } from "@/lib/validations/auth"

export function SignupForm() {
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()
  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  })

  const onSubmit = form.handleSubmit(async ({ fullName, email, password }) => {
    const origin = window.location.origin
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: "owner" },
        emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
      },
    })

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("Account created. Check your inbox for confirmation.")
    router.push("/login")
    router.refresh()
  })

  return (
    <form className="space-y-2" onSubmit={onSubmit}>
      <AuthField id="fullName" label="Full name" error={form.formState.errors.fullName?.message}>
        <Input id="fullName" placeholder="Alex Carter" {...form.register("fullName")} />
      </AuthField>

      <AuthField id="email" label="Email" error={form.formState.errors.email?.message}>
        <Input id="email" placeholder="owner@brewspace.com" {...form.register("email")} />
      </AuthField>

      <AuthField id="password" label="Password" error={form.formState.errors.password?.message}>
        <PasswordInput id="password" placeholder="Create password" {...form.register("password")} />
      </AuthField>

      <AuthField
        id="confirmPassword"
        label="Confirm password"
        error={form.formState.errors.confirmPassword?.message}
      >
        <PasswordInput
          id="confirmPassword"
          placeholder="Confirm password"
          {...form.register("confirmPassword")}
        />
      </AuthField>

      <Button className="mt-2 w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Creating account..." : "Create account"}
      </Button>

      <p className="pt-2 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
