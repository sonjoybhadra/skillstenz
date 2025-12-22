# Quick Reference - Pages & Routes

## 🔗 URLs to Test

### Tutorial Pages
```
Tutorial List (all chapters):
http://localhost:3000/tutorials/responsive-design-essentials
http://localhost:3000/tutorials/javascript-fundamentals
http://localhost:3000/tutorials/python-basics
http://localhost:3000/tutorials/react-hooks

Tutorial Chapter (individual chapter):
http://localhost:3000/tutorials/responsive-design-essentials/introduction
http://localhost:3000/tutorials/javascript-fundamentals/variables-and-data-types
```

### Course Pages
```
Course Detail (all sections):
http://localhost:3000/courses/web-development
http://localhost:3000/courses/frontend-development
http://localhost:3000/courses/backend-development
http://localhost:3000/courses/full-stack-development

Course Lesson (individual lesson):
http://localhost:3000/courses/web-development/lesson/getting-started
http://localhost:3000/courses/frontend-development/lesson/html-basics
```

---

## 📂 File Locations

### New/Updated Files
```
app/tutorials/[slug]/page.tsx
└─ Tutorial list page (FIXED)

app/tutorials/[slug]/[chapter]/page.tsx
└─ Tutorial chapter page (NEW)

app/courses/[slug]/page.tsx
└─ Course detail page (UPDATED)

app/courses/[slug]/lesson/[lessonSlug]/page.tsx
└─ Course lesson page (NEW)
```

### Documentation Files
```
CODE_SNIPPETS.md
├─ Complete code for all pages
├─ API endpoint requirements
└─ CSS classes reference

PAGES_IMPLEMENTATION.md
├─ What was fixed
├─ Data flow diagrams
├─ TypeScript types
└─ Feature summary

IMPLEMENTATION_COMPLETE.md
├─ Objective summary
├─ Testing guide
├─ Future enhancements
└─ Verification checklist
```

---

## 🚀 Quick Start

### 1. Start Servers
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend && npm run dev
```

### 2. Seed Database
```bash
cd backend
npm run seed:content
```

### 3. Visit Pages
```
Tutorial: http://localhost:3000/tutorials/responsive-design-essentials
Chapter: http://localhost:3000/tutorials/responsive-design-essentials/introduction
Course: http://localhost:3000/courses/web-development
Lesson: http://localhost:3000/courses/web-development/lesson/getting-started
```

---

## 📋 Page Features at a Glance

### Tutorial Pages
✅ Fetch from API
✅ List all chapters
✅ Expand/collapse chapters
✅ Display chapter content
✅ Code examples
✅ Key points
✅ Difficulty badges
✅ Reading time estimates
✅ Chapter navigation
✅ Breadcrumbs
✅ Mobile responsive
✅ Error handling

### Course Pages
✅ Fetch from API
✅ List all sections
✅ Expandable sections
✅ Show lessons under sections
✅ Lesson content display
✅ Embedded videos
✅ CodeSandbox integration
✅ Resources/links
✅ Progress tracking
✅ Course progress bar
✅ Completed checkmarks
✅ Lesson navigation
✅ Breadcrumbs
✅ Mobile responsive
✅ Error handling

---

## 🔧 Key Components

### Tutorial Components
```
Tutorial Page
├─ Header (title, description)
├─ Sidebar
│  └─ Quick info
│     └─ Chapters list
│        └─ Resources
└─ Main
   └─ Chapters list with expand/collapse
      └─ Key points preview

Tutorial Chapter Page
├─ Breadcrumb
├─ Sidebar
│  └─ All chapters (sticky)
└─ Main
   ├─ Chapter header (title, time, difficulty)
   ├─ Chapter content
   ├─ Code examples
   ├─ Key points
   └─ Navigation (prev/next)
```

### Course Components
```
Course Page
├─ Breadcrumb
├─ Header (title, metadata)
├─ Actions (Start Course, Save)
└─ Sections
   └─ Expandable section
      └─ Lessons list

Course Lesson Page
├─ Breadcrumb
├─ Sidebar
│  ├─ Course info & progress
│  └─ Lessons list (with checkmarks)
└─ Main
   ├─ Lesson header
   ├─ Video (if available)
   ├─ Lesson content
   ├─ Code sandbox (if available)
   ├─ Resources
   ├─ Mark complete button
   └─ Navigation (prev/next)
