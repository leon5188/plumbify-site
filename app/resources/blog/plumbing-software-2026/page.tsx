import { Calendar, User, ArrowLeft, Clock, Share2 } from "lucide-react";
import Link from "next/link";

export default function Blog1() {
  return (
    <main className="min-h-screen bg-white pb-20">
      <article className="pt-40 px-6 max-w-4xl mx-auto">
        <Link href="/resources/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
        
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
             Plumbing Software 2026: <br />The Future of Field Service.
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
             <div className="flex items-center gap-2"><User size={16} /> James Miller</div>
             <div className="flex items-center gap-2"><Calendar size={16} /> Oct 15, 2026</div>
             <div className="flex items-center gap-2"><Clock size={16} /> 8 min read</div>
          </div>
        </header>

        {/* Featured Image Placeholder */}
        <div className="w-full aspect-[21/9] bg-blue-50 rounded-[40px] mb-16 flex items-center justify-center border border-blue-100 relative overflow-hidden">
           <div className="text-sm font-bold text-blue-300 uppercase tracking-widest italic">[ Visual: Future Tech Concept Illustration ]</div>
           <div className="absolute top-10 right-10 p-3 bg-white/50 backdrop-blur rounded-2xl shadow-xl">
              <Share2 size={20} className="text-blue-600" />
           </div>
        </div>

        <div className="prose prose-slate prose-lg max-w-none">
          <p className="text-xl text-slate-600 leading-relaxed mb-8">
            The landscape of trade services is shifting faster than ever. By 2026, simply having a digital calendar won't be enough. The modern plumbing business must become a high-efficiency automation engine.
          </p>
          
          <h2 className="text-3xl font-black mb-6">1. AI-Driven Smart Dispatch</h2>
          <p className="mb-8">
            In 2026, dispatching is no longer a manual task. Software now analyzes live traffic, technician skill sets, and job urgency to optimize routes in real-time. This isn't just about saving fuel; it's about maximizing the billable hours of every truck in your fleet.
          </p>

          <h2 className="text-3xl font-black mb-6">2. The Death of the Physical POS</h2>
          <p className="mb-8">
            With the rise of "Tap to Pay" integrated directly into mobile apps, the clunky card reader is becoming a relic of the past. Technicians can now collect payments via NFC, ensuring higher collection rates and immediate cash flow.
          </p>

          <blockquote className="p-8 bg-slate-50 rounded-3xl border-l-8 border-blue-600 italic text-2xl font-black mb-8">
            "The plumbing companies that survive the next decade are the ones that stop fighting automation and start leveraging it."
          </blockquote>

          <h2 className="text-3xl font-black mb-6">3. SMS Compliance & 10DLC</h2>
          <p className="mb-8">
            As carriers tighten restrictions, 10DLC registration is no longer optional. Future plumbing software includes built-in compliance workflows to ensure that your appointment reminders and marketing texts actually land in the customer's inbox.
          </p>
        </div>

        <div className="mt-20 p-10 rounded-[40px] bg-blue-600 text-white text-center">
           <h3 className="text-2xl font-black mb-4">Ready for the Future?</h3>
           <p className="mb-8 text-blue-100">See how Plumbify is leading the charge in 2026.</p>
           <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:scale-105 transition-all">Schedule a 2026 Audit</button>
        </div>
      </article>
    </main>
  );
}
