import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export type BonusType = "normal" | "dls" | "tls" | "dws" | "tws"

const tileVariants = cva(
  "Tile",
  {
    variants: {
      variant: {
        default: "Tile--default",
        interactive: "Tile--interactive",
        disabled: "Tile--disabled",
      },
      size: {
        default: "Tile--default",
        sm: "Tile--sm",
        lg: "Tile--lg",
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
        return "Tile__bonus--dls" // Light blue for Double Letter Score
      case "tls":
        return "Tile__bonus--tls" // Dark blue for Triple Letter Score
      case "dws":
        return "Tile__bonus--dws" // Orange for Double Word Score
      case "tws":
        return "Tile__bonus--tws" // Red for Triple Word Score
      default:
        return ""
    }
  }

  const tileVariant = onClick ? "interactive" : isBlank ? "disabled" : "default"

  return (
    <div className={`Tile__container ${className}`} {...props}>
      {/* Bonus square behind tile (rotated 45 degrees) */}
      {bonus !== "normal" && (
        <div
          className={`Tile__bonus ${getBonusBackgroundColor(bonus)}`}
          style={{ transformOrigin: "center" }}
        />
      )}

      {/* Main tile */}
      <div
        onClick={onClick}
        className={cn(
          tileVariants({ variant: tileVariant, size }),
          "Tile__main"
        )}
      >
        {/* Letter */}
        <span className={`Tile__letter ${isBlank ? "Tile__letter--blank" : ""}`}>
          {letter}
        </span>

        {/* Point value in bottom right */}
        <span className={`Tile__points ${isBlank ? "Tile__points--blank" : ""}`}>
          {isBlank ? "0" : points}
        </span>
      </div>
    </div>
  )
}

export { Tile, tileVariants } 