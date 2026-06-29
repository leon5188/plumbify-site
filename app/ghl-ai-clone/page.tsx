"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Users, 
  Smartphone, 
  DollarSign, 
  ArrowUpRight, 
  Activity, 
  Check, 
  HelpCircle,
  Briefcase,
  ChevronDown
} from "lucide-react";

export default function GHLAIClone() {
  // Lead Intake Form State (Connected to live GHL webhook!)
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
  const [ledgerLogs, setLedgerLogs] = useState<any[]>([]);

  // ROI Calculator trucks count
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
            source: "ghl_ai_clone_landing",
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

  // Run candidate screening simulation
  const startScreeningSimulation = async () => {
    setScreenStage("calling");
    setActiveCandidate({ name: "Alex Mercer", phone: "+1 (512) 555-8291", license: "Licensed Journeyman" });
    
    await new Promise(r => setTimeout(r, 1800));
    setScreenStage("screening");
    
    await new Promise(r => setTimeout(r, 3500));
    setScreenStage("scored");
  };

  // Run Tap-to-Pay simulation
  const startPaymentSimulation = async () => {
    setPaymentStage("tapping");
    await new Promise(r => setTimeout(r, 2000));
    setPaymentStage("reconciling");
    
    await new Promise(r => setTimeout(r, 1800));
    setPaymentStage("done");
    setLedgerLogs(prev => [
      { id: `TXN-${Math.floor(1000 + Math.random()*9000)}`, date: "Just now", amount: "$950.00", customer: "John Connor", status: "Reconciled to QBO" },
      ...prev
    ]);
  };

  // ROI calculations
  const yearlyBookkeeperCost = truckCount * 3800; 
  const yearlyRecruitingAgencyCost = truckCount * 4500; 
  const totalTraditionalCost = yearlyBookkeeperCost + yearlyRecruitingAgencyCost;
  const plumbifySubscriptionCost = 149 * 12; 
  const netSavings = totalTraditionalCost - plumbifySubscriptionCost;

  return (
    <div className="min-h-screen bg-[#060b13] text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 antialiased overflow-hidden relative">
      
      {/* GLOWING AMBIENCE OVERLAYS */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/5 to-transparent rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-gradient-to-t from-blue-600/5 to-transparent rounded-full blur-[160px] pointer-events-none z-0"></div>

      {/* CUSTOM CSS FOR DIALER & LEDGER ANIMATIONS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes flowwave {
          0%, 100% { transform: scaleY(0.25); }
          50% { transform: scaleY(1); }
        }
        .flow-bar {
          animation: flowwave 0.8s ease-in-out infinite;
          transform-origin: bottom;
        }
        .flow-bar:nth-child(2) { animation-delay: 0.1s; }
        .flow-bar:nth-child(3) { animation-delay: 0.2s; }
        .flow-bar:nth-child(4) { animation-delay: 0.3s; }
        .flow-bar:nth-child(5) { animation-delay: 0.4s; }
        
        .neon-box-glow {
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.15);
          border-color: rgba(6, 182, 212, 0.3) !important;
        }
        .neon-box-glow:hover {
          box-shadow: 0 0 35px rgba(6, 182, 212, 0.35);
          border-color: rgba(6, 182, 212, 0.6) !important;
        }
        .neon-text-glow {
          text-shadow: 0 0 10px rgba(6, 182, 212, 0.6);
        }
        .neon-text-emerald {
          text-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
        }
      `}} />

      {/* HEADER NAVBAR */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Zap className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-extrabold tracking-tight text-white text-base">PLUMBIFY</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xs font-bold text-slate-400 hover:text-white transition-colors mr-2">
            View Live Dashboard
          </Link>
          <a 
            href="#intake-section"
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all border border-cyan-400/20"
          >
            Start Free Trial
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-12 gap-12 items-center z-10 relative">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20 uppercase tracking-wider">
            <Sparkles size={12} className="animate-pulse" />
            <span>Autonomous Field Business Engine</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.08]">
            The Self-Running Shop.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500">
              No Admins Required.
            </span>
          </h2>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl">
            Plumbify uses AI Agents to interview and hire licensed plumbers on autopilot, while automatically managing on-site invoice reconciliation using smartphone Tap-to-Pay. Scale your fleet, eliminate booking errors, and skip the bookkeeper overhead.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <a 
              href="#calculator-section"
              className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <span>Calculate Savings</span>
              <ArrowRight size={14} />
            </a>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Full GHL + QuickBooks Sync</span>
            </div>
          </div>
        </div>

        {/* HERO FORM INTAKE */}
        <div id="intake-section" className="lg:col-span-5">
          <div className="p-8 rounded-3xl bg-[#0b1428]/80 border border-slate-800 backdrop-blur-xl shadow-2xl relative overflow-hidden neon-box-glow transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <h3 className="text-xl font-bold text-white mb-2">Claim 14-Day Free Challenge</h3>
            <p className="text-slate-400 text-xs mb-6">Enter your credentials below. We will setup your automated hiring & phone lines in 24 hours.</p>

            {success ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                  <Check size={24} />
                </div>
                <h4 className="text-base font-bold text-white">Challenge Activated!</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Our implementation team will call your office shortly to integrate your business phone lines and WeChat channels.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">First Name</label>
                    <input 
                      type="text" 
                      name="firstName" 
                      required 
                      value={formData.firstName} 
                      onChange={handleInputChange} 
                      placeholder="John" 
                      className="w-full bg-[#070b13] border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName" 
                      required 
                      value={formData.lastName} 
                      onChange={handleInputChange} 
                      placeholder="Doe" 
                      className="w-full bg-[#070b13] border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Phone</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    required 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="+1 (512) 555-0199" 
                    className="w-full bg-[#070b13] border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="john@plumbingco.com" 
                    className="w-full bg-[#070b13] border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Service Trucks</label>
                  <select 
                    name="trucks" 
                    value={formData.trucks} 
                    onChange={handleInputChange}
                    className="w-full bg-[#070b13] border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/40"
                  >
                    <option value="1-2">1-2 Active Trucks</option>
                    <option value="3">3 Active Trucks</option>
                    <option value="4-8">4-8 Active Trucks</option>
                    <option value="9+">9+ Active Trucks</option>
                  </select>
                </div>

                {error && <div className="text-[10px] text-red-400 font-semibold">{error}</div>}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 border border-cyan-400/20 mt-2 flex items-center justify-center gap-2"
                >
                  {loading ? "Processing..." : "Deploy 14-Day Free Challenge"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FEATURE 1: AI SMART RECRUITING AGENT */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-[#1e293b]/40 grid lg:grid-cols-12 gap-12 items-center z-10 relative">
        <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
          
          {/* Candidate Screening Simulator */}
          <div className="bg-[#0b1428]/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">AI HR Recruiter Node</span>
              </div>
              <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded font-mono">v1.2</span>
            </div>

            {screenStage === "idle" && (
              <div className="text-center py-8 space-y-4">
                <p className="text-xs text-slate-400 font-medium">Ready to simulate an incoming plumber applicant screening interview.</p>
                <button 
                  onClick={startScreeningSimulation}
                  className="px-4 py-2.5 bg-cyan-600/10 hover:bg-cyan-600 text-cyan-400 hover:text-white border border-cyan-500/20 hover:border-cyan-500 rounded-xl text-[10px] font-bold transition-all shadow-sm"
                >
                  Trigger Plumber Job Application
                </button>
              </div>
            )}

            {screenStage === "calling" && (
              <div className="text-center py-8 space-y-3">
                <div className="text-xs text-cyan-400 font-bold animate-bounce">Initiating Automated Screening Call...</div>
                <div className="text-[10px] text-slate-500 font-mono">Connecting with {activeCandidate?.name}</div>
              </div>
            )}

            {screenStage === "screening" && (
              <div className="space-y-4">
                <div className="bg-[#070b13] p-3.5 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold">Candidate Info</span>
                    <span className="font-bold text-white">{activeCandidate?.name}</span>
                    <span className="text-[9px] text-cyan-400 font-semibold">{activeCandidate?.license}</span>
                  </div>
                  <span className="text-[9px] text-emerald-400 font-bold border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded">Ringing</span>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">AI Interview Waveform</span>
                  <div className="flex items-end justify-center gap-1.5 h-10 w-full bg-[#070b13]/50 p-2 rounded-xl">
                    <div className="flow-bar w-1 bg-cyan-400 rounded-t h-full"></div>
                    <div className="flow-bar w-1 bg-cyan-300 rounded-t h-full"></div>
                    <div className="flow-bar w-1 bg-cyan-500 rounded-t h-full"></div>
                    <div className="flow-bar w-1 bg-cyan-400 rounded-t h-full"></div>
                    <div className="flow-bar w-1 bg-cyan-600 rounded-t h-full"></div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 text-center font-medium leading-relaxed">AI Voice Agent: "Explain the process you follow when locating a slab leak under concrete..."</p>
              </div>
            )}

            {screenStage === "scored" && (
              <div className="space-y-4">
                <div className="bg-[#070b13] p-4 rounded-xl border border-slate-850 space-y-3.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-white text-xs">{activeCandidate?.name}</span>
                      <span className="text-[9px] text-slate-500 block mt-0.5">{activeCandidate?.license}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-emerald-400 font-bold block neon-text-emerald">4.8 / 5.0</span>
                      <span className="text-[8px] text-slate-500 uppercase tracking-wider font-extrabold">Interview Score</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-900 pt-2 font-medium">
                    <span className="text-cyan-400 font-bold">Vetting Summary:</span> Candidate demonstrated excellent knowledge of hydrostatic pressure testing, pipe location grids, and slab bypasses. Clear communication. Passed license status verification.
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setScreenStage("idle")}
                    className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 text-[10px] rounded-lg border border-slate-850 font-bold transition-all"
                  >
                    Reset Demo
                  </button>
                  <a 
                    href="#intake-section"
                    className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] rounded-lg font-bold transition-all text-center flex items-center justify-center"
                  >
                    Try it Free
                  </a>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20 uppercase tracking-wider">
            <Users size={12} />
            <span>Core Feature 1: Plumber Recruiting</span>
          </div>

          <h3 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
            Never Let a Top Plumber Slide Away. <br />
            AI Vets & Schedules Candidates 24/7.
          </h3>

          <p className="text-slate-400 text-sm leading-relaxed">
            Finding licensed service technicians is a massive bottleneck. Plumbify monitors inbound employment leads, initiates automated technical voice screen calls in 10 seconds, scores answers on slab leaks and repipes, and schedules physical interviews only with candidates who score 4.5+.
          </p>

          <ul className="space-y-3.5 text-xs text-slate-300 font-medium">
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">✓</span>
              <span>**Instant Candidate Interception**: Screen resumes the moment they are submitted.</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">✓</span>
              <span>**Automated Credentials Verification**: Automatically cross-reference state licensing boards.</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">✓</span>
              <span>**High-Fidelity Candidate Dashboard**: Rank candidates by technical score and reliability.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* FEATURE 2: TAP-TO-PAY & AUTOMATED BOOKKEEPING */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-[#1e293b]/40 grid lg:grid-cols-12 gap-12 items-center z-10 relative">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 uppercase tracking-wider">
            <Smartphone size={12} />
            <span>Core Feature 2: Tap-to-Pay Ledger</span>
          </div>

          <h3 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
            Tap a Card to Reconcile the Books. <br />
            Zero Manual Bookkeeping Inputs.
          </h3>

          <p className="text-slate-400 text-sm leading-relaxed">
            Plumbers hate doing paperwork. Plumbify eliminates invoices, manual ledgers, and office follow-ups. When the technician completes the water heater installation, the customer simply taps their card against the technician's phone. Plumbify instantly bills, handles invoice generation, and updates the accounting ledger in 1 second.
          </p>

          <ul className="space-y-3.5 text-xs text-slate-300 font-medium">
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center shrink-0">✓</span>
              <span>**Smartphone-Only POS Terminal**: Zero card terminal hardware to rent.</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center shrink-0">✓</span>
              <span>**1-Second QuickBooks Sync**: Material costs are automatically mapped.</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center shrink-0">✓</span>
              <span>**Instantly Reconciled Cash Flow**: Direct deposit ledger updates without bookkeeper audits.</span>
            </li>
          </ul>
        </div>

        {/* Tap to Pay Simulator */}
        <div className="lg:col-span-5">
          <div className="bg-[#0b1428]/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Tap-to-Pay POS Module</span>
              </div>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">v3.4</span>
            </div>

            {paymentStage === "idle" && (
              <div className="text-center py-8 space-y-4">
                <p className="text-xs text-slate-400 font-medium">Simulate an on-site contactless invoice transaction completion.</p>
                <button 
                  onClick={startPaymentSimulation}
                  className="px-4 py-2.5 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-emerald-500 rounded-xl text-[10px] font-bold transition-all shadow-sm"
                >
                  Trigger Tap-to-Pay Payment
                </button>
              </div>
            )}

            {paymentStage === "tapping" && (
              <div className="text-center py-8 space-y-3">
                <div className="text-xs text-emerald-400 font-bold animate-pulse">Contactless Card Detected...</div>
                <div className="text-[10px] text-slate-500 font-mono">Tapping card for invoice value: $950.00</div>
              </div>
            )}

            {paymentStage === "reconciling" && (
              <div className="text-center py-8 space-y-3">
                <div className="text-xs text-cyan-400 font-bold animate-spin w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto"></div>
                <div className="text-xs text-cyan-400 font-bold">Instantly Reconciling Ledger...</div>
                <div className="text-[10px] text-slate-500 font-mono">Syncing with QuickBooks & GHL Cash Flow</div>
              </div>
            )}

            {paymentStage === "done" && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-[#070b13] p-4 rounded-xl border border-slate-850 space-y-3 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <Check size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">Invoice Paid & Reconciled</span>
                    <span className="text-2xl font-black text-white block mt-1 neon-text-emerald">$950.00 PAID</span>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-normal border-t border-slate-900 pt-2 font-medium">
                    Ledger Log: Deposit recorded. Parts inventory (Burst Pipe Parts) deducted. Invoices marked PAID in GHL & QuickBooks.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">Live Transaction Logs</span>
                  <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
                    {ledgerLogs.map((log, idx) => (
                      <div key={idx} className="bg-[#070b13] border border-slate-900 p-2 rounded-lg flex items-center justify-between text-[10px]">
                        <div>
                          <span className="font-bold text-white block">{log.id} ({log.customer})</span>
                          <span className="text-[8px] text-slate-500">{log.date}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-emerald-400 block">{log.amount}</span>
                          <span className="text-[8px] text-slate-500">{log.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setPaymentStage("idle")}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 text-[10px] rounded-lg border border-slate-850 font-bold transition-all"
                >
                  Reset Payment Simulator
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR SECTION */}
      <section id="calculator-section" className="max-w-7xl mx-auto px-6 py-20 border-t border-[#1e293b]/40 z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20 uppercase tracking-wider">
            <DollarSign size={12} />
            <span>Bookkeeper & Admin Cost Savings</span>
          </div>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">Calculate Your Savings</h3>
          <p className="text-slate-400 text-xs sm:text-sm">See how much Plumbify saves your shop compared to traditional hiring agencies and administrative bookkeepers.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls */}
          <div className="lg:col-span-6 bg-[#0b1428]/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h4 className="text-base font-bold text-white">How many service trucks do you run?</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono font-bold text-lg text-white">
                  <span>Service Fleet:</span>
                  <span className="text-cyan-400 text-xl font-black neon-text-glow">{truckCount} Trucks</span>
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

              <div className="space-y-3.5 text-xs text-slate-400 pt-2 leading-relaxed">
                <p>📊 **Traditional Bookkeeping**: Running bookkeepers costs roughly $3,800/year per truck in administrative overhead, invoice processing, and billing audits.</p>
                <p>👨‍🔧 **Recruiting Overhead**: Headhunter agencies and job posting management costs roughly $4,500/year per truck in recruitment fees.</p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/80 text-[10px] text-slate-500 flex justify-between font-bold uppercase tracking-wider">
              <span>* Estimates based on industry averages</span>
              <span>Scale: Plumbify replaces admin roles</span>
            </div>
          </div>

          {/* Results Summary */}
          <div className="lg:col-span-6 bg-[#102452]/40 border border-cyan-500/25 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="space-y-6">
              <h4 className="text-base font-bold text-white">Estimated Annual Net Profit Savings</h4>
              
              <div className="space-y-1">
                <span className="text-slate-400 text-xs block font-semibold uppercase tracking-wider">Total Traditional Costs:</span>
                <span className="text-xl font-bold text-white font-mono line-through opacity-50">${totalTraditionalCost.toLocaleString()}/yr</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-xs block font-semibold uppercase tracking-wider">Your Plumbify Cost:</span>
                <span className="text-xl font-bold text-cyan-400 font-mono">${plumbifySubscriptionCost.toLocaleString()}/yr</span>
              </div>

              <div className="pt-4 border-t border-cyan-500/10 space-y-1.5">
                <span className="text-cyan-400 text-xs block font-bold uppercase tracking-wider">Net Savings Back to Cash Flow:</span>
                <span className="text-5xl font-extrabold text-emerald-400 font-mono tracking-tight neon-text-emerald">${netSavings.toLocaleString()}/yr</span>
              </div>
            </div>

            <a 
              href="#intake-section" 
              className="mt-8 px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-xl text-center shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 border border-cyan-400/20"
            >
              Start Free 14-Day Challenge
            </a>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-[#1e293b]/40 z-10 relative">
        <h3 className="text-2xl font-extrabold text-white text-center mb-10">Frequently Asked Questions</h3>

        <div className="space-y-4">
          {[
            {
              q: "How does the AI smart recruiting screen applicants?",
              a: "When a plumber candidate submits an application (via email, Yelp, WeChat, or GHL forms), our AI recruiter initiates a screening call within 10 seconds. The AI interviews the candidate, verifies state licenses in real-time, scores candidate compatibility out of 5.0, and books technical follow-up calls directly into your calendar if they pass."
            },
            {
              q: "Do my technicians need to download a separate POS terminal app for Tap-to-Pay?",
              a: "No! Plumbify runs directly inside their mobile web view or Capacitor shell. It leverages your smartphone's built-in NFC reader. The technician simply pulls up the invoice card, selects 'Tap to Pay', and holds the customer's credit card against the back of their phone. No special hardware is required."
            },
            {
              q: "How does the automatic bookkeeping ledgers sync work?",
              a: "Once tap-to-pay completes, Plumbify instantly pushes the transactional data directly into QuickBooks and GHL pipelines. It maps material costs, computes local sales taxes, maps technicians' billable rates, and reconciles the deposit ledger in under 1 second, keeping your records clean without bookkeeper audits."
            },
            {
              q: "Is there a setup fee for the 14-Day Free Challenge?",
              a: "Absolutely not. We handle your phone integration, CRM onboarding, and QuickBooks mapping 100% free of charge. If Plumbify does not successfully secure or save you money within 14 days, you pay nothing."
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
      <footer className="border-t border-[#1e293b]/40 bg-[#070b13]/60 py-12 z-10 relative">
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
            <a href="#intake-section" className="hover:text-white transition-colors">Challenge Portal</a>
          </div>

          <span>© 2026 Plumbify Inc. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
