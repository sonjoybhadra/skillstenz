# TechTooTalk - AI-Powered Education Platform

## Architecture Overview

**Monorepo: 100% client-rendered Next.js SPA + modular Node.js/Express backend**
- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS - ALL pages use `'use client'`
- **Backend**: Node.js + Express + MongoDB with 30+ feature modules in `/backend`
- **API**: REST at `http://localhost:5000/api` (configurable via `NEXT_PUBLIC_API_URL`)
- **State**: JWT (access/refresh tokens) in localStorage, React Context for global state
- **Security**: Helmet, CORS, rate limiting (100/15min global, 10/15min auth, 5/1min AI), input validation, NoSQL injection prevention

## Critical Architecture Decisions

### Frontend is 100% Client-Rendered (Not Server-Rendered)
- Every page starts with `'use client'` directive - this enables client-side state + client-side data fetching
- `app/providers.tsx` wraps app with: `SettingsProvider` → `AuthProvider` → (GlobalLoader, Toast, SEO)
- `Layout.tsx` component wraps authenticated pages with Header/Sidebar/Footer navigation
- **Always check `useAuth().loading` state before rendering** - prevents hydration mismatch
- User data + tokens stored in localStorage; persist across sessions, cleared on logout

### Backend: Modular Feature-First Architecture
- **30 independent route modules** each with corresponding feature folder in `modules/`
- Example: `routes/courses.js` → `modules/courses/` contains coursesController.js + Course model
- **Middleware pattern**: `authenticate` middleware (JWT decode) → optional `requireAdmin`/`requireInstructor` → controller function
- Rate limiters applied per-route in `server.js` - auth endpoints are strictest (10/15min)
- All routes start in `server.js` - grep for `app.use('/api/` to find all endpoints

### Data Flow Example: Fetch User Courses
1. Frontend calls `coursesAPI.getEnrolled()` from `lib/api.ts`
2. Request includes `Authorization: Bearer {accessToken}` header
3. Backend `authenticate` middleware decodes JWT, verifies user, attaches `req.user`
4. Controller executes database query, returns typed response
5. Frontend updates state via hooks or Context

## Key Patterns & Conventions

### Frontend Page Pattern
```tsx
'use client';  // REQUIRED - all pages must have this
import Layout from '@/components/Layout';
import { useAuth } from '@/lib/auth';

export default function PageName() {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;  // MUST wait for auth to load
  if (!isAuthenticated) return null;  // Alternative: wrap with <ProtectedRoute>
  
  return (
    <Layout>
      {/* Page content */}
    </Layout>
  );
}
```

### API Usage Pattern (lib/api.ts)
```typescript
// All functions include Bearer token, typed responses, error handling
async function getEnrolled() {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE_URL}/courses/enrolled`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}

export const coursesAPI = { getEnrolled, /* ... */ };

// Usage in components:
const courses = await coursesAPI.getEnrolled();
```

### Backend Route Pattern
```javascript
const { authenticate, requireAdmin } = require('../middlewares/auth');
const router = express.Router();

// Public endpoint - no auth required
router.get('/public', courseController.getPublic);

// Protected endpoint - user must be authenticated
router.post('/enroll', authenticate, courseController.enroll);

// Admin-only endpoint - must be authenticated AND have admin role
router.delete('/:id', authenticate, requireAdmin, courseController.delete);

module.exports = router;
```

### Role-Based Access Control
- **Roles**: `admin` (system management), `student` (learner), `instructor` (content creator)
- **User types**: `fresher` (new), `experienced` (professional)
- **Frontend checks**: `useAuth().isAdmin`, `useAuth().user.role`
- **Backend checks**: `req.user.role === 'admin'`, `requireAdmin` middleware
- **Account blocking**: `req.user.accountStatus === 'blocked'` checked in auth middleware

## Developer Workflows

### Start Development (VS Code has background tasks)
```bash
# Terminal 1: Frontend (localhost:3000)
npm run dev

# Terminal 2: Backend (localhost:5000)
cd backend && npm run dev

# OR use VS Code Task UI: npm: dev and backend: dev
```

### Database Seeding
```bash
cd backend
npm run seed:live          # Master seeder (recommended) - all content
npm run seed:categories    # Just technology categories
npm run seed:technologies  # Just technologies
npm run seed:courses       # Just courses
npm run seed:topics        # Topics + lessons
npm run seed:users         # Just users
npm run seed:blog          # Blog articles

# Master seeder scripts in backend/scripts/ are latest approach
```

### Production Build & Test
```bash
npm run build              # Next.js optimized build
npm start                  # Serve production build locally
```

## File Reference Table

| File | Purpose | Key Content |
|------|---------|-------------|
| [lib/api.ts](lib/api.ts) | Typed API client (1362 lines) | `technologiesAPI`, `coursesAPI`, `usersAPI`, Bearer token handling |
| [lib/auth.tsx](lib/auth.tsx) | Auth context (163 lines) | `useAuth()`, `AuthProvider`, `ProtectedRoute`, JWT token management |
| [lib/settings.tsx](lib/settings.tsx) | Global settings | `useSettings()`, dark mode, theme preferences |
| [app/providers.tsx](app/providers.tsx) | Root providers | Provider stack order: Settings → Auth → Loaders → Toast |
| [components/Layout.tsx](components/Layout.tsx) | Page wrapper | All protected route paths, Header/Sidebar/Footer |
| [backend/src/server.js](backend/src/server.js) | Express setup (158 lines) | Security config, CORS, all route mounts, rate limiters |
| [backend/src/middlewares/auth.js](backend/src/middlewares/auth.js) | Auth middleware | `authenticate`, `requireAdmin`, JWT verification |

## Frontend Route Structure

**Public pages** (no auth check): `/`, `/technologies`, `/courses`, `/tutorials`, `/blog`, `/login`, `/register`
**Authenticated pages** (with `useAuth()` + layout): `/dashboard`, `/my-courses`, `/profile`, `/bookmarks`, `/settings`
**Admin pages** (checked in `admin/layout.tsx`): `/admin/*` (all subpages protected)
**Dynamic pages**: `/[technology]/`, `/courses/[slug]/`, `/ai-tools/[slug]/`, `/blog/[slug]/`

## Backend API Modules (30 routes)
`auth` | `users` | `profiles` | `courses` | `technologies` | `ai` | `admin` | `payments` | `bookmarks` | `certificates` | `cheatsheets` | `topics` | `tutorials` | `mcqs` | `roadmaps` | `blog` | `careers` | `memberships` | `plans` | `resume` | `interview` | `hackathons` | `internships` | `homepage` | `compiler` | `settings` | `cms` | `aitools` | `content`

## Common Tasks

**Add protected page**: Create `app/feature/page.tsx` with `'use client'`, import `Layout` + `useAuth`, check loading state
**Add API endpoint**: Create controller in `modules/`, route in `routes/`, typed function in `lib/api.ts`
**Add admin feature**: `/admin/feature/`, use `authenticate + requireAdmin` middleware, add to seed if needed
**Dark mode**: Already implemented - use `dark:` Tailwind classes, toggled via `useSettings()`

## UI Components
`components/UI/`: Button, Card, Modal, Input, Select, Badge, Spinner, Alert, Tabs, Tooltip, Avatar, Progress, Dropdown. All support dark mode via CSS variables.
