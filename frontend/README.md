# Frontend

React 19.2.0 + Vite 7.3.1 + Tailwind CSS v4 + shadcn/ui frontend for SOA boilerplate.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open browser:**
   Navigate to `http://localhost:5173`

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
│   ├── lib/                   # Utilities (API client, cn, utils)
│   ├── hooks/                 # TanStack Query hooks
│   ├── types/                 # TypeScript types
│   ├── styles/                # Global CSS (Tailwind v4)
│   ├── App.tsx               # Main app component
│   └── main.tsx              # Entry point
├── public/                    # Static assets
├── components.json            # shadcn/ui configuration
├── tailwind.config.ts         # Tailwind v4 config
├── vite.config.ts             # Vite configuration
├── tsconfig.app.json         # TypeScript config (app)
├── tsconfig.node.json         # TypeScript config (node)
├── package.json               # Dependencies
├── .env.example               # Environment template
├── .gitignore                 # Git exclusions
├── setup.js                   # Automated setup script
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
| Tailwind CSS | 4.1.1 | Styling |
| @tailwindcss/vite | 4.1.0 | Tailwind Vite Plugin |
| PostCSS | 8.4.49 | CSS Processing |
| Autoprefixer | 10.4.21 | Vendor Prefixes |
| Radix UI | Latest | Primitives |
| Class Variance Authority | 0.8.1 | Variants |
| Tailwind Merge | 2.6.0 | Utilities |
| Clsx | 2.1.0 | Conditional Classes |
| Lucide Icons | 0.468.0 | Icons |
| Axios | 1.8.4 | HTTP Client |

---

## 🎨 Tailwind CSS v4

### Key Features

- **@tailwindcss/vite plugin** - Official Vite plugin
- **CSS variables for theming** - HSL-based color system
- **Native cascade layers** - Better specificity handling
- **@theme directive** - Define custom properties
- **Container queries** - Built-in @min-* and @max-* variants
- **Dark mode ready** - CSS variables support

### Configuration

See `tailwind.config.ts` for full theme configuration.

---

## 🎨 shadcn/ui

### Configuration

See `components.json` for shadcn/ui settings.

### Add Components

```bash
# Using the shadcn CLI
npm run shadcn add [component-name]

# Examples:
npm run shadcn add accordion
npm run shadcn add dropdown-menu
npm run shadcn add dialog
npm run shadcn add table
npm run shadcn add tabs
npm run shadcn add form
```

Available components:
- accordion, alert, avatar, badge, button, calendar, card, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input, label, menubar, navigation-menu, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, skeleton, slider, switch, table, tabs, textarea, toast, toggle, tooltip

---

## 🔌 Features

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

## 📄 Pages

| Page | Path | Description |
|-------|------|-------------|
| Sign In | `/sign-in` | Login form |
| Sign Up | `/sign-up` | Registration form |
| Dashboard | `/dashboard` | Main dashboard with navigation |
| Products | `/dashboard/products` | Product catalog with shopping cart |
| Orders | `/dashboard/orders` | Order history and tracking |
| Profile | `/dashboard/profile` | User profile management |

---

## 📦 Usage

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
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

## 🌙 Dark Mode

The frontend is dark-mode ready! The CSS variables support:
- `dark` class on body or HTML element
- Automatic color switching
- Preserves system preferences

To enable dark mode:
```tsx
// Add dark class to HTML element
document.documentElement.classList.add('dark');
```

---

## 📝 Notes

- All API requests include credentials for cookie-based auth
- TanStack Query caches data automatically with 5-minute stale time
- Form submissions use native HTML forms
- Responsive design works on all screen sizes
- Using `@/` path alias for cleaner imports
- Tailwind CSS v4 with @tailwindcss/vite plugin for best performance
