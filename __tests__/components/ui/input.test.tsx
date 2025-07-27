import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/input'

describe('Input', () => {
  it('renders text input by default', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('Input')
  })

  it('applies custom className', () => {
    render(<Input className="custom-input" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-input')
  })

  it('handles value changes', async () => {
    const user = userEvent.setup()
    render(<Input />)
    const input = screen.getByRole('textbox')
    
    await user.type(input, 'Hello World')
    expect(input).toHaveValue('Hello World')
  })

  it('handles focus correctly', async () => {
    const user = userEvent.setup()
    render(<Input />)
    const input = screen.getByRole('textbox')
    
    await user.click(input)
    expect(input).toHaveFocus()
  })

  it('renders file input correctly', () => {
    render(<Input type="file" />)
    const input = screen.getByDisplayValue('')
    expect(input).toHaveAttribute('type', 'file')
    expect(input).toHaveClass('Input')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('applies data-slot attribute', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('data-slot', 'input')
  })

  it('supports all input types', () => {
    const types = ['text', 'email', 'password', 'number', 'tel', 'url', 'search']
    
    types.forEach(type => {
      const { unmount } = render(<Input type={type} />)
      const input = screen.getByDisplayValue('')
      expect(input).toHaveAttribute('type', type)
      unmount()
    })
  })

  it('handles disabled state', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('supports placeholder text', () => {
    render(<Input placeholder="Enter your name" />)
    const input = screen.getByPlaceholderText('Enter your name')
    expect(input).toBeInTheDocument()
  })

  it('supports aria attributes', () => {
    render(<Input aria-label="Username" aria-describedby="username-help" />)
    const input = screen.getByLabelText('Username')
    expect(input).toHaveAttribute('aria-describedby', 'username-help')
  })
}) 