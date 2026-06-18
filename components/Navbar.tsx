"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Zap, Users, PhoneIncoming, BookOpen, Calendar, RefreshCcw, CreditCard, Heart, Shield, Sparkles } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenFeatures, setIsOpenFeatures] = useState(false);
  const [isOpenResources, setIsOpenResources] = useState(false);
  const [isOpenCompany, setIsOpenCompany] = useState(false);

  if (pathname === "/widget-embed" || pathname === "/tour") return null;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter">
          PLUMBIFY
        </Link>
        
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          {/* Features Dropdown */}
          <div className="relative group">
            <button 
              className="flex items-center gap-1 hover:text-blue-600 py-8"
              onMouseEnter={() => setIsOpenFeatures(true)}
              onMouseLeave={() => setIsOpenFeatures(false)}
            >
              Features <ChevronDown size={14} />
            </button>
            <div 
              className={`absolute top-20 left-0 w-72 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 transition-all duration-200 ${isOpenFeatures ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
              onMouseEnter={() => setIsOpenFeatures(true)}
              onMouseLeave={() => setIsOpenFeatures(false)}
            >
              <Link href="/features/speed-to-lead" className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors">
                <Zap size={18} className="text-blue-500" />
                <div className="font-bold text-slate-900">Speed to Lead AI</div>
              </Link>
              <Link href="/features/appointment-booking" className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors">
                <Calendar size={18} className="text-emerald-500" />
                <div className="font-bold text-slate-900">Smart Booking</div>
              </Link>
              <Link href="/features/database-reactivation" className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors">
                <RefreshCcw size={18} className="text-purple-500" />
                <div className="font-bold text-slate-900">Database Reactivation</div>
              </Link>
              <Link href="/features/ai-recruiting" className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors">
                <Users size={18} className="text-orange-500" />
                <div className="font-bold text-slate-900">AI Recruiting</div>
              </Link>
              <Link href="/features/mobile-pos" className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors">
                <CreditCard size={18} className="text-slate-500" />
                <div className="font-bold text-slate-900">Mobile POS</div>
              </Link>
            </div>
          </div>

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
          
          {/* Resources Dropdown */}
          <div className="relative group">
            <button 
              className="flex items-center gap-1 hover:text-blue-600 py-8"
              onMouseEnter={() => setIsOpenResources(true)}
              onMouseLeave={() => setIsOpenResources(false)}
            >
              Resources <ChevronDown size={14} />
            </button>
            <div 
              className={`absolute top-20 left-0 w-72 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 transition-all duration-200 ${isOpenResources ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
              onMouseEnter={() => setIsOpenResources(true)}
              onMouseLeave={() => setIsOpenResources(false)}
            >
              <Link href="/resources/blog" className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors">
                <BookOpen size={18} className="text-blue-500" />
                <div className="font-bold text-slate-900">Plumbing Blog</div>
              </Link>
              <Link href="/resources/10dlc-guide" className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors">
                <Shield size={18} className="text-emerald-500" />
                <div className="font-bold text-slate-900">10DLC Registration</div>
              </Link>
              <Link href="/resources/demos" className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors">
                <Zap size={18} className="text-orange-500" />
                <div className="font-bold text-slate-900">Video Demo Center</div>
              </Link>
              <Link href="/tour" className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors">
                <Sparkles size={18} className="text-blue-500" />
                <div className="font-bold text-slate-900">Interactive Tour</div>
              </Link>
            </div>
          </div>

          {/* Company Dropdown */}
          <div className="relative group">
            <button 
              className="flex items-center gap-1 hover:text-blue-600 py-8"
              onMouseEnter={() => setIsOpenCompany(true)}
              onMouseLeave={() => setIsOpenCompany(false)}
            >
              Company <ChevronDown size={14} />
            </button>
            <div 
              className={`absolute top-20 left-0 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 transition-all duration-200 ${isOpenCompany ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
              onMouseEnter={() => setIsOpenCompany(true)}
              onMouseLeave={() => setIsOpenCompany(false)}
            >
              <Link href="/company" className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors">
                <Heart size={18} className="text-blue-500" />
                <div className="font-bold text-slate-900">Our Story</div>
              </Link>
              <Link href="/company#contact" className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors">
                <PhoneIncoming size={18} className="text-blue-500" />
                <div className="font-bold text-slate-900">Contact Support</div>
              </Link>
            </div>
          </div>

          <Link href="/pricing" className="hover:text-blue-600 py-8">Pricing</Link>
        </div>

        <button className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-all">
          Get Started Free
        </button>
      </div>
    </nav>
  );
}
