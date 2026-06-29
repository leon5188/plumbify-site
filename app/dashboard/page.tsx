"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Star, 
  Zap, 
  RefreshCcw, 
  Database, 
  Search, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  Activity, 
  Calendar,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Map,
  UserCheck,
  DollarSign,
  Package,
  ArrowRight,
  ChevronRight,
  Clock,
  Briefcase,
  Navigation,
  Compass,
  PhoneCall,
  MapPin,
  TrendingDown,
  Layers,
  Check
} from "lucide-react";

interface GHLLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  date: string;
  tags: string[];
}

interface JobCard {
  id: string;
  customerName: string;
  address: string;
  jobType: string;
  priority: "High" | "Medium" | "Low";
  status: "unassigned" | "dispatched" | "inprogress" | "onhold" | "invoiced";
  assignedTech?: string;
  estCost: number;
  x: number; // Map X Coordinate
  y: number; // Map Y Coordinate
}

interface Technician {
  name: string;
  role: string;
  status: "Active" | "Idle" | "On Break";
  assignedJob?: string;
  billableHours: number;
  monthlyRevenue: number;
  routeColor: string;
  routePath: string;
  avatar: string;
}

interface Invoice {
  id: string;
  customerName: string;
  amount: number;
  status: "Overdue" | "Pending" | "Paid";
  dueDate: string;
}

