# TechTooTalk - AI-Powered Education & Career Platform

A comprehensive SaaS platform for education, coding, career management, AI assistance, and resume building.

## 🚀 Features

### For Students
- **Free Learning**: Access to basic technologies and courses
- **AI Assistant**: Get help with coding, career advice, and learning
- **Resume Builder**: Create professional resumes with templates
- **Profile Management**: Build and version your professional profile
- **Membership Plans**: Upgrade to Silver/Gold for premium features

### For Admins
- **Content Management**: Create and moderate educational content
- **User Management**: Manage users, memberships, and permissions
- **Analytics Dashboard**: Track usage, revenue, and engagement
- **AI Monitoring**: Monitor AI usage and performance

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
- **Authentication**: JWT-based auth with refresh tokens
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: OpenAI API for intelligent assistance
- **Payments**: Stripe integration for subscriptions
- **Security**: Rate limiting, input validation, CORS

### Frontend (Next.js + React)
- **UI Framework**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS
- **State Management**: React hooks and context
- **Authentication**: JWT token management

## 📁 Project Structure

```
techtootalk-learn/
├── backend/                    # Node.js backend
│   ├── src/
│   │   ├── modules/           # Feature modules
│   │   ├── middlewares/       # Express middlewares
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Utility functions
│   │   └── server.js         # Main server file
│   ├── package.json
│   └── README.md
├── app/                       # Next.js frontend
│   ├── (pages)/              # App router pages
│   ├── components/           # React components
│   ├── lib/                  # Utilities and data
│   └── globals.css           # Global styles
├── components/               # Shared components
├── lib/                      # Shared utilities
└── README.md
```

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Authentication**: JWT, bcrypt
- **Payments**: Stripe
- **AI**: OpenAI API
- **Deployment**: Docker, cloud platforms

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create .env file:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start MongoDB

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Install dependencies (from root):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## 🔐 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/techtootalk
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token

### Core Features
- `GET /api/technologies` - List technologies
- `POST /api/ai/query` - Query AI assistant
- `GET /api/resume` - Get user resume
- `POST /api/memberships/upgrade` - Upgrade membership

See backend README for complete API documentation.

## 🧪 Testing

### API Testing
Import `backend/TechTooTalk.postman_collection.json` into Postman.

### Manual Testing
1. Register a new user
2. Login and access dashboard
3. Try AI assistant (limited queries for free users)
4. Create/update resume
5. Upgrade membership (requires Stripe setup)

## 🚀 Deployment

### Backend Deployment
```bash
# Build and deploy
npm run build
npm start
```

### Frontend Deployment
```bash
# Build for production
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@techtootalk.com or join our Discord community.

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Video content platform
- [ ] Advanced AI features
- [ ] Multi-language support
- [ ] Enterprise plans
- [ ] API marketplace

---

Built with ❤️ for learners worldwide

1. Clone the repository:
```bash
git clone <repository-url>
cd techtootalk-learn
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Navigation
- **Homepage**: Features hero section, platform stats, and featured courses
- **Categories**: Browse courses by technology (React, Node.js, Python, etc.)
- **Courses**: Detailed course pages with descriptions and learning objectives
- **Sidebar**: Toggle navigation for easy category access

### Course Features
- **Load More**: Paginated course display for better performance
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Fast Loading**: Static generation ensures quick page loads

## 🏗️ Build & Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Lint Code
```bash
npm run lint
```

## 🎨 Customization

### Theming
The platform uses CSS custom properties for theming. Modify colors in `app/globals.css`:

```css
:root {
  --primary: #3b82f6;
  --secondary: #64748b;
  --accent: #f59e0b;
  /* ... other variables */
}
```

### Adding Courses
Update the course data in `lib/data.ts` to add new courses or categories.

### Component Styling
All components use Tailwind CSS classes. Customize styles by modifying the className props or extending the Tailwind configuration.

## 📱 Responsive Design

The platform is fully responsive with:
- Mobile-first approach
- Flexible grid layouts
- Adaptive navigation
- Touch-friendly interactions

## 🔍 SEO & Performance

- **Static Generation**: All pages pre-rendered for optimal performance
- **Meta Tags**: Comprehensive SEO metadata
- **Open Graph**: Social media sharing support
- **PWA Ready**: Progressive Web App capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Fonts by [Vercel](https://vercel.com/font)
