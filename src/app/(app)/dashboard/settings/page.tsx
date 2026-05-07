import { createServerSupabaseClient } from "@/lib/supabase/server"
import { SectionHeader } from "@/components/dashboard/section-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "./profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserIcon, BuildingIcon, BellIcon, ShieldIcon, PaletteIcon } from "lucide-react"

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single()

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <SectionHeader 
        title="Settings" 
        description="Manage your account preferences and cafe branding."
      />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 border border-border/50">
          <TabsTrigger value="profile" className="gap-2">
            <UserIcon className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="branding" className="gap-2">
            <BuildingIcon className="h-4 w-4" /> Branding
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <PaletteIcon className="h-4 w-4" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <BellIcon className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <ShieldIcon className="h-4 w-4" /> Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile details and avatar.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm profile={profile} user={user} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Cafe Branding</CardTitle>
              <CardDescription>Customize how your cafe appears to customers.</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg mt-4">
              Cafe branding settings coming soon...
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>Choose between light, dark, or system themes.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20">
                <div className="space-y-0.5">
                  <div className="font-medium">Dark Mode</div>
                  <div className="text-xs text-muted-foreground">Enable dark theme for the dashboard.</div>
                </div>
                {/* Theme toggle component would go here */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
