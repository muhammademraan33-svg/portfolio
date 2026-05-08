# 🚀 Dynamic Modern Portfolio Website

A fully-featured, production-ready portfolio website with a secure admin panel built with Next.js 16, Prisma 7, Tailwind CSS, and Framer Motion.

## ✨ Features

### Public Portfolio
- 🎨 Stunning dark-themed design with animated particle hero
- ⚡ Framer Motion animations throughout
- 📱 Fully responsive (mobile, tablet, desktop)
- 🔤 Typing animation with rotating titles
- 📊 Animated skill progress bars
- 🗂️ Filterable projects grid
- 📝 Project detail pages with related projects
- 📬 Contact form with validation
- 🔗 Social media links
- ⚡ SEO-friendly with Next.js metadata API

### Admin Panel (`/admin`)
- 🔐 Secure JWT-based login
- 📊 Dashboard with stats & recent activity
- ➕ Add / Edit / Delete projects with image upload
- 👤 Manage About Me info (bio, photo, contact details)
- 💡 Manage skills with categories and proficiency levels
- 🔗 Manage social media links
- 📬 View contact form messages
- 🖼️ Drag & drop image uploads (5MB max)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Database | SQLite (via Prisma 7) |
| ORM | Prisma 7 + better-sqlite3 adapter |
| Auth | JWT (jose) + HTTP-only cookies |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Images | Next.js local uploads |
| Hosting | Vercel / Railway / Any Node.js host |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 20+ 
- npm 9+

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
The `.env` file is already created. Edit it with your values:
```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-min-32-chars"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Set up database
```bash
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
```

### 4. Start development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin panel.

**Default admin credentials:**
- Username: `admin`
- Password: `admin123`

> ⚠️ **Change the default credentials before deploying to production!**

---

## 🌐 Deployment Instructions

### Option 1: Deploy to Railway (Recommended — Easiest)

Railway supports Node.js + SQLite perfectly.

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial portfolio"
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

2. **Create Railway project**
   - Go to [railway.app](https://railway.app)
   - Click **New Project → Deploy from GitHub**
   - Select your repository

3. **Set environment variables** in Railway dashboard:
```
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=your-very-secure-secret-min-32-chars-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_SITE_URL=https://your-app.up.railway.app
```

4. **Add start command** in Railway settings:
```
npx prisma migrate deploy && npx tsx prisma/seed.ts && npm start
```

5. Your site will be live at `https://your-app.up.railway.app` ✅

---

### Option 2: Deploy to Render

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo
3. Set:
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npx prisma migrate deploy && npm start`
4. Add environment variables (same as Railway above)

---

### Option 3: Deploy to a VPS (Ubuntu)

```bash
# On your server
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio
npm install
cp .env.example .env   # Edit .env with production values
npx prisma migrate deploy
npx tsx prisma/seed.ts
npm run build
npm start
```

Use **Nginx** as a reverse proxy and **PM2** to keep it running:
```bash
npm install -g pm2
pm2 start npm --name "portfolio" -- start
pm2 startup
pm2 save
```

---

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── page.tsx              # Public portfolio homepage
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── admin/                # Admin panel pages
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── about/
│   │   ├── skills/
│   │   ├── social/
│   │   └── messages/
│   ├── api/                  # API routes
│   │   ├── auth/
│   │   ├── projects/
│   │   ├── about/
│   │   ├── skills/
│   │   ├── social/
│   │   ├── contact/
│   │   ├── messages/
│   │   └── upload/
│   └── projects/[slug]/      # Project detail page
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── sections/             # Portfolio sections
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   └── ContactSection.tsx
│   ├── admin/                # Admin components
│   │   ├── AdminSidebar.tsx
│   │   ├── ProjectForm.tsx
│   │   ├── AdminProjectsList.tsx
│   │   ├── AdminAboutForm.tsx
│   │   ├── AdminSkillsManager.tsx
│   │   ├── AdminSocialManager.tsx
│   │   └── AdminMessages.tsx
│   └── ui/
│       └── SocialIcons.tsx
├── lib/
│   ├── prisma.ts             # Prisma client singleton
│   ├── auth.ts               # JWT authentication
│   └── utils.ts              # Utility functions
├── hooks/
│   └── useInView.ts          # Intersection observer hook
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Database seed data
├── generated/
│   └── prisma/               # Generated Prisma client
├── public/
│   └── uploads/              # Uploaded images
└── prisma.config.ts          # Prisma configuration
```

---

## ⚙️ Admin Panel Guide

### Login
Navigate to `/admin` → redirects to `/admin/login`

### Managing Projects
- **View all**: `/admin/projects`
- **Add new**: Click "Add Project" button
- **Edit**: Click the edit icon on any project
- **Delete**: Click the delete icon → confirm dialog

### Uploading Images
Drag and drop or click to upload project images from the project form.
- Supported formats: JPG, PNG, WebP
- Max size: 5MB

### Customizing About Me
Go to `/admin/about` to update:
- Profile photo
- Name, title, bio
- Contact information
- Hero section text and typed subtitles

### Managing Skills
Go to `/admin/skills` to:
- Add new skills with category and proficiency level
- Edit inline by clicking the edit icon
- Delete skills

---

## 🔒 Security Notes

1. **Change default credentials** immediately after first login
2. **Set a strong JWT_SECRET** (32+ random characters)
3. The admin routes are server-protected with JWT cookies
4. All admin API routes verify authentication server-side
5. Image uploads are validated for type and size

---

## 🎨 Customization

### Colors
Edit `app/globals.css` to change the color scheme:
```css
:root {
  --primary: #6366f1;    /* Indigo */
  --accent: #8b5cf6;     /* Purple */
  --background: #0a0a0f; /* Near black */
}
```

### Personal Information
Update through the admin panel at `/admin/about`.

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npx prisma studio` | Open database GUI |
| `npx tsx prisma/seed.ts` | Re-seed database |

---

## 📄 License

MIT License — Feel free to use this for your own portfolio!
