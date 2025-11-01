import { Server, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface AuthSocket extends Socket {
  userId?: string
}

export const setupSocketIO = (io: Server) => {
  // Authentication middleware
  io.use(async (socket: AuthSocket, next) => {
    try {
      const token = socket.handshake.auth.token

      if (!token) {
        return next(new Error('Authentication error'))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
      socket.userId = decoded.userId

      next()
    } catch (error) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket: AuthSocket) => {
    console.log(`User connected: ${socket.userId}`)

    // Join user's personal room
    socket.join(`user:${socket.userId}`)

    // Handle chat messages
    socket.on('chat:send', async (data: { content: string; projectId?: string }) => {
      try {
        const message = await prisma.chatMessage.create({
          data: {
            content: data.content,
            senderId: socket.userId!,
            projectId: data.projectId,
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

        // Broadcast to all connected clients or specific project room
        if (data.projectId) {
          io.to(`project:${data.projectId}`).emit('chat:message', message)
        } else {
          io.emit('chat:message', message)
        }
      } catch (error) {
        console.error('Chat error:', error)
        socket.emit('error', { message: 'Failed to send message' })
      }
    })

    // Join project room
    socket.on('project:join', (projectId: string) => {
      socket.join(`project:${projectId}`)
    })

    // Leave project room
    socket.on('project:leave', (projectId: string) => {
      socket.leave(`project:${projectId}`)
    })

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`)
    })
  })
}
