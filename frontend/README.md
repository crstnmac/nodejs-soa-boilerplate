# Frontend README

This is the React + Vite frontend for the SOA Express boilerplate.

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
│   ├── styles/                # Global CSS
│   ├── App.tsx               # Main app component
│   └── main.tsx              # Entry point
├── public/                    # Static assets
├── index.html                 # HTML template
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Tailwind CSS config
├── postcss.config.js          # PostCSS config
├── package.json               # Dependencies
├── tsconfig.json             # TypeScript config
└── Dockerfile                 # Docker build file
```

## 📦 Tech Stack

| Package | Version |
|---------|----------|
| React | 19.2.0 |
| Vite | 7.3.1 |
| TanStack Query | 5.0.5 |
| TanStack Router | 2.1.7 |
| Sonner | 2.0.5 |
| Tailwind CSS | 4.0.11 |
| PostCSS | 8.4.49 |
| Autoprefixer | 10.4.21 |
| Lucide React | 0.468.0 |
| Axios | 1.8.4 |

## 🔌 Features

- **🔐 Authentication**: Sign up, sign in, sign out with Better Auth integration
- **🛒 Products**: Browse products, search, filter, add to cart, checkout
- **📦 Orders**: View order history, track status, cancel orders
- **👤 Profile**: View and update user profile, change password
- **🔒 Protected Routes**: Auth-aware routing with TanStack Router
- **⚡ Data Fetching**: TanStack Query with optimistic updates
- **🎨 Beautiful UI**: Shadcn UI components with Tailwind CSS
- **🔔 Toasts**: Sonner for beautiful notifications
- **📱 Responsive**: Mobile-friendly design
- **🌙 Dark Mode**: Theme support with CSS variables

## 📄 Pages

| Route | Path | Description |
|-------|------|-------------|
| Sign In | `/sign-in` | Login form |
| Sign Up | `/sign-up` | Registration form |
| Dashboard | `/dashboard` | Main dashboard with navigation |
| Products | `/dashboard/products` | Product catalog with shopping cart |
| Orders | `/dashboard/orders` | Order history and tracking |
| Profile | `/dashboard/profile` | User profile management |

## 🔌 API Integration

The frontend connects to the API Gateway on `http://localhost:3000` by default.

**API Endpoints:**
- Auth: `/api/auth/*`
- Users: `/api/users/*`
- Products: `/api/products/*`
- Orders: `/api/orders/*`

## 🎨 Shadcn UI Components

Used Shadcn UI components (built with Tailwind):
- Button
- Input
- Label
- Card (and sub-components)
- Badge

To add more components:
```bash
npx shadcn@latest add [component-name]
```

## 🔒 Authentication Flow

1. User signs in → Session stored in cookies
2. Session is sent with each API request (via `withCredentials: true`)
3. Backend validates session via User Service
4. Protected routes redirect to `/sign-in` if no session

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
- TanStack Query caches data automatically
- Form submissions use native HTML forms
- Responsive design works on all screen sizes
