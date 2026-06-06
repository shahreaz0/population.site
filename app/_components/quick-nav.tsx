import {
  IconChartScatter,
  IconDirections,
  IconGitCompare,
  IconListNumbers,
} from "@tabler/icons-react"
import Link from "next/link"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function QuickNavigation() {
  const items = [
    {
      title: "Population Rankings",
      description:
        "Filter and sort the world's nations by total population and demographic shares.",
      href: "/rankings?sortBy=population",
      icon: IconListNumbers,
      color:
        "from-blue-500/10 to-indigo-500/10 text-indigo-500 hover:border-indigo-500/30",
    },
    {
      title: "Population Density",
      description:
        "Discover land-to-population ratios, highlighting high-density and low-density zones.",
      href: "/density",
      icon: IconChartScatter,
      color:
        "from-emerald-500/10 to-teal-500/10 text-emerald-500 hover:border-emerald-500/30",
    },
    {
      title: "Compare Countries",
      description:
        "Compare population growth, birth rates, death rates, and age metrics side-by-side.",
      href: "/compare",
      icon: IconGitCompare,
      color:
        "from-amber-500/10 to-orange-500/10 text-amber-500 hover:border-amber-500/30",
    },
    {
      title: "Continent Analysis",
      description:
        "Analyze continent population metrics, shares of world total, and growth rates.",
      href: "/continents",
      icon: IconDirections,
      color:
        "from-purple-500/10 to-pink-500/10 text-purple-500 hover:border-purple-500/30",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center md:text-left">
        <h2 className="font-bold text-2xl text-foreground tracking-tight">
          Quick Navigation
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Access the core statistics, comparisons, and geographic directories of
          our search engine.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.title}
              href={item.href}
              className="group block h-full"
            >
              <Card
                className={`h-full border border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md group-hover:translate-y-[-2px] ${item.color}`}
              >
                <CardHeader className="flex flex-col gap-3 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-none border border-current/10 bg-radial from-current/5 to-current/10">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <CardTitle className="font-bold text-base text-foreground transition-colors group-hover:text-primary">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-xs leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
