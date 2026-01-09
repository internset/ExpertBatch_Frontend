# Admin Design System

A comprehensive design system extracted from the Super Admin section. Use this design system to maintain consistent design across admin applications.

## 📁 Files

- **`admin-design-system.ts`** - TypeScript/JavaScript design tokens and utility functions
- **`admin-design-system.css`** - CSS utility classes for quick styling
- **`README.md`** - This documentation file

## 🚀 Quick Start

### Option 1: Using TypeScript/JavaScript (Recommended)

```typescript
import { designSystem, getButtonClasses, getStatusBadgeClasses } from '@/design-system/admin-design-system';

// Use design tokens
const primaryColor = designSystem.colors.primary.green;
const cardPadding = designSystem.spacing.padding.card;

// Use utility functions
const buttonClasses = getButtonClasses('primary', false);
const badgeClasses = getStatusBadgeClasses('ACTIVE');
```

### Option 2: Using CSS Classes

```css
/* Import the CSS file */
@import '@/design-system/admin-design-system.css';

/* Use utility classes */
<button class="admin-btn admin-btn-primary">Click Me</button>
<div class="admin-card">
  <div class="admin-card-header">
    <h3 class="admin-card-title">Card Title</h3>
  </div>
  <div class="admin-card-content">
    Card content here
  </div>
</div>
```

### Option 3: Using Tailwind Classes (Reference)

```tsx
// Use the tailwindClasses reference from admin-design-system.ts
import { tailwindClasses } from '@/design-system/admin-design-system';

<div className={tailwindClasses.common.card}>
  <div className={tailwindClasses.common.cardHeader}>
    <h3 className={tailwindClasses.common.sectionTitle}>Title</h3>
  </div>
</div>
```

## 🎨 Design Tokens

### Colors

```typescript
designSystem.colors.primary.green        // #00ad63
designSystem.colors.primary.greenHover   // #029E5B
designSystem.colors.status.active.bg     // #E6F7F0
designSystem.colors.status.active.text   // #0A6B47
designSystem.colors.role.student.bg     // #E3F6FB
designSystem.colors.role.student.text   // #0E5E7A
```

### Typography

```typescript
designSystem.typography.fontSize.xs      // 0.65rem (10.4px)
designSystem.typography.fontSize.md      // 0.9rem (14.4px)
designSystem.typography.fontSize['5xl'] // 1.75rem (28px)
designSystem.typography.fontWeight.semibold // 600
```

### Spacing

```typescript
designSystem.spacing.padding.xs          // 0.45rem (7.2px)
designSystem.spacing.padding.card        // 1.5rem (24px)
designSystem.spacing.margin.section      // 1.5rem (24px)
designSystem.spacing.gap.lg              // 1.5rem (24px)
```

### Borders

```typescript
designSystem.borders.radius.base         // 0.25rem (4px)
designSystem.borders.radius.badge        // 3.15rem (50.4px)
designSystem.borders.color.default       // rgba(0,0,0,0.125)
```

## 🧩 Components

### Buttons

**TypeScript:**
```typescript
import { getButtonClasses } from '@/design-system/admin-design-system';

const classes = getButtonClasses('primary', false);
// Returns: "flex items-center gap-2 rounded-[0.25rem] border px-4 py-2 text-[0.9rem] font-medium transition-colors bg-[#00ad63] text-white hover:bg-[#029E5B] border-[#00ad63]"
```

**CSS:**
```html
<button class="admin-btn admin-btn-primary">Primary Button</button>
<button class="admin-btn admin-btn-danger">Danger Button</button>
<button class="admin-btn" disabled>Disabled Button</button>
```

**Tailwind:**
```tsx
<button className="flex items-center gap-2 rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white px-4 py-2 text-[0.9rem] font-medium transition-colors hover:bg-[rgba(0,0,0,0.02)] hover:border-[#00ad63]">
  Secondary Button
</button>
```

### Cards

**CSS:**
```html
<div class="admin-card">
  <div class="admin-card-header">
    <h3 class="admin-card-title">Card Title</h3>
  </div>
  <div class="admin-card-content">
    Card content here
  </div>
</div>
```

**Tailwind:**
```tsx
<div className="rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white">
  <div className="border-b border-[rgba(0,0,0,0.125)] px-6 py-4">
    <h3 className="text-[1.1rem] font-semibold text-primary-black md:text-[1.2rem]">
      Card Title
    </h3>
  </div>
  <div className="p-6">
    Card content here
  </div>
</div>
```

### Badges

**TypeScript:**
```typescript
import { getStatusBadgeClasses, getRoleBadgeClasses } from '@/design-system/admin-design-system';

const statusBadge = getStatusBadgeClasses('ACTIVE');
const { classes, displayText } = getRoleBadgeClasses('student');
```

**CSS:**
```html
<span class="admin-badge admin-badge-status-active">ACTIVE</span>
<span class="admin-badge admin-badge-role-student">Student</span>
```

**Tailwind:**
```tsx
<span className="inline-flex rounded-[3.15rem] px-[0.5rem] py-[0.45rem] text-[0.65rem] font-medium whitespace-nowrap bg-[#E6F7F0] text-[#0A6B47]">
  ACTIVE
</span>
```

### Inputs

**CSS:**
```html
<input type="text" class="admin-input" placeholder="Enter text..." />
<input type="text" class="admin-input admin-input-error" />
```

