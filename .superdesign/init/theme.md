# Theme & Design Tokens

## Tailwind Config

```js
// frontend/tailwind.config.js
module.exports = {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    plugins: [
        require("tailwindcss-animate"),
        require("@tailwindcss/typography")
    ],
    theme: {
    	extend: {
    		colors: {
    			background: 'oklch(var(--background) / <alpha-value>)',
    			foreground: 'oklch(var(--foreground) / <alpha-value>)',
    			card: {
    				DEFAULT: 'oklch(var(--card) / <alpha-value>)',
    				foreground: 'oklch(var(--card-foreground) / <alpha-value>)'
    			},
    			popover: {
    				DEFAULT: 'oklch(var(--popover) / <alpha-value>)',
    				foreground: 'oklch(var(--popover-foreground) / <alpha-value>)'
    			},
    			primary: {
    				DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
    				foreground: 'oklch(var(--primary-foreground) / <alpha-value>)'
    			},
    			secondary: {
    				DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
    				foreground: 'oklch(var(--secondary-foreground) / <alpha-value>)'
    			},
    			muted: {
    				DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
    				foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
    			},
    			accent: {
    				DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
    				foreground: 'oklch(var(--accent-foreground) / <alpha-value>)'
    			},
    			destructive: {
    				DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
    				foreground: 'oklch(var(--destructive-foreground) / <alpha-value>)'
    			},
    			border: 'oklch(var(--border) / <alpha-value>)',
    			input: 'oklch(var(--input) / <alpha-value>)',
    			ring: 'oklch(var(--ring) / <alpha-value>)',
    			chart: {
    				'1': 'oklch(var(--chart-1) / <alpha-value>)',
    				'2': 'oklch(var(--chart-2) / <alpha-value>)',
    				'3': 'oklch(var(--chart-3) / <alpha-value>)',
    				'4': 'oklch(var(--chart-4) / <alpha-value>)',
    				'5': 'oklch(var(--chart-5) / <alpha-value>)'
    			},
    			sidebar: {
    				DEFAULT: 'oklch(var(--sidebar) / <alpha-value>)',
    				foreground: 'oklch(var(--sidebar-foreground) / <alpha-value>)',
    				primary: 'oklch(var(--sidebar-primary) / <alpha-value>)',
    				'primary-foreground': 'oklch(var(--sidebar-primary-foreground) / <alpha-value>)',
    				accent: 'oklch(var(--sidebar-accent) / <alpha-value>)',
    				'accent-foreground': 'oklch(var(--sidebar-accent-foreground) / <alpha-value>)',
    				border: 'oklch(var(--sidebar-border) / <alpha-value>)',
    				ring: 'oklch(var(--sidebar-ring) / <alpha-value>)'
    			}
    		},
    		fontFamily: {
    			sans: [
    				'var(--font-sans)'
    			],
    			serif: [
    				'var(--font-serif)'
    			],
    			mono: [
    				'var(--font-mono)'
    			]
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		boxShadow: {
    			'2xs': 'var(--shadow-2xs)',
    			xs: 'var(--shadow-xs)',
    			sm: 'var(--shadow-sm)',
    			DEFAULT: 'var(--shadow)',
    			md: 'var(--shadow-md)',
    			lg: 'var(--shadow-lg)',
    			xl: 'var(--shadow-xl)',
    			'2xl': 'var(--shadow-2xl)'
    		},
    		animation: {
    			'float-slow': 'float-slow 6s ease-in-out infinite',
    			'float-medium': 'float-medium 8s ease-in-out infinite',
    			'float-slower': 'float-slower 10s ease-in-out infinite',
    			'float-slowest': 'float-slowest 12s ease-in-out infinite',
    			'pulse-slow': 'pulse-slow 7s ease-in-out infinite',
    			'slide-right': 'slide-right 15s linear infinite',
    			'slide-left': 'slide-left 15s linear infinite',
    			'slide-right-slower': 'slide-right-slower 20s linear infinite',
    			'slide-left-slower': 'slide-left-slower 20s linear infinite',
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			scroll: 'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite'
    		},
    		keyframes: {
    			'float-slow': {
    				'0%, 100%': { transform: 'translateY(0)' },
    				'50%': { transform: 'translateY(-10px)' }
    			},
    			'float-medium': {
    				'0%, 100%': { transform: 'translateY(0)' },
    				'50%': { transform: 'translateY(-15px)' }
    			},
    			'float-slower': {
    				'0%, 100%': { transform: 'translateY(0)' },
    				'50%': { transform: 'translateY(-20px)' }
    			},
    			'float-slowest': {
    				'0%, 100%': { transform: 'translateY(0)' },
    				'50%': { transform: 'translateY(-25px)' }
    			},
    			'pulse-slow': {
    				'0%, 100%': { opacity: '0.2', transform: 'scale(1)' },
    				'50%': { opacity: '0.3', transform: 'scale(1.05)' }
    			},
    			'slide-right': {
    				'0%': { transform: 'translateX(-100%)' },
    				'100%': { transform: 'translateX(100%)' }
    			},
    			'slide-left': {
    				'0%': { transform: 'translateX(100%)' },
    				'100%': { transform: 'translateX(-100%)' }
    			},
    			'slide-right-slower': {
    				'0%': { transform: 'translateX(-100%)' },
    				'100%': { transform: 'translateX(100%)' }
    			},
    			'slide-left-slower': {
    				'0%': { transform: 'translateX(100%)' },
    				'100%': { transform: 'translateX(-100%)' }
    			},
    			scroll: {
    				'0%': { transform: 'translateX(0%)' },
    				'100%': { transform: 'translateX(-100%)' }
    			},
    			'accordion-down': {
    				from: { height: '0' },
    				to: { height: 'var(--radix-accordion-content-height)' }
    			},
    			'accordion-up': {
    				from: { height: 'var(--radix-accordion-content-height)' },
    				to: { height: '0' }
    			}
    		},
    		rotate: {
    			'15': '15deg'
    		},
    		backgroundImage: {
    			noise: 'url("https://www.reactbits.dev/assets/noise.png")'
    		}
    	}
    }
}
```

