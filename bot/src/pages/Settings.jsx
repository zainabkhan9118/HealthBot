import { useState, useEffect } from "react"
import { Bell, Check, Lock, Moon, Sun, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { Input } from "@/components/ui/input"
import { getMe } from "@/api/auth"
import { updateUser, changePassword, deleteUser } from "@/api/users"
import { useNavigate } from "react-router-dom"

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true
  })
  const [userData, setUserData] = useState({
    id: '',
    name: '',
    email: ''
  })
  const [editMode, setEditMode] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changePasswordMode, setChangePasswordMode] = useState(false)
  const [deleteAccountMode, setDeleteAccountMode] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [deleteError, setDeleteError] = useState('')
  
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }
      
      try {
        setIsLoading(true)
        const res = await getMe(token)
        if (res.success && res.data) {
          setUserData({
            id: res.data._id,
            name: res.data.name,
            email: res.data.email
          })
          setNameInput(res.data.name)
          setEmailInput(res.data.email)
        } else {
          setError('Failed to load user data')
        }
      } catch (err) {
        setError('Error loading user data')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUser()
  }, [])
  const handleUpdateProfile = async () => {
    setError('')
    setSuccess('')
    
    if (!nameInput.trim() || !emailInput.trim()) {
      setError('Name and email are required')
      return
    }
    
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      const updatedUser = {
        name: nameInput,
        email: emailInput
      }
      
      const response = await updateUser(userData.id, updatedUser, token)
      
      if (response.success) {
        setUserData({
          ...userData,
          name: nameInput,
          email: emailInput
        })
        setSuccess('Profile updated successfully')
        setEditMode(false)
      } else {
        setError(response.message || 'Failed to update profile')
      }
    } catch (err) {
      setError('An error occurred while updating profile')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleUpdatePassword = async () => {
    setPasswordError('')
    setPasswordSuccess('')
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required')
      return
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }
    
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await changePassword(userData.id, {
        currentPassword,
        newPassword
      }, token)
      
      if (response.success) {
        setPasswordSuccess('Password updated successfully')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setChangePasswordMode(false)
      } else {
        setPasswordError(response.message || 'Failed to update password')
      }
    } catch (err) {
      setPasswordError('An error occurred while updating password')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleDeleteAccount = async () => {
    setDeleteError('')
    
    if (deleteConfirmation !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm')
      return
    }
    
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await deleteUser(userData.id, token)
      
      if (response.success) {
        localStorage.removeItem('token')
        navigate('/login')
      } else {
        setDeleteError(response.message || 'Failed to delete account')
      }
    } catch (err) {
      setDeleteError('An error occurred while deleting account')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (    
  <div className="min-h-screen bg-gradient-to-br from-[#E6E6FA]/30 to-white dark:from-[#1A1A1A] dark:to-black">
      {/* Header */}
      <header className="bg-white/80 dark:bg-black/80 backdrop-blur-sm p-6 border-b border-[#E6E6FA] sticky top-0 z-10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#9B7EDC] to-[#E6E6FA] bg-clip-text text-transparent">
          Settings
        </h1>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Profile Settings */}
        <Card className="border border-[#E6E6FA] h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#9B7EDC]" />
              <CardTitle className="text-[#8B6AD1]">Profile Settings</CardTitle>
            </div>
            <CardDescription>Manage your profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!editMode ? (
              <>
                <div className="grid gap-2">
                  <Label className="text-[#9B7EDC]">Name</Label>
                  <p className="text-sm text-[#8B6AD1]">{userData.name}</p>
                </div>
                <div className="grid gap-2">
                  <Label className="text-[#9B7EDC]">Email</Label>
                  <p className="text-sm text-[#8B6AD1]">{userData.email}</p>
                </div>
                <Button 
                  variant="outline" 
                  className="border-[#E6E6FA] text-[#9B7EDC] hover:bg-[#E6E6FA]/50"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </Button>
              </>
            ) : (
              <>
                <div className="grid gap-2">
                  <Label className="text-[#9B7EDC]" htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="border-[#E6E6FA]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[#9B7EDC]" htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="border-[#E6E6FA]"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <Button 
                    variant="default" 
                    className="bg-[#9B7EDC] hover:bg-[#8B6AD1] text-white flex-1"
                    onClick={handleUpdateProfile}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-[#E6E6FA] text-[#9B7EDC] hover:bg-[#E6E6FA]/50"
                    onClick={() => {
                      setEditMode(false)
                      setNameInput(userData.name)
                      setEmailInput(userData.email)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
            {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border border-[#E6E6FA] h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#9B7EDC]" />
              <CardTitle className="text-[#8B6AD1]">Notifications</CardTitle>
            </div>
            <CardDescription>Configure how you want to be notified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-[#9B7EDC]">Email Notifications</Label>
              <Switch 
                checked={notifications.email}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, email: checked }))
                }
                className="bg-[#9B7EDC]"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-[#9B7EDC]">Push Notifications</Label>
              <Switch 
                checked={notifications.push}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, push: checked }))
                }
                className="bg-[#9B7EDC]"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-[#9B7EDC]">Product Updates</Label>
              <Switch 
                checked={notifications.updates}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, updates: checked }))
                }
                className="bg-[#9B7EDC]"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Appearance */}
        <Card className="border border-[#E6E6FA] h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-[#9B7EDC] dark:hidden" />
              <Moon className="h-5 w-5 text-[#9B7EDC] hidden dark:block" />
              <CardTitle className="text-[#8B6AD1]">Appearance</CardTitle>
            </div>
            <CardDescription>Customize your interface</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label className="text-[#9B7EDC]">Theme</Label>
              <ModeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border border-[#E6E6FA] h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#9B7EDC]" />
              <CardTitle className="text-[#8B6AD1]">Security</CardTitle>
            </div>
            <CardDescription>Manage your security preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!changePasswordMode ? (
              <Button 
                variant="outline" 
                className="border-[#E6E6FA] text-[#9B7EDC] hover:bg-[#E6E6FA]/50"
                onClick={() => setChangePasswordMode(true)}
              >
                Change Password
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="border-[#E6E6FA]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-[#E6E6FA]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-[#E6E6FA]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    className="bg-[#9B7EDC] hover:bg-[#8B6AD1] text-white flex-1"
                    onClick={handleUpdatePassword}
                    disabled={isLoading || !currentPassword || !newPassword || newPassword !== confirmPassword}
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-[#E6E6FA] text-[#9B7EDC] hover:bg-[#E6E6FA]/50"
                    onClick={() => {
                      setChangePasswordMode(false)
                      setCurrentPassword('')
                      setNewPassword('')
                      setConfirmPassword('')
                      setPasswordError('')
                      setPasswordSuccess('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                {passwordSuccess && <p className="text-sm text-green-600">{passwordSuccess}</p>}
              </div>
            )}
            <Separator className="bg-[#E6E6FA]" />
            {!deleteAccountMode ? (
              <Button 
                variant="destructive" 
                className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
                onClick={() => setDeleteAccountMode(true)}
              >
                Delete Account
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-red-500">This action cannot be undone. Please type "DELETE" to confirm.</p>
                <Input 
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="border-red-200"
                />
                <div className="flex gap-2">
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    disabled={isLoading || deleteConfirmation !== 'DELETE'}
                  >
                    {isLoading ? 'Deleting...' : 'Confirm Delete'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-[#E6E6FA] text-[#9B7EDC] hover:bg-[#E6E6FA]/50"
                    onClick={() => {
                      setDeleteAccountMode(false)
                      setDeleteConfirmation('')
                      setDeleteError('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
                {deleteError && <p className="text-sm text-red-500">{deleteError}</p>}
              </div>
            )}
          </CardContent>        </Card>
        </div>
      </main>
    </div>
  )
}