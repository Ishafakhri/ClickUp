import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import passport from '../config/passport'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    })

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    })

    res.status(201).json({ user, token })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: 'Error creating user' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check if user has password (OAuth users don't have password)
    if (!user.password || user.password === '') {
      return res.status(401).json({ message: 'Please sign in with GitHub' })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    })

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Error logging in' })
  }
})

// GitHub OAuth routes
router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email'],
    session: false,
  })
)

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    try {
      const user = req.user as any

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: '7d',
      })

      // Redirect to frontend with token
      const clientURL = process.env.CLIENT_URL || 'http://localhost:3000'
      res.redirect(`${clientURL}/auth/callback?token=${token}`)
    } catch (error) {
      console.error('GitHub callback error:', error)
      res.redirect('/login?error=auth_failed')
    }
  }
)

// Get current user
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Error fetching user data' })
  }
})

export default router
