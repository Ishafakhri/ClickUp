import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Get all tasks
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.query

    const tasks = await prisma.task.findMany({
      where: {
        creatorId: req.userId,
        ...(projectId && { projectId: projectId as string }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.json(tasks)
  } catch (error) {
    console.error('Get tasks error:', error)
    res.status(500).json({ message: 'Error fetching tasks' })
  }
})

// Create task
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, description, status, priority, emoji, projectId, assigneeId, dueDate } = req.body

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        emoji: emoji || '📋',
        projectId,
        assigneeId,
        dueDate: dueDate ? new Date(dueDate) : null,
        creatorId: req.userId!,
      },
    })

    res.status(201).json(task)
  } catch (error) {
    console.error('Create task error:', error)
    res.status(500).json({ message: 'Error creating task' })
  }
})

// Update task
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, description, status, priority, emoji, assigneeId, dueDate } = req.body

    const task = await prisma.task.updateMany({
      where: {
        id: req.params.id,
        creatorId: req.userId,
      },
      data: {
        title,
        description,
        status,
        priority,
        emoji,
        assigneeId,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    })

    if (task.count === 0) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res.json({ message: 'Task updated successfully' })
  } catch (error) {
    console.error('Update task error:', error)
    res.status(500).json({ message: 'Error updating task' })
  }
})

// Patch task (partial update)
router.patch('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const updateData: any = {}

    if (req.body.title !== undefined) updateData.title = req.body.title
    if (req.body.description !== undefined) updateData.description = req.body.description
    if (req.body.status !== undefined) updateData.status = req.body.status
    if (req.body.priority !== undefined) updateData.priority = req.body.priority
    if (req.body.emoji !== undefined) updateData.emoji = req.body.emoji
    if (req.body.assigneeId !== undefined) updateData.assigneeId = req.body.assigneeId
    if (req.body.dueDate !== undefined)
      updateData.dueDate = req.body.dueDate ? new Date(req.body.dueDate) : null

    const task = await prisma.task.updateMany({
      where: {
        id: req.params.id,
        creatorId: req.userId,
      },
      data: updateData,
    })

    if (task.count === 0) {
      return res.status(404).json({ message: 'Task not found' })
    }

    const updatedTask = await prisma.task.findUnique({
      where: { id: req.params.id },
    })

    res.json(updatedTask)
  } catch (error) {
    console.error('Patch task error:', error)
    res.status(500).json({ message: 'Error updating task' })
  }
})

// Delete task
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const task = await prisma.task.deleteMany({
      where: {
        id: req.params.id,
        creatorId: req.userId,
      },
    })

    if (task.count === 0) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Delete task error:', error)
    res.status(500).json({ message: 'Error deleting task' })
  }
})

export default router
