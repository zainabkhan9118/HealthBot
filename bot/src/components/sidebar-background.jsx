import React from 'react';

export function SidebarBackground() {
  return (
    <div className="sidebar-bg absolute inset-0 z-[-1] overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0F] via-[#0D0D14] to-[#12121A]"></div>
      
      {/* Top glowing orb with animation */}
      <div className="absolute top-[-10%] left-[50%] w-[200px] h-[200px] rounded-full bg-gradient-to-br from-[#9B7EDC]/30 to-[#7C5DC7]/20 blur-[80px] animate-pulse"></div>
      
      {/* Middle accent glow */}
      <div className="absolute top-[40%] right-[-10%] w-[150px] h-[150px] rounded-full bg-[#9B7EDC]/15 blur-[60px]"></div>
      
      {/* Bottom glow with subtle movement */}
      <div className="absolute bottom-[-5%] left-[20%] w-[180px] h-[180px] rounded-full bg-gradient-to-tl from-[#7C5DC7]/25 to-[#9B7EDC]/15 blur-[70px]"></div>
      
      {/* Gradient mesh overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#9B7EDC]/5 via-transparent to-[#7C5DC7]/5"></div>
      
      {/* Radial gradient for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
      
      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `
          linear-gradient(rgba(155, 126, 220, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(155, 126, 220, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}></div>
      
      {/* Floating particles effect */}
      <div className="particles absolute inset-0">
        <div className="absolute top-[20%] left-[30%] w-1 h-1 bg-[#9B7EDC]/40 rounded-full animate-pulse"></div>
        <div className="absolute top-[60%] left-[70%] w-1 h-1 bg-[#7C5DC7]/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[80%] left-[40%] w-1 h-1 bg-[#9B7EDC]/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Edge fade for seamless integration */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20"></div>
    </div>
  );
}
