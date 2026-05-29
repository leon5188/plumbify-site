import ROICalculator from "@/components/ROICalculator";
import FeatureGrid from "@/components/FeatureGrid";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-6 border border-blue-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            NOW SERVING 500+ PLUMBING COMPANIES
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-8">
            Stop Losing Jobs to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Voicemail & Waiting.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-12">
            The AI-powered operating system for modern plumbers. Close leads in 60 seconds, fill your calendar 24/7, and get paid on the spot.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button className="w-full md:w-auto px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2">
              Start Your 14-Day Free Trial <ArrowRight size={20} />
            </button>
            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
              <CheckCircle2 size={16} className="text-emerald-500" /> No Credit Card Required
            </div>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section id="roi" className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <ROICalculator />
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Designed for Growth.</h2>
            <p className="text-slate-500 text-xl max-w-2xl">Everything you need to automate your back office and dominate your local market.</p>
          </div>
          <FeatureGrid />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-4">Simple, Scalable Pricing.</h2>
            <p className="text-slate-500">No hidden fees. No contract. Cancel anytime.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="p-8 rounded-3xl border border-slate-200 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2">Starter</h3>
                <div className="text-4xl font-black mb-6">$197<span className="text-sm text-slate-400 font-medium">/mo</span></div>
                <ul className="space-y-4 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500" /> Missed Call Text-Back</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500" /> Smart Calendar</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500" /> Mobile Payments</li>
                </ul>
              </div>
              <button className="mt-8 w-full py-4 rounded-xl border-2 border-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-all">Choose Starter</button>
            </div>
            
            {/* Pro */}
            <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col justify-between relative shadow-2xl scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 rounded-full text-[10px] font-black uppercase tracking-widest">Most Popular</div>
              <div>
                <h3 className="text-lg font-bold mb-2">Growth</h3>
                <div className="text-4xl font-black mb-6">$397<span className="text-sm text-slate-400 font-medium">/mo</span></div>
                <ul className="space-y-4 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-400" /> Everything in Starter</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-400" /> AI Recruiting Assistant</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-400" /> Database Reactivation</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-400" /> 10DLC Registration Help</li>
                </ul>
              </div>
              <button className="mt-8 w-full py-4 rounded-xl bg-blue-500 font-bold hover:bg-blue-400 transition-all">Start Growth Trial</button>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-3xl border border-slate-200 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2">Custom</h3>
                <div className="text-4xl font-black mb-6">Let's Talk</div>
                <p className="text-sm text-slate-600 mb-6">For companies with 20+ trucks and multi-location needs.</p>
              </div>
              <button className="mt-8 w-full py-4 rounded-xl border-2 border-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-all">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-xl font-black text-blue-600">PLUMBIFY</div>
          <div className="flex gap-12 text-sm text-slate-400 font-medium">
            <span>© 2026 Plumbify Inc.</span>
            <a href="#" className="hover:text-slate-900">Privacy</a>
            <a href="#" className="hover:text-slate-900">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
