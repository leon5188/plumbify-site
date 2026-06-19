"use client";

import React, { useState, useEffect } from "react";
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
  Compass
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
  const [jobView, setJobView] = useState<"kanban" | "map">("map"); // Default to Map now

  // Live Map Selected States
  const [selectedTechRoute, setSelectedTechRoute] = useState<string>("all");
  const [selectedPin, setSelectedPin] = useState<JobCard | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optMessage, setOptMessage] = useState("Routes optimized based on current traffic.");

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
    { name: "Dave", role: "Master Plumber", status: "Active", assignedJob: "Burst Pipe Repair", billableHours: 38, monthlyRevenue: 18450, routeColor: "#3b82f6", routePath: "M 200,150 L 80,60 L 320,180" },
    { name: "Mike", role: "Sewer Line Specialist", status: "Active", assignedJob: "Water Heater Installation", billableHours: 35, monthlyRevenue: 15900, routeColor: "#10b981", routePath: "M 200,150 L 180,140 L 120,220" },
    { name: "John", role: "Service Technician", status: "Active", assignedJob: "Garbage Disposal Fix", billableHours: 32, monthlyRevenue: 11200, routeColor: "#f59e0b", routePath: "M 200,150 L 120,220 L 280,100" },
    { name: "Steve", role: "Apprentice", status: "Active", assignedJob: "Main Sewer Line Clog", billableHours: 28, monthlyRevenue: 8500, routeColor: "#8b5cf6", routePath: "M 200,150 L 320,180" },
    { name: "Tyler", role: "Service Technician", status: "On Break", billableHours: 24, monthlyRevenue: 12100, routeColor: "#ec4899", routePath: "M 200,150 L 220,80" },
    { name: "Alex", role: "Installation Lead", status: "Idle", billableHours: 30, monthlyRevenue: 14800, routeColor: "#64748b", routePath: "" }
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
    { name: "Gregory House", contactId: "crm-c-10293", lastService: "Sewer Hydro-Jetting", date: "2026-05-18", status: "Active Contract", tag: "emergency" },
    { name: "Lisa Cuddy", contactId: "crm-c-10294", lastService: "Kitchen Faucet Replacement", date: "2026-06-02", status: "No Contract", tag: "quote" },
    { name: "James Wilson", contactId: "crm-c-10295", lastService: "Tankless Heater Install", date: "2026-06-17", status: "Active Contract", tag: "maintenance" },
    { name: "Eric Foreman", contactId: "crm-c-10296", lastService: "Garbage Disposal Repair", date: "2026-06-10", status: "Active Contract", tag: "maintenance" },
    { name: "Allison Cameron", contactId: "crm-c-10297", lastService: "Slab Leak Repipe", date: "2026-05-30", status: "No Contract", tag: "emergency" }
  ]);

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
  const getSelectedRoutePath = () => {
    if (selectedTechRoute === "all") return "";
    const tech = techs.find(t => t.name === selectedTechRoute);
    return tech ? tech.routePath : "";
  };

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="h-20 border-b border-slate-800 flex items-center px-6">
            <span className="text-2xl font-black text-blue-500 tracking-tighter">PLUMBIFY</span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-semibold transition-all ${activeTab === "overview" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15" : "text-slate-400 hover:text-white hover:bg-slate-800/60"}`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 size={16} />
                <span>1. Overview (KPIs)</span>
              </div>
              <ChevronRight size={12} className="opacity-60" />
            </button>

            <button 
              onClick={() => setActiveTab("jobs")}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-semibold transition-all ${activeTab === "jobs" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15" : "text-slate-400 hover:text-white hover:bg-slate-800/60"}`}
            >
              <div className="flex items-center gap-3">
                <Map size={16} />
                <span>2. Job & Dispatch Tracker</span>
              </div>
              <ChevronRight size={12} className="opacity-60" />
            </button>

            <button 
              onClick={() => setActiveTab("techs")}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-semibold transition-all ${activeTab === "techs" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15" : "text-slate-400 hover:text-white hover:bg-slate-800/60"}`}
            >
              <div className="flex items-center gap-3">
                <UserCheck size={16} />
                <span>3. Technician Performance</span>
              </div>
              <ChevronRight size={12} className="opacity-60" />
            </button>

            <button 
              onClick={() => setActiveTab("finance")}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-semibold transition-all ${activeTab === "finance" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15" : "text-slate-400 hover:text-white hover:bg-slate-800/60"}`}
            >
              <div className="flex items-center gap-3">
                <DollarSign size={16} />
                <span>4. Finance & Inventory</span>
              </div>
              <ChevronRight size={12} className="opacity-60" />
            </button>

            <button 
              onClick={() => setActiveTab("crm")}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-semibold transition-all ${activeTab === "crm" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15" : "text-slate-400 hover:text-white hover:bg-slate-800/60"}`}
            >
              <div className="flex items-center gap-3">
                <Users size={16} />
                <span>5. Customer & CRM</span>
              </div>
              <ChevronRight size={12} className="opacity-60" />
            </button>
          </nav>
        </div>


      </aside>

      {/* MAIN LAYOUT */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Control Bar */}
        <header className="h-20 border-b border-slate-800 px-8 flex items-center justify-between shrink-0 bg-slate-900/40 backdrop-blur-md sticky top-0 z-40">
          <div>
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-3">
              <span>Plumbify Operations Command Center</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono font-normal">v2.0</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Automated dispatch, field tracking, and CRM ledger logs</p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition-colors flex items-center gap-2 text-xs font-semibold"
            >
              <RefreshCcw size={14} className={refreshing ? "animate-spin text-blue-500" : ""} />
              <span>{refreshing ? "Syncing..." : "Sync Database"}</span>
            </button>
          </div>
        </header>

        {/* CONTAINER */}
        <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">

          {/* ================================================================= */}
          {/* TAB 1: KPI OVERVIEW                                               */}
          {/* ================================================================= */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              
              {/* Row 1: KPI Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 1. Active Jobs */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition-colors flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Jobs</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Briefcase size={16} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-black text-white font-mono">24</div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-2">
                      <span className="text-blue-400 font-semibold">12 In Progress</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">8 Scheduled</span>
                      <span>•</span>
                      <span className="text-orange-400 font-semibold">4 Pending</span>
                    </div>
                  </div>
                </div>

                {/* 2. Total Revenue */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition-colors flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <DollarSign size={16} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-black text-white font-mono">${totalRevenue.toLocaleString()}</div>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold mt-2">
                      <TrendingUp size={12} />
                      <span>Total Monthly Sales</span>
                    </div>
                  </div>
                </div>

                {/* 3. Net Profit */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition-colors flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Profit</span>
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                      <Zap size={16} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-black text-white font-mono">${netProfit.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                      After labor (30%), materials (20%), and overhead (15%)
                    </div>
                  </div>
                </div>

                {/* 4. Customer Satisfaction */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition-colors flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer Satisfaction</span>
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                      <Star size={16} className="fill-yellow-500/20" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-black text-white font-mono flex items-baseline gap-1">
                      <span>{stats.averageRating}</span>
                      <span className="text-xs text-slate-400 font-normal">/5.0</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                      <CheckCircle size={10} className="text-yellow-500" />
                      <span>Based on {stats.reviewsCount} Google Reviews</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Graphic analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Monthly trend */}
                <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-sm font-bold text-white">Monthly Revenue & Lead Intake</h3>
                      <p className="text-[11px] text-slate-400">Live CRM database synchronization telemetry</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-blue-500"></span>
                        <span className="text-slate-300">Revenue (x$1,000)</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-64 w-full flex items-end justify-between px-2 pt-4 relative">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-4 border-b border-slate-800">
                      <div className="w-full border-t border-slate-800/40"></div>
                      <div className="w-full border-t border-slate-800/40"></div>
                      <div className="w-full border-t border-slate-800/40"></div>
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
                          <div className="bg-blue-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded mb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute transform -translate-y-16">
                            ${item.rev}k ({item.val} Leads)
                          </div>
                          <div 
                            style={{ height: `${pct}%` }}
                            className="w-10 bg-gradient-to-t from-blue-700/60 to-blue-500 hover:from-blue-600 hover:to-blue-400 rounded-t-md transition-all duration-500 shadow-lg"
                          ></div>
                          <span className="text-[9px] font-bold text-slate-500 mt-2 tracking-wider">{item.m}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Left column sidebar for overview */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Live Activity Stream</h3>
                    <p className="text-[11px] text-slate-400">Recent customer interactions routed via API</p>
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto mt-4">
                    {recentLeads.slice(0, 3).map((lead, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl flex items-start justify-between text-xs">
                        <div className="space-y-1">
                          <div className="font-bold text-white">{lead.name}</div>
                          <div className="text-[10px] text-slate-400">{lead.phone}</div>
                        </div>
                        <span className="text-[9px] bg-blue-900/30 text-blue-300 border border-blue-500/10 px-1.5 py-0.5 rounded font-mono">
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
          {/* TAB 2: JOBS & SCHEDULING (MAP ROUTE PLANNING UPGRADE)             */}
          {/* ================================================================= */}
          {activeTab === "jobs" && (
            <div className="space-y-8">
              
              {/* Header with Sub-tabs (Kanban vs Map) */}
              <div className="flex items-center justify-between bg-slate-900/40 border border-slate-800 rounded-xl p-3">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setJobView("kanban")}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${jobView === "kanban" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    Kanban Board
                  </button>
                  <button 
                    onClick={() => setJobView("map")}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${jobView === "map" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    Live GPS Map Tracking
                  </button>
                </div>
                
                <span className="text-[10px] text-slate-500 font-mono font-bold">Active Jobs Count: {jobs.length}</span>
              </div>

              {/* A. KANBAN VIEW */}
              {jobView === "kanban" && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-x-auto min-w-[1000px] pb-4">
                  
                  {/* Stages Columns definitions */}
                  {[
                    { key: "unassigned", title: "Unassigned", color: "border-slate-800 bg-slate-900/30" },
                    { key: "dispatched", title: "Dispatched", color: "border-blue-900/40 bg-blue-950/5" },
                    { key: "inprogress", title: "In Progress", color: "border-orange-900/40 bg-orange-950/5" },
                    { key: "onhold", title: "On Hold", color: "border-red-900/40 bg-red-950/5" },
                    { key: "invoiced", title: "Invoiced", color: "border-emerald-900/40 bg-emerald-950/5" },
                  ].map((column) => {
                    const colJobs = jobs.filter(job => job.status === column.key);
                    return (
                      <div key={column.key} className={`border rounded-2xl p-4 flex flex-col space-y-4 min-h-[500px] ${column.color}`}>
                        <div className="flex items-center justify-between shrink-0">
                          <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">{column.title}</h4>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">{colJobs.length}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                          {colJobs.map((job) => (
                            <div key={job.id} className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-3 shadow-lg hover:border-slate-700 transition-colors">
                              <div className="space-y-1">
                                <div className="flex items-start justify-between">
                                  <div className="font-bold text-white text-xs">{job.customerName}</div>
                                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                    job.priority === "High" ? "bg-red-500/10 text-red-500 border border-red-500/10" : 
                                    job.priority === "Medium" ? "bg-orange-500/10 text-orange-500 border border-orange-500/10" : 
                                    "bg-slate-800 text-slate-400"
                                  }`}>
                                    {job.priority}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-500 leading-normal">{job.address}</div>
                              </div>

                              <div className="pt-2.5 border-t border-slate-900 flex flex-col gap-1.5">
                                <div className="flex items-center justify-between text-[10px] text-slate-400">
                                  <span>Type: {job.jobType}</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="text-slate-500">Tech: {job.assignedTech || "Unassigned"}</span>
                                  <span className="font-mono text-emerald-500 font-semibold">${job.estCost}</span>
                                </div>
                              </div>

                              <button 
                                onClick={() => moveJobStage(job.id)}
                                className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[10px] rounded-lg border border-slate-800/60 font-semibold transition-colors flex items-center justify-center gap-1"
                              >
                                <span>Next Stage</span>
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

              {/* B. LIVE MAP VIEW WITH ROUTE OPTIMIZATION */}
              {jobView === "map" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Interactive Map Area (2 Cols) */}
                  <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 h-[550px] flex flex-col justify-between">
                    <div className="flex items-center justify-between shrink-0">
                      <div>
                        <h3 className="text-sm font-bold text-white mb-1">Live GPS Route Tracking</h3>
                        <p className="text-xs text-slate-400">Animated real-time dispatch routes and active vehicle indicators</p>
                      </div>

                      {/* Technician Route Filter */}
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Track Route:</label>
                        <select 
                          value={selectedTechRoute}
                          onChange={(e) => {
                            setSelectedTechRoute(e.target.value);
                            setSelectedPin(null);
                          }}
                          className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
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
                    <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl relative overflow-hidden my-4 flex items-center justify-center">
                      
                      {/* Grid representation */}
                      <svg className="w-full h-full opacity-10 absolute inset-0" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="grid-map" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid-map)" />
                      </svg>

                      {/* Live Map Graphics */}
                      <svg className="w-[85%] h-[85%] absolute z-10" viewBox="0 0 400 300">
                        {/* Office Base Station */}
                        <g transform="translate(200, 150)">
                          <rect x="-8" y="-8" width="16" height="16" rx="2" fill="#3b82f6" />
                          <text x="12" y="4" fill="#60a5fa" fontSize="8" fontWeight="bold" fontFamily="monospace">HQ</text>
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
                                strokeWidth={selectedTechRoute === tech.name ? "3" : "1.5"} 
                                strokeOpacity={selectedTechRoute === "all" ? "0.4" : "0.9"}
                                strokeDasharray={selectedTechRoute === "all" ? "4,4" : "0"}
                              />

                              {/* GPS vehicle animation tracker moving along path */}
                              <circle r="5" fill="#ffffff" stroke={tech.routeColor} strokeWidth="2">
                                <animateMotion 
                                  dur={selectedTechRoute === "all" ? "12s" : "7s"} 
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
                          const opacityClass = isTarget ? "opacity-100" : "opacity-20 pointer-events-none";

                          return (
                            <g 
                              key={job.id} 
                              transform={`translate(${job.x}, ${job.y})`}
                              className={`cursor-pointer transition-all duration-300 ${opacityClass}`}
                              onClick={() => setSelectedPin(job)}
                            >
                              <circle r="7" fill={job.priority === "High" ? "#ef4444" : job.priority === "Medium" ? "#f59e0b" : "#64748b"} />
                              <circle 
                                r="12" 
                                fill={job.priority === "High" ? "#ef4444" : job.priority === "Medium" ? "#f59e0b" : "#64748b"} 
                                fillOpacity="0.2" 
                                className={job.status === "inprogress" ? "animate-ping" : ""}
                              />
                              <text x="10" y="3" fill="#94a3b8" fontSize="7" fontWeight="bold">{job.customerName.split(" ")[0]}</text>
                            </g>
                          );
                        })}
                      </svg>

                      {/* In-Map Click Overlay Info */}
                      {selectedPin && (
                        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border border-slate-800 rounded-xl p-4 z-20 flex justify-between items-center shadow-2xl backdrop-blur-md">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{selectedPin.customerName}</span>
                              <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                selectedPin.priority === "High" ? "bg-red-500/10 text-red-500" : "bg-slate-800 text-slate-400"
                              }`}>{selectedPin.priority}</span>
                            </div>
                            <div className="text-[10px] text-slate-400">{selectedPin.address} | <span className="text-blue-400 font-semibold">{selectedPin.jobType}</span></div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right text-[10px]">
                              <span className="text-slate-500 block">Assigned Tech: {selectedPin.assignedTech || "None"}</span>
                              <span className="text-emerald-500 font-bold block">${selectedPin.estCost} est.</span>
                            </div>
                            <button 
                              onClick={() => setSelectedPin(null)}
                              className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-2 py-1 rounded"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>Service Area: Austin Metro Area (HQ Base: downtown)</span>
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span>High Priority</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500"></span>Medium Priority</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-500"></span>Low Priority</span>
                      </div>
                    </div>
                  </div>

                  {/* Route planning stats / Optimization (1 Col) */}
                  <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 h-[550px] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-white mb-2 font-bold text-base">
                        <Compass size={18} className="text-blue-500" />
                        <h3>Smart Routing Optimization</h3>
                      </div>
                      <p className="text-xs text-slate-400 mb-6">Real-time GPS parameters mapped to technicians for dispatch coordination.</p>

                      <div className="space-y-4 bg-slate-950 border border-slate-800/80 p-4 rounded-xl">
                        <div className="flex justify-between items-center border-b border-slate-900 pb-2 text-xs">
                          <span className="text-slate-500">Tracking Target:</span>
                          <span className="font-bold text-white">{selectedTechRoute === "all" ? "All Active Vehicles" : `${selectedTechRoute} Route`}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-900 pb-2 text-xs">
                          <span className="text-slate-500">Active Stops:</span>
                          <span className="font-mono text-white font-semibold">{routeDetails.stops} stops</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-900 pb-2 text-xs">
                          <span className="text-slate-500">Estimated Distance:</span>
                          <span className="font-mono text-white font-semibold">{routeDetails.distance}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-900 pb-2 text-xs">
                          <span className="text-slate-500">Estimated Drive Time:</span>
                          <span className="font-mono text-white font-semibold">{routeDetails.time}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Fuel Savings:</span>
                          <span className="font-mono text-emerald-500 font-semibold">+{routeDetails.fuelSaved}</span>
                        </div>
                      </div>

                      {/* Route re-optimization trigger */}
                      <div className="mt-6">
                        <button 
                          onClick={optimizeRoutes}
                          disabled={isOptimizing}
                          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
                        >
                          <Navigation size={14} className={isOptimizing ? "animate-spin" : ""} />
                          <span>{isOptimizing ? "Re-calculating..." : "Optimize Dispatch Routes"}</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-start gap-2.5 text-[10px] text-slate-500 shrink-0">
                      <ShieldCheck size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <div className="leading-normal">{optMessage}</div>
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
                <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col h-[500px]">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Technicians Dispatch Board</h3>
                    <p className="text-xs text-slate-400 mb-6">Real-time tracking of active technicians and assigned field operations</p>
                  </div>

                  <div className="flex-1 overflow-y-auto border border-slate-800 rounded-xl bg-slate-950">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-900/40">
                          <th className="p-4">Technician Name</th>
                          <th className="p-4">Role / Specialization</th>
                          <th className="p-4">Current Status</th>
                          <th className="p-4">Assigned Active Job</th>
                        </tr>
                      </thead>
                      <tbody>
                        {techs.map((tech, i) => (
                          <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-900/10 transition-colors">
                            <td className="p-4 font-bold text-white">{tech.name}</td>
                            <td className="p-4 text-slate-300">{tech.role}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                tech.status === "Active" ? "bg-emerald-500/10 text-emerald-500" :
                                tech.status === "Idle" ? "bg-slate-800 text-slate-400" :
                                "bg-amber-500/10 text-amber-500"
                              }`}>
                                <span className={`w-1 h-1 rounded-full ${
                                  tech.status === "Active" ? "bg-emerald-500" :
                                  tech.status === "Idle" ? "bg-slate-400" :
                                  "bg-amber-500"
                                }`}></span>
                                {tech.status}
                              </span>
                            </td>
                            <td className="p-4 text-slate-400 font-medium">{tech.assignedJob || "No Active Job"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Billable Hours & Revenue */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 h-[500px] flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Billing & Revenue Leaderboard</h3>
                    <p className="text-xs text-slate-400 mb-6">Comparison of total billable hours and personal monthly revenue contributions</p>
                  </div>

                  <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                    {techs.map((tech, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold">{tech.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">({tech.billableHours} hrs logged)</span>
                          </div>
                          <span className="font-mono text-emerald-500 font-bold">${tech.monthlyRevenue.toLocaleString()}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${Math.min((tech.monthlyRevenue / 20000) * 100, 100)}%` }}
                            className="h-full bg-blue-500 rounded-full"
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
                    <span>* Billable hours updated weekly</span>
                    <span>Top Performer: Dave</span>
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
                <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col h-[500px]">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Real-Time Materials Cost</h3>
                    <p className="text-xs text-slate-400 mb-6">Accounting ledger mapping plumbing parts, copper tubing, valves, and inventory usage</p>
                  </div>

                  <div className="flex-1 overflow-y-auto border border-slate-800 rounded-xl bg-slate-950">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-900/40">
                          <th className="p-4">Material / Inventory Name</th>
                          <th className="p-4">Unit Cost</th>
                          <th className="p-4">Qty Used</th>
                          <th className="p-4">Total Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {materials.map((mat, i) => (
                          <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-900/10 transition-colors">
                            <td className="p-4 font-bold text-white flex items-center gap-2">
                              <Package size={14} className="text-slate-400" />
                              <span>{mat.name}</span>
                            </td>
                            <td className="p-4 font-mono text-slate-300">${mat.cost.toFixed(2)}</td>
                            <td className="p-4 font-mono text-slate-300">{mat.qtyUsed}</td>
                            <td className="p-4 font-mono text-emerald-500 font-semibold">${mat.total.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 p-4 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs shrink-0">
                    <span className="font-semibold text-slate-400 uppercase tracking-wider">Total Material Cost:</span>
                    <span className="font-mono text-base font-black text-red-500">${totalMaterialCosts.toLocaleString()}</span>
                  </div>
                </div>

                {/* 2. Accounts Receivable (A/R) & Job Margin */}
                <div className="space-y-8">
                  
                  {/* A/R Panel */}
                  <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 h-[280px] flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">Accounts Receivable (A/R)</h3>
                      <p className="text-xs text-slate-400 mb-4">Pending and overdue customer invoice tracking for cash flow health</p>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                      {invoices.slice(0, 3).map((inv) => (
                        <div key={inv.id} className="bg-slate-950 border border-slate-800/60 p-3 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-white">{inv.customerName}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">{inv.id} (Due {inv.dueDate})</div>
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-white font-bold block">${inv.amount.toFixed(2)}</span>
                            <span className={`text-[9px] font-bold uppercase ${
                              inv.status === "Overdue" ? "text-red-500" :
                              inv.status === "Pending" ? "text-amber-500" :
                              "text-emerald-500"
                            }`}>{inv.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-bold shrink-0">
                      <span className="text-slate-400 uppercase tracking-wider">Total Outstanding A/R:</span>
                      <span className="font-mono text-emerald-500 text-sm">${totalAr.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Profit Margin analysis */}
                  <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 h-[190px] flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">Profitability by Job Type</h3>
                      <p className="text-xs text-slate-400 mb-3">Profit margin metrics grouped by plumbing work category</p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { type: "🚨 Emergency Repair & Service", margin: 68, color: "bg-red-500" },
                        { type: "🔧 Scheduled Maintenance Contracts", margin: 55, color: "bg-blue-500" },
                        { type: "📦 Large Appliance/Heater Install", margin: 42, color: "bg-purple-500" },
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1 text-xs">
                          <div className="flex justify-between font-semibold">
                            <span className="text-slate-300">{item.type}</span>
                            <span className="text-slate-400 font-mono">Net Margin: {item.margin}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div style={{ width: `${item.margin}%` }} className={`h-full ${item.color} rounded-full`}></div>
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
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 h-[500px] flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Lead Sources Analytics</h3>
                    <p className="text-xs text-slate-400 mb-6">Marketing acquisition channel distribution and lead metrics</p>
                  </div>

                  <div className="space-y-5 flex-1 overflow-y-auto pr-1">
                    {[
                      { name: "Google Search Ads", leads: 74, pct: 40, color: "bg-blue-500" },
                      { name: "Yelp Local Reviews", leads: 46, pct: 25, color: "bg-red-500" },
                      { name: "Customer Referrals", leads: 37, pct: 20, color: "bg-emerald-500" },
                      { name: "Jobsite Yard Signs", leads: 27, pct: 15, color: "bg-yellow-500" },
                    ].map((src, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-300">{src.name}</span>
                          <span className="font-mono text-slate-400 font-bold">{src.leads} Leads ({src.pct}%)</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${src.pct}%` }}
                            className={`h-full ${src.color} rounded-full`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
                    <span>Updated: Today</span>
                    <span>Top Channel: Google Ads</span>
                  </div>
                </div>

                {/* 2. Customer Directory */}
                <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col h-[500px]">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Customer Service Directory</h3>
                    <p className="text-xs text-slate-400 mb-6">Synchronized contact directory and active service agreements</p>
                  </div>

                  <div className="flex-1 overflow-y-auto border border-slate-800 rounded-xl bg-slate-950">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-900/40">
                          <th className="p-4">Customer Info</th>
                          <th className="p-4">CRM Contact ID</th>
                          <th className="p-4">Last Dispatched Service</th>
                          <th className="p-4">Agreement Status</th>
                          <th className="p-4">Renewal Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {crmHistory.map((cust, i) => (
                          <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-900/10 transition-colors">
                            <td className="p-4 font-bold text-white">{cust.name}</td>
                            <td className="p-4 font-mono text-slate-500">{cust.contactId}</td>
                            <td className="p-4 text-slate-300 font-medium">{cust.lastService}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                cust.status === "Active Contract" ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-800 text-slate-400"
                              }`}>
                                <span className={`w-1 h-1 rounded-full ${
                                  cust.status === "Active Contract" ? "bg-emerald-500" : "bg-slate-400"
                                }`}></span>
                                {cust.status}
                              </span>
                            </td>
                            <td className="p-4 font-mono text-slate-500">{cust.date}</td>
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

    </div>
  );
}
