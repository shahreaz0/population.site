import type { MetadataRoute } from "next"
import { getAllCountries, getContinentStats } from "@/lib/data/countries"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://population.site"

  // Core static & SEO pages
  const baseRoutes = [
    "",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/compare",
    "/density",
    "/rankings",
    "/world",
    "/world-population",
    "/countries-by-population",
    "/population-density-by-country",
    "/fastest-growing-countries",
    "/countries-losing-population",
    "/population-by-continent",
    "/largest-cities-in-the-world",
    "/birth-rate-by-country",
    "/death-rate-by-country",
    "/urban-population-by-country",
    "/rural-population-by-country",
    "/median-age-by-country",
    "/population-growth-rate-by-country",
  ]

  const sitemapItems: MetadataRoute.Sitemap = baseRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : 0.8,
  }))

  // Add all Continent details
  const continents = await getContinentStats()
  for (const c of continents) {
    sitemapItems.push({
      url: `${baseUrl}/continents/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    })
  }

  // Add all Country details
  const countries = await getAllCountries()
  for (const c of countries) {
    sitemapItems.push({
      url: `${baseUrl}/countries/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.6,
    })
  }

  return sitemapItems
}
