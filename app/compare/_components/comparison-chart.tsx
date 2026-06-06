"use client"

import * as React from "react"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ComparisonChartProps {
  countryAName: string
  countryBName: string
  data: { year: number; [key: string]: number }[]
}

export function ComparisonChart({
  countryAName,
  countryBName,
  data,
}: ComparisonChartProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Format numbers for Y-axis (e.g. 500M, 1.4B)
  const formatYAxis = (tick: number) => {
    if (tick >= 1_000_000_000) return `${(tick / 1_000_000_000).toFixed(1)}B`
    if (tick >= 1_000_000) return `${(tick / 1_000_000).toFixed(0)}M`
    return tick.toLocaleString()
  }

  // Custom Tooltip
  // biome-ignore lint/suspicious/noExplicitAny: Recharts Tooltip props
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      return (
        <div className="rounded-none border border-border bg-card p-3 font-sans text-xs shadow-md">
          <p className="mb-1 font-bold text-foreground">
            Year {payload[0].payload.year}
          </p>
          {/* biome-ignore lint/suspicious/noExplicitAny: Recharts Tooltip payload item */}
          {payload.map((p: any) => (
            <p
              key={p.name}
              className="font-mono font-semibold"
              style={{ color: p.color }}
            >
              {p.name}: {p.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (!mounted) {
    return (
      <ComparisonChartSkeleton
        countryAName={countryAName}
        countryBName={countryBName}
      />
    )
  }

  return (
    <Card className="rounded-none border border-border/40 bg-card/50 p-4 shadow-sm backdrop-blur-sm">
      <CardHeader className="p-4 pt-2">
        <CardTitle className="font-bold text-base text-foreground">
          Historical Population Trajectory
        </CardTitle>
        <CardDescription className="text-muted-foreground text-xs">
          Comparing {countryAName} and {countryBName} from 1960 to 2026.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="h-80 w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
            initialDimension={{ width: 300, height: 200 }}
          >
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-muted/40"
              />
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={false}
                className="font-mono font-semibold text-[10px] text-muted-foreground/80"
              />
              <YAxis
                tickFormatter={formatYAxis}
                tickLine={false}
                axisLine={false}
                className="font-mono font-semibold text-[10px] text-muted-foreground/80"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ fontSize: "11px", fontWeight: 600 }}
              />
              <Line
                type="monotone"
                dataKey={countryAName}
                stroke="#6366f1" // Indigo
                strokeWidth={2.5}
                activeDot={{ r: 6 }}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey={countryBName}
                stroke="#10b981" // Emerald
                strokeWidth={2.5}
                activeDot={{ r: 6 }}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function ComparisonChartSkeleton({
  countryAName,
  countryBName,
}: {
  countryAName?: string
  countryBName?: string
}) {
  return (
    <Card className="rounded-none border border-border/40 bg-card/50 p-4 shadow-sm backdrop-blur-sm">
      <CardHeader className="p-4 pt-2">
        <CardTitle className="font-bold text-base text-foreground">
          Historical Population Trajectory
        </CardTitle>
        <CardDescription className="text-muted-foreground text-xs">
          Comparing {countryAName || "Country A"} and{" "}
          {countryBName || "Country B"} from 1960 to 2026.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="h-80 w-full">
          <div className="relative flex h-full w-full flex-col justify-between p-2">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-6">
              <div className="w-full border-muted/10 border-t" />
              <div className="w-full border-muted/10 border-t" />
              <div className="w-full border-muted/10 border-t" />
              <div className="w-full border-muted/10 border-t" />
              <div className="w-full border-muted/10 border-t" />
            </div>

            {/* SVG Line Simulations */}
            <div className="absolute inset-0 flex items-end px-4 py-6">
              <svg
                className="h-full w-full"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-label="Loading comparison chart"
              >
                <title>Loading comparison chart</title>
                <path
                  d="M0,80 Q25,75 50,60 T100,40"
                  className="animate-pulse stroke-indigo-500/20"
                />
                <path
                  d="M0,90 Q25,80 50,55 T100,20"
                  className="animate-pulse stroke-emerald-500/20"
                />
              </svg>
            </div>

            {/* X/Y Axis Placeholder Text */}
            <div className="z-10 flex h-full w-full items-end justify-between font-mono text-[9px] text-muted-foreground/30">
              <span>1960</span>
              <span>1980</span>
              <span>2000</span>
              <span>2020</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
