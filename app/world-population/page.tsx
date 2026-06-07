import type { Metadata } from "next"
import WorldPage from "../world/page"

export const revalidate = 86400 // Revalidate once per day (ISR)

export const metadata: Metadata = {
  title: "World Population 2026 - Live Counter & Statistics",
  description:
    "View the live world population counter, historical demographic charts, continent breakdowns, and core statistics on global population growth.",
}

export default WorldPage
