import { IconGlobe, IconHeart } from "@tabler/icons-react"
import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const categories = [
    {
      title: "Countries",
      links: [
        { name: "China Population", href: "/countries/china" },
        { name: "India Population", href: "/countries/india" },
        { name: "United States Population", href: "/countries/united-states" },
        { name: "Indonesia Population", href: "/countries/indonesia" },
        { name: "Pakistan Population", href: "/countries/pakistan" },
        { name: "View All Countries", href: "/countries", highlight: true },
      ],
    },
    {
      title: "Rankings",
      links: [
        { name: "Population Rankings", href: "/countries-by-population" },
        { name: "Density Rankings", href: "/population-density-by-country" },
        { name: "Growth Rankings", href: "/population-growth-rate-by-country" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "World Population", href: "/world-population" },
        { name: "Population by Continent", href: "/population-by-continent" },
        { name: "Population Statistics", href: "/rankings" },
        { name: "Population API", href: "/about#api" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Disclaimer", href: "/disclaimer" },
      ],
    },
  ]

  return (
    <footer className="w-full border-border/40 border-t bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          {categories.map((cat) => (
            <div key={cat.title} className="flex flex-col gap-4">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">
                {cat.title}
              </h3>
              <ul className="flex flex-col gap-2.5 text-sm">
                {cat.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={`transition-colors hover:text-foreground ${
                        link.highlight
                          ? "font-semibold text-primary hover:text-primary/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mb-8 h-px w-full bg-border/40" />

        <div className="flex flex-col items-center justify-between gap-4 text-muted-foreground text-xs sm:flex-row">
          <div className="flex items-center gap-2">
            <IconGlobe className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">
              Population.site
            </span>
            <span>© {currentYear} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Built with precision &</span>
            <IconHeart className="h-3 w-3 fill-red-500 text-red-500" />
            <span>for global demographics mapping.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
