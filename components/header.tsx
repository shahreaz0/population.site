"use client"

import {
  IconChevronDown,
  IconGlobe,
  IconMenu2,
  IconMoon,
  IconSearch,
  IconSun,
} from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { triggerGlobalSearch } from "./search-dialog"

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const mainNav = [
    { name: "Home", href: "/" },
    { name: "World Population", href: "/world" },
    { name: "Rankings", href: "/rankings" },
    { name: "Density", href: "/density" },
    { name: "Compare Countries", href: "/compare" },
    { name: "Continents", href: "/continents" },
  ]

  const dropdownCountries = [
    { name: "India Population", href: "/countries/india", flag: "🇮🇳" },
    { name: "China Population", href: "/countries/china", flag: "🇨🇳" },
    {
      name: "United States Population",
      href: "/countries/united-states",
      flag: "🇺🇸",
    },
    { name: "Indonesia Population", href: "/countries/indonesia", flag: "🇮🇩" },
    { name: "Pakistan Population", href: "/countries/pakistan", flag: "🇵🇰" },
    { name: "Nigeria Population", href: "/countries/nigeria", flag: "🇳🇬" },
    { name: "Brazil Population", href: "/countries/brazil", flag: "🇧🇷" },
    {
      name: "Bangladesh Population",
      href: "/countries/bangladesh",
      flag: "🇧🇩",
    },
    { name: "Russia Population", href: "/countries/russia", flag: "🇷🇺" },
    { name: "Mexico Population", href: "/countries/mexico", flag: "🇲🇽" },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-border/40 border-b bg-background/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 transition-colors duration-200"
        >
          <div className="rounded-none border border-primary/20 bg-primary/10 p-2 text-primary transition-all duration-200 group-hover:bg-primary/20">
            <IconGlobe className="h-5 w-5 animate-pulse" />
          </div>
          <span className="bg-linear-to-r from-primary to-emerald-500 bg-clip-text font-bold text-lg text-transparent tracking-tight">
            Population.site
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 font-medium text-sm md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative py-1 transition-colors hover:text-foreground/90 ${
                isActive(item.href)
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {item.name}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-none bg-primary" />
              )}
            </Link>
          ))}

          {/* Countries Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 font-medium text-muted-foreground text-sm hover:text-foreground"
                >
                  Countries <IconChevronDown className="h-4 w-4" />
                </Button>
              }
            />
            <DropdownMenuContent
              align="end"
              className="max-h-[400px] w-56 overflow-y-auto"
            >
              {dropdownCountries.map((c) => (
                <DropdownMenuItem
                  key={c.href}
                  render={
                    <Link
                      href={c.href}
                      className="flex w-full cursor-pointer items-center gap-2"
                    />
                  }
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </DropdownMenuItem>
              ))}
              <div className="my-1 h-px bg-muted" />
              <DropdownMenuItem
                render={
                  <Link
                    href="/countries"
                    className="w-full cursor-pointer text-center font-semibold text-primary"
                  />
                }
              >
                View All Countries
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Icon */}
          <Button
            variant="ghost"
            size="icon"
            onClick={triggerGlobalSearch}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Search countries"
          >
            <IconSearch className="h-4 w-4" />
          </Button>
        </nav>

        {/* Action Buttons (Search, Theme, Mobile Toggle) */}
        <div className="flex items-center gap-2">
          {/* Search trigger */}
          <Button
            variant="outline"
            size="sm"
            onClick={triggerGlobalSearch}
            className="hidden h-9 w-40 items-center justify-between rounded-none border-muted/50 bg-muted/30 text-muted-foreground text-xs sm:flex"
          >
            <span className="flex items-center gap-1.5">
              <IconSearch className="h-3.5 w-3.5" />
              Search countries...
            </span>
            <kbd className="pointer-events-none select-none rounded-none border bg-background px-1.5 font-medium font-mono text-[10px] opacity-100">
              ⌘K
            </kbd>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={triggerGlobalSearch}
            className="h-9 w-9 text-muted-foreground hover:text-foreground sm:hidden"
            aria-label="Search"
          >
            <IconSearch className="h-5 w-5" />
          </Button>

          {/* Theme Switcher */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            aria-label="Toggle Theme"
          >
            <IconSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <IconMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Mobile Navigation Trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground md:hidden"
                  aria-label="Open menu"
                >
                  <IconMenu2 className="h-5 w-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-72 sm:w-80">
              <SheetTitle className="mb-6 bg-linear-to-r from-primary to-emerald-500 bg-clip-text text-left font-bold text-lg text-transparent">
                Population.site
              </SheetTitle>
              <div className="mt-6 flex flex-col gap-4">
                {mainNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`border-border/20 border-b py-2 font-semibold text-base ${
                      isActive(item.href)
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="mt-4 mb-2 font-semibold text-foreground text-sm">
                  Popular Countries
                </div>
                <div className="grid max-h-[200px] grid-cols-2 gap-2 overflow-y-auto rounded-none border border-border/20 bg-muted/20 p-2">
                  {dropdownCountries.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-1 truncate rounded-none px-1.5 py-1 text-muted-foreground text-xs transition-colors hover:bg-muted/50 hover:text-foreground"
                    >
                      <span>{c.flag}</span>
                      <span className="truncate">{c.name.split(" ")[0]}</span>
                    </Link>
                  ))}
                </div>

                <Link
                  href="/countries"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 rounded-none border border-primary/20 bg-primary/5 py-2.5 text-center font-bold text-primary text-sm transition-all hover:bg-primary/10"
                >
                  View All Countries
                </Link>

                <div className="mt-4 flex items-center justify-center gap-4 text-muted-foreground text-xs">
                  <Link
                    href="/about"
                    onClick={() => setMobileOpen(false)}
                    className="hover:text-foreground hover:underline"
                  >
                    About
                  </Link>
                  <span>•</span>
                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="hover:text-foreground hover:underline"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
