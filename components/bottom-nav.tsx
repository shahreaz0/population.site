"use client"

import {
  IconGitCompare,
  IconGridDots,
  IconHome,
  IconSearch,
  IconTrendingUp,
} from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { triggerGlobalSearch } from "@/components/search-dialog"

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: IconHome,
    },
    {
      name: "Rankings",
      href: "/rankings",
      icon: IconTrendingUp,
    },
    {
      name: "Search",
      href: "#search",
      icon: IconSearch,
      isAction: true,
    },
    {
      name: "Density",
      href: "/density",
      icon: IconGridDots,
    },
    {
      name: "Compare",
      href: "/compare",
      icon: IconGitCompare,
    },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-40 border-border/40 border-t bg-background/85 pb-safe-bottom backdrop-blur-md md:hidden">
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = !item.isAction && isActive(item.href)

          const content = (
            <>
              <Icon className="h-5 w-5" />
              <span className="font-medium text-[10px] tracking-tight">
                {item.name}
              </span>
            </>
          )

          const baseClass = `flex flex-1 flex-col items-center justify-center gap-1 py-1 transition-all duration-200 active:scale-95 ${
            active
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`

          if (item.isAction) {
            return (
              <button
                key={item.name}
                type="button"
                onClick={triggerGlobalSearch}
                className={baseClass}
              >
                {content}
              </button>
            )
          }

          return (
            <Link key={item.href} href={item.href} className={baseClass}>
              {content}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
