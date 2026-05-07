import "server-only"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import {
  Order,
  MenuItem,
  InventoryItem,
  Reservation,
  Profile,
  Category,
  DashboardAnalyticsData,
  RevenueCard,
  OrdersByDayPoint,
  MonthlyRevenuePoint,
  CustomerGrowthPoint,
  ReservationBreakdownPoint,
} from "./types"

import {
  format,
  subDays,
  subMonths,
  parseISO,
  isValid,
} from "date-fns"

// ========================================
// HELPERS
// ========================================

const getNumber = (val: unknown): number => {
  if (typeof val === "number") return val
  return Number(val) || 0
}

const safeDate = (value: string) => {
  const parsed = parseISO(value)
  return isValid(parsed) ? parsed : new Date()
}

// ========================================
// ORDERS
// ========================================

export async function fetchOrders(limit = 100) {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error(`Failed to fetch orders: ${error.message}`)
      return []
    }
    return (data || []) as Order[]
  } catch (err) {
    console.error(`Unexpected error in fetchOrders:`, err)
    return []
  }
}

export async function fetchOrderById(id: string) {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error(`Failed to fetch order: ${error.message}`)
      return null
    }
    return data as Order
  } catch (err) {
    console.error(`Unexpected error in fetchOrderById:`, err)
    return null
  }
}

// ========================================
// MENU
// ========================================

export async function fetchMenuItems() {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("name", { ascending: true })

    if (error) {
      console.error(`Failed to fetch menu items: ${error.message}`)
      return []
    }
    return (data || []) as MenuItem[]
  } catch (err) {
    console.error(`Unexpected error in fetchMenuItems:`, err)
    return []
  }
}

export async function fetchCategories() {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true })

    if (error) {
      console.error(`Failed to fetch categories: ${error.message}`)
      return []
    }
    return (data || []) as Category[]
  } catch (err) {
    console.error(`Unexpected error in fetchCategories:`, err)
    return []
  }
}

// ========================================
// RESERVATIONS
// ========================================

export async function fetchReservations(status?: string) {
  const supabase = await createServerSupabaseClient()

  let query = supabase
    .from("reservations")
    .select("*")
    .order("reservation_time", { ascending: true })

  if (status) {
    query = query.eq("status", status)
  }

  try {
    const { data, error } = await query

    if (error) {
      console.error(`Failed to fetch reservations: ${error.message}`)
      return []
    }
    return (data || []) as Reservation[]
  } catch (err) {
    console.error(`Unexpected error in fetchReservations:`, err)
    return []
  }
}

// ========================================
// INVENTORY
// ========================================

export async function fetchInventory() {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .order("item_name", { ascending: true })

    if (error) {
      console.error(`Failed to fetch inventory: ${error.message}`)
      return []
    }
    return (data || []) as InventoryItem[]
  } catch (err) {
    console.error(`Unexpected error in fetchInventory:`, err)
    return []
  }
}

// ========================================
// CUSTOMERS
// ========================================

export async function fetchCustomers() {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "customer")
      .order("created_at", { ascending: false })

    if (error) {
      console.error(`Failed to fetch customers: ${error.message}`)
      return []
    }
    return (data || []) as Profile[]
  } catch (err) {
    console.error(`Unexpected error in fetchCustomers:`, err)
    return []
  }
}

// ========================================
// DASHBOARD ANALYTICS
// ========================================

