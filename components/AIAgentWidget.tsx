"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { 
  Bot, 
  Volume2, 
  VolumeX, 
  Send, 
  X, 
  Languages, 
  Phone, 
  Calendar, 
  CreditCard, 
  Sparkles, 
  CheckCircle, 
  ArrowRight,
  Loader2,
  Mic
} from "lucide-react";

// Localized greetings and agent responses
const LOCALIZATION = {
  en: {
    greeting: "Hi, I'm Plumbify's AI Sales Agent! Need a quick demo? Let's chat!",
    subGreeting: "Online 24/7 • Speaks 4 Languages",
    inputPlaceholder: "Ask about pricing, features, or book a demo...",
    quickReplies: [
      { text: "📞 Run Missed-Call Demo", type: "demo_missed" },
      { text: "💰 How much does it cost?", type: "pricing" },
      { text: "📅 Book a 1-on-1 Call", type: "book" }
    ],
    agentIntro: "Hello! I am your Plumbify AI Sales Representative. I help plumbing business owners capture missed calls, schedule technicians automatically, and handle payments. Would you like me to demo our Missed-Call Text-Back feature, or show you our pricing?",
    pricingInfo: "Plumbify has 3 simple plans:\n1. Starter ($197/mo): Missed-Call Text-Back, smart calendar, and mobile payments.\n2. Growth ($397/mo): Adds AI recruiting and database reactivation.\n3. Custom: For 20+ truck fleets.\nWhich plan matches your current company size?",
    demoStarted: "Launching the Missed-Call Text-Back Simulator. Look at the phone screen on the left! It shows how a customer gets an instant automated SMS if you miss their call. Go ahead and try texting back by filling out the form!",
    bookPrompt: "I'd love to lock in a slot for you to speak with one of our business growth experts. Please fill out the lead form on the left pane, and I will sync your info directly to our dispatch calendar!",
    leadSuccess: "Awesome! Your details have been secured. We have registered you in our system. An expert will reach out to you shortly, or you can check our checkout links in the pricing section!",
    errorText: "Sorry, I ran into a scheduling error. Please try again or contact support.",
    buttonSubmit: "Secure Demo & Sync Lead"
  },
  "zh-TW": {
    greeting: "您好！我是 Plumbify 的 AI 銷售代理。想了解我們的功能嗎？我們聊聊吧！",
    subGreeting: "24小時在線 • 支援4種語言",
    inputPlaceholder: "詢問價格、功能或預約演示...",
    quickReplies: [
      { text: "📞 演示漏電短信回撥", type: "demo_missed" },
      { text: "💰 軟體方案價格多少？", type: "pricing" },
      { text: "📅 預約 1對1 產品演示", type: "book" }
    ],
    agentIntro: "您好！我是 Plumbify AI 銷售代表。我能為水電工程行提供 24/7 自動漏電短信回撥、AI 自動派單排程以及行動接單收款。您想先體驗我們的『漏電短信回撥』功能，還是了解方案價格？",
    pricingInfo: "Plumbify 提供三種簡單的方案：\n1. 基礎版 (Starter - $197/月)：包含漏電簡訊自動回撥、智慧行事曆與手機刷卡收款。\n2. 專業成長版 (Growth - $397/月)：增加 AI 招募助理與客戶資料活化。\n3. 企業客製版 (Custom)：適合擁有 20 輛以上工程車的車隊。\n請問您的公司目前大約有多少位師傅呢？",
    demoStarted: "正在為您啟動漏電短信回撥模擬器。請看左邊的手機螢幕！它展示了當客戶撥打電話卻無人接聽時，Plumbify 如何在 5 秒內自動發送簡訊挽回客戶。請填寫左側表單來體驗回撥簡訊！",
    bookPrompt: "我非常樂意為您安排與我們的成長專家進行 1 對 1 演示。請填寫左側表單，我將直接把您的資訊同步到我們的 GoHighLevel 系統中！",
    leadSuccess: "太棒了！您的資訊已成功送出。我們已經將您登錄在系統中，並會安排專員盡快與您聯繫。您也可以在網站的價格欄位直接啟動試用！",
    errorText: "抱歉，送出時發生一些問題，請稍後再試或直接聯繫我們的客服。",
    buttonSubmit: "送出並預約演示"
  },
  es: {
    greeting: "¡Hola! Soy la Agente de Ventas de Plumbify. ¿Quieres una demostración rápida?",
    subGreeting: "Activo 24/7 • Habla 4 Idiomas",
    inputPlaceholder: "Pregunta por precios, funciones o agenda una demo...",
    quickReplies: [
      { text: "📞 Demo de Llamada Perdida", type: "demo_missed" },
      { text: "💰 ¿Cuánto cuesta?", type: "pricing" },
      { text: "📅 Reservar una reunión", type: "book" }
    ],
    agentIntro: "¡Hola! Soy su agente de ventas de Plumbify. Ayudo a los propietarios de empresas de plomería a recuperar llamadas perdidas, programar técnicos y cobrar. ¿Le gustaría ver una demostración de Llamada Perdida o ver los precios?",
    pricingInfo: "Plumbify tiene 3 planes:\n1. Starter ($197/mes): Mensaje de llamada perdida, calendario inteligente y pagos móviles.\n2. Growth ($397/mes): Añade asistente de reclutamiento IA.\n3. Personalizado.\n¿Cuál se adapta mejor a su negocio?",
    demoStarted: "Iniciando el simulador de llamada perdida. ¡Mire la pantalla del teléfono a la izquierda! Muestra cómo un cliente recibe un SMS instantáneo cuando no contesta. ¡Complete el formulario para probarlo!",
    bookPrompt: "Me encantaría agendar una llamada de asesoría. Complete el formulario a la izquierda para sincronizar sus datos directamente en nuestro calendario.",
    leadSuccess: "¡Excelente! Sus datos han sido guardados. Un especialista se pondrá en contacto con usted pronto.",
    errorText: "Lo siento, ocurrió un error. Por favor intente de nuevo.",
    buttonSubmit: "Enviar y Registrarse"
  },
  fr: {
    greeting: "Bonjour! Je suis l'agent commercial IA de Plumbify. Besoin d'une démo?",
    subGreeting: "En ligne 24/7 • Parle 4 Langues",
    inputPlaceholder: "Posez vos questions sur les prix, fonctions...",
    quickReplies: [
      { text: "📞 Démo Appel Manqué", type: "demo_missed" },
      { text: "💰 Quel est le prix?", type: "pricing" },
      { text: "📅 Réserver un rendez-vous", type: "book" }
    ],
    agentIntro: "Bonjour! Je suis votre agent commercial IA Plumbify. J'aide les plombiers à capturer les appels manqués, planifier les techniciens et collecter les paiements. Voulez-vous voir la démo ou les tarifs?",
    pricingInfo: "Plumbify propose 3 plans:\n1. Starter (197$/mois)\n2. Growth (397$/mois)\n3. Custom.\nQuel plan vous intéresse?",
    demoStarted: "Lancement du simulateur d'appel manqué. Regardez le téléphone à gauche! Il montre comment le client reçoit un SMS automatisé. Remplissez le formulaire à gauche pour tester!",
    bookPrompt: "Je serais ravie de planifier un rendez-vous. Veuillez remplir le formulaire à gauche pour vous enregistrer.",
    leadSuccess: "Parfait! Vos informations ont été enregistrées. Un spécialiste va vous contacter.",
    errorText: "Désolé, une erreur est survenue.",
    buttonSubmit: "S'enregistrer"
  }
};

