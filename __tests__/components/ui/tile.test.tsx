import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tile } from '@/components/ui/tile'

describe('Tile', () => {
  it('renders with default props', () => {
    render(<Tile letter="A" points={1} />)
    const tile = screen.getByText('A')
    expect(tile).toBeInTheDocument()
    expect(tile.closest('.Tile__container')).toHaveClass('Tile__container')
  })

  it('displays letter correctly', () => {
    render(<Tile letter="Z" points={10} />)
    const letter = screen.getByText('Z')
    expect(letter).toBeInTheDocument()
    expect(letter).toHaveClass('Tile__letter')
  })

  it('displays points correctly', () => {
    render(<Tile letter="Q" points={10} />)
    const points = screen.getByText('10')
    expect(points).toBeInTheDocument()
    expect(points).toHaveClass('Tile__points')
  })

  it('handles click events when interactive', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    render(<Tile letter="A" points={1} onClick={handleClick} />)
    
    const tile = screen.getByText('A').closest('.Tile__main')
    await user.click(tile!)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies interactive variant when onClick is provided', () => {
    render(<Tile letter="A" points={1} onClick={() => {}} />)
    const tile = screen.getByText('A').closest('.Tile__main')
    expect(tile).toHaveClass('Tile--interactive')
  })

  it('applies disabled variant when isBlank is true', () => {
    render(<Tile letter="A" points={1} isBlank={true} />)
    const tile = screen.getByText('A').closest('.Tile__main')
    expect(tile).toHaveClass('Tile--disabled')
  })

  it('shows blank indicator when isBlank is true', () => {
    render(<Tile letter="A" points={1} isBlank={true} />)
    const blankIndicator = screen.getByText('A').closest('.Tile__container')?.querySelector('.Tile__blank-indicator')
    expect(blankIndicator).toBeInTheDocument()
  })

  it('shows zero points when isBlank is true', () => {
    render(<Tile letter="A" points={1} isBlank={true} />)
    const pointValue = screen.getByText('0')
    expect(pointValue).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Tile letter="A" points={1} className="custom-tile" />)
    const container = screen.getByText('A').closest('.Tile__container')
    expect(container).toHaveClass('custom-tile')
  })

  it('applies size variants correctly', () => {
    render(<Tile letter="A" points={1} size="sm" />)
    const tile = screen.getByText('A').closest('.Tile__main')
    expect(tile).toHaveClass('Tile--sm')
  })

  describe('Bonus Types', () => {
    it('renders normal bonus correctly', () => {
      render(<Tile letter="A" points={1} bonus="normal" />)
      const bonusElement = screen.getByText('A').closest('.Tile__container')?.querySelector('.Tile__bonus')
      // For normal bonus, the bonus element should not exist
      expect(bonusElement).not.toBeInTheDocument()
    })

    it('renders double letter score bonus correctly', () => {
      render(<Tile letter="A" points={1} bonus="dls" />)
      const bonusElement = screen.getByText('A').closest('.Tile__container')?.querySelector('.Tile__bonus')
      expect(bonusElement).toHaveClass('Tile__bonus--dls')
    })

    it('renders triple letter score bonus correctly', () => {
      render(<Tile letter="A" points={1} bonus="tls" />)
      const bonusElement = screen.getByText('A').closest('.Tile__container')?.querySelector('.Tile__bonus')
      expect(bonusElement).toHaveClass('Tile__bonus--tls')
    })

    it('shows bonus background when bonus is not normal', () => {
      render(<Tile letter="A" points={1} bonus="dls" />)
      const bonusElement = screen.getByText('A').closest('.Tile__container')?.querySelector('.Tile__bonus')
      expect(bonusElement).toBeInTheDocument()
    })
  })

  describe('Letter Values', () => {
    it('displays correct letter values', () => {
      render(<Tile letter="A" points={1} />)
      const pointValue = screen.getByText('1')
      expect(pointValue).toBeInTheDocument()
      expect(pointValue).toHaveClass('Tile__points')
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

  describe('Accessibility', () => {
    it('maintains proper structure for screen readers', () => {
      render(<Tile letter="A" points={1} />)
      const container = screen.getByText('A').closest('.Tile__container')
      const letter = screen.getByText('A')
      const points = screen.getByText('1')
      
      expect(container).toBeInTheDocument()
      expect(letter).toBeInTheDocument()
      expect(points).toBeInTheDocument()
    })
  })
}) 