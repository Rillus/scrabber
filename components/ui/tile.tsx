import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export type BonusType = "normal" | "dls" | "tls"

const tileVariants = cva(
  "relative w-12 h-12 rounded-sm border-2 border-amber-800 font-bold text-lg bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200 shadow-md transition-all duration-200",
  {
    variants: {
      variant: {
        default: "hover:shadow-lg",
        interactive: "cursor-pointer hover:scale-105 hover:shadow-lg",
        disabled: "cursor-default opacity-75",
      },
      size: {
        default: "w-12 h-12 text-lg",
        sm: "w-8 h-8 text-sm",
        lg: "w-16 h-16 text-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface TileProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tileVariants> {
  letter: string
  points: number
  bonus?: BonusType
  isBlank?: boolean
  onClick?: () => void
}

function Tile({ 
  letter, 
  points, 
  bonus = "normal", 
  isBlank = false, 
  onClick, 
  className = "",
  size,
  ...props 
}: TileProps) {
  const getBonusBackgroundColor = (bonus: BonusType) => {
    switch (bonus) {
      case "dls":
        return "bg-sky-200" // Light blue for Double Letter Score
      case "tls":
        return "bg-blue-600" // Dark blue for Triple Letter Score
      default:
        return ""
    }
  }

  const tileVariant = onClick ? "interactive" : isBlank ? "disabled" : "default"

  return (
    <div className={`relative ${className}`} {...props}>
      {/* Bonus square behind tile (rotated 45 degrees) */}
      {bonus !== "normal" && (
        <div
          className={`absolute inset-0 w-12 h-12 transform rotate-45 ${getBonusBackgroundColor(bonus)} -z-10`}
          style={{ transformOrigin: "center" }}
        />
      )}

      {/* Main tile */}
      <div
        onClick={onClick}
        className={cn(
          tileVariants({ variant: tileVariant, size }),
          "relative"
        )}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(217, 119, 6, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, rgba(245, 158, 11, 0.05) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(245, 158, 11, 0.05) 25%, transparent 25%)
          `,
          backgroundSize: "100% 100%, 100% 100%, 8px 8px, 8px 8px",
        }}
      >
        {/* Letter */}
        <span className="text-amber-900 font-bold leading-none flex items-center justify-center h-full">
          {letter}
        </span>

        {/* Point value in bottom right */}
        <span className="absolute bottom-0.5 right-0.5 text-xs font-semibold text-amber-800 leading-none">
          {isBlank ? "0" : points}
        </span>

        {/* Blank indicator */}
        {isBlank && (
          <div className="absolute top-0 left-0 w-2 h-2 bg-red-500 rounded-full transform -translate-x-1 -translate-y-1" />
        )}
      </div>
    </div>
  )
}

export { Tile, tileVariants } 