**Tailwind:**
```tsx
<input
  type="text"
  className="w-full rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white px-4 py-2.5 text-[0.9rem] text-primary-black placeholder:text-[#999] focus:border-[#00ad63] focus:outline-none focus:ring-2 focus:ring-[#00ad63]/20"
  placeholder="Enter text..."
/>
```

### Tables

**CSS:**
```html
<table class="admin-table">
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Cell 1</td>
      <td>Cell 2</td>
    </tr>
  </tbody>
</table>
```

**Tailwind:**
```tsx
<table className="min-w-full divide-y divide-[rgba(0,0,0,0.125)]">
  <thead className="bg-[rgba(0,0,0,0.02)]">
    <tr>
      <th className="px-6 py-3 text-left text-[0.9rem] font-semibold uppercase tracking-wider text-primary-black">
        Header
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-[rgba(0,0,0,0.125)] bg-white">
    <tr className="hover:bg-[rgba(0,0,0,0.02)] transition-colors">
      <td className="whitespace-nowrap px-6 py-4 text-[0.9rem] font-medium text-primary-black">
        Cell
      </td>
    </tr>
  </tbody>
</table>
```

## 📐 Layout

### Container

**CSS:**
```html
<div class="admin-container">
  Content here
</div>
```

**Tailwind:**
```tsx
<div className="p-2">
  Content here
</div>
```

### Grid

**CSS:**
```html
<div class="admin-grid">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

**Tailwind:**
```tsx
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

## 🎯 Sidebar

### Sidebar Dimensions

```typescript
designSystem.sidebar.width.open    // 16rem (256px)
designSystem.sidebar.width.closed  // 3rem (48px)
designSystem.sidebar.headerHeight  // 50px
```

### Sidebar Classes

**CSS:**
```html
<aside class="admin-sidebar admin-sidebar-open">
  <!-- Sidebar content -->
</aside>
```

**Tailwind:**
```tsx
<aside className="fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 w-64">
  {/* Sidebar content */}
</aside>
```

## 🔧 Utility Functions

### getStatusBadgeClasses(status)

Returns Tailwind classes for status badges.

```typescript
getStatusBadgeClasses('ACTIVE')   // Returns classes for active status
getStatusBadgeClasses('PENDING') // Returns classes for pending status
getStatusBadgeClasses('BLOCKED') // Returns classes for blocked status
```

### getRoleBadgeClasses(role)

Returns Tailwind classes and display text for role badges.

```typescript
const { classes, displayText } = getRoleBadgeClasses('student');
// classes: "inline-flex rounded-[3.15rem] ..."
// displayText: "Student"
```

### getButtonClasses(variant, disabled)

Returns Tailwind classes for buttons.

```typescript
getButtonClasses('primary', false)   // Primary button
getButtonClasses('secondary', false) // Secondary button
getButtonClasses('danger', false)    // Danger button
getButtonClasses('primary', true)    // Disabled button
```

### getCardClasses(withShadow)

Returns Tailwind classes for cards.

```typescript
getCardClasses(false) // Card without shadow
getCardClasses(true)  // Card with shadow
```

### getInputClasses(hasError)

Returns Tailwind classes for inputs.

```typescript
getInputClasses(false) // Normal input
getInputClasses(true)  // Input with error state
```

## 📱 Responsive Breakpoints

The design system uses standard Tailwind breakpoints:

- **Mobile**: Default (0px+)
- **Tablet**: `md:` (768px+)
- **Desktop**: `lg:` (1024px+)
- **Wide**: `xl:` (1280px+)

## 🎨 Color Palette

### Primary Colors
- **Green**: `#00ad63` - Primary action color
- **Green Hover**: `#029E5B` - Hover state
- **Green Dark**: `#0A6B47` - Dark variant
- **Black**: `#000000` - Text color

### Status Colors
- **Active**: Background `#E6F7F0`, Text `#0A6B47`
- **Pending**: Background `#FFEFC2`, Text `#8C5A00`
- **Blocked**: Background `rgb(254, 226, 226)`, Text `rgb(153, 27, 27)`

### Role Colors
- **Student**: Background `#E3F6FB`, Text `#0E5E7A`
- **Admin**: Background `rgb(243, 232, 255)`, Text `rgb(107, 33, 168)`
- **Super Admin**: Background `rgb(224, 231, 255)`, Text `rgb(55, 48, 163)`

## 📝 Notes

- All spacing values are in `rem` units for scalability
- Border radius uses specific values (e.g., `3.15rem` for badges)
- Colors use both hex and RGB values depending on the context
- The design system is optimized for accessibility with proper contrast ratios

## 🔄 Migration Guide

If you're migrating from the existing codebase:

1. **Replace hardcoded colors** with `designSystem.colors.*`
2. **Replace hardcoded spacing** with `designSystem.spacing.*`
3. **Use utility functions** instead of inline class strings
4. **Import CSS classes** for quick styling
5. **Reference tailwindClasses** for Tailwind-specific implementations

## 📚 Examples

See the following files for real-world usage:
- `src/app/super-admin/users/page.tsx`
- `src/app/super-admin/dashboard/page.tsx`
- `src/components/super-admin/SuperAdminSidebar.tsx`

## 🤝 Contributing

When adding new components or styles:

1. Add design tokens to `admin-design-system.ts`
2. Add CSS classes to `admin-design-system.css`
3. Add utility functions if needed
4. Update this README with examples
5. Ensure consistency with existing patterns

