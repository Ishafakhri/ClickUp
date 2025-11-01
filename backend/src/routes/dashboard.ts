import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Get dashboard stats
router.get('/stats', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const [totalTasks, inProgressTasks, completedTasks, teamMembers] = await Promise.all([
      prisma.task.count({
        where: { creatorId: req.userId },
      }),
      prisma.task.count({
        where: {
          creatorId: req.userId,
          status: 'IN_PROGRESS',
        },
      }),
      prisma.task.count({
        where: {
          creatorId: req.userId,
          status: 'DONE',
        },
      }),
      prisma.user.count(),
    ])

    res.json({
      totalTasks,
      inProgressTasks,
      completedTasks,
      teamMembers,
    })
  } catch (error) {
    console.error('Get dashboard stats error:', error)
    res.status(500).json({ message: 'Error fetching dashboard stats' })
  }
})

export default router
