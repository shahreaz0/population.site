"use client"

import { IconSparkles } from "@tabler/icons-react"
import { Card } from "@/components/ui/card"

interface AdSenseBlockProps {
  slot?: string
  format?: "auto" | "rectangle" | "horizontal" | "vertical"
  className?: string
}

export function AdSenseBlock({
  slot,
  format = "auto",
  className = "",
}: AdSenseBlockProps) {
  // If the user has Google AdSense, they can replace the placeholder below with:
  // <ins className="adsbygoogle"
  //      style={{ display: 'block' }}
  //      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
  //      data-ad-slot={slot}
  //      data-ad-format={format}
  //      data-full-width-responsive="true"></ins>
  // <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>

  const heightClass =
    format === "horizontal"
      ? "h-24"
      : format === "vertical"
        ? "h-[600px] w-[300px]"
        : format === "rectangle"
          ? "h-[250px] w-[300px]"
          : "h-32"

  return (
    <Card
      className={`relative flex select-none flex-col items-center justify-center overflow-hidden border-2 border-muted border-dashed bg-muted/20 p-4 text-center text-muted-foreground ${heightClass} ${className}`}
    >
      <div className="absolute top-2 right-2 flex items-center gap-1 font-semibold text-[10px] text-muted-foreground/60 uppercase tracking-wider">
        <IconSparkles className="h-3 w-3 text-primary" /> Sponsor
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="font-semibold text-muted-foreground/75 text-xs uppercase tracking-widest">
          AdSense Block
        </span>
        <span className="max-w-[240px] text-[10px] text-muted-foreground/50">
          Targeted Advertising Placement Slot {slot || "#default"} ({format})
        </span>
      </div>
    </Card>
  )
}
