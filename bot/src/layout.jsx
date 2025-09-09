import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#F5F0FF]">
        {/* Sidebar: hidden on mobile, visible on md+ screens */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        <main className="flex-1 p-6 w-full min-h-screen bg-background bg-[#F5F0FF]">
          {/* SidebarTrigger: visible only on mobile */}
          <div className="flex items-center justify-between mb-6 md:hidden">
            <SidebarTrigger className="text-sidebar-primary" />
          </div>
          <div className="rounded-lg">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}