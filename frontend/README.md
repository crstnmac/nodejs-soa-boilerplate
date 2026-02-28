# Frontend Setup Guide

SOA Frontend with React 19.2.0 + Vite 7.3.1 + Tailwind CSS v4.1.0 + shadcn/ui

## 🚀 Getting Started

### Option 1: Manual Setup (Recommended)

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# Edit .env to set VITE_API_URL=http://localhost:3000

# 4. Start development server
npm run dev
```

### Option 2: Automated Setup

```bash
# Run setup script (checks Node version)
node setup.js
```

---

## 📦 Installation

```bash
cd frontend
npm install
```

---

## 🚀 Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 🏗️ Build

```bash
npm run build
```

Output will be in the `dist/` directory.

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Layout components
│   │   └── pages/           # Page components
│   ├── pages/                  # Route pages
│   ├── lib/                   # Utilities (API client, cn)
│   ├── hooks/                 # TanStack Query hooks
│   ├── types/                 # TypeScript types
│   ├── styles/                # Global CSS (Tailwind v4)
│   ├── App.tsx               # Main app component
│   └── main.tsx              # Entry point
├── public/                    # Static assets
├── components.json            # shadcn/ui configuration
├── tailwind.config.ts         # Tailwind v4.1.0 config
├── vite.config.ts             # Vite 7.3.1 configuration
├── package.json               # Dependencies
├── tsconfig.app.json         # TypeScript config (app)
├── tsconfig.node.json         # TypeScript config (node)
└── README.md                  # This file
```

---

## 📦 Tech Stack

| Package | Version | Purpose |
|---------|----------|----------|
| React | 19.2.0 | Frontend Framework |
| Vite | 7.3.1 | Build Tool |
| TanStack Query | 5.0.5 | Data Fetching |
| TanStack Router | 2.1.7 | Routing |
| Sonner | 2.0.5 | Toast Notifications |
| Tailwind CSS | 4.1.0 | Styling |
| @tailwindcss/vite | 4.1.0 | Tailwind Vite Plugin |
| PostCSS | 8.5.10 | CSS Processing |
| Autoprefixer | 10.5.10 | Vendor Prefixes |
| Radix UI | Latest | Primitives |
| Class Variance Authority | 0.8.1 | Variants |
| Tailwind Merge | 2.6.0 | Utilities |
| Clsx | 2.1.0 | Conditional Classes |
| Lucide Icons | 0.468.0 | Icons |
| Axios | 1.8.4 | HTTP Client |
| @tailwindcss/forms | 0.5.10 | Form Utilities |
| @tailwindcss/animate | 1.0.4 | Animations |

---

## 🎨 Tailwind CSS v4.1.0

### Key Features

- **@tailwindcss/vite Plugin** - Official Vite plugin for maximum performance
- **HSL Color System** - Wider gamut, P3 color space
- **CSS Variables for Theming** - Built-in CSS custom properties (no `theme.extend` needed)
- **@theme Directive** - Define custom CSS properties
- **Container Queries** - Built-in `@min/*` and `@max/*` variants
- **Native Cascade Layers** - Better specificity handling with standard CSS
- **No PostCSS Config** - Vite plugin handles it

### Configuration

See `tailwind.config.ts` for full theme configuration.

**Important:**
- The `theme: { extend: { ... } }` block is **removed** from `tailwind.config.ts`.
- All theming is done via CSS variables in `src/styles/index.css`.
- This is the **official "using-vite" method** recommended by Tailwind CSS v4.

### Using CSS Variables

Colors are defined in `src/styles/index.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... other variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  /* ... dark mode variables */
}
```

Access in CSS:
```css
.btn-primary {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}
```

### Dark Mode

Dark mode is enabled via CSS classes on the HTML element:

```css
.dark {
  /* Dark mode styles */
}
```

**To enable dark mode:**
```tsx
// Add dark class to HTML element
document.documentElement.classList.add('dark');
```

**To toggle dark mode:**
```tsx
const toggleDark = () => {
  document.documentElement.classList.toggle('dark');
};
```

---

## 🎨 shadcn/ui

### Configuration

The `components.json` file configures shadcn/ui:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/styles/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib"
  },
  "iconLibrary": "lucide"
}
```

### Add Components

```bash
cd frontend

# Using shadcn CLI (recommended)
npm run shadcn add [component-name]

