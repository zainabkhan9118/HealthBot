import { Home, MessageSquare, BookOpen, LineChart, Search, Settings, LogOut } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { SidebarBackground } from "@/components/sidebar-background"



// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Chat",
    url: "/dashboard/chat",
    icon: MessageSquare,
  },
  {
    title: "Journal",
    url: "/dashboard/journal",
    icon: BookOpen,
  },
  {
    title: "Resources",
    url: "/dashboard/resources",
    icon: Search,
  },
  {
    title: "Progress",
    url: "/dashboard/progress",
    icon: LineChart,
  },
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

  // Handle logout
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    console.log("User logged out");
    navigate("/login", { replace: true });
  }

  return (
    <Sidebar className="fixed h-screen ">
      <SidebarBackground />
      <SidebarContent className="relative z-10">
        <div className="flex justify-center my-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold bg-[#F5F0FF] bg-clip-text ">MIND</h1>
            <p className="text-xs text-sidebar-foreground/80">Mental Intelligence for Nurturing Dialogue</p>
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-primary font-medium text-lg">Menu</SidebarGroupLabel>
          <SidebarGroupContent className="overflow-hidden">
            <SidebarMenu>             
               {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.title === "Logout" ? (
                    <SidebarMenuButton 
                      className="hover:bg-white/10 backdrop-blur-sm transition-all hover:shadow-[0_0_15px_rgba(155,126,220,0.3)] rounded-lg my-1 w-full" 
                      onClick={handleLogout}
                    >
                      <div className="group flex items-center">
                        <item.icon className="group-hover:text-sidebar-primary transition-colors" />
                        <span className="group-hover:text-sidebar-primary transition-colors font-medium ml-3">{item.title}</span>
                      </div>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton asChild className="hover:bg-white/10 backdrop-blur-sm transition-all hover:shadow-[0_0_15px_rgba(155,126,220,0.3)] rounded-lg my-1">
                      <Link to={item.url} className="group">
                        <item.icon className="group-hover:text-sidebar-primary transition-colors" />
                        <span className="group-hover:text-sidebar-primary transition-colors font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}