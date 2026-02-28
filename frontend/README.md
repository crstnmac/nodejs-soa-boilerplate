# Frontend README

React + Vite + Tailwind CSS v4 + shadcn/ui frontend for the SOA boilerplate.

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn UI components
│   │   ├── layout/          # Layout components
│   │   └── auth/            # Auth-specific components
│   ├── pages/                 # Route pages
│   ├── lib/                   # Utilities (API client, cn)
│   ├── hooks/                 # TanStack Query hooks
│   ├── types/                 # TypeScript types
│   ├── styles/                # Global CSS (Tailwind v4)
│   ├── App.tsx               # Main app component
│   └── main.tsx              # Entry point
├── public/                    # Static assets
├── components.json            # shadcn/ui configuration
├── index.html                 # HTML template
├── tailwind.config.ts         # Tailwind v4 config
├── vite.config.ts             # Vite configuration
├── package.json               # Dependencies
├── tsconfig.json             # TypeScript config
└── Dockerfile                 # Docker build file
```

## 📦 Tech Stack (Latest 2026)

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
| Lucide Icons | 0.468.0 | Icons |
| Axios | 1.8.4 | HTTP Client |
| shadcn/ui | Latest | UI Components |

## 🌟 What's New (Tailwind CSS v4)

- **New @tailwindcss/vite plugin** - Official Vite plugin
- **Updated config format** - `tailwind.config.ts` with new syntax
- **CSS variables for theming** - Built-in CSS custom properties
- **New @apply directives** - Support for nested selectors
- **Enhanced color palette** - HSL-based color system
- **Improved dark mode** - Better dark mode support

## 🌟 What's New (shadcn/ui Latest)

- **components.json configuration** - Modern component tracking
- **CLI improvements** - `npx shadcn@latest add` with better UX
- **New component architecture** - Using Radix UI primitives
- **Variants with CVA** - Class Variance Authority for type-safe variants
- **Improved TypeScript types** - Better type inference
- **Path aliases** - `@/` for cleaner imports

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

## 📄 Pages

| Route | Path | Description |
|-------|------|-------------|
| Sign In | `/sign-in` | Login form |
| Sign Up | `/sign-up` | Registration form |
| Dashboard | `/dashboard` | Main dashboard with navigation |
| Products | `/dashboard/products` | Product catalog with shopping cart |
| Orders | `/dashboard/orders` | Order history and tracking |
| Profile | `/dashboard/profile` | User profile management |

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

Available components: accordion, alert, avatar, checkbox, collapsible, dialog, dropdown-menu, input, label, select, separator, sheet, skeleton, switch, table, tabs, textarea, toast, tooltip, and many more!

## 🌙 Dark Mode

The frontend is dark-mode ready! The CSS variables support:
- `dark` class on body or HTML element
- Automatic color switching
- Preserves system preferences

To enable dark mode:
```tsx
// Add dark class
document.documentElement.classList.add('dark');
```

## 🔌 API Integration

The frontend connects to the API Gateway on `http://localhost:3000` by default.

**API Endpoints:**
- Auth: `/api/auth/*`
- Users: `/api/users/*`
- Products: `/api/products/*`
- Orders: `/api/orders/*`

## 🛒 Shopping Cart

- Add items to cart
- View cart summary
- Remove items from cart
- Checkout → Create order via API
- Cart is cleared after successful checkout

## 📦 Order Management

- View all orders with pagination
- Track order status (pending, processing, shipped, delivered)
- Cancel orders (only pending/processing)
- View order details with items

## 👤 User Profile

- View personal information
- Update name and email
- Change password
- Sign out

## 🚀 Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🐳 Docker

Build and run with Docker:
```bash
# Build
docker build -t soa-frontend .

# Run
docker run -p 5173:5173 soa-frontend
```

Or use the main `docker-compose.yml` to run all services.

## 📝 Notes

- All API requests include credentials for cookie-based auth
- TanStack Query caches data automatically with 5-minute stale time
- Form submissions use native HTML forms
- Responsive design works on all screen sizes
- Using `@/` path alias for cleaner imports
- Tailwind CSS v4 with @tailwindcss/vite plugin for best performance
