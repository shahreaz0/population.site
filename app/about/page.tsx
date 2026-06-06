import { IconCode, IconDatabase, IconGlobe } from "@tabler/icons-react"
import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "About Us - Population.site",
  description:
    "Learn about Population.site, our data sources, APIs, methodologies, and the tools we use to build real-time demographic maps.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-extrabold text-3xl text-foreground tracking-tight">
          About Population.site
        </h1>
        <p className="text-muted-foreground text-sm">
          Learn about our mission, data sourcing, and developer API resources.
        </p>
      </div>

      <Card className="border border-border/40 bg-card/50 p-6 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center gap-3 p-0 pb-4">
          <div className="rounded-none bg-primary/10 p-2 text-primary">
            <IconGlobe className="h-5 w-5" />
          </div>
          <CardTitle className="font-bold text-base text-foreground">
            Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 p-0 text-muted-foreground text-sm leading-relaxed">
          <p>
            Population.site is a demographic search engine and statistical
            catalog. Our mission is to make global population statistics,
            densities, and growth rates accessible and easy to understand for
            educators, researchers, and curious minds.
          </p>
          <p>
            By combining static census records with live API feeds from
            international registries, we provide up-to-date demographic
            summaries and visualization charts for all recognized nations and
            territories.
          </p>
        </CardContent>
      </Card>

      <Card className="border border-border/40 bg-card/50 p-6 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center gap-3 p-0 pb-4">
          <div className="rounded-none bg-emerald-500/10 p-2 text-emerald-500">
            <IconDatabase className="h-5 w-5" />
          </div>
          <CardTitle className="font-bold text-base text-foreground">
            Data Sourcing & Accuracy
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 p-0 text-muted-foreground text-sm leading-relaxed">
          <p>
            Our core dataset is compiled from the{" "}
            <strong>REST Countries API</strong>, which pulls details from
            official country registries. Historical records from 1960 to 2026
            are aggregated and modeled from historical surveys, census
            publications, and United Nations DESA (Department of Economic and
            Social Affairs) projections.
          </p>
          <p>
            While we strive for absolute accuracy, live counters and projections
            represent statistical estimates and should not be used as official
            census documents.
          </p>
        </CardContent>
      </Card>

      <Card
        id="api"
        className="border border-border/40 bg-card/50 p-6 backdrop-blur-sm"
      >
        <CardHeader className="flex flex-row items-center gap-3 p-0 pb-4">
          <div className="rounded-none bg-indigo-500/10 p-2 text-indigo-500">
            <IconCode className="h-5 w-5" />
          </div>
          <CardTitle className="font-bold text-base text-foreground">
            Demographics Developer API
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 p-0 text-muted-foreground text-sm leading-relaxed">
          <p>
            Population.site values open data. Developers can query our primary
            API endpoint to fetch country details, flags, and populations in
            JSON format:
          </p>
          <div className="select-all overflow-x-auto rounded-none bg-muted p-4 font-mono text-foreground/80 text-xs">
            GET https://restcountries.com/v3.1/all
          </div>
          <p>
            This public endpoint is free, requires no API keys, supports CORS,
            and is maintained by the open-source community. It returns detailed
            geographic and demographic fields for developer integrations.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
