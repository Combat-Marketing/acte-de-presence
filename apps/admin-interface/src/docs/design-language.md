# Acte de Présence Design Language

## Colors

### Brand Colors
- Primary: `#3EB285` - Main brand color used for primary actions and key UI elements
- Secondary: `#155A84` - Used for secondary actions and supporting UI elements

### Semantic Colors
- Background: `var(--background)` - Light/dark mode aware background color
- Foreground: `var(--foreground)` - Light/dark mode aware text color
- Destructive: `var(--destructive)` - Used for destructive actions and error states
- Muted: `var(--muted)` - Used for subtle backgrounds and disabled states
- Accent: `var(--accent)` - Used for highlighting and active states

### UI Component Colors
- Card: `var(--card)` - Background color for card components
- Input: `var(--input)` - Border color for input fields
- Border: `var(--border)` - General border color
- Ring: `var(--ring)` - Focus ring color for interactive elements
- Popover: `var(--popover)` - Background color for popovers and dropdowns

## Typography

### Font Families
- Sans Serif: `var(--font-geist-sans)` - Primary font for UI text
- Mono: `var(--font-geist-mono)` - Used for code and technical content

### Text Sizes
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)

### Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Spacing

### Border Radius
- sm: `calc(var(--radius) - 4px)`
- md: `calc(var(--radius) - 2px)`
- lg: `var(--radius)` (0.625rem)
- xl: `calc(var(--radius) + 4px)`

### Component Spacing
- Padding (containers): 2rem
- Gap (between items): 0.5rem - 1rem
- Component margins: 1rem - 1.5rem

## Animations

### Transitions
- Default duration: 200ms
- Timing function: ease-out

### Specific Animations
- Accordion:
  - accordion-down: Height transition from 0 to content height
  - accordion-up: Height transition from content height to 0
- Dialog/Popover:
  - fade-in/fade-out
  - zoom-in/zoom-out
  - slide-in/slide-out

## Components

### Buttons
Variants:
- default: Primary colored background with white text
- destructive: Red background for dangerous actions
- outline: Bordered button with transparent background
- secondary: Secondary colored background
- ghost: No background until hover
- link: Appears as underlined text

Sizes:
- sm: h-8, px-3
- default: h-9, px-4
- lg: h-10, px-6
- icon: size-9

### Form Elements
- Inputs: Standard text inputs with consistent padding and borders
- Select: Dropdown select with custom styling and animations
- Checkbox: Custom styled checkboxes with animations
- Radio: Custom styled radio buttons
- Switch: Toggle switches for boolean inputs

### Navigation
- Side Menu: Compact sidebar with icon-only buttons and tooltips
- Top Bar: Application header with navigation and actions
- Breadcrumbs: Hierarchical navigation path

### Feedback
- Toast Notifications: Floating notifications for user feedback
- Loading States: Consistent loading spinners and skeletons
- Error Messages: Clear error states with destructive colors
- Dialog Boxes: Modal windows for important actions

## Layout

### Grid System
- Based on Flexbox and CSS Grid
- Responsive breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1400px

### Container Widths
- Default: fluid
- 2xl: max-width 1400px

### Z-Index Scale
- Base content: 0
- Dropdowns/Popovers: 50
- Modals/Dialogs: 100
- Toasts: 1000

## Accessibility

### Focus States
- Visible focus rings using `ring` utility
- High contrast focus indicators
- Keyboard navigation support

### Color Contrast
- WCAG AA compliance for text colors
- Sufficient contrast ratios for all interactive elements

### Dark Mode
Full dark mode support with:
- Adjusted color palette
- Reduced contrast where appropriate
- Maintained accessibility standards

## Icons

Using Lucide icons with consistent sizing:
- Small: 16x16 (1rem)
- Default: 20x20 (1.25rem)
- Large: 24x24 (1.5rem)

## Best Practices

1. **Component Architecture**
   - Use composition over inheritance
   - Keep components small and focused
   - Implement consistent prop patterns

2. **Styling**
   - Use Tailwind utility classes
   - Follow mobile-first approach
   - Maintain consistent spacing

3. **State Management**
   - Use Zustand for global state
   - Keep local state minimal
   - Implement proper loading states

4. **Performance**
   - Lazy load where appropriate
   - Optimize images and animations
   - Minimize bundle size