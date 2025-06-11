import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-[#F5F0FF]/30 to-white">
        <AppSidebar />
        <main className="flex-1 p-6 w-full min-h-screen bg-background bg-gradient-to-br from-[#F5F0FF]/30 to-white overflow-x-auto">
          <div className="flex items-center justify-between mb-6">
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