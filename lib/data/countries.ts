import { cacheLife } from "next/cache"
import { STATIC_CITIES, type StaticCity } from "./static-cities"
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

interface RestCountryItem {
  name: { common: string; official: string }
  cca2: string
  cca3: string
  capital?: string[]
  continents?: string[]
  area?: number
  population?: number
  flag?: string
}

interface WBIndicatorItem {
  indicator: { id: string; value: string }
  country: { id: string; value: string }
  countryiso3code: string
  date: string
  value: number | null
  unit: string
  obs_status: string
  decimal: number
}

async function fetchDynamicCountriesData(): Promise<CountryData[]> {
  try {
    // 1. Fetch REST Countries API (timeout 6s)
    const restCountriesPromise = fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca2,cca3,capital,continents,area,population,flag",
      { signal: AbortSignal.timeout(6000) }
    ).then((r) => r.json() as Promise<RestCountryItem[]>)

    // 2. Fetch World Bank Population History (timeout 10s)
    const wbHistoryPromise = fetch(
      "https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&date=1960:2023&per_page=17000",
      { signal: AbortSignal.timeout(10000) }
    ).then((r) => r.json() as Promise<[unknown, WBIndicatorItem[]]>)

    // 3. Fetch World Bank Growth Rate (2022-2023)
    const wbGrowthPromise = fetch(
      "https://api.worldbank.org/v2/country/all/indicator/SP.POP.GROW?format=json&date=2022:2023&per_page=1000",
      { signal: AbortSignal.timeout(6000) }
    ).then((r) => r.json() as Promise<[unknown, WBIndicatorItem[]]>)

    // 4. Fetch World Bank Birth Rate
    const wbBirthPromise = fetch(
      "https://api.worldbank.org/v2/country/all/indicator/SP.DYN.CBRT.IN?format=json&date=2022:2023&per_page=1000",
      { signal: AbortSignal.timeout(6000) }
    ).then((r) => r.json() as Promise<[unknown, WBIndicatorItem[]]>)

    // 5. Fetch World Bank Death Rate
    const wbDeathPromise = fetch(
      "https://api.worldbank.org/v2/country/all/indicator/SP.DYN.CDRT.IN?format=json&date=2022:2023&per_page=1000",
      { signal: AbortSignal.timeout(6000) }
    ).then((r) => r.json() as Promise<[unknown, WBIndicatorItem[]]>)

    // 6. Fetch World Bank Urban Population %
    const wbUrbanPromise = fetch(
      "https://api.worldbank.org/v2/country/all/indicator/SP.URB.TOTL.IN.ZS?format=json&date=2022:2023&per_page=1000",
      { signal: AbortSignal.timeout(6000) }
    ).then((r) => r.json() as Promise<[unknown, WBIndicatorItem[]]>)

    const [
      restCountries,
      wbHistoryRaw,
      wbGrowthRaw,
      wbBirthRaw,
      wbDeathRaw,
      wbUrbanRaw,
    ] = await Promise.all([
      restCountriesPromise,
      wbHistoryPromise,
      wbGrowthPromise,
      wbBirthPromise,
      wbDeathPromise,
      wbUrbanPromise,
    ])

    // Extract the arrays from World Bank response (second index)
    const wbHistory = Array.isArray(wbHistoryRaw) ? wbHistoryRaw[1] : []
    const wbGrowth = Array.isArray(wbGrowthRaw) ? wbGrowthRaw[1] : []
    const wbBirth = Array.isArray(wbBirthRaw) ? wbBirthRaw[1] : []
    const wbDeath = Array.isArray(wbDeathRaw) ? wbDeathRaw[1] : []
    const wbUrban = Array.isArray(wbUrbanRaw) ? wbUrbanRaw[1] : []

    // Map by country code for quick lookup
    const restCountriesMap = new Map<string, RestCountryItem>()
    if (Array.isArray(restCountries)) {
      for (const c of restCountries) {
        if (c.cca3) restCountriesMap.set(c.cca3, c)
      }
    }

    // Map World Bank history by country ISO3 code
    const wbHistoryMap = new Map<string, WBIndicatorItem[]>()
    if (Array.isArray(wbHistory)) {
      for (const item of wbHistory) {
        const code = item.countryiso3code
        if (code && item.value !== null && item.value !== undefined) {
          const list = wbHistoryMap.get(code) || []
          list.push(item)
          wbHistoryMap.set(code, list)
        }
      }
    }

    // Helper map for latest single-year indicators
    const getIndicatorMap = (rawList: WBIndicatorItem[]) => {
      const map = new Map<string, number>()
      if (Array.isArray(rawList)) {
        // Sort by date so later years overwrite and remain latest
        const sorted = [...rawList].sort(
          (a, b) => Number(a.date) - Number(b.date)
        )
        for (const item of sorted) {
          const code = item.countryiso3code
          if (code && item.value !== null && item.value !== undefined) {
            map.set(code, Number(item.value))
          }
        }
      }
      return map
    }

    const growthMap = getIndicatorMap(wbGrowth)
    const birthMap = getIndicatorMap(wbBirth)
    const deathMap = getIndicatorMap(wbDeath)
    const urbanMap = getIndicatorMap(wbUrban)

    // Merge static baseline with dynamic data
    const staticCountriesMap = new Map<
      string,
      (typeof STATIC_COUNTRIES)[number]
    >()
    for (const c of STATIC_COUNTRIES) {
      staticCountriesMap.set(c.code3, c)
    }

    const seenSlugs = new Set<string>()
    const merged: CountryData[] = []

    if (Array.isArray(restCountries)) {
      for (const rest of restCountries) {
        if (!rest.cca3) continue

        const staticCountry = staticCountriesMap.get(rest.cca3)
        const historyItems = wbHistoryMap.get(rest.cca3)

        const dynamicName = rest.name?.common || staticCountry?.name || ""
        if (!dynamicName) continue // skip invalid entries

        const dynamicCapital = rest.capital?.[0] || staticCountry?.capital || ""
        const dynamicArea = rest.area || staticCountry?.area || 0
        const dynamicFlag = rest.flag || staticCountry?.flag || ""
        const dynamicContinent =
          rest.continents?.[0] || staticCountry?.continent || "Other"

        // Current population: use REST countries population as base, or WB latest, or static
        const dynamicPop = rest.population || staticCountry?.population2026 || 0

        // Rebuild historical:
        let dynamicHistory: { year: number; population: number }[] = []
        if (historyItems && historyItems.length > 0) {
          const years = [1960, 1970, 1980, 1990, 2000, 2010, 2020]
          const extracted = historyItems
            .filter((h) => years.includes(Number(h.date)))
            .map((h) => ({
              year: Number(h.date),
              population: Number(h.value),
            }))

          // Sort by year
          extracted.sort((a, b) => a.year - b.year)

          // Add 2025 and 2026 to keep same years
          extracted.push({
            year: 2025,
            population: Math.round(dynamicPop * 0.99), // dynamic estimate for 2025
          })
          extracted.push({
            year: 2026,
            population: dynamicPop,
          })

          dynamicHistory = extracted
        } else if (staticCountry) {
          // If no dynamic history found, update the 2026 entry with rest population
          dynamicHistory = staticCountry.historical.map((h) => {
            if (h.year === 2026) {
              return { ...h, population: dynamicPop }
            }
            return h
          })
        } else {
          // Fallback history for completely new countries
          dynamicHistory = [
            { year: 1960, population: Math.round(dynamicPop * 0.3) },
            { year: 1970, population: Math.round(dynamicPop * 0.4) },
            { year: 1980, population: Math.round(dynamicPop * 0.5) },
            { year: 1990, population: Math.round(dynamicPop * 0.65) },
            { year: 2000, population: Math.round(dynamicPop * 0.78) },
            { year: 2010, population: Math.round(dynamicPop * 0.88) },
            { year: 2020, population: Math.round(dynamicPop * 0.96) },
            { year: 2025, population: Math.round(dynamicPop * 0.99) },
            { year: 2026, population: dynamicPop },
          ]
        }

        // Dynamic indicators:
        const growthVal = growthMap.get(rest.cca3)
        const dynamicGrowth =
          growthVal !== undefined
            ? parseFloat(growthVal.toFixed(2))
            : staticCountry?.growthRate || 0

        const birthVal = birthMap.get(rest.cca3)
        const dynamicBirth =
          birthVal !== undefined
            ? parseFloat(birthVal.toFixed(1))
            : staticCountry?.birthRate || 0

        const deathVal = deathMap.get(rest.cca3)
        const dynamicDeath =
          deathVal !== undefined
            ? parseFloat(deathVal.toFixed(1))
            : staticCountry?.deathRate || 0

        const urbanVal = urbanMap.get(rest.cca3)
        const dynamicUrban =
          urbanVal !== undefined
            ? parseFloat(urbanVal.toFixed(1))
            : staticCountry?.urbanPopulationPercent || 0

        const dynamicMedianAge = staticCountry?.medianAge || 29.5

        // Generate unique slug
        let slug = staticCountry?.slug || getSlug(dynamicName)
        if (seenSlugs.has(slug)) {
          slug = `${slug}-${rest.cca3.toLowerCase()}`
        }
        seenSlugs.add(slug)

        merged.push({
          name: dynamicName,
          slug,
          code2: rest.cca2 || staticCountry?.code2 || "",
          code3: rest.cca3,
          continent: dynamicContinent,
          capital: dynamicCapital,
          area: dynamicArea,
          population2026: dynamicPop,
          growthRate: dynamicGrowth,
          birthRate: dynamicBirth,
          deathRate: dynamicDeath,
          medianAge: dynamicMedianAge,
          urbanPopulationPercent: dynamicUrban,
          flag: dynamicFlag,
          historical: dynamicHistory,
        })
      }
      return merged
    } else {
      // Fallback if restCountries is not array
      return STATIC_COUNTRIES.map((c) => ({ ...c }))
    }
  } catch (error) {
    console.error(
      "Failed to fetch dynamic country data from API. Falling back to static data.",
      error
    )
    // Return copy of static data
    return STATIC_COUNTRIES.map((c) => ({ ...c }))
  }
}

