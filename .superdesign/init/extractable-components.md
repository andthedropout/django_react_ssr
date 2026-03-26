# Extractable Components

Existing shadcn/ui components in `frontend/src/components/ui/` that are available for reuse when building out the landing page. These are already installed and ready to import.

## High Priority — Needed for Email Signup Form

### Button

Import: `import { Button } from "@/components/ui/button"`

Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
Sizes: `default` (h-9), `sm` (h-8), `lg` (h-10), `icon` (h-9 w-9)
Supports `asChild` prop for composing with links/other elements.

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### Input

Import: `import { Input } from "@/components/ui/input"`

Standard text input with theme-aware styling. Height h-9, supports all native input types.

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

### Label

Import: `import { Label } from "@/components/ui/label"`

Accessible form label built on Radix. Automatically handles `peer-disabled` states.

```tsx
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

## Medium Priority — Useful for Landing Page Sections

### Card

Import: `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@/components/ui/card"`

7 composable sub-components. Uses `data-slot` attributes for CSS targeting.

### Badge

Import: `import { Badge } from "@/components/ui/badge"`

Variants: `default`, `secondary`, `destructive`, `outline`. Good for "Early Access", "Beta", "Coming Soon" labels.

### Accordion

Import: `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"`

Built on Radix. Animated expand/collapse via `accordion-down`/`accordion-up` keyframes. Good for FAQ sections.

### Dialog

Import: `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"`

Animated overlay with fade + zoom + slide transitions. Good for signup confirmation, detail modals.

### Toast / Toaster

Import: `import { Toaster } from "@/components/ui/toaster"` + `import { useToast } from "@/hooks/use-toast"`

For success/error notifications after form submissions.

### Icon

Import: `import { Icon } from "@/components/ui/icon"`

Unified icon component. Lucide icons via name string (e.g., `<Icon name="ArrowRight" />`), Iconify via collection format (e.g., `<Icon name="logos:stripe" />`).

## Lower Priority — Available but Less Likely Needed

| Component | Import Path | Use Case |
|-----------|------------|----------|
| Tabs | `@/components/ui/tabs` | Feature comparison tabs |
| DropdownMenu | `@/components/ui/dropdown-menu` | Navigation menus |
| Popover | `@/components/ui/popover` | Tooltips, info popovers |
| Table | `@/components/ui/table` | Feature/pricing tables |
| Pagination | `@/components/ui/pagination` | Multi-page content |
| Calendar | `@/components/ui/calendar` | Date selection |
| DateTimePicker | `@/components/ui/datetime-picker` | Scheduling |
| Command | `@/components/ui/command` | Search/command palette |
| MultiSelect | `@/components/ui/multi-select` | Multi-option forms |

## Available Libraries (from package.json)

These are installed and ready to use in new components:

- **framer-motion / motion** v12.16.0 — Page transitions, scroll animations, stagger effects
- **lucide-react** v0.503.0 — 1500+ icons
- **@iconify/react** v6.0.2 — 200,000+ icons from all icon sets
- **@number-flow/react** v0.5.9 — Animated number transitions (good for stats/counters)
- **embla-carousel-react** v8.6.0 — Carousel/slider
- **zod** v3.25.51 — Form validation schemas
- **react-use-measure** v2.1.7 — Element measurement for animations
- **class-variance-authority** v0.7.1 — Component variant system
- **clsx** + **tailwind-merge** — Class merging utilities
