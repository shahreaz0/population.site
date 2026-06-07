import Link from "next/link"
import { getAllCountries } from "@/lib/data/countries"

export async function TopSearches() {
  const countries = await getAllCountries()
  // Take the top 50 countries by population and sort them alphabetically
  const top50 = countries
    .slice(0, 50)
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center md:text-left">
        <h2 className="font-bold text-foreground text-xl tracking-tight">
          Top 50 Population Searches
        </h2>
        <p className="mt-1 text-muted-foreground text-xs">
          Quick access to the most queried countries in our population search
          directory.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
        {top50.map((c) => (
          <Link
            key={c.slug}
            href={`/countries/${c.slug}`}
            className="flex items-center gap-2 rounded-none px-3 py-1.5 text-muted-foreground text-sm transition-all hover:bg-muted hover:font-medium hover:text-foreground"
          >
            <span className="text-base leading-none">{c.flag}</span>
            <span>{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
