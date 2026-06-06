import { IconScale } from "@tabler/icons-react"
import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Terms of Service - Population.site",
  description:
    "Read our terms of service and conditions of use for Population.site.",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-extrabold text-3xl text-foreground tracking-tight">
          Terms of Service
        </h1>
        <p className="text-muted-foreground text-sm">Last Updated: June 2026</p>
      </div>

      <Card className="border border-border/40 bg-card/50 p-6 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center gap-3 p-0 pb-4 text-primary">
          <IconScale className="h-5 w-5" />
          <CardTitle className="font-bold text-base text-foreground">
            Conditions of Use
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-0 text-muted-foreground text-sm leading-relaxed">
          <p>
            Welcome to Population.site! These terms and conditions outline the
            rules and regulations for the use of Population.site's Website.
          </p>

          <h3 className="mt-2 font-semibold text-foreground text-xs uppercase tracking-wider">
            Licensing
          </h3>
          <p>
            Unless otherwise stated, Population.site and/or its licensors own
            the intellectual property rights for all material on
            Population.site. All intellectual property rights are reserved. You
            may access this from Population.site for your own personal use
            subjected to restrictions set in these terms and conditions.
          </p>

          <h3 className="mt-2 font-semibold text-foreground text-xs uppercase tracking-wider">
            User Restrictions
          </h3>
          <p>You must not:</p>
          <ul className="flex list-inside list-disc flex-col gap-1.5 pl-2">
            <li>
              Republish material or datasets from Population.site without clear
              attribution.
            </li>
            <li>
              Sell, rent, or sub-license raw database entries from
              Population.site.
            </li>
            <li>
              Reproduce, duplicate, or copy census reports for commercial
              redistribution.
            </li>
            <li>
              Use automated scripts or scrapers to strain the web platform
              servers.
            </li>
          </ul>

          <h3 className="mt-2 font-semibold text-foreground text-xs uppercase tracking-wider">
            Liability Disclaimer
          </h3>
          <p>
            The demographic data, population numbers, projections, and reports
            are provided "as is" without any guarantees of accuracy or validity.
            Use of this data is done at your own risk.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
