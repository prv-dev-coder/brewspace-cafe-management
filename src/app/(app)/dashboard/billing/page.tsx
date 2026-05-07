import { SectionHeader } from "@/components/dashboard/section-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  CreditCardIcon, 
  CheckCircle2Icon, 
  ZapIcon,
  BuildingIcon,
  ArrowRightIcon,
  ReceiptIcon
} from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Perfect for new cafes getting started.",
    features: ["Up to 50 orders/month", "1 staff account", "Basic analytics", "Email support"],
    current: true,
    cta: "Current Plan",
    variant: "outline" as const,
  },
  {
    name: "Growth",
    price: "$29",
    period: "per month",
    description: "For growing cafes with steady traffic.",
    features: ["Unlimited orders", "5 staff accounts", "Advanced analytics", "Realtime inventory", "Priority support"],
    current: false,
    cta: "Upgrade to Growth",
    variant: "default" as const,
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per month",
    description: "For high-volume multi-location cafes.",
    features: ["Everything in Growth", "Unlimited staff", "Custom integrations", "SLA guarantee", "Dedicated account manager"],
    current: false,
    cta: "Contact Sales",
    variant: "outline" as const,
  },
]

const recentInvoices = [
  { id: "INV-001", date: "Apr 1, 2026", amount: "$0.00", status: "paid", plan: "Starter" },
  { id: "INV-002", date: "Mar 1, 2026", amount: "$0.00", status: "paid", plan: "Starter" },
  { id: "INV-003", date: "Feb 1, 2026", amount: "$0.00", status: "paid", plan: "Starter" },
]

export default function BillingPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <SectionHeader
        title="Billing & Plans"
        description="Manage your subscription and review payment history."
      />

      {/* Current Plan Banner */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ZapIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Plan</p>
            <p className="text-xl font-bold">Starter — Free</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="rounded-full px-3">Active</Badge>
          <Button variant="outline" size="sm" className="gap-2">
            <CreditCardIcon className="h-4 w-4" />
            Manage Billing
          </Button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={
              plan.highlight
                ? "border-primary/40 bg-primary/5 shadow-lg shadow-primary/10 relative"
                : "border-border/50 bg-card/50 backdrop-blur-sm"
            }
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="rounded-full px-3 shadow-sm">Most Popular</Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                {plan.current && (
                  <Badge variant="outline" className="ml-auto rounded-full text-xs">Current</Badge>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted-foreground">/{plan.period}</span>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle2Icon className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.variant}
                className="w-full gap-2"
                disabled={plan.current}
              >
                {plan.cta}
                {!plan.current && <ArrowRightIcon className="h-4 w-4" />}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Invoice History */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <ReceiptIcon className="h-5 w-5 text-muted-foreground" />
          Invoice History
        </h2>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {recentInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <ReceiptIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{invoice.id}</p>
                      <p className="text-xs text-muted-foreground">{invoice.date} · {invoice.plan}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-sm">{invoice.amount}</span>
                    <Badge
                      variant="outline"
                      className="rounded-full capitalize bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    >
                      {invoice.status}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-xs h-7">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
