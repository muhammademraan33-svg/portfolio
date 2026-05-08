# Dynamic Modern Portfolio Website

A full-stack portfolio website with an admin panel built with Next.js 16, TypeScript, Tailwind CSS v4, Prisma 7, and PostgreSQL.

---

## 🚀 Deploy to Railway (Step-by-Step)

### Step 1 — Push code to GitHub
Make sure your latest code is pushed to GitHub.

### Step 2 — Create a Railway account
Go to [railway.app](https://railway.app) and sign up (free tier available).

### Step 3 — Create a new project
1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Select your repository
4. Railway will detect it's a Next.js app automatically

### Step 4 — Add a PostgreSQL database
1. In your Railway project, click **+ New**
2. Select **Database → PostgreSQL**
3. Railway will provision a PostgreSQL instance and add `DATABASE_URL` to your environment automatically

### Step 5 — Set environment variables
In your Railway project → **Variables** tab, add these:

| Variable | Value |
|---|---|
| `DATABASE_URL` | *(auto-filled by Railway when you add PostgreSQL)* |
| `JWT_SECRET` | A random 32+ character string, e.g. `openssl rand -base64 32` |
| `ADMIN_USERNAME` | Your admin username (e.g. `admin`) |
| `ADMIN_PASSWORD` | A strong password (e.g. `MySecurePass123!`) |
| `NEXT_PUBLIC_SITE_URL` | `https://your-app.up.railway.app` *(your Railway domain)* |
| `NODE_ENV` | `production` |

### Step 6 — Trigger a deploy
Railway will auto-deploy when you push to GitHub. The build command runs:
```
prisma generate → prisma db push → next build
```
This automatically creates your database tables on first deploy.

### Step 7 — Seed the database (first time only)
After the first successful deploy, open Railway's **Shell** tab for your service and run:
```bash
npm run db:seed
```
This creates the admin user, sample projects, skills, and social links.

### Step 8 — Access your site
- **Portfolio**: `https://your-app.up.railway.app`
- **Admin Panel**: `https://your-app.up.railway.app/admin/login`
- Login with the `ADMIN_USERNAME` and `ADMIN_PASSWORD` you set above.

---

## 💻 Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL running locally (or use [Railway CLI](https://docs.railway.app/develop/cli) to proxy)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in values
cp .env.example .env

# 3. Create tables
npx prisma db push

# 4. Seed the database
npm run db:seed

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the portfolio.
Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin panel.

---

## 🔑 Admin Panel Features

| Feature | URL |
|---|---|
| Dashboard | `/admin/dashboard` |
| Projects (CRUD + image upload) | `/admin/projects` |
| About Me editor | `/admin/about` |
| Skills manager | `/admin/skills` |
| Social links | `/admin/social` |
| Contact messages | `/admin/messages` |

---

## 🗂 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| ORM | Prisma 7 |
| Database | PostgreSQL |
| Auth | JWT (jose) + HTTP-only cookies |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |

---

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── admin/          # Admin panel pages
│   ├── api/            # API routes
│   ├── projects/       # Public project detail pages
│   ├── globals.css
│   └── page.tsx        # Public homepage
├── components/
│   ├── admin/          # Admin panel components
│   ├── sections/       # Homepage section components
│   └── ui/             # Shared UI components
├── lib/
│   ├── prisma.ts       # Prisma client singleton
│   ├── auth.ts         # JWT auth helpers
│   └── utils.ts        # Utility functions
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.ts         # Database seeder
├── public/uploads/     # Uploaded project images
├── nixpacks.toml       # Railway build config
└── railway.toml        # Railway deploy config
```
