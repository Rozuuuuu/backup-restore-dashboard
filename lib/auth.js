import jwt from 'jsonwebtoken'
import prisma from './prisma'

export async function verifyToken(token) {
  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } })
    return user
  } catch (error) {
    return null
  }
}