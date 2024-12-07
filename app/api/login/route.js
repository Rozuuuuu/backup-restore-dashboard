import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../../../lib/prisma'

export async function POST(req) {
  const { username, password } = await req.json()

  const user = await prisma.user.findUnique({ where: { username } })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 400 })
  }

  const validPassword = await bcrypt.compare(password, user.password)

  if (!validPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 400 })
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })

  return NextResponse.json({ token })
}