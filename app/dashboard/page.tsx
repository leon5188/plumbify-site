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
  TrendingDown,
  Clock,
  Briefcase
} from "lucide-react";

// Mock data structures
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
}

interface Technician {
  name: string;
  role: string;
  status: "Active" | "Idle" | "On Break";
  assignedJob?: string;
  billableHours: number;
  monthlyRevenue: number;
}

interface Invoice {
  id: string;
  customerName: string;
  amount: number;
  status: "Overdue" | "Pending" | "Paid";
  dueDate: string;
}

export default function ExpandedDashboard() {
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
  const [jobView, setJobView] = useState<"kanban" | "map">("kanban");

  // 2. Jobs Kanban Interactive State
  const [jobs, setJobs] = useState<JobCard[]>([
    { id: "job-1", customerName: "Sarah Connor", address: "742 Evergreen Terr", jobType: "Burst Pipe Repair", priority: "High", status: "inprogress", assignedTech: "Dave", estCost: 950 },
    { id: "job-2", customerName: "John Connor", address: "1000 S Congress Ave", jobType: "Water Heater Installation", priority: "High", status: "dispatched", assignedTech: "Mike", estCost: 2200 },
    { id: "job-3", customerName: "Marcus Wright", address: "1206 West Ave", jobType: "Drain Hydro-Jetting", priority: "Medium", status: "unassigned", estCost: 650 },
    { id: "job-4", customerName: "Grace Harper", address: "508 12th St", jobType: "Garbage Disposal Fix", priority: "Low", status: "onhold", assignedTech: "John", estCost: 280 },
    { id: "job-5", customerName: "Kate Brewster", address: "2201 Lake Austin Blvd", jobType: "Slab Leak Location", priority: "High", status: "invoiced", assignedTech: "Tyler", estCost: 1800 },
    { id: "job-6", customerName: "Robert Brewster", address: "3500 Duval St", jobType: "Main Sewer Line Clog", priority: "Medium", status: "inprogress", assignedTech: "Steve", estCost: 1250 }
  ]);

  // 3. Technicians State
  const [techs] = useState<Technician[]>([
    { name: "Dave", role: "Master Plumber", status: "Active", assignedJob: "Burst Pipe Repair", billableHours: 38, monthlyRevenue: 18450 },
    { name: "Mike", role: "Sewer Line Specialist", status: "Active", assignedJob: "Water Heater Installation", billableHours: 35, monthlyRevenue: 15900 },
    { name: "John", role: "Service Technician", status: "Active", assignedJob: "Garbage Disposal Fix", billableHours: 32, monthlyRevenue: 11200 },
    { name: "Steve", role: "Apprentice", status: "Active", assignedJob: "Main Sewer Line Clog", billableHours: 28, monthlyRevenue: 8500 },
    { name: "Tyler", role: "Service Technician", status: "On Break", billableHours: 24, monthlyRevenue: 12100 },
    { name: "Alex", role: "Installation Lead", status: "Idle", billableHours: 30, monthlyRevenue: 14800 }
  ]);

  // 4. Finance State
  const [materials, setMaterials] = useState([
    { name: "Brass Ball Valves (3/4\")", cost: 18.50, qtyUsed: 14, total: 259 },
    { name: "Copper Piping (Type L - 10ft)", cost: 32.00, qtyUsed: 22, total: 704 },
    { name: "PEX Tubing (Blue/Red - 100ft)", cost: 45.00, qtyUsed: 8, total: 360 },
    { name: "PVC Schedule 40 (3\" - 10ft)", cost: 14.20, qtyUsed: 18, total: 255.6 },
    { name: "Tankless Water Heater Unit", cost: 1250.00, qtyUsed: 3, total: 3750 }
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: "INV-2026-001", customerName: "Gregory House", amount: 1250.00, status: "Overdue", dueDate: "2026-06-10" },
    { id: "INV-2026-002", customerName: "Lisa Cuddy", amount: 480.00, status: "Pending", dueDate: "2026-06-25" },
    { id: "INV-2026-003", customerName: "James Wilson", amount: 2200.00, status: "Paid", dueDate: "2026-06-18" },
    { id: "INV-2026-004", customerName: "Eric Foreman", amount: 350.00, status: "Pending", dueDate: "2026-06-30" },
    { id: "INV-2026-005", customerName: "Allison Cameron", amount: 1800.00, status: "Overdue", dueDate: "2026-06-05" }
  ]);

  // CRM: Customer Directory with past service logs
  const [crmHistory] = useState([
    { name: "Gregory House", contactId: "ghl-c-10293", lastService: "Sewer Hydro-Jetting", date: "2026-05-18", status: "Active Contract", tag: "emergency" },
    { name: "Lisa Cuddy", contactId: "ghl-c-10294", lastService: "Kitchen Faucet Replacement", date: "2026-06-02", status: "No Contract", tag: "quote" },
    { name: "James Wilson", contactId: "ghl-c-10295", lastService: "Tankless Heater Install", date: "2026-06-17", status: "Active Contract", tag: "maintenance" },
    { name: "Eric Foreman", contactId: "ghl-c-10296", lastService: "Garbage Disposal Repair", date: "2026-06-10", status: "Active Contract", tag: "maintenance" },
    { name: "Allison Cameron", contactId: "ghl-c-10297", lastService: "Slab Leak Repipe", date: "2026-05-30", status: "No Contract", tag: "emergency" }
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

  // Move a job card through Kanban columns
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

  // 4. Calculate dynamic A/R and profit numbers
  const totalAr = invoices.filter(inv => inv.status !== "Paid").reduce((acc, curr) => acc + curr.amount, 0);
  const totalMaterialCosts = materials.reduce((acc, curr) => acc + curr.total, 0);
  
  // Calculate dynamic stats from total revenue (savedRevenue is lead count * $820 avg)
  const totalRevenue = stats.savedRevenue || 150880;
  // Labor = 30%, Materials = 20%, Overhead = 15%, Net Margin = 35%
  const netProfit = Math.round(totalRevenue * 0.35);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      
      {/* SIDEBAR NAVIGATION (1, 2, 3, 4, 5) */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Header */}
          <div className="h-20 border-b border-slate-800 flex items-center px-6 gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <div>
              <div className="font-black tracking-wider text-base text-white">PLUMBIFY</div>
              <div className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Ops Command Center</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            
            {/* 1. Overview */}
            <button 
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-semibold transition-all ${activeTab === "overview" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15" : "text-slate-400 hover:text-white hover:bg-slate-800/60"}`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 size={16} />
                <span>1. 主要绩效指标 (KPIs)</span>
              </div>
              <ChevronRight size={12} className="opacity-60" />
            </button>

            {/* 2. Jobs Tracker */}
            <button 
              onClick={() => setActiveTab("jobs")}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-semibold transition-all ${activeTab === "jobs" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15" : "text-slate-400 hover:text-white hover:bg-slate-800/60"}`}
            >
              <div className="flex items-center gap-3">
                <Map size={16} />
                <span>2. 工作和调度跟踪</span>
              </div>
              <ChevronRight size={12} className="opacity-60" />
            </button>

            {/* 3. Techs Performance */}
            <button 
              onClick={() => setActiveTab("techs")}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-semibold transition-all ${activeTab === "techs" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15" : "text-slate-400 hover:text-white hover:bg-slate-800/60"}`}
            >
              <div className="flex items-center gap-3">
                <UserCheck size={16} />
                <span>3. 技术员表现分析</span>
              </div>
              <ChevronRight size={12} className="opacity-60" />
            </button>

            {/* 4. Finance Tracker */}
            <button 
              onClick={() => setActiveTab("finance")}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-semibold transition-all ${activeTab === "finance" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15" : "text-slate-400 hover:text-white hover:bg-slate-800/60"}`}
            >
              <div className="flex items-center gap-3">
                <DollarSign size={16} />
                <span>4. 财务和库存管理</span>
              </div>
              <ChevronRight size={12} className="opacity-60" />
            </button>

            {/* 5. CRM & Marketing */}
            <button 
              onClick={() => setActiveTab("crm")}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-semibold transition-all ${activeTab === "crm" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15" : "text-slate-400 hover:text-white hover:bg-slate-800/60"}`}
            >
              <div className="flex items-center gap-3">
                <Users size={16} />
                <span>5. 客户与营销 (CRM)</span>
              </div>
              <ChevronRight size={12} className="opacity-60" />
            </button>

          </nav>
        </div>

        {/* Integration Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database size={14} className="text-emerald-500" />
              <div className="text-[10px] font-bold text-slate-300">GHL Location</div>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9px] font-bold text-emerald-500 uppercase">Live</span>
            </div>
          </div>
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
            <p className="text-xs text-slate-400 mt-0.5">Automated dispatch, field tracking, and GHL ledger logs</p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition-colors flex items-center gap-2 text-xs font-semibold"
            >
              <RefreshCcw size={14} className={refreshing ? "animate-spin text-blue-500" : ""} />
              <span>{refreshing ? "Syncing..." : "Sync GHL"}</span>
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
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">活跃任务 (Active Jobs)</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Briefcase size={16} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-black text-white font-mono">24</div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-2">
                      <span className="text-blue-400 font-semibold">12 进行中</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">8 已调度</span>
                      <span>•</span>
                      <span className="text-orange-400 font-semibold">4 待处理</span>
                    </div>
                  </div>
                </div>

                {/* 2. Total Revenue */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition-colors flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">总收入 (Total Revenue)</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <DollarSign size={16} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-black text-white font-mono">${totalRevenue.toLocaleString()}</div>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold mt-2">
                      <TrendingUp size={12} />
                      <span>当月总销售额 (Current Month)</span>
                    </div>
                  </div>
                </div>

                {/* 3. Net Profit */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition-colors flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">净利润 (Net Profit)</span>
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                      <Zap size={16} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-black text-white font-mono">${netProfit.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                      已减人工(30%)、材料(20%)及管理(15%)
                    </div>
                  </div>
                </div>

                {/* 4. Customer Satisfaction */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition-colors flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">客户满意度 (CSAT)</span>
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
                      <span>基于 {stats.reviewsCount} 个 Google Reviews</span>
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
                      <h3 className="text-sm font-bold text-white">月度业务走势 (Monthly Revenue & Lead Intake)</h3>
                      <p className="text-[11px] text-slate-400">实时拉取的 GHL 预约转换与估算产值图表</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded bg-blue-500"></span>
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
                      { m: "一月 (Jan)", rev: 34, val: 42 },
                      { m: "二月 (Feb)", rev: 47, val: 58 },
                      { m: "三月 (Mar)", rev: 68, val: 84 },
                      { m: "四月 (Apr)", rev: 90, val: 110 },
                      { m: "五月 (May)", rev: 116, val: 142 },
                      { m: "六月 (Jun)", rev: Math.round(totalRevenue/1000), val: stats.capturedLeads || 184 },
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
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">今日实时动态 (Today's Feed)</h3>
                    <p className="text-[11px] text-slate-400">来自 GHL 的近期活动记录</p>
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto">
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
          {/* TAB 2: JOBS & SCHEDULING                                          */}
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
                    看板视图 (Kanban Board)
                  </button>
                  <button 
                    onClick={() => setJobView("map")}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${jobView === "map" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    地图路径映射 (Map Route View)
                  </button>
                </div>
                
                <span className="text-[10px] text-slate-500 font-mono">活跃总任务数 (Total Active): {jobs.length}</span>
              </div>

              {/* A. KANBAN VIEW */}
              {jobView === "kanban" && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-x-auto min-w-[1000px] pb-4">
                  
                  {/* Stages Columns definitions */}
                  {[
                    { key: "unassigned", title: "未分配 (Unassigned)", color: "border-slate-800 bg-slate-900/30" },
                    { key: "dispatched", title: "已派遣 (Dispatched)", color: "border-blue-900/40 bg-blue-950/5" },
                    { key: "inprogress", title: "进行中 (In Progress)", color: "border-orange-900/40 bg-orange-950/5" },
                    { key: "onhold", title: "暂停 (On Hold)", color: "border-red-900/40 bg-red-950/5" },
                    { key: "invoiced", title: "已开发票 (Invoiced)", color: "border-emerald-900/40 bg-emerald-950/5" },
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
                                  <span>类型: {job.jobType}</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="text-slate-500">工匠: {job.assignedTech || "未指定"}</span>
                                  <span className="font-mono text-emerald-500 font-semibold">${job.estCost}</span>
                                </div>
                              </div>

                              {/* Action to move stages */}
                              <button 
                                onClick={() => moveJobStage(job.id)}
                                className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[10px] rounded-lg border border-slate-800/60 font-semibold transition-colors flex items-center justify-center gap-1"
                              >
                                <span>下个阶段</span>
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

              {/* B. MAP VIEW */}
              {jobView === "map" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* SVG Route Map */}
                  <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 h-[500px] flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">今日派单路线映射 (Service Map Routing)</h3>
                      <p className="text-xs text-slate-400">地理映射与路线图，实时展示今日的水管维修地址分布</p>
                    </div>

                    {/* SVG Map Canvas */}
                    <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl relative overflow-hidden my-4 flex items-center justify-center">
                      
                      {/* Grid representation */}
                      <svg className="w-full h-full opacity-10 absolute inset-0" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                      </svg>

                      {/* Map lines */}
                      <svg className="w-[80%] h-[80%] absolute z-10" viewBox="0 0 400 300">
                        {/* Connected Route Paths */}
                        <path d="M 80,60 L 180,140 L 280,100 M 180,140 L 120,220 L 320,180" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="4,4" className="animate-[dash_5s_linear_infinite]" />
                        
                        {/* Location Pins */}
                        {/* 1. Sarah Connor */}
                        <g transform="translate(80, 60)">
                          <circle r="6" fill="#f97316" />
                          <circle r="12" fill="#f97316" fillOpacity="0.2" className="animate-ping" />
                          <text x="12" y="4" fill="white" fontSize="8" fontWeight="bold">Sarah (Burst Pipe)</text>
                        </g>

                        {/* 2. John Connor */}
                        <g transform="translate(180, 140)">
                          <circle r="6" fill="#ef4444" />
                          <text x="12" y="4" fill="white" fontSize="8" fontWeight="bold">John (Water Heater)</text>
                        </g>

                        {/* 3. Marcus Wright */}
                        <g transform="translate(280, 100)">
                          <circle r="6" fill="#64748b" />
                          <text x="-12" y="-8" fill="white" fontSize="8" textAnchor="end" fontWeight="bold">Marcus (Hydro-Jet)</text>
                        </g>

                        {/* 4. Grace Harper */}
                        <g transform="translate(120, 220)">
                          <circle r="6" fill="#ef4444" />
                          <text x="-12" y="8" fill="white" fontSize="8" textAnchor="end" fontWeight="bold">Grace (Disposal)</text>
                        </g>

                        {/* 5. Robert Brewster */}
                        <g transform="translate(320, 180)">
                          <circle r="6" fill="#10b981" />
                          <text x="12" y="4" fill="white" fontSize="8" fontWeight="bold">Robert (Sewer Clog)</text>
                        </g>
                      </svg>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>地图区域：Austin, TX 辖区</span>
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>紧急高优先级</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span>进行中</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-500"></span>未分配</span>
                      </div>
                    </div>
                  </div>

                  {/* Job Detail List Panel */}
                  <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 h-[500px] flex flex-col">
                    <h3 className="text-sm font-bold text-white mb-4">今日服务清单 (Work Details)</h3>
                    <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                      {jobs.map((job) => (
                        <div key={job.id} className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{job.customerName}</span>
                            <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${
                              job.priority === "High" ? "bg-red-500/10 text-red-500" : "bg-slate-800 text-slate-400"
                            }`}>{job.priority} Priority</span>
                          </div>
                          <div className="text-[10px] text-slate-400 leading-normal">{job.address}</div>
                          <div className="text-[10px] flex justify-between text-slate-500 pt-1 border-t border-slate-900">
                            <span>任务: {job.jobType}</span>
                            <span className="font-mono text-emerald-500">${job.estCost}</span>
                          </div>
                        </div>
                      ))}
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
                    <h3 className="text-sm font-bold text-white mb-1">技师今日日程与状态 (Technicians Dispatch Board)</h3>
                    <p className="text-xs text-slate-400 mb-6">跟踪在岗技术工人的实时状态与分配工作</p>
                  </div>

                  <div className="flex-1 overflow-y-auto border border-slate-800 rounded-xl bg-slate-950">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-900/40">
                          <th className="p-4">技师姓名</th>
                          <th className="p-4">技术资质 (Role)</th>
                          <th className="p-4">当前状态</th>
                          <th className="p-4">分配工作</th>
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
                            <td className="p-4 text-slate-400 font-medium">{tech.assignedJob || "空闲 (No Job)"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Billable Hours & Revenue */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 h-[500px] flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">记账工时与效率排行 (Billing & Revenue Leaderboard)</h3>
                    <p className="text-xs text-slate-400 mb-6">分析每位技术工人的计费工时与本月个人营业创收贡献</p>
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
                        {/* Progress Bar representation */}
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
                    <span>* 记账工时数据每周自动汇总</span>
                    <span>最高效率计费：Dave</span>
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
                    <h3 className="text-sm font-bold text-white mb-1">今日消耗材料核算 (Real-Time Materials Cost)</h3>
                    <p className="text-xs text-slate-400 mb-6">实时消耗材料库存（管道、阀门、配件）及对应单价成本追踪</p>
                  </div>

                  <div className="flex-1 overflow-y-auto border border-slate-800 rounded-xl bg-slate-950">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-900/40">
                          <th className="p-4">零件/耗材名称</th>
                          <th className="p-4">单位成本 (Unit Cost)</th>
                          <th className="p-4">消耗数量 (Qty Used)</th>
                          <th className="p-4">总成本 (Total Cost)</th>
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

                  {/* Summary footer */}
                  <div className="mt-4 p-4 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs shrink-0">
                    <span className="font-semibold text-slate-400 uppercase tracking-wider">材料总成本累计 (Total Material Overhead):</span>
                    <span className="font-mono text-base font-black text-red-500">${totalMaterialCosts.toLocaleString()}</span>
                  </div>
                </div>

                {/* 2. Accounts Receivable (A/R) & Job Margin */}
                <div className="space-y-8">
                  
                  {/* A/R Panel */}
                  <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 h-[280px] flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">应收款追踪 (Accounts Receivable - A/R)</h3>
                      <p className="text-xs text-slate-400 mb-4">逾期或待付的发票账单汇总，用于现金流追踪</p>
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
                      <span className="text-slate-400 uppercase tracking-wider">A/R 待付总额 (Total Outstanding):</span>
                      <span className="font-mono text-emerald-500 text-sm">${totalAr.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Profit Margin analysis */}
                  <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 h-[190px] flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">工单类型利润率排行 (Profitability by Job Type)</h3>
                      <p className="text-xs text-slate-400 mb-3">按业务形态划分的销售与净利润率分析</p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { type: "🚨 紧急疏通与维修 (Emergency Repair)", margin: 68, color: "bg-red-500" },
                        { type: "🔧 定期维护协议 (Scheduled Maintenance)", margin: 55, color: "bg-blue-500" },
                        { type: "📦 大型设备安装 (Equipment Install)", margin: 42, color: "bg-purple-500" },
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1 text-xs">
                          <div className="flex justify-between font-semibold">
                            <span className="text-slate-300">{item.type}</span>
                            <span className="text-slate-400 font-mono">净利 {item.margin}%</span>
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
                    <h3 className="text-sm font-bold text-white mb-1">潜在客户渠道分析 (Lead Sources Analytics)</h3>
                    <p className="text-xs text-slate-400 mb-6">跟踪营销广告的转化漏斗，分析客户来源占比</p>
                  </div>

                  {/* Horizontal Bar Chart for marketing leads sources */}
                  <div className="space-y-5 flex-1 overflow-y-auto pr-1">
                    {[
                      { name: "Google Ads (谷歌竞价广告)", leads: 74, pct: 40, color: "bg-blue-500" },
                      { name: "Yelp Reviews (商家推荐平台)", leads: 46, pct: 25, color: "bg-red-500" },
                      { name: "Referrals (老客户推荐转介)", leads: 37, pct: 20, color: "bg-emerald-500" },
                      { name: "Yard Signs (户外庭院广告牌)", leads: 27, pct: 15, color: "bg-yellow-500" },
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
                    <span>分析区间：今日更新</span>
                    <span>最高效率渠道：Google Ads</span>
                  </div>
                </div>

                {/* 2. Customer Directory */}
                <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col h-[500px]">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">CRM 客户名册与历史 (Customer Service Directory)</h3>
                    <p className="text-xs text-slate-400 mb-6">与 GoHighLevel 同步的活跃客户联系历史与服务协议状态</p>
                  </div>

                  <div className="flex-1 overflow-y-auto border border-slate-800 rounded-xl bg-slate-950">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-900/40">
                          <th className="p-4">客户信息</th>
                          <th className="p-4">GHL 标识符</th>
                          <th className="p-4">上次服务项目</th>
                          <th className="p-4">服务协议状态</th>
                          <th className="p-4">更新时间</th>
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
