import { getServerUser } from "@/lib/auth/session"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { GlassCard } from "@/components/portal/glass-card"
import { Button } from "@/components/ui/button"
import {
  ShoppingBagIcon,
  MapPinIcon,
  CalendarIcon,
  ChevronRightIcon,
  StarIcon,
  ArrowRightIcon,
} from "lucide-react"
import { LoyaltyCardWrapper } from "@/components/portal/loyalty-card-wrapper"

export default async function CustomerOverviewPage() {
  const user = await getServerUser()

  // Fetch fresh profile data for name consistency
  const supabase = await createServerSupabaseClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user?.id)
    .single()

  const fullName =
    profile?.full_name ||
    user?.user_metadata?.full_name?.trim() ||
    user?.user_metadata?.name?.trim() ||
    user?.email?.split("@")[0] ||
    "Guest"

  const firstName = fullName.split(" ")[0] || "Guest"

  const recentOrders = [
    {
      id: "ord-1",
      name: "Caramel Macchiato",
      date: "Yesterday, 9:41 AM",
      price: "$4.50",
      status: "Completed",
    },
    {
      id: "ord-2",
      name: "Avocado Sourdough",
      date: "2 days ago, 11:20 AM",
      price: "$12.00",
      status: "Completed",
    },
    {
      id: "ord-3",
      name: "Cold Brew",
      date: "May 5, 8:15 AM",
      price: "$5.25",
      status: "Completed",
    },
  ]

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background glow - ensures it doesn't block interactions */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-1/3 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="flex flex-col gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl xl:text-6xl">
              Welcome back,{" "}
              <span className="text-primary">
                {firstName}
              </span>
            </h1>

            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              Enjoy your personalized BrewSpace experience.
              Your favorite table is waiting.
            </p>
          </div>
        </section>

        {/* Main Grid */}
        <section className="grid gap-6 xl:grid-cols-12">
          {/* Loyalty Card */}
          <div className="xl:col-span-4">
            <div className="flex w-full justify-center xl:justify-start">
              <LoyaltyCardWrapper
                points={450}
                tier="Gold"
                progress={65}
                nextTierPoints={1000}
              />
            </div>
          </div>

          {/* Right Grid */}
          <div className="grid gap-4 sm:grid-cols-2 xl:col-span-8">
            {/* Orders Quick View */}
            <GlassCard
              hoverEffect
              className="group flex flex-col justify-between p-6 cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <ShoppingBagIcon className="h-6 w-6" />
                </div>

                <div className="text-right">
                  <span className="text-3xl font-black">
                    12
                  </span>

                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Orders
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    Order History
                  </p>

                  <p className="text-sm text-muted-foreground">
                    View your recent caffeine runs
                  </p>
                </div>

                <Link
                  href="/portal/orders"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition-all duration-300 hover:bg-primary/20 hover:translate-x-1"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </GlassCard>

            {/* Reservations Quick View */}
            <GlassCard
              hoverEffect
              className="group flex flex-col justify-between p-6 cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 transition-all duration-300 group-hover:bg-blue-500 group-hover:text-white">
                  <CalendarIcon className="h-6 w-6" />
                </div>

                <div className="text-right">
                  <span className="text-3xl font-black">
                    2
                  </span>

                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Bookings
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    Reservations
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Manage your upcoming visits
                  </p>
                </div>

                <Link
                  href="/portal/reservations"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition-all duration-300 hover:bg-blue-500/20 hover:translate-x-1"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </GlassCard>

            {/* Featured Location / Order Now Action */}
            <GlassCard className="relative overflow-hidden p-6 sm:col-span-2">
              <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-orange-500/5 blur-3xl" />

              <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                    <MapPinIcon className="h-7 w-7" />
                  </div>

                  <div>
                    <p className="text-xl font-bold">
                      Downtown BrewSpace
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <StarIcon className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />

                      <span>
                        4.9 · 1.2k reviews · Favorite spot
                      </span>
                    </div>
                  </div>
                </div>

                <Link href="/portal/orders" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full rounded-xl font-semibold shadow-lg transition-all hover:scale-[1.02] sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Order Now
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Recent Orders List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              Recent Orders
            </h2>

            <Link href="/portal/orders">
              <Button
                variant="ghost"
                className="gap-1 font-medium text-primary hover:bg-primary/10"
              >
                See all
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recentOrders.map((order) => (
              <GlassCard
                key={order.id}
                hoverEffect
                className="group flex flex-col gap-6 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold">
                      {order.name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {order.date}
                    </p>
                  </div>

                  <span className="text-lg font-bold text-primary">
                    {order.price}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />

                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                      {order.status}
                    </span>
                  </div>

                  <Link href="/portal/orders">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-xl px-4 text-xs font-bold transition-all hover:bg-primary hover:text-primary-foreground"
                    >
                      Reorder
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}