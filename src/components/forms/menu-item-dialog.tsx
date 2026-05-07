"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm, Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Image from "next/image"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { Textarea } from "@/components/ui/textarea"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"

import { Switch } from "@/components/ui/switch"

import { toast } from "sonner"

import {
  Loader2Icon,
  UploadIcon,
  XIcon,
  ImageIcon,
} from "lucide-react"

import {
  upsertMenuItem,
  uploadMenuItemImage,
} from "@/lib/dashboard/actions"

import type {
  MenuItem,
  Category,
} from "@/lib/dashboard/types"

// ─────────────────────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────────────────────

const schema = z.object({
  id: z.string().optional(),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  description: z
    .string()
    .min(3, "Description must be at least 3 characters"),

  price: z.coerce
    .number()
    .min(0, "Price cannot be negative"),

  category_id: z.string().optional().nullable(),

  is_available: z.boolean().default(true),

  stock_status: z.enum([
    "in_stock",
    "low_stock",
    "out_of_stock",
  ]),

  image_url: z.string().optional().nullable(),
})

type FormValues = z.infer<typeof schema>

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface MenuItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: MenuItem | null
  categories: Category[]
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export function MenuItemDialog({
  open,
  onOpenChange,
  item,
  categories,
}: MenuItemDialogProps) {
  const router = useRouter()

  const isEditing = !!item?.id

  const [isPending, setIsPending] = React.useState(false)

  const [imagePreview, setImagePreview] =
    React.useState<string | null>(
      item?.image_url ?? null
    )

  const [isUploading, setIsUploading] =
    React.useState(false)

  const fileInputRef =
    React.useRef<HTMLInputElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<FormValues>,

    defaultValues: {
      id: item?.id,

      name: item?.name ?? "",

      description:
        item?.description ?? "",

      price: item?.price ?? 0,

      category_id:
        item?.category_id ?? null,

      is_available:
        item?.is_available ?? true,

      stock_status:
        (item?.stock_status as FormValues["stock_status"]) ??
        "in_stock",

      image_url:
        item?.image_url ?? null,
    },
  })

  // ───────────────────────────────────────────────────────────
  // Reset form
  // ───────────────────────────────────────────────────────────

  React.useEffect(() => {
    if (open) {
      form.reset({
        id: item?.id,

        name: item?.name ?? "",

        description:
          item?.description ?? "",

        price: item?.price ?? 0,

        category_id:
          item?.category_id ?? null,

        is_available:
          item?.is_available ?? true,

        stock_status:
          (item?.stock_status as FormValues["stock_status"]) ??
          "in_stock",

        image_url:
          item?.image_url ?? null,
      })

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImagePreview(
        item?.image_url ?? null
      )
    }
  }, [open, item, form])

  // ───────────────────────────────────────────────────────────
  // Image Upload
  // ───────────────────────────────────────────────────────────

  const handleImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]

    if (!file) return

    // local preview
    const localUrl =
      URL.createObjectURL(file)

    setImagePreview(localUrl)

    setIsUploading(true)

    const formData = new FormData()

    formData.append("file", file)

    try {
      const result =
        await uploadMenuItemImage(
          formData
        )

      if (!result.success) {
        toast.error(result.error || "Upload failed")
        setImagePreview(item?.image_url ?? null)
      } else if (result.data) {
        form.setValue("image_url", result.data.url)
        setImagePreview(result.data.url)
        toast.success("Image uploaded successfully")
      }
    } catch (error) {
      console.error(error)

      toast.error(
        "Image upload failed"
      )

      setImagePreview(
        item?.image_url ?? null
      )
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    setImagePreview(null)

    form.setValue(
      "image_url",
      null
    )

    if (fileInputRef.current) {
      fileInputRef.current.value =
        ""
    }
  }

  // ───────────────────────────────────────────────────────────
  // Submit
  // ───────────────────────────────────────────────────────────

  const onSubmit = async (
    values: FormValues
  ) => {
    setIsPending(true)

    try {
      const result =
        await upsertMenuItem(
          values
        )

      if (result.success) {
        toast.success(
          result.message ??
            (isEditing
              ? "Item updated successfully"
              : "Item created successfully")
        )

        router.refresh()

        onOpenChange(false)
      } else {
        toast.error(
          result.error
        )
      }
    } catch (error) {
      console.error(error)

      toast.error(
        "An unexpected error occurred"
      )
    } finally {
      setIsPending(false)
    }
  }

  // ───────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Edit Menu Item"
              : "Add Menu Item"}
          </DialogTitle>

          <DialogDescription className="sr-only">
            {isEditing
              ? "Form to edit an existing menu item."
              : "Form to add a new menu item."}
          </DialogDescription>

          <DialogDescription>
            {isEditing
              ? "Update your cafe menu item details."
              : "Create a new menu item for your cafe."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              onSubmit
            )}
            className="space-y-5"
          >
            {/* Image Upload */}
            <div className="space-y-2">
              <span className="text-sm font-medium">
                Item Image
              </span>

              <div className="relative aspect-video w-full overflow-hidden rounded-xl border-2 border-dashed border-border/60 bg-muted/20 group">
                {imagePreview ? (
                  <>
                    <Image
                      src={
                        imagePreview
                      }
                      alt="Item preview"
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                      unoptimized={imagePreview.startsWith(
                        "blob:"
                      )}
                    />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                        disabled={
                          isUploading
                        }
                      >
                        {isUploading ? (
                          <Loader2Icon className="h-4 w-4 animate-spin" />
                        ) : (
                          <UploadIcon className="h-4 w-4" />
                        )}

                        Change
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={
                          removeImage
                        }
                      >
                        <XIcon className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={
                      isUploading
                    }
                    className="flex flex-col items-center justify-center w-full h-full gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isUploading ? (
                      <>
                        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />

                        <span className="text-sm">
                          Uploading...
                        </span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8" />

                        <span className="text-sm font-medium">
                          Click to upload image
                        </span>

                        <span className="text-xs">
                          PNG, JPG, WebP up to
                          5MB
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={
                  handleImageSelect
                }
              />
            </div>

            {/* Name + Price */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({
                  field,
                }) => (
                  <FormItem>
                    <FormLabel htmlFor="item-name">
                      Item Name *
                    </FormLabel>

                    <FormControl>
                      <Input
                        id="item-name"
                        autoComplete="off"
                        placeholder="e.g. Cappuccino"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({
                  field,
                }) => (
                  <FormItem>
                    <FormLabel htmlFor="item-price">
                      Price ($) *
                    </FormLabel>

                    <FormControl>
                      <Input
                        id="item-price"
                        autoComplete="off"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({
                field,
              }) => (
                <FormItem>
                  <FormLabel htmlFor="item-description">
                    Description
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      id="item-description"
                      autoComplete="off"
                      placeholder="Rich espresso with steamed milk and foam..."
                      className="resize-none"
                      rows={3}
                      {...field}
                      value={
                        field.value ??
                        ""
                      }
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category + Stock */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="category_id"
                render={({
                  field,
                }) => (
                  <FormItem>
                    <FormLabel>
                      Category
                    </FormLabel>

                    <Select
                      onValueChange={(
                        val
                      ) =>
                        field.onChange(
                          val ===
                            "__none"
                            ? null
                            : val
                        )
                      }
                      value={
                        field.value ??
                        "__none"
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="__none">
                          No category
                        </SelectItem>

                        {categories.map(
                          (
                            cat
                          ) => (
                            <SelectItem
                              key={
                                cat.id
                              }
                              value={
                                cat.id
                              }
                            >
                              {
                                cat.name
                              }
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock_status"
                render={({
                  field,
                }) => (
                  <FormItem>
                    <FormLabel>
                      Stock Status
                    </FormLabel>

                    <Select
                      onValueChange={
                        field.onChange
                      }
                      value={
                        field.value
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="in_stock">
                          In Stock
                        </SelectItem>

                        <SelectItem value="low_stock">
                          Low Stock
                        </SelectItem>

                        <SelectItem value="out_of_stock">
                          Out Of Stock
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Availability */}
            <FormField
              control={form.control}
              name="is_available"
              render={({
                field,
              }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/50 p-4 bg-muted/20">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Available on
                      Menu
                    </FormLabel>

                    <FormDescription>
                      Customers can
                      see and order
                      this item.
                    </FormDescription>
                  </div>

                  <FormControl>
                    <Switch
                      checked={
                        field.value
                      }
                      onCheckedChange={
                        field.onChange
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Footer */}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  onOpenChange(
                    false
                  )
                }
                disabled={
                  isPending
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  isPending ||
                  isUploading
                }
                className="min-w-[120px]"
              >
                {isPending ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isEditing ? (
                  "Save Changes"
                ) : (
                  "Create Item"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}