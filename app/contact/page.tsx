import { IconMail, IconMapPin } from "@tabler/icons-react"
import type { Metadata } from "next"
import { AdSenseBlock } from "@/components/adsense-block"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export const metadata: Metadata = {
  title: "Contact Us - Population.site",
  description:
    "Get in touch with the team behind Population.site for advertising, data corrections, and partnership inquiries.",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-extrabold text-3xl text-foreground tracking-tight">
          Contact Us
        </h1>
        <p className="text-muted-foreground text-sm">
          Have corrections or partnership inquiries? Send us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Contact form card */}
        <Card className="border border-border/40 bg-card/50 p-6 backdrop-blur-sm">
          <form className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-name"
                  className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider"
                >
                  Name
                </label>
                <Input
                  id="contact-name"
                  type="text"
                  placeholder="Your name"
                  required
                  className="border-input/60"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-email"
                  className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider"
                >
                  Email
                </label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="email@example.com"
                  required
                  className="border-input/60"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="contact-subject"
                className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider"
              >
                Subject
              </label>
              <Input
                id="contact-subject"
                type="text"
                placeholder="How can we help?"
                required
                className="border-input/60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="contact-message"
                className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider"
              >
                Message
              </label>
              <Textarea
                id="contact-message"
                placeholder="Type your message here..."
                rows={5}
                required
                className="border-input/60"
              />
            </div>

            <Button
              type="button"
              className="mt-2 h-11 w-full font-semibold shadow-sm"
            >
              Send Message
            </Button>
          </form>
        </Card>

        {/* Office details */}
        <div className="mt-2 flex flex-col justify-center gap-6 text-muted-foreground text-xs sm:flex-row">
          <div className="flex items-center gap-2">
            <IconMail className="h-4 w-4 text-primary" />
            <span>contact@population.site</span>
          </div>
          <div className="flex items-center gap-2">
            <IconMapPin className="h-4 w-4 text-primary" />
            <span>San Francisco, CA, USA</span>
          </div>
        </div>

        <AdSenseBlock slot="contact-bottom" format="horizontal" />
      </div>
    </div>
  )
}
