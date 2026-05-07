"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// ─── Schemas ──────────────────────────────────────────────────────────────────

const MenuItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  category_id: z.string().nullable().optional(),
  is_available: z.boolean().default(true),
  stock_status: z.enum(["in_stock", "low_stock", "out_of_stock"]).default("in_stock"),
  image_url: z.string().optional().nullable(),
})

const InventorySchema = z.object({
  id: z.string().optional(),
  item_name: z.string().min(2, "Name must be at least 2 characters"),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  unit: z.string().min(1, "Unit is required").default("pcs"),
  reorder_level: z.coerce.number().min(0).default(10),
  category: z.string().optional().nullable(),
})

const CategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional().nullable(),
})

const ReservationStatusSchema = z.enum(["pending", "confirmed", "cancelled", "completed"])

const ProfileSchema = z.object({
  full_name: z.string().min(2).optional(),
  avatar_url: z.string().optional(),
})

// ─── Action Result Type ───────────────────────────────────────────────────────

export type ActionResult<T = void> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string }

// ─── Menu Item Actions ────────────────────────────────────────────────────────

export async function upsertMenuItem(
  rawData: unknown
): Promise<ActionResult<{ id: string }>> {
  const parsed = MenuItemSchema.safeParse(rawData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const { id, ...fields } = parsed.data
  const supabase = await createServerSupabaseClient()

  const { data, error } = id
    ? await supabase
        .from("menu_items")
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select("id")
        .single()
    : await supabase
        .from("menu_items")
        .insert(fields)
        .select("id")
        .single()

  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  return { success: true, data: { id: data.id }, message: id ? "Item updated" : "Item created" }
}

export async function deleteMenuItem(id: string): Promise<ActionResult> {
  if (!id) return { success: false, error: "Invalid ID" }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from("menu_items").delete().eq("id", id)

  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  return { success: true, message: "Item deleted" }
}

// ─── Category Actions ─────────────────────────────────────────────────────────

export async function upsertCategory(
  rawData: unknown
): Promise<ActionResult<{ id: string }>> {
  const parsed = CategorySchema.safeParse(rawData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const { id, ...fields } = parsed.data
  const supabase = await createServerSupabaseClient()

  const { data, error } = id
    ? await supabase
        .from("categories")
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select("id")
        .single()
    : await supabase
        .from("categories")
        .insert(fields)
        .select("id")
        .single()

  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  return { success: true, data: { id: data.id } }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  if (!id) return { success: false, error: "Invalid ID" }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  return { success: true }
}

// ─── Inventory Actions ────────────────────────────────────────────────────────

export async function upsertInventoryItem(
  rawData: unknown
): Promise<ActionResult<{ id: string }>> {
  const parsed = InventorySchema.safeParse(rawData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const { id, ...fields } = parsed.data
  const supabase = await createServerSupabaseClient()

  const { data, error } = id
    ? await supabase
        .from("inventory")
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select("id")
        .single()
    : await supabase
        .from("inventory")
        .insert(fields)
        .select("id")
        .single()

  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  return { success: true, data: { id: data.id }, message: id ? "Item updated" : "Item added" }
}

export async function deleteInventoryItem(id: string): Promise<ActionResult> {
  if (!id) return { success: false, error: "Invalid ID" }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from("inventory").delete().eq("id", id)

  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  return { success: true, message: "Item removed" }
}

// ─── Reservation Actions ──────────────────────────────────────────────────────

export async function updateReservationStatus(
  id: string,
  status: string
): Promise<ActionResult> {
  const parsed = ReservationStatusSchema.safeParse(status)
  if (!parsed.success) return { success: false, error: "Invalid status" }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from("reservations")
    .update({ status: parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) return { success: false, error: error.message }

  revalidatePath("/", "layout")
  return { success: true }
}

// ─── Profile Actions ──────────────────────────────────────────────────────────

export async function updateProfile(
  data: Record<string, unknown>
): Promise<ActionResult> {
  const parsed = ProfileSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: "Not authenticated" }

  // 1. Update profiles table
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", user.id)

  if (profileError) return { success: false, error: profileError.message }

  // 2. Sync with Auth metadata so navbar/session sees the change immediately
  const { error: authError } = await supabase.auth.updateUser({
    data: {
      full_name: parsed.data.full_name,
      avatar_url: parsed.data.avatar_url,
    },
  })

  if (authError) {
    console.warn("Auth metadata sync failed:", authError.message)
    // We don't fail the whole action if only auth sync fails, as DB is the source of truth
  }

  // 3. Revalidate multiple paths to ensure stale data is cleared
  revalidatePath("/", "layout")
  revalidatePath("/portal", "layout")
  revalidatePath("/dashboard", "layout")

  return { success: true, message: "Profile updated successfully" }
}

// ─── Image Upload ─────────────────────────────────────────────────────────────

export async function uploadMenuItemImage(
  formData: FormData
): Promise<ActionResult<{ url: string }>> {
  const file = formData.get("file") as File | null
  if (!file) return { success: false, error: "No file provided" }

  const maxSize = 5 * 1024 * 1024 // 5 MB
  if (file.size > maxSize) return { success: false, error: "File size exceeds 5 MB" }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: "Invalid file type. Use JPG, PNG, WebP or GIF." }
  }

  const supabase = await createServerSupabaseClient()
  const ext = file.name.split(".").pop() ?? "jpg"
  const path = `menu-items/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from("menu-images")
    .upload(path, file, { contentType: file.type, upsert: false })

  if (error) return { success: false, error: error.message }

  const { data: urlData } = supabase.storage
    .from("menu-images")
    .getPublicUrl(path)

  return { success: true, data: { url: urlData.publicUrl } }
}

export async function uploadAvatarImage(
  formData: FormData
): Promise<ActionResult<{ url: string }>> {
  const file = formData.get("file") as File | null
  if (!file) return { success: false, error: "No file provided" }

  const maxSize = 2 * 1024 * 1024 // 2 MB
  if (file.size > maxSize) return { success: false, error: "File size exceeds 2 MB" }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: "Invalid file type. Use JPG, PNG, WebP or GIF." }
  }

  const supabase = await createServerSupabaseClient()
  const ext = file.name.split(".").pop() ?? "jpg"
  const path = `avatars/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { contentType: file.type, upsert: false })

  if (error) return { success: false, error: error.message }

  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(path)

  return { success: true, data: { url: urlData.publicUrl } }
}
