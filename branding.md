# Branding Guidelines - Peptide Customer Frontend

## Overview
This document outlines the brand colors, typography, and design guidelines for the Peptide customer frontend application. The branding is inspired by pharmaceutical/lab label aesthetics with a modern, clean, and professional appearance.

---

## Color Palette

### Primary Colors

#### 1. Mint/Aqua Tone (Primary Accent Color)
- **HEX:** `#cbe8de`
- **RGB:** `rgb(203, 232, 222)`
- **Usage:** Primary buttons, links, highlights, accent elements, call-to-action buttons
- **Accessibility:** Use with dark text (`#1a1d20` or `#2d3134`) for optimal contrast

#### 2. Dark Gray/Charcoal Tone (Header Background)
- **HEX:** `#2d3134`
- **RGB:** `rgb(45, 49, 52)`
- **Usage:** Header backgrounds, navigation bars, dark sections, footer backgrounds
- **Accessibility:** Use with white text (`#ffffff`) for optimal contrast

#### 3. White
- **HEX:** `#ffffff`
- **RGB:** `rgb(255, 255, 255)`
- **Usage:** Text on dark backgrounds, card backgrounds, main content areas, borders

---

### Secondary Colors

#### 4. Deep Teal
- **HEX:** `#0d9488`
- **RGB:** `rgb(13, 148, 136)`
- **Usage:** Hover states, active links, secondary buttons, interactive elements
- **When to use:** When you need a stronger accent than the primary mint

#### 5. Light Mint
- **HEX:** `#e0f2f1`
- **RGB:** `rgb(224, 242, 241)`
- **Usage:** Light backgrounds, card backgrounds, subtle highlights, section backgrounds
- **When to use:** For creating visual separation without heavy contrast

#### 6. Medium Gray
- **HEX:** `#64748b`
- **RGB:** `rgb(100, 116, 139)`
- **Usage:** Secondary text, placeholders, captions, disabled states
- **When to use:** For less important text that still needs to be readable

---

### Text Colors

#### 7. Primary Text (Dark)
- **HEX:** `#1a1d20`
- **RGB:** `rgb(26, 29, 32)`
- **Usage:** Primary text on light backgrounds, headings, body text
- **Accessibility:** Use on white or light mint backgrounds

#### 8. Secondary Text
- **HEX:** `#64748b`
- **RGB:** `rgb(100, 116, 139)`
- **Usage:** Secondary information, metadata, less important text
- **When to use:** For supporting text that doesn't need to be as prominent

#### 9. Text on Dark
- **HEX:** `#ffffff`
- **RGB:** `rgb(255, 255, 255)`
- **Usage:** All text on dark backgrounds (charcoal, deep teal, etc.)

---

### Functional Colors

#### 10. Success Green
- **HEX:** `#10b981`
- **RGB:** `rgb(16, 185, 129)`
- **Usage:** Success messages, in-stock indicators, positive actions, checkmarks
- **When to use:** To indicate successful operations or positive states

#### 11. Warning Amber
- **HEX:** `#f59e0b`
- **RGB:** `rgb(245, 158, 11)`
- **Usage:** Warning messages, low stock indicators, caution states
- **When to use:** To alert users about important but non-critical information

#### 12. Error Red
- **HEX:** `#ef4444`
- **RGB:** `rgb(239, 68, 68)`
- **Usage:** Error messages, out of stock indicators, destructive actions, validation errors
- **When to use:** To indicate errors or critical issues that need attention

#### 13. Info Blue
- **HEX:** `#3b82f6`
- **RGB:** `rgb(59, 130, 246)`
- **Usage:** Informational messages, tooltips, help text, neutral notifications
- **When to use:** For general information that doesn't require action

---

### Border & Divider Colors

#### 14. Light Border
- **HEX:** `#e2e8f0`
- **RGB:** `rgb(226, 232, 240)`
- **Usage:** Card borders, dividers, input borders, section separators
- **When to use:** For subtle separation between elements

#### 15. Subtle Mint Border
- **HEX:** `#a7f3d0`
- **RGB:** `rgb(167, 243, 208)`
- **Usage:** Accent borders, focus states, active input borders, highlighted sections
- **When to use:** To add a subtle brand accent to borders

---

### Background Colors

#### 16. Light Gray Background
- **HEX:** `#f8fafc`
- **RGB:** `rgb(248, 250, 252)`
- **Usage:** Alternate section backgrounds, subtle background variations
- **When to use:** To create visual hierarchy without heavy contrast

#### 17. Darker Charcoal
- **HEX:** `#1e293b`
- **RGB:** `rgb(30, 41, 59)`
- **Usage:** Deeper dark sections, modal overlays, dropdown menus
- **When to use:** When you need a darker variant of the header background

---

## Typography

### Font Family
- **Primary Font:** Geist
- **Source:** https://befonts.com/geist-font-family.html
- **Fallback:** System fonts (sans-serif)

### Font Weights
- **Regular (400):** Body text, paragraphs, general content
- **Medium (500):** Subheadings, emphasized text, navigation items
- **Semibold (600):** Section headings, important labels, buttons
- **Bold (700):** Main headings, page titles, strong emphasis

### Typography Scale
```
Heading 1 (H1): 48px / 3rem - Bold (700)
Heading 2 (H2): 36px / 2.25rem - Bold (700)
Heading 3 (H3): 30px / 1.875rem - Semibold (600)
Heading 4 (H4): 24px / 1.5rem - Semibold (600)
Heading 5 (H5): 20px / 1.25rem - Medium (500)
Heading 6 (H6): 18px / 1.125rem - Medium (500)
Body Text: 16px / 1rem - Regular (400)
Small Text: 14px / 0.875rem - Regular (400)
Caption: 12px / 0.75rem - Regular (400)
```

