import {
  IconChartScatter,
  IconGlobe,
  IconMaximize,
  IconTrendingUp,
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WorldStatsCardsProps {
  population: number
  growthRate: number
  landArea: number
  density: number
}

export function WorldStatsCards({
  population,
  growthRate,
  landArea,
  density,
}: WorldStatsCardsProps) {
  const cards = [
    {
      title: "Estimated Global Headcount",
      value: population.toLocaleString(),
      description: "Live 2026 global population estimate",
      icon: IconGlobe,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      title: "Annual Growth Rate",
      value: `+${growthRate.toFixed(2)}%`,
      description: "~74.5M net growth per year",
      icon: IconTrendingUp,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      title: "Global Land Area",
      value: `${Math.round(landArea).toLocaleString()} km²`,
      description: "Total habitable earth area",
      icon: IconMaximize,
      color: "text-amber-500 bg-amber-500/10",
    },
    {
      title: "Average Global Density",
      value: `${density.toFixed(1)} / km²`,
      description: "Average people per square km",
      icon: IconChartScatter,
      color: "text-purple-500 bg-purple-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card
            key={card.title}
            className="border border-border/40 bg-card/50 backdrop-blur-sm"
          >
            <CardHeader className="flex flex-row items-center justify-between p-5 pb-2">
              <CardTitle className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">
                {card.title}
              </CardTitle>
              <div className={`rounded-none p-2 ${card.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 p-5 pt-0">
              <span className="font-extrabold font-mono text-foreground text-xl sm:text-2xl">
                {card.value}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {card.description}
              </span>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
