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
  Sliders,
  Sparkles, 
  CheckCircle, 
  ArrowRight,
  Loader2,
  Mic,
  Users,
  MessageSquare,
  Check,
  UserCheck
} from "lucide-react";

// Localized script for the self-serve product walkthrough
const LOCALIZATION = {
  en: {
    greeting: "Hi, I'm Plumbify's AI Sales Agent! Take an instant self-serve demo now.",
    subGreeting: "Online 24/7 • Speaks 4 Languages • No Video Call Needed",
    inputPlaceholder: "Ask about pricing, features, or choose a demo above...",
    agentIntro: "Welcome to Plumbify! I am your AI Sales Agent. My job is to give you a complete product demo right now—so you can see exactly how Plumbify runs your plumbing shop 24/7 without needing a scheduling hassle or a video sales call. \n\nPlease choose one of our core features above to see it in action!",
    
    // Feature 1: Missed Call
    smsIntro: "Let's look at Missed-Call Auto Text-Back. 70% of customers call the next plumbing company if you don't answer. Plumbify monitors your phone, detects missed calls, and immediately texts the lead. Look at the smartphone simulation on the left. In 30 seconds, it captures the lead and books the job automatically while you are asleep or on another call!",
    
    // Feature 2: Calendar
    calendarIntro: "Here is the Smart GHL Dispatch Calendar. Once a customer books via SMS, Plumbify automatically schedules the job, maps the route, and assigns the nearest technician. Look at the dispatch board on the left. It updates instantly, letting you manage your entire fleet and schedule without lifting a finger.",
    
    // Feature 3: Tap to Pay
    invoiceIntro: "This is our Mobile Invoice & Tap-to-Pay billing feature. When a job is completed, the technician creates an invoice in 3 seconds. The customer simply taps their credit card against the tech's mobile phone to pay instantly—no credit card readers needed. Look at the mobile receipt payment animation on the left!",
    
// Feature 4: AI Recruiting
    recruitIntro: "Plumber recruitment is a major bottleneck. Our AI Recruiting Assistant (enabled in Professional and Enterprise tiers) scans job boards, text-screens plumbing applicants, qualifies license types, and books interviews with Master Plumbers. Look at the hiring pipeline simulation on the left. It saves you 15+ hours of recruiting work every week!",
    
    pricingInfo: "Plumbify has 3 simple plans:\n1. Starter ($197/mo): Missed-Call Text-Back, smart calendar, and mobile payments.\n2. Growth ($397/mo): Adds AI recruiting and database reactivation.\n3. Custom: For 20+ truck fleets.\n\nYou can click the plan buttons below to start your 14-day free trial instantly!",
    leadPrompt: "If you'd like a representative to call you to answer specific custom business questions, please fill out the lead form on the left pane, and I will register you as a VIP Lead in our system.",
    leadSuccess: "Excellent! Your details are registered in our GHL database. A Plumbify representative will follow up. You can close this sandbox or check out our pricing tiers below!",
    errorText: "Sorry, I ran into a scheduling error. Please try again or contact support.",
    buttonSubmit: "Register as VIP Lead",
    
    // Tour walkthrough specific strings
    startTour: "Start 3-Min Auto Tour ➔",
    nextStep: "Next Feature ➔",
    prevStep: "⬅ Previous",
    skipTour: "Skip Tour",
    finishTour: "Complete Tour 🎉",
    tourProgress: "Demo Step {step} of 5",
    voiceSettings: "Voice Settings",
    voiceSpeed: "Speed",
    voicePitch: "Pitch",
    voiceSelect: "Voice Engine"
  },
  "zh-TW": {
    greeting: "您好！我是 Plumbify AI 銷售代理。點擊上方即可直接看功能演示，免預約！",
    subGreeting: "24小時在線 • 支援4種語言 • 免視訊通話可以直接看演示",
    inputPlaceholder: "詢問價格、功能，或直接點選上方按鈕查看功能演示...",
    agentIntro: "歡迎來到 Plumbify！我是您的 AI 銷售代表。我的任務是為您提供即時的產品演示，讓您直接明白 Plumbify 如何 24/7 自動打理您的水電行，省去預約和視訊通話的麻煩。\n\n請直接點擊上方的四大核心功能按鈕，我會一項一項操作給您看！",
    
    // Feature 1: Missed Call
    smsIntro: "首先為您展示『漏電簡訊自動回撥（Missed-Call Auto SMS）』。70% 的客戶如果打電話無人接聽，會立刻改撥別家。Plumbify 會偵測未接來電，並在 5 秒內自動發送簡訊挽回客戶。請看左側的智慧型手機模擬畫面。在 30 秒內，AI 自動溝通、報價並完成預約，讓您在睡覺或忙碌時也能自動接單！",
    
    // Feature 2: Calendar
    calendarIntro: "這是『智慧派單行事曆（Smart GHL Dispatch Calendar）』。當客戶透過簡訊預約成功後，系統會自動在 GHL 後台排程、優化派單路線，並指派給離客戶最近的師傅。請看左側的派單看板模擬。師傅名稱、時間與派單路線會自動更新，完全不需要手動排班！",
    
    // Feature 3: Tap to Pay
    invoiceIntro: "這是『手機感應收款與發票（Tap-to-Pay & Invoice）』。師傅完工後，可在手機上 3 秒生成數位發票。客戶只需將信用卡在師傅的手機背面輕碰，即可完成付款，免用任何額外刷卡機！請看左側手機發票的付款感應動畫演示。",
    
    // Feature 4: AI Recruiting
    recruitIntro: "招募水電師傅通常很令人頭痛。我們的『AI 招募助理』（在專業版與企業版啟用）會自動篩選招募管道、發送簡訊面試應徵者、核對證照類別，並將合適的人選直接約入您的面試行事曆。請看左側的招募漏斗模擬，每週能為您省下 15 小時以上的面試篩選時間！",
    
    pricingInfo: "Plumbify 提供三種簡單的方案：\n1. 基礎版 (Starter - $197/月)：包含簡訊回撥、智慧派單與手機感應收款。\n2. 專業成長版 (Growth - $397/月)：增加 AI 招募助理與客戶資料活化。\n3. 企業客製版 (Custom)：適合 20 輛工程車以上的車隊。\n\n您可以點擊下方的按鈕，立即啟動您的 14 天免費試用！",
    leadPrompt: "如果您想與專人直接聯繫解答特殊業務問題，請填寫左側表單，我會立刻將您註冊為 VIP 客戶並同步至 GHL 系統中。",
    leadSuccess: "太棒了！您的資訊已成功登錄至我們的 CRM 系統中。專員會盡快與您聯繫。您可以直接點擊下方按鈕啟動免費試用！",
    errorText: "抱歉，送出時發生一些問題，請稍後再試或直接聯繫我們的客服。",
    buttonSubmit: "送出並預約專人回電",
    
    // Tour walkthrough specific strings
    startTour: "開始 3 分鐘自動演示 ➔",
    nextStep: "下一項功能 ➔",
    prevStep: "⬅ 上一步",
    skipTour: "跳過演示",
    finishTour: "完成演示 🎉",
    tourProgress: "演示第 {step} 步 (共 5 步)",
    voiceSettings: "語音設定",
    voiceSpeed: "語速",
    voicePitch: "音調",
    voiceSelect: "語音引擎"
  },
  es: {
    greeting: "¡Hola! Soy el Agente IA de Plumbify. Ver una demo instantánea aquí.",
    subGreeting: "Activo 24/7 • Habla 4 Idiomas • Sin necesidad de videollamada",
    inputPlaceholder: "Pregunta por precios, funciones o selecciona una demo...",
    agentIntro: "¡Bienvenido a Plumbify! Soy su Agente de Ventas IA. Estoy aquí para darle una demostración completa del producto de inmediato, para que pueda ver exactamente cómo funciona Plumbify sin necesidad de programar una videollamada.\n\n¡Por favor, elija una de nuestras funciones arriba para verla en acción!",
    smsIntro: "Veamos el Mensaje de Llamada Perdida. El 70% de los clientes llama al siguiente plomero si no respondes. Plumbify detecta llamadas perdidas y envía un SMS de inmediato. ¡Mira la simulación del teléfono a la izquierda!",
    calendarIntro: "Aquí está el Calendario Inteligente de GHL. Una vez que un cliente reserva por SMS, Plumbify programa el trabajo automáticamente y asigna al técnico más cercano. ¡Mira la pantalla a la izquierda!",
    invoiceIntro: "Esta es nuestra función de Factura Móvil y Pago con Tarjeta. El cliente simplemente acerca su tarjeta de crédito al teléfono móvil del técnico para pagar al instante. ¡Mira la animación a la izquierda!",
    recruitIntro: "El Asistente de Reclutamiento IA escanea bolsas de trabajo, entrevista candidatos por SMS y programa entrevistas con plomeros calificados. ¡Mira el embudo a la izquierda!",
    pricingInfo: "Plumbify tiene 3 planes:\n1. Starter ($197/mes)\n2. Growth ($397/mes)\n3. Personalizado.\n¡Puede iniciar su prueba gratuita de 14 días a continuación!",
    leadPrompt: "Si desea que un representante lo llame, complete el formulario de cliente potencial a la izquierda.",
    leadSuccess: "¡Excelente! Sus datos han sido guardados. Un especialista se pondrá en contacto pronto.",
    errorText: "Lo siento, ocurrió un error.",
    buttonSubmit: "Registrarse como Lead VIP",
    
    // Tour walkthrough specific strings
    startTour: "Iniciar tour de 3 min ➔",
    nextStep: "Siguiente función ➔",
    prevStep: "⬅ Anterior",
    skipTour: "Omitir tour",
    finishTour: "Completar tour 🎉",
    tourProgress: "Paso {step} de 5",
    voiceSettings: "Ajustes de voz",
    voiceSpeed: "Velocidad",
    voicePitch: "Tono",
    voiceSelect: "Motor de voz"
  },
  fr: {
    greeting: "Bonjour! Je suis l'agent IA de Plumbify. Voir la démo immédiate.",
    subGreeting: "En ligne 24/7 • Parle 4 Langues • Pas besoin d'appel vidéo",
    inputPlaceholder: "Posez des questions sur les tarifs, les fonctionnalités...",
    agentIntro: "Bienvenue chez Plumbify! Je suis votre agent commercial IA. Je suis ici pour vous présenter notre produit immédiatement, afin que vous puissiez comprendre le fonctionnement de Plumbify sans appel vidéo.\n\nVeuillez choisir une fonctionnalité ci-dessus pour lancer la démo!",
    smsIntro: "Découvrez le SMS de rappel automatique. 70% des clients appellent un autre plombier si vous ne répondez pas. Plumbify envoie un SMS automatique. Regardez la simulation de smartphone à gauche!",
    calendarIntro: "Voici le planning intelligent GHL. Dès qu'un client réserve par SMS, Plumbify planifie le travail et l'attribue au technicien le plus proche. Regardez le tableau de planification à gauche!",
    invoiceIntro: "Voici la facturation mobile Tap-to-Pay. Le client tape sa carte de crédit sur le téléphone portable du technicien pour payer instantanément. Regardez l'animation à gauche!",
    recruitIntro: "L'assistant de recrutement IA analyse les CV, qualifie les candidats plombiers par SMS et fixe des entretiens. Regardez le pipeline de recrutement à gauche!",
    pricingInfo: "Plumbify propose 3 plans:\n1. Starter (197$/mois)\n2. Growth (397$/mois)\n3. Custom.\nLancez votre essai gratuit de 14 jours ci-dessous!",
    leadPrompt: "Si vous souhaitez être contacté par notre équipe, veuillez remplir le formulaire à gauche.",
    leadSuccess: "Vos informations ont été enregistrées avec succès.",
    errorText: "Une erreur est survenue.",
    buttonSubmit: "S'enregistrer",
    
    // Tour walkthrough specific strings
    startTour: "Démarrer le tour 3 min ➔",
    nextStep: "Suivant ➔",
    prevStep: "⬅ Précédent",
    skipTour: "Passer",
    finishTour: "Terminer le tour 🎉",
    tourProgress: "Étape {step} sur 5",
    voiceSettings: "Paramètres voix",
    voiceSpeed: "Vitesse",
    voicePitch: "Hauteur",
    voiceSelect: "Moteur de voix"
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

  // Active Demo State
  const [demoState, setDemoState] = useState<"welcome" | "missed_call" | "calendar" | "invoice" | "recruiting" | "lead_form">("welcome");
  
  // Walkthrough Tour State
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0); // 0: not started, 1: missed call, 2: calendar, 3: invoice, 4: recruiting, 5: pricing/lead

  // Speech Customization Settings (Option 2: Multilingual Speech Engine config)
  const [speechRate, setSpeechRate] = useState(0.88); // Default to a slightly slower, warmer human speaking rate
  const [speechPitch, setSpeechPitch] = useState(1.0); // Pitch
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>(""); 
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // To drive the dynamic audio waveform visualizer
  const [currentSubtitle, setCurrentSubtitle] = useState(""); // Captions text output

  // Dynamic Simulation Variables
  const [phoneStep, setPhoneStep] = useState(0);
  const [phoneMessages, setPhoneMessages] = useState<Array<{ sender: "ai" | "user"; text: string }>>([]);
  const [invoicePaid, setInvoicePaid] = useState(false);
  const [invoiceStep, setInvoiceStep] = useState(0); // 0: invoice ready, 1: tapping card, 2: paid

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

  // Hide the global layout widget on the embed page to prevent double rendering
  if (!isEmbedPage && pathname === "/widget-embed") {
    return null;
  }

  // Pre-load voices on component mount to avoid empty voice list latency and store them
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };
      loadVoices();
      if ("onvoiceschanged" in window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Initialize Speech synthesis voice with premium priorities
  const speakText = (text: string) => {
    setCurrentSubtitle(text);
    if (isMuted || typeof window === "undefined" || !window.speechSynthesis) {
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    let langCode = "en-US";
    if (language === "zh-TW") langCode = "zh-TW";
    else if (language === "es") langCode = "es-ES";
    else if (language === "fr") langCode = "fr-FR";

    utterance.lang = langCode;

    const langVoices = voices.filter(voice => 
      voice.lang.startsWith(langCode) || 
      voice.lang.replace('_', '-').startsWith(langCode)
    );

    let selectedVoice = null;

    // 1. Check if user selected a custom voice
    if (selectedVoiceName) {
      selectedVoice = voices.find(v => v.name === selectedVoiceName);
    }

    // 2. Otherwise fall back to priorities
    if (!selectedVoice) {
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

      for (const keyword of priorities) {
        selectedVoice = langVoices.find(voice => voice.name.toLowerCase().includes(keyword));
        if (selectedVoice) break;
      }
    }

    if (!selectedVoice && langVoices.length > 0) {
      selectedVoice = langVoices[0];
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

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
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  };

  // Translate templates on language change
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      if (isTourActive && tourStep >= 1 && tourStep <= 5) {
        let speech = "";
        if (tourStep === 1) speech = t.smsIntro;
        else if (tourStep === 2) speech = t.calendarIntro;
        else if (tourStep === 3) speech = t.invoiceIntro;
        else if (tourStep === 4) speech = t.recruitIntro;
        else if (tourStep === 5) speech = t.pricingInfo + "\n\n" + t.leadPrompt;
        
        const stepLabel = `[${t.tourProgress.replace("{step}", tourStep.toString())}]\n\n`;
        
        setMessages(prev => {
          const copy = [...prev];
          for (let i = copy.length - 1; i >= 0; i--) {
            if (copy[i].sender === "agent") {
              copy[i] = {
                ...copy[i],
                text: `${stepLabel}${speech}`
              };
              break;
            }
          }
          return copy;
        });
        speakText(speech);
        return;
      }

      const lastAgentMsg = [...messages].reverse().find(m => m.sender === "agent");
      if (lastAgentMsg) {
        let speech = lastAgentMsg.text;
        
        // Translate matched paragraphs
        if (speech === LOCALIZATION.en.agentIntro || speech === LOCALIZATION["zh-TW"].agentIntro || speech === LOCALIZATION.es.agentIntro || speech === LOCALIZATION.fr.agentIntro) {
          speech = t.agentIntro;
        } else if (speech === LOCALIZATION.en.smsIntro || speech === LOCALIZATION["zh-TW"].smsIntro || speech === LOCALIZATION.es.smsIntro || speech === LOCALIZATION.fr.smsIntro) {
          speech = t.smsIntro;
        } else if (speech === LOCALIZATION.en.calendarIntro || speech === LOCALIZATION["zh-TW"].calendarIntro || speech === LOCALIZATION.es.calendarIntro || speech === LOCALIZATION.fr.calendarIntro) {
          speech = t.calendarIntro;
        } else if (speech === LOCALIZATION.en.invoiceIntro || speech === LOCALIZATION["zh-TW"].invoiceIntro || speech === LOCALIZATION.es.invoiceIntro || speech === LOCALIZATION.fr.invoiceIntro) {
          speech = t.invoiceIntro;
        } else if (speech === LOCALIZATION.en.recruitIntro || speech === LOCALIZATION["zh-TW"].recruitIntro || speech === LOCALIZATION.es.recruitIntro || speech === LOCALIZATION.fr.recruitIntro) {
          speech = t.recruitIntro;
        } else if (speech === LOCALIZATION.en.pricingInfo || speech === LOCALIZATION["zh-TW"].pricingInfo || speech === LOCALIZATION.es.pricingInfo || speech === LOCALIZATION.fr.pricingInfo) {
          speech = t.pricingInfo;
        } else if (speech === LOCALIZATION.en.leadPrompt || speech === LOCALIZATION["zh-TW"].leadPrompt || speech === LOCALIZATION.es.leadPrompt || speech === LOCALIZATION.fr.leadPrompt) {
          speech = t.leadPrompt;
        } else if (speech === LOCALIZATION.en.leadSuccess || speech === LOCALIZATION["zh-TW"].leadSuccess || speech === LOCALIZATION.es.leadSuccess || speech === LOCALIZATION.fr.leadSuccess) {
          speech = t.leadSuccess;
        }

        setMessages(prev => {
          return prev.map(m => {
            if (m.sender === "agent") {
              if (m.text === LOCALIZATION.en.agentIntro || m.text === LOCALIZATION["zh-TW"].agentIntro || m.text === LOCALIZATION.es.agentIntro || m.text === LOCALIZATION.fr.agentIntro) return { ...m, text: t.agentIntro };
              if (m.text === LOCALIZATION.en.smsIntro || m.text === LOCALIZATION["zh-TW"].smsIntro || m.text === LOCALIZATION.es.smsIntro || m.text === LOCALIZATION.fr.smsIntro) return { ...m, text: t.smsIntro };
              if (m.text === LOCALIZATION.en.calendarIntro || m.text === LOCALIZATION["zh-TW"].calendarIntro || m.text === LOCALIZATION.es.calendarIntro || m.text === LOCALIZATION.fr.calendarIntro) return { ...m, text: t.calendarIntro };
              if (m.text === LOCALIZATION.en.invoiceIntro || m.text === LOCALIZATION["zh-TW"].invoiceIntro || m.text === LOCALIZATION.es.invoiceIntro || m.text === LOCALIZATION.fr.invoiceIntro) return { ...m, text: t.invoiceIntro };
              if (m.text === LOCALIZATION.en.recruitIntro || m.text === LOCALIZATION["zh-TW"].recruitIntro || m.text === LOCALIZATION.es.recruitIntro || m.text === LOCALIZATION.fr.recruitIntro) return { ...m, text: t.recruitIntro };
              if (m.text === LOCALIZATION.en.pricingInfo || m.text === LOCALIZATION["zh-TW"].pricingInfo || m.text === LOCALIZATION.es.pricingInfo || m.text === LOCALIZATION.fr.pricingInfo) return { ...m, text: t.pricingInfo };
              if (m.text === LOCALIZATION.en.leadPrompt || m.text === LOCALIZATION["zh-TW"].leadPrompt || m.text === LOCALIZATION.es.leadPrompt || m.text === LOCALIZATION.fr.leadPrompt) return { ...m, text: t.leadPrompt };
              if (m.text === LOCALIZATION.en.leadSuccess || m.text === LOCALIZATION["zh-TW"].leadSuccess || m.text === LOCALIZATION.es.leadSuccess || m.text === LOCALIZATION.fr.leadSuccess) return { ...m, text: t.leadSuccess };
            }
            return m;
          });
        });

        speakText(speech);
      }
    }
  }, [language]);

  // Run SMS phone animation sequence
  const startSMSDemo = () => {
    setDemoState("missed_call");
    setPhoneStep(1);
    setPhoneMessages([]);

    setTimeout(() => {
      setPhoneStep(2);
      setPhoneMessages([{ 
        sender: "ai", 
        text: language === "zh-TW" ? "您好，這裡是 Plumbify！很抱歉漏接了您的來電。請問您遇到水管緊急狀況嗎？" : "Hi, this is Plumbify! Sorry we missed your call. Do you have a plumbing emergency?" 
      }]);
      
      setTimeout(() => {
        setPhoneMessages(prev => [...prev, { 
          sender: "user", 
          text: language === "zh-TW" ? "對！我家地下室水管爆了，水流得到處都是！" : "Yes! A pipe just burst in my basement, water everywhere!" 
        }]);
        
        setTimeout(() => {
          setPhoneMessages(prev => [...prev, { 
            sender: "ai", 
            text: language === "zh-TW" ? "天啊，這很緊急。我們能為您安排最專業的師傅在今天下午 2 點上門。請提供您的完整地址來確認預約？" : "I'm sorry to hear that. We can have a master plumber at your door by 2 PM today. Please confirm your address?" 
          }]);
          setPhoneStep(3);
        }, 2000);
      }, 2000);
    }, 2000);
  };

  // Run Invoice payment tap animation sequence
  const startInvoiceDemo = () => {
    setDemoState("invoice");
    setInvoiceStep(0);
    setInvoicePaid(false);

    setTimeout(() => {
      setInvoiceStep(1); // card approaches screen
      setTimeout(() => {
        setInvoiceStep(2); // payment cleared
        setInvoicePaid(true);
      }, 2000);
    }, 1500);
  };

  // Start Tour Mode
  const startTourMode = () => {
    setIsTourActive(true);
    setTourStep(1);
    setDemoState("missed_call");
    setIsTyping(true);
    
    setTimeout(() => {
      const step1Msg: Message = {
        sender: "agent",
        text: `[${t.tourProgress.replace("{step}", "1")}]\n\n${t.smsIntro}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages([step1Msg]);
      setIsTyping(false);
      startSMSDemo();
      speakText(t.smsIntro);
    }, 500);
  };

  // Handle sequential tour steps
  const handleTourStep = (direction: "next" | "prev" | "skip") => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    if (direction === "skip") {
      setIsTourActive(false);
      setTourStep(0);
      setDemoState("welcome");
      
      const skipMsg: Message = {
        sender: "agent",
        text: t.agentIntro,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages([skipMsg]);
      speakText(t.agentIntro);
      return;
    }

    let nextStep = tourStep;
    if (direction === "next") {
      nextStep += 1;
    } else {
      nextStep -= 1;
    }

    if (nextStep < 1) nextStep = 1;

    setTourStep(nextStep);
    setIsTyping(true);

    let introText = "";
    if (nextStep === 1) {
      introText = t.smsIntro;
      setDemoState("missed_call");
      startSMSDemo();
    } else if (nextStep === 2) {
      introText = t.calendarIntro;
      setDemoState("calendar");
    } else if (nextStep === 3) {
      introText = t.invoiceIntro;
      setDemoState("invoice");
      startInvoiceDemo();
    } else if (nextStep === 4) {
      introText = t.recruitIntro;
      setDemoState("recruiting");
    } else if (nextStep === 5) {
      introText = t.pricingInfo + "\n\n" + t.leadPrompt;
      setDemoState("lead_form");
    } else {
      setIsTourActive(false);
      setTourStep(0);
      setDemoState("welcome");
      introText = t.agentIntro;
    }

    setTimeout(() => {
      const stepLabel = nextStep <= 5 ? `[${t.tourProgress.replace("{step}", nextStep.toString())}]\n\n` : "";
      const agentMsg: Message = {
        sender: "agent",
        text: `${stepLabel}${introText}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
      speakText(introText);
    }, 600);
  };

  // Select a Feature Walkthrough
  const handleFeatureSelect = (type: "sms" | "calendar" | "invoice" | "recruiting" | "pricing" | "book") => {
    setIsTyping(true);
    let introText = "";

    if (type === "sms") {
      introText = t.smsIntro;
      startSMSDemo();
    } else if (type === "calendar") {
      introText = t.calendarIntro;
      setDemoState("calendar");
    } else if (type === "invoice") {
      introText = t.invoiceIntro;
      startInvoiceDemo();
    } else if (type === "recruiting") {
      introText = t.recruitIntro;
      setDemoState("recruiting");
    } else if (type === "pricing") {
      introText = t.pricingInfo;
      setDemoState("invoice");
    } else if (type === "book") {
      introText = t.leadPrompt;
      setDemoState("lead_form");
    }

    setTimeout(() => {
      const agentMsg: Message = {
        sender: "agent",
        text: introText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
      speakText(introText);
    }, 800);
  };

  // Helper to check if text contains any keywords
  const containsAny = (str: string, ...keywords: string[]) => {
    return keywords.some(kw => str.includes(kw));
  };

  // Shared message processor for both text inputs and auto-submitted voice inputs
  const processUserMsg = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let responseText = "";
      const textLower = text.toLowerCase();

      // Advanced Multilingual Q&A Database
      if (language === "zh-TW") {
        if (containsAny(textLower, "plumbify是什麼", "什麼是plumbify", "這是什麼", "plumbify is what", "介紹")) {
          responseText = "Plumbify 是專為水電空調與工程行設計的 AI 客戶管理系統（CRM）。它能 24/7 自動運行簡訊回撥、微信對接、自動排程派單與 5 星 Google 評論自動生成，幫您鎖定每一筆潛在訂單，防止客戶流失！";
          setDemoState("welcome");
        } else if (containsAny(textLower, "價格", "收費", "方案", "多少錢", "方案價格", "費率", "定價")) {
          responseText = "Plumbify 提供兩種主要方案：\n1. 基礎版 (Starter - $197/月)：包含簡訊回撥、智慧排程與手機感應收款。\n2. 專業成長版 (Growth - $397/月)：增加 AI 招募助理與客戶資料活化。\n所有方案都包含 14 天免費設定挑戰，不成交不收費！";
          setDemoState("invoice");
        } else if (containsAny(textLower, "servicetitan", "housecall", "hcp", "整合", "軟體連接", "系統連接", "串接")) {
          responseText = "是的，我們完全支援整合！Plumbify 可以安裝在 ServiceTitan 或 Housecall Pro 的前端。它能先透過簡訊回撥搶下客戶並預約，再把工單資訊無縫傳送到您的原有排班系統中，讓您現有的流程不受影響。";
          setDemoState("calendar");
        } else if (containsAny(textLower, "微信", "wechat", "企業微信", "wecom", "華人", "中文")) {
          responseText = "Plumbify 支援直接串接您的微信（WeChat）或企業微信（WeCom）。華人客戶透過微信諮詢時，對話會自動同步到系統，並且系統會自動進行中英雙向翻譯，讓英文調度員也能輕鬆溝通和接單！";
          setDemoState("welcome");
        } else if (containsAny(textLower, "簡訊", "回撥", "未接", "漏接", "簡訊回撥", "missed call", "電話")) {
          responseText = "『漏電簡訊自動回撥』是我們的核心功能。當電話漏接時，系統會自動在 5 秒內發送簡訊給對方。70% 的客戶在撥不通時會改打別家，簡訊回撥能第一時間留住他們。您可以利用左側手機模擬器測試！";
          startSMSDemo();
        } else if (containsAny(textLower, "合約", "解約", "綁定", "簽約", "退款")) {
          responseText = "Plumbify 不需要簽訂任何長期合約，您可以隨時取消訂閱。我們也提供 30 天無條件退款保證，讓您完全沒有風險。";
          setDemoState("lead_form");
        } else if (containsAny(textLower, "14天", "免費試用", "免費挑戰", "挑戰", "試用")) {
          responseText = "我們的『14天免費挑戰』包含免費為您設定並串接電話與微信 14 天。如果系統在這期間內沒有幫您自動救回並成交至少 3 筆水電工單，您不需支付任何費用！";
          setDemoState("lead_form");
        } else if (containsAny(textLower, "評價", "評論", "google評論", "商家評價", "星級", "星", "口碑")) {
          responseText = "Plumbify 會在完工收款後自動發送簡訊邀請評論。給 4-5 星的好評客戶會被直接引導至 Google 商家頁面，低分（1-3星）客戶則會被引導填寫私下反饋表，避免公開差評！";
          setDemoState("welcome");
        } else if (containsAny(textLower, "緊急", "修繕", "爆裂", "漏水", "沒熱水", "搶修")) {
          responseText = "是的！AI 可以自動識別緊急漏水、水管爆裂等高優先級字眼，在 conversations 中標記為緊急線索，並即時向您的排班師傅發送派單推送。";
          setDemoState("calendar");
        } else if (containsAny(textLower, "招募", "聘", "找人", "雇", "找師傅")) {
          responseText = "Plumber 招聘是主要痛點。我們的 AI 招募助理（在 Growth/Enterprise 級別啟用）會自動篩選招募管道、發送簡訊面試應徵者、核對證照類別，並將合適的人選直接約入您的面試行事曆。";
          setDemoState("recruiting");
        } else {
          responseText = "您可以詢問我關於 Plumbify 的具體問題！試著輸入：『Plumbify是什麼？』、『價格多少？』、『如何串接 ServiceTitan？』、『微信如何整合？』或『什麼是14天免費挑戰？』。您也可以隨時點選上方的功能按鍵觀看模擬操作。";
        }
      } else {
        // English Q&A Matcher
        if (containsAny(textLower, "what is plumbify", "how it works", "plumbify what", "about plumbify", "introduce", "what's plumbify")) {
          responseText = "Plumbify is the #1 AI-first CRM operating system built for plumbing and trade businesses. It automates missed-call text-backs, WeChat/WeCom leads, smart scheduling, and 5-star Google review generation to keep your trucks full 24/7.";
          setDemoState("welcome");
        } else if (containsAny(textLower, "pricing", "cost", "price", "how much", "plans", "fee", "rate")) {
          responseText = "Plumbify offers 3 simple plans:\n1. Starter ($197/mo): Twilio SMS text-backs, smart calendar, and mobile payment sync.\n2. Growth ($397/mo): Adds AI recruiting and database reactivation.\n3. Custom Enterprise: For fleets with 20+ trucks.\nAll plans start with a 14-day free setup challenge.";
          setDemoState("invoice");
        } else if (containsAny(textLower, "servicetitan", "housecall", "hcp", "integration", "integrate", "jobber")) {
          responseText = "Yes! Plumbify connects fully with ServiceTitan, Housecall Pro, and Jobber. It secures the customer first via instant text-backs, books the slot, and syncs the details straight to your dispatch board so your existing workflow stays clean.";
          setDemoState("calendar");
        } else if (containsAny(textLower, "wechat", "wecom", "chinese", "translation", "translate")) {
          responseText = "Plumbify connects your business WeChat/WeCom. Incoming messages are aggregated into your unified inbox and translated instantly in both directions, enabling your english-speaking dispatchers to book Chinese-speaking leads with ease.";
          setDemoState("welcome");
        } else if (containsAny(textLower, "sms", "text back", "missed call", "call back", "unanswered")) {
          responseText = "Missed-Call Auto Text-Back detects missed calls and texts the customer in 5 seconds. This keeps them from calling other plumbers. You can test this using the phone simulator on the left!";
          startSMSDemo();
        } else if (containsAny(textLower, "contract", "cancel", "agreement", "refund")) {
          responseText = "No contracts! Plumbify is month-to-month, and you can cancel anytime. We also offer a 30-day money-back guarantee.";
          setDemoState("lead_form");
        } else if (containsAny(textLower, "trial", "free challenge", "challenge", "free trial", "14 day")) {
          responseText = "Our 14-Day Free Challenge includes full system setup. If the system does not rescue and secure at least 3 plumbing jobs that you would have otherwise missed or forgotten, you pay nothing.";
          setDemoState("lead_form");
        } else if (containsAny(textLower, "review", "reputation", "google reviews", "rating", "star", "maps")) {
          responseText = "Plumbify automates review requests via SMS after billing. 4-5 star ratings go straight to Google Maps. 1-3 star feedback is routed privately to protect your reputation from negative public reviews.";
          setDemoState("welcome");
        } else if (containsAny(textLower, "recruit", "hiring", "hired", "applicant", "find plumber")) {
          responseText = "AI Recruiting (Growth tier) scans job boards, text-screens applicants, qualifies license types, and books interviews with Master Plumbers automatically, saving you 15+ hours of manual screening weekly.";
          setDemoState("recruiting");
        } else if (containsAny(textLower, "emergency", "burst pipe", "leak", "no hot water", "clog")) {
          responseText = "Yes, our AI is trained to detect high-priority keywords (like 'burst pipe' or 'leak') in incoming chats to tag them as urgent and immediately send push notifications to free technicians.";
          setDemoState("calendar");
        } else {
          responseText = "I can answer specific questions about Plumbify! Try asking: 'What is Plumbify?', 'How much does it cost?', 'Does it integrate with ServiceTitan?', 'How does WeChat integration work?', or 'What is the 14-day free challenge?'. You can also select feature tabs above to watch a demo.";
        }
      }

      const agentMsg: Message = {
        sender: "agent",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
      speakText(responseText);
    }, 1000);
  };

  // Handle manual user message send
  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    processUserMsg(inputText);
    setInputText("");
  };

  // Submit Lead Form to GoHighLevel CRM
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
      setDemoState("calendar");
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
            <span className="absolute top-0.5 right-0.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
            </span>
            <Bot size={28} className="transition-transform group-hover:rotate-12 duration-300" />
          </button>
        </div>
      )}

      {/* 2. EXPANDED SPLIT-SCREEN PANEL */}
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
                    setIsSpeaking(false);
                  }
                }}
                className="text-slate-400 hover:text-white transition-colors"
                title={isMuted ? "Unmute Voice" : "Mute Voice"}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="text-blue-400" />}
              </button>

              {/* Sliders settings button (Option 2: Config Multilingual speech engine controls) */}
              <button 
                onClick={() => setShowAudioSettings(!showAudioSettings)}
                className={`p-1.5 rounded-xl border transition-colors flex items-center justify-center ${showAudioSettings ? 'bg-blue-600/10 border-blue-500/30 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
                title={t.voiceSettings}
              >
                <Sliders size={16} />
              </button>

              <button onClick={toggleWidget} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Audio Settings Popover */}
            {showAudioSettings && (
              <div className="absolute right-6 top-16 w-64 bg-slate-950/98 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-[10px] space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-white uppercase tracking-wider">{t.voiceSettings}</span>
                  <button onClick={() => setShowAudioSettings(false)} className="text-slate-500 hover:text-white">
                    <X size={12} />
                  </button>
                </div>
                
                {/* Voice Selector */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">{t.voiceSelect}</label>
                  <select 
                    value={selectedVoiceName}
                    onChange={(e) => setSelectedVoiceName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-slate-200 text-[10px] focus:outline-none"
                  >
                    <option value="">{language === "zh-TW" ? "預設智慧引擎" : "Default Neural Engine"}</option>
                    {availableVoices
                      .filter(v => {
                        if (!v || !v.lang) return false;
                        let langCode = "en-US";
                        if (language === "zh-TW") langCode = "zh-TW";
                        else if (language === "es") langCode = "es-ES";
                        else if (language === "fr") langCode = "fr-FR";
                        return v.lang.startsWith(langCode) || v.lang.replace('_', '-').startsWith(langCode);
                      })
                      .map((voice, idx) => (
                        <option key={idx} value={voice.name} className="bg-slate-900 text-white">
                          {voice.name}
                        </option>
                      ))
                    }
                  </select>
                </div>

                {/* Speed Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span className="font-bold">{t.voiceSpeed}</span>
                    <span className="font-semibold text-blue-400">{speechRate.toFixed(2)}x</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="1.5" 
                    step="0.05"
                    value={speechRate} 
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Pitch Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span className="font-bold">{t.voicePitch}</span>
                    <span className="font-semibold text-blue-400">{speechPitch.toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="1.5" 
                    step="0.05"
                    value={speechPitch} 
                    onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                    className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick-select Menu Row inside Header Area (Proactive Feature Selection) */}
          <div className="h-14 border-b border-slate-800 bg-slate-900/20 px-4 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
            {[
              { label: language === "zh-TW" ? "📞 簡訊回撥" : "📞 SMS Text-back", type: "sms" },
              { label: language === "zh-TW" ? "📅 派單排程" : "📅 Dispatch Board", type: "calendar" },
              { label: language === "zh-TW" ? "💳 手機收款" : "💳 Tap-to-Pay", type: "invoice" },
              { label: language === "zh-TW" ? "👥 AI 招募" : "👥 AI Recruiter", type: "recruiting" },
              { label: language === "zh-TW" ? "💰 軟體方案" : "💰 Pricing Plans", type: "pricing" },
              { label: language === "zh-TW" ? "💬 專人預約" : "💬 Book Call", type: "book" }
            ].map((btn) => {
              const isActive = (btn.type === "sms" && demoState === "missed_call") || (btn.type === demoState);
              return (
                <button
                  key={btn.type}
                  onClick={() => handleFeatureSelect(btn.type as any)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-tight whitespace-nowrap border transition-all ${
                    isActive 
                      ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.2)]" 
                      : "bg-slate-900/80 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>

          {/* Body Content: Split Screen layout */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* LEFT PANE: LIVE PRODUCT DEMO SIMULATOR (40% width on medium/large screens) */}
            <div className="md:w-[320px] shrink-0 border-b md:border-b-0 md:border-r border-slate-800 bg-[#060a13] p-6 flex flex-col justify-center items-center overflow-y-auto min-h-[220px] md:min-h-0">
              
              {/* Scenario 1: Welcome & Landing Visual */}
              {demoState === "welcome" && (
                <div className="text-center space-y-6 max-w-sm animate-in fade-in duration-500">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
                    <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white border-4 border-slate-800">
                      <Sparkles size={28} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black tracking-tight text-white">Interactive Product Tour</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      {language === "zh-TW" 
                        ? "請點擊上方按鈕，AI 將一步步為您演示 Plumbify 的核心後台功能，免去視訊通話的繁瑣。"
                        : "Click any button above to watch our AI walk you through Plumbify's core dashboards in real-time."}
                    </p>
                  </div>
                  <div className="space-y-2 text-left w-full text-[10px] text-slate-400">
                    <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 font-medium">
                      ✅ <strong>100% Self-Serve:</strong> Watch how we automate back-offices.
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 font-medium">
                      ✅ <strong>GHL CRM Sync:</strong> Sync leads directly into GoHighLevel.
                    </div>
                  </div>

                  {/* Start Tour CTA button */}
                  <button 
                    onClick={startTourMode}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_15px_rgba(59,130,246,0.3)] animate-pulse"
                  >
                    🚀 {t.startTour}
                  </button>
                </div>
              )}

              {/* Scenario 2: Virtual Phone Missed Call Demo */}
              {demoState === "missed_call" && (
                <div className="w-52 h-[340px] bg-slate-900 rounded-[2.2rem] border-[4px] border-slate-800 shadow-2xl relative flex flex-col overflow-hidden animate-in zoom-in duration-300">
                  {/* Notch & Camera */}
                  <div className="h-5 w-full flex justify-between px-5 pt-3 items-center">
                    <span className="text-[8px] font-bold text-white">9:41 AM</span>
                    <div className="w-12 h-2.5 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-1 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-slate-950 ml-auto mr-1"></div>
                    </div>
                    <span className="text-[8px] font-bold text-emerald-400">5G</span>
                  </div>

                  <div className="flex-1 p-2.5 flex flex-col justify-start">
                    {phoneStep === 1 && (
                      <div className="flex flex-col items-center justify-center mt-12 animate-in slide-in-from-top duration-500">
                        <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center animate-pulse mb-3">
                          <Phone size={16} className="text-white fill-current" />
                        </div>
                        <p className="text-[10px] font-bold">{language === "zh-TW" ? "撥號中..." : "Inbound Call..."}</p>
                        <p className="text-[8px] text-slate-400 mt-1">John (Residential Customer)</p>
                        <span className="text-[8px] bg-red-950 text-red-400 border border-red-900/50 px-2 py-0.5 rounded-full mt-4 font-bold uppercase tracking-wider">Missed Call</span>
                      </div>
                    )}

                    {phoneStep >= 2 && (
                      <div className="flex-1 flex flex-col gap-2 pt-2">
                        <div className="text-[7px] text-slate-500 text-center font-bold uppercase tracking-widest">Today 9:42 AM</div>
                        {phoneMessages.map((msg, i) => (
                          <div 
                            key={i} 
                            className={`max-w-[85%] p-2 rounded-2xl text-[9px] leading-snug font-medium animate-in slide-in-from-bottom-2 duration-300 ${
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
                  <div className="h-1 w-12 bg-white/20 rounded-full mx-auto mb-1"></div>
                </div>
              )}

              {/* Scenario 3: AI Calendar Booking Slots */}
              {demoState === "calendar" && (
                <div className="w-full text-center space-y-4 animate-in fade-in duration-500 max-w-xs">
                  <div className="h-10 w-10 rounded-full bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto">
                    <Calendar size={20} />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">GHL Dispatch Calendar</h4>
                    <p className="text-[9px] text-slate-500">Auto Scheduling & Route Optimization</p>
                  </div>
                  
                  {/* Calendar Widget Preview */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-left space-y-2 text-[9px]">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                      <span className="font-bold text-slate-300">Technician Dispatch List</span>
                      <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-black">SYNCED</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center p-1.5 bg-slate-950 rounded border border-slate-800">
                        <span className="text-white font-bold">🔧 Dave (Master Plumber)</span>
                        <span className="text-cyan-400 font-bold">2:00 PM Booked</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-slate-950 rounded border border-slate-800">
                        <span className="text-slate-400">🔧 Mike (Apprentice)</span>
                        <span className="text-slate-500">Available</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-slate-950 rounded border border-slate-800">
                        <span className="text-slate-400">🔧 Tom (Leak Specialist)</span>
                        <span className="text-slate-500">Available</span>
                      </div>
                    </div>
                    {submitSuccess && (
                      <div className="bg-emerald-500/10 border border-emerald-500/25 p-2 rounded-lg flex items-center gap-1.5 text-[8px] text-emerald-400">
                        <CheckCircle size={12} className="shrink-0 animate-pulse" />
                        <span>VIP Contact registered. Dispatch slot reserved!</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Scenario 4: Pricing Invoice Generator */}
              {demoState === "invoice" && (
                <div className="w-full space-y-4 animate-in fade-in duration-500 max-w-xs">
                  <div className="h-10 w-10 rounded-full bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
                    <CreditCard size={20} />
                  </div>
                  <div className="text-center space-y-0.5">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-purple-400">Tap-To-Pay Invoice</h4>
                    <p className="text-[9px] text-slate-500">Instant credit card contactless capture</p>
                  </div>
                  
                  {/* Mock Invoice sheet */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-left text-[10px] space-y-2 relative">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                      <span className="font-bold text-slate-300">Invoice #1042</span>
                      <span className={`text-[8px] border px-1.5 py-0.5 rounded font-black transition-colors ${
                        invoicePaid 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : "bg-purple-500/10 text-purple-400 border-purple-500/20 animate-pulse"
                      }`}>
                        {invoicePaid ? "PAID" : "UNPAID"}
                      </span>
                    </div>
                    <div className="space-y-1 text-slate-400">
                      <div className="flex justify-between">
                        <span>Residential Drain Unclogging</span>
                        <span className="font-bold text-white">$149.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Emergency Callout Fee</span>
                        <span className="font-bold text-white">$99.00</span>
                      </div>
                      <div className="flex justify-between border-t border-dashed border-slate-800 pt-1.5 text-xs font-bold text-white">
                        <span>Total Paid</span>
                        <span className="text-blue-400">$248.00</span>
                      </div>
                    </div>

                    {/* Contactless credit card tap simulator */}
                    {invoiceStep === 1 && (
                      <div className="absolute inset-0 bg-slate-950/80 rounded-xl flex flex-col items-center justify-center space-y-2 animate-in fade-in duration-200">
                        <div className="h-8 w-12 bg-blue-600 rounded border border-blue-400 animate-bounce flex items-center justify-center text-[7px] font-black uppercase text-white shadow-lg">Credit Card</div>
                        <span className="text-[8px] text-blue-400 animate-pulse font-bold">Tapping card to back of phone...</span>
                      </div>
                    )}
                    
                    {invoiceStep === 2 && (
                      <div className="absolute inset-0 bg-slate-950/90 rounded-xl flex flex-col items-center justify-center space-y-1.5 animate-in zoom-in duration-300">
                        <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                          <Check size={18} />
                        </div>
                        <span className="text-[9px] text-emerald-400 font-bold">Transaction Successful!</span>
                        <span className="text-[7px] text-slate-500">Funds transferred via Tap-to-Pay</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Scenario 5: AI Recruiting Funnel */}
              {demoState === "recruiting" && (
                <div className="w-full space-y-4 animate-in fade-in duration-500 max-w-xs">
                  <div className="h-10 w-10 rounded-full bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mx-auto">
                    <Users size={20} />
                  </div>
                  <div className="text-center space-y-0.5">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-orange-400">AI Recruiting Dashboard</h4>
                    <p className="text-[9px] text-slate-500">Applicant screening and interview funnel</p>
                  </div>
                  
                  {/* Candidate Pipeline Cards */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-left text-[9px] space-y-2">
                    <div className="grid grid-cols-3 gap-1.5">
                      
                      <div className="bg-slate-950 p-1.5 rounded border border-slate-800 space-y-1">
                        <div className="font-bold text-slate-400 border-b border-slate-800 pb-1 text-[8px] uppercase">New (3)</div>
                        <div className="bg-slate-900 p-1 rounded text-[7px] font-bold text-white">John D. (Plumber)</div>
                        <div className="bg-slate-900 p-1 rounded text-[7px] font-bold text-white">Robert K. (Apprentice)</div>
                      </div>

                      <div className="bg-slate-950 p-1.5 rounded border border-slate-800 space-y-1">
                        <div className="font-bold text-orange-400 border-b border-slate-800 pb-1 text-[8px] uppercase">Screened</div>
                        <div className="bg-slate-900 p-1 rounded text-[7px] font-bold text-orange-300 relative">
                          Mike P.
                          <span className="absolute top-1 right-1 h-1 w-1 rounded-full bg-emerald-500"></span>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-1.5 rounded border border-slate-800 space-y-1">
                        <div className="font-bold text-emerald-400 border-b border-slate-800 pb-1 text-[8px] uppercase">Booked</div>
                        <div className="bg-emerald-950/30 border border-emerald-500/20 p-1 rounded text-[7px] font-bold text-emerald-400 flex items-center gap-1">
                          <UserCheck size={8} /> Steve G. (Master)
                        </div>
                      </div>

                    </div>
                    <div className="bg-[#0b1329] p-2 rounded-lg text-[8px] text-slate-400 leading-normal">
                      The AI Recruiting Assistant filters credentials, qualifications, and schedules verified plumbing technicians directly into your GHL.
                    </div>
                  </div>
                </div>
              )}

              {/* Scenario 6: GHL Lead Qualification form */}
              {demoState === "lead_form" && (
                <div className="w-full space-y-4 animate-in fade-in duration-300">
                  <div className="text-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">Qualify & Schedule Demo</h4>
                    <p className="text-[10px] text-slate-500">Fill details to register as a VIP Lead</p>
                  </div>

                  <form onSubmit={handleLeadSubmit} className="space-y-1.5 text-left text-[10px]">
                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <label className="text-[8px] font-bold text-slate-400">First Name *</label>
                        <input 
                          type="text" 
                          required
                          value={leadForm.firstName}
                          onChange={(e) => setLeadForm({...leadForm, firstName: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-blue-500" 
                        />
                      </div>
                      <div>
                        <label className="text-[8px] font-bold text-slate-400">Last Name *</label>
                        <input 
                          type="text" 
                          required
                          value={leadForm.lastName}
                          onChange={(e) => setLeadForm({...leadForm, lastName: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-blue-500" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[8px] font-bold text-slate-400">Email Address *</label>
                      <input 
                        type="email" 
                        required
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="text-[8px] font-bold text-slate-400">Phone Number *</label>
                      <input 
                        type="tel" 
                        required
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="text-[8px] font-bold text-slate-400">Company Name (Optional)</label>
                      <input 
                        type="text" 
                        value={leadForm.company}
                        onChange={(e) => setLeadForm({...leadForm, company: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-blue-500" 
                      />
                    </div>

                    {submitError && (
                      <p className="text-[9px] font-semibold text-red-500">{submitError}</p>
                    )}

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-8 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-slate-400 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          <span>Syncing...</span>
                        </>
                      ) : (
                        <>
                          <span>{t.buttonSubmit}</span>
                          <ArrowRight size={12} />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

            </div>

            {/* RIGHT PANE: CONVERSATIONAL CHAT DIALOGUE & PRICING ACTIONS */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
              
              {/* Message Feed Viewport */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex flex-col max-w-[85%] ${
                      msg.sender === "user" ? "ml-auto items-end animate-in slide-in-from-right-3 duration-250" : "mr-auto items-start animate-in slide-in-from-left-3 duration-250"
                    }`}
                  >
                    <div 
                      className={`p-3 rounded-2xl text-[11px] leading-relaxed font-medium ${
                        msg.sender === "user" 
                          ? "bg-gradient-to-tr from-blue-600 to-cyan-500 text-white rounded-tr-none shadow-[0_4px_12px_rgba(0,82,255,0.15)]" 
                          : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
                      }`}
                    >
                      {msg.text.split("\n").map((line, lIdx) => (
                        <p key={lIdx} className={lIdx > 0 ? "mt-1.5" : ""}>{line}</p>
                      ))}
                    </div>
                    <span className="text-[7px] text-slate-600 mt-1 px-1 font-semibold">{msg.timestamp}</span>
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

              {/* Checkout / CTA Buttons at the bottom of the dialogue feed if pricing is active */}
              {messages.length > 0 && (messages[messages.length - 1].text.includes(LOCALIZATION.en.pricingInfo.substring(0, 15)) || messages[messages.length - 1].text.includes(LOCALIZATION["zh-TW"].pricingInfo.substring(0, 15))) ? (
                <div className="px-4 py-3 bg-slate-900/40 border-t border-slate-900/60 flex gap-2 shrink-0">
                  <a 
                    href={process.env.NEXT_PUBLIC_STARTER_CHECKOUT_URL || "/pricing"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-slate-900 border border-slate-700 hover:border-blue-500 text-slate-100 hover:text-white rounded-xl text-[10px] font-black uppercase text-center transition-all"
                  >
                    🚀 {language === "zh-TW" ? "訂購 基礎版 ($197)" : "Buy Starter ($197)"}
                  </a>
                  <a 
                    href={process.env.NEXT_PUBLIC_GROWTH_CHECKOUT_URL || "/pricing"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase text-center transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  >
                    🔥 {language === "zh-TW" ? "試用 成長版 ($397)" : "Try Growth ($397)"}
                  </a>
                </div>
              ) : null}

              {/* Walkthrough Tour Control Panel */}
              {isTourActive && (
                <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleTourStep("prev")}
                    disabled={tourStep === 1}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 disabled:hover:bg-slate-800 rounded-xl text-[10px] font-black tracking-tight transition-colors flex items-center gap-1"
                  >
                    {t.prevStep}
                  </button>
                  
                  {/* Step Progress indicators */}
                  <div className="flex gap-1.5 items-center">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div 
                        key={step} 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          step === tourStep 
                            ? "w-5 bg-blue-500" 
                            : step < tourStep 
                              ? "w-2 bg-blue-600/40" 
                              : "w-2 bg-slate-800"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleTourStep("skip")}
                      className="px-2.5 py-2 hover:text-white text-slate-400 rounded-xl text-[10px] font-bold tracking-tight transition-colors"
                    >
                      {t.skipTour}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleTourStep(tourStep === 5 ? "skip" : "next")}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black tracking-tight transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center gap-1"
                    >
                      {tourStep === 5 ? t.finishTour : t.nextStep}
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic Speech Waveform Visualizer & Subtitles */}
              {isSpeaking && (
                <div className="flex flex-col shrink-0 select-none animate-in fade-in duration-200">
                  {/* Waveform Bar */}
                  <div className="px-4 py-1.5 bg-blue-950/40 border-t border-slate-900 flex items-center gap-2 text-blue-400">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span className="text-[9px] font-black tracking-tight uppercase">{language === "zh-TW" ? "AI 語音導覽中" : "AI Voice Speaking"}</span>
                    
                    {/* Waveform Bars */}
                    <div className="flex items-end gap-0.5 h-3 ml-auto pr-2">
                      <div className="w-[2px] bg-blue-400 rounded-full animate-wave h-full [animation-delay:0.1s]"></div>
                      <div className="w-[2px] bg-blue-400 rounded-full animate-wave h-[60%] [animation-delay:0.3s]"></div>
                      <div className="w-[2px] bg-blue-400 rounded-full animate-wave h-[80%] [animation-delay:0.2s]"></div>
                      <div className="w-[2px] bg-blue-400 rounded-full animate-wave h-[40%] [animation-delay:0.5s]"></div>
                      <div className="w-[2px] bg-blue-400 rounded-full animate-wave h-full [animation-delay:0.4s]"></div>
                    </div>
                  </div>

                  {/* Live Caption Text Box */}
                  {currentSubtitle && (
                    <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 text-[10.5px] leading-relaxed text-slate-200 select-text max-h-24 overflow-y-auto font-medium">
                      <div className="text-[8px] font-black uppercase text-blue-400 tracking-wider mb-1 flex items-center gap-1 select-none">
                        <span>{language === "zh-TW" ? "🗣️ 語音字幕輸出" : "🗣️ Live Voice Captions"}</span>
                      </div>
                      <p>{currentSubtitle}</p>
                    </div>
                  )}

                  <style>{`
                    @keyframes wave-bounce {
                      0%, 100% { height: 30%; }
                      50% { height: 100%; }
                    }
                    .animate-wave {
                      animation: wave-bounce 0.8s ease-in-out infinite;
                    }
                  `}</style>
                </div>
              )}

              {/* Chat Input form */}
              <form 
                onSubmit={handleSendText}
                className="p-3 border-t border-slate-800 bg-slate-900/50 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t.inputPlaceholder}
                  className="flex-1 h-10 bg-slate-950 border border-slate-800 rounded-xl px-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
                
                <button
                  type="button"
                  onClick={() => {
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
                        setInputText("");
                        processUserMsg(transcript);
                      };
                      recognition.onerror = () => {
                        setInputText("");
                      };
                      recognition.start();
                    } else {
                      alert("Web Speech API voice recognition is not supported in this browser.");
                    }
                  }}
                  className="h-10 w-10 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center justify-center text-slate-400 hover:text-white"
                  title="Speech-to-Text Voice Input"
                >
                  <Mic size={14} />
                </button>

                <button
                  type="submit"
                  className="h-10 w-10 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,82,255,0.25)]"
                >
                  <Send size={14} />
                </button>
              </form>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
