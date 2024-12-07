import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { verifyToken } from '../../../lib/auth'

export async function GET(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1]
  const user = await verifyToken(token)

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const logs = await prisma.log.findMany()
  return NextResponse.json(logs)
}