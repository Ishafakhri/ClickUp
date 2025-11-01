import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Get all documents (from accessible projects)
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.query

    // Build where clause to only show documents from projects user has access to
    const whereClause: any = {
      project: {
        OR: [{ ownerId: req.userId }, { members: { some: { userId: req.userId } } }],
      },
    }

    if (projectId) {
      whereClause.projectId = projectId as string
    }

    const documents = await prisma.document.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    res.json(documents)
  } catch (error) {
    console.error('Get documents error:', error)
    res.status(500).json({ message: 'Error fetching documents' })
  }
})

// Get single document by ID (only if user has access to project)
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const document = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        project: {
          OR: [{ ownerId: req.userId }, { members: { some: { userId: req.userId } } }],
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    })

    if (!document) {
      return res.status(404).json({ message: 'Document not found or access denied' })
    }

    res.json(document)
  } catch (error) {
    console.error('Get document error:', error)
    res.status(500).json({ message: 'Error fetching document' })
  }
})

// Create a new document (only if user has access to project)
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, content, projectId } = req.body

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Document title is required' })
    }

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' })
    }

    // Verify project exists and user has access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: req.userId },
          { members: { some: { userId: req.userId, role: { not: 'VIEWER' } } } },
        ],
      },
    })

    if (!project) {
      return res
        .status(404)
        .json({ message: 'Project not found or no permission to create documents' })
    }

    const document = await prisma.document.create({
      data: {
        title: title.trim(),
        content: content || '',
        projectId,
        creatorId: req.userId!,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    })

    res.status(201).json(document)
  } catch (error) {
    console.error('Create document error:', error)
    res.status(500).json({ message: 'Error creating document' })
  }
})

// Update a document (creator or project members with edit permission)
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, content } = req.body

    const existingDoc = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        project: {
          OR: [
            { ownerId: req.userId },
            { members: { some: { userId: req.userId, role: { not: 'VIEWER' } } } },
          ],
        },
      },
      include: {
        project: true,
      },
    })

    if (!existingDoc) {
      return res.status(404).json({ message: 'Document not found or no permission to edit' })
    }

    const document = await prisma.document.update({
      where: { id: req.params.id },
      data: {
        title: title?.trim() || existingDoc.title,
        content: content !== undefined ? content : existingDoc.content,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    })

    res.json(document)
  } catch (error) {
    console.error('Update document error:', error)
    res.status(500).json({ message: 'Error updating document' })
  }
})

// Delete a document (creator or project owner/admin)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const document = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { creatorId: req.userId },
          {
            project: {
              OR: [
                { ownerId: req.userId },
                { members: { some: { userId: req.userId, role: { in: ['OWNER', 'ADMIN'] } } } },
              ],
            },
          },
        ],
      },
    })

    if (!document) {
      return res.status(404).json({ message: 'Document not found or no permission to delete' })
    }

    await prisma.document.delete({
      where: { id: req.params.id },
    })

    res.json({ message: 'Document deleted successfully' })
  } catch (error) {
    console.error('Delete document error:', error)
    res.status(500).json({ message: 'Error deleting document' })
  }
})

export default router
