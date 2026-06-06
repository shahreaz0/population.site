import { AdSenseBlock } from "@/components/adsense-block"
import { getAllCountries } from "@/lib/data/countries"
import { CompareWidget } from "./_components/compare-widget"
import { ContinentGrid } from "./_components/continent-grid"
import { EducationalFAQ } from "./_components/educational-faq"
import { Hero } from "./_components/hero"
import { QuickNavigation } from "./_components/quick-nav"
import { RankingsPreview } from "./_components/rankings-preview"
import { TopSearches } from "./_components/top-searches"

export default async function Home() {
  const allCountries = await getAllCountries()

  // Cleaned list for the comparison dropdown (name, slug, flag)
  const selectorCountries = allCountries.map((c) => ({
    name: c.name,
    slug: c.slug,
    flag: c.flag,
  }))

  return (
    <div className="flex w-full flex-col gap-2 pb-12">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Quick Navigation */}
      <QuickNavigation />

      {/* 3. Google AdSense Block */}
      <div className="container mx-auto my-4 px-4">
        <AdSenseBlock slot="home-leaderboard" format="horizontal" />
      </div>

      {/* 4. Top 50 Population Searches */}
      <TopSearches />

      {/* 5, 6, 7. Population, Density, and Growth Rankings Sections */}
      <RankingsPreview />

      {/* 8. Continent Population Section */}
      <ContinentGrid />

      {/* 9. Country Comparison Tool */}
      <CompareWidget countries={selectorCountries} />

      {/* 10. Educational Content Section */}
      <EducationalFAQ />
    </div>
  )
}
