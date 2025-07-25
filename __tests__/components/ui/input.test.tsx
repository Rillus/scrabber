import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/input'

describe('Input Component', () => {
  describe('Basic Rendering', () => {
    it('renders input element', () => {
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })

    it('applies default styling classes', () => {
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('flex', 'h-9', 'w-full', 'rounded-md', 'border')
    })

    it('renders with placeholder text', () => {
      render(<Input placeholder="Enter your name" />)
      
      const input = screen.getByPlaceholderText('Enter your name')
      expect(input).toBeInTheDocument()
    })

    it('renders with value', () => {
      render(<Input value="John Doe" readOnly />)
      
      const input = screen.getByDisplayValue('John Doe')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Input Types', () => {
    it('renders text input by default', () => {
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
      // Note: HTML inputs default to type="text" even without explicit attribute
    })

    it('renders email input correctly', () => {
      render(<Input type="email" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('renders password input correctly', () => {
      render(<Input type="password" />)
      
      const input = screen.getByDisplayValue('')
      expect(input).toHaveAttribute('type', 'password')
    })

    it('renders number input correctly', () => {
      render(<Input type="number" />)
      
      const input = screen.getByRole('spinbutton')
      expect(input).toHaveAttribute('type', 'number')
    })
  })

  describe('Event Handling', () => {
    it('handles onChange events', async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      render(<Input onChange={handleChange} />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, 'Hello')
      
      expect(handleChange).toHaveBeenCalled()
      expect(input).toHaveValue('Hello')
    })

    it('handles onFocus events', () => {
      const handleFocus = jest.fn()
      render(<Input onFocus={handleFocus} />)
      
      const input = screen.getByRole('textbox')
      fireEvent.focus(input)
      
      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    it('handles onBlur events', () => {
      const handleBlur = jest.fn()
      render(<Input onBlur={handleBlur} />)
      
      const input = screen.getByRole('textbox')
      fireEvent.blur(input)
      
      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('handles onKeyDown events', () => {
      const handleKeyDown = jest.fn()
      render(<Input onKeyDown={handleKeyDown} />)
      
      const input = screen.getByRole('textbox')
      fireEvent.keyDown(input, { key: 'Enter' })
      
      expect(handleKeyDown).toHaveBeenCalledTimes(1)
    })
  })

  describe('Disabled State', () => {
    it('renders disabled input correctly', () => {
      render(<Input disabled />)
      
      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
      expect(input).toHaveClass('disabled:pointer-events-none', 'disabled:cursor-not-allowed')
    })

    it('does not trigger events when disabled', async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      render(<Input disabled onChange={handleChange} />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, 'test')
      
      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  describe('Readonly State', () => {
    it('renders readonly input correctly', () => {
      render(<Input readOnly />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('readonly')
    })

    it('allows focus but not editing when readonly', async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      render(<Input readOnly value="Initial" onChange={handleChange} />)
      
      const input = screen.getByRole('textbox')
      await user.click(input)
      
      expect(input).toHaveValue('Initial')
      // Should not be able to type in readonly input
      await user.type(input, 'test')
      expect(input).toHaveValue('Initial')
    })
  })

  describe('Required State', () => {
    it('renders required input correctly', () => {
      render(<Input required />)
      
      const input = screen.getByRole('textbox')
      expect(input).toBeRequired()
    })

    it('shows required validation', () => {
      render(<Input required />)
      
      const input = screen.getByRole('textbox')
      fireEvent.invalid(input)
      
      expect(input).toBeInvalid()
    })
  })

  describe('Focus States', () => {
    it('applies focus-visible styles', () => {
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('focus-visible:border-ring', 'focus-visible:ring-ring/50')
    })

    it('handles focus correctly', async () => {
      const user = userEvent.setup()
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      await user.click(input)
      
      expect(input).toHaveFocus()
    })
  })

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(<Input aria-label="Search" />)
      
      const input = screen.getByLabelText('Search')
      expect(input).toBeInTheDocument()
    })

    it('supports aria-describedby', () => {
      render(
        <div>
          <span id="description">This input is for searching</span>
          <Input aria-describedby="description" />
        </div>
      )
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-describedby', 'description')
    })

    it('supports aria-invalid', () => {
      render(<Input aria-invalid="true" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    it('supports data-slot attribute', () => {
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('data-slot', 'input')
    })
  })

  describe('Custom ClassName', () => {
    it('merges custom className with default classes', () => {
      render(<Input className="custom-input" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('custom-input')
      expect(input).toHaveClass('flex', 'h-9', 'w-full')
    })
  })

  describe('File Input', () => {
    it('renders file input correctly', () => {
      render(<Input type="file" />)
      
      const input = screen.getByDisplayValue('')
      expect(input).toHaveAttribute('type', 'file')
      expect(input).toHaveClass('file:text-foreground')
    })
  })

  describe('Selection', () => {
    it('supports text selection', () => {
      render(<Input value="Selectable text" readOnly />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('selection:bg-primary', 'selection:text-primary-foreground')
    })
  })

  describe('Placeholder Styling', () => {
    it('applies placeholder styling', () => {
      render(<Input placeholder="Enter text" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('placeholder:text-muted-foreground')
    })
  })
}) 