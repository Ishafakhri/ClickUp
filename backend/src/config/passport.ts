import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Serialize user untuk session
passport.serializeUser((user: any, done) => {
  done(null, user.id)
})

// Deserialize user dari session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } })
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

// GitHub OAuth Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/api/auth/github/callback',
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          const email = profile.emails?.[0].value || `${profile.username}@github.com`

          // Check if user exists
          let user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user) {
            // Create new user
            user = await prisma.user.create({
              data: {
                email,
                name: profile.displayName || profile.username || '',
                password: '', // No password for OAuth users
                githubId: profile.id,
                avatar: profile.photos?.[0].value,
              },
            })
          } else if (!user.githubId) {
            // Link GitHub account to existing user
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                githubId: profile.id,
                avatar: user.avatar || profile.photos?.[0].value,
              },
            })
          }

          done(null, user)
        } catch (error) {
          done(error as Error, undefined)
        }
      }
    )
  )
}

export default passport
