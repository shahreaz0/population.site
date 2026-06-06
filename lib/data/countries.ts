import { STATIC_COUNTRIES } from "./static-countries"

export interface CountryData {
  name: string
  slug: string
  code2: string
  code3: string
  continent: string
  capital: string
  area: number
  population2026: number
  growthRate: number // %
  birthRate: number // per 1000
  deathRate: number // per 1000
  medianAge: number
  urbanPopulationPercent: number // %
  flag: string
  historical: { year: number; population: number }[]
}

let cachedCountries: CountryData[] | null = null

// Normalizes name into a URL friendly slug
export function getSlug(name: string): string {
  const overrides: Record<string, string> = {
    "united states": "united-states",
    "united kingdom": "united-kingdom",
    "congo (drc)": "congo-drc",
    "democratic republic of the congo": "congo-drc",
    "republic of the congo": "congo-republic",
    "south korea": "south-korea",
    "north korea": "north-korea",
    "saudi arabia": "saudi-arabia",
    "south africa": "south-africa",
    "new zealand": "new-zealand",
  }

  const normalized = name.toLowerCase().trim()
  if (overrides[normalized]) return overrides[normalized]

  return normalized
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export async function loadCountries(): Promise<CountryData[]> {
  if (cachedCountries) {
    return cachedCountries
  }

  // Map static countries to the CountryData schema
  const data: CountryData[] = STATIC_COUNTRIES.map((sc) => ({
    name: sc.name,
    slug: sc.slug,
    code2: sc.code2,
    code3: sc.code3,
    continent: sc.continent,
    capital: sc.capital,
    area: sc.area,
    population2026: sc.population2026,
    growthRate: sc.growthRate,
    birthRate: sc.birthRate,
    deathRate: sc.deathRate,
    medianAge: sc.medianAge,
    urbanPopulationPercent: sc.urbanPopulationPercent,
    flag: sc.flag,
    historical: sc.historical,
  }))

  data.sort((a, b) => b.population2026 - a.population2026)
  cachedCountries = data
  return cachedCountries
}

// Queries
export async function getAllCountries(): Promise<CountryData[]> {
  return loadCountries()
}

export async function getCountryBySlug(
  slug: string
): Promise<CountryData | undefined> {
  const countries = await loadCountries()
  return countries.find((c) => c.slug === slug)
}

export async function getRankings(
  category:
    | "population"
    | "density"
    | "growth"
    | "birth"
    | "death"
    | "age"
    | "urban" = "population"
): Promise<CountryData[]> {
  const countries = await loadCountries()
  const sorted = [...countries]

  if (category === "population") {
    sorted.sort((a, b) => b.population2026 - a.population2026)
  } else if (category === "density") {
    sorted.sort((a, b) => {
      const densityA = a.population2026 / a.area
      const densityB = b.population2026 / b.area
      return densityB - densityA
    })
  } else if (category === "growth") {
    sorted.sort((a, b) => b.growthRate - a.growthRate)
  } else if (category === "birth") {
    sorted.sort((a, b) => b.birthRate - a.birthRate)
  } else if (category === "death") {
    sorted.sort((a, b) => b.deathRate - a.deathRate)
  } else if (category === "age") {
    sorted.sort((a, b) => b.medianAge - a.medianAge)
  } else if (category === "urban") {
    sorted.sort((a, b) => b.urbanPopulationPercent - a.urbanPopulationPercent)
  }

  return sorted
}

export interface ContinentStats {
  name: string
  slug: string
  population: number
  area: number
  countriesCount: number
  averageDensity: number
  averageGrowthRate: number
  sharePercent: number
}

export async function getContinentStats(
  continentName?: string
): Promise<ContinentStats[]> {
  const countries = await loadCountries()
  const continents = [
    "Asia",
    "Africa",
    "Europe",
    "North America",
    "South America",
    "Oceania",
  ]

  const totalWorldPop = countries.reduce(
    (acc, curr) => acc + curr.population2026,
    0
  )

  const statsMap = continents.map((name) => {
    const continentCountries = countries.filter(
      (c) => c.continent.toLowerCase() === name.toLowerCase()
    )
    const population = continentCountries.reduce(
      (sum, c) => sum + c.population2026,
      0
    )
    const area = continentCountries.reduce((sum, c) => sum + c.area, 0)
    const countriesCount = continentCountries.length
    const averageDensity = area > 0 ? population / area : 0

    const totalGrowth = continentCountries.reduce(
      (sum, c) => sum + c.growthRate,
      0
    )
    const averageGrowthRate =
      countriesCount > 0 ? totalGrowth / countriesCount : 0
    const sharePercent =
      totalWorldPop > 0 ? (population / totalWorldPop) * 100 : 0

    return {
      name,
      slug: getSlug(name),
      population,
      area,
      countriesCount,
      averageDensity,
      averageGrowthRate,
      sharePercent,
    }
  })

  if (continentName) {
    return statsMap.filter((c) => c.slug === getSlug(continentName))
  }

  return statsMap.sort((a, b) => b.population - a.population)
}

export interface WorldStats {
  population2026: number
  growthRate: number // estimate
  landArea: number
  averageDensity: number
  topCountries: {
    name: string
    slug: string
    population: number
    flag: string
  }[]
}

export async function getWorldStats(): Promise<WorldStats> {
  const countries = await loadCountries()
  const population2026 = countries.reduce((acc, c) => acc + c.population2026, 0)
  const landArea = countries.reduce((acc, c) => acc + c.area, 0)
  const averageDensity = landArea > 0 ? population2026 / landArea : 0

  // Standard world growth rate is ~0.9% to 1.0% in 2026
  const growthRate = 0.91

  const topCountries = countries.slice(0, 5).map((c) => ({
    name: c.name,
    slug: c.slug,
    population: c.population2026,
    flag: c.flag,
  }))

  return {
    population2026,
    growthRate,
    landArea,
    averageDensity,
    topCountries,
  }
}

export async function generateAISummary(country: CountryData): Promise<string> {
  const all = await loadCountries()
  const globalIndex = all.findIndex((c) => c.slug === country.slug) + 1
  const worldShare = (
    (country.population2026 /
      all.reduce((sum, c) => sum + c.population2026, 0)) *
    100
  ).toFixed(2)
  const density = (country.population2026 / country.area).toFixed(1)

  let densityCategory = "moderate"
  const densVal = parseFloat(density)
  if (densVal > 500) densityCategory = "extremely high"
  else if (densVal > 200) densityCategory = "high"
  else if (densVal < 30) densityCategory = "low"

  const growthDescription =
    country.growthRate > 2.0
      ? "rapidly expanding"
      : country.growthRate > 0.5
        ? "steadily growing"
        : country.growthRate > 0
          ? "nearly flat/stagnant"
          : "contracting"

  const _ageDescription =
    country.medianAge < 20
      ? "exceptionally young demographic profile, indicating a high potential for future growth"
      : country.medianAge < 30
        ? "healthy, young population structure supporting economic growth"
        : country.medianAge < 40
          ? "mature age structure facing typical urban shifts"
          : "rapidly aging society with rising median age concerns"

  const pop1960Obj = country.historical.find((h) => h.year === 1960)
  const pop1960 = pop1960Obj ? pop1960Obj.population : 0
  const historicalIncrease =
    pop1960 > 0
      ? (((country.population2026 - pop1960) / pop1960) * 100).toFixed(0)
      : "0"

  return `
    <p class="mb-4 text-foreground/80 leading-relaxed">
      In 2026, <strong>${country.name}</strong> stands as the <strong>#${globalIndex}</strong> most populous country globally, holding an estimated population of <strong>${country.population2026.toLocaleString()}</strong>. This represents approximately <strong>${worldShare}%</strong> of the entire global human population.
    </p>
    <p class="mb-4 text-foreground/80 leading-relaxed">
      Spanning an area of <strong>${country.area.toLocaleString()} sq km</strong>, the country registers a population density of <strong>${density} people/sq km</strong>, categorized as <strong>${densityCategory}</strong>. Demographically, the nation exhibits a <strong>${growthDescription}</strong> trajectory, expanding at a growth rate of <strong>${country.growthRate}%</strong> per annum. This growth is sustained by a birth rate of <strong>${country.birthRate} per 1,000</strong> people and a death rate of <strong>${country.deathRate} per 1,000</strong>.
    </p>
    <p class="mb-4 text-foreground/80 leading-relaxed">
      Historical data reveals a transformation since 1960, when the population was recorded at <strong>${pop1960.toLocaleString()}</strong>. Over these six decades, ${country.name} has experienced a <strong>${historicalIncrease}% increase</strong> in overall headcount. Currently, the society shows a median age of <strong>${country.medianAge} years</strong> and exhibits a <strong>${country.urbanPopulationPercent}% urbanization rate</strong>, meaning that a ${country.urbanPopulationPercent > 50 ? "majority" : "minority"} of residents dwell in major urban areas.
    </p>
  `.trim()
}
