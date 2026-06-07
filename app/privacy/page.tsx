import { IconShieldCheck } from "@tabler/icons-react"
import type { Metadata } from "next"
import { AdSenseBlock } from "@/components/adsense-block"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Privacy Policy - Population.site",
  description:
    "Read our privacy policy to understand how we collect, protect, and use user information on Population.site.",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-extrabold text-3xl text-foreground tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground text-sm">Last Updated: June 2026</p>
      </div>

      <Card className="border border-border/40 bg-card/50 p-6 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center gap-3 p-0 pb-4 text-primary">
          <IconShieldCheck className="h-5 w-5" />
          <CardTitle className="font-bold text-base text-foreground">
            User Data Protection Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-0 text-muted-foreground text-sm leading-relaxed">
          <p>
            At Population.site, accessible from our web domains, one of our main
            priorities is the privacy of our visitors. This Privacy Policy
            document contains types of information that is collected and
            recorded by Population.site and how we use it.
          </p>

          <h3 className="mt-2 font-semibold text-foreground text-xs uppercase tracking-wider">
            Log Files
          </h3>
          <p>
            Population.site follows a standard procedure of using log files.
            These files log visitors when they visit websites. The information
            collected by log files includes internet protocol (IP) addresses,
            browser type, Internet Service Provider (ISP), date and time stamp,
            referring/exit pages, and possibly the number of clicks. These are
            not linked to any information that is personally identifiable.
          </p>

          <h3 className="mt-2 font-semibold text-foreground text-xs uppercase tracking-wider">
            Cookies & Web Beacons
          </h3>
          <p>
            Like any other website, Population.site uses "cookies". These
            cookies are used to store information including visitors'
            preferences, and the pages on the website that the visitor accessed
            or visited. The information is used to optimize the users'
            experience by customizing our web page content based on visitors'
            browser type and/or other information.
          </p>

          <h3 className="mt-2 font-semibold text-foreground text-xs uppercase tracking-wider">
            Google DoubleClick DART Cookie
          </h3>
          <p>
            Google is one of the third-party vendors on our site. It also uses
            cookies, known as DART cookies, to serve ads to our site visitors
            based upon their visit to our site and other sites on the internet.
          </p>

          <h3 className="mt-2 font-semibold text-foreground text-xs uppercase tracking-wider">
            Consent
          </h3>
          <p>
            By using our website, you hereby consent to our Privacy Policy and
            agree to its Terms and Conditions.
          </p>
        </CardContent>
      </Card>

      <AdSenseBlock slot="privacy-bottom" format="horizontal" />
    </div>
  )
}
