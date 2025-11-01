# ClickUp Clone - Full-Stack Project Management Application

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

Aplikasi manajemen proyek full-stack yang terinspirasi dari ClickUp, dibangun dengan teknologi modern untuk kolaborasi tim yang efektif.

## 🚀 Fitur Utama

### 📊 Project Management

- ✅ **Kanban Board** - Drag & drop task management dengan status (TODO, IN PROGRESS, IN REVIEW, DONE)
- ✅ **Task Priority System** - Low, Medium, High, Urgent dengan emoji indicators
- ✅ **AI-Powered Suggestions** - Generate task suggestions menggunakan Groq AI
- ✅ **Custom Emoji** - Pilih emoji untuk setiap task sebagai visual indicator
- ✅ **Task Assignment** - Assign task ke team members
- ✅ **Due Dates** - Set deadline untuk setiap task
- ✅ **Task Statistics** - Real-time dashboard dengan analytics

### 👥 Team Collaboration

- ✅ **Project Members Management** - Tambah/hapus member via email
- ✅ **Role-Based Access Control** - 4 level akses (OWNER, ADMIN, MEMBER, VIEWER)
- ✅ **Shared Projects** - Kolaborasi dengan multiple team members
- ✅ **Real-time Chat** - Socket.io untuk komunikasi instant
- ✅ **Activity Tracking** - Monitor aktivitas project dan team

### 📝 Document Management

- ✅ **Rich Text Editor** - Create dan edit documents dengan formatting
- ✅ **Document Sharing** - Otomatis shared dengan project members
- ✅ **Project Organization** - Documents terorganisir per project
- ✅ **Version Tracking** - Timestamps untuk created dan updated

### 🔐 Authentication & Security

- ✅ **Email/Password Authentication** - Traditional login system dengan bcrypt hashing
- ✅ **GitHub OAuth** - Sign in dengan GitHub account (One-click login)
- ✅ **JWT Tokens** - Secure authentication dengan 7-day expiry
- ✅ **Session Management** - Express session untuk OAuth flows
- ✅ **Password Security** - bcrypt dengan salt rounds untuk secure storage
- ✅ **Protected Routes** - Middleware authentication untuk API endpoints

### 🎨 User Experience

- ✅ **Responsive Design** - Mobile-friendly interface dengan TailwindCSS
- ✅ **Modern UI** - Gradient backgrounds, smooth animations, hover effects
- ✅ **Loading States** - Skeleton loaders dan loading indicators
- ✅ **Toast Notifications** - Real-time feedback dengan React Hot Toast
- ✅ **Dashboard Analytics** - Visual statistics dengan cards dan badges
- ✅ **Intuitive Navigation** - Sidebar dengan active route indicators

## 📋 Tech Stack

### Frontend

- **React 18.3** - Modern UI library with latest features
- **TypeScript 5.6** - Type-safe development
- **Vite 5.4** - Lightning-fast build tool and dev server
- **TailwindCSS 3.4** - Utility-first CSS framework
- **React Router 6.28** - Client-side routing
- **TanStack Query 5** - Powerful server state management
- **Zustand 5** - Lightweight client state management
- **Socket.io Client 4.8** - Real-time communication
- **Axios 1.7** - HTTP client
- **@dnd-kit** - Modern drag-and-drop toolkit

### Backend

- **Node.js & Express 4.21** - Server framework
- **TypeScript 5.6** - Type-safe backend
- **PostgreSQL** - Relational database
- **Prisma 5.21** - Next-generation ORM
- **Socket.io 4.8** - Real-time WebSocket server
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Passport.js** - OAuth authentication (GitHub)
- **Express Session** - Session management
- **Groq SDK** - AI task suggestions
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
ClickUp/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── stores/          # Zustand state stores
│   │   ├── lib/             # Utilities (API, Socket)
│   │   ├── types/           # TypeScript type definitions
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Application entry point
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                 # Express backend server
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── middleware/      # Auth & other middleware
│   │   ├── socket.ts        # Socket.io configuration
│   │   └── index.ts         # Server entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
│
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ClickUp
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (frontend + backend)
npm run install:all
```

### 3. Set Up Environment Variables

#### Backend (.env)

Create `backend/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/clickup_clone?schema=public"

