"use client"

import dynamic from "next/dynamic"
import { memo, useState, useEffect } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer } from "@/components/dashboard/analytics/chart-container"

// ========================================
// DYNAMIC RECHARTS IMPORTS
// ========================================

const AreaChart = dynamic(
  () => import("recharts").then((mod) => mod.AreaChart),
  { ssr: false }
)

const Area = dynamic(
  () => import("recharts").then((mod) => mod.Area),
  { ssr: false }
)

const XAxis = dynamic(
  () => import("recharts").then((mod) => mod.XAxis),
  { ssr: false }
)

const YAxis = dynamic(
  () => import("recharts").then((mod) => mod.YAxis),
  { ssr: false }
)

const CartesianGrid = dynamic(
  () =>
    import("recharts").then(
      (mod) => mod.CartesianGrid
    ),
  { ssr: false }
)

const Tooltip = dynamic(
  () => import("recharts").then((mod) => mod.Tooltip),
  { ssr: false }
)

// ========================================
// TYPES
// ========================================

interface DashboardChartProps {
  title: string
  description?: string
  data: Record<string, unknown>[]
  index: string
  categories: string[]
  colors?: string[]
  className?: string
  height?: number
}

// ========================================
// COMPONENT
// ========================================

function DashboardChartComponent({
  title,
  description,
  data,
  index,
  categories,
  colors = ["#3b82f6", "#10b981", "#f59e0b"],
  className,
  height = 350,
}: DashboardChartProps) {
  const safeData = Array.isArray(data) ? data : []

  return (
    <Card
      className={`overflow-hidden border-border/50 bg-background/80 backdrop-blur-sm ${className ?? ""}`}
    >
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg font-semibold tracking-tight">
          {title}
        </CardTitle>

        {description && (
          <CardDescription>
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-4">
        <ChartContainer height={height} className="w-full">
          <AreaChart
            data={safeData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              {categories.map((category, idx) => (
                <linearGradient
                  key={category}
                  id={`gradient-${category}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={
                      colors[idx % colors.length]
                    }
                    stopOpacity={0.35}
                  />

                  <stop
                    offset="95%"
                    stopColor={
                      colors[idx % colors.length]
                    }
                    stopOpacity={0}
                  />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
              opacity={0.4}
            />

            <XAxis
              dataKey={index}
              axisLine={false}
              tickLine={false}
              tick={{
                fill:
                  "hsl(var(--muted-foreground))",
                fontSize: 12,
              }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill:
                  "hsl(var(--muted-foreground))",
                fontSize: 12,
              }}
              dx={-10}
            />

            <Tooltip
              contentStyle={{
                backgroundColor:
                  "hsl(var(--background))",
                borderColor:
                  "hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "12px",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.15)",
              }}
              itemStyle={{
                fontWeight: 600,
              }}
              labelStyle={{
                color:
                  "hsl(var(--foreground))",
              }}
            />

            {categories.map((category, idx) => (
              <Area
                key={category}
                type="monotone"
                dataKey={category}
                stroke={
                  colors[idx % colors.length]
                }
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#gradient-${category})`}
                animationDuration={1200}
                activeDot={{
                  r: 5,
                }}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// ========================================
// EXPORT
// ========================================

export const DashboardChart = memo(
  DashboardChartComponent
)