import { getServerUser } from "@/lib/auth/session"
import { GlassCard } from "@/components/portal/glass-card"
import { ProfileForm } from "@/app/(app)/dashboard/settings/profile-form"
import { fetchProfile } from "@/lib/dashboard/queries"

export default async function SettingsPage() {
  const user = await getServerUser()
  const profile = user ? await fetchProfile(user.id) : null

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and profile.</p>
      </div>

      <div className="grid gap-8">
        <GlassCard className="p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            <p className="text-sm text-muted-foreground">Update your personal details and avatar.</p>
          </div>
          {profile && <ProfileForm profile={profile} user={user} />}
        </GlassCard>

        <GlassCard className="p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Preferences</h2>
            <p className="text-sm text-muted-foreground">Customize your app experience.</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive updates about your orders and rewards.</p>
              </div>
              <div className="h-6 w-11 rounded-full bg-primary/20 p-1 relative">
                <div className="absolute right-1 top-1 size-4 rounded-full bg-primary" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div>
                <p className="font-medium">Marketing Communications</p>
                <p className="text-xs text-muted-foreground">Stay informed about new menu items and special offers.</p>
              </div>
              <div className="h-6 w-11 rounded-full bg-white/10 p-1 relative">
                <div className="absolute left-1 top-1 size-4 rounded-full bg-white/40" />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
