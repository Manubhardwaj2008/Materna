/**
 * Materna AI Saathi - Universal Maternal & Pediatric Gemini AI Engine
 * 
 * Works seamlessly across all devices (Desktop, Mobile, Tablet) on any host:
 * - Direct Client-Side Google Gemini API (gemini-2.5-flash & gemini-1.5-flash)
 * - FastAPI Backend proxy (/api/chat) fallback
 * - Embedded Medical Doula Clinical Knowledge Base
 * - Indian Government Schemes (PMMVY, JSY, PMSMA, PM-JAY)
 * - Trimester-by-trimester fetal telemetry & symptom triage
 * - Voice Speech-to-Text input (Web Speech API)
 * - Markdown rendering & multi-turn contextual memory
 */

(function () {
  'use strict';

  // System instruction specialized for maternal, fetal, infant, and Indian health welfare
  const MATERNA_SYSTEM_INSTRUCTION = `You are "Materna AI Saathi" (मातृ साथी), a compassionate, medically verified, and culturally empathetic Indian maternal healthcare doula, pediatric advisor, and government maternity welfare specialist.

CORE MISSION & SCOPE:
1. Provide warm, evidence-based, reassuring guidance across all stages:
   - Pre-conception, Trimester 1 (Weeks 1-12), Trimester 2 (Weeks 13-27), Trimester 3 (Weeks 28-40+).
   - Labor preparation, Postpartum recovery, Lactation/Breastfeeding techniques, and Infant care (0-12 months).
2. Indian Maternal Nutrition & Lifestyle:
   - Emphasize rich dietary sources: Palak (spinach), Methi, Jaggery (gur), Ragi (finger millet), Sprouted pulses, Paneer, Curd, Walnuts, and adequate hydration (Buttermilk/Chaas, Coconut water).
   - Advise caution on unpasteurized milk, raw papaya, excess caffeine, and raw sprouts.
3. Indian Government Maternity Schemes & DBT Benefits:
   - Pradhan Mantri Matru Vandana Yojana (PMMVY): ₹ 5,000 cash benefit in 2 installments (₹ 6,000 for second girl child) via Aadhaar-linked DBT.
   - Janani Suraksha Yojana (JSY): ₹ 1,400 to ₹ 6,000 cash incentive for institutional delivery in public/empanelled hospitals.
   - Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA): Free comprehensive ANC checkup on the 9th of every month.
   - Ayushman Bharat PM-JAY: ₹ 5,00,000 cashless family cover per year for tertiary hospitalizations and delivery complications.
   - Mother-Child Protection (MCP) card & ABHA Health ID integration.
4. Critical Medical Danger Signs & Emergency Triage:
   - CRITICAL RED FLAGS: Systolic BP >= 140 or Diastolic >= 90 mmHg, severe persistent frontal headache, sudden facial/hand swelling (edema), blurred vision or flashing spots, vaginal bleeding, amniotic fluid leaking, severe abdominal pain, persistent high fever (>100.4°F), or noticeably reduced fetal movements (< 10 kicks in 2 hours in 3rd trimester).
   - ALWAYS emphasize that if any danger sign is present, the mother must immediately contact her OB-GYN, visit the nearest emergency facility, or use the Materna Emergency SOS helpline (+91 1800-65-9555).
5. Communication Tone:
   - Warm, reassuring, respectful, and clinically sound.
   - Use structured formatting: short paragraphs, bullet points, bold key terms.
   - Support English, Hindi, and Hinglish queries with equal fluency.`;

  // Local storage key name
  const STORAGE_KEY = 'materna_gemini_api_key';

  // Multi-turn conversation state
  let chatHistory = [];
  let isSending = false;
  let recognitionInstance = null;

  // Retrieve stored API key
  function getStoredApiKey() {
    return localStorage.getItem(STORAGE_KEY) || '';
  }

  // Save API key
  function setStoredApiKey(key) {
    if (key && key.trim()) {
      localStorage.setItem(STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    updateApiKeyStatusBadge();
  }

  // Simple Markdown to HTML formatter
  function formatMarkdown(text) {
    if (!text) return '';
    let html = text;

    // Sanitize basic HTML tags (except safe formatting)
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-800 text-purple-200 p-2 rounded-lg text-[11px] overflow-x-auto my-1.5 font-mono"><code>$1</code></pre>');
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-purple-100 text-purple-900 px-1 py-0.5 rounded text-[11px] font-mono">$1</code>');

    // Bold **text** or __text__
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-purple-950">$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong class="font-bold text-purple-950">$1</strong>');

    // Italic *text* or _text_
    html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-slate-700">$1</em>');

    // Bullet points (* item, - item, • item)
    const lines = html.split('\n');
    let inList = false;
    let listType = '';
    const formattedLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.match(/^[\*\-•]\s+(.*)/)) {
        const item = line.replace(/^[\*\-•]\s+/, '');
        if (!inList) {
          formattedLines.push('<ul class="list-disc list-inside space-y-1 my-1.5 text-slate-700">');
          inList = true;
          listType = 'ul';
        }
        formattedLines.push(`<li class="leading-relaxed">${item}</li>`);
      } else if (line.match(/^\d+\.\s+(.*)/)) {
        const item = line.replace(/^\d+\.\s+/, '');
        if (!inList) {
          formattedLines.push('<ol class="list-decimal list-inside space-y-1 my-1.5 text-slate-700">');
          inList = true;
          listType = 'ol';
        }
        formattedLines.push(`<li class="leading-relaxed">${item}</li>`);
      } else {
        if (inList) {
          formattedLines.push(`</${listType}>`);
          inList = false;
        }
        if (line.length > 0) {
          formattedLines.push(`<p class="leading-relaxed my-1">${line}</p>`);
        }
      }
    }
    if (inList) {
      formattedLines.push(`</${listType}>`);
    }

    return formattedLines.join('');
  }

  // Update Status Badge in Chatbot Header
  function updateApiKeyStatusBadge() {
    const badge = document.getElementById('gemini-status-badge');
    const key = getStoredApiKey();
    if (badge) {
      if (key) {
        badge.innerHTML = `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-400/30"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Gemini 2.5 Live</span>`;
      } else {
        badge.innerHTML = `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-200 text-[10px] font-semibold border border-purple-400/30"><span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Clinical Doula</span>`;
      }
    }
  }

  // Toggle Chatbot Window
  window.toggleChatbot = function () {
    const chatWindow = document.getElementById('chatbot-window');
    if (!chatWindow) return;
    const isHidden = chatWindow.classList.contains('hidden');
    if (isHidden) {
      chatWindow.classList.remove('hidden');
      chatWindow.classList.add('flex');
      const input = document.getElementById('chat-user-input');
      if (input) setTimeout(() => input.focus(), 150);
      updateApiKeyStatusBadge();
    } else {
      chatWindow.classList.add('hidden');
      chatWindow.classList.remove('flex');
    }
  };

  // Open & Close API Key Modal
  window.openApiKeyModal = function () {
    const modal = document.getElementById('geminiApiKeyModal');
    if (!modal) return;
    const input = document.getElementById('gemini-api-key-input');
    if (input) {
      input.value = getStoredApiKey();
    }
    document.getElementById('api-key-test-result').innerHTML = '';
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  window.closeApiKeyModal = function () {
    const modal = document.getElementById('geminiApiKeyModal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };

  // Save API Key from Modal
  window.saveApiKeyFromModal = function () {
    const input = document.getElementById('gemini-api-key-input');
    const val = input ? input.value.trim() : '';
    setStoredApiKey(val);
    closeApiKeyModal();

    const container = document.getElementById('chat-messages');
    if (container) {
      const msgBubble = document.createElement('div');
      msgBubble.className = "p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 text-center font-medium my-2";
      msgBubble.innerHTML = val 
        ? `✨ <strong>Gemini API Connected!</strong> You are now using Google Gemini AI for real-time maternal & pediatric care.`
        : `⚙️ API Key cleared. Materna Saathi is now running on the built-in clinical doula engine.`;
      container.appendChild(msgBubble);
      container.scrollTop = container.scrollHeight;
    }
  };

  // Test API Key Live
  window.testGeminiApiKey = async function () {
    const input = document.getElementById('gemini-api-key-input');
    const resultBox = document.getElementById('api-key-test-result');
    const key = input ? input.value.trim() : '';

    if (!key) {
      resultBox.innerHTML = `<span class="text-rose-600 text-xs font-semibold">⚠️ Please enter an API key to test.</span>`;
      return;
    }

    resultBox.innerHTML = `<span class="text-purple-700 text-xs font-semibold flex items-center gap-1.5"><i class="fas fa-spinner fa-spin"></i> Testing Gemini 2.5 Flash connection...</span>`;

    try {
      const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`;
      const response = await fetch(testUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Respond with the single word: READY' }] }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'OK';
        resultBox.innerHTML = `<span class="text-emerald-700 text-xs font-bold flex items-center gap-1.5"><i class="fas fa-check-circle text-emerald-600"></i> Connection Successful! (Gemini 2.5 Flash: ${reply})</span>`;
      } else {
        const err = await response.json().catch(() => ({}));
        resultBox.innerHTML = `<span class="text-rose-600 text-xs font-semibold flex items-center gap-1.5"><i class="fas fa-exclamation-triangle"></i> Error (${response.status}): ${err?.error?.message || 'Invalid API Key'}</span>`;
      }
    } catch (e) {
      resultBox.innerHTML = `<span class="text-rose-600 text-xs font-semibold">⚠️ Network Error: ${e.message}</span>`;
    }
  };

  // Reset / Clear Chat
  window.clearChatHistory = function () {
    chatHistory = [];
    const container = document.getElementById('chat-messages');
    if (!container) return;
    container.innerHTML = `
      <div class="flex items-start gap-2">
        <div class="w-7 h-7 rounded-full bg-purple-700 text-white flex items-center justify-center text-xs shrink-0 font-bold">🌸</div>
        <div class="bg-white p-3.5 rounded-2xl rounded-tl-none border border-purple-100 shadow-sm max-w-[85%] text-slate-800 space-y-2">
          <p>Namaste! I am your <strong>Materna AI Saathi</strong>. How can I help you today?</p>
          <ul class="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
            <li>Week-by-week pregnancy milestones</li>
            <li>Baby kick counting & movement advice</li>
            <li>Indian Govt Schemes (PMMVY ₹ 5,000, JSY, PM-JAY)</li>
            <li>Trimester nutrition & safe remedies</li>
          </ul>
        </div>
      </div>
    `;
  };

  // Quick Prompt Sender
  window.sendQuickPrompt = function (text) {
    const input = document.getElementById('chat-user-input');
    if (input) {
      input.value = text;
      handleUserMessage(new Event('submit'));
    }
  };

  // Voice Input (Speech-to-Text)
  window.toggleVoiceInput = function () {
    const micBtn = document.getElementById('chat-voice-btn');
    const input = document.getElementById('chat-user-input');
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported on this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (recognitionInstance) {
      try {
        recognitionInstance.stop();
      } catch (e) {}
      recognitionInstance = null;
      if (micBtn) micBtn.classList.remove('bg-rose-500', 'text-white', 'animate-pulse');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = 'en-IN'; // Indian English, supports mixed Hindi/English queries
    recognitionInstance.interimResults = false;
    recognitionInstance.maxAlternatives = 1;

    if (micBtn) {
      micBtn.classList.add('bg-rose-500', 'text-white', 'animate-pulse');
    }

    recognitionInstance.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      if (input) {
        input.value = transcript;
        input.focus();
      }
      if (micBtn) micBtn.classList.remove('bg-rose-500', 'text-white', 'animate-pulse');
      recognitionInstance = null;
    };

    recognitionInstance.onerror = function (event) {
      console.warn('Speech Recognition Error:', event.error);
      if (micBtn) micBtn.classList.remove('bg-rose-500', 'text-white', 'animate-pulse');
      recognitionInstance = null;
    };

    recognitionInstance.onend = function () {
      if (micBtn) micBtn.classList.remove('bg-rose-500', 'text-white', 'animate-pulse');
      recognitionInstance = null;
    };

    try {
      recognitionInstance.start();
    } catch (e) {
      console.warn('Could not start recognition:', e);
      if (micBtn) micBtn.classList.remove('bg-rose-500', 'text-white', 'animate-pulse');
      recognitionInstance = null;
    }
  };

  // Call Gemini REST API directly from client (works on GitHub Pages, Vercel, Netlify, mobile, any device)
  async function callGeminiDirectClient(userMessage, apiKey) {
    // Model fallback chain: gemini-2.5-flash -> gemini-1.5-flash -> gemini-1.5-pro
    const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];

    const contents = [];
    for (const item of chatHistory) {
      contents.push({
        role: item.role === 'user' ? 'user' : 'model',
        parts: [{ text: item.text }]
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    let lastError = null;

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
        const bodyPayload = {
          system_instruction: {
            parts: [{ text: MATERNA_SYSTEM_INSTRUCTION }]
          },
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800
          }
        };

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload)
        });

        if (response.ok) {
          const data = await response.json();
          const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return {
              reply: replyText,
              source: 'google_gemini_client',
              model: model
            };
          }
        } else {
          const errData = await response.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${response.status}`;
          console.warn(`Gemini model ${model} failed:`, lastError);
        }
      } catch (err) {
        lastError = err.message;
        console.warn(`Fetch error for ${model}:`, err);
      }
    }

    throw new Error(lastError || 'Could not connect to Google Gemini API');
  }

  // Call Backend FastAPI Proxy if available
  async function callBackendChatApi(userMessage, apiKey) {
    const payload = {
      message: userMessage,
      history: chatHistory,
      api_key: apiKey || null
    };

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Backend returned status ${response.status}`);
    }

    return await response.json();
  }

  // Comprehensive Local Clinical Doula Knowledge Base (Zero API Key Fallback)
  function getLocalDoulaResponse(userMessage) {
    const msg = userMessage.toLowerCase();

    // 1. Schemes & Government Grants (Dynamic Scenario Intelligence)
    if (msg.includes('scheme') || msg.includes('pmmvy') || msg.includes('grant') || msg.includes('money') || msg.includes('jsy') || msg.includes('pmsma') || msg.includes('ayushman') || msg.includes('dbt') || msg.includes('benefit') || msg.includes('kcr') || msg.includes('mrmbs') || msg.includes('igmpy') || msg.includes('sumangala') || msg.includes('ladli')) {
      
      let stateAddon = "";
      if (msg.includes('tamil') || msg.includes('tn') || msg.includes('chennai')) {
        stateAddon = "\n\n🌟 **Tamil Nadu Special (Dr. Muthulakshmi Reddy MRMBS)**:\n- **₹ 18,000 total** (₹ 14,000 cash in 5 DBT tranches + 2 Amma Nutrition Kits worth ₹ 4,000) for 1st & 2nd child in government health facilities!";
      } else if (msg.includes('telangana') || msg.includes('hyderabad') || msg.includes('kcr')) {
        stateAddon = "\n\n🌟 **Telangana Special (KCR Kit & Nutrition Scheme)**:\n- **₹ 12,000** (Boy) / **₹ 13,000** (Girl) direct cash in 3 tranches + ₹ 2,000 KCR 16-item mother-baby kit for delivery in public hospitals!";
      } else if (msg.includes('rajasthan') || msg.includes('jaipur') || msg.includes('igmpy')) {
        stateAddon = "\n\n🌟 **Rajasthan Special (Indira Gandhi Matritva Poshan IGMPY)**:\n- **₹ 6,000 cash grant** in 5 installments specifically for the **2nd child** (boy or girl!), covering what central PMMVY doesn't!";
      } else if (msg.includes('up') || msg.includes('uttar pradesh') || msg.includes('lucknow') || msg.includes('sumangala')) {
        stateAddon = "\n\n🌟 **Uttar Pradesh Special (Mukhyamantri Kanya Sumangala)**:\n- Up to **₹ 25,000 structured grant** for girl child (₹ 5,000 at birth/infant vaccines) + universal JSY LPS ₹ 1,400 rural grant!";
      } else if (msg.includes('bihar') || msg.includes('patna') || msg.includes('utthan')) {
        stateAddon = "\n\n🌟 **Bihar Special (Mukhya Mantri Kanya Utthan)**:\n- **₹ 5,000** (₹ 2,000 at birth + ₹ 1,000 Aadhaar link + ₹ 2,000 vaccines) for girl child + universal JSY LPS institutional incentive!";
      } else if (msg.includes('haryana') || msg.includes('gurgaon') || msg.includes('ladli')) {
        stateAddon = "\n\n🌟 **Haryana Special (Mukhyamantri Matrutva & Ladli)**:\n- **₹ 5,000** grant for 2nd child in BPL/SC/ST families + **₹ 5,000/yr for 5 yrs** if 2nd child is a girl under Ladli Scheme!";
      }

      let parityInfo = "";
      if (msg.includes('second') || msg.includes('2nd')) {
        if (msg.includes('girl') || msg.includes('beti') || msg.includes('daughter')) {
          parityInfo = "\n\n👧 **For 2nd Child (Girl Child)**: Under PMMVY 2.0 revised rules, you are entitled to a special one-time grant of **₹ 6,000** credited straight to your Aadhaar-seeded bank account upon primary immunization!";
        } else {
          parityInfo = "\n\n👦 **For 2nd Child (Boy Child)**: Central PMMVY focuses on 1st child and 2nd girl child, but you remain 100% eligible for **Janani Suraksha Yojana (JSY ₹ 1,400)**, **JSSK 100% Free Hospital Delivery**, and state-specific grants (like Rajasthan IGMPY ₹6,000 or Haryana Matrutva ₹5,000)!";
        }
      }

      return `### 💰 Dynamic Indian Government Maternity & DBT Scheme Intelligence

• **Pradhan Mantri Matru Vandana Yojana (PMMVY 2.0)**:
  - **₹ 5,000 cash grant** in 2 DBT tranches for 1st child (Tranche 1: ₹ 3,000 on early ANC registration; Tranche 2: ₹ 2,000 on birth & vaccines).
  - **₹ 6,000 grant** for 2nd child if the baby is a girl child.

• **Janani Suraksha Yojana (JSY)**:
  - **₹ 1,400 (Rural)** / **₹ 1,000 (Urban)** direct cash transfer for institutional delivery in public/accredited hospitals (+ ₹ 600 / ₹ 400 ASHA worker incentive).

• **Janani Shishu Suraksha Karyakram (JSSK)**:
  - **100% Free & Cashless Zero-Expense Delivery**: Free C-section, free lab diagnostics & ultrasound, free medicines, free food, 102 ambulance pickup & drop, and sick newborn care up to 1 year (~ ₹ 12,000 saved).

• **Ayushman Bharat PM-JAY**:
  - **₹ 5,00,000 / family / year** cashless hospital cover for delivery complications and tertiary NICU admissions.${parityInfo}${stateAddon}

👉 *Use the interactive calculator in Section 4 above to simulate your exact state and demographic profile, and auto-apply via the Document Vault!*`;
    }

    // 2. Nutrition & Diet Plan
    if (msg.includes('diet') || msg.includes('eat') || msg.includes('food') || msg.includes('nutrition') || msg.includes('fruit') || msg.includes('protein')) {
      return `### 🥗 Trimester Nutrition & Indian Diet Guide

• **Hemoglobin & Iron Rich (Prevent Anemia)**:
  - Fresh *Palak* (spinach), *Methi*, Beetroot, Jaggery (*Gur* with roasted chana), Pomegranate (*Anar*), and Sprouted Moong.
  - Take your Iron-Folic Acid (IFA) tablets 2 hours away from tea/coffee.

• **Fetal Bone & Skeletal Strength (Calcium)**:
  - *Ragi* (finger millet) roti or porridge, Paneer, Curd (*Dahi*), and 2 glasses of milk daily.

• **Brain & Neural Development (DHA / Folate)**:
  - Soaked Walnuts (*Akhrot*), Almonds (*Badam*), Flaxseeds, and whole lentils (*Dal*).

• **Essential Hydration**:
  - 2.5 to 3 Liters daily: Fresh Tender Coconut Water, Buttermilk (*Chaas*), Lemon water (*Nimbu pani*).

⚠️ *Avoid*: Raw papaya, excessive caffeine, unpasteurized dairy, and raw undercooked sprouts.`;
    }

    // 3. Fetal Kicks & Baby Movements
    if (msg.includes('kick') || msg.includes('movement') || msg.includes('active') || msg.includes('baby move')) {
      return `### 👶 Fetal Kick Counting (Trimester 3 Guide)

• **Standard Benchmark**:
  - From **Week 28 onwards**, your baby establishes clear sleep-wake cycles.
  - Aim for **at least 10 distinct movements (kicks, rolls, flutters) within a 2-hour window**, preferably after lunch or dinner.

• **If Baby Feels Less Active**:
  1. Drink a glass of cold water or fresh fruit juice.
  2. Lie down calmly on your **left side** (this maximizes blood and oxygen flow through the placenta).
  3. Gently place your hand on your belly and count kicks.

🚨 **When to Alert Your OB-GYN**:
If you feel fewer than 10 kicks in 2 hours despite resting on your left side, please visit your clinic immediately or tap the **Materna Emergency SOS** button!`;
    }

    // 4. Danger Signs / Swelling / Headache / BP
    if (msg.includes('swelling') || msg.includes('headache') || msg.includes('bp') || msg.includes('pressure') || msg.includes('bleed') || msg.includes('pain') || msg.includes('fever')) {
      return `### 🩺 Maternal Vitals & Danger Sign Triage

• **Normal vs. Warning Swelling**:
  - *Normal Physiological Swelling*: Mild puffiness in ankles/feet at the end of the day that improves when feet are elevated.
  - *Warning Sign (Pre-eclampsia)*: Sudden swelling in the face, hands, or around the eyes, especially if accompanied by a severe headache or visual blurring.

• **Critical Red Flags Requiring Immediate Care**:
  - 🚨 Severe persistent headache that doesn't subside with rest.
  - 🚨 Systolic BP >= 140 or Diastolic BP >= 90 mmHg.
  - 🚨 Vaginal bleeding or continuous watery fluid leakage.
  - 🚨 Sharp upper right abdominal pain or severe vomiting.
  - 🚨 Maternal fever above 100.4°F (38°C).

👉 *Please use the **Emergency SOS** button above or call +91 1800-65-9555 if experiencing any of these red flags.*`;
    }

    // 5. Newborn & Postpartum Baby Care
    if (msg.includes('baby') || msg.includes('newborn') || msg.includes('breastfeed') || msg.includes('milk') || msg.includes('latch') || msg.includes('vaccin')) {
      return `### 🍼 Newborn Care & Breastfeeding Guide

• **Golden Hour Breastfeeding**:
  - Initiate breastfeeding within the **first 1 hour of birth**. Early yellow colostrum is the baby's first natural immunization.
  - Practice exclusive breastfeeding (EBF) for the first 6 months (no water, honey, or top milk needed).

• **Effective Latching Signs**:
  - Baby's chin touches the breast, mouth opened wide, lower lip turned outward, and areola is covered more below than above.

• **Newborn Sleep & Temperature**:
  - Keep baby warm through **Kangaroo Mother Care (skin-to-skin)**.
  - Baby should urinate 6–8 times daily and pass soft stools, indicating adequate breastmilk intake.

• **National Immunization Schedule (Birth)**:
  - BCG, Zero-dose Polio (OPV), and Hepatitis B within the first 24 hours.`;
    }

    // Default friendly doula reply
    return `Namaste! As your **Materna Saathi**, I'm here to support you and your baby through every gestational milestone.

Regarding *"${userMessage}"*:
• **Daily Maternal Tips**: Keep hydrated (2.5L+), sleep comfortably on your left side, take your prenatal vitamins, and record your daily vitals in the dashboard above.
• **Danger Sign Reminder**: If you notice severe headaches, sudden facial swelling, or reduced baby kicks, please connect with your OB-GYN or trigger the Materna SOS immediately.

*(Tip: You can connect your free Google Gemini API Key in the top-right Settings ⚙️ for unlimited live interactive AI on any device!)*`;
  }

  // Handle Main User Message Submission
  window.handleUserMessage = async function (e) {
    if (e) e.preventDefault();
    if (isSending) return;

    const input = document.getElementById('chat-user-input');
    const container = document.getElementById('chat-messages');
    if (!input || !container) return;

    const userText = input.value.trim();
    if (!userText) return;

    isSending = true;
    input.value = '';

    // Append User Bubble
    const userBubble = document.createElement('div');
    userBubble.className = "flex items-start justify-end gap-2";
    userBubble.innerHTML = `
      <div class="bg-gradient-to-r from-purple-800 to-indigo-800 text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] shadow-sm text-xs leading-relaxed">
        <p>${userText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      </div>
      <div class="w-7 h-7 rounded-full bg-slate-800 text-purple-200 flex items-center justify-center text-[10px] shrink-0 font-bold shadow">
        YOU
      </div>
    `;
    container.appendChild(userBubble);
    container.scrollTop = container.scrollHeight;

    // Append Typing Indicator Bubble
    const typingBubble = document.createElement('div');
    typingBubble.id = 'chat-typing-indicator';
    typingBubble.className = "flex items-start gap-2";
    typingBubble.innerHTML = `
      <div class="w-7 h-7 rounded-full bg-purple-700 text-white flex items-center justify-center text-xs shrink-0 shadow">🌸</div>
      <div class="bg-white p-3 rounded-2xl rounded-tl-none border border-purple-100 shadow-sm max-w-[85%] text-slate-500 text-xs flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce [animation-delay:0.2s]"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]"></span>
        <span class="text-[11px] text-purple-700 font-medium ml-1">Saathi is thinking...</span>
      </div>
    `;
    container.appendChild(typingBubble);
    container.scrollTop = container.scrollHeight;

    const storedApiKey = getStoredApiKey();
    let replyText = '';
    let engineSource = 'local';
    let modelName = 'Doula Knowledge Engine';

    try {
      if (storedApiKey) {
        // Option 1: Direct Client-Side Gemini REST API
        try {
          const geminiResult = await callGeminiDirectClient(userText, storedApiKey);
          replyText = geminiResult.reply;
          engineSource = 'gemini';
          modelName = geminiResult.model;
        } catch (directErr) {
          console.warn('Direct Gemini API call failed, trying backend proxy:', directErr);
          // Try backend proxy as fallback
          try {
            const backendResult = await callBackendChatApi(userText, storedApiKey);
            replyText = backendResult.reply;
            engineSource = backendResult.source;
            modelName = backendResult.model || 'gemini-2.5-flash';
          } catch (backErr) {
            console.warn('Backend proxy also unavailable, falling back to clinical doula:', backErr);
            replyText = getLocalDoulaResponse(userText);
            engineSource = 'local_fallback';
            modelName = 'Local Doula Engine';
          }
        }
      } else {
        // Option 2: No client key set -> Try Backend API or use built-in clinical doula
        try {
          const backendResult = await callBackendChatApi(userText, null);
          replyText = backendResult.reply;
          engineSource = backendResult.source;
          modelName = backendResult.model || 'Backend Engine';
        } catch (backErr) {
          replyText = getLocalDoulaResponse(userText);
          engineSource = 'local_doula';
          modelName = 'Local Clinical Doula';
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      replyText = getLocalDoulaResponse(userText);
      engineSource = 'error_fallback';
      modelName = 'Local Clinical Doula';
    } finally {
      // Remove Typing Indicator
      const indicator = document.getElementById('chat-typing-indicator');
      if (indicator) indicator.remove();
      isSending = false;
    }

    // Save into history
    chatHistory.push({ role: 'user', text: userText });
    chatHistory.push({ role: 'model', text: replyText });
    if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);

    // Format Markdown into Clean HTML
    const formattedHtml = formatMarkdown(replyText);

    // Engine Badge
    let sourcePill = '';
    if (engineSource === 'gemini' || engineSource === 'google_gemini_client' || engineSource === 'google_gemini_api') {
      sourcePill = `<span class="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">✨ Google Gemini (${modelName})</span>`;
    } else {
      sourcePill = `<span class="text-[9px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold border border-purple-200">🌸 Materna Doula</span>`;
    }

    // Append Bot Bubble
    const botBubble = document.createElement('div');
    botBubble.className = "flex items-start gap-2";
    botBubble.innerHTML = `
      <div class="w-7 h-7 rounded-full bg-purple-700 text-white flex items-center justify-center text-xs shrink-0 shadow">🌸</div>
      <div class="bg-white p-3.5 rounded-2xl rounded-tl-none border border-purple-100 shadow-sm max-w-[88%] text-slate-800 space-y-1.5 text-xs">
        <div class="flex items-center justify-between border-b border-purple-50 pb-1 mb-1">
          <span class="font-bold text-purple-900 text-[11px]">Materna Saathi</span>
          ${sourcePill}
        </div>
        <div class="space-y-1">${formattedHtml}</div>
      </div>
    `;
    container.appendChild(botBubble);
    container.scrollTop = container.scrollHeight;
  };

  // Initialize on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    updateApiKeyStatusBadge();
  });

})();
