import { getIronSession, SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'

export type SessionData = {
  userId?: number
  userName?: string
}

const sessionOptions: SessionOptions = {
  password: process.env.AUTH_SECRET as string,
  cookieName: 'need-whey-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 jours
  },
}

export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, sessionOptions)
}

export async function requireAuth() {
  const session = await getSession()
  if (!session.userId) {
    throw new Error('NOT_AUTHENTICATED')
  }
  return session
}
