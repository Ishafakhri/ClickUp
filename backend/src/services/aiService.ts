import Groq from 'groq-sdk'

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

export interface TaskSuggestion {
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  emoji: string
}

export interface AIService {
  generateTaskSuggestions(
    projectName: string,
    projectDescription?: string
  ): Promise<TaskSuggestion[]>
  enhanceTaskDescription(title: string, context?: string): Promise<string>
  suggestPriority(
    taskTitle: string,
    taskDescription?: string
  ): Promise<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>
  improveTaskTitle(title: string): Promise<string>
}

class GroqAIService implements AIService {
  private model = 'llama-3.3-70b-versatile' // Latest Groq model (Dec 2024)

  async generateTaskSuggestions(
    projectName: string,
    projectDescription?: string
  ): Promise<TaskSuggestion[]> {
    try {
      const prompt = `You are a project management AI assistant. Generate 5 diverse task suggestions for a project.

Project Name: ${projectName}
${projectDescription ? `Project Description: ${projectDescription}` : ''}

Generate 5 practical tasks with:
1. Clear, actionable title (max 50 chars)
2. Brief description (max 100 chars)
3. Priority level (LOW, MEDIUM, HIGH, or URGENT)
4. Appropriate emoji (single emoji)

Respond ONLY with a JSON array, no other text:
[
  {
    "title": "task title",
    "description": "task description",
    "priority": "MEDIUM",
    "emoji": "📋"
  }
]`

      const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.model,
        temperature: 0.7,
        max_tokens: 1024,
      })

      const content = response.choices[0]?.message?.content || '[]'

      // Extract JSON from response (handle markdown code blocks)
      let jsonStr = content.trim()
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '')
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```\n?/g, '')
      }

      const suggestions = JSON.parse(jsonStr)
      return suggestions.slice(0, 5) // Ensure max 5 suggestions
    } catch (error) {
      console.error('AI Task Suggestions Error:', error)
      // Fallback suggestions
      return [
        {
          title: 'Define project goals',
          description: 'Outline clear objectives and success criteria',
          priority: 'HIGH',
          emoji: '🎯',
        },
        {
          title: 'Create project timeline',
          description: 'Set milestones and deadlines',
          priority: 'MEDIUM',
          emoji: '📅',
        },
        {
          title: 'Assign team roles',
          description: 'Define responsibilities for each team member',
          priority: 'MEDIUM',
          emoji: '👥',
        },
      ]
    }
  }

  async enhanceTaskDescription(title: string, context?: string): Promise<string> {
    try {
      const prompt = `You are a helpful assistant. Generate a clear, professional task description.

Task Title: ${title}
${context ? `Context: ${context}` : ''}

Write a brief, actionable description (max 150 chars) that explains what needs to be done.
Respond with ONLY the description text, no quotes or extra formatting.`

      const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.model,
        temperature: 0.6,
        max_tokens: 200,
      })

      return response.choices[0]?.message?.content?.trim() || ''
    } catch (error) {
      console.error('AI Enhance Description Error:', error)
      return `Complete the task: ${title}`
    }
  }

  async suggestPriority(
    taskTitle: string,
    taskDescription?: string
  ): Promise<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'> {
    try {
      const prompt = `Analyze this task and suggest a priority level.

Task: ${taskTitle}
${taskDescription ? `Description: ${taskDescription}` : ''}

Respond with ONLY one word: LOW, MEDIUM, HIGH, or URGENT

Guidelines:
- LOW: Nice to have, no deadline pressure
- MEDIUM: Standard task, normal timeline
- HIGH: Important, affects project success
- URGENT: Critical, immediate attention needed`

      const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.model,
        temperature: 0.3,
        max_tokens: 10,
      })

      const priority = response.choices[0]?.message?.content?.trim().toUpperCase()

      if (priority && ['LOW', 'MEDIUM', 'HIGH', 'URGENT'].includes(priority)) {
        return priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
      }

      return 'MEDIUM'
    } catch (error) {
      console.error('AI Priority Suggestion Error:', error)
      return 'MEDIUM'
    }
  }

  async improveTaskTitle(title: string): Promise<string> {
    try {
      const prompt = `Improve this task title to be more clear and actionable.

Original: ${title}

Make it:
- Clear and specific
- Action-oriented (start with a verb)
- Concise (max 50 chars)

Respond with ONLY the improved title, no quotes or explanation.`

      const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.model,
        temperature: 0.5,
        max_tokens: 50,
      })

      const improved = response.choices[0]?.message?.content?.trim()
      return improved || title
    } catch (error) {
      console.error('AI Improve Title Error:', error)
      return title
    }
  }
}

// Export singleton instance
export const aiService = new GroqAIService()
