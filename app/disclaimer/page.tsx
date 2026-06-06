import { IconAlertTriangle } from "@tabler/icons-react"
import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Disclaimer - Population.site",
  description:
    "Read our disclaimer regarding the accuracy, validity, and usage of demographic projections and statistics.",
}

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-extrabold text-3xl text-foreground tracking-tight">
          Disclaimer
        </h1>
        <p className="text-muted-foreground text-sm">Last Updated: June 2026</p>
      </div>

      <Card className="border border-border/40 bg-card/50 p-6 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center gap-3 p-0 pb-4 text-primary">
          <IconAlertTriangle className="h-5 w-5" />
          <CardTitle className="font-bold text-base text-foreground">
            Demographics Data Disclaimer
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-0 text-muted-foreground text-sm leading-relaxed">
          <p>
            If you require any more information or have any questions about our
            site's disclaimer, please feel free to contact us by email at
            contact@population.site.
          </p>

          <h3 className="mt-2 font-semibold text-foreground text-xs uppercase tracking-wider">
            Disclaimers for Population.site
          </h3>
          <p>
            All the information on this website - Population.site - is published
            in good faith and for general information purpose only.
            Population.site does not make any warranties about the completeness,
            reliability, and accuracy of this information. Any action you take
            upon the information you find on this website is strictly at your
            own risk. Population.site will not be liable for any losses and/or
            damages in connection with the use of our website.
          </p>

          <h3 className="mt-2 font-semibold text-foreground text-xs uppercase tracking-wider">
            External Hyperlinks
          </h3>
          <p>
            From our website, you can visit other websites by following
            hyperlinks to such external sites. While we strive to provide only
            quality links to useful and ethical websites, we have no control
            over the content and nature of these sites. These links to other
            websites do not imply a recommendation for all the content found on
            these sites. Site owners and content may change without notice and
            may occur before we have the opportunity to remove a link which may
            have gone 'bad'.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
