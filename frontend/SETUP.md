# Frontend Setup Guide

SOA Frontend with React 19.2.0 + Vite 7.3.1 + Tailwind CSS v4 + shadcn/ui

## 📦 Installation

### Option 1: Automated Setup (Recommended)

```bash
# Run the automated setup script
node setup.js
```

This will:
- Check Node.js version (requires 18+)
- Install all dependencies
- Create `.env` file
- Initialize git repository
- Create initial commit

### Option 2: Manual Setup

```bash
# Install dependencies
npm install

# Create .env file (copy .env.example to .env and update)
cp .env.example .env

# Initialize git (optional)
git init
git add .
git commit -m "Initial commit: SOA frontend with React + Vite + Tailwind v4 + shadcn/ui"
```

---

## 🚀 Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 🏗️ Build

```bash
# Build for production
npm run build
```

Output will be in the `dist/` directory.

---

## 📝 Configuration

### Environment Variables

Create a `.env` file in the root:

```env
# API Gateway URL
VITE_API_URL=http://localhost:3000

# Direct API URL (optional - for server-side rendering)
API_URL=http://localhost:3000
```

### shadcn/ui Configuration

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

---

## 🎨 Tailwind CSS v4

### Key Features

- **@tailwindcss/vite plugin** - Official Vite plugin
- **CSS variables for theming** - HSL-based color system
- **Native cascade layers** - Better specificity handling
- **@theme directive** - Define custom properties
- **Container queries** - Built-in @min-* and @max-* variants
- **Dark mode ready** - CSS variables support

### Configuration (`tailwind.config.ts`)

```typescript
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [default],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        // ... more CSS variables
      },
    },
  },
  plugins: [],
};
```

---

## 🎯 shadcn/ui

### Add New Components

```bash
# Using the shadcn CLI (recommended)
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
```

### Available Components

- accordion, alert, avatar, badge, button, calendar, card, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input, label, menubar, navigation-menu, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, skeleton, slider, switch, table, tabs, textarea, toast, toggle, tooltip

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
├── index.html                 # HTML template
├── tailwind.config.ts         # Tailwind v4 config
├── vite.config.ts             # Vite configuration
├── package.json               # Dependencies
├── tsconfig.app.json         # TypeScript config (app)
├── tsconfig.node.json         # TypeScript config (node)
├── postcss.config.js          # PostCSS config (legacy)
├── .env.example               # Environment template
├── .gitignore                 # Git exclusions
├── setup.js                   # Automated setup script
└── README.md                  # This file
```

---

## 🎨 CSS Variables

### Light Theme

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --card: 0 0% 100%;
  --destructive: 0 62.8% 30.6%;
  --border: 214.3 31.8% 91.4%;
}
```

### Dark Theme

```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --card: 222.2 84% 4.9%;
  --destructive: 0 62.8% 30.6%;
  --border: 217.2 32.6% 17.5%;
}
```

---

## 🌟 What's New vs Previous Version

### Tailwind CSS

| Feature | Old | New |
|---------|-----|-----|
| Plugin | tailwindcss | **@tailwindcss/vite** |
| Config format | CommonJS | **ES Module** |
| Theme system | Extend object | **CSS variables** |
| Dark mode | `.dark` class | **CSS variables** |
| Native layers | Plugin required | **Built-in** |

### shadcn/ui

| Feature | Old | New |
|---------|-----|-----|
| Config | .shadcnrc | **components.json** |
| Path aliases | Relative | **@/components, @/utils** |
| CLI | `npx shadcn` | **`npx shadcn@latest add`** |
| Variants | Manual | **CVA (type-safe)** |
| Icons | Inline | **Icon library config** |

---

## 🔧 Troubleshooting

### Dependencies Not Installing

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tailwind Classes Not Working

```bash
# Verify Tailwind v4 plugin is installed
npm list @tailwindcss/vite

# Check vite.config.ts includes the plugin
cat vite.config.ts
```

### shadcn/ui Components Not Found

```bash
# Verify components.json exists
cat components.json

# Check shadcn CLI can access the schema
npx shadcn@latest info
```

### Port Already in Use

```bash
# Kill process using port 5173 (Linux/macOS)
lsof -ti:5173 | xargs kill -9

# Kill process using port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <pid> /F
```

### Build Errors

```bash
# Clear TypeScript cache
rm -rf node_modules/.vite

# Rebuild
npm run build
```

---

## 📚 Documentation

- [Tailwind CSS v4 Docs](https://tailwindcss.com/blog/tailwindcss-v4-alpha)
- [shadcn/ui Docs](https://ui.shadcn.com/docs/installation)
- [Vite Docs](https://vitejs.dev/)
- [React 19 Docs](https://react.dev/blog/2024/12/19/react-19)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [TanStack Router Docs](https://tanstack.com/router/latest)
- [Sonner Docs](https://sonner.emilkowalski.com/)

---

## 📝 Notes

- All API requests are proxied through Vite to avoid CORS
- Session cookies are included automatically via `withCredentials: true`
- TanStack Query caches data with 5-minute stale time
- Sonner toasts appear in top-right corner
- Use `npm run shadcn add [component]` to add new UI components
- CSS variables support both light and dark themes
- `@/` path aliases make imports cleaner
