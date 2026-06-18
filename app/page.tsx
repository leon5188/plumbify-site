"use client";

import { useState } from "react";
import ROICalculator from "@/components/ROICalculator";
import { 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  Users, 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  Coins, 
  ChevronDown, 
  Check, 
  Loader2,
  PhoneCall,
  Smartphone
} from "lucide-react";

export default function Home() {
  // Form submission state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
            source: "webform",
            message: formData.message || "Signed up for 14-Day Free Challenge"
          })
        }
      );

      if (response.ok) {
        setSuccess(true);
        setFormData({ firstName: "", lastName: "", phone: "", email: "", message: "" });
      } else {
        throw new Error("Failed to submit. Please try again.");
      }
    } catch (err) {
      setError("We encountered an issue submitting your request. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "I already use ServiceTitan / Housecall Pro. Do I need Plumbify?",
      a: "Yes. ServiceTitan and Housecall Pro are excellent for scheduling trucks and dispatching technicians. However, they do not proactively capture your WeChat messages, Google/Facebook ad leads, or auto-text back missed calls in 5 seconds. Plumbify sits in front of your dispatch software. It secures the customer first, then passes the won job details straight to your technician."
    },
    {
      q: "How does the 'Missed Call Text-Back' feature work?",
      a: "If a customer calls your office number and no one answers, Plumbify instantly intercepts the missed call and sends an SMS to the caller: 'Hi, we missed your call. How can we help you today?' 80% of callers will reply to the text instead of hanging up and calling another plumber."
    },
    {
      q: "Is WeChat integration supported out of the box?",
      a: "Absolutely. We connect your business WeChat or WeCom account. When prospects message you requesting water heater quotes or emergency service, the conversation drops directly into your Plumbify dashboard and tags the lead automatically."
    },
    {
      q: "What is the 14-Day Free Challenge?",
      a: "We will set up Plumbify for your shop completely free for 14 days. We connect your business line, website forms, and WeChat. If the system does not rescue and secure at least 3 plumbing jobs that you would have otherwise missed or forgotten, you pay nothing."
    }
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-600 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.12),transparent_45%)]" />
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center relative z-10">
          {/* Hero Content */}
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold mb-6 border border-blue-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
              </span>
              THE AUTOMATED LEAD ENGINE FOR WATER & SEWER BUSINESSES
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
              Stop Losing Jobs To <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Missed Calls & Chats.
              </span>
            </h1>
            
            <p className="text-slate-400 text-lg sm:text-xl max-w-xl mb-8 leading-relaxed">
              Plumbify CRM captures inquiries from WeChat, Google Ads, and emails in real-time. It automatically texts back in 5 seconds, routes jobs, and plugs your business leaks.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
              <a 
                href="#challenge-form" 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                Join the 14-Day Challenge <ArrowRight size={18} />
              </a>
              <div className="flex items-center gap-2 justify-center text-slate-400 text-sm">
                <CheckCircle2 size={16} className="text-blue-400" /> Free Setup & Integrations Included
              </div>
            </div>
          </div>

          {/* Hero Form */}
          <div id="challenge-form" className="lg:col-span-5">
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl relative">
              <h3 className="text-2xl font-bold mb-2">Start Your 14-Day Challenge</h3>
              <p className="text-slate-400 text-sm mb-6">Enter your details. We will connect your WeChat and phone lines in 24 hours.</p>

              {success ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-white mb-2">Challenge Accepted!</h4>
                  <p className="text-slate-300 text-sm">
                    We received your submission. A GHL configuration expert is setting up your sandbox workspace now.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">First Name</label>
                      <input 
                        type="text" required name="firstName" value={formData.firstName} onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-sm text-white"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Last Name</label>
                      <input 
                        type="text" required name="lastName" value={formData.lastName} onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-sm text-white"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Phone Number</label>
                    <input 
                      type="tel" required name="phone" value={formData.phone} onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-sm text-white"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                    <input 
                      type="email" required name="email" value={formData.email} onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-sm text-white"
                      placeholder="john@plumbingcompany.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Emergency / Plumbing Needs (Optional)</label>
                    <textarea 
                      name="message" value={formData.message} onChange={handleInputChange} rows={2}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none text-sm text-white resize-none"
                      placeholder="e.g., Water heater replacement needed, burst pipe in kitchen..."
                    />
                  </div>

                  {error && <p className="text-red-400 text-xs">{error}</p>}

                  <button 
                    type="submit" disabled={loading}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : "Submit Setup Request"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Visual Omnichannel Lead Capture Section */}
      <section className="py-24 px-6 border-y border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black mb-4">Unified Omnichannel Capture</h2>
            <p className="text-slate-400 max-w-xl mx-auto">No more sticky notes. Stop checking five different platforms. Plumbify aggregates all leads into one workspace.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-850 flex flex-col justify-between hover:border-blue-500/30 transition-all group">
              <div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <MessageSquare size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">WeChat / WeCom Gateway</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Connect WeChat and WeChat Work directly. Customer inquiries automatically update contact records and notify dispatchers.
                </p>
              </div>
              <div className="mt-6 text-xs font-semibold text-blue-400 tracking-wider">TAG: src:wechat</div>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-850 flex flex-col justify-between hover:border-blue-500/30 transition-all group">
              <div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <Smartphone size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Facebook & Google Lead Ads</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Direct lead sync. Every click and submission from local Google search maps and Facebook ads creates opportunities instantly.
                </p>
              </div>
              <div className="mt-6 text-xs font-semibold text-blue-400 tracking-wider">TAG: src:ads</div>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-850 flex flex-col justify-between hover:border-blue-500/30 transition-all group">
              <div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <Clock size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Email Quote Parser</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Inbound quote request emails are automatically read. Client name, location, and plumbing details are auto-saved.
                </p>
              </div>
              <div className="mt-6 text-xs font-semibold text-blue-400 tracking-wider">TAG: src:email-parser</div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Pipeline Section */}
      <section className="py-24 px-6 bg-slate-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black mb-4">Pipeline Stage Management</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Know exactly where your quote requests stand. Stop sales reps from forgetting to call back sent proposals.</p>
          </div>

          {/* GHL 5-Stage Kanban Board Mockup */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Stage 1 */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col h-[280px]">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-850">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Initial Contact</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold">NEW</span>
              </div>
              <div className="space-y-3 flex-grow overflow-hidden">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs">
                  <div className="font-bold mb-1">Peifeng Ni (WeChat)</div>
                  <div className="text-slate-400">Burst pipe kitchen</div>
                  <div className="mt-2 text-blue-400 font-bold">$500</div>
                </div>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col h-[280px]">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-850">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">2. Needs Analysis</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold">INFO</span>
              </div>
              <div className="space-y-3 flex-grow overflow-hidden">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs opacity-75">
                  <div className="font-bold mb-1">Robert Chen</div>
                  <div className="text-slate-400">Heater leaking camera</div>
                  <div className="mt-2 text-cyan-400 font-bold">$1,500</div>
                </div>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col h-[280px]">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-850">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">3. Proposal / Quote</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold">SENT</span>
              </div>
              <div className="space-y-3 flex-grow overflow-hidden">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs">
                  <div className="font-bold mb-1">Sarah Jenkins</div>
                  <div className="text-slate-400">Sewer Line Custom Quote</div>
                  <div className="mt-2 text-purple-400 font-bold">$4,800</div>
                </div>
              </div>
            </div>

            {/* Stage 4 */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col h-[280px]">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-850">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">4. Negotiation</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold">DISCUSS</span>
              </div>
              <div className="space-y-3 flex-grow overflow-hidden">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs opacity-60">
                  <div className="font-bold mb-1">David Wong</div>
                  <div className="text-slate-400">Commercial remodel</div>
                  <div className="mt-2 text-amber-400 font-bold">$8,500</div>
                </div>
              </div>
            </div>

            {/* Stage 5 */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col h-[280px]">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-850">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">5. Closed Won</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">PAID</span>
              </div>
              <div className="space-y-3 flex-grow overflow-hidden">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs">
                  <div className="font-bold mb-1">Mike Davis</div>
                  <div className="text-slate-400">Hot water installation</div>
                  <div className="mt-2 text-emerald-400 font-bold">$2,200</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Tagging Section */}
      <section className="py-24 px-6 border-y border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black mb-4">Smart Tagging & Handoff Automation</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Remove human memory from the equation. The system automatically tags leads to optimize follow-up frequency and priority.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-850 text-left">
              <span className="inline-block px-2.5 py-1 rounded bg-red-500/10 text-red-400 text-xs font-bold mb-4">intent:hot</span>
              <h4 className="text-lg font-bold mb-2">Emergency Intent</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatically applied when customers use urgent keywords like "burst," "leak," or "emergency." Instantly triggers top technician dispatch.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-850 text-left">
              <span className="inline-block px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-bold mb-4">val:high</span>
              <h4 className="text-lg font-bold mb-2">High Value Deal</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Assigned to commercial contracts or system replacements. Automatically routes details to the owner for custom quotes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-850 text-left">
              <span className="inline-block px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-bold mb-4">freq:daily</span>
              <h4 className="text-lg font-bold mb-2">Daily Follow-Up</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Applies to open quotes. GHL automatically sends daily text follow-ups to the customer until they choose to pay or cancel.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-850 text-left">
              <span className="inline-block px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-4">status:won</span>
              <h4 className="text-lg font-bold mb-2">Job Paid & Secured</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Triggered on payment receipt. Automatically clears follow-up queues and fires SMS notifications directly to the technician.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-24 px-6 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black mb-4">Plug Your Revenue Leaks</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Use the slider below to calculate how much income your office is dropping each year from missed calls and texts.</p>
          </div>
          <ROICalculator />
        </div>
      </section>

      {/* Objection Buster / FAQ Section */}
      <section className="py-24 px-6 border-t border-slate-900 bg-slate-950">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-400">Everything you need to know about how Plumbify sits in front of your dispatch setup.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="rounded-2xl border border-slate-850 bg-slate-900/50 overflow-hidden transition-all"
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-slate-900 transition-colors"
                >
                  <span className="font-bold text-base sm:text-lg pr-4">{faq.q}</span>
                  <ChevronDown 
                    size={20} 
                    className={`text-slate-400 transition-transform flex-shrink-0 ${activeFaq === index ? "rotate-180" : ""}`}
                  />
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out ${activeFaq === index ? "max-h-[300px] border-t border-slate-850/50" : "max-h-0"} overflow-hidden`}
                >
                  <div className="p-6 text-slate-400 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Block */}
      <section className="py-24 px-6 bg-gradient-to-t from-slate-950 to-slate-900 text-center border-t border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(37,99,235,0.06),transparent_50%)]" />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black mb-6">Are You Ready to Rescue Your Jobs?</h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-8">
            Connect your systems in 24 hours. Start catching WeChat, email, and Google ad leads. Join the 14-Day Challenge today.
          </p>
          <a 
            href="#challenge-form"
            className="inline-flex items-center gap-2 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-blue-500/25"
          >
            Start Your Setup Now <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-950 border-t border-slate-900 text-center sm:text-left">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-xl font-black tracking-tight text-blue-500">PLUMBIFY CRM</div>
          <div className="flex gap-8 text-xs text-slate-500 font-medium">
            <span>© 2026 Plumbify Inc.</span>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