# Examples:
npm run shadcn add accordion
npm run shadcn add dropdown-menu
npm run shadcn add dialog
npm run shadcn add table
npm run shadcn add tabs
npm run shadcn add form
npm run shadcn add sheet
npm run shadcn add skeleton
npm run shadcn add switch
npm run shadcn add separator
```

**Available Components:**
- accordion, alert, avatar, badge, button, calendar, card, checkbox, collapsible, command, context-menu, dialog, dropdown-menu, form, hover-card, input, label, menubar, navigation-menu, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, skeleton, slider, switch, table, tabs, textarea, toast, toggle, tooltip

---

## 🌟 Key Updates

### Tailwind CSS v4.1.0

1. **New Engine** - Rust-based, up to 10x faster builds
2. **Unified Toolchain** - Vite plugin replaces PostCSS config
3. **CSS Variables** - Native CSS custom properties for theming
4. **HSL Colors** - Wider gamut, P3 color space
5. **Base Colors** - Added neutral, stone, zinc
6. **No Config File** - Theme via CSS variables only

### shadcn/ui Latest

1. **components.json** - New configuration format
2. **CLI Improvements** - Better error messages and UX
3. **CVA Variants** - Type-safe variants with Class Variance Authority
4. **Path Aliases** - `@/components`, `@/utils`
5. **Icon Library** - Configured in components.json
6. **New Components** - Updated components using latest patterns

### Vite 7.3.1

1. **@tailwindcss/vite Plugin** - Official Vite plugin integration
2. **Autoprefixer** - Still included for vendor prefixes
3. **Better HMR** - Faster hot module replacement

---

## 🔒 Features

- **🔐 Authentication**: Sign up, sign in, sign out with Better Auth integration
- **🛒 Products**: Browse products, search, filter, add to cart, checkout
- **📦 Orders**: View order history, track status, cancel orders
- **👤 Profile**: View and update user profile, change password
- **🔒 Protected Routes**: Auth-aware routing with TanStack Router
- **⚡ Data Fetching**: TanStack Query with optimistic updates
- **🎨 Beautiful UI**: shadcn/ui components with Tailwind CSS v4
- **🔔 Toasts**: Sonner for beautiful notifications
- **📱 Responsive**: Mobile-friendly design
- **🌙 Dark Mode Ready**: Theme support with CSS variables

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Layout components
│   │   └── pages/           # Page components
│   ├── pages/                  # Route pages
│   ├── lib/                   # Utilities (API client, cn)
│   ├── hooks/                 # TanStack Query hooks
│   ├── types/                 # TypeScript types
│   ├── styles/                # Global CSS (Tailwind v4)
│   ├── App.tsx               # Main app component
│   └── main.tsx              # Entry point
├── public/                    # Static assets
├── components.json            # shadcn/ui configuration
├── tailwind.config.ts         # Tailwind v4 config
├── vite.config.ts             # Vite config
├── package.json               # Dependencies
├── tsconfig.app.json         # TypeScript config
├── tsconfig.node.json         # TypeScript config (node)
└── README.md                  # This file
```

---

## 📄 Pages

| Route | Path | Description |
|-------|------|-------------|
| Sign In | `/sign-in` | Login form |
| Sign Up | `/sign-up` | Registration form |
| Dashboard | `/dashboard` | Main dashboard with navigation |
| Products | `/dashboard/products` | Product catalog with shopping cart |
| Orders | `/dashboard/orders` | Order history and tracking |
| Profile | `/dashboard/profile` | User profile management |

---

## 🎨 UI Components (shadcn/ui)

Used components:
- Button - With variants (default, destructive, outline, secondary, ghost, link)
- Input - With proper styling and focus states
- Label - Form labels
- Card - Container components (Header, Content, Footer, Title, Description)
- Badge - Status indicators

To add more components:
```bash
npx shadcn@latest add [component-name]
```

---

## 🌙 Dark Mode

The frontend is dark-mode ready! The CSS variables support:
- `dark` class on body or HTML element
- Automatic color switching
- Preserves system preferences

**To enable dark mode:**
```tsx
// Add dark class to root
document.documentElement.classList.add('dark');

// Or use a toggle
const [darkMode, setDarkMode] = useState(false);
const toggle = () => setDarkMode(!darkMode);
```

**CSS Variables:**
```css
/* Light Mode */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
}

/* Dark Mode */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
}
```

---

## 🔌 API Integration

The frontend connects to the API Gateway on `http://localhost:3000` by default.

**API Endpoints:**
- Auth: `/api/auth/*`
- Users: `/api/users/*`
- Products: `/api/products/*`
- Orders: `/api/orders/*`

---

## 🛒 Shopping Cart

- Add items to cart
- View cart summary
- Remove items from cart
- Checkout → Create order via API
- Cart is cleared after successful checkout

---

## 📦 Order Management

- View all orders with pagination
- Track order status (pending, processing, shipped, delivered)
- Cancel orders (only pending/processing)
- View order details with items

---

## 👤 User Profile

- View personal information
- Update name and email
- Change password
- Sign out

---

## 🚀 Development

Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🐳 Docker

Build and run with Docker:
```bash
# Build
docker build -t soa-frontend .

# Run
docker run -p 5173:5173 soa-frontend
```

Or use the main `docker-compose.yml` to run all services.

---

## 📝 Notes

- All API requests include credentials for cookie-based auth
- TanStack Query caches data automatically with 5-minute stale time
- Form submissions use native HTML forms
- Responsive design works on all screen sizes
- Using `@/` path alias for cleaner imports
- Tailwind CSS v4.1.0 with @tailwindcss/vite plugin for best performance
- CSS variables for theming instead of JS theme object
