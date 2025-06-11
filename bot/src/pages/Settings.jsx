import { useState } from "react"
import { Bell, Lock, Moon, Sun, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true
  })
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
            <div className="grid gap-2">
              <Label className="text-[#9B7EDC]">Email</Label>
              <p className="text-sm text-[#8B6AD1]">user@example.com</p>
            </div>
            <Button 
              variant="outline" 
              className="border-[#E6E6FA] text-[#9B7EDC] hover:bg-[#E6E6FA]/50"
            >
              Edit Profile
            </Button>
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
            <Button 
              variant="outline" 
              className="border-[#E6E6FA] text-[#9B7EDC] hover:bg-[#E6E6FA]/50"
            >
              Change Password
            </Button>
            <Separator className="bg-[#E6E6FA]" />
            <Button 
              variant="destructive" 
              className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
            >
              Delete Account
            </Button>
          </CardContent>        </Card>
        </div>
      </main>
    </div>
  )
}