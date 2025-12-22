# TechTooTalk - Production Deployment Guide

A complete guide to deploying TechTooTalk to production with free course content for all students.

## Pre-Deployment Checklist

### Backend Setup
- [ ] MongoDB Atlas cluster created
- [ ] Environment variables configured
- [ ] Database seeded with content
- [ ] API endpoints tested
- [ ] Authentication working

### Frontend Setup
- [ ] Next.js build optimized
- [ ] Environment variables set
- [ ] API URL pointing to backend
- [ ] Mobile responsive tested
- [ ] All modals using class-based CSS

### Content Ready
- [ ] Database seeded with free courses
- [ ] All content marked as FREE
- [ ] Lessons and tutorials published
- [ ] Topics accessible to all students
- [ ] Admin accounts created

## Step 1: Seed Production Database

Before deploying to production, seed your MongoDB with free content:

```bash
# Navigate to backend
cd backend

# Connect to production MongoDB (ensure MONGODB_URI is set)
export MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/techtootalk

# Run complete seed
npm run seed

# Or run individual seeders
npm run seed:users      # Demo users and admin
npm run seed:plans      # Membership plans
npm run seed:content    # Courses, topics, tutorials (FREE)
```

**Expected Output:**
```
✅ Content seeding completed successfully!

📊 Summary:
   • 4 Technologies seeded
   • 4 Courses seeded (all FREE)
   • 3 Topics seeded (all FREE)
   • 4 Tutorials seeded (all FREE)

💡 All content is FREE for all students!
```

## Step 2: Backend Deployment (Node.js + Express)

### Deploy to Render / Railway / Heroku

#### Environment Variables
```env
# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/techtootalk

# JWT
JWT_SECRET=your_super_secret_jwt_key_12345
JWT_REFRESH_SECRET=your_refresh_token_secret_12345

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# File Upload
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment (optional)
STRIPE_SECRET_KEY=sk_live_xxxx
RAZORPAY_KEY_ID=key_xxxx
RAZORPAY_KEY_SECRET=secret_xxxx

# Frontend
FRONTEND_URL=https://your-domain.com

# Environment
NODE_ENV=production
PORT=5000
```

### Deployment Steps (Render Example)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Create Render Service**
   - Go to render.com
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Configure environment variables
   - Set start command: `npm run start`

3. **Deploy**
   - Render automatically deploys on push
   - Backend URL: `https://techtootalk-api.onrender.com`

## Step 3: Frontend Deployment (Next.js)

### Deploy to Vercel

#### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://techtootalk-api.onrender.com/api
```

### Deployment Steps

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd /path/to/techtootalk-learn
   vercel --prod
   ```

3. **Configure**
   - Select project name
   - Set environment variable `NEXT_PUBLIC_API_URL`
   - Domains: `yourdomain.com`

Or use GitHub integration:
- Go to vercel.com
- Import GitHub repository
- Set environment variables
- Auto-deploy on push to main

## Step 4: Database Management

### MongoDB Atlas Setup

1. **Create Cluster**
   - Go to mongodb.com
   - Create M0 (free) or M5 (paid) cluster
   - Region: Choose closest to your users

2. **Create Database User**
   - Database Access → Add User
   - Username: admin
   - Auto-generated password
   - Built-in Role: Atlas Admin

3. **Enable Network Access**
   - Network Access → Add IP Address
   - Allow `0.0.0.0/0` (or specific IPs)

4. **Get Connection String**
   ```
   mongodb+srv://admin:PASSWORD@cluster.mongodb.net/techtootalk
   ```

### Verify Seeded Content
```bash
# Connect using MongoDB Compass
mongodb+srv://admin:PASSWORD@cluster.mongodb.net/techtootalk

# Check collections:
# - users (should have admin user)
# - technologies (should have 4)
# - courses (should have 4)
# - topics (should have 3)
# - tutorialchapters (should have 4)
```

## Step 5: Domain Configuration

### DNS Setup

1. **Get your domain** (Namecheap, GoDaddy, etc.)

2. **Point to Vercel** (Frontend)
   ```
   A Record: @ → 76.76.19.89
   A Record: www → 76.76.19.89
   CNAME: _acme-challenge.yourdomain.com
   ```

3. **API Subdomain** (Optional - if not using Render)
   ```
   CNAME: api.yourdomain.com → api-server-url
   ```

## Step 6: SSL/HTTPS