export async function loadCountries(): Promise<CountryData[]> {
  "use cache"
  cacheLife("days")

  const data = await fetchDynamicCountriesData()
  data.sort((a, b) => b.population2026 - a.population2026)
  return data
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

  const ageDescription =
    country.medianAge < 20
      ? "exceptionally young demographic profile, indicating high potential for future growth"
      : country.medianAge < 30
        ? "healthy, young population structure supporting economic expansion"
        : country.medianAge < 40
          ? "mature age structure facing typical urban demographic shifts"
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
      Historical data reveals a transformation since 1960, when the population was recorded at <strong>${pop1960.toLocaleString()}</strong>. Over these six decades, ${country.name} has experienced a <strong>${historicalIncrease}% increase</strong> in overall headcount. With a median age of <strong>${country.medianAge} years</strong>, the country reflects a <strong>${ageDescription}</strong>. Currently, a <strong>${country.urbanPopulationPercent}% urbanization rate</strong> means that a ${country.urbanPopulationPercent > 50 ? "majority" : "minority"} of residents dwell in major urban areas.
    </p>
  `.trim()
}

export async function getLargestCities(): Promise<StaticCity[]> {
  "use cache"
  cacheLife("days")

  const countries = await loadCountries()
  const countriesMap = new Map<string, CountryData>()
  for (const c of countries) {
    countriesMap.set(c.slug, c)
  }

  const staticCountriesMap = new Map<
    string,
    (typeof STATIC_COUNTRIES)[number]
  >()
  for (const c of STATIC_COUNTRIES) {
    staticCountriesMap.set(c.slug, c)
  }

  const updatedCities = STATIC_CITIES.map((city) => {
    const dynamicCountry = countriesMap.get(city.countrySlug)
    const staticCountry = staticCountriesMap.get(city.countrySlug)

    let population = city.population2026
    if (dynamicCountry && staticCountry && staticCountry.population2026 > 0) {
      const ratio = dynamicCountry.population2026 / staticCountry.population2026
      population = Math.round(city.population2026 * ratio)
    }

    return {
      ...city,
      country: dynamicCountry?.name || city.country,
      flag: dynamicCountry?.flag || city.flag,
      continent: dynamicCountry?.continent || city.continent,
      population2026: population,
    }
  })

  return updatedCities.sort((a, b) => b.population2026 - a.population2026)
}
