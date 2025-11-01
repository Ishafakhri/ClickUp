import { Router } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { aiService } from '../services/aiService'

const router = Router()

// Generate task suggestions for a project
router.post('/suggest-tasks', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { projectName, projectDescription } = req.body

    if (!projectName) {
      return res.status(400).json({ message: 'Project name is required' })
    }

    const suggestions = await aiService.generateTaskSuggestions(projectName, projectDescription)

    res.json({ suggestions })
  } catch (error) {
    console.error('AI Suggest Tasks Error:', error)
    res.status(500).json({ message: 'Error generating task suggestions' })
  }
})

// Enhance task description
router.post('/enhance-description', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, context } = req.body

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' })
    }

    const description = await aiService.enhanceTaskDescription(title, context)

    res.json({ description })
  } catch (error) {
    console.error('AI Enhance Description Error:', error)
    res.status(500).json({ message: 'Error enhancing description' })
  }
})

// Suggest priority level
router.post('/suggest-priority', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, description } = req.body

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' })
    }

    const priority = await aiService.suggestPriority(title, description)

    res.json({ priority })
  } catch (error) {
    console.error('AI Suggest Priority Error:', error)
    res.status(500).json({ message: 'Error suggesting priority' })
  }
})

// Improve task title
router.post('/improve-title', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title } = req.body

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' })
    }

    const improvedTitle = await aiService.improveTaskTitle(title)

    res.json({ title: improvedTitle })
  } catch (error) {
    console.error('AI Improve Title Error:', error)
    res.status(500).json({ message: 'Error improving title' })
  }
})

export default router
