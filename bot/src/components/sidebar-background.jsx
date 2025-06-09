import React from 'react';

export function SidebarBackground() {
  return (
    <div className="sidebar-bg absolute inset-0 z-[-1] overflow-hidden">
      {/* Glowing orb in the top area */}
      <div className="absolute top-[-20%] left-[50%] w-[150px] h-[150px] rounded-full bg-sidebar-primary/20 blur-[60px]"></div>
      
      {/* Gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#9B7EDC]/10 to-transparent"></div>
      
      {/* Grid lines */}
      <div className="grid-lines"></div>
      
      {/* Bottom glow */}
      <div className="absolute bottom-[-10%] left-[30%] w-[100px] h-[100px] rounded-full bg-[#7C5DC7]/20 blur-[40px]"></div>
      
      {/* Floating particles */}
      <div className="particles"></div>
    </div>
  );
}
