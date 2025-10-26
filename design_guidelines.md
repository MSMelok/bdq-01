# Bitcoin Depot Location Qualification Tool - Design Guidelines

## Design Approach: Modern Dashboard System

**Selected Approach:** Utility-First Dashboard Design  
**Inspiration:** Linear's clarity + Notion's data density + Stripe's professional aesthetic  
**Principle:** Maximum information clarity with minimal cognitive load for rapid decision-making

---

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Background: 0 0% 98% (near-white)
- Surface: 0 0% 100% (white cards)
- Border: 220 13% 91% (subtle gray)
- Text Primary: 222 47% 11% (near-black)
- Text Secondary: 215 16% 47% (medium gray)

**Dark Mode:**
- Background: 222 47% 11% (deep blue-black)
- Surface: 217 33% 17% (elevated cards)
- Border: 217 19% 27% (subtle borders)
- Text Primary: 210 40% 98% (near-white)
- Text Secondary: 215 20% 65% (muted gray)

**Status Colors (Same for Both Modes):**
- Success: 142 76% 36% (green - qualified)
- Warning: 38 92% 50% (amber - review needed)
- Error: 0 84% 60% (red - disqualified)
- Info: 221 83% 53% (blue - neutral info)

**Brand Accent:**
- Primary: 24 90% 50% (Bitcoin orange #FF8800)
- Use sparingly for CTAs and key highlights only

---

### B. Typography

**Font Families:**
- Primary: 'Inter' (Google Fonts) - all UI elements
- Monospace: 'JetBrains Mono' - addresses, coordinates, data values

**Hierarchy:**
- Tool Title: font-semibold text-2xl tracking-tight
- Section Headers: font-medium text-lg
- Labels: font-medium text-sm text-secondary
- Body Text: font-normal text-base
- Data Values: font-mono text-sm
- Status Badges: font-medium text-xs uppercase tracking-wide

---

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16  
**Example:** p-4, gap-6, m-8, space-y-12

**Grid Structure:**
- Single-column layout (max-w-4xl centered)
- No multi-column grids for this tool
- Stack components vertically with consistent spacing

**Component Spacing:**
- Between major sections: space-y-8
- Within cards: p-6
- Between data rows: gap-4
- Input padding: px-4 py-3

---

### D. Component Library

**1. Search Input (Primary Interaction)**
- Large, prominent text input (h-14)
- Left icon: Map pin (from Heroicons)
- Placeholder: "Enter store address..."
- Right side: Analyze button (h-10, px-6, bg-primary)
- Full-width within container
- Focus: 2px primary color ring
- Subtle shadow on focus

**2. Results Dashboard (Main Content Area)**

*Qualification Summary Card:*
- Large status indicator at top (qualified/disqualified)
- Icon + Text + Color-coded background (subtle, 10% opacity)
- Overall recommendation text

*Data Grid Cards (Stack Vertically):*

**Population Density Card:**
- ZIP code in monospace
- Density value with threshold comparison
- Pass/fail indicator with icon
- Visual: Simple horizontal bar showing value vs threshold

**BTM Proximity Card:**
- Map icon header
- Bitcoin Depot count (bold, if > 0 show warning)
- Competitor breakdown list:
  - Company name
  - Count badge (rounded-full, small)
- Grid layout for multiple competitors (2 columns on desktop)

**Business Type Card:**
- Business name from Google
- Category badge (Tier 1/Tier 2 with pricing)
- Qualification status
- List of detected business attributes

**Store Hours Card:**
- Days open count
- Hours/day calculation
- Weekly schedule grid (compact)
- Pass/fail for 5 day + 9 hour rule

**3. Settings Panel**
- Gear icon trigger (top-right corner)
- Slide-out panel (from right)
- Configuration options:
  - Population density threshold (number input)
  - Radius distance selector
- Save button (sticky at bottom)

**4. Status Badges**
- Rounded-full pills
- Height: h-6
- Icon + text combination
- Colors: Success (green), Error (red), Warning (amber), Info (blue)

**5. Data Rows**
- Label on left (text-sm text-secondary)
- Value on right (font-medium or font-mono)
- Divider between rows (border-b)

---

### E. Visual Elements

**Icons:** Heroicons (outline for most, solid for status)
- MapPin, Building, Users, Clock, CheckCircle, XCircle, Cog

**Shadows:**
- Cards: shadow-sm (subtle)
- Active input: shadow-md
- Settings panel: shadow-xl
- No drop shadows on badges or buttons

**Borders:**
- Radius: rounded-lg (cards), rounded-md (inputs), rounded-full (badges)
- Width: border (1px default)
- Style: Solid, consistent color

**Spacing & Density:**
- Comfortable, not cramped
- Prioritize readability over fitting everything above fold
- Allow natural scrolling for results section

---

## Page Layout

**Structure:**
1. **Header** (sticky top, h-16)
   - Bitcoin Depot logo/text (left)
   - Settings cog icon (right)
   - Border-bottom separator

2. **Search Section** (pt-12)
   - Centered, max-w-2xl
   - Search input + button
   - Helper text below (text-sm text-secondary)

3. **Results Section** (pt-8)
   - Appears after analysis
   - Qualification summary first (prominent)
   - Data cards stack below (space-y-6)
   - Each card: white/elevated surface with rounded corners

4. **Footer** (minimal, pt-16)
   - API attribution text
   - Version number

---

## Interaction Patterns

**Loading States:**
- Skeleton screens for data cards
- Animated pulse on skeleton elements
- Loading spinner on Analyze button during API calls

**Empty State:**
- Centered illustration placeholder
- "Enter an address to get started" message
- Example address suggestion

**Error States:**
- Red border on input for invalid addresses
- Error message below input (text-sm text-error)
- Alert banner for API failures

**Success Flow:**
- Smooth scroll to results after analysis
- Subtle fade-in animation for cards (stagger by 50ms)
- No excessive animations

---

## Accessibility

- Maintain WCAG AA contrast ratios
- Consistent dark mode throughout (including inputs)
- Focus indicators on all interactive elements
- Semantic HTML structure
- Screen reader labels for icons

---

## Images

**No hero image required** - This is a utility tool, not a marketing page  
**Icons only** - Use Heroicons for all visual indicators