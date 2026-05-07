"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, CalendarDays, ShoppingBag, Users } from "lucide-react"
import { useTheme } from "next-themes"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { WidgetShell } from "@/components/dashboard/analytics/widget-shell"
import { ChartContainer } from "@/components/dashboard/analytics/chart-container"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { DashboardAnalyticsData } from "@/lib/dashboard/types"

const reservationColors = ["#3b82f6", "#8b5cf6", "#f43f5e"]

type AnalyticsOverviewProps = {
  data: DashboardAnalyticsData
}

export function AnalyticsOverview({ data }: AnalyticsOverviewProps) {
  const { resolvedTheme } = useTheme()
  const axisColor = resolvedTheme === "dark" ? "#a1a1aa" : "#52525b"
  const gridColor = resolvedTheme === "dark" ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)"
  
  const tooltipStyle =
    resolvedTheme === "dark"
      ? { backgroundColor: "rgba(24,24,27,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }
      : { backgroundColor: "rgba(255,255,255,0.95)", border: "1px solid rgba(0,0,0,0.09)", borderRadius: "12px" }

  const hasOrdersData = (data.ordersByDay?.length ?? 0) > 0 && data.ordersByDay.some((point) => point.orders > 0)
  const hasRevenueData = (data.monthlyRevenue?.length ?? 0) > 0 && data.monthlyRevenue.some((point) => point.revenue > 0)
  const hasCustomerData = (data.customerGrowth?.length ?? 0) > 0 && data.customerGrowth.some((point) => point.customers > 0)
  const hasMenuData = (data.popularMenuItems?.length ?? 0) > 0
  const hasReservationData = (data.reservationBreakdown?.length ?? 0) > 0 && data.reservationBreakdown.some((point) => point.value > 0)

  return (
    <div className="space-y-5">
      {data.errors?.length > 0 && (
        <div className="rounded-2xl border border-amber-500/35 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200">
          Some analytics sources are temporarily unavailable: {data.errors.join(" | ")}
        </div>
      )}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {data.revenueCards?.map((card, index) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.22, ease: "easeOut" }}
            className="rounded-2xl border border-white/25 bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/45"
          >
            <p className="text-xs text-muted-foreground">{card.title}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{card.value}</p>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <Badge variant="secondary" className="rounded-full">
                {card.delta}
              </Badge>
              <span className="text-muted-foreground">{card.hint}</span>
            </div>
          </motion.article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-12">
        <WidgetShell
          title="Revenue Trend"
          description="Monthly revenue trajectory across all channels"
          className="xl:col-span-7"
          action={
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowUpRight className="size-3.5" />
              +21.4%
            </span>
          }
        >
          <div className="h-72 w-full min-w-0">
            {hasRevenueData ? (
              <ChartContainer height="100%">
                <AreaChart data={data.monthlyRevenue}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={gridColor} />
                  <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis
                    tick={{ fill: axisColor, fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => {
                      const n = typeof value === 'number' ? value : 0
                      return [`$${n.toLocaleString()}`, "Revenue"]
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.2} fill="url(#revenueFill)" animationDuration={1000} />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
                No revenue data yet
              </div>
            )}
          </div>
        </WidgetShell>

        <WidgetShell title="Reservation Analytics" description="Current reservation quality mix" className="xl:col-span-5">
          <div className="h-72 w-full min-w-0">
            {hasReservationData ? (
              <ChartContainer height="100%">
                <PieChart>
                  <Pie
                    data={data.reservationBreakdown}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={66}
                    outerRadius={94}
                    paddingAngle={4}
                    animationDuration={1000}
                  >
                    {data.reservationBreakdown?.map((entry, index) => (
                      <Cell key={entry.name} fill={reservationColors[index % reservationColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => {
                      const n = typeof value === 'number' ? value : 0
                      return [`${n}%`, "Share"]
                    }}
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
                No reservation analytics yet
              </div>
            )}
          </div>
          <div className="mt-1 grid grid-cols-3 gap-2 text-xs">
            {data.reservationBreakdown?.map((item, index) => (
              <div key={item.name} className="rounded-xl bg-background/70 p-2 dark:bg-black/20">
                <div className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: reservationColors[index % reservationColors.length] }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <p className="mt-1 font-semibold">{item.value}%</p>
              </div>
            ))}
          </div>
        </WidgetShell>
      </section>

      <section className="grid gap-4 xl:grid-cols-12">
        <WidgetShell
          title="Orders Analytics"
          description="Total fulfilled orders by day"
          className="xl:col-span-5"
          action={<ShoppingBag className="size-4 text-muted-foreground" />}
        >
          <div className="h-64 w-full min-w-0">
            {hasOrdersData ? (
              <ChartContainer height="100%">
                <BarChart data={data.ordersByDay}>
                  <CartesianGrid vertical={false} stroke={gridColor} />
                  <XAxis dataKey="day" tick={{ fill: axisColor, fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: axisColor, fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="orders" radius={[10, 10, 0, 0]} fill="#8b5cf6" animationDuration={1000} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
                No orders yet
              </div>
            )}
          </div>
        </WidgetShell>

        <WidgetShell
          title="Customer Growth"
          description="Monthly active customer growth"
          className="xl:col-span-4"
          action={<Users className="size-4 text-muted-foreground" />}
        >
          <div className="h-64 w-full min-w-0">
            {hasCustomerData ? (
              <ChartContainer height="100%">
                <LineChart data={data.customerGrowth}>
                  <CartesianGrid vertical={false} stroke={gridColor} />
                  <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: axisColor, fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="customers"
                    stroke="#22c55e"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#22c55e" }}
                    activeDot={{ r: 5 }}
                    animationDuration={1000}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
                No customer growth data yet
              </div>
            )}
          </div>
        </WidgetShell>

        <WidgetShell
          title="Popular Menu Items"
          description="Top selling products this week"
          className="xl:col-span-3"
          action={<CalendarDays className="size-4 text-muted-foreground" />}
        >
          {hasMenuData ? (
            <div className="space-y-3">
              {data.popularMenuItems?.map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground">{item.orders} orders</p>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted/70">
                    <div
                      className={cn("h-full rounded-full bg-blue-500 transition-all duration-500")}
                      style={{ width: `${item.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
              No menu insights yet
            </div>
          )}
        </WidgetShell>
      </section>
    </div>
  )
}
