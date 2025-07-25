# Styling Guide - SCSS with SUIT CSS Naming Convention

This project uses SCSS with the SUIT CSS naming convention instead of Tailwind CSS.

## Overview

We've migrated from Tailwind CSS to a custom SCSS architecture that follows the SUIT CSS naming convention. This provides:

- **Better maintainability**: SCSS allows for nested rules, mixins, and variables
- **Consistent naming**: SUIT CSS provides a clear, predictable naming structure
- **Design system**: CSS custom properties for consistent theming
- **Component-based styling**: Each component has its own SCSS file

## File Structure

```
styles/
├── main.scss                 # Main entry point
├── base/
│   ├── _variables.scss      # CSS custom properties
│   ├── _reset.scss          # CSS reset
│   └── _typography.scss     # Typography utilities
├── utilities/
│   ├── _spacing.scss        # Margin, padding, gap utilities
│   ├── _flexbox.scss        # Flexbox and grid utilities
│   ├── _colors.scss         # Color utilities
│   ├── _borders.scss        # Border utilities
│   ├── _shadows.scss        # Shadow and ring utilities
│   └── _transitions.scss    # Transition and animation utilities
├── components/
│   ├── _button.scss         # Button component styles
│   ├── _card.scss           # Card component styles
│   ├── _input.scss          # Input component styles
│   ├── _checkbox.scss       # Checkbox component styles
│   └── _tile.scss           # Tile component styles
└── layout/
    ├── _container.scss      # Container layout styles
    └── _grid.scss           # Grid layout styles
```

## Naming Convention

### SUIT CSS Structure

SUIT CSS follows this pattern: `.ComponentName[--modifierName][__descendantName]`

- **Component**: `.Button`, `.Card`, `.Input`
- **Modifier**: `.Button--primary`, `.Button--large`
- **Descendant**: `.Button__icon`, `.Card__title`

### Utility Classes

Utility classes follow the pattern: `.u-{property}-{value}`

- **Spacing**: `.u-p-4`, `.u-m-2`, `.u-gap-6`
- **Flexbox**: `.u-flex`, `.u-justify-center`, `.u-items-center`
- **Colors**: `.u-bg-primary`, `.u-text-muted`
- **Typography**: `.u-text-sm`, `.u-font-semibold`

## Usage Examples

### Components

```tsx
// Button with variants
<Button variant="primary" size="large" className="Button--custom">
  Click me
</Button>

// Card with descendants
<Card className="Card--featured">
  <CardHeader className="CardHeader--bordered">
    <CardTitle className="CardTitle--large">Title</CardTitle>
  </CardHeader>
</Card>
```

### Utility Classes

```tsx
// Layout utilities
<div className="u-flex u-justify-between u-items-center u-p-4 u-gap-6">
  <div className="u-text-lg u-font-semibold u-text-primary">Content</div>
  <div className="u-bg-secondary u-rounded-lg u-p-2">Sidebar</div>
</div>

// Responsive utilities
<div className="u-grid u-grid-cols-1 u-md-grid-cols-2 u-lg-grid-cols-3">
  {/* Grid items */}
</div>
```

## CSS Custom Properties

The design system uses CSS custom properties for consistent theming:

```scss
:root {
  // Colors
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --muted: oklch(0.97 0 0);
  
  // Spacing
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  
  // Typography
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --font-medium: 500;
}
```

## Dark Mode

Dark mode is supported through CSS custom properties:

```scss
.dark {
  --primary: oklch(0.922 0 0);
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}
```

## Migration from Tailwind

### Before (Tailwind)
```tsx
<button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
  Button
</button>
```

### After (SCSS + SUIT CSS)
```tsx
<Button variant="primary" className="Button--custom">
  Button
</Button>
```

## Adding New Components

1. Create a new SCSS file in `styles/components/_component-name.scss`
2. Follow SUIT CSS naming convention
3. Import in `styles/main.scss`
4. Update the component to use the new classes

Example:
```scss
// styles/components/_modal.scss
.Modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--background);
  
  &--centered {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &__content {
    background-color: var(--card);
    border-radius: var(--radius-lg);
    padding: var(--space-6);
  }
}
```

## Best Practices

1. **Use CSS custom properties** for design tokens
2. **Follow SUIT CSS naming** for consistency
3. **Keep components modular** with their own SCSS files
4. **Use utility classes sparingly** - prefer component classes
5. **Leverage SCSS features** like nesting, mixins, and variables
6. **Maintain responsive design** with media queries

## Build Process

The SCSS is compiled during the Next.js build process. The main entry point is imported in `app/layout.tsx`:

```tsx
import "../styles/main.scss";
```

This ensures all styles are available throughout the application.