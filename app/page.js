'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Download, Upload, RefreshCw, LogOut, X } from 'lucide-react'

// Mock data generation function
const generateMockBackup = () => {
  const id = Math.floor(Math.random() * 1000000)
  const date = new Date()
  return {
    id,
    name: `Backup_${date.toISOString().split('T')[0]}`,
    size: `${Math.floor(Math.random() * 10) + 1}GB`,
    date: date.toISOString(),
  }
}

const generateMockLog = (action, user) => {
  return {
    id: Math.floor(Math.random() * 1000000),
    action,
    user,
    date: new Date().toISOString(),
  }
}

export default function BackupRestoreDashboard() {
  const [backups, setBackups] = useState([])
  const [logs, setLogs] = useState([])
  const [message, setMessage] = useState('')
  const [token, setToken] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      fetchBackups()
      fetchLogs()
    }
  }, [])

  const login = async () => {
    try {
      // Simulating login
      if (username === 'admin' && password === 'password') {
        const mockToken = 'mock-jwt-token'
        setToken(mockToken)
        localStorage.setItem('token', mockToken)
        fetchBackups()
        fetchLogs()
        setMessage('Login successful')
      } else {
        setMessage('Login failed')
      }
    } catch (error) {
      setMessage('An error occurred')
    }
  }

  const logout = () => {
    setToken('')
    localStorage.removeItem('token')
    setBackups([])
    setLogs([])
    setMessage('Logged out successfully')
  }

  const fetchBackups = () => {
    // Simulating API call
    const mockBackups = Array(5).fill().map(() => generateMockBackup())
    setBackups(mockBackups)
  }

  const fetchLogs = () => {
    // Simulating API call
    const mockLogs = [
      generateMockLog('Login', 'admin'),
      generateMockLog('Backup created', 'admin'),
      generateMockLog('Backup downloaded', 'user1'),
    ]
    setLogs(mockLogs)
  }

  const createBackup = () => {
    const newBackup = generateMockBackup()
    setBackups(prevBackups => [newBackup, ...prevBackups])
    const newLog = generateMockLog('Backup created', 'admin')
    setLogs(prevLogs => [newLog, ...prevLogs])
    setMessage('Backup created successfully')
  }

  const restoreBackup = (backupId) => {
    const newLog = generateMockLog(`Restore initiated for backup ${backupId}`, 'admin')
    setLogs(prevLogs => [newLog, ...prevLogs])
    setMessage(`Restore initiated for backup ${backupId}`)
  }

  const Notification = ({ message, onClose }) => (
    <div className="fixed top-4 right-4 z-50 w-64 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-gray-900">Notification</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
      <div className="bg-blue-500 h-1 w-full animate-shrink"></div>
    </div>
  )

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-800">Login</CardTitle>
            <CardDescription className="text-center text-gray-600">Enter your credentials to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button onClick={login} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
              Login
            </Button>
          </CardContent>
        </Card>
        {message && <Notification message={message} onClose={() => setMessage('')} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">Backup and Restore Dashboard</h1>
            </div>
            <div className="flex items-center">
              <Button onClick={logout} variant="outline" className="flex items-center space-x-2">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Backups</CardTitle>
                <CardDescription>Manage your system backups</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={createBackup} className="mb-4">
                  <RefreshCw className="mr-2 h-4 w-4" /> Create New Backup
                </Button>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backups.map((backup) => (
                      <TableRow key={backup.id}>
                        <TableCell>{backup.name}</TableCell>
                        <TableCell>{backup.size}</TableCell>
                        <TableCell>{new Date(backup.date).toLocaleString()}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="mr-2">
                            <Download className="mr-2 h-4 w-4" /> Download
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => restoreBackup(backup.id)}>
                            <Upload className="mr-2 h-4 w-4" /> Restore
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Access Logs</CardTitle>
                <CardDescription>Recent system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{new Date(log.date).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {message && <Notification message={message} onClose={() => setMessage('')} />}
    </div>
  )
}