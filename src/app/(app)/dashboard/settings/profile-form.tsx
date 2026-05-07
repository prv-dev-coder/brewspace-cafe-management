"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { updateProfile, uploadAvatarImage } from "@/lib/dashboard/actions"
import { CameraIcon, Loader2Icon } from "lucide-react"

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  avatar_url: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileFormProps {
  profile: Record<string, unknown> | null
  user: { email?: string; id?: string } | null
}

export function ProfileForm({ profile, user }: ProfileFormProps) {
  const router = useRouter()
  const [isPending, setIsPending] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [preview, setPreview] = React.useState<string>(
    (profile?.avatar_url as string) || ""
  )

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: (profile?.full_name as string) || "",
      email: user?.email || "",
      avatar_url: (profile?.avatar_url as string) || "",
    },
  })

  async function onSubmit(values: ProfileFormValues) {
    setIsPending(true)
    try {
      const result = await updateProfile(values)
      if (result.success) {
        toast.success("Profile updated successfully")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setIsPending(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Optimistic UI preview
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    setIsUploading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const result = await uploadAvatarImage(formData)
      if (result.success && result.data) {
        form.setValue("avatar_url", result.data.url)
        setPreview(result.data.url)
        toast.success("Avatar uploaded")
        router.refresh()
      } else {
        toast.error(result.success ? "Upload failed" : result.error)
        setPreview((profile?.avatar_url as string) || "")
      }
    } catch {
      toast.error("Avatar upload failed")
      setPreview((profile?.avatar_url as string) || "")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-2 border-border shadow-md">
              <AvatarImage src={preview} alt="Profile picture" />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {(form.getValues("full_name") || "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <label
              htmlFor="avatar-upload"
              className={`absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full transition-opacity cursor-pointer ${
                isUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
              aria-label="Change profile picture"
            >
              {isUploading ? (
                <Loader2Icon className="h-6 w-6 animate-spin" />
              ) : (
                <CameraIcon className="h-6 w-6" />
              )}
              <input
                id="avatar-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isUploading}
              />
            </label>
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Profile Picture</h4>
            <p className="text-xs text-muted-foreground">
              Hover the avatar and click to upload. PNG, JPG or GIF under 2MB.
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="full_name">Full Name</FormLabel>
                <FormControl>
                  <Input
                    id="full_name"
                    placeholder="e.g. Jane Doe"
                    autoComplete="name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input {...field} disabled className="opacity-60" />
                </FormControl>
                <FormDescription>
                  Email is managed via authentication settings.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending || isUploading} className="gap-2 min-w-[130px]">
            {isPending && <Loader2Icon className="h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  )
}
