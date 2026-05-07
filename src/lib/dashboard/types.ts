export type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  email: string | null
  role: 'admin' | 'staff' | 'customer'
  created_at: string
}

export type Category = {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export type MenuItem = {
  id: string
  category_id: string | null
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_available: boolean
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock'
  created_at: string
  updated_at: string
  category?: Category
}

export type InventoryItem = {
  id: string
  item_name: string
  quantity: number
  unit: string
  reorder_level: number
  category: string | null
  created_at: string
  updated_at: string
}

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export type Reservation = {
  id: string
  profile_id: string | null
  customer_name: string
  customer_email: string
  customer_phone: string | null
  reservation_time: string
  guest_count: number
  table_number: string | null
  status: ReservationStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export type OrderStatus = 'pending' | 'completed' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'

export type OrderItem = {
  menu_item_id: string
  name: string
  quantity: number
  price: number
}

export type Order = {
  id: string
  profile_id: string | null
  customer_name: string | null
  customer_email: string | null
  total_amount: number
  status: OrderStatus
  payment_status: PaymentStatus
  items: OrderItem[]
  created_at: string
  updated_at: string
}

export type DashboardNotification = {
  id: string
  profile_id: string
  title: string
  message: string
  is_read: boolean
  type: string | null
  created_at: string
}

// Analytics Types
export type RevenueCard = {
  title: string
  value: string
  delta: string
  hint: string
  status: 'neutral' | 'success' | 'warning' | 'error'
}

export type OrdersByDayPoint = {
  day: string
  orders: number
}

export type MonthlyRevenuePoint = {
  month: string
  revenue: number
}

export type CustomerGrowthPoint = {
  month: string
  customers: number
}

export type ReservationBreakdownPoint = {
  name: string
  value: number
}

export type PopularMenuItem = {
  name: string
  orders: number
  share: number
}

export type DashboardAnalyticsData = {
  revenueCards: RevenueCard[]
  ordersByDay: OrdersByDayPoint[]
  monthlyRevenue: MonthlyRevenuePoint[]
  customerGrowth: CustomerGrowthPoint[]
  reservationBreakdown: ReservationBreakdownPoint[]
  popularMenuItems: PopularMenuItem[]
  errors: string[]
}