```

---

## 🎨 CSS Classes Used

### Global Classes
```css
.card              /* Bordered container with padding */
.btn-primary       /* Blue button for main actions */
.btn-secondary     /* Secondary button */
.spinner           /* Loading animation */
```

### Tailwind Utilities (Most Common)
```css
text-[var(--foreground)]       /* Main text */
text-[var(--muted-foreground)] /* Secondary text */
bg-[var(--bg-primary)]         /* Main background */
bg-[var(--bg-secondary)]       /* Secondary background */
border-[var(--border)]         /* Border color */
text-sm, text-lg, text-4xl     /* Font sizes */
p-2, p-4, p-8                  /* Padding */
mb-4, mb-8                     /* Margin bottom */
flex, grid                     /* Layout */
grid-cols-1, lg:grid-cols-3    /* Responsive grid */
```

---

## 📊 Data Structure

### Tutorial
```typescript
interface Tutorial {
  _id: string;
  title: string;
  slug: string;
  description: string;
  chapters: Chapter[];
}

interface Chapter {
  _id: string;
  title: string;
  slug: string;
  content: string;
  keyPoints: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
}
```

### Course
```typescript
interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  sections: Section[];
}

interface Section {
  _id: string;
  title: string;
  lessons: Lesson[];
}

interface Lesson {
  _id: string;
  title: string;
  slug: string;
  content: string;
  duration: number;
  videoUrl?: string;
  codeSandbox?: string;
}
```

---

## 🔄 Data Flow

### Tutorial Flow
```
User visits /tutorials/[slug]
        ↓
Component loads → State: tutorial = null
        ↓
useEffect fires → Fetch /api/tutorials/[slug]
        ↓
Response received → State: tutorial = data
        ↓
Page renders with chapters list
        ↓
User clicks chapter → Navigate to /tutorials/[slug]/[chapter]
        ↓
Chapter page loads → Fetch /api/tutorials/[slug]
        ↓
Find chapter by slug → Display content
```

### Course Flow
```
User visits /courses/[slug]
        ↓
Component loads → State: course = null
        ↓
useEffect fires → Fetch /api/courses/[slug]
        ↓
Response received → State: course = data
        ↓
Page renders with sections list
        ↓
User clicks lesson → Navigate to /courses/[slug]/lesson/[slug]
        ↓
Lesson page loads → Fetch /api/courses/[slug]
        ↓
Find lesson by slug → Display content + progress
```

---

## 🐛 Troubleshooting

### "Tutorial not found"
- ✅ Check seeding: `npm run seed:content`
- ✅ Check API is running: `cd backend && npm run dev`
- ✅ Verify slug matches database
- ✅ Check browser console for API errors

### "Course not found"
- ✅ Check seeding: `npm run seed:content`
- ✅ Check API is running
- ✅ Verify slug in URL matches database
- ✅ Fallback data should show if available

### Pages show loading spinner forever
- ✅ Check backend is running
- ✅ Check API URL in .env: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
- ✅ Check network tab in DevTools for failed requests
- ✅ Look at console for fetch errors

### Styling looks wrong
- ✅ Check globals.css is loaded
- ✅ Check Tailwind is properly configured
- ✅ Clear browser cache (Ctrl+Shift+Delete)
- ✅ Restart dev server: `npm run dev`

---

## 📞 Support Resources

### Complete Code
See `CODE_SNIPPETS.md` for all complete page code

### Implementation Details
See `PAGES_IMPLEMENTATION.md` for technical details

### Summary
See `IMPLEMENTATION_COMPLETE.md` for overview

### API Schema
See backend `/api/routes/` for endpoint definitions

---

## ✨ Next Steps

1. **Test the pages** - Visit URLs above
2. **Check data display** - See fetched data in browser DevTools
3. **Review code** - Look at page implementations
4. **Customize styling** - Adjust colors/layout as needed
5. **Add more features** - See Future Enhancements section

---

## 🎉 You're All Set!

All pages are ready to use. Start your servers and enjoy!

```bash
npm run dev      # Frontend on http://localhost:3000
cd backend && npm run dev  # Backend on http://localhost:5000
```

Then visit:
```
http://localhost:3000/tutorials/responsive-design-essentials
http://localhost:3000/courses/web-development
```
