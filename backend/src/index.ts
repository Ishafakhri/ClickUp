import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'
import { createServer } from 'http'
import { Server } from 'socket.io'
import passport from './config/passport'
import authRoutes from './routes/auth'
import projectRoutes from './routes/projects'
import taskRoutes from './routes/tasks'
import dashboardRoutes from './routes/dashboard'
import aiRoutes from './routes/ai'
import messagesRoutes from './routes/messages'
import documentsRoutes from './routes/documents'
import { setupSocketIO } from './socket'

dotenv.config()

const app = express()
const httpServer = createServer(app)

// Allow multiple origins for development
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  process.env.CLIENT_URL,
].filter(Boolean) as string[]

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
})

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
)
app.use(express.json())

// Session middleware for OAuth
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-session-secret-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
)

// Initialize Passport
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/messages', messagesRoutes)
app.use('/api/documents', documentsRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'ClickUp Clone API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      projects: '/api/projects',
      tasks: '/api/tasks',
      documents: '/api/documents',
      messages: '/api/messages',
      dashboard: '/api/dashboard',
      ai: '/api/ai',
      health: '/api/health',
    },
  })
})

// Setup Socket.IO
setupSocketIO(io)

const PORT = process.env.PORT || 5000

httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
})