# JWT & Session Secrets
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SESSION_SECRET=your-session-secret-change-this-in-production

# Frontend URL (untuk CORS & OAuth redirects)
CLIENT_URL=http://localhost:3000

# Groq AI API Key (Get from: https://console.groq.com/)
GROQ_API_KEY=your-groq-api-key-here

# GitHub OAuth (Get from: https://github.com/settings/developers)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

**Important:**

- Replace `postgres` dan `yourpassword` dengan PostgreSQL credentials Anda
- Generate strong secrets untuk JWT_SECRET dan SESSION_SECRET
- Dapatkan Groq API Key dari [console.groq.com](https://console.groq.com/)
- Setup GitHub OAuth di [GitHub Developer Settings](https://github.com/settings/developers)

#### Frontend (.env)

Create `frontend/.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

**Note:** Frontend environment variables akan auto-reload jika berubah saat development.

### 4. Database Setup

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view/edit data
npm run prisma:studio
```

### 5. Start the Application

#### Development Mode (Both servers)

From the root directory:

```bash
npm run dev
```

This will start:

- Frontend on `http://localhost:3000`
- Backend on `http://localhost:5000`

#### Or start them separately:

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

### 6. Build for Production

```bash
# Build both frontend and backend
npm run build

# Start production server
npm start
```

## 🔑 API Endpoints

### Authentication

- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login dengan email/password
- `GET /api/auth/me` - Get current user data (protected)
- `GET /api/auth/github` - Initiate GitHub OAuth flow
- `GET /api/auth/github/callback` - GitHub OAuth callback handler

### Projects

- `GET /api/projects` - Get all accessible projects (protected)
- `GET /api/projects/:id` - Get single project details (protected)
- `POST /api/projects` - Create new project (protected)
- `PUT /api/projects/:id` - Update project (protected, owner/admin only)
- `DELETE /api/projects/:id` - Delete project (protected, owner only)
- `POST /api/projects/:id/members` - Add member to project (protected, owner/admin only)
- `DELETE /api/projects/:id/members/:userId` - Remove member (protected, owner/admin only)
- `PATCH /api/projects/:id/members/:userId` - Update member role (protected, owner only)

### Tasks

- `GET /api/tasks` - Get tasks with filters (projectId, status, priority) (protected)
- `GET /api/tasks/:id` - Get single task (protected)
- `POST /api/tasks` - Create new task (protected)
- `PATCH /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)

### Documents

- `GET /api/documents` - Get accessible documents (protected)
- `GET /api/documents/:id` - Get single document (protected)
- `POST /api/documents` - Create document (protected)
- `PUT /api/documents/:id` - Update document (protected)
- `DELETE /api/documents/:id` - Delete document (protected)

### Messages

- `GET /api/messages` - Get chat messages (with optional projectId filter) (protected)
- `POST /api/messages` - Send chat message (protected)

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics (protected)

### AI

- `POST /api/ai/suggest-tasks` - Get AI-generated task suggestions (protected)
  - Body: `{ projectName: string, projectDescription?: string }`

### Health Check

- `GET /` - API welcome page dengan endpoint list
- `GET /api/health` - Health check endpoint

## 🔌 WebSocket Events

### Client → Server

- `chat:send` - Send chat message
- `project:join` - Join project room
- `project:leave` - Leave project room

### Server → Client

- `chat:message` - Receive chat message

## 📝 Database Schema

### User

```prisma
id          String    @id @default(uuid())
email       String    @unique
name        String
password    String    // Empty string untuk OAuth users
avatar      String?
googleId    String?   @unique
githubId    String?   @unique
createdAt   DateTime  @default(now())
updatedAt   DateTime  @updatedAt
```

### Project

```prisma
id          String   @id @default(uuid())
name        String
description String?
color       String   @default("#0ea5e9")
ownerId     String
createdAt   DateTime @default(now())
updatedAt   DateTime @updatedAt
```

### ProjectMember

```prisma
id        String     @id @default(uuid())
projectId String
userId    String
role      MemberRole @default(MEMBER)  // OWNER, ADMIN, MEMBER, VIEWER
createdAt DateTime   @default(now())

@@unique([projectId, userId])
```

### Task

```prisma
id          String       @id @default(uuid())
title       String
description String?
status      TaskStatus   @default(TODO)  // TODO, IN_PROGRESS, IN_REVIEW, DONE
priority    TaskPriority @default(MEDIUM)  // LOW, MEDIUM, HIGH, URGENT
emoji       String       @default("📋")
projectId   String
assigneeId  String?
creatorId   String
dueDate     DateTime?
createdAt   DateTime     @default(now())
updatedAt   DateTime     @updatedAt
```

### ChatMessage

```prisma
id        String   @id @default(uuid())
content   String
senderId  String
projectId String?  // Optional - untuk group chat per project
createdAt DateTime @default(now())
```

### Document

```prisma
id        String   @id @default(uuid())
title     String
content   String   @db.Text
projectId String
creatorId String
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

### Enums

**MemberRole:**

- `OWNER` - Full control, can delete project
- `ADMIN` - Can manage members & settings
- `MEMBER` - Can create & edit tasks/docs
- `VIEWER` - Read-only access

**TaskStatus:**

- `TODO` - Not started
- `IN_PROGRESS` - Currently working
- `IN_REVIEW` - Awaiting review
- `DONE` - Completed

**TaskPriority:**

- `LOW` - Low priority
- `MEDIUM` - Medium priority
- `HIGH` - High priority
- `URGENT` - Urgent priority

## 🎨 UI Components

- **Layout** - Main application layout with sidebar navigation
- **Dashboard** - Statistics and overview cards
- **Projects** - Project list and creation modal
- **Tasks** - Task management with status badges
- **Chat** - Real-time messaging interface
- **Documents** - Document editor (placeholder)
- **Settings** - User preferences and profile

## 🔒 Authentication Flow

1. User registers/logs in
2. Server generates JWT token
3. Client stores token in localStorage
4. Token included in API requests via Axios interceptor
5. Socket.io authenticates using the same token

## 🚦 Task Statuses

- **TODO** - Not started
- **IN_PROGRESS** - Currently working
- **IN_REVIEW** - Awaiting review
- **DONE** - Completed

## ⚡ Task Priorities

- **LOW** - Low priority
- **MEDIUM** - Medium priority
- **HIGH** - High priority
- **URGENT** - Urgent priority

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## � GitHub OAuth Setup Guide

Untuk mengaktifkan login dengan GitHub:

### 1. Create OAuth App di GitHub

1. Buka [GitHub Developer Settings](https://github.com/settings/developers)
2. Klik **"New OAuth App"**
3. Isi form dengan data berikut:
   - **Application name**: `ClickUp Clone` (atau nama lain yang Anda inginkan)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:5000/api/auth/github/callback`
4. Klik **"Register application"**

### 2. Copy Credentials

1. Setelah app dibuat, copy **Client ID**
2. Klik **"Generate a new client secret"**
3. Copy **Client Secret** (hanya muncul sekali!)

### 3. Update Backend .env

Paste credentials ke file `backend/.env`:

```env
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
```

### 4. Restart Backend Server

```bash
cd backend
npm run dev
```

### 5. Test OAuth Flow

1. Buka `http://localhost:3000/login`
2. Klik **"Sign in with GitHub"**
3. Authorize aplikasi di GitHub
4. Anda akan di-redirect kembali dengan login berhasil

**Note:** Untuk production, update callback URL di GitHub OAuth settings dengan domain production Anda.

## 🤖 Groq AI Setup Guide

Untuk mengaktifkan AI-powered task suggestions:

### 1. Create Groq Account

1. Buka [Groq Console](https://console.groq.com/)
2. Sign up atau login dengan akun existing
3. Verify email jika diminta

### 2. Generate API Key

1. Di dashboard, klik **"API Keys"**
2. Klik **"Create API Key"**
3. Beri nama (contoh: "ClickUp Clone Dev")
4. Copy API Key yang di-generate

### 3. Update Backend .env

Paste API key ke file `backend/.env`:

```env
GROQ_API_KEY=gsk_your_api_key_here
```

### 4. Restart Backend Server

```bash
cd backend
npm run dev
```

### 5. Test AI Suggestions

1. Buka project di aplikasi
2. Klik **"AI Suggestions"**
3. AI akan generate task ideas berdasarkan project context
4. Click suggestion untuk auto-fill form

**Note:** Groq API memiliki free tier yang cukup generous untuk development.

## 🗄️ Database Management

### Prisma Studio (Recommended)

GUI tool untuk manage database:

```bash
cd backend
npx prisma studio
```

Buka browser di `http://localhost:5555`. Anda bisa:

- View semua tables (User, Project, Task, dll)
- Add, edit, delete records
- Filter dan search data
- Export data

### psql Command Line

Untuk power users yang suka terminal:

```bash
# Login ke PostgreSQL
psql -U postgres -d clickup_clone

# View semua users
SELECT * FROM "User";

# View projects dengan owner info
SELECT p.name, u.name as owner
FROM "Project" p
JOIN "User" u ON p."ownerId" = u.id;

# Exit
\q
```

### pgAdmin

Install [pgAdmin](https://www.pgadmin.org/) untuk GUI yang lebih advanced:

1. Download dan install pgAdmin
2. Add new server dengan credentials PostgreSQL Anda
3. Browse database `clickup_clone`
4. Run SQL queries atau manage via GUI

## 🎯 Usage Guide

### 1. Register / Login

**Via Email:**

1. Buka `http://localhost:3000/register`
2. Isi nama, email, dan password
3. Klik **"Register"**

**Via GitHub OAuth:**

1. Buka `http://localhost:3000/login`
2. Klik **"Sign in with GitHub"**
3. Authorize di GitHub
4. Auto-login dan redirect ke dashboard

### 2. Create Project

1. Di dashboard, klik **"Create Project"**
2. Isi:
   - **Name**: Nama project
   - **Description**: Deskripsi (optional)
   - **Color**: Pilih warna untuk visual identity
3. Klik **"Create"**

### 3. Add Team Members

1. Buka project yang sudah dibuat
2. Klik tab **"Team"**
3. Klik **"Add Member"**
4. Isi email team member (harus sudah registered)
5. Pilih role:
   - **OWNER** - Full control (auto untuk creator)
   - **ADMIN** - Manage members & full edit
   - **MEMBER** - Create & edit tasks/docs
   - **VIEWER** - Read-only
6. Klik **"Add Member"**

**Role Permissions:**

- OWNER: Delete project, manage all members
- ADMIN: Add/remove members, edit everything
- MEMBER: Create/edit tasks & documents
- VIEWER: View only, no editing

### 4. Create & Manage Tasks

**Create Task:**

1. Di project page, klik **"Add Task"**
2. Isi form:
   - **Emoji**: Klik untuk pilih custom emoji
   - **Title**: Nama task
   - **Description**: Detail task (optional)
   - **Status**: TODO, IN PROGRESS, IN REVIEW, DONE
   - **Priority**: LOW, MEDIUM, HIGH, URGENT
   - **Assignee**: Pilih team member (optional)
   - **Due Date**: Set deadline (optional)
3. Klik **"Create Task"**

**Update Task:**

- Klik task untuk edit inline
- Update status dengan dropdown
- Change priority dengan dropdown
- Drag & drop untuk reorder (jika Kanban view aktif)

**Delete Task:**

- Klik icon delete di task card
- Confirm deletion

### 5. AI Task Suggestions

1. Di project page, klik **"AI Suggestions"**
2. AI akan analyze project context
3. Generate 5-10 task ideas dengan:
   - Smart titles
   - Relevant descriptions
   - Suggested priorities
   - Auto emoji selection
4. Klik suggestion untuk auto-fill create form
5. Edit jika perlu, lalu create

**Tips:**

- Berikan project description yang jelas untuk hasil lebih baik
- AI learn dari existing tasks (jika ada)
- Generate ulang jika kurang sesuai

### 6. Manage Documents

1. Klik **"Documents"** di sidebar
2. Klik **"Create Document"**
3. Pilih project
4. Isi title dan content
5. Klik **"Create"**

Documents otomatis shared dengan semua project members sesuai role mereka.

### 7. Real-time Chat

1. Klik **"Chat"** di sidebar
2. Pilih project untuk group chat (optional)
3. Ketik pesan dan kirim
4. Real-time updates dengan Socket.io
5. All project members akan menerima notifikasi

### 8. Dashboard & Analytics

Dashboard menampilkan:

- **Total Projects**: Jumlah projects yang Anda miliki/akses
- **Active Tasks**: Tasks dengan status selain DONE
- **Completed Tasks**: Tasks dengan status DONE
- **Recent Projects**: 5 projects terbaru
- **Task Priority Distribution**: Visual breakdown

## 🐛 Troubleshooting

### Port Already in Use

**Windows (PowerShell):**

```powershell
# Kill process di port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# Kill process di port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

**Linux/Mac:**

```bash
# Kill port 5000
lsof -ti:5000 | xargs kill -9

# Kill port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error

1. **Check PostgreSQL Status:**

   ```bash
   # Windows (Services)
   services.msc  # Cari "postgresql" dan pastikan running

   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. **Test Connection:**

   ```bash
   psql -U postgres -d clickup_clone
   ```

3. **Check .env DATABASE_URL:**

   - Username dan password benar?
   - Port 5432 correct?
   - Database name `clickup_clone` exists?

4. **Create Database Manual:**
   ```bash
   psql -U postgres
   CREATE DATABASE clickup_clone;
   \q
   ```

### Prisma Client Error

```bash
cd backend

# Regenerate Prisma Client
npx prisma generate

# Push schema ke database
npx prisma db push

# Jika masih error, reset database
npx prisma migrate reset
```

### CORS Error

**Symptom:** API requests failed dengan CORS error di browser console

**Solution:**

1. Check `CLIENT_URL` di `backend/.env`
2. Pastikan match dengan port frontend actual
3. Jika frontend running di port 3002, update:
   ```env
   CLIENT_URL=http://localhost:3002
   ```
4. Restart backend server

### OAuth Stuck at Callback

**Symptom:** Setelah authorize di GitHub, stuck di `/oauth-callback` page

**Solution:**

1. Check `CLIENT_URL` di backend `.env` - harus match frontend port
2. Update GitHub OAuth settings:
   - Homepage URL: `http://localhost:{frontend_port}`
   - Callback URL: `http://localhost:5000/api/auth/github/callback`
3. Clear browser cookies
4. Restart backend
5. Try OAuth flow lagi

### Cannot Login with Existing Account

**Symptom:** Error "Please sign in with GitHub" saat login dengan email/password

**Cause:** Account dibuat via GitHub OAuth (password empty)

**Solution:**

1. Use GitHub OAuth untuk login
2. Atau, reset password via Prisma Studio:
   ```bash
   cd backend
   npx prisma studio
   ```
3. Find user, update password dengan bcrypt hash baru

### Frontend Build Error

```bash
cd frontend

# Clear node_modules dan cache
rm -rf node_modules .vite
npm install

# Rebuild
npm run build
```

### Backend TypeScript Error

```bash
cd backend

# Clean build
rm -rf dist node_modules
npm install
npm run build
```

## 🚀 Deployment Guide

### Backend Deployment (Heroku)

```bash
# Install Heroku CLI (if not installed)
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create your-clickup-clone-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:essential-0

# Set environment variables
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set SESSION_SECRET=$(openssl rand -base64 32)
heroku config:set NODE_ENV=production
heroku config:set CLIENT_URL=https://your-frontend-url.vercel.app
heroku config:set GROQ_API_KEY=your-groq-key
heroku config:set GITHUB_CLIENT_ID=your-github-id
heroku config:set GITHUB_CLIENT_SECRET=your-github-secret

# Deploy
git push heroku main

# Run Prisma migrations
heroku run npx prisma db push

# Check logs
heroku logs --tail
```

**Update GitHub OAuth for Production:**

1. Go to GitHub OAuth App settings
2. Update URLs:
   - Homepage: `https://your-frontend-url.vercel.app`
   - Callback: `https://your-clickup-clone-api.herokuapp.com/api/auth/github/callback`

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from frontend folder
cd frontend
vercel

# Follow prompts
# Set environment variables in Vercel dashboard:
# VITE_API_URL=https://your-clickup-clone-api.herokuapp.com/api
# VITE_SOCKET_URL=https://your-clickup-clone-api.herokuapp.com

# Deploy to production
vercel --prod
```

### Environment Variables Checklist

**Backend (Production):**

- ✅ `DATABASE_URL` (from Heroku PostgreSQL addon)
- ✅ `JWT_SECRET` (generate strong random)
- ✅ `SESSION_SECRET` (generate strong random)
- ✅ `CLIENT_URL` (frontend production URL)
- ✅ `GROQ_API_KEY` (same as development)
- ✅ `GITHUB_CLIENT_ID` (same as development)
- ✅ `GITHUB_CLIENT_SECRET` (same as development)
- ✅ `NODE_ENV=production`

**Frontend (Production):**

- ✅ `VITE_API_URL` (backend production URL + /api)
- ✅ `VITE_SOCKET_URL` (backend production URL)

## 🐛 Known Issues & Future Enhancements

### ✅ Completed Features

- [x] User authentication (Email + GitHub OAuth)
- [x] Project management with CRUD
- [x] Task management with status & priority
- [x] Real-time chat with Socket.io
- [x] Document editor with rich text
- [x] Team collaboration with roles
- [x] AI task suggestions with Groq
- [x] Dashboard with analytics
- [x] Responsive UI with TailwindCSS

### 🚧 To Be Implemented

- [ ] File attachments untuk tasks & documents
- [ ] User avatar upload dengan image storage
- [ ] Task comments & discussions
- [ ] Activity timeline/history
- [ ] Email notifications untuk task updates
- [ ] Advanced drag-and-drop Kanban board
- [ ] Calendar view untuk tasks dengan due dates
- [ ] Global search functionality
- [ ] Data export (CSV, JSON)
- [ ] Dark mode theme
- [ ] Task templates
- [ ] Recurring tasks
- [ ] Time tracking
- [ ] Task dependencies
- [ ] Project templates
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)

## 💡 Development Tips

### Database Management

```bash
# Open Prisma Studio (GUI untuk database)
cd backend
npx prisma studio  # http://localhost:5555

# Create migration
npx prisma migrate dev --name your_migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Generate Prisma Client (setelah schema changes)
npx prisma generate
```

### Debugging

**Backend:**

- Check terminal logs untuk API errors
- Use `console.log()` di routes untuk debug
- Monitor Prisma queries dengan `prisma.$on('query')`
- Use Postman/Insomnia untuk test API endpoints

**Frontend:**

- React DevTools untuk inspect components
- Redux DevTools untuk Zustand store
- Network tab di Browser DevTools
- Console logs untuk API responses

**Socket.io:**

- Monitor Socket events di browser console
- Use Socket.io Inspector browser extension
- Check connection status: `socket.connected`

### Code Quality

```bash
# Run linter
npm run lint

# Auto-fix lint issues
npm run lint -- --fix

# Format code
npm run format  # (if Prettier configured)
```

### Hot Reload

**Backend dengan Nodemon:**

```bash
cd backend
npm install -D nodemon
```

Update `package.json`:

```json
"scripts": {
  "dev": "nodemon --watch src --exec ts-node src/index.ts"
}
```

**Frontend:**
Vite sudah support HMR (Hot Module Replacement) by default

### Environment Variables

- Frontend: Prefix dengan `VITE_` untuk accessible di client
- Backend: Semua variables accessible via `process.env`
- Restart server setelah update `.env`
- Never commit `.env` files ke Git!

## 📚 Additional Documentation

- [Dependency Updates](./DEPENDENCY_UPDATES.md) - Details on all package updates and breaking changes

## � Project Statistics

- **Total Lines of Code**: ~10,000+
- **Components**: 15+ React components
- **API Endpoints**: 30+ REST endpoints
- **Database Tables**: 6 main tables
- **Real-time Events**: 5+ Socket.io events
- **Development Time**: Full-featured MVP

## 🎓 Learning Resources

### Technologies Used

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma Docs](https://www.prisma.io/docs)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Socket.io Guide](https://socket.io/docs/v4/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/)

### Related Projects

- [ClickUp](https://clickup.com/) - Original inspiration
- [Trello](https://trello.com/) - Similar board-style PM tool
- [Notion](https://www.notion.so/) - Workspace organization
- [Asana](https://asana.com/) - Team project management

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

### How to Contribute

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Open** Pull Request

### Contribution Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add comments untuk complex logic
- Update README jika menambah features
- Test thoroughly sebelum PR
- Update documentation jika perlu

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ⚠️ Liability limitation
- ⚠️ Warranty disclaimer

## 🙏 Acknowledgments

- **ClickUp** - Inspirasi untuk project management features
- **Groq** - AI model untuk task suggestions
- **GitHub** - OAuth integration
- **Vercel** - Deployment platform recommendation
- **Heroku** - Backend hosting recommendation
- **Prisma Team** - Amazing ORM dan tooling
- **React Team** - Best UI library
- **TailwindCSS** - Utility-first CSS framework

## 📱 Screenshots

### Dashboard

![Dashboard](docs/screenshots/dashboard.png)
_Overview dengan project statistics dan recent activity_

### Project Board

![Project Board](docs/screenshots/project-board.png)
_Kanban-style task management dengan drag & drop_

### Team Collaboration

![Team Members](docs/screenshots/team-members.png)
_Role-based access control untuk team members_

### AI Task Suggestions

![AI Suggestions](docs/screenshots/ai-suggestions.png)
_AI-powered task generation dengan Groq_

### Real-time Chat

![Chat](docs/screenshots/chat.png)
_Instant messaging dengan Socket.io_

**Note:** Add screenshots ke folder `docs/screenshots/` untuk documentation lengkap.

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/your-username/clickup-clone/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/clickup-clone/discussions)
- **Email**: your-email@example.com

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

## 📈 Changelog

### Version 1.0.0 (Current)

**Features:**

- ✅ Complete authentication system
- ✅ Project & task management
- ✅ Team collaboration with roles
- ✅ Real-time chat
- ✅ Document management
- ✅ AI task suggestions
- ✅ Dashboard analytics

**Bug Fixes:**

- ✅ Fixed OAuth callback redirect issue
- ✅ Fixed CORS for multiple ports
- ✅ Fixed empty password for OAuth users
- ✅ Fixed project member permissions

**Improvements:**

- ✅ Enhanced UI/UX with TailwindCSS
- ✅ Added loading states
- ✅ Improved error handling
- ✅ Added toast notifications
- ✅ Optimized database queries

---

**Built with ❤️ using React, TypeScript, Node.js, PostgreSQL, and AI**

**Made in Indonesia 🇮🇩**
