import { Calendar, User, ArrowLeft, Clock, Zap } from "lucide-react";
import Link from "next/link";

export default function Blog2() {
  return (
    <main className="min-h-screen bg-white pb-20">
      <article className="pt-40 px-6 max-w-4xl mx-auto">
        <Link href="/resources/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
        
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
             How an AI Plumber Assistant <br />Saves You 20 Hours a Week.
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
             <div className="flex items-center gap-2"><User size={16} /> Sarah Jenkins</div>
             <div className="flex items-center gap-2"><Calendar size={16} /> Oct 10, 2026</div>
             <div className="flex items-center gap-2"><Clock size={16} /> 6 min read</div>
          </div>
        </header>

        {/* Featured Image Placeholder */}
        <div className="w-full aspect-[21/9] bg-emerald-50 rounded-[40px] mb-16 flex items-center justify-center border border-emerald-100 relative overflow-hidden">
           <div className="text-sm font-bold text-emerald-300 uppercase tracking-widest italic">[ Visual: AI Assistant Mobile Interface ]</div>
        </div>

        <div className="prose prose-slate prose-lg max-w-none">
          <p className="text-xl text-slate-600 leading-relaxed mb-8">
            Are you still the one answering the phone at 8 PM to book a simple drain cleaning? Or spending your Sunday night manually screening resumes for a new helper? There's a better way.
          </p>
          
          <h2 className="text-3xl font-black mb-6">The End of Manual Dispatching</h2>
          <p className="mb-8">
            An AI Plumber Assistant acts as a digital office manager that never sleeps. By integrating with your phone system, it can instantly text back missed calls, ask qualifying questions, and book the job directly into your calendar.
          </p>

          <h2 className="text-3xl font-black mb-6">Automated Vetting: The Real Time-Saver</h2>
          <p className="mb-8">
            Hiring is the biggest bottleneck for growth. AI assistants can now handle the initial phone screen, asking candidates about their licenses and years of experience. This ensures you only spend time interviewing the absolute best talent.
          </p>

          <div className="p-8 rounded-3xl bg-emerald-600 text-white flex items-center gap-8 mb-12">
             <Zap size={64} className="text-emerald-200 shrink-0" />
             <div>
                <h4 className="text-xl font-bold mb-2">The 20-Hour Rule</h4>
                <p className="text-emerald-100 text-sm">By automating text-backs, booking, and hiring screens, our typical client saves 20+ hours of administrative work every single week.</p>
             </div>
          </div>

          <h2 className="text-3xl font-black mb-6">Why It's Not "Just a Bot"</h2>
          <p className="mb-8">
            In 2026, AI understands intent. It knows that a "burst pipe" needs a different response than "I'm looking for a quote on a remodel." This nuanced understanding protects your reputation while maximizing your efficiency.
          </p>
        </div>

        <div className="mt-20 p-10 rounded-[40px] bg-slate-900 text-white text-center">
           <h3 className="text-2xl font-black mb-4">Reclaim Your Weekends.</h3>
           <p className="mb-8 text-slate-400">Let Plumbify's AI Assistant handle the office while you handle the work.</p>
           <button className="px-8 py-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-400 transition-all">Meet Your AI Assistant</button>
        </div>
      </article>
    </main>
  );
}
