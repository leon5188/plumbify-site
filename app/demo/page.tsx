"use client";

import React from "react";
import AIAgentWidget from "@/components/AIAgentWidget";

export default function DemoPage() {
  return (
    <div className="w-screen h-screen min-h-screen bg-gradient-to-tr from-[#0e1726] via-[#102452] to-[#044c8c] text-slate-100 flex flex-col relative overflow-hidden font-sans selection:bg-[#06b6d4]/30 selection:text-white">
      
      {/* Generative Flow Field SVG Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" className="w-full h-full object-cover">
          {/* Waves with neon cyan/blue stroke */}
          <path 
            d="M -100,200 C 300,50 600,450 1000,250 C 1200,150 1400,280 1600,200 L 1600,1000 L -100,1000 Z" 
            fill="none" 
            stroke="url(#wave-gradient-1)" 
            strokeWidth="2.5" 
            strokeDasharray="4,8"
          />
          <path 
            d="M -100,350 C 400,200 500,600 1100,300 C 1300,200 1450,420 1600,350" 
            fill="none" 
            stroke="url(#wave-gradient-2)" 
            strokeWidth="1.5" 
          />
          <path 
            d="M -100,500 C 200,400 700,750 1200,450 C 1400,350 1500,580 1600,500" 
            fill="none" 
            stroke="url(#wave-gradient-1)" 
            strokeWidth="1" 
            strokeOpacity="0.7"
          />
          
          {/* Grid lines for a technological aesthetic */}
          <g stroke="#ffffff" strokeWidth="1" strokeOpacity="0.03">
            <path d="M 0,150 L 1600,150 M 0,300 L 1600,300 M 0,450 L 1600,450 M 0,600 L 1600,600 M 0,750 L 1600,750" />
            <path d="M 240,0 L 240,1000 M 480,0 L 480,1000 M 720,0 L 720,1000 M 960,0 L 960,1000 M 1200,0 L 1200,1000" />
          </g>

          <defs>
            <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="wave-gradient-2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Header Info Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold rounded-full tracking-wider uppercase">
            AI Agent Sandbox
          </div>
          <span className="text-slate-400 text-xs hidden sm:inline">• Speaks 4 Languages • One-Click Voice/Chat</span>
        </div>
        <a 
          href="/" 
          className="text-slate-400 hover:text-white text-xs font-medium transition-colors"
        >
          ← Back to Homepage
        </a>
      </header>

      {/* Main Sandbox Container */}
      <main className="flex-grow relative z-10 w-full max-w-7xl mx-auto px-6 pb-8 pt-2 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full min-h-[500px] max-h-[800px] bg-slate-950/80 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-2xl shadow-2xl relative">
          <AIAgentWidget isEmbedPage={true} />
        </div>
      </main>
    </div>
  );
}
