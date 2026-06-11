import { Calendar, User, ArrowLeft, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function BlogMissedCalls() {
  return (
    <main className="min-h-screen bg-white pb-20">
      <article className="pt-40 px-6 max-w-4xl mx-auto">
        <Link href="/resources/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
        
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
            The Hidden Math of Missed Calls: <br />How Plumbing Shops Leak $10,000+ Every Month.
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-2"><User size={16} /> Sarah Jenkins</div>
            <div className="flex items-center gap-2"><Calendar size={16} /> Jun 09, 2026</div>
            <div className="flex items-center gap-2"><Clock size={16} /> 7 min read</div>
          </div>
        </header>

        {/* Featured Image Placeholder */}
        <div className="w-full aspect-[21/9] bg-emerald-50 rounded-[40px] mb-16 flex items-center justify-center border border-emerald-100 relative overflow-hidden">
          <div className="text-sm font-bold text-emerald-300 uppercase tracking-widest italic">[ Visual: Smartphone showing missed calls notifications ]</div>
        </div>

        <div className="prose prose-slate prose-lg max-w-none text-slate-600">
          <p className="text-xl text-slate-600 leading-relaxed mb-8">
            When a homeowner has water pouring through their ceiling or a toilet backing up onto their hardwood floors, they aren't going to leave a voicemail. They aren't going to wait two hours for you to finish a job and call them back. They will hit "back" on Google and click the very next plumber on the list. If you don't answer the phone, you don't exist.
          </p>
          
          <p className="mb-8">
            Many plumbing shop owners look at their profit margins, material costs, and technician hourly rates, but completely ignore the single biggest leak in their business: missed phone calls. Let's look at the actual math of what a missed call is costing your plumbing company.
          </p>

          <h2 className="text-3xl font-black mb-6 text-slate-900">The Anatomy of a Lost Lead</h2>
          <p className="mb-6">
            Let's do some simple math based on typical residential plumbing benchmarks in 2026:
          </p>
          
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-150 mb-8">
            <h3 className="text-xl font-bold mb-4 text-slate-950">Let's Calculate the Real Cost:</h3>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex justify-between border-b border-slate-200 pb-2">
                <span>Average Inbound Lead Cost (LSA or PPC):</span>
                <strong>$60 per call</strong>
              </li>
              <li className="flex justify-between border-b border-slate-200 pb-2">
                <span>Average Residential Ticket Size (drain clean, leaks, etc.):</span>
                <strong>$450</strong>
              </li>
              <li className="flex justify-between border-b border-slate-200 pb-2">
                <span>Standard Lead-to-Book Conversion Rate:</span>
                <strong>40%</strong>
              </li>
              <li className="flex justify-between font-bold text-slate-950 pt-2">
                <span>Value of a Single Missed Call:</span>
                <span>$60 (Ad Cost) + $180 (Booked Value) = $240</span>
              </li>
            </ul>
          </div>

          <p className="mb-6">
            If your shop misses just **2 phone calls a day** during busy hours (while you are driving, talking to another client, or under a sink), that is **40 missed calls a month**. 
          </p>
          <p className="mb-8 text-xl font-bold text-slate-900">
            40 missed calls × $240 per call = $9,600 in leaked revenue and wasted marketing budget every single month.
          </p>
          <p className="mb-8">
            And that is a conservative estimate. If one of those missed calls was a main water line replacement ($4,500) or an emergency sewer line dig ($8,000), the cost of that single missed call skyrockets.
          </p>

          <div className="p-8 rounded-3xl bg-amber-500 text-white flex items-center gap-8 mb-12">
            <AlertTriangle size={64} className="text-amber-100 shrink-0" />
            <div>
              <h4 className="text-xl font-bold mb-2">The Google LSA Penalty</h4>
              <p className="text-amber-100 text-sm">Google LSAs reward responsiveness. If you repeatedly miss calls triggered by their ads, Google lowers your ranking in their ad auction, meaning you have to pay more per lead just to show up. Missed calls actively make your future ads more expensive.</p>
            </div>
          </div>

          <h2 className="text-3xl font-black mb-6 text-slate-900">Why Voicemail Is Where Leads Go to Die</h2>
          <p className="mb-6">
            Homeowners hate voicemail. It feels like sending a message into a black hole. Data shows that **80% of residential service prospects will hang up without leaving a voicemail** if they reach an answering machine. They want immediate confirmation that a technician is coming.
          </p>
          <p className="mb-8">
            Even if you pay for a live answering service, the conversion rate drops if the service agent can only "take a message" rather than booking the dispatch window. Customers want a booking confirmation, not a promise that someone will call them back in an hour.
          </p>

          <h2 className="text-3xl font-black mb-6 text-slate-900">How to Fix the Leak: The Automated Text-Back</h2>
          <p className="mb-6">
            You can’t stay awake 24/7, and you can’t answer the phone while soldering a pipe. The solution is immediate automation. 
          </p>
          <p className="mb-6">
            When a call is missed, your system must instantly trigger an automated text-back sequence within 30 seconds:
          </p>
          <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 italic bg-slate-50 text-slate-800 mb-6 rounded-r-lg">
            "Hey! This is Steve from Plumbify. Sorry we missed your call—we are currently helping another customer. Do you need to book an appointment or ask a question?"
          </blockquote>
          <p className="mb-8">
            This instantly stops the customer from clicking back to Google. It moves the conversation to text, where your AI assistant can ask for their address, get details on the issue (e.g., "clogged sewer line"), and send them a link to choose a dispatch window on your schedule. By the time you get out from under the sink, the job is booked, the address is verified, and the ticket is ready.
          </p>

          <p className="mb-8 font-semibold text-slate-950">
            Stop letting your competitors take the jobs you paid Google to get. Missed calls are the highest-margin loss in your entire plumbing shop. Automate your follow-up, respond to leads in seconds, and watch your monthly revenue jump without spending a single dollar more on marketing.
          </p>
        </div>

        <div className="mt-20 p-10 rounded-[40px] bg-slate-900 text-white text-center">
          <h3 className="text-2xl font-black mb-4">Never Lose Another Plumbing Lead</h3>
          <p className="mb-8 text-slate-400">Plumbify automatically texts back missed calls and books jobs while you work. Capture the leads you are missing today.</p>
          <Link href="/pricing" className="inline-block px-8 py-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-400 transition-all">
            See How it Works
          </Link>
        </div>
      </article>
    </main>
  );
}
