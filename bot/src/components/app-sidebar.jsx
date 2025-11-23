import { Home, MessageSquare, BookOpen, LineChart, Search, Settings, LogOut, Sparkles, User2 } from "lucide-react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useContext } from "react"
import AuthContext from "@/context/AuthContext"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"

import { SidebarBackground } from "@/components/sidebar-background"
import { Separator } from "@/components/ui/separator"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    // description: "Overview & insights",
  },
  {
    title: "Chat",
    url: "/dashboard/chat",
    icon: MessageSquare,
    // description: "Talk with Emma",
  },
  {
    title: "Journal",
    url: "/dashboard/journal",
    icon: BookOpen,
    // description: "Daily reflections",
  },
  {
    title: "Resources",
    url: "/dashboard/resources",
    icon: Search,
    // description: "Helpful materials",
  },
  {
    title: "Progress",
    url: "/dashboard/progress",
    icon: LineChart,
    // description: "Track your journey",
  },
]

const secondaryItems = [
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Logout",
    url: "/dashboard/logout",
    icon: LogOut,
  },
]

export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useContext(AuthContext)

  // Handle logout
  const handleLogout = (e) => {
    e.preventDefault();
    

    
    try {
      // Clear all localStorage data
      localStorage.clear();
      
      // Call logout from AuthContext to update state
      logout();
      
      console.log("User logged out successfully");
      
      // Navigate to login page and prevent going back
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
      // Still navigate to login even if there's an error
      navigate("/login", { replace: true });
    }
  }

  // Check if route is active
  const isActive = (url) => {
    if (url === "/dashboard") {
      return location.pathname === "/dashboard"
    }
    return location.pathname.startsWith(url)
  }

  return (
    <Sidebar className="fixed h-screen border-r border-sidebar-border/50">
      <SidebarBackground />
      
      <SidebarContent className="relative z-10 flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex flex-col items-center pt-8 pb-6 px-4">
          <div className="relative mb-3 group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#9B7EDC] to-[#7C5DC7] rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative bg-gradient-to-br from-[#9B7EDC]/20 to-[#7C5DC7]/20 backdrop-blur-xl p-3 rounded-2xl border border-white/10">
              <Sparkles className="w-8 h-8 text-[#9B7EDC]" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-br from-[#9B7EDC] via-[#7C5DC7] to-[#9B7EDC] bg-clip-text text-transparent">
            MIND
          </h1>
          <p className="text-xs text-sidebar-foreground/60 mt-1 text-center leading-relaxed">
            Mental Intelligence for<br />Nurturing Dialogue
          </p>
        </div>

        <Separator className="bg-sidebar-border/30" />

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-3">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/50 mb-2 px-3">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {items.map((item) => {
                  const active = isActive(item.url)
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`
                          relative group px-3 py-2.5 rounded-xl transition-all duration-200
                          ${active 
                            ? 'bg-gradient-to-r from-[#9B7EDC]/20 to-[#7C5DC7]/20 text-[#9B7EDC] shadow-lg shadow-[#9B7EDC]/20 border border-[#9B7EDC]/30' 
                            : 'hover:bg-white/5 hover:shadow-lg hover:shadow-[#9B7EDC]/10 border border-transparent'
                          }
                        `}
                      >
                        <Link to={item.url} className="flex items-center gap-3 w-full">
                          <div className={`
                            p-2 rounded-lg transition-all duration-200
                            ${active 
                              ? 'bg-[#9B7EDC]/20 shadow-inner' 
                              : 'bg-white/5 group-hover:bg-[#9B7EDC]/10'
                            }
                          `}>
                            <item.icon className={`
                              w-4 h-4 transition-all duration-200
                              ${active 
                                ? 'text-[#9B7EDC]' 
                                : 'text-sidebar-foreground/70 group-hover:text-[#9B7EDC]'
                              }
                            `} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`
                              font-medium text-sm transition-colors duration-200
                              ${active 
                                ? 'text-[#9B7EDC]' 
                                : 'text-sidebar-foreground group-hover:text-[#9B7EDC]'
                              }
                            `}>
                              {item.title}
                            </div>
                            <div className="text-xs text-sidebar-foreground/40 truncate">
                              {item.description}
                            </div>
                          </div>
                          {active && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#9B7EDC] shadow-lg shadow-[#9B7EDC]/50 animate-pulse" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Secondary Navigation */}
          <SidebarGroup className="mt-8">
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/50 mb-2 px-3">
              Settings
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {secondaryItems.map((item) => {
                  const active = isActive(item.url)
                  return (
                    <SidebarMenuItem key={item.title}>
                      {item.title === "Logout" ? (
                        <SidebarMenuButton
                          onClick={handleLogout}
                          className={`
                            relative group px-3 py-2.5 rounded-xl transition-all duration-200
                            hover:bg-red-500/10 hover:shadow-lg hover:shadow-red-500/10 border border-transparent
                            hover:border-red-500/30
                          `}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-red-500/10 transition-all duration-200">
                              <item.icon className="w-4 h-4 text-sidebar-foreground/70 group-hover:text-red-400 transition-all duration-200" />
                            </div>
                            <span className="font-medium text-sm text-sidebar-foreground group-hover:text-red-400 transition-colors duration-200">
                              {item.title}
                            </span>
                          </div>
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          className={`
                            relative group px-3 py-2.5 rounded-xl transition-all duration-200
                            ${active 
                              ? 'bg-gradient-to-r from-[#9B7EDC]/20 to-[#7C5DC7]/20 text-[#9B7EDC] shadow-lg shadow-[#9B7EDC]/20 border border-[#9B7EDC]/30' 
                              : 'hover:bg-white/5 hover:shadow-lg hover:shadow-[#9B7EDC]/10 border border-transparent'
                            }
                          `}
                        >
                          <Link to={item.url} className="flex items-center gap-3 w-full">
                            <div className={`
                              p-2 rounded-lg transition-all duration-200
                              ${active 
                                ? 'bg-[#9B7EDC]/20 shadow-inner' 
                                : 'bg-white/5 group-hover:bg-[#9B7EDC]/10'
                              }
                            `}>
                              <item.icon className={`
                                w-4 h-4 transition-all duration-200
                                ${active 
                                  ? 'text-[#9B7EDC]' 
                                  : 'text-sidebar-foreground/70 group-hover:text-[#9B7EDC]'
                                }
                              `} />
                            </div>
                            <span className={`
                              font-medium text-sm transition-colors duration-200
                              ${active 
                                ? 'text-[#9B7EDC]' 
                                : 'text-sidebar-foreground group-hover:text-[#9B7EDC]'
                              }
                            `}>
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* User Profile Footer */}
        <SidebarFooter className="p-4 border-t border-sidebar-border/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#9B7EDC]/30 transition-all duration-200 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9B7EDC] to-[#7C5DC7] rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#9B7EDC]/20 to-[#7C5DC7]/20 border border-[#9B7EDC]/30 flex items-center justify-center">
                <User2 className="w-5 h-5 text-[#9B7EDC]" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-sidebar-foreground truncate">
                {user?.name || "User"}
              </div>
              <div className="text-xs text-sidebar-foreground/50 truncate">
                {user?.email || "user@example.com"}
              </div>
            </div>
          </div>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  )
}