interface Message {
  sender: "user" | "agent";
  text: string;
  timestamp: string;
}

export default function AIAgentWidget({ isEmbedPage = false }: { isEmbedPage?: boolean }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [language, setLanguage] = useState<"en" | "zh-TW" | "es" | "fr">("en");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Hide the global layout widget on the embed page to prevent double rendering
  if (!isEmbedPage && pathname === "/widget-embed") {
    return null;
  }

  // Live Demo Visual States
  const [demoState, setDemoState] = useState<"welcome" | "missed_call" | "calendar" | "invoice" | "lead_form">("welcome");
  
  // Simulated Phone / Visual Screens Inside Left Pane
  const [phoneStep, setPhoneStep] = useState(0);
  const [phoneMessages, setPhoneMessages] = useState<Array<{ sender: "ai" | "user"; text: string }>>([]);

  // Lead Form State
  const [leadForm, setLeadForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  const t = LOCALIZATION[language];

  // Initialize Speech synthesis voice
  const speakText = (text: string) => {
    if (isMuted || typeof window === "undefined" || !window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to match selected language voice
    const voices = window.speechSynthesis.getVoices();
    let langCode = "en-US";
    if (language === "zh-TW") langCode = "zh-TW";
    else if (language === "es") langCode = "es-ES";
    else if (language === "fr") langCode = "fr-FR";

    utterance.lang = langCode;

    // Filter voices matching the target language
    const langVoices = voices.filter(voice => 
      voice.lang.startsWith(langCode) || 
      voice.lang.replace('_', '-').startsWith(langCode)
    );

    // Prioritize natural-sounding neural voices depending on current language
    let priorities: string[] = [];
    if (language === "zh-TW") {
      priorities = ["mei-jia", "sin-ji", "tingting", "yating", "google", "microsoft", "premium"];
    } else if (language === "en") {
      priorities = ["google", "samantha", "microsoft", "natural", "neural", "premium"];
    } else if (language === "es") {
      priorities = ["google", "monica", "microsoft", "premium", "natural"];
    } else if (language === "fr") {
      priorities = ["google", "thomas", "microsoft", "premium", "natural"];
    }

    // Select the best voice matching our priority keywords
    let selectedVoice = null;
    for (const keyword of priorities) {
      selectedVoice = langVoices.find(voice => voice.name.toLowerCase().includes(keyword));
      if (selectedVoice) break;
    }

    // Fallback to first available voice for the target language
    if (!selectedVoice && langVoices.length > 0) {
      selectedVoice = langVoices[0];
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    // Slow down speed slightly for premium, professional cadence
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Pre-load voices on component mount to avoid empty voice list latency
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      if ("onvoiceschanged" in window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }
  }, []);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle open/close
  const toggleWidget = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    // Broadcast resizing state to GHL parent window if running inside iframe
    if (typeof window !== "undefined" && window.parent) {
      window.parent.postMessage({ type: "plumbify-widget-state", isOpen: nextState }, "*");
    }

    if (nextState) {
      setShowNotification(false);
      // Greet user on first expand
      if (messages.length === 0) {
        setIsTyping(true);
        setTimeout(() => {
          setMessages([
            {
              sender: "agent",
              text: t.agentIntro,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            }
          ]);
          setIsTyping(false);
          speakText(t.agentIntro);
        }, 800);
      }
    } else {
      // Mute voice if widget closed
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  };

  // Sync speak when language changes
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      const lastAgentMsg = [...messages].reverse().find(m => m.sender === "agent");
      if (lastAgentMsg) {
        // Translate standard intros if text matches
        let speech = lastAgentMsg.text;
        if (speech === LOCALIZATION.en.agentIntro || speech === LOCALIZATION["zh-TW"].agentIntro || speech === LOCALIZATION.es.agentIntro || speech === LOCALIZATION.fr.agentIntro) {
          speech = t.agentIntro;
        } else if (speech === LOCALIZATION.en.pricingInfo || speech === LOCALIZATION["zh-TW"].pricingInfo || speech === LOCALIZATION.es.pricingInfo || speech === LOCALIZATION.fr.pricingInfo) {
          speech = t.pricingInfo;
        }
        
        // Update the last message to the new language translation if it is a template
        setMessages(prev => {
          return prev.map(m => {
            if (m.sender === "agent") {
              if (m.text === LOCALIZATION.en.agentIntro || m.text === LOCALIZATION["zh-TW"].agentIntro || m.text === LOCALIZATION.es.agentIntro || m.text === LOCALIZATION.fr.agentIntro) {
                return { ...m, text: t.agentIntro };
              }
              if (m.text === LOCALIZATION.en.pricingInfo || m.text === LOCALIZATION["zh-TW"].pricingInfo || m.text === LOCALIZATION.es.pricingInfo || m.text === LOCALIZATION.fr.pricingInfo) {
                return { ...m, text: t.pricingInfo };
              }
            }
            return m;
          });
        });
        
        speakText(speech);
      }
    }
  }, [language]);

  // Run Missed-Call Animation demo sequence in left panel
  const startMissedCallDemo = () => {
    setDemoState("missed_call");
    setPhoneStep(1);
    setPhoneMessages([]);

    setTimeout(() => {
      // Typings
      setPhoneStep(2);
      setPhoneMessages([{ sender: "ai", text: language === "zh-TW" ? "您好，這裡是 Plumbify！很抱歉我們剛才沒接到您的來電。請問您遇到水管緊急狀況嗎？" : "Hi, this is Plumbify! Sorry we missed your call. Do you have a plumbing emergency?" }]);
      
      setTimeout(() => {
        setPhoneMessages(prev => [...prev, { sender: "user", text: language === "zh-TW" ? "對！我家地下室水管爆了，水流得到處都是！" : "Yes! A pipe just burst in my basement, water everywhere!" }]);
        
        setTimeout(() => {
          setPhoneMessages(prev => [...prev, { sender: "ai", text: language === "zh-TW" ? "天啊，這聽起來很緊急。我們能為您安排最專業的師傅在今天下午2點上門。可以請您提供地址來確認預約嗎？" : "I'm sorry to hear that. We can have a master plumber at your door by 2 PM today. Please confirm your address?" }]);
          setPhoneStep(3);
        }, 2000);
      }, 2000);
    }, 2000);
  };

  // Handle User Input Submit
  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // AI thinking & speech response simulator
    setTimeout(() => {
      let responseText = "";
      const textLower = textToSend.toLowerCase();

      if (textLower.includes("demo") || textLower.includes("演示") || textLower.includes("漏") || textLower.includes("missed") || textLower.includes("llamada")) {
        responseText = t.demoStarted;
        startMissedCallDemo();
      } else if (textLower.includes("price") || textLower.includes("cost") || textLower.includes("方案") || textLower.includes("錢") || textLower.includes("cuesta") || textLower.includes("tarif")) {
        responseText = t.pricingInfo;
        setDemoState("invoice");
      } else if (textLower.includes("book") || textLower.includes("calendar") || textLower.includes("1对1") || textLower.includes("預約") || textLower.includes("reunión") || textLower.includes("rendez")) {
        responseText = t.bookPrompt;
        setDemoState("lead_form");
      } else {
        // Fallback standard conversational answer
        responseText = language === "zh-TW" 
          ? "了解！我們提供漏電簡訊回撥、AI 智慧排程與手機收款。您可以輸入『演示』來啟動漏電簡訊模擬，或輸入『價格』來查看我們的三種方案。"
          : "Understood! Plumbify automates missed calls, booking, and invoices. Type 'demo' to launch our missed-call text simulator, 'price' to view cost details, or 'book' to schedule a call with us.";
      }

      const agentMsg: Message = {
        sender: "agent",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
      speakText(responseText);
    }, 1200);
  };

  // Submit Lead Form to GoHighLevel API
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.firstName || !leadForm.lastName || !leadForm.phone || !leadForm.email) {
      setSubmitError(language === "zh-TW" ? "請填寫所有必要欄位" : "Please fill out all required fields");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/ghl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName: leadForm.firstName,
          lastName: leadForm.lastName,
          email: leadForm.email,
          phone: leadForm.phone,
          company: leadForm.company
        })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "GHL Submission failed");
      }

      setSubmitSuccess(true);
      setDemoState("calendar"); // Switch left visual to calendar slots booking success
      setIsTyping(true);

      setTimeout(() => {
        const successMsg: Message = {
          sender: "agent",
          text: t.leadSuccess,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        setMessages(prev => [...prev, successMsg]);
        setIsTyping(false);
        speakText(t.leadSuccess);
      }, 1000);

    } catch (err: any) {
      console.error(err);
      setSubmitError(t.errorText);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={isEmbedPage ? "w-full h-full absolute inset-0 overflow-hidden font-sans" : "fixed bottom-6 right-6 z-50 font-sans"}>
      
      {/* 1. COLLAPSED FLOATING AGENT BALL */}
      {!isOpen && (
        <div className={isEmbedPage ? "w-full h-full flex items-center justify-center" : "flex flex-col items-end gap-3"}>
          
          {/* Notification bubble/tooltip */}
          {showNotification && !isEmbedPage && (
            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 max-w-xs animate-bounce relative flex items-start gap-3">
              <div className="absolute top-2 right-2 text-slate-500 hover:text-white cursor-pointer" onClick={() => setShowNotification(false)}>
                <X size={14} />
              </div>
              <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center shrink-0 border border-blue-400">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight pr-4">{t.greeting}</p>
                <p className="text-[10px] text-slate-400 mt-1">{t.subGreeting}</p>
              </div>
            </div>
          )}

          {/* Trigger button */}
          <button 
            onClick={toggleWidget}
            className="group h-16 w-16 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-2xl flex items-center justify-center relative transition-transform duration-300 hover:scale-105 active:scale-95 border-2 border-white/20"
          >
            {/* Pulsing indicator */}
            <span className="absolute top-0.5 right-0.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
            </span>

            <Bot size={28} className="transition-transform group-hover:rotate-12 duration-300" />
          </button>
        </div>
      )}

      {/* 2. EXPANDED NAOMA-STYLE SPLIT-SCREEN PANEL */}
      {isOpen && (
        <div className={
          isEmbedPage 
            ? "bg-slate-950/95 backdrop-blur-md text-white border border-slate-800 w-full h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 rounded-none lg:rounded-[2rem]"
            : "bg-slate-950/95 backdrop-blur-md text-white rounded-[2rem] border border-slate-800 shadow-2xl w-[92vw] sm:w-[500px] lg:w-[960px] h-[86vh] lg:h-[650px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
        }>
          
          {/* Header */}
          <div className="h-16 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Bot size={22} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                  Plumbify AI Sales Agent
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">{t.subGreeting}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
                <Languages size={14} className="text-blue-400" />
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="bg-transparent text-[10px] font-bold text-slate-300 outline-none border-none cursor-pointer pr-1"
                >
                  <option value="en" className="bg-slate-900 text-white">EN (US)</option>
                  <option value="zh-TW" className="bg-slate-900 text-white">繁中 (TW)</option>
                  <option value="es" className="bg-slate-900 text-white">ES (ES)</option>
                  <option value="fr" className="bg-slate-900 text-white">FR (FR)</option>
                </select>
              </div>

              {/* Mute button */}
              <button 
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (!isMuted && typeof window !== "undefined" && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className="text-slate-400 hover:text-white transition-colors"
                title={isMuted ? "Unmute Voice" : "Mute Voice"}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="text-blue-400" />}
              </button>

              {/* Close */}
              <button onClick={toggleWidget} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Body Content: Split Screen layout */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* LEFT PANE: LIVE PRODUCT DEMO SIMULATOR (40% width on medium/large screens) */}
            <div className="md:w-[380px] shrink-0 border-b md:border-b-0 md:border-r border-slate-800 bg-[#060a13] p-6 flex flex-col justify-center items-center overflow-y-auto min-h-[220px] md:min-h-0">
              
              {/* Scenario 1: Welcome & Landing Visual */}
              {demoState === "welcome" && (
                <div className="text-center space-y-6 max-w-sm animate-in fade-in duration-500">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
                    <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white border-4 border-slate-800">
                      <Sparkles size={36} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-black tracking-tight text-white">Interactive Sales Sandbox</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {language === "zh-TW" 
                        ? "點擊右側的按鈕或直接輸入問題。AI 代理將一邊回答，一邊操作左側的產品面板為您演示功能！"
                        : "Click the buttons on the right or type a message. The AI agent will explain Plumbify while demonstrating features live on this screen."}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <div className="flex items-center gap-3 text-left p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <Phone size={16} className="text-blue-400 shrink-0" />
                      <div>
                        <p className="text-[11px] font-bold">1. Missed-Call Auto Text-Back</p>
                        <p className="text-[9px] text-slate-500">Turn missed calls into booked tickets automatically.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-left p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <Calendar size={16} className="text-cyan-400 shrink-0" />
                      <div>
                        <p className="text-[11px] font-bold">2. Smart GHL dispatch Board</p>
                        <p className="text-[9px] text-slate-500">Auto dispatch technicians with smart scheduling routing.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Scenario 2: Virtual Phone Missed Call Demo */}
              {demoState === "missed_call" && (
                <div className="w-56 h-[380px] bg-slate-900 rounded-[2.5rem] border-[5px] border-slate-800 shadow-2xl relative flex flex-col overflow-hidden animate-in zoom-in duration-300">
                  {/* Notch & Camera */}
                  <div className="h-5 w-full flex justify-between px-6 pt-3 items-center">
                    <span className="text-[9px] font-bold text-white">9:41 AM</span>
                    <div className="w-16 h-3 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-1.5 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-900 ml-auto mr-1.5"></div>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-400">5G</span>
                  </div>

                  <div className="flex-1 p-3 flex flex-col justify-start">
                    {phoneStep === 1 && (
                      <div className="flex flex-col items-center justify-center mt-12 animate-in slide-in-from-top duration-500">
                        <div className="h-12 w-12 rounded-full bg-red-500 flex items-center justify-center animate-pulse mb-3">
                          <Phone size={20} className="text-white fill-current" />
                        </div>
                        <p className="text-xs font-bold">{language === "zh-TW" ? "撥號中..." : "Inbound Call..."}</p>
                        <p className="text-[9px] text-slate-400 mt-1">John (Residential Customer)</p>
                        <span className="text-[9px] bg-red-950 text-red-400 border border-red-900/50 px-2 py-0.5 rounded-full mt-4 font-bold uppercase tracking-wider">Missed Call</span>
                      </div>
                    )}

                    {phoneStep >= 2 && (
                      <div className="flex-1 flex flex-col gap-2.5 pt-4">
                        <div className="text-[8px] text-slate-500 text-center font-bold uppercase tracking-widest">Today 9:42 AM</div>
                        {phoneMessages.map((msg, i) => (
                          <div 
                            key={i} 
                            className={`max-w-[85%] p-2.5 rounded-2xl text-[10px] leading-snug font-medium animate-in slide-in-from-bottom-2 duration-300 ${
                              msg.sender === "ai" 
                                ? "bg-blue-600 text-white self-start rounded-bl-none" 
                                : "bg-slate-800 text-slate-200 self-end rounded-br-none"
                            }`}
                          >
                            {msg.text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Home Indicator */}
                  <div className="h-1 w-16 bg-white/20 rounded-full mx-auto mb-1.5"></div>
                </div>
              )}

              {/* Scenario 3: AI Calendar Booking Slots */}
              {demoState === "calendar" && (
                <div className="w-full text-center space-y-4 animate-in fade-in duration-500">
                  <div className="h-12 w-12 rounded-full bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto">
                    <Calendar size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">GoHighLevel Dispatch Board</h4>
                    <p className="text-[10px] text-slate-500">AI Technician Scheduling Routing</p>
                  </div>
                  
                  {/* Calendar Widget Preview */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-left space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-[10px] font-bold text-slate-300">Available Slots Today</span>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-black">ACTIVE</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"].map((time, idx) => (
                        <div key={idx} className={`border p-2 rounded-xl text-center text-[10px] font-bold cursor-pointer transition-colors ${
                          idx === 2 
                            ? "bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.1)]" 
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}>
                          {time} {idx === 2 && "👉"}
                        </div>
                      ))}
                    </div>
                    {submitSuccess && (
                      <div className="bg-emerald-500/10 border border-emerald-500/25 p-2.5 rounded-xl flex items-center gap-2 text-[9px] text-emerald-400">
                        <CheckCircle size={14} className="shrink-0 animate-pulse" />
                        <span>Lead Registered! Calendar Sync Completed.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Scenario 4: Pricing Invoice Generator */}
              {demoState === "invoice" && (
                <div className="w-full space-y-4 animate-in fade-in duration-500">
                  <div className="h-12 w-12 rounded-full bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
                    <CreditCard size={24} />
                  </div>
                  <div className="text-center space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">Instant Mobile Invoice</h4>
                    <p className="text-[10px] text-slate-500">Plumbify Tap-to-Pay billing mockup</p>
                  </div>
                  
                  {/* Mock Invoice sheet */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-left text-[11px] font-medium space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="font-bold text-slate-300">Invoice #1042</span>
                      <span className="text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded font-black">SENT</span>
                    </div>
                    <div className="space-y-1.5 text-[10px] text-slate-400">
                      <div className="flex justify-between">
                        <span>Drain Camera Inspection</span>
                        <span className="font-bold text-white">$149.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Emergency Callout (Waived)</span>
                        <span className="font-bold text-slate-500">-$99.00</span>
                      </div>
                      <div className="flex justify-between border-t border-dashed border-slate-800 pt-2 text-xs font-bold text-white">
                        <span>Total Due</span>
                        <span className="text-blue-400">$149.00</span>
                      </div>
                    </div>
                    <div className="bg-[#0b1329] border border-blue-500/10 p-2.5 rounded-xl text-[9px] text-slate-400">
                      Tap-to-Pay is enabled on all client tiers. Master plumbers can take credit cards simply by tapping their mobile phone.
                    </div>
                  </div>
                </div>
              )}

              {/* Scenario 5: GHL Lead Qualification form */}
              {demoState === "lead_form" && (
                <div className="w-full space-y-4 animate-in fade-in duration-300">
                  <div className="text-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">Qualify & Schedule Demo</h4>
                    <p className="text-[10px] text-slate-500">Fill details to register as a VIP Lead</p>
                  </div>

                  <form onSubmit={handleLeadSubmit} className="space-y-2 text-left">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-bold text-slate-400">First Name *</label>
                        <input 
                          type="text" 
                          required
                          value={leadForm.firstName}
                          onChange={(e) => setLeadForm({...leadForm, firstName: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500" 
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-400">Last Name *</label>
                        <input 
                          type="text" 
                          required
                          value={leadForm.lastName}
                          onChange={(e) => setLeadForm({...leadForm, lastName: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400">Email Address *</label>
                      <input 
                        type="email" 
                        required
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400">Phone Number *</label>
                      <input 
                        type="tel" 
                        required
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400">Company Name (Optional)</label>
                      <input 
                        type="text" 
                        value={leadForm.company}
                        onChange={(e) => setLeadForm({...leadForm, company: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500" 
                      />
                    </div>

                    {submitError && (
                      <p className="text-[10px] font-semibold text-red-500">{submitError}</p>
                    )}

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-10 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-slate-400 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 mt-3"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Syncing...</span>
                        </>
                      ) : (
                        <>
                          <span>{t.buttonSubmit}</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

            </div>

            {/* RIGHT PANE: CONVERSATIONAL CHAT DIALOGUE */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
              
              {/* Message Feed Viewport */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex flex-col max-w-[85%] ${
                      msg.sender === "user" ? "ml-auto items-end animate-in slide-in-from-right-3 duration-250" : "mr-auto items-start animate-in slide-in-from-left-3 duration-250"
                    }`}
                  >
                    <div 
                      className={`p-3.5 rounded-2xl text-[11px] leading-relaxed font-medium ${
                        msg.sender === "user" 
                          ? "bg-gradient-to-tr from-blue-600 to-cyan-500 text-white rounded-tr-none shadow-[0_4px_12px_rgba(0,82,255,0.15)]" 
                          : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
                      }`}
                    >
                      {msg.text.split("\n").map((line, lIdx) => (
                        <p key={lIdx}>{line}</p>
                      ))}
                    </div>
                    <span className="text-[8px] text-slate-600 mt-1 px-1 font-semibold">{msg.timestamp}</span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800 w-16 mr-auto rounded-tl-none">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce"></div>
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></div>
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Preset Quick Replies */}
              <div className="px-6 py-2 bg-slate-900/40 border-t border-slate-900/60 flex flex-wrap gap-2 shrink-0">
                {t.quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(reply.text)}
                    className="bg-slate-900 border border-slate-800 hover:border-blue-500 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all"
                  >
                    {reply.text}
                  </button>
                ))}
              </div>

              {/* Chat Input form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputText);
                }} 
                className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center gap-3 shrink-0"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t.inputPlaceholder}
                  className="flex-1 h-11 bg-slate-950 border border-slate-800 rounded-xl px-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
                
                {/* Simulated Microphone button (pure visual click) */}
                <button
                  type="button"
                  onClick={() => {
                    // Start basic Web Speech API recognition if supported, otherwise warn
                    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
                      const Speech = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                      const recognition = new Speech();
                      recognition.lang = language === "zh-TW" ? "zh-TW" : language === "es" ? "es-ES" : language === "fr" ? "fr-FR" : "en-US";
                      recognition.interimResults = false;
                      recognition.maxAlternatives = 1;
                      
                      recognition.onstart = () => {
                        setInputText("Listening...");
                      };
                      recognition.onresult = (event: any) => {
                        const transcript = event.results[0][0].transcript;
                        setInputText(transcript);
                      };
                      recognition.onerror = () => {
                        setInputText("");
                      };
                      recognition.start();
                    } else {
                      alert("Web Speech API voice recognition is not supported in this browser.");
                    }
                  }}
                  className="h-11 w-11 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center justify-center text-slate-400 hover:text-white"
                  title="Speech-to-Text Voice Input"
                >
                  <Mic size={16} />
                </button>

                <button
                  type="submit"
                  className="h-11 w-11 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,82,255,0.25)]"
                >
                  <Send size={16} />
                </button>
              </form>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
