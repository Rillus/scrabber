import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  describe('Basic Rendering', () => {
    it('renders button with text content', () => {
      render(<Button>Click me</Button>)
      
      const button = screen.getByRole('button', { name: 'Click me' })
      expect(button).toBeInTheDocument()
    })

    it('applies default styling classes', () => {
      render(<Button>Default Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center')
    })

    it('handles click events', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Variants', () => {
    it('renders default variant correctly', () => {
      render(<Button variant="default">Default</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary', 'text-primary-foreground')
    })

    it('renders destructive variant correctly', () => {
      render(<Button variant="destructive">Delete</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-destructive', 'text-white')
    })

    it('renders outline variant correctly', () => {
      render(<Button variant="outline">Outline</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border', 'bg-background')
    })

    it('renders secondary variant correctly', () => {
      render(<Button variant="secondary">Secondary</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground')
    })

    it('renders ghost variant correctly', () => {
      render(<Button variant="ghost">Ghost</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground')
    })

    it('renders link variant correctly', () => {
      render(<Button variant="link">Link</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-primary', 'underline-offset-4')
    })
  })

  describe('Sizes', () => {
    it('renders default size correctly', () => {
      render(<Button size="default">Default Size</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-9', 'px-4', 'py-2')
    })

    it('renders small size correctly', () => {
      render(<Button size="sm">Small</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-8', 'px-3')
    })

    it('renders large size correctly', () => {
      render(<Button size="lg">Large</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10', 'px-6')
    })

    it('renders icon size correctly', () => {
      render(<Button size="icon">Icon</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('size-9')
    })
  })

  describe('Disabled State', () => {
    it('renders disabled button correctly', () => {
      render(<Button disabled>Disabled</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
    })

    it('does not trigger click when disabled', () => {
      const handleClick = jest.fn()
      render(<Button disabled onClick={handleClick}>Disabled</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('AsChild Prop', () => {
    it('renders as child element when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      )
      
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/test')
      expect(link).toHaveClass('inline-flex', 'items-center', 'justify-center')
    })
  })

  describe('With Icons', () => {
    it('renders button with icon and text', () => {
      render(
        <Button>
          <span data-testid="icon">🎯</span>
          Click me
        </Button>
      )
      
      const button = screen.getByRole('button')
      const icon = screen.getByTestId('icon')
      
      expect(button).toBeInTheDocument()
      expect(icon).toBeInTheDocument()
      expect(button).toHaveClass('gap-2')
    })
  })

  describe('Focus States', () => {
    it('applies focus-visible styles', () => {
      render(<Button>Focusable</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('focus-visible:border-ring', 'focus-visible:ring-ring/50')
    })
  })

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>)
      
      const button = screen.getByLabelText('Close dialog')
      expect(button).toBeInTheDocument()
    })

    it('supports aria-describedby', () => {
      render(
        <div>
          <span id="description">This button closes the dialog</span>
          <Button aria-describedby="description">Close</Button>
        </div>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-describedby', 'description')
    })

    it('supports data-slot attribute', () => {
      render(<Button>Test</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-slot', 'button')
    })
  })

  describe('Custom ClassName', () => {
    it('merges custom className with default classes', () => {
      render(<Button className="custom-class">Custom</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
      expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center')
    })
  })
}) 