## Global Styles (index.css)

```css
/* frontend/src/index.css */

/* Custom Braveold Bold font */
@font-face {
  font-family: 'Braveold';
  src: url('/fonts/Braveold_Bold.otf') format('opentype');
  font-weight: bold;
  font-display: swap;
}

/* BankGothic font */
@font-face {
  font-family: 'BankGothic';
  src: url('/fonts/BankGothic Md BT.ttf') format('truetype');
  font-display: swap;
}

@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: inherit;
}

:root {
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;

  /* Typography, colors, and theming managed by tweakcn system */
  color-scheme: light dark;

  /* Font loading optimization */
  font-display: swap;
}

/* Universal font loading optimization */
@font-face {
  font-display: swap;
}

/* Prevent FOUT by ensuring fallback fonts are similar */
body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  font-feature-settings: "kern" 1, "liga" 1;
  text-rendering: optimizeLegibility;
}

/* Optimize font loading for all text elements */
h1, h2, h3, h4, h5, h6, p, span, div, a, button, input, textarea {
  font-display: swap;
}

.App > div {
  display: flex;
  align-items: center;
  justify-content: center;
}

@layer components {
  .container {
    @apply mx-auto px-4;
  }

  @media (min-width: 640px) {
    .container {
      @apply px-6;
    }
  }

  @media (min-width: 1024px) {
    .container {
      @apply px-8;
    }
  }

  /* Theme-aware hover utilities */
  .hover-lift {
    @apply transition-all duration-200 hover:shadow-md hover:-translate-y-0.5;
  }

  .hover-primary {
    @apply hover:bg-primary hover:text-primary-foreground transition-colors duration-200;
  }

  .hover-accent {
    @apply hover:bg-accent hover:text-accent-foreground transition-colors duration-200;
  }

  .hover-muted {
    @apply hover:bg-muted hover:text-muted-foreground transition-colors duration-200;
  }

  .hover-fade {
    @apply hover:opacity-80 transition-opacity duration-200;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    letter-spacing: var(--letter-spacing);
  }

  /* Apply theme border radius to common elements */
  .card, [data-card], .rounded, .rounded-md, .rounded-lg, .rounded-xl {
    border-radius: var(--radius) !important;
  }

  /* For shadcn card components */
  [data-radix-card-root], [class*="card"] {
    border-radius: var(--radius) !important;
  }

  /* Base link styles - let components override as needed */
  a {
    color: inherit;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
  }

  a:not([class]):hover {
    color: var(--primary);
  }

  .link-muted {
    color: var(--muted-foreground);
  }

  .link-muted:hover {
    color: var(--foreground);
  }

  .link-accent {
    color: var(--accent-foreground);
  }

  .link-accent:hover {
    color: var(--accent-foreground);
    opacity: 0.8;
  }

  /* Enhanced button hover effects that work with theme variables */
  button:hover {
    transform: translateY(-1px);
  }

  button:active {
    transform: translateY(0);
  }

  /* Ensure focus rings use theme colors */
  button:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }

  /* Lighter placeholders for better UX */
  input::placeholder,
  textarea::placeholder {
    color: hsl(var(--muted-foreground) / 0.5);
    opacity: 1;
  }

  input::-webkit-input-placeholder,
  textarea::-webkit-input-placeholder {
    color: hsl(var(--muted-foreground) / 0.5);
    opacity: 1;
  }

  input::-moz-placeholder,
  textarea::-moz-placeholder {
    color: hsl(var(--muted-foreground) / 0.5);
    opacity: 1;
  }
}

/* Marquee animation */
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  animation: marquee 120s linear infinite;
}
```

## Design System Summary

### Color System
- Uses **oklch** color space via CSS custom properties
- All colors are theme-variable driven (no hardcoded hex/rgb)
- CSS variables like `--background`, `--foreground`, `--primary`, etc. are expected to be set by a theme (currently managed by "tweakcn system" per code comments)
- Semantic color pairs: each color has a `-foreground` counterpart for text on that background

### Typography
- Custom fonts: **Braveold** (bold display) and **BankGothic** (medium weight)
- Font families via CSS variables: `--font-sans`, `--font-serif`, `--font-mono`
- `@tailwindcss/typography` plugin available for prose content

### Spacing & Layout
- Custom `.container` class with responsive padding (px-4 / px-6 / px-8)
- Border radius via `--radius` CSS variable (lg/md/sm computed from it)
- Box shadows via CSS variables (`--shadow-2xs` through `--shadow-2xl`)

### Animations
- `tailwindcss-animate` plugin for enter/exit animations (used by shadcn Dialog, Toast, etc.)
- Custom float animations (4 variants with different speeds/amplitudes)
- Slide animations (left/right at two speeds)
- Scroll/marquee for continuous horizontal movement
- Accordion open/close transitions
- `framer-motion` / `motion` v12 available for programmatic animations

### Interaction Patterns
- Global button hover: `translateY(-1px)` lift on hover, reset on active
- Utility classes: `.hover-lift`, `.hover-primary`, `.hover-accent`, `.hover-muted`, `.hover-fade`
- Focus rings use `--ring` CSS variable
- Links: inherit color, no underline, transition 0.2s, hover uses `--primary`
