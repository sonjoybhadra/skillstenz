# 🚀 Quick Reference - Seeding & Production

**TL;DR version for developers**

## Commands

```bash
# Install & setup
cd backend
npm install

# Seed database (LOCAL)
npm run seed              # All seeders
npm run seed:content      # Just courses/topics/tutorials
npm run seed:users        # Just users
npm run seed:plans        # Just plans

# Local development
npm run dev               # Start dev server (watch mode)
npm run start             # Start production server

# Production seeding
export MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/techtootalk"
npm run seed              # Run on production database
```

## What Gets Seeded

```
4 Technologies
├── JavaScript ⚡
├── Python 🐍
├── React ⚛️
└── Web Development 🌐

4 Courses (all FREE)
├── JavaScript Fundamentals (20h, Beginner, 5 lessons)
├── Python for Beginners (25h, Beginner, 3 lessons)
├── React Fundamentals (18h, Intermediate, 1 lesson)
└── [expandable]

3 Topics (all FREE)
├── DOM Manipulation (JavaScript)
├── File Handling (Python)
└── State Management (React)

4 Tutorials (all FREE)
├── Understanding Arrow Functions
├── List Comprehensions in Python
├── React Hooks Best Practices
└── Responsive Design Essentials
```

## Database Connection

```env
# Local
MONGODB_URI=mongodb://localhost:27017/techtootalk

# Production (Atlas)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/techtootalk
```

## Key Facts

| Aspect | Details |
|--------|---------|
| **Total Content** | 63+ hours |
| **Courses** | 4 (all FREE) |
| **Lessons** | 9+ (all FREE) |
| **Topics** | 3 (all FREE) |
| **Tutorials** | 4 (all FREE) |
| **Price** | $0 (everything free) |
| **Student Payment** | None required |

## Pre-Deployment Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster running and accessible
- [ ] `MONGODB_URI` environment variable set
- [ ] Backend API tested locally
- [ ] Frontend builds without errors
- [ ] All modals using class-based CSS ✅

## Production Deployment Flow

```
1. Set MONGODB_URI to production DB
   ↓
2. Run: npm run seed (populate content)
   ↓
3. Deploy backend to Render/Railway/Heroku
   ↓
4. Deploy frontend to Vercel/Netlify
   ↓
5. Test at yourdomain.com/courses
   ↓
6. Verify all courses show as FREE
   ↓
7. Go live! 🎉
```

## Verification

```bash
# Check MongoDB connection
mongosh "mongodb+srv://user:password@cluster.mongodb.net/techtootalk"

# List collections
show collections
# Should see: technologies, courses, topics, tutorialchapters, users, etc.

# Count documents
db.courses.countDocuments()      # Should be 4 or more
db.tutorials.countDocuments()    # Should be 4 or more
db.topics.countDocuments()       # Should be 3 or more
```

## API Endpoints (After Seeding)

```bash
# Get all free courses
GET /api/courses?free=true

# Get specific technology
GET /api/technologies/javascript

# Get tutorials
GET /api/tutorials?published=true

# Get topics for technology
GET /api/topics?technologyId=...

# Search across content
GET /api/search?q=javascript
```

## File Structure

```
backend/
├── scripts/
│   ├── seedUsers.js              # Create users
│   ├── seedPlans.js              # Create plans
│   └── seedCourseContent.js       # ← NEW: Courses, topics, tutorials
├── src/
│   ├── modules/
│   │   ├── courses/Course.js
│   │   ├── topics/Topic.js
│   │   ├── tutorials/Tutorial.js
│   │   └── ...
│   ├── server.js
│   └── seed.js
├── package.json                  # ← Updated with seed scripts
├── SEEDING.md                     # ← NEW: Detailed guide
└── .env                           # ← Set MONGODB_URI here
```

## Environment Variables Required

```env
# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/techtootalk

# JWT (keep same as before)
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Optional but recommended
NODE_ENV=production
PORT=5000
```

## Frontend Integration

### In `.env.local`
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Expected Frontend Routes
- `/courses` - Shows 4 free courses
- `/technologies` - Shows 4 technologies
- `/tutorials` - Shows 4 tutorials
- `/[technology]/` - Shows tech-specific content
- `/[technology]/courses/[slug]` - Course detail page

## Troubleshooting

### No data appears
```bash
# Verify database connection
npm run seed:content

# Check MongoDB connection string
echo $MONGODB_URI
```

### Courses show as paid
```javascript
// Issue: isFree not set properly
// Solution: Update in database or re-seed
db.courses.updateMany({}, { $set: { isFree: true, price: 0 } })
```

### API connection fails
```bash
# Check MONGODB_URI is set
env | grep MONGODB_URI

# Verify whitelist in MongoDB Atlas
# Network Access → Add current IP or 0.0.0.0/0
```

## Important Notes

⚠️ **BEFORE GOING LIVE:**
1. Change admin password from default
2. Set strong JWT secrets
3. Enable HTTPS/SSL
4. Set CORS to production domain
5. Enable rate limiting
6. Test payment integration (if using)

✅ **CONTENT IS FREE:**
- All courses: isFree = true, price = 0
- All lessons: isFree = true
- All topics: accessType = 'free'
- All tutorials: isPublished = true

## Quick URLs

| Page | URL | Content |
|------|-----|---------|
| Home | `/` | Featured courses |
| Courses | `/courses` | All 4 free courses |
| Technologies | `/technologies` | All 4 techs |
| Tutorials | `/tutorials` | All 4 tutorials |
| Admin | `/admin` | Manage content |

## Support Resources

- **Seeding Guide**: `/backend/SEEDING.md`
- **Deployment Guide**: `/PRODUCTION_DEPLOYMENT.md`
- **Content Structure**: `/FREE_CONTENT_STRUCTURE.md`
- **Seeding Summary**: `/SEEDING_SUMMARY.md`
- **This File**: `/QUICK_REFERENCE.md`

---

**Last Updated**: December 2025  
**Status**: ✅ Production Ready  
**Content**: All FREE
