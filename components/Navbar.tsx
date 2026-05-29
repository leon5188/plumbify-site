"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Zap, Users, PhoneIncoming, BookOpen } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter">
          PLUMBIFY
        </Link>
        
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <div className="relative group">
            <button 
              className="flex items-center gap-1 hover:text-blue-600 py-8"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              Solutions <ChevronDown size={14} />
            </button>
            
            {/* Dropdown */}
            <div 
              className={`absolute top-20 left-0 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 transition-all duration-200 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <Link href="/solutions/business-owners" className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors">
                <Zap size={18} className="text-blue-500" />
                <div>
                  <div className="font-bold text-slate-900">For Business Owners</div>
                  <div className="text-[10px] text-slate-400">Scale & ROI</div>
                </div>
              </Link>
              <Link href="/solutions/dispatchers" className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors">
                <PhoneIncoming size={18} className="text-blue-500" />
                <div>
                  <div className="font-bold text-slate-900">For Dispatchers</div>
                  <div className="text-[10px] text-slate-400">Schedule Control</div>
                </div>
              </Link>
              <Link href="/solutions/technicians" className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors">
                <Users size={18} className="text-blue-500" />
                <div>
                  <div className="font-bold text-slate-900">For Technicians</div>
                  <div className="text-[10px] text-slate-400">Field Efficiency</div>
                </div>
              </Link>
            </div>
          </div>
          
          <Link href="/#roi" className="hover:text-blue-600 py-8">ROI Calculator</Link>
          <Link href="/resources/10dlc-guide" className="hover:text-blue-600 py-8 flex items-center gap-1">
            <BookOpen size={14} /> 10DLC Hub
          </Link>
          <Link href="/#pricing" className="hover:text-blue-600 py-8">Pricing</Link>
        </div>

        <button className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-all">
          Get Started Free
        </button>
      </div>
    </nav>
  );
}
