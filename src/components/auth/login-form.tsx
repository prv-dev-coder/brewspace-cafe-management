"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthField } from "@/components/auth/auth-field"
import { PasswordInput } from "@/components/auth/password-input"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { loginSchema, type LoginSchema } from "@/lib/validations/auth"

export function LoginForm() {
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    const { error } = await supabase.auth.signInWithPassword(values)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("Welcome back to Brewspace")
    router.push("/dashboard")
    router.refresh()
  })

  return (
    <motion.form layout className="space-y-2" onSubmit={onSubmit}>
      <AuthField id="email" label="Email" error={form.formState.errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" placeholder="owner@brewspace.com" {...form.register("email")} />
      </AuthField>

      <AuthField id="password" label="Password" error={form.formState.errors.password?.message}>
        <PasswordInput id="password" autoComplete="current-password" placeholder="Enter your password" {...form.register("password")} />
      </AuthField>

      <div className="flex justify-end">
        <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
          Forgot password?
        </Link>
      </div>

      <Button className="mt-2 w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
      </Button>

      <p className="pt-2 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/signup" className="font-medium text-foreground hover:underline">
          Create an account
        </Link>
      </p>
    </motion.form>
  )
}