export async function fetchDashboardAnalytics(): Promise<DashboardAnalyticsData> {
  const supabase = await createServerSupabaseClient()

  let ordersRes, reservationsRes, inventoryRes, customersRes
  const errors: string[] = []

  try {
    const results = await Promise.allSettled([
      supabase.from("orders").select("*"),
      supabase.from("reservations").select("*"),
      supabase.from("inventory").select("*"),
      supabase.from("profiles").select("*").eq("role", "customer"),
    ])

    if (results[0].status === "fulfilled") ordersRes = results[0].value
    else errors.push(`Orders: ${results[0].reason}`)

    if (results[1].status === "fulfilled") reservationsRes = results[1].value
    else errors.push(`Reservations: ${results[1].reason}`)

    if (results[2].status === "fulfilled") inventoryRes = results[2].value
    else errors.push(`Inventory: ${results[2].reason}`)

    if (results[3].status === "fulfilled") customersRes = results[3].value
    else errors.push(`Customers: ${results[3].reason}`)

  } catch (err) {
    console.error("Dashboard analytics fetch completely failed", err)
    errors.push("General connection error")
  }

  const orders = ordersRes?.data || []
  const reservations = reservationsRes?.data || []
  const inventory = inventoryRes?.data || []
  const customers = customersRes?.data || []

  // ========================================
  // REVENUE CARDS
  // ========================================

  const totalRevenue = orders.reduce(
    (sum, order) => sum + getNumber(order.total_amount),
    0
  )

  const monthlyRevenueAmount = orders
    .filter((order) => {
      const date = safeDate(order.created_at)
      return date > subMonths(new Date(), 1)
    })
    .reduce(
      (sum, order) => sum + getNumber(order.total_amount),
      0
    )

  const revenueCards: RevenueCard[] = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      delta: "+12%",
      hint: "Overall cafe revenue",
      status: "success",
    },
    {
      title: "Monthly Revenue",
      value: `$${monthlyRevenueAmount.toLocaleString()}`,
      delta: "Last 30 days",
      hint: "Recent revenue performance",
      status: "neutral",
    },
    {
      title: "Confirmed Reservations",
      value: reservations
        .filter((r) => r.status === "confirmed")
        .length.toString(),
      delta: "+8%",
      hint: "Upcoming reservations",
      status: "warning",
    },
    {
      title: "Low Stock Items",
      value: inventory
        .filter(
          (item) =>
            getNumber(item.quantity) <=
            getNumber(item.reorder_level)
        )
        .length.toString(),
      delta: "Action Needed",
      hint: "Items below reorder level",
      status: "error",
    },
  ]

  // ========================================
  // ORDERS BY DAY
  // ========================================

  const ordersByDay: OrdersByDayPoint[] = Array.from({
    length: 7,
  }).map((_, index) => {
    const date = subDays(new Date(), 6 - index)

    const dateKey = format(date, "yyyy-MM-dd")

    const count = orders.filter((order) => {
      return (
        format(
          safeDate(order.created_at),
          "yyyy-MM-dd"
        ) === dateKey
      )
    }).length

    return {
      day: format(date, "EEE"),
      orders: count,
    }
  })

  // ========================================
  // MONTHLY REVENUE
  // ========================================

  const monthlyRevenue: MonthlyRevenuePoint[] = Array.from({
    length: 6,
  }).map((_, index) => {
    const date = subMonths(new Date(), 5 - index)

    const dateKey = format(date, "yyyy-MM")

    const revenue = orders
      .filter((order) => {
        return (
          format(
            safeDate(order.created_at),
            "yyyy-MM"
          ) === dateKey
        )
      })
      .reduce(
        (sum, order) =>
          sum + getNumber(order.total_amount),
        0
      )

    return {
      month: format(date, "MMM"),
      revenue,
    }
  })

  // ========================================
  // CUSTOMER GROWTH
  // ========================================

  const customerGrowth: CustomerGrowthPoint[] = Array.from({
    length: 6,
  }).map((_, index) => {
    const date = subMonths(new Date(), 5 - index)

    const dateKey = format(date, "yyyy-MM")

    const count = customers.filter((customer) => {
      return (
        format(
          safeDate(customer.created_at),
          "yyyy-MM"
        ) <= dateKey
      )
    }).length

    return {
      month: format(date, "MMM"),
      customers: count,
    }
  })

  // ========================================
  // RESERVATION BREAKDOWN
  // ========================================

  const totalReservations = reservations.length || 1

  const reservationBreakdown: ReservationBreakdownPoint[] = [
    {
      name: "Confirmed",
      value: Math.round(
        (reservations.filter((r) => r.status === "confirmed").length /
          totalReservations) *
          100
      ),
    },
    {
      name: "Pending",
      value: Math.round(
        (reservations.filter((r) => r.status === "pending").length /
          totalReservations) *
          100
      ),
    },
    {
      name: "Cancelled",
      value: Math.round(
        (reservations.filter((r) => r.status === "cancelled").length /
          totalReservations) *
          100
      ),
    },
  ]

  return {
    revenueCards,
    ordersByDay,
    monthlyRevenue,
    customerGrowth,
    reservationBreakdown,
    popularMenuItems: [],
    errors,
  }
}

export async function fetchProfile(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return null
  return data as Profile
}

// ========================================
// NOTIFICATIONS
// ========================================

export async function fetchDashboardNotifications(limit = 10) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Failed to fetch notifications:", error)
    return []
  }

  return data || []
}