All major providers (Vercel, Render) provide free SSL:
- Vercel: Automatic
- Render: Automatic
- MongoDB Atlas: TLS/SSL enabled

## Step 7: Monitoring & Logs

### Vercel
- Dashboard → Project → Deployments
- View real-time logs
- Monitor performance

### Render
- Dashboard → Service → Logs
- View deployment status
- Monitor health

### MongoDB Atlas
- Cluster → Metrics
- Monitor operations
- View database performance

## Step 8: Post-Deployment

### Test the Platform

1. **Test Frontend**
   ```bash
   curl https://yourdomain.com
   ```
   Should return Next.js HTML

2. **Test Backend**
   ```bash
   curl https://api.yourdomain.com/api/technologies
   ```
   Should return technologies JSON

3. **Test Authentication**
   ```bash
   curl -X POST https://api.yourdomain.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@skillstenz.com","password":"admin123"}'
   ```
   Should return access token

4. **Test Courses**
   - Navigate to `/courses`
   - Should display seeded courses
   - All should be FREE
   - Click on course → should see lessons

### Create Admin Account for Production

```bash
# Login with seeded admin
Email: admin@skillstenz.com
Password: admin123

# Change password immediately:
1. Go to Settings
2. Change Password
3. Use strong password
```

## Step 9: Continuous Integration/Deployment

### GitHub Actions Setup

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Backend
        run: |
          # Render will auto-deploy from GitHub
          
      - name: Deploy Frontend
        run: |
          # Vercel will auto-deploy from GitHub
          
      - name: Test Deployment
        run: |
          curl https://yourdomain.com/courses
```

## Step 10: Backup Strategy

### Daily Backups
```bash
# MongoDB Atlas → Backup & Restore
# Enable: Backup & Restore → Automatic Backup
# Frequency: Daily
# Retention: 7-90 days
```

### Database Export
```bash
# Monthly export to S3
mongodump \
  --uri="mongodb+srv://user:pass@cluster.mongodb.net/techtootalk" \
  --out=/backups/techtootalk-$(date +%Y-%m-%d)
```

## Performance Optimization

### Frontend (Next.js)
```bash
# Build optimization
npm run build

# Image optimization enabled in next.config.ts
# Automatic static generation for courses
```

### Backend (Node.js)
```bash
# Database indexing (already configured)
# Redis caching (optional)
# CDN for static assets (optional)
```

### Database (MongoDB)
```bash
# Indexes on:
# - users.email
# - courses.slug
# - technologies.slug
# - tutorials.slug
```

## Monitoring & Analytics

### Setup Google Analytics
```javascript
// In frontend
gtag.pageview({
  page_path: pathname,
  page_title: 'TechTooTalk'
});
```

### Error Tracking (Sentry)
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "YOUR_DSN",
  environment: "production",
});
```

## Security Checklist

- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] JWT secrets are strong
- [ ] Database credentials secured
- [ ] Rate limiting enabled
- [ ] Input validation in place
- [ ] SQL injection prevention
- [ ] CSRF protection enabled
- [ ] Admin password changed
- [ ] Secrets not in git history

## Troubleshooting

### Frontend not loading courses
```bash
# Check API URL
echo $NEXT_PUBLIC_API_URL
# Should point to backend

# Check CORS headers
curl -H "Origin: https://yourdomain.com" \
  https://api.yourdomain.com/api/technologies -v
```

### Backend not responding
```bash
# Check MongoDB connection
# Check environment variables
# View logs in Render/Railway
```

### Database empty after deployment
```bash
# Re-run seeding
export MONGODB_URI=your_production_uri
npm run seed
```

## Rollback Plan

If something goes wrong:

```bash
# Vercel - One-click rollback
# Dashboard → Deployments → Select previous → Promote

# Render - Redeploy previous version
# Dashboard → Manual Deploy → Select commit

# Database - Restore from backup
# MongoDB Atlas → Backup & Restore → Choose date
```

## Production URLs

After deployment, your platform will be available at:

- **Frontend**: `https://yourdomain.com`
- **API**: `https://api.yourdomain.com` (or subdomain)
- **Admin Panel**: `https://yourdomain.com/admin`
- **Courses**: `https://yourdomain.com/courses`
- **Technologies**: `https://yourdomain.com/technologies`

## Support

For deployment issues:
- Check platform-specific documentation
- Review backend logs
- Verify environment variables
- Test API endpoints manually
- Check database connection

---

**Status**: ✅ Production Ready
**Last Updated**: December 2025
**Content**: All FREE for students 🎓
