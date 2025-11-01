import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Get all chat messages (optionally filtered by project)
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.query

    const messages = await prisma.chatMessage.findMany({
      where: projectId ? { projectId: projectId as string } : undefined,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 100, // Limit to last 100 messages
    })

    res.json(messages)
  } catch (error) {
    console.error('Get messages error:', error)
    res.status(500).json({ message: 'Error fetching messages' })
  }
})

// Create a new chat message
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { content, projectId } = req.body

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' })
    }

    const message = await prisma.chatMessage.create({
      data: {
        content: content.trim(),
        senderId: req.userId!,
        projectId: projectId || null,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })

    res.status(201).json(message)
  } catch (error) {
    console.error('Create message error:', error)
    res.status(500).json({ message: 'Error creating message' })
  }
})

// Delete a message
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const message = await prisma.chatMessage.findUnique({
      where: { id: req.params.id },
    })

    if (!message) {
      return res.status(404).json({ message: 'Message not found' })
    }

    if (message.senderId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this message' })
    }

    await prisma.chatMessage.delete({
      where: { id: req.params.id },
    })

    res.json({ message: 'Message deleted successfully' })
  } catch (error) {
    console.error('Delete message error:', error)
    res.status(500).json({ message: 'Error deleting message' })
  }
})

export default router
