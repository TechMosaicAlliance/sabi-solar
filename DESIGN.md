# Sabi Solar — Design Brief

## Tone & Intent
Premium energy tech dashboard. Dark, sophisticated, purposeful. Designed for real-time solar/grid tracking on mobile. Emerald signals sustainability; high contrast ensures readability under varied conditions.

## Differentiation
Dark Slate Navy depth + vibrant Emerald Green accents. Minimalist line icons. Data-forward without clutter. Rounded cards feel modern yet professional. No generic tech defaults.

## Palette
| Intent | Light OKLCH | Dark OKLCH |
|--------|------------|----------|
| Background | `0.99 0 0` | `0.145 0 0` |
| Card | `1.0 0 0` | `0.18 0 0` |
| Foreground | `0.15 0 0` | `0.95 0 0` |
| Primary (Emerald) | `0.52 0.19 142` | `0.65 0.19 142` |
| Accent / Ring | `0.52 0.19 142` | `0.65 0.19 142` |
| Destructive | `0.55 0.22 25` | `0.65 0.19 22` |
| Chart-1 (Emerald) | `0.52 0.19 142` | `0.65 0.19 142` |
| Chart-2 (Orange) | `0.63 0.22 33` | `0.72 0.22 33` |
| Chart-3 (Gold) | `0.75 0.15 90` | `0.8 0.15 90` |
| Muted / Border | `0.9 0 0` | `0.28 0 0` |

## Typography
| Role | Font | Scale | Weight |
|------|------|-------|--------|
| Display | General Sans | 2xl–3xl | 600 |
| Body | General Sans | base–lg | 400 |
| Mono / Data | JetBrains Mono | sm–base | 400 |

## Elevation & Depth
- **Background**: Dark Slate Navy base layer
- **Card**: Subtle elevation via lighter background + minimal border
- **Hover/Active**: Emerald accent + increased contrast
- **Shadows**: Minimal; depth via background layers, not blur

## Structural Zones
| Zone | Background | Border | Role |
|------|------------|--------|------|
| Header | `card` | subtle bottom border | Title + status |
| Main Content | `background` | none | Energy gauge, toggle, metrics |
| Metric Card | `card` | subtle `border` | Data display, icon-led |
| Chart Area | `card` | subtle `border` | 24h bar chart visualization |
| Tab/Segment | `card` / `muted` toggle | subtle | Day/Week/Month filters |
| Footer/Nav | `card` | subtle top border | Navigation icons |

## Component Patterns
- **Gauge**: Circular progress, Emerald stroke on dark card
- **Toggle**: Minimal switch; active state = Emerald + white text
- **Metric Card**: Icon left, value right, subtle background
- **Chart Bar**: Emerald (solar) + Orange (grid), rounded caps
- **Buttons**: Emerald fill, white text, 12px radius, no shadow
- **Icons**: Lucide-react, 20–24px, Emerald on card/muted backgrounds

## Spacing & Rhythm
- **Gap**: 16px between sections, 12px between metric cards
- **Padding**: 16px on cards, 20px on page edges (mobile-first)
- **Density**: Moderate; prioritize data readability

## Motion
- **Transition**: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` for state changes
- **Gauge Update**: Smooth, 1s duration when values refresh (30s intervals)
- **Chart Animation**: Bars enter from bottom on load, smooth on data update
- **Toggle**: Snap; no easing

## Constraints
- No generic tech defaults (safe blue, purple, gradients)
- No full-page backgrounds or decorative blur
- No system fonts; use bundled General Sans + JetBrains Mono
- Contrast ratio ≥ 4.5:1 (WCAG AA) on all text
- Mobile-first: touch-friendly (44px min tap target)

## Signature Detail
Emerald green circular energy gauge with animated percentage fill. Distinctive, contextual, memorable. Signals solar as the primary energy source while maintaining dark-tech sophistication.

## Mode
Dark mode optimized. Light mode palette defined but not prioritized for launch.