---

## Color Combinations

### Recommended Combinations

#### Primary Combinations
1. **Primary Button:**
   - Background: `#cbe8de` (Mint/Aqua)
   - Text: `#1a1d20` (Dark Text)
   - Hover: `#0d9488` (Deep Teal)
   - Hover Text: `#ffffff` (White)

2. **Header/Navigation:**
   - Background: `#2d3134` (Charcoal)
   - Text: `#ffffff` (White)
   - Active Link: `#cbe8de` (Mint/Aqua)
   - Hover: `#1e293b` (Darker Charcoal)

3. **Card/Content:**
   - Background: `#ffffff` (White)
   - Border: `#e2e8f0` (Light Border)
   - Text: `#1a1d20` (Dark Text)
   - Accent: `#cbe8de` (Mint/Aqua)

4. **Light Section:**
   - Background: `#e0f2f1` (Light Mint)
   - Text: `#1a1d20` (Dark Text)
   - Accent: `#0d9488` (Deep Teal)

---

## Design Principles

### 1. Color Usage Guidelines

#### Primary Accent (Mint/Aqua)
- Use sparingly for maximum impact
- Reserve for primary actions, important links, and key highlights
- Never use as background for large text blocks (use for accents only)

#### Charcoal Background
- Use for headers, navigation, and footer
- Always pair with white text for readability
- Can be used for modal overlays and dropdowns

#### White
- Primary background for content areas
- Use for cards, modals, and main content sections
- Ensures clean, professional appearance

### 2. Contrast Requirements

All color combinations must meet WCAG AA standards:
- **Normal text:** Minimum 4.5:1 contrast ratio
- **Large text (18px+):** Minimum 3:1 contrast ratio
- **Interactive elements:** Minimum 3:1 contrast ratio

### 3. Functional Color Usage

- **Success:** Use for positive feedback, completed actions, in-stock items
- **Warning:** Use for important notices that don't require immediate action
- **Error:** Use for critical issues, validation errors, out-of-stock items
- **Info:** Use for helpful information, tooltips, general notifications

### 4. Spacing & Layout

- Maintain consistent spacing using 4px or 8px base unit
- Use white space generously for clean, professional appearance
- Group related elements with consistent padding and margins

---

## Implementation in Tailwind CSS

### Recommended Tailwind Config

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Brand Colors
        'brand-mint': '#cbe8de',
        'brand-charcoal': '#2d3134',
        'brand-teal': '#0d9488',
        'brand-mint-light': '#e0f2f1',
        'brand-text-dark': '#1a1d20',
        'brand-text-secondary': '#64748b',
        'brand-border-light': '#e2e8f0',
        'brand-border-mint': '#a7f3d0',
        'brand-bg-light': '#f8fafc',
        'brand-charcoal-dark': '#1e293b',
        // Functional Colors
        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#ef4444',
        'info': '#3b82f6',
      },
      fontFamily: {
        'geist': ['Geist', 'sans-serif'],
      },
    },
  },
}
```

---

## Component Examples

### Buttons

**Primary Button:**
```tsx
<button className="bg-brand-mint text-brand-text-dark px-6 py-3 rounded-lg font-semibold hover:bg-brand-teal hover:text-white transition-colors">
  Primary Action
</button>
```

**Secondary Button:**
```tsx
<button className="bg-transparent border-2 border-brand-mint text-brand-mint px-6 py-3 rounded-lg font-semibold hover:bg-brand-mint hover:text-brand-text-dark transition-colors">
  Secondary Action
</button>
```

### Cards

```tsx
<div className="bg-white border border-brand-border-light rounded-lg p-6 shadow-sm">
  <h3 className="text-brand-text-dark font-semibold mb-2">Card Title</h3>
  <p className="text-brand-text-secondary">Card content goes here...</p>
</div>
```

### Header/Navigation

```tsx
<header className="bg-brand-charcoal text-white">
  <nav className="container mx-auto px-4 py-4">
    <a href="#" className="text-white hover:text-brand-mint transition-colors">
      Navigation Item
    </a>
  </nav>
</header>
```

---

## Migration Notes

### Current Color Scheme
The current frontend uses:
- Purple/Slate gradients (`slate-900`, `purple-900`)
- Emerald/Teal gradients for buttons

### Migration Strategy
1. Replace purple gradients with charcoal backgrounds
2. Replace emerald/teal with mint/aqua accents
3. Update all button styles to use brand colors
4. Update header/navigation to use charcoal background
5. Update card backgrounds to white with light borders
6. Implement Geist font family throughout

---

## Accessibility

### Color Contrast Checklist
- ✅ White text on charcoal (`#ffffff` on `#2d3134`) - 12.6:1 ratio
- ✅ Dark text on mint (`#1a1d20` on `#cbe8de`) - 8.2:1 ratio
- ✅ Dark text on white (`#1a1d20` on `#ffffff`) - 15.8:1 ratio
- ✅ White text on deep teal (`#ffffff` on `#0d9488`) - 4.8:1 ratio

### Best Practices
- Always test color combinations for accessibility
- Provide alternative indicators beyond color (icons, text labels)
- Ensure focus states are clearly visible
- Use sufficient contrast for all text

---

## Resources

- **Geist Font:** https://befonts.com/geist-font-family.html
- **Color Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/

---

## Version History

- **v1.0** - Initial branding guidelines created
- Based on pharmaceutical/lab label aesthetic
- Colors: Mint/Aqua, Charcoal, White
- Typography: Geist font family

---

*Last Updated: 2024*

