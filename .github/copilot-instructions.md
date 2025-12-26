# TechTooTalk - AI-Powered Education Platform

## Architecture Overview

**Monorepo with separate frontend and backend:**
- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB (in `/backend`)
- **API Communication**: REST API at `http://localhost:5000/api` (configurable via `NEXT_PUBLIC_API_URL`)

## Project Structure

```
app/                    # Next.js App Router pages
├── admin/             # Admin dashboard (role-protected)
├── [technology]/      # Dynamic technology routes
├── courses/, tutorials/, etc.  # Feature pages
components/            # Shared React components
├── UI/                # Reusable UI primitives (Button, Modal, Card, etc.)
├── Layout.tsx         # Main layout with Header/Sidebar/Footer
├── Header.tsx, Sidebar.tsx  # Navigation components
lib/                   # Shared utilities
├── api.ts             # API client with typed interfaces
├── auth.tsx           # AuthContext provider (JWT tokens in localStorage)
├── settings.tsx       # SettingsContext provider
backend/src/           # Express.js backend
├── modules/           # Feature modules (auth, courses, ai, etc.)
├── routes/            # API route handlers
├── models/            # Mongoose schemas
```

## Key Patterns & Conventions

### Frontend
- **All pages use `'use client'`** - This is a client-rendered SPA pattern
- **Layout wrapping**: Use `<Layout>` component for pages needing Header/Sidebar
- **Authentication**: Use `useAuth()` hook from `@/lib/auth` for user state
- **API calls**: Use typed API functions from `lib/api.ts` (e.g., `technologiesAPI.getAll()`)
- **Theming**: Dark mode via `dark:` Tailwind classes, toggle stored in localStorage
- **Styling**: Tailwind CSS with custom CSS variables in `globals.css`

### Component Patterns
```tsx
// Standard page structure
'use client';
import Layout from '../components/Layout';
import { useAuth } from '@/lib/auth';

export default function PageName() {
  const { user, isAuthenticated } = useAuth();
  return <Layout>{/* content */}</Layout>;
}
```

### Backend
- **Modular structure**: Each feature in `backend/src/modules/` (auth, courses, ai, etc.)
- **JWT auth**: Access + refresh tokens, middleware in `backend/src/middlewares/`
- **Validation**: `express-validator` for request validation
- **Rate limiting**: Applied globally, stricter on AI endpoints

## Developer Workflows

### Start Development
```bash
# Frontend (root directory)
npm run dev          # Next.js on http://localhost:3000

# Backend (backend directory)  
cd backend && npm run dev   # Express on http://localhost:5000
```

### Database Seeding
```bash
cd backend
npm run seed              # Seed all data
npm run seed:users        # Seed users only
npm run seed:content      # Seed course content
```

### VS Code Tasks Available
- `npm: dev` - Start frontend
- `backend: dev` - Start backend
- `npm: build` - Production build

## Important Files
- [lib/api.ts](lib/api.ts) - All API interfaces and client functions
- [lib/auth.tsx](lib/auth.tsx) - Authentication context and hooks
- [components/Layout.tsx](components/Layout.tsx) - Page layout with authenticated routes list
- [app/providers.tsx](app/providers.tsx) - Root providers (Auth, Settings, Toast)
- [backend/src/server.js](backend/src/server.js) - All API route registrations

## Admin vs User Routes
- Admin pages: `/admin/*` - Protected by role check in `admin/layout.tsx`
- Authenticated user pages: `/dashboard`, `/my-courses`, `/profile`, `/bookmarks`, etc.
- Public pages: `/`, `/technologies`, `/courses`, `/tutorials`, `/blog`

## UI Components
Reusable components in `components/UI/`: `Button`, `Card`, `Modal`, `Input`, `Select`, `Badge`, `Spinner`, `Alert`, `Tabs`, `Tooltip`, `Avatar`, `Progress`, `Dropdown`