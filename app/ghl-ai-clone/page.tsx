"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Users, 
  Smartphone, 
  DollarSign, 
  Check, 
  ShieldCheck,
  ChevronDown,
  Lock,
  PhoneCall,
  Coins
} from "lucide-react";

export default function GHLAIClone() {
  // Lead Intake Form State (Connected to GHL webhook)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    trucks: "3",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Plumber Recruiting Screening Simulator State
  const [screenStage, setScreenStage] = useState<"idle" | "calling" | "screening" | "scored">("idle");
  const [activeCandidate, setActiveCandidate] = useState<any>(null);
  
  // Tap-to-Pay Simulator State
  const [paymentStage, setPaymentStage] = useState<"idle" | "tapping" | "reconciling" | "done">("idle");
  const [ledgerLogs, setLedgerLogs] = useState<any[]>([
    { id: "TXN-8291", date: "5 mins ago", amount: "$1,250.00", customer: "Gregory House", status: "QuickBooks Synced" },
    { id: "TXN-4012", date: "12 mins ago", amount: "$350.00", customer: "Eric Foreman", status: "QuickBooks Synced" }
  ]);

  // ROI Calculator
  const [truckCount, setTruckCount] = useState<number>(3);

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://services.leadconnectorhq.com/hooks/RHROdkS0TNPBFZHcZsX0/webhook-trigger/bLjJ5zulAgeQluUDL9fM",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            email: formData.email,
            source: "ghl_ai_clone_landing_optimized",
            message: `Plumbify GHL AI Clone Sign up. Trucks: ${formData.trucks}`
          })
        }
      );

      if (response.ok) {
        setSuccess(true);
        setFormData({ firstName: "", lastName: "", phone: "", email: "", trucks: "3" });
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      setError("We encountered an issue submitting your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startScreeningSimulation = async () => {
    setScreenStage("calling");
    setActiveCandidate({ name: "Michael Vance", phone: "+1 (512) 555-0144", license: "Licensed Master Plumber" });
    await new Promise(r => setTimeout(r, 1500));
    setScreenStage("screening");
    await new Promise(r => setTimeout(r, 3000));
    setScreenStage("scored");
  };

  const startPaymentSimulation = async () => {
    setPaymentStage("tapping");
    await new Promise(r => setTimeout(r, 1800));
    setPaymentStage("reconciling");
    await new Promise(r => setTimeout(r, 1500));
    setPaymentStage("done");
    setLedgerLogs(prev => [
      { id: `TXN-${Math.floor(1000 + Math.random()*9000)}`, date: "Just now", amount: "$950.00", customer: "John Connor", status: "QuickBooks Synced" },
      ...prev
    ]);
  };

  // ROI math
  const yearlyBookkeeperCost = truckCount * 3800; 
  const yearlyRecruitingAgencyCost = truckCount * 4500; 
  const totalTraditionalCost = yearlyBookkeeperCost + yearlyRecruitingAgencyCost;
  const plumbifySubscriptionCost = 149 * 12; 
  const netSavings = totalTraditionalCost - plumbifySubscriptionCost;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#081a3d] via-[#10326e] to-[#0a52a3] text-slate-100 flex flex-col font-sans relative antialiased selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      
      {/* BACKGROUND RADIAL GLOWS */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-br from-cyan-400/20 to-blue-500/0 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-[35%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/5 to-transparent rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* STYLE CONFIG */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes soundwave {
          0%, 100% { transform: scaleY(0.25); }
          50% { transform: scaleY(1); }
        }
        .flow-bar {
          animation: soundwave 0.8s ease-in-out infinite;
          transform-origin: bottom;
        }
        .flow-bar:nth-child(2) { animation-delay: 0.1s; }
        .flow-bar:nth-child(3) { animation-delay: 0.2s; }
        .flow-bar:nth-child(4) { animation-delay: 0.3s; }
        .flow-bar:nth-child(5) { animation-delay: 0.4s; }
        
        .neon-glow-container {
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.15);
          border-color: rgba(6, 182, 212, 0.25) !important;
        }
        .neon-glow-container:hover {
          box-shadow: 0 0 30px rgba(6, 182, 212, 0.35);
          border-color: rgba(6, 182, 212, 0.6) !important;
        }
        .neon-txt {
          text-shadow: 0 0 10px rgba(6, 182, 212, 0.6);
        }
        .neon-txt-emerald {
          text-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
        }
      `}} />

      {/* NAVBAR */}
      <header className="max-w-7xl mx-auto w-full px-6 h-22 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-white text-base">PLUMBIFY</span>
            <span className="block text-[9px] text-cyan-400 font-mono tracking-widest uppercase">Autonomous Hub</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-xs font-bold text-slate-300 hover:text-white transition-colors">
            Operations Dashboard
          </Link>
          <a 
            href="#lead-form-section"
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg border border-cyan-400/20"
          >
            Join Challenge
          </a>
        </div>
      </header>

      {/* HERO SECTION: FIRST IMPRESSION OPTIMIZATION */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-24 grid lg:grid-cols-12 gap-12 items-center z-10 relative">
        <div className="lg:col-span-7 space-y-6">
          
          {/* Target Audience Clarification */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20 uppercase tracking-widest">
            <Sparkles size={12} className="animate-pulse" />
            <span>Built Specifically For Plumbing & Sewer Fleets (3+ Trucks)</span>
          </div>

          {/* Core Value Proposition Header (Step 5) */}
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.08]">
            Stop Wasting Hours on Admin. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500">
              Automate Your Plumber Hiring & On-Site Bookkeeping.
            </span>
          </h1>

          {/* Problem & Benefit Copy (Step 2/9) */}
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
            Plumbify puts technician vetting and dispatching on autopilot using AI screening voice calls, while instantly reconciliating job invoicing with smartphone **Tap-to-Pay**. Cut back office overhead, save headhunter fees, and reconcile directly to QuickBooks in seconds.
          </p>

          {/* Social Proof Stats Banner (Step 8) */}
          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-700/40">
            <div>
              <span className="text-2xl font-black text-white font-mono block neon-txt">$1.2M+</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Overhead Saved</span>
            </div>
            <div>
              <span className="text-2xl font-black text-white font-mono block neon-txt">92%</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Bookkeeping Reclaimed</span>
            </div>
            <div>
              <span className="text-2xl font-black text-white font-mono block neon-txt">&lt; 10s</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Hiring Interview Triage</span>
            </div>
          </div>
        </div>

        {/* Actionable Form (Step 10 - Click-Fear Removal) */}
        <div id="lead-form-section" className="lg:col-span-5">
          <div className="p-8 rounded-3xl bg-[#0e172e]/70 border border-slate-700/60 backdrop-blur-xl shadow-2xl relative overflow-hidden neon-glow-container transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-1.5">Apply for the 14-Day Free Challenge</h3>
            <p className="text-slate-400 text-xs mb-5">We map your QuickBooks ledger and connect automated hiring screens in 24 hours.</p>

            {success ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                  <Check size={24} />
                </div>
                <h4 className="text-base font-bold text-white">Application Received!</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Our field implementation engineers will contact you shortly to configure your automated screening nodes and ledger pipelines.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">First Name</label>
                    <input 
                      type="text" 
                      name="firstName" 
                      required 
                      value={formData.firstName} 
                      onChange={handleInputChange} 
                      placeholder="John" 
                      className="w-full bg-[#070b13]/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName" 
                      required 
                      value={formData.lastName} 
                      onChange={handleInputChange} 
                      placeholder="Doe" 
                      className="w-full bg-[#070b13]/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Mobile Phone</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    required 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="+1 (512) 555-0100" 
                    className="w-full bg-[#070b13]/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="name@company.com" 
                    className="w-full bg-[#070b13]/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Fleet Count</label>
                  <select 
                    name="trucks" 
                    value={formData.trucks} 
                    onChange={handleInputChange}
                    className="w-full bg-[#070b13]/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50 font-bold"
                  >
                    <option value="1-2">1 - 2 Trucks</option>
                    <option value="3">3 Trucks</option>
                    <option value="4-8">4 - 8 Trucks</option>
                    <option value="9+">9+ Trucks</option>
                  </select>
                </div>

                {error && <div className="text-[10px] text-red-400 font-semibold">{error}</div>}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg border border-cyan-400/20 flex items-center justify-center gap-2"
                >
                  {loading ? "Activating Pipeline..." : "Claim 14-Day Free Challenge"}
                </button>
              </form>
            )}

            {/* Click Fear Removal Indicators */}
            <div className="mt-4 flex items-center justify-center gap-4 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1"><Lock size={10} className="text-cyan-400" /> No Card Required</span>
              <span>•</span>
              <span className="flex items-center gap-1"><ShieldCheck size={10} className="text-emerald-400" /> Free Setup Integration</span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE BENEFIT 1: AI SMART PLUMBER RECRUITER */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/60 grid lg:grid-cols-12 gap-12 items-center z-10 relative">
        <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
          
          {/* Vetting Simulator Interface */}
          <div className="bg-[#0b1428]/85 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
                <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">AI Recruiter Hub</span>
              </div>
              <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded font-mono">STANDBY</span>
            </div>

            {screenStage === "idle" && (
              <div className="text-center py-10 space-y-4">
                <p className="text-xs text-slate-400 font-medium">Ready to simulate an automated technical candidate screening call.</p>
                <button 
                  onClick={startScreeningSimulation}
                  className="px-4 py-2.5 bg-cyan-600/10 hover:bg-cyan-650 text-cyan-400 hover:text-white border border-cyan-500/25 hover:border-cyan-500 rounded-xl text-[10px] font-bold transition-all shadow-sm"
                >
                  Simulate Plumber Application
                </button>
              </div>
            )}

            {screenStage === "calling" && (
              <div className="text-center py-10 space-y-3">
                <PhoneCall size={24} className="text-cyan-400 animate-bounce mx-auto" />
                <div className="text-xs text-cyan-400 font-bold">Calling Candidate...</div>
                <div className="text-[10px] text-slate-500 font-mono">Vetting credentials for {activeCandidate?.name}</div>
              </div>
            )}

            {screenStage === "screening" && (
              <div className="space-y-4">
                <div className="bg-[#070b13] p-3 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{activeCandidate?.name}</span>
                    <span className="text-[9px] text-slate-500">{activeCandidate?.license}</span>
                  </div>
                  <span className="text-[8px] text-cyan-400 font-extrabold uppercase tracking-widest border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 rounded">Speaking</span>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">Live Speech Audio wave</span>
                  <div className="flex items-end justify-center gap-1.5 h-10 w-full bg-[#070b13]/60 p-2 rounded-xl border border-slate-900">
                    <div className="flow-bar w-1 bg-cyan-500 rounded-t h-full"></div>
                    <div className="flow-bar w-1 bg-cyan-400 rounded-t h-full"></div>
                    <div className="flow-bar w-1 bg-cyan-300 rounded-t h-full"></div>
                    <div className="flow-bar w-1 bg-cyan-400 rounded-t h-full"></div>
                    <div className="flow-bar w-1 bg-cyan-600 rounded-t h-full"></div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 text-center font-medium leading-relaxed italic">"Can you explain standard code requirements for a tankless water heater venting configuration?"</p>
              </div>
            )}

            {screenStage === "scored" && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-[#070b13] p-4 rounded-xl border border-slate-850 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-white text-xs block">{activeCandidate?.name}</span>
                      <span className="text-[9px] text-slate-500">{activeCandidate?.license}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-emerald-400 font-bold block neon-txt-emerald">4.8 / 5.0</span>
                      <span className="text-[8px] text-slate-500 uppercase tracking-widest font-extrabold">Interview Rank</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-900 pt-2.5 font-medium">
                    <span className="text-cyan-400 font-bold block">Evaluation Summary:</span> Excellent technical response details. Confirmed knowledge of Type B vents and PVC clearances. License status: Valid. Background screening check: Cleared.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setScreenStage("idle")}
                    className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 text-[10px] rounded-lg border border-slate-850 font-bold transition-all"
                  >
                    Reset Demo
                  </button>
                  <a 
                    href="#lead-form-section"
                    className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] rounded-lg font-bold transition-all text-center flex items-center justify-center"
                  >
                    Get Vetting Setup
                  </a>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20 uppercase tracking-wider">
            <Users size={12} />
            <span>AI Plumber Recruiter</span>
          </div>

          {/* Emphasizing Benefit (Step 2) */}
          <h3 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
            Save $15,000+ in Headhunter Fees. <br />
            Hire High-Tier Plumbers While You Sleep.
          </h3>

          <p className="text-slate-300 text-sm leading-relaxed">
            Finding licensed plumbing technicians is a major business leak. Plumbify monitors incoming job application channels, automatically place screening phone calls within 10 seconds of submission, interviews them on technical competence, runs automatic state licensing checks, and sets appointments with candidates who score 4.5+.
          </p>

          <ul className="space-y-3.5 text-xs text-slate-400 font-medium">
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">✓</span>
              <span className="leading-normal"><strong className="text-white">Auto-Vetting Pipeline</strong>: Let AI handle the time-wasting call tag, license lookup, and credential validation.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">✓</span>
              <span className="leading-normal"><strong className="text-white">Verify First, Interview Second</strong>: Protect your schedules. Only speak with qualified plumbers who have verified experience.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CORE BENEFIT 2: TAP-TO-PAY AUTOMATIC BOOKKEEPING */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/60 grid lg:grid-cols-12 gap-12 items-center z-10 relative">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 uppercase tracking-wider">
            <Smartphone size={12} />
            <span>Tap-to-Pay Ledger</span>
          </div>

          {/* Emphasizing Benefit (Step 2) */}
          <h3 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
            Reclaim 92% of Admin Billing Hours. <br />
            Tap Phone to Pay & Reconcile Invoices.
          </h3>

          <p className="text-slate-300 text-sm leading-relaxed">
            Eliminate billing errors, missing parts tracking, and bookkeeper followups. When your technicians complete a task, they hold the customer's card to the back of their smartphone. Plumbify captures the payment, marks the invoice paid, and instantly reconciles the material costs and deposits in QuickBooks.
          </p>

          <ul className="space-y-3.5 text-xs text-slate-400 font-medium">
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center shrink-0 mt-0.5">✓</span>
              <span className="leading-normal"><strong className="text-white">Zero Extra POS Terminals</strong>: Turn any technician's smartphone into a card reader. No hardware to lease.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center shrink-0 mt-0.5">✓</span>
              <span className="leading-normal"><strong className="text-white">Instant Ledger Reconciliation</strong>: Deposits and material expenses sync directly to QuickBooks in under 1 second.</span>
            </li>
          </ul>
        </div>

        {/* Tap-to-Pay Simulator */}
        <div className="lg:col-span-5">
          <div className="bg-[#0b1428]/85 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">TAP-TO-PAY NODE</span>
              </div>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">STANDBY</span>
            </div>

            {paymentStage === "idle" && (
              <div className="text-center py-10 space-y-4">
                <p className="text-xs text-slate-400 font-medium">Simulate a field plumber card payment invoice processing flow.</p>
                <button 
                  onClick={startPaymentSimulation}
                  className="px-4 py-2.5 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-emerald-500 rounded-xl text-[10px] font-bold transition-all shadow-sm"
                >
                  Start Payment Simulation
                </button>
              </div>
            )}

            {paymentStage === "tapping" && (
              <div className="text-center py-10 space-y-3">
                <Smartphone size={24} className="text-emerald-400 animate-pulse mx-auto" />
                <div className="text-xs text-emerald-400 font-bold">Waiting for Contactless Card...</div>
                <div className="text-[10px] text-slate-500 font-mono">Amount due: $950.00</div>
              </div>
            )}

            {paymentStage === "reconciling" && (
              <div className="text-center py-10 space-y-3">
                <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div className="text-xs text-cyan-400 font-bold">Synchronizing Ledger Accounts...</div>
                <div className="text-[10px] text-slate-500 font-mono">Reconciling QuickBooks Ledger balances</div>
              </div>
            )}

            {paymentStage === "done" && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-[#070b13] p-4 rounded-xl border border-slate-850 space-y-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/35 flex items-center justify-center text-emerald-400 mx-auto">
                    <Check size={20} />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold">Reconciliation Complete</span>
                    <span className="text-2xl font-black text-white block mt-1 neon-txt-emerald">$950.00 PAID</span>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-normal border-t border-slate-900 pt-2 font-medium">
                    Invoice tagged as PAID in GHL & QuickBooks. Materials deduct ledger logs reconciled successfully.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">Digital Ledger Sync Logs</span>
                  <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
                    {ledgerLogs.map((log, idx) => (
                      <div key={idx} className="bg-[#070b13] border border-slate-900 p-2.5 rounded-lg flex items-center justify-between text-[10px]">
                        <div>
                          <span className="font-bold text-white block">{log.id} ({log.customer})</span>
                          <span className="text-[8px] text-slate-500">{log.date}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-emerald-400 block">{log.amount}</span>
                          <span className="text-[8px] text-slate-500 font-semibold">{log.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setPaymentStage("idle")}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 text-[10px] rounded-lg border border-slate-850 font-bold transition-all"
                >
                  Reset Simulator
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR SECTION: SHOW SAVINGS INSTEAD OF JUST SPECS (Step 2) */}
      <section id="calculator-section" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/60 z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20 uppercase tracking-wider">
            <Coins size={12} />
            <span>Operational ROI Analysis</span>
          </div>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">Calculate Your Savings</h3>
          <p className="text-slate-400 text-xs sm:text-sm">See how much Plumbify adds back to your yearly profit margin compared to hiring traditional office dispatch admins.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls */}
          <div className="lg:col-span-6 bg-[#0b1428]/85 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">How many service trucks do you run?</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono font-bold text-lg text-white">
                  <span>Fleet Size:</span>
                  <span className="text-cyan-400 text-xl font-black neon-txt">{truckCount} Active Trucks</span>
                </div>
                
                <input 
                  type="range" 
                  min="1" 
                  max="15" 
                  value={truckCount} 
                  onChange={(e) => setTruckCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                />
              </div>

              <div className="space-y-3.5 text-xs text-slate-400 pt-2 leading-relaxed font-semibold">
                <p>📊 **Office Bookkeeper Salary**: Admin billing, parts logging, and tracking averages $3,800/year per truck in overhead.</p>
                <p>👨‍🔧 **Hiring Headhunter Costs**: Plumber recruiting agencies cost averages $4,500/year per truck in placement fees.</p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/40 text-[10px] text-slate-500 flex justify-between font-bold uppercase tracking-wider">
              <span>* Estimates based on industry averages</span>
              <span>Replaces headhunters</span>
            </div>
          </div>

          {/* Results Summary */}
          <div className="lg:col-span-6 bg-[#102452]/40 border border-cyan-500/25 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="space-y-6">
              <h4 className="text-base font-bold text-white">Annual Admin Overhead Comparison</h4>
              
              <div className="space-y-1">
                <span className="text-slate-400 text-xs block font-semibold uppercase tracking-wider">Traditional Overhead Cost:</span>
                <span className="text-xl font-bold text-white font-mono line-through opacity-50">${totalTraditionalCost.toLocaleString()}/yr</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-xs block font-semibold uppercase tracking-wider">Plumbify Software Cost:</span>
                <span className="text-xl font-bold text-cyan-400 font-mono">${plumbifySubscriptionCost.toLocaleString()}/yr</span>
              </div>

              <div className="pt-4 border-t border-cyan-500/10 space-y-1.5">
                <span className="text-cyan-400 text-xs block font-bold uppercase tracking-wider">Reclaimed Fleet Cash Flow:</span>
                <span className="text-5xl font-extrabold text-emerald-400 font-mono tracking-tight neon-txt-emerald">${netSavings.toLocaleString()}/yr</span>
              </div>
            </div>

            <a 
              href="#lead-form-section" 
              className="mt-8 px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-xl text-center shadow-lg border border-cyan-400/20"
            >
              Claim 14-Day Free Challenge
            </a>
          </div>
        </div>
      </section>

      {/* PEER TESTIMONIALS: IMPLICIT EGOISM DESIGN (Step 8) */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/60 z-10 relative">
        <h3 className="text-2xl font-extrabold text-white text-center mb-10">Trusted By Plumbing Fleet Owners</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              quote: "Our back office was constantly bogged down by lost paper invoices. Since deploying Plumbify, the techs simply tap the client's credit card onto their phone. Books reconcile to QuickBooks in seconds. I've reclaimed roughly 15 hours a week in paperwork.",
              author: "Dave S.",
              role: "Owner, Austin Sewer & Pipe",
              stats: "5 Trucks on Fleet"
            },
            {
              quote: "Vetting licensed technicians used to consume all my evenings. Now, the Plumbify AI recruiter screens applicants, verifies state plumbing licences, and sets interviews with only the highest quality licensed plumbers. We hired 3 new tech plumbers in under a month.",
              author: "Marc W.",
              role: "Operations Director, Lone Star Rooter",
              stats: "8 Trucks on Fleet"
            }
          ].map((t, i) => (
            <div key={i} className="bg-[#0b1428]/85 border border-slate-800 rounded-3xl p-6 shadow-md flex flex-col justify-between hover:border-cyan-500/20 transition-all">
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic font-medium">"{t.quote}"</p>
              
              <div className="mt-6 pt-4 border-t border-slate-850 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-xs block">{t.author}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{t.role}</span>
                </div>
                <div className="text-right text-[10px] font-bold text-cyan-400 uppercase font-mono">
                  {t.stats}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-slate-800/60 z-10 relative">
        <h3 className="text-2xl font-extrabold text-white text-center mb-10">Frequently Asked Questions</h3>

        <div className="space-y-4">
          {[
            {
              q: "How does the AI Plumber recruiting agent screen applicants?",
              a: "When a technician candidate submits an application (via email, GHL forms, or local ads), our AI recruiter places a screening call to them in under 10 seconds. The AI interviews the candidate, verifies state licensing board credentials in real-time, scores candidate competence out of 5.0, and books technical follow-up interviews directly into your calendar if they score high."
            },
            {
              q: "Do my plumbers need a separate credit card terminal for Tap-to-Pay?",
              a: "No! Plumbify leverages your smartphone's built-in NFC reader. The technician simply pulls up the invoice card inside the webview on their phone, selects 'Tap to Pay', and holds the customer's credit card against the back of their device. No card reader terminal hardware is required."
            },
            {
              q: "How does the automatic bookkeeping ledgers sync work?",
              a: "Once payment completes, Plumbify instantly pushes transaction data to QuickBooks and GHL pipelines. It matches material costs, logs billable plumber rates, and reconciles the cash flow ledger in under 1 second, keeping records clean without manual bookkeeper inputs."
            },
            {
              q: "Is there a setup fee for the 14-Day Free Challenge?",
              a: "Absolutely not. We handle your phone integrations, CRM setups, and QuickBooks mappings 100% free of charge. If Plumbify does not successfully secure or save you money within 14 days, you pay nothing."
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-[#0b1428]/80 border border-slate-800 rounded-2xl overflow-hidden">
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-white hover:bg-slate-900/40 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${activeFaq === idx ? "rotate-180" : ""}`} />
              </button>
              {activeFaq === idx && (
                <div className="p-5 border-t border-slate-900 text-xs text-slate-400 leading-relaxed font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/60 bg-[#070b13]/60 py-12 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 font-semibold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
              <Zap className="h-3 w-3 text-white" />
            </div>
            <span className="font-extrabold text-white">PLUMBIFY</span>
          </div>

          <div className="flex gap-6">
            <Link href="/dashboard" className="hover:text-white transition-colors">Operations Console</Link>
            <a href="#calculator-section" className="hover:text-white transition-colors">ROI Calculator</a>
            <a href="#lead-form-section" className="hover:text-white transition-colors">Challenge Portal</a>
          </div>

          <span>© 2026 Plumbify Inc. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
