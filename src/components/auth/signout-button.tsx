"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"

export function SignOutButton() {
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success("Signed out successfully")
    router.push("/login")
    router.refresh()
  }

  return (
    <Button variant="outline" onClick={handleSignOut}>
      Sign out
    </Button>
  )
}