export default function LiveMapDashboard() {
  // Navigation tabs (1 to 5)
  const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "techs" | "finance" | "crm">("overview");
  
  // Data States
  const [stats, setStats] = useState({
    capturedLeads: 0,
    savedRevenue: 0,
    responseTime: "4.8 seconds",
    reviewsCount: 98,
    averageRating: 4.87,
    activeTechs: 8,
    jobsDispatched: 0
  });
  const [recentLeads, setRecentLeads] = useState<GHLLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  // Sub-tab for Jobs: Kanban vs Map
  const [jobView, setJobView] = useState<"kanban" | "map">("map");

  // Live Map Selected States
  const [selectedTechRoute, setSelectedTechRoute] = useState<string>("all");
  const [selectedPin, setSelectedPin] = useState<JobCard | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optMessage, setOptMessage] = useState("Routes optimized based on current traffic parameters.");

  // Jobs Kanban & Coordinate Data
  const [jobs, setJobs] = useState<JobCard[]>([
    { id: "job-1", customerName: "Sarah Connor", address: "742 Evergreen Terr", jobType: "Burst Pipe Repair", priority: "High", status: "inprogress", assignedTech: "Dave", estCost: 950, x: 80, y: 60 },
    { id: "job-2", customerName: "John Connor", address: "1000 S Congress Ave", jobType: "Water Heater Installation", priority: "High", status: "dispatched", assignedTech: "Mike", estCost: 2200, x: 180, y: 140 },
    { id: "job-3", customerName: "Marcus Wright", address: "1206 West Ave", jobType: "Drain Hydro-Jetting", priority: "Medium", status: "unassigned", estCost: 650, x: 280, y: 100 },
    { id: "job-4", customerName: "Grace Harper", address: "508 12th St", jobType: "Garbage Disposal Fix", priority: "Low", status: "onhold", assignedTech: "John", estCost: 280, x: 120, y: 220 },
    { id: "job-5", customerName: "Kate Brewster", address: "2201 Lake Austin Blvd", jobType: "Slab Leak Location", priority: "High", status: "invoiced", assignedTech: "Tyler", estCost: 1800, x: 220, y: 80 },
    { id: "job-6", customerName: "Robert Brewster", address: "3500 Duval St", jobType: "Main Sewer Line Clog", priority: "Medium", status: "inprogress", assignedTech: "Steve", estCost: 1250, x: 320, y: 180 }
  ]);

  // Technicians Data
  const [techs] = useState<Technician[]>([
    { name: "Dave", role: "Master Plumber", status: "Active", assignedJob: "Burst Pipe Repair", billableHours: 38, monthlyRevenue: 18450, routeColor: "#06b6d4", routePath: "M 200,150 L 80,60 L 320,180", avatar: "👨‍🔧" },
    { name: "Mike", role: "Sewer Line Specialist", status: "Active", assignedJob: "Water Heater Installation", billableHours: 35, monthlyRevenue: 15900, routeColor: "#10b981", routePath: "M 200,150 L 180,140 L 120,220", avatar: "👷‍♂️" },
    { name: "John", role: "Service Technician", status: "Active", assignedJob: "Garbage Disposal Fix", billableHours: 32, monthlyRevenue: 11200, routeColor: "#f59e0b", routePath: "M 200,150 L 120,220 L 280,100", avatar: "🛠️" },
    { name: "Steve", role: "Apprentice", status: "Active", assignedJob: "Main Sewer Line Clog", billableHours: 28, monthlyRevenue: 8500, routeColor: "#8b5cf6", routePath: "M 200,150 L 320,180", avatar: "👦" },
    { name: "Tyler", role: "Service Technician", status: "On Break", billableHours: 24, monthlyRevenue: 12100, routeColor: "#ec4899", routePath: "M 200,150 L 220,80", avatar: "🔧" },
    { name: "Alex", role: "Installation Lead", status: "Idle", billableHours: 30, monthlyRevenue: 14800, routeColor: "#64748b", routePath: "", avatar: "🚛" }
  ]);

  // Finance & Inventory Data
  const [materials] = useState([
    { name: "Brass Ball Valves (3/4\")", cost: 18.50, qtyUsed: 14, total: 259 },
    { name: "Copper Piping (Type L - 10ft)", cost: 32.00, qtyUsed: 22, total: 704 },
    { name: "PEX Tubing (Blue/Red - 100ft)", cost: 45.00, qtyUsed: 8, total: 360 },
    { name: "PVC Schedule 40 (3\" - 10ft)", cost: 14.20, qtyUsed: 18, total: 255.60 },
    { name: "Tankless Water Heater Unit", cost: 1250.00, qtyUsed: 3, total: 3750.00 }
  ]);

  const [invoices] = useState<Invoice[]>([
    { id: "INV-2026-001", customerName: "Gregory House", amount: 1250.00, status: "Overdue", dueDate: "2026-06-10" },
    { id: "INV-2026-002", customerName: "Lisa Cuddy", amount: 480.00, status: "Pending", dueDate: "2026-06-25" },
    { id: "INV-2026-003", customerName: "James Wilson", amount: 2200.00, status: "Paid", dueDate: "2026-06-18" },
    { id: "INV-2026-004", customerName: "Eric Foreman", amount: 350.00, status: "Pending", dueDate: "2026-06-30" },
    { id: "INV-2026-005", customerName: "Allison Cameron", amount: 1800.00, status: "Overdue", dueDate: "2026-06-05" }
  ]);

  // CRM: Customer Directory
  const [crmHistory] = useState([
    { name: "Gregory House", phone: "+16262036250", contactId: "crm-c-10293", lastService: "Sewer Hydro-Jetting", date: "2026-05-18", status: "Active Contract", tag: "emergency" },
    { name: "Lisa Cuddy", phone: "+16265550199", contactId: "crm-c-10294", lastService: "Kitchen Faucet Replacement", date: "2026-06-02", status: "No Contract", tag: "quote" },
    { name: "James Wilson", phone: "+16265550188", contactId: "crm-c-10295", lastService: "Tankless Heater Install", date: "2026-06-17", status: "Active Contract", tag: "maintenance" },
    { name: "Eric Foreman", phone: "+16265550177", contactId: "crm-c-10296", lastService: "Garbage Disposal Repair", date: "2026-06-10", status: "Active Contract", tag: "maintenance" },
    { name: "Allison Cameron", phone: "+16265550166", contactId: "crm-c-10297", lastService: "Slab Leak Repipe", date: "2026-05-30", status: "No Contract", tag: "emergency" }
  ]);

  // Vapi Voice Calling State
  const [activeDialLead, setActiveDialLead] = useState<any>(null);
  const [dialCallStatus, setDialCallStatus] = useState<string>("idle"); // idle, dialing, ringing, in-progress, completed, failed
  const [dialCallSummary, setDialCallSummary] = useState<string>("");
  const [isDialing, setIsDialing] = useState<boolean>(false);

  const triggerOutboundCall = async (lead: any) => {
    setActiveDialLead(lead);
    setIsDialing(true);
    setDialCallStatus("dialing");
    setDialCallSummary("");
    
    try {
      const res = await fetch("/api/vapi/outbound", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phoneNumber: lead.phone || "+16262036250",
          name: lead.name
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDialCallStatus("ringing");
        
        if (data.simulated) {
          // Simulator flow for sandbox visual feedback
          await new Promise(r => setTimeout(r, 2000));
          setDialCallStatus("in-progress");
          await new Promise(r => setTimeout(r, 4500));
          setDialCallStatus("completed");
          setDialCallSummary(
            `[SIMULATION REPORT] Call completed. Plumbify AI Assistant successfully called ${lead.name} at ${lead.phone}. Pre-qualified owner on missed-call text-backs. Plumber expressed high interest, confirmed they run 3 trucks, and agreed to join a 14-day free challenge. Live demo booked for Monday at 10 AM EST.`
          );
        } else {
          setDialCallStatus("in-progress");
          setDialCallSummary("AI Call successfully placed via Vapi API! Your phone should start ringing. Once completed, Vapi webhooks will update the CRM.");
        }
      } else {
        setDialCallStatus("failed");
        setDialCallSummary(`Call failed: ${data.error || "Failed to trigger"}`);
      }
    } catch (err: any) {
      setDialCallStatus("failed");
      setDialCallSummary(`Network error: ${err.message}`);
    } finally {
      setIsDialing(false);
    }
  };

  // Fetch GHL data
  const fetchData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch("/api/dashboard-stats");
      if (res.ok) {
        const data = await res.json();
        setStats({
          capturedLeads: data.capturedLeads || 184,
          savedRevenue: data.savedRevenue || 150880,
          responseTime: data.responseTime || "4.8 seconds",
          reviewsCount: data.reviewsCount || 98,
          averageRating: data.averageRating || 4.87,
          activeTechs: data.activeTechs || 8,
          jobsDispatched: data.jobsDispatched || 312
        });
        if (data.recentLeads) {
          setRecentLeads(data.recentLeads);
        }
      }
    } catch (err) {
      console.error("Error fetching GHL telemetry:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Move job card through Kanban
  const moveJobStage = (id: string) => {
    setJobs(prevJobs => {
      return prevJobs.map(job => {
        if (job.id === id) {
          const stages: JobCard["status"][] = ["unassigned", "dispatched", "inprogress", "onhold", "invoiced"];
          const currentIdx = stages.indexOf(job.status);
          const nextIdx = (currentIdx + 1) % stages.length;
          return { ...job, status: stages[nextIdx] };
        }
        return job;
      });
    });
  };

  // Re-optimize route simulation
  const optimizeRoutes = async () => {
    setIsOptimizing(true);
    await new Promise(r => setTimeout(r, 2000));
    setOptMessage("Route sequence optimized! Fuel consumption minimized by 18.2%.");
    setIsOptimizing(false);
  };

  // Get active route path and stats based on selections
  const getRouteStats = () => {
    switch (selectedTechRoute) {
      case "Dave":
        return { stops: 2, distance: "18.4 miles", time: "32 mins", fuelSaved: "14%" };
      case "Mike":
        return { stops: 2, distance: "14.2 miles", time: "25 mins", fuelSaved: "16%" };
      case "John":
        return { stops: 2, distance: "21.6 miles", time: "38 mins", fuelSaved: "12%" };
      case "Steve":
        return { stops: 1, distance: "9.8 miles", time: "18 mins", fuelSaved: "20%" };
      case "Tyler":
        return { stops: 1, distance: "6.2 miles", time: "12 mins", fuelSaved: "15%" };
      default:
        return { stops: 8, distance: "70.2 miles (combined)", time: "125 mins (total)", fuelSaved: "18.2%" };
    }
  };

  // Calculations
  const totalAr = invoices.filter(inv => inv.status !== "Paid").reduce((acc, curr) => acc + curr.amount, 0);
  const totalMaterialCosts = materials.reduce((acc, curr) => acc + curr.total, 0);
  const totalRevenue = stats.savedRevenue || 150880;
  const netProfit = Math.round(totalRevenue * 0.35);

  const routeDetails = getRouteStats();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#081a3d] via-[#10326e] to-[#0a52a3] text-slate-100 flex font-sans relative antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* GLOBAL GRAPHIC BACKGROUND RADIALS */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-br from-cyan-400/20 to-blue-500/0 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-10 w-[650px] h-[650px] bg-gradient-to-tr from-cyan-500/10 to-indigo-500/0 rounded-full blur-[160px] pointer-events-none z-0"></div>

      {/* DYNAMIC AUDIO WAVE & NEON GLOW CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes soundwave {
          0%, 100% { transform: scaleY(0.2); }
          50% { transform: scaleY(1); }
        }
        .audio-wave-bar {
          animation: soundwave 1s ease-in-out infinite;
          transform-origin: bottom;
        }
        .audio-wave-bar:nth-child(2) { animation-delay: 0.15s; }
        .audio-wave-bar:nth-child(3) { animation-delay: 0.3s; }
        .audio-wave-bar:nth-child(4) { animation-delay: 0.45s; }
        .audio-wave-bar:nth-child(5) { animation-delay: 0.6s; }
        .audio-wave-bar:nth-child(6) { animation-delay: 0.75s; }
        
        .neon-glow-card {
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.15);
          border-color: rgba(6, 182, 212, 0.25) !important;
        }
        .neon-glow-card:hover {
          box-shadow: 0 0 25px rgba(6, 182, 212, 0.35);
          border-color: rgba(6, 182, 212, 0.7) !important;
        }
        .neon-glow-card-emerald {
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.15);
          border-color: rgba(16, 185, 129, 0.25) !important;
        }
        .neon-glow-card-emerald:hover {
          box-shadow: 0 0 25px rgba(16, 185, 129, 0.35);
          border-color: rgba(16, 185, 129, 0.7) !important;
        }
        .neon-glow-card-purple {
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.15);
          border-color: rgba(168, 85, 247, 0.25) !important;
        }
        .neon-glow-card-purple:hover {
          box-shadow: 0 0 25px rgba(168, 85, 247, 0.35);
          border-color: rgba(168, 85, 247, 0.7) !important;
        }
        .neon-glow-card-yellow {
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.15);
          border-color: rgba(245, 158, 11, 0.25) !important;
        }
        .neon-glow-card-yellow:hover {
          box-shadow: 0 0 25px rgba(245, 158, 11, 0.35);
          border-color: rgba(245, 158, 11, 0.7) !important;
        }
        
        .neon-text-cyan {
          text-shadow: 0 0 10px rgba(6, 182, 212, 0.6);
        }
        .neon-text-emerald {
          text-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
        }
        .neon-text-purple {
          text-shadow: 0 0 10px rgba(168, 85, 247, 0.6);
        }
        .neon-text-yellow {
          text-shadow: 0 0 10px rgba(245, 158, 11, 0.6);
        }
      `}} />

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-68 bg-[#0b1428]/95 border-r border-[#1e293b]/50 flex flex-col justify-between shrink-0 z-10 backdrop-blur-xl relative">
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="h-22 border-b border-[#1e293b]/40 flex items-center px-6 gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-white text-base">PLUMBIFY</span>
              <span className="block text-[10px] text-cyan-400 font-mono tracking-widest uppercase">Dispatcher</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all border ${activeTab === "overview" ? "bg-cyan-500/10 text-cyan-400 border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.3)]" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-transparent"}`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 size={16} className={activeTab === "overview" ? "text-cyan-400" : "text-slate-500"} />
                <span>Overview (KPIs)</span>
              </div>
              <ChevronRight size={12} className="opacity-60" />
            </button>

            <button 
              onClick={() => setActiveTab("jobs")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all border ${activeTab === "jobs" ? "bg-cyan-500/10 text-cyan-400 border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.3)]" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-transparent"}`}
            >
              <div className="flex items-center gap-3">
                <Map size={16} className={activeTab === "jobs" ? "text-cyan-400" : "text-slate-500"} />
                <span>Job & GPS Dispatch</span>
              </div>
              <ChevronRight size={12} className="opacity-60" />
            </button>

            <button 
              onClick={() => setActiveTab("techs")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all border ${activeTab === "techs" ? "bg-cyan-500/10 text-cyan-400 border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.3)]" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-transparent"}`}
            >
              <div className="flex items-center gap-3">
                <UserCheck size={16} className={activeTab === "techs" ? "text-cyan-400" : "text-slate-500"} />
                <span>Technician Status</span>
              </div>
              <ChevronRight size={12} className="opacity-60" />
            </button>

            <button 
              onClick={() => setActiveTab("finance")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all border ${activeTab === "finance" ? "bg-cyan-500/10 text-cyan-400 border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.3)]" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-transparent"}`}
            >
              <div className="flex items-center gap-3">
                <DollarSign size={16} className={activeTab === "finance" ? "text-cyan-400" : "text-slate-500"} />
                <span>Ledger & Materials</span>
              </div>
              <ChevronRight size={12} className="opacity-60" />
            </button>

            <button 
              onClick={() => setActiveTab("crm")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all border ${activeTab === "crm" ? "bg-cyan-500/10 text-cyan-400 border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.3)]" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-transparent"}`}
            >
              <div className="flex items-center gap-3">
                <Users size={16} className={activeTab === "crm" ? "text-cyan-400" : "text-slate-500"} />
                <span>CRM & Outreach</span>
              </div>
              <ChevronRight size={12} className="opacity-60" />
            </button>
          </nav>
        </div>

        {/* Dispatcher status footer */}
        <div className="p-4 border-t border-[#1e293b]/40 bg-[#070b13]/60">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Live CRM Connected</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col overflow-y-auto z-10 relative">
        
        {/* Top Control Bar */}
        <header className="h-22 border-b border-[#1e293b]/40 px-8 flex items-center justify-between shrink-0 bg-[#080d19]/40 backdrop-blur-md sticky top-0 z-40">
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Operations Command Center</span>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-mono font-normal">v2.0</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Automated dispatching, GPS route planning, and voice lead triage</p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="px-4 py-2.5 bg-slate-900/60 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 rounded-xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all flex items-center gap-2 text-xs font-semibold"
            >
              <RefreshCcw size={14} className={refreshing ? "animate-spin text-cyan-400" : ""} />
              <span>{refreshing ? "Synchronizing..." : "Sync Database"}</span>
            </button>
          </div>
        </header>

        {/* CONTAINER CONTENT */}
        <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">

          {/* ================================================================= */}
          {/* TAB 1: KPI OVERVIEW                                               */}
          {/* ================================================================= */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              
              {/* Row 1: Bento KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 1. Active Jobs */}
                <div className="bg-[#121f3d]/50 border border-slate-700/65 rounded-2xl p-6 transition-all duration-300 shadow-xl flex flex-col justify-between relative group overflow-hidden neon-glow-card">
                  <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Jobs</span>
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                      <Briefcase size={16} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-4xl font-extrabold text-white font-mono tracking-tight neon-text-cyan">24</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-3 font-semibold">
                      <span className="text-cyan-400">12 In Progress</span>
                      <span>•</span>
                      <span className="text-emerald-400">8 Dispatched</span>
                    </div>
                  </div>
                </div>

                {/* 2. Total Revenue */}
                <div className="bg-[#121f3d]/50 border border-slate-700/65 rounded-2xl p-6 transition-all duration-300 shadow-xl flex flex-col justify-between relative group overflow-hidden neon-glow-card-emerald">
                  <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Revenue</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <DollarSign size={16} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-4xl font-extrabold text-white font-mono tracking-tight neon-text-emerald">${totalRevenue.toLocaleString()}</div>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold mt-3">
                      <TrendingUp size={12} />
                      <span>Total CRM Monthly Intake</span>
                    </div>
                  </div>
                </div>

                {/* 3. Net Profit */}
                <div className="bg-[#121f3d]/50 border border-slate-700/65 rounded-2xl p-6 transition-all duration-300 shadow-xl flex flex-col justify-between relative group overflow-hidden neon-glow-card-purple">
                  <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-colors pointer-events-none"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Est. Net Profit</span>
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                      <Zap size={16} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-4xl font-extrabold text-white font-mono tracking-tight neon-text-purple">${netProfit.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-3 leading-relaxed">
                      Margin: <span className="text-purple-400 font-bold">35%</span> after labor, parts & overhead
                    </div>
                  </div>
                </div>

                {/* 4. Customer Rating */}
                <div className="bg-[#121f3d]/50 border border-slate-700/65 rounded-2xl p-6 transition-all duration-300 shadow-xl flex flex-col justify-between relative group overflow-hidden neon-glow-card-yellow">
                  <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-yellow-500/5 rounded-full blur-xl group-hover:bg-yellow-500/10 transition-colors pointer-events-none"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rating Score</span>
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                      <Star size={16} className="fill-yellow-500/20" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-4xl font-extrabold text-white font-mono tracking-tight flex items-baseline gap-1 neon-text-yellow">
                      <span>{stats.averageRating}</span>
                      <span className="text-xs text-slate-400 font-normal">/5.0</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-3 font-semibold flex items-center gap-1.5">
                      <CheckCircle size={10} className="text-yellow-500" />
                      <span>Based on {stats.reviewsCount} Google Reviews</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Row 2: Graphic analytics & Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Monthly trend chart */}
                <div className="lg:col-span-2 bg-[#0e1524]/40 border border-[#1e293b]/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-sm font-bold text-white">Monthly Revenue & CRM Telemetry</h3>
                      <p className="text-[11px] text-slate-400">Calculated intake from linked GoHighLevel pipelines</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                      <span className="w-2 h-2 rounded bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]"></span>
                      <span>Total Revenue (USD)</span>
                    </div>
                  </div>

                  {/* Visual Grid Chart */}
                  <div className="h-66 w-full flex items-end justify-between px-2 pt-4 relative">
                    {/* Horizontal gridlines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-4 border-b border-slate-800/20">
                      <div className="w-full border-t border-slate-800/20"></div>
                      <div className="w-full border-t border-slate-800/20"></div>
                      <div className="w-full border-t border-slate-800/20"></div>
                    </div>

                    {[
                      { m: "Jan", rev: 34, val: 42 },
                      { m: "Feb", rev: 47, val: 58 },
                      { m: "Mar", rev: 68, val: 84 },
                      { m: "Apr", rev: 90, val: 110 },
                      { m: "May", rev: 116, val: 142 },
                      { m: "Jun", rev: Math.round(totalRevenue/1000), val: stats.capturedLeads || 184 },
                    ].map((item, i) => {
                      const maxVal = 200;
                      const pct = Math.min((item.val / maxVal) * 100, 100);
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full z-10 group">
                          <div className="bg-[#0b0f19]/95 text-white font-mono text-[9px] font-bold px-2 py-1 rounded-lg border border-slate-800 mb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute transform -translate-y-16 shadow-2xl shadow-cyan-500/10">
                            ${item.rev}k ({item.val} Leads)
                          </div>
                          <div 
                            style={{ height: `${pct}%` }}
                            className="w-11 bg-gradient-to-t from-cyan-600/40 via-cyan-500 to-cyan-300 hover:from-cyan-500 hover:to-cyan-200 rounded-t-lg transition-all duration-500 shadow-[0_0_15px_rgba(6,182,212,0.15)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.35)]"
                          ></div>
                          <span className="text-[10px] font-bold text-slate-500 mt-3 tracking-wider">{item.m}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live Activity Stream */}
                <div className="bg-[#0e1524]/40 border border-[#1e293b]/50 rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Live CRM Activity Stream</h3>
                    <p className="text-[11px] text-slate-400">Incoming lead notifications routed via Webhook</p>
                  </div>

                  <div className="space-y-3.5 max-h-[280px] overflow-y-auto mt-4 pr-1 scrollbar-thin">
                    {recentLeads.slice(0, 3).map((lead, idx) => (
                      <div key={idx} className="bg-[#070b13]/80 border border-slate-800 p-3.5 rounded-xl flex items-start justify-between text-xs hover:border-cyan-500/20 transition-colors">
                        <div className="space-y-1">
                          <div className="font-bold text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                            <span>{lead.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium font-mono">{lead.phone}</div>
                        </div>
                        <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-md font-mono font-semibold">
                          {lead.source}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: JOBS & SCHEDULING (FLEET DISPATCH MAP)                     */}
          {/* ================================================================= */}
          {activeTab === "jobs" && (
            <div className="space-y-8">
              
              {/* Kanban vs Map Navigation Bar */}
              <div className="flex items-center justify-between bg-[#0e1524]/60 border border-[#1e293b]/50 rounded-2xl p-3 shadow-xl backdrop-blur-md">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setJobView("kanban")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${jobView === "kanban" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]" : "text-slate-400 hover:text-slate-200 border-transparent"}`}
                  >
                    Kanban Dispatch Board
                  </button>
                  <button 
                    onClick={() => setJobView("map")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${jobView === "map" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]" : "text-slate-400 hover:text-slate-200 border-transparent"}`}
                  >
                    Smart Fleet Route Tracker
                  </button>
                </div>
                
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">Active Jobs: {jobs.length}</span>
              </div>

              {/* A. KANBAN COLUMN STAGES */}
              {jobView === "kanban" && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-x-auto min-w-[1000px] pb-4">
                  
                  {[
                    { key: "unassigned", title: "Unassigned", color: "border-slate-800/60 bg-slate-900/10" },
                    { key: "dispatched", title: "Dispatched", color: "border-cyan-500/10 bg-cyan-950/5" },
                    { key: "inprogress", title: "In Progress", color: "border-orange-500/10 bg-orange-950/5" },
                    { key: "onhold", title: "On Hold", color: "border-red-500/10 bg-red-950/5" },
                    { key: "invoiced", title: "Invoiced", color: "border-emerald-500/10 bg-emerald-950/5" },
                  ].map((column) => {
                    const colJobs = jobs.filter(job => job.status === column.key);
                    return (
                      <div key={column.key} className={`border rounded-2xl p-4 flex flex-col space-y-4 min-h-[500px] ${column.color}`}>
                        <div className="flex items-center justify-between shrink-0 border-b border-slate-800/40 pb-2">
                          <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">{column.title}</h4>
                          <span className="text-[10px] bg-slate-900/80 text-slate-400 border border-slate-800 px-2 py-0.5 rounded-full font-mono font-bold">{colJobs.length}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                          {colJobs.map((job) => (
                            <div key={job.id} className="bg-[#070b13]/85 border border-[#1e293b]/50 p-4 rounded-xl space-y-3.5 shadow-md hover:border-cyan-500/30 transition-all duration-300 relative group overflow-hidden">
                              <div className="absolute top-0 right-0 w-8 h-8 bg-cyan-500/5 rounded-full blur-lg pointer-events-none"></div>
                              <div className="space-y-1">
                                <div className="flex items-start justify-between">
                                  <div className="font-bold text-white text-xs">{job.customerName}</div>
                                  <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-extrabold uppercase tracking-wider ${
                                    job.priority === "High" ? "bg-red-500/10 text-red-400 border border-red-500/20" : 
                                    job.priority === "Medium" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : 
                                    "bg-slate-800 text-slate-400"
                                  }`}>
                                    {job.priority}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-400 leading-normal">{job.address}</div>
                              </div>

                              <div className="pt-2.5 border-t border-slate-800/40 flex flex-col gap-1.5 text-[10px]">
                                <div className="flex items-center justify-between text-slate-400 font-medium">
                                  <span>Job: {job.jobType}</span>
                                </div>
                                <div className="flex items-center justify-between font-semibold">
                                  <span className="text-slate-500">Tech: {job.assignedTech || "Unassigned"}</span>
                                  <span className="font-mono text-emerald-400 font-bold">${job.estCost}</span>
                                </div>
                              </div>

                              <button 
                                onClick={() => moveJobStage(job.id)}
                                className="w-full py-2 bg-slate-900/60 hover:bg-cyan-600/10 text-cyan-400 hover:text-cyan-300 text-[10px] rounded-lg border border-cyan-500/10 hover:border-cyan-500/30 font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                              >
                                <span>Move Forward</span>
                                <ArrowRight size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                </div>
              )}

              {/* B. LIVE FLEET GPS MAP GRID */}
              {jobView === "map" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Visual Map Canvas (2 Cols) */}
                  <div className="lg:col-span-2 bg-[#0e1524]/40 border border-[#1e293b]/50 rounded-2xl p-6 h-[550px] flex flex-col justify-between shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="flex items-center justify-between shrink-0">
                      <div>
                        <h3 className="text-sm font-bold text-white mb-1">Live GPS Route Planning</h3>
                        <p className="text-xs text-slate-400">Coordinates of active jobs, technicians, and route networks</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Track vehicle:</label>
                        <select 
                           value={selectedTechRoute}
                           onChange={(e) => {
                             setSelectedTechRoute(e.target.value);
                             setSelectedPin(null);
                           }}
                           className="bg-[#070b13] border border-slate-800 text-cyan-400 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500/50 hover:border-slate-700 transition-colors font-semibold"
                        >
                          <option value="all">All Active Routes</option>
                          <option value="Dave">Dave (Master Plumber)</option>
                          <option value="Mike">Mike (Sewer Specialist)</option>
                          <option value="John">John (Service Tech)</option>
                          <option value="Steve">Steve (Apprentice)</option>
                        </select>
                      </div>
                    </div>

                    {/* SVG Map Canvas */}
                    <div className="flex-1 bg-[#050811] border border-[#1e293b]/50 rounded-xl relative overflow-hidden my-4 flex items-center justify-center shadow-inner">
                      
                      {/* Grid representation */}
                      <svg className="w-full h-full opacity-15 absolute inset-0" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="grid-map-glow" width="24" height="24" patternUnits="userSpaceOnUse">
                            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#06b6d4" strokeWidth="0.5" strokeOpacity="0.4"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid-map-glow)" />
                      </svg>

                      {/* Map Graphics */}
                      <svg className="w-[85%] h-[85%] absolute z-10" viewBox="0 0 400 300">
                        {/* Office HQ Station */}
                        <g transform="translate(200, 150)">
                          <circle r="12" fill="#06b6d4" fillOpacity="0.2" className="animate-ping" />
                          <rect x="-8" y="-8" width="16" height="16" rx="3" fill="#06b6d4" className="drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                          <text x="12" y="4" fill="#06b6d4" fontSize="8" fontWeight="bold" fontFamily="monospace" letterSpacing="1">HQ</text>
                        </g>

                        {/* Render Paths & GPS trackers */}
                        {techs.map((tech, i) => {
                          const isSelected = selectedTechRoute === "all" || selectedTechRoute === tech.name;
                          if (!tech.routePath || !isSelected) return null;

                          return (
                            <g key={i}>
                              {/* Background route path line */}
                              <path 
                                d={tech.routePath} 
                                fill="none" 
                                stroke={tech.routeColor} 
                                strokeWidth={selectedTechRoute === tech.name ? "3.5" : "2"} 
                                strokeOpacity={selectedTechRoute === "all" ? "0.3" : "0.9"}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />

                              {/* GPS vehicle animation tracker moving along path */}
                              <circle r="6" fill="#ffffff" stroke={tech.routeColor} strokeWidth="2.5" className="drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                                <animateMotion 
                                  dur={selectedTechRoute === "all" ? "14s" : "8s"} 
                                  repeatCount="indefinite" 
                                  path={tech.routePath} 
                                />
                              </circle>
                            </g>
                          );
                        })}

                        {/* Render clickable location pins */}
                        {jobs.map((job) => {
                          const isTarget = selectedTechRoute === "all" || job.assignedTech === selectedTechRoute;
                          const opacityClass = isTarget ? "opacity-100 scale-100" : "opacity-10 scale-95 pointer-events-none";

                          return (
                            <g 
                              key={job.id} 
                              transform={`translate(${job.x}, ${job.y})`}
                              className={`cursor-pointer transition-all duration-300 ${opacityClass}`}
                              onClick={() => setSelectedPin(job)}
                            >
                              <circle 
                                r="12" 
                                fill={job.priority === "High" ? "#ef4444" : job.priority === "Medium" ? "#f59e0b" : "#64748b"} 
                                fillOpacity="0.25" 
                                className={job.status === "inprogress" ? "animate-ping" : ""}
                              />
                              <circle r="7" fill={job.priority === "High" ? "#ef4444" : job.priority === "Medium" ? "#f59e0b" : "#64748b"} stroke="#ffffff" strokeWidth="1.5" />
                              <text x="12" y="3" fill="#cbd5e1" fontSize="7.5" fontWeight="extrabold" fontFamily="sans-serif" drop-shadow="0 1px 2px rgba(0,0,0,0.8)">{job.customerName.split(" ")[0]}</text>
                            </g>
                          );
                        })}
                      </svg>

                      {/* In-Map Click Overlay Info */}
                      {selectedPin && (
                        <div className="absolute bottom-4 left-4 right-4 bg-[#0a0f1d]/95 border border-[#1e293b] rounded-xl p-4.5 z-20 flex justify-between items-center shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-2 duration-200">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <MapPin size={14} className="text-cyan-400" />
                              <span className="text-xs font-bold text-white">{selectedPin.customerName}</span>
                              <span className={`text-[8px] px-2 py-0.5 rounded font-extrabold uppercase tracking-wider ${
                                selectedPin.priority === "High" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-slate-800 text-slate-400"
                              }`}>{selectedPin.priority}</span>
                            </div>
                            <div className="text-[10px] text-slate-400">{selectedPin.address} | Job: <span className="text-cyan-400 font-semibold">{selectedPin.jobType}</span></div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right text-[10px]">
                              <span className="text-slate-500 block">Tech: {selectedPin.assignedTech || "Unassigned"}</span>
                              <span className="text-emerald-400 font-bold block">${selectedPin.estCost} est.</span>
                            </div>
                            <button 
                              onClick={() => setSelectedPin(null)}
                              className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg font-bold transition-all"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0">
                      <span>Service Area: Austin Metro Area</span>
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>High Priority</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>Medium Priority</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>Low Priority</span>
                      </div>
                    </div>
                  </div>

                  {/* Route planning stats / Optimization (1 Col) */}
                  <div className="bg-[#0e1524]/40 border border-[#1e293b]/50 rounded-2xl p-6 h-[550px] flex flex-col justify-between shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div>
                      <div className="flex items-center gap-2.5 text-white mb-2 font-bold text-base">
                        <Compass size={18} className="text-cyan-400 animate-spin" style={{ animationDuration: "20s" }} />
                        <h3>Smart GPS Dispatch</h3>
                      </div>
                      <p className="text-xs text-slate-400 mb-6">Real-time GPS routing parameters compiled based on traffic indices.</p>

                      <div className="space-y-4 bg-[#070b13] border border-slate-800/80 p-4 rounded-xl">
                        <div className="flex justify-between items-center border-b border-slate-800/40 pb-2.5 text-xs">
                          <span className="text-slate-400 font-medium">Tracking Fleet:</span>
                          <span className="font-bold text-white">{selectedTechRoute === "all" ? "All Active Trucks" : `${selectedTechRoute} Truck`}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-800/40 pb-2.5 text-xs">
                          <span className="text-slate-400 font-medium">Completed/Stops:</span>
                          <span className="font-mono text-white font-semibold">{routeDetails.stops} stops</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-800/40 pb-2.5 text-xs">
                          <span className="text-slate-400 font-medium">Intake Miles:</span>
                          <span className="font-mono text-white font-semibold">{routeDetails.distance}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-800/40 pb-2.5 text-xs">
                          <span className="text-slate-400 font-medium">Active Drive Time:</span>
                          <span className="font-mono text-white font-semibold">{routeDetails.time}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-medium">Optimal Fuel Saving:</span>
                          <span className="font-mono text-emerald-400 font-bold">+{routeDetails.fuelSaved}</span>
                        </div>
                      </div>

                      {/* Route re-optimization trigger */}
                      <div className="mt-6">
                        <button 
                          onClick={optimizeRoutes}
                          disabled={isOptimizing}
                          className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-950/40 text-cyan-100 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-cyan-500/20 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] shadow-lg"
                        >
                          <Navigation size={14} className={isOptimizing ? "animate-spin" : ""} />
                          <span>{isOptimizing ? "Calibrating..." : "Optimize Dispatch Routes"}</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#070b13]/80 border border-slate-800 rounded-xl flex items-start gap-2.5 text-[10px] text-slate-400 shrink-0 select-none">
                      <ShieldCheck size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <div className="leading-relaxed font-medium">{optMessage}</div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: TECHNICIAN PERFORMANCE                                     */}
          {/* ================================================================= */}
          {activeTab === "techs" && (
            <div className="space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. Daily Schedule & Status */}
                <div className="lg:col-span-2 bg-[#0e1524]/40 border border-[#1e293b]/50 rounded-2xl p-6 flex flex-col h-[500px] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Technicians Dispatch Board</h3>
                    <p className="text-xs text-slate-400 mb-6">Real-time status of active master plumbers and dispatch routes</p>
                  </div>

                  <div className="flex-1 overflow-y-auto border border-slate-800/80 rounded-xl bg-[#070b13] scrollbar-thin">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-850 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900/50">
                          <th className="p-4">Name</th>
                          <th className="p-4">Specialization</th>
                          <th className="p-4">GPS Status</th>
                          <th className="p-4">Active Task</th>
                        </tr>
                      </thead>
                      <tbody>
                        {techs.map((tech, i) => (
                          <tr key={i} className="border-b border-slate-900 hover:bg-slate-900/10 transition-colors">
                            <td className="p-4 font-bold text-white flex items-center gap-2">
                              <span className="text-base select-none">{tech.avatar}</span>
                              <span>{tech.name}</span>
                            </td>
                            <td className="p-4 text-slate-300 font-medium">{tech.role}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                                tech.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" :
                                tech.status === "Idle" ? "bg-slate-800 text-slate-400 border border-slate-800" :
                                "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                              }`}>
                                <span className={`w-1 h-1 rounded-full ${
                                  tech.status === "Active" ? "bg-emerald-400" :
                                  tech.status === "Idle" ? "bg-slate-400" :
                                  "bg-amber-400"
                                }`}></span>
                                {tech.status}
                              </span>
                            </td>
                            <td className="p-4 text-slate-400 font-semibold">{tech.assignedJob || "Idle / Free"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Billable Hours & Revenue */}
                <div className="bg-[#0e1524]/40 border border-[#1e293b]/50 rounded-2xl p-6 h-[500px] flex flex-col justify-between shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Revenue Leaderboard</h3>
                    <p className="text-xs text-slate-400 mb-6">Comparison of total billable hours and monthly invoice value</p>
                  </div>

                  <div className="space-y-5 flex-1 overflow-y-auto pr-1 scrollbar-thin">
                    {techs.map((tech, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold">{tech.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">({tech.billableHours} hrs)</span>
                          </div>
                          <span className="font-mono text-emerald-400 font-bold">${tech.monthlyRevenue.toLocaleString()}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-900/60 rounded-full overflow-hidden border border-slate-800">
                          <div 
                            style={{ width: `${Math.min((tech.monthlyRevenue / 20000) * 100, 100)}%` }}
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-800/60 text-[10px] text-slate-400 flex justify-between font-semibold uppercase tracking-wider">
                    <span>* Updates on payroll cadence</span>
                    <span>Top Dispatcher: Dave</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: FINANCE & INVENTORY                                        */}
          {/* ================================================================= */}
          {activeTab === "finance" && (
            <div className="space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. Inventory & Materials */}
                <div className="lg:col-span-2 bg-[#0e1524]/40 border border-[#1e293b]/50 rounded-2xl p-6 flex flex-col h-[500px] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Real-Time Inventory Costs</h3>
                    <p className="text-xs text-slate-400 mb-6">Invoiced material ledger mapping copper piping, valves, and units used</p>
                  </div>

                  <div className="flex-1 overflow-y-auto border border-slate-800/80 rounded-xl bg-[#070b13] scrollbar-thin">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-850 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900/50">
                          <th className="p-4">Material / Part</th>
                          <th className="p-4">Unit Cost</th>
                          <th className="p-4">Qty</th>
                          <th className="p-4">Total Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {materials.map((mat, i) => (
                          <tr key={i} className="border-b border-slate-900 hover:bg-slate-900/10 transition-colors">
                            <td className="p-4 font-bold text-white flex items-center gap-2">
                              <Package size={14} className="text-slate-400" />
                              <span>{mat.name}</span>
                            </td>
                            <td className="p-4 font-mono text-slate-300">${mat.cost.toFixed(2)}</td>
                            <td className="p-4 font-mono text-slate-300">{mat.qtyUsed}</td>
                            <td className="p-4 font-mono text-emerald-400 font-bold">${mat.total.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 p-4 bg-[#070b13] border border-slate-800 rounded-xl flex items-center justify-between text-xs shrink-0">
                    <span className="font-bold text-slate-400 uppercase tracking-wider">Total Part Expenses:</span>
                    <span className="font-mono text-base font-extrabold text-red-400">${totalMaterialCosts.toLocaleString()}</span>
                  </div>
                </div>

                {/* 2. Accounts Receivable (A/R) & Margin */}
                <div className="space-y-8">
                  
                  {/* Overdue/Pending Ledger */}
                  <div className="bg-[#0e1524]/40 border border-[#1e293b]/50 rounded-2xl p-6 h-[280px] flex flex-col justify-between shadow-xl relative overflow-hidden">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">Accounts Receivable (A/R)</h3>
                      <p className="text-xs text-slate-400 mb-4">Tracking customer invoices, billing schedules, and ledger balances</p>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
                      {invoices.slice(0, 3).map((inv) => (
                        <div key={inv.id} className="bg-[#070b13]/85 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-white">{inv.customerName}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">{inv.id} (Due {inv.dueDate})</div>
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-white font-bold block">${inv.amount.toLocaleString()}</span>
                            <span className={`text-[8px] font-extrabold uppercase tracking-wider ${
                              inv.status === "Overdue" ? "text-red-400" :
                              inv.status === "Pending" ? "text-amber-400" :
                              "text-emerald-400"
                            }`}>{inv.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-bold shrink-0">
                      <span className="text-slate-400 uppercase tracking-wider">Total Outstanding A/R:</span>
                      <span className="font-mono text-emerald-400 text-sm">${totalAr.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Net Margins */}
                  <div className="bg-[#0e1524]/40 border border-[#1e293b]/50 rounded-2xl p-6 h-[190px] flex flex-col justify-between shadow-xl relative overflow-hidden">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">Margin by Job Type</h3>
                      <p className="text-xs text-slate-400 mb-3">Profit percentages per operational category</p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { type: "🚨 Emergency Dispatches", margin: 68, color: "from-red-500 to-red-400" },
                        { type: "🔧 Service & Contracts", margin: 55, color: "from-cyan-500 to-cyan-300" },
                        { type: "📦 Large Installs & Heaters", margin: 42, color: "from-purple-500 to-purple-400" },
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1 text-xs">
                          <div className="flex justify-between font-semibold">
                            <span className="text-slate-300">{item.type}</span>
                            <span className="text-slate-400 font-mono">{item.margin}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-900/60 rounded-full overflow-hidden border border-slate-800">
                            <div style={{ width: `${item.margin}%` }} className={`h-full bg-gradient-to-r ${item.color} rounded-full`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: CRM & MARKETING                                            */}
          {/* ================================================================= */}
          {activeTab === "crm" && (
            <div className="space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. Lead Sources */}
                <div className="bg-[#0e1524]/40 border border-[#1e293b]/50 rounded-2xl p-6 h-[500px] flex flex-col justify-between shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Lead Attribution Channels</h3>
                    <p className="text-xs text-slate-400 mb-6">Marketing source distribution for Plumbify leads</p>
                  </div>

                  <div className="space-y-4 flex-1 overflow-y-auto pr-1 scrollbar-thin">
                    {[
                      { name: "Google Search Ads", leads: 74, pct: 40, color: "from-cyan-500 to-blue-500 shadow-[0_0_8px_rgba(6,182,212,0.3)]" },
                      { name: "Yelp Local Reviews", leads: 46, pct: 25, color: "from-red-500 to-orange-500" },
                      { name: "Referrals & Organic", leads: 37, pct: 20, color: "from-emerald-500 to-emerald-400" },
                      { name: "Yard Signs & Flyers", leads: 27, pct: 15, color: "from-yellow-500 to-yellow-400" },
                    ].map((src, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-300">{src.name}</span>
                          <span className="font-mono text-slate-400 font-bold">{src.leads} ({src.pct}%)</span>
                        </div>
                        <div className="h-2 w-full bg-slate-900/60 rounded-full overflow-hidden border border-slate-800">
                          <div 
                            style={{ width: `${src.pct}%` }}
                            className={`h-full bg-gradient-to-r ${src.color} rounded-full`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-800/60 text-[10px] text-slate-400 flex justify-between font-semibold uppercase tracking-wider">
                    <span>Sync: GHL Opportunities</span>
                    <span>Rank: Google Ads</span>
                  </div>
                </div>

                {/* 2. Customer Directory */}
                <div className="lg:col-span-2 bg-[#0e1524]/40 border border-[#1e293b]/50 rounded-2xl p-6 flex flex-col h-[500px] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">CRM Outreach Directory</h3>
                    <p className="text-xs text-slate-400 mb-6">GHL-linked leads directory with live AI outbound calling option</p>
                  </div>

                  <div className="flex-1 overflow-y-auto border border-slate-800/80 rounded-xl bg-[#070b13] scrollbar-thin">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-850 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900/50">
                          <th className="p-4">Customer</th>
                          <th className="p-4">Contact ID</th>
                          <th className="p-4">Last Service</th>
                          <th className="p-4">Contract</th>
                          <th className="p-4 text-right">AI Assistant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {crmHistory.map((cust, i) => (
                          <tr key={i} className="border-b border-slate-900 hover:bg-slate-900/10 transition-colors">
                            <td className="p-4 text-white">
                              <div className="font-bold">{cust.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">{cust.phone}</div>
                            </td>
                            <td className="p-4 font-mono text-slate-500">{cust.contactId}</td>
                            <td className="p-4 text-slate-300 font-medium">{cust.lastService}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                                cust.status === "Active Contract" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" : "bg-slate-800 text-slate-400"
                              }`}>
                                <span className={`w-1 h-1 rounded-full ${
                                  cust.status === "Active Contract" ? "bg-emerald-400" : "bg-slate-400"
                                }`}></span>
                                {cust.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => triggerOutboundCall(cust)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600/10 hover:bg-cyan-600 text-cyan-400 hover:text-white border border-cyan-500/25 hover:border-cyan-500 rounded-xl text-[10px] font-bold transition-all shadow-sm"
                              >
                                <PhoneCall size={10} />
                                <span>Call Lead</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </main>

      {/* VAPI VOICE DIALER SIMULATOR MODAL */}
      {activeDialLead && (
        <div className="fixed inset-0 bg-[#02050b]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#090f1d] border border-[#1e293b] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-cyan-500/15 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Activity size={16} className={isDialing ? "animate-pulse" : ""} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Assistant Dialer</h3>
                  <p className="text-[10px] text-slate-400">Powered by Vapi Outbound Engine</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setActiveDialLead(null);
                  setDialCallStatus("idle");
                  setDialCallSummary("");
                }}
                className="text-slate-400 hover:text-white transition-colors text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              
              {/* Contact Card */}
              <div className="bg-[#070b13] border border-slate-800/80 p-4 rounded-xl flex items-center justify-between shadow-inner">
                <div className="space-y-1">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Call Target</div>
                  <div className="text-sm font-bold text-white">{activeDialLead.name}</div>
                  <div className="text-[10px] text-cyan-400 font-mono">{activeDialLead.phone || "+1 (626) 203-6250"}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    dialCallStatus === "completed" ? "bg-emerald-500 animate-pulse" :
                    dialCallStatus === "failed" ? "bg-red-500" :
                    dialCallStatus === "idle" ? "bg-slate-500" :
                    "bg-cyan-400 animate-ping"
                  }`}></span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300">
                    {dialCallStatus}
                  </span>
                </div>
              </div>

              {/* Dialer Wave Visualizer */}
              <div className="flex flex-col items-center justify-center py-6 bg-[#070b13]/40 border border-slate-800/80 rounded-xl min-h-[120px]">
                {dialCallStatus === "dialing" && (
                  <div className="text-center space-y-2">
                    <div className="text-xs text-slate-400 font-semibold">Initiating connection parameters...</div>
                    <div className="text-[9px] text-cyan-400 animate-pulse font-mono font-bold">API POST: /api/vapi/outbound</div>
                  </div>
                )}
                {dialCallStatus === "ringing" && (
                  <div className="text-center space-y-2">
                    <div className="text-xs text-cyan-400 font-bold animate-pulse">Ringing Phone Line...</div>
                    <div className="text-[9px] text-slate-500 font-semibold">Awaiting customer response</div>
                  </div>
                )}
                {dialCallStatus === "in-progress" && (
                  <div className="text-center space-y-4 w-full px-8">
                    <div className="text-xs text-emerald-400 font-extrabold animate-pulse tracking-wide uppercase">Call Connected</div>
                    
                    {/* Glowing Waveform Bars */}
                    <div className="flex items-end justify-center gap-1.5 h-10 w-full select-none">
                      <div className="audio-wave-bar w-1.5 bg-cyan-400 rounded-t h-full"></div>
                      <div className="audio-wave-bar w-1.5 bg-cyan-300 rounded-t h-full"></div>
                      <div className="audio-wave-bar w-1.5 bg-cyan-500 rounded-t h-full"></div>
                      <div className="audio-wave-bar w-1.5 bg-cyan-300 rounded-t h-full"></div>
                      <div className="audio-wave-bar w-1.5 bg-cyan-400 rounded-t h-full"></div>
                      <div className="audio-wave-bar w-1.5 bg-cyan-600 rounded-t h-full"></div>
                    </div>
                    
                    <div className="text-[10px] text-slate-400 font-medium">Assistant speaking to plumber lead...</div>
                  </div>
                )}
                {dialCallStatus === "completed" && (
                  <div className="text-center space-y-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-500 mx-auto border border-emerald-500/20">
                      <Check size={16} />
                    </div>
                    <div>
                      <div className="text-xs text-emerald-400 font-bold">Call Completed Successfully</div>
                      <div className="text-[9px] text-slate-500 font-mono">Telemetry synced back to GHL CRM</div>
                    </div>
                  </div>
                )}
                {dialCallStatus === "failed" && (
                  <div className="text-center space-y-1">
                    <div className="text-xs text-red-500 font-bold">Connection Failed</div>
                    <div className="text-[9px] text-slate-400 font-mono">Verify phone formatting or GHL logs</div>
                  </div>
                )}
                {dialCallStatus === "idle" && (
                  <div className="text-xs text-slate-500 font-semibold">Outbound system ready. Click redial to call.</div>
                )}
              </div>

              {/* Call Summary Log */}
              {dialCallSummary && (
                <div className="space-y-2">
                  <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">AI Live Call Summary</div>
                  <div className="bg-[#070b13] border border-slate-800/80 p-3.5 rounded-xl text-[11px] text-slate-300 font-medium leading-relaxed max-h-[150px] overflow-y-auto scrollbar-thin">
                    {dialCallSummary}
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setActiveDialLead(null);
                    setDialCallStatus("idle");
                    setDialCallSummary("");
                  }}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-800 transition-colors"
                >
                  Close Console
                </button>
                {dialCallStatus !== "ringing" && dialCallStatus !== "in-progress" && (
                  <button
                    onClick={() => triggerOutboundCall(activeDialLead)}
                    disabled={isDialing}
                    className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-950/40 text-white rounded-xl text-xs font-bold border border-cyan-500/20 transition-all shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <span>Redial Lead</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
