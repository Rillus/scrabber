import { cn } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('cn function', () => {
    it('merges class names correctly', () => {
      const result = cn('class1', 'class2', 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('handles conditional classes', () => {
      const isActive = true
      const isDisabled = false
      
      const result = cn(
        'base-class',
        isActive && 'active-class',
        isDisabled && 'disabled-class'
      )
      
      expect(result).toBe('base-class active-class')
    })

    it('filters out falsy values', () => {
      const falsyValue = false
      const nullValue = null
      const undefinedValue = undefined
      const emptyString = ''
      
      const result = cn(
        'class1',
        falsyValue && 'class2',
        nullValue && 'class3',
        undefinedValue && 'class4',
        emptyString && 'class5',
        'class7'
      )
      
      expect(result).toBe('class1 class7')
    })

    it('handles arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3', ['class4', 'class5'])
      expect(result).toBe('class1 class2 class3 class4 class5')
    })

    it('handles objects with conditional classes', () => {
      const result = cn({
        'base-class': true,
        'active-class': true,
        'disabled-class': false,
        'hidden-class': false
      })
      
      expect(result).toBe('base-class active-class')
    })

    it('handles mixed input types', () => {
      const isActive = true
      const classes = ['class1', 'class2']
      
      const result = cn(
        'base-class',
        classes,
        isActive && 'active-class',
        {
          'conditional-class': true,
          'false-class': false
        }
      )
      
      expect(result).toBe('base-class class1 class2 active-class conditional-class')
    })

    it('handles empty input', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('handles single class', () => {
      const result = cn('single-class')
      expect(result).toBe('single-class')
    })
  })
}) 