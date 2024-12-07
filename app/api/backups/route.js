import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { verifyToken } from '../../../lib/auth'

export async function GET(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1]
  const user = await verifyToken(token)

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const backups = await prisma.backup.findMany()
  return NextResponse.json(backups)
}

export async function POST(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1]
  const user = await verifyToken(token)

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const backupName = `Backup_${new Date().toISOString().split('T')[0]}`
  const newBackup = await prisma.backup.create({
    data: {
      name: backupName,
      size: '1.5GB',
      date: new Date(),
    },
  })

  await prisma.log.create({
    data: {
      action: 'Backup created',
      user: user.username,
      date: new Date(),
    },
  })

  return NextResponse.json(newBackup)
}