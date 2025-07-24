import { render, screen, fireEvent } from '@testing-library/react'
import { Tile } from '@/components/ui/tile'

describe('Tile Component', () => {
  describe('Basic Rendering', () => {
    it('renders a tile with letter and points', () => {
      render(<Tile letter="A" points={1} />)
      
      expect(screen.getByText('A')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('renders high-value letters correctly', () => {
      render(<Tile letter="Q" points={10} />)
      
      expect(screen.getByText('Q')).toBeInTheDocument()
      expect(screen.getByText('10')).toBeInTheDocument()
    })

    it('applies default styling classes', () => {
      const { container } = render(<Tile letter="A" points={1} />)
      const tileElement = container.firstChild as HTMLElement
      
      expect(tileElement).toHaveClass('relative')
      expect(tileElement.querySelector('div')).toHaveClass(
        'relative', 'w-12', 'h-12', 'rounded-sm', 'border-2', 'border-amber-800'
      )
    })
  })

  describe('Interactive States', () => {
    it('renders as interactive when onClick is provided', () => {
      const handleClick = jest.fn()
      const { container } = render(
        <Tile letter="A" points={1} onClick={handleClick} />
      )
      const tileElement = container.querySelector('.cursor-pointer')
      expect(tileElement).toBeInTheDocument()
      expect(tileElement).toHaveClass('cursor-pointer')
    })

    it('calls onClick when clicked', () => {
      const handleClick = jest.fn()
      const { container } = render(
        <Tile letter="A" points={1} onClick={handleClick} />
      )
      const tileElement = container.querySelector('.cursor-pointer')
      fireEvent.click(tileElement!)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('renders as non-interactive when no onClick is provided', () => {
      const { container } = render(<Tile letter="A" points={1} />)
      const tileElement = container.querySelector('.cursor-pointer')
      expect(tileElement).toBeNull()
    })
  })

  describe('Blank Tiles', () => {
    it('renders blank tile with correct styling', () => {
      const { container } = render(<Tile letter="A" points={1} isBlank={true} />)
      
      // Should show "0" for points
      expect(screen.getByText('0')).toBeInTheDocument()
      
      // Should have blank indicator
      const blankIndicator = container.querySelector('.bg-red-500')
      expect(blankIndicator).toBeInTheDocument()
      
      // Should have opacity styling
      const tileElement = container.querySelector('div[class*="opacity-75"]')
      expect(tileElement).toBeInTheDocument()
    })

    it('shows blank indicator dot', () => {
      const { container } = render(<Tile letter="A" points={1} isBlank={true} />)
      
      const blankIndicator = container.querySelector('.bg-red-500.rounded-full')
      expect(blankIndicator).toBeInTheDocument()
    })
  })

  describe('Bonus Tiles', () => {
    it('renders Double Letter Score bonus correctly', () => {
      const { container } = render(<Tile letter="A" points={1} bonus="dls" />)
      
      const bonusElement = container.querySelector('.bg-sky-200')
      expect(bonusElement).toBeInTheDocument()
    })

    it('renders Triple Letter Score bonus correctly', () => {
      const { container } = render(<Tile letter="A" points={1} bonus="tls" />)
      
      const bonusElement = container.querySelector('.bg-blue-600')
      expect(bonusElement).toBeInTheDocument()
    })

    it('does not render bonus background for normal tiles', () => {
      const { container } = render(<Tile letter="A" points={1} bonus="normal" />)
      
      const bonusElement = container.querySelector('.bg-sky-200, .bg-blue-600')
      expect(bonusElement).not.toBeInTheDocument()
    })

    it('applies correct bonus background colors', () => {
      const { container: dlsContainer } = render(
        <Tile letter="A" points={1} bonus="dls" />
      )
      const { container: tlsContainer } = render(
        <Tile letter="A" points={1} bonus="tls" />
      )
      
      expect(dlsContainer.querySelector('.bg-sky-200')).toBeInTheDocument()
      expect(tlsContainer.querySelector('.bg-blue-600')).toBeInTheDocument()
    })
  })

  describe('Size Variants', () => {
    it('renders default size correctly', () => {
      const { container } = render(<Tile letter="A" points={1} size="default" />)
      
      const tileElement = container.querySelector('div[class*="w-12 h-12"]')
      expect(tileElement).toBeInTheDocument()
    })

    it('renders small size correctly', () => {
      const { container } = render(<Tile letter="A" points={1} size="sm" />)
      
      const tileElement = container.querySelector('div[class*="w-8 h-8"]')
      expect(tileElement).toBeInTheDocument()
    })

    it('renders large size correctly', () => {
      const { container } = render(<Tile letter="A" points={1} size="lg" />)
      
      const tileElement = container.querySelector('div[class*="w-16 h-16"]')
      expect(tileElement).toBeInTheDocument()
    })
  })

  describe('Complex Scenarios', () => {
    it('handles blank tile with bonus', () => {
      const { container } = render(
        <Tile letter="A" points={1} bonus="dls" isBlank={true} />
      )
      
      // Should show bonus background
      expect(container.querySelector('.bg-sky-200')).toBeInTheDocument()
      
      // Should show "0" for points
      expect(screen.getByText('0')).toBeInTheDocument()
      
      // Should show blank indicator
      expect(container.querySelector('.bg-red-500')).toBeInTheDocument()
    })

    it('handles interactive blank tile with bonus', () => {
      const handleClick = jest.fn()
      const { container } = render(
        <Tile 
          letter="A" 
          points={1} 
          bonus="tls" 
          isBlank={true} 
          onClick={handleClick} 
        />
      )
      // Should be interactive
      const tileElement = container.querySelector('.cursor-pointer')
      expect(tileElement).toBeInTheDocument()
      // Should show bonus background
      expect(container.querySelector('.bg-blue-600')).toBeInTheDocument()
      // Should show blank indicator
      expect(container.querySelector('.bg-red-500')).toBeInTheDocument()
      // Should be clickable
      fireEvent.click(tileElement!)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('renders letter prominently', () => {
      render(<Tile letter="A" points={1} />)
      
      const letterElement = screen.getByText('A')
      expect(letterElement).toHaveClass('text-amber-900', 'font-bold')
    })

    it('renders points in bottom right corner', () => {
      const { container } = render(<Tile letter="A" points={1} />)
      
      const pointsElement = container.querySelector('.absolute.bottom-0\\.5.right-0\\.5')
      expect(pointsElement).toBeInTheDocument()
      expect(pointsElement).toHaveTextContent('1')
    })
  })

  describe('Styling Consistency', () => {
    it('applies consistent amber colour scheme', () => {
      const { container } = render(<Tile letter="A" points={1} />)
      
      const tileElement = container.querySelector('div[class*="border-amber-800"]')
      expect(tileElement).toBeInTheDocument()
      
      const letterElement = screen.getByText('A')
      expect(letterElement).toHaveClass('text-amber-900')
      
      const pointsElement = screen.getByText('1')
      expect(pointsElement).toHaveClass('text-amber-800')
    })

    it('applies gradient background styling', () => {
      const { container } = render(<Tile letter="A" points={1} />)
      
      const tileElement = container.querySelector('div[style*="background-image"]')
      expect(tileElement).toBeInTheDocument()
    })
  })

  describe('Letter Values', () => {
    it('displays correct letter values', () => {
      render(<Tile letter="A" points={1} />)
      
      const pointValue = screen.getByText('1')
      expect(pointValue).toBeInTheDocument()
      expect(pointValue).toHaveClass('absolute', 'bottom-0.5', 'right-0.5')
    })

    it('displays high-value letters correctly', () => {
      render(<Tile letter="Q" points={10} />)
      
      const pointValue = screen.getByText('10')
      expect(pointValue).toBeInTheDocument()
    })

    it('shows zero for blank tiles', () => {
      render(<Tile letter="A" points={1} isBlank={true} />)
      
      const pointValue = screen.getByText('0')
      expect(pointValue).toBeInTheDocument()
    })
  })
}) 