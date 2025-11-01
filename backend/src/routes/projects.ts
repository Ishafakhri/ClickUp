import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Get all projects (owned + member)
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [{ ownerId: req.userId }, { members: { some: { userId: req.userId } } }],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
            documents: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.json(projects)
  } catch (error) {
    console.error('Get projects error:', error)
    res.status(500).json({ message: 'Error fetching projects' })
  }
})

// Get single project (accessible if owner or member)
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        OR: [{ ownerId: req.userId }, { members: { some: { userId: req.userId } } }],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    res.json(project)
  } catch (error) {
    console.error('Get project error:', error)
    res.status(500).json({ message: 'Error fetching project' })
  }
})

// Create project
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, description, color } = req.body

    const project = await prisma.project.create({
      data: {
        name,
        description,
        color: color || '#0ea5e9',
        ownerId: req.userId!,
        members: {
          create: {
            userId: req.userId!,
            role: 'OWNER',
          },
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    res.status(201).json(project)
  } catch (error) {
    console.error('Create project error:', error)
    res.status(500).json({ message: 'Error creating project' })
  }
})

// Update project
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, description, color } = req.body

    const project = await prisma.project.updateMany({
      where: {
        id: req.params.id,
        ownerId: req.userId,
      },
      data: {
        name,
        description,
        color,
      },
    })

    if (project.count === 0) {
      return res.status(404).json({ message: 'Project not found' })
    }

    res.json({ message: 'Project updated successfully' })
  } catch (error) {
    console.error('Update project error:', error)
    res.status(500).json({ message: 'Error updating project' })
  }
})

// Delete project
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const project = await prisma.project.deleteMany({
      where: {
        id: req.params.id,
        ownerId: req.userId,
      },
    })

    if (project.count === 0) {
      return res.status(404).json({ message: 'Project not found' })
    }

    res.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Delete project error:', error)
    res.status(500).json({ message: 'Error deleting project' })
  }
})

// Add member to project
router.post('/:id/members', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { email, role } = req.body

    // Check if user is owner or admin
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { ownerId: req.userId },
          { members: { some: { userId: req.userId, role: { in: ['OWNER', 'ADMIN'] } } } },
        ],
      },
    })

    if (!project) {
      return res.status(403).json({ message: 'Not authorized to add members' })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, avatar: true },
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: req.params.id,
          userId: user.id,
        },
      },
    })

    if (existingMember) {
      return res.status(400).json({ message: 'User is already a member' })
    }

    // Add member
    const member = await prisma.projectMember.create({
      data: {
        projectId: req.params.id,
        userId: user.id,
        role: role || 'MEMBER',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })

    res.status(201).json(member)
  } catch (error) {
    console.error('Add member error:', error)
    res.status(500).json({ message: 'Error adding member' })
  }
})

// Remove member from project
router.delete('/:id/members/:userId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // Check if user is owner or admin
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { ownerId: req.userId },
          { members: { some: { userId: req.userId, role: { in: ['OWNER', 'ADMIN'] } } } },
        ],
      },
    })

    if (!project) {
      return res.status(403).json({ message: 'Not authorized to remove members' })
    }

    // Can't remove owner
    if (project.ownerId === req.params.userId) {
      return res.status(400).json({ message: 'Cannot remove project owner' })
    }

    const member = await prisma.projectMember.deleteMany({
      where: {
        projectId: req.params.id,
        userId: req.params.userId,
      },
    })

    if (member.count === 0) {
      return res.status(404).json({ message: 'Member not found' })
    }

    res.json({ message: 'Member removed successfully' })
  } catch (error) {
    console.error('Remove member error:', error)
    res.status(500).json({ message: 'Error removing member' })
  }
})

// Update member role
router.patch('/:id/members/:userId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { role } = req.body

    // Check if user is owner or admin
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { ownerId: req.userId },
          { members: { some: { userId: req.userId, role: { in: ['OWNER', 'ADMIN'] } } } },
        ],
      },
    })

    if (!project) {
      return res.status(403).json({ message: 'Not authorized to update member roles' })
    }

    // Can't change owner role
    if (project.ownerId === req.params.userId) {
      return res.status(400).json({ message: 'Cannot change owner role' })
    }

    const member = await prisma.projectMember.updateMany({
      where: {
        projectId: req.params.id,
        userId: req.params.userId,
      },
      data: {
        role,
      },
    })

    if (member.count === 0) {
      return res.status(404).json({ message: 'Member not found' })
    }

    res.json({ message: 'Member role updated successfully' })
  } catch (error) {
    console.error('Update member role error:', error)
    res.status(500).json({ message: 'Error updating member role' })
  }
})

export default router
