
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Your Medical Partner',
  description: 'Your Medical Partner',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossOrigin=""/>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossOrigin=""></script>
        
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>

        {/* AI Flow Assistant Widget */}
        <style dangerouslySetInnerHTML={{ __html: `
          .ymp-assistant { position: fixed; right: 20px; bottom: 24px; width: 360px; max-width: calc(100% - 40px); font-family: Inter, Arial, sans-serif; z-index: 99999; }
          .ymp-toggle { width:56px; height:56px; border-radius:50%; background:#0ea5e9; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; box-shadow:0 10px 30px rgba(2,6,23,0.2); cursor:pointer; }
          .ymp-panel { background:#fff; border-radius:12px; box-shadow:0 14px 40px rgba(2,6,23,0.18); overflow:hidden; width:100%; max-height:70vh; display:flex; flex-direction:column; }
          .ymp-header{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid #f0f3f7}
          .ymp-title{font-weight:700;color:#0f172a}
          .ymp-sub{font-size:12px;color:#475569}
          .ymp-body{padding:12px; overflow:auto; flex:1}
          .ymp-msg{margin:8px 0;padding:10px;border-radius:10px;max-width:86%}
          .ymp-msg.user{background:#e6f7ff;margin-left:auto;color:#073b4c}
          .ymp-msg.bot{background:#f8fafc;color:#0f172a}
          .ymp-footer{display:flex;gap:8px;padding:10px;border-top:1px solid #f0f3f7;align-items:center}
          .ymp-input{flex:1;padding:10px;border-radius:8px;border:1px solid #e6eef6}
          .ymp-btn{background:#0ea5e9;color:white;padding:8px 10px;border-radius:8px;border:0;cursor:pointer}
          .ymp-quick{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
          .chip{background:#f1f5f9;border-radius:20px;padding:6px 10px;font-size:13px;cursor:pointer;border:1px solid #e2e8f0}
          .small{font-size:12px;color:#64748b}
          .ymp-meta{display:flex;flex-direction:column;align-items:flex-end;gap:4px}
          .linkBtn{background:#f1f5f9;border:1px solid #e6eef6;padding:6px 8px;border-radius:8px;cursor:pointer;color:#0f172a}
          .copyBtn{background:#f8fafc;border:1px solid #e2e8f0;padding:6px;border-radius:6px;cursor:pointer}
          .typing{font-style:italic;color:#94a3b8;font-size:13px}
          .langToggle{border:1px solid #e6eef6;padding:6px;border-radius:8px;background:#fff;cursor:pointer}
        `}} />
        <div id="ympAssistant" className="ymp-assistant" aria-hidden="true">
          <div id="ympToggle" className="ymp-toggle" title="Your Medical Partner (AI)"><span>YMP</span></div>
          <div id="ympPanel" className="ymp-panel" style={{display: 'none', width: 360}}>
            <div className="ymp-header">
              <div style={{flex: 1}}>
                <div className="ymp-title">Your Medical Partner</div>
                <div className="ymp-sub small">Ask about any feature — get instant answers & navigate.</div>
              </div>
              <div className="ymp-meta">
                <select id="ympLang" className="langToggle" title="Language">
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                </select>
                <button id="ympClose" className="linkBtn" style={{marginTop: 6}}>Close</button>
              </div>
            </div>
            <div id="ympBody" className="ymp-body" role="log" aria-live="polite"></div>
            <div style={{padding: '0 12px'}}>
              <div className="ymp-quick" id="ympQuick"></div>
            </div>
            <div className="ymp-footer">
              <input id="ympInput" className="ymp-input" placeholder="Ask about: doctor booking, planner, disease scanner..." />
              <button id="ympSend" className="ymp-btn">Ask</button>
              <button id="ympClear" className="linkBtn" title="Clear">Clear</button>
            </div>
          </div>
        </div>
        <script
          id="feature-assistant-widget-script"
          dangerouslySetInnerHTML={{
            __html: `
(function() {
'use strict';

/* -------- CONFIG -------- */
const FUNCTION_ENDPOINT = '/chatAssistant'; // Keep as proxy path
const enableFirestoreSave = false;
const panelWidth = 360;

const YMP_KB = [
  { id: 'dashboard', keywords: ['dashboard', 'home', 'main screen'], featureId: 'dashboardPage', answer_en: 'Dashboard shows your profile, quick health score, appointments, and quick-access tiles to features like Disease Scanner, AI Assistant, and Medical Store.', answer_hi: 'डैशबोर्ड में आपका प्रोफ़ाइल, क्विक हेल्थ स्कोर, अपॉइंटमेंट और Disease Scanner, AI Assistant तथा Medical Store जैसे फास्ट-एक्सेस टाइल दिखती हैं।' },
  { id: 'doctor_consult', keywords: ['doctor', 'consultation', 'book doctor', 'appointment'], featureId: 'consultationPage', answer_en: 'Doctor Consultation feature lets you choose Indian or Foreign doctors, pick date/time, set reminders, and start video call with the booked doctor.', answer_hi: 'Doctor Consultation फिचर में आप Indian या Foreign doctor चुन सकते हैं, तारीख/समय सेट कर सकते हैं, रिमाइंडर जोड़ सकते हैं और वीडियो कॉल शुरू कर सकते हैं।' },
  { id: 'disease_scanner', keywords: ['disease scanner','scan disease','scanner','scan image'], featureId: 'diseaseScannerPage', answer_en: 'Disease Scanner accepts images (camera/front/back) and provides a preliminary analysis, plus option to chat further with the AI for symptom details.', answer_hi: 'Disease Scanner तस्वीर ले कर प्रारम्भिक विश्लेषण देता है और उपयोगकर्ता वार्ता के जरिए लक्षणों की और जानकारी भी दे सकता है।' },
  { id: 'nearby_hospitals', keywords: ['nearby hospital','hospital','nearby'], featureId: 'nearbyHospitalsPage', answer_en: 'Nearby Hospitals fetches hospitals close to your location using OpenStreetMap-based geolocation. You can view addresses and call the hospital.', answer_hi: 'Nearby Hospitals आपके आस-पास के अस्पताल दिखाता है (OpenStreetMap आधारित)। आप उनका पता देख सकते हैं और कॉल कर सकते हैं।' },
  { id: 'medicine_store', keywords: ['medical store','medicine store','buy medicine','pharmacy'], featureId: 'medicineStorePage', answer_en: 'Medical Store contains the medicine catalog with Indian prices, product details and buy flow (cart & checkout).', answer_hi: 'Medical Store में दवाओं की सूची, मूल्य और खरीदने का प्रोसेस (कार्ट और चेकआउट) उपलब्ध है।' },
  { id: 'ai_assistant', keywords: ['ai assistant','chatbot','health assistant'], featureId: 'aiAssistantPage', answer_en: 'AI Health Assistant answers medical questions, provides suggestions and supports Hindi & English. Currently it is knowledge-base backed and can be extended via admin.', answer_hi: 'AI Health Assistant हिंदी और अंग्रेज़ी में सवालों के जवाब देता है। यह फिलहाल KB & LLM fallback से चलता है।' },
  { id: 'planner', keywords: ['planner','health planner','create plan'], featureId: 'plannerPage', answer_en: 'Health Planner builds a weekly scientific plan based on user details (BMI, calories, exercise). You can download it as PDF and save to profile.', answer_hi: 'Health Planner उपयोगकर्ता के विवरण के आधार पर 7-दिन का प्लान बनाता है — PDF डाउनलोड और प्रोफ़ाइल में सेव किया जा सकता है।' },
];

/* --------- UI refs & State --------- */
const panel = document.getElementById('ympPanel');
const toggle = document.getElementById('ympToggle');
const closeBtn = document.getElementById('ympClose');
const body = document.getElementById('ympBody');
const input = document.getElementById('ympInput');
const sendBtn = document.getElementById('ympSend');
const clearBtn = document.getElementById('ympClear');
const quick = document.getElementById('ympQuick');
const langSel = document.getElementById('ympLang');
if (!panel || !toggle || !closeBtn || !body || !input || !sendBtn || !clearBtn || !quick || !langSel) return;


let visible = false;
let sessionId = sessionStorage.getItem('ymp_session') || ('sess_' + Date.now());
sessionStorage.setItem('ymp_session', sessionId);
let chatHistory = JSON.parse(sessionStorage.getItem('ymp_history_' + sessionId) || '[]');

function saveHistory() { sessionStorage.setItem('ymp_history_' + sessionId, JSON.stringify(chatHistory)); }
function addMessage(role, text, meta) { chatHistory.push({ ts: Date.now(), role, text, meta }); saveHistory(); renderMessages(); }
function escapeHtml(s) { return String(s || '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }

function renderMessages() {
  body.innerHTML = '';
  chatHistory.slice(-40).forEach(m => {
    const d = document.createElement('div');
    d.className = 'ymp-msg ' + (m.role === 'user' ? 'user' : 'bot');
    const bubble = document.createElement('div');
    bubble.innerHTML = escapeHtml(m.text);
    d.appendChild(bubble);

    if (m.meta && m.meta.featureId) {
      const btn = document.createElement('button');
      btn.className = 'linkBtn';
      btn.style.marginTop = '6px';
      btn.textContent = (langSel.value === 'hi') ? 'फ़ीचर खोलें' : 'Open feature';
      btn.addEventListener('click', () => triggerNavigate(m.meta.featureId));
      d.appendChild(btn);
    }
    const cp = document.createElement('button');
    cp.className = 'copyBtn';
    cp.textContent = 'Copy';
    cp.style.marginLeft = '8px';
    cp.addEventListener('click', () => { navigator.clipboard.writeText(m.text); cp.textContent = 'Copied'; setTimeout(() => cp.textContent = 'Copy', 1200); });
    d.appendChild(cp);
    body.appendChild(d);
  });
  body.scrollTop = body.scrollHeight;
}

const quickChips = [
  { q_en: 'How to book doctor?', q_hi: 'Doctor kaise book kare?', kb: 'doctor_consult' },
  { q_en: 'Open Disease Scanner', q_hi: 'Disease Scanner kholo', kb: 'disease_scanner' },
  { q_en: 'Nearby hospitals', q_hi: 'Nazar ke hospital', kb: 'nearby_hospitals' },
  { q_en: 'Create health planner', q_hi: 'Health planner banao', kb: 'planner' },
  { q_en: 'How AI assistant works?', q_hi: 'AI assistant kaise kaam karta hai?', kb: 'ai_assistant' },
];

function renderQuick() {
  quick.innerHTML = '';
  quickChips.forEach(c => {
    const txt = langSel.value === 'hi' ? c.q_hi : c.q_en;
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.textContent = txt;
    chip.addEventListener('click', () => { input.value = txt; onSend(); });
    quick.appendChild(chip);
  });
}

function kbSearch(query) {
  if (!query || query.trim().length < 2) return null;
  const q = query.toLowerCase();
  for (const item of YMP_KB) {
    for (const k of item.keywords) {
      if (q.includes(k) || k.includes(q) || q.split(' ').some(w => k.includes(w) || item.keywords.join(' ').includes(w))) {
        return item;
      }
    }
    if ((item.answer_en && item.answer_en.toLowerCase().includes(q)) || (item.answer_hi && item.answer_hi.toLowerCase().includes(q))) {
      return item;
    }
  }
  const tokens = q.split(/\\s+/).filter(Boolean);
  let best = null, bestScore = 0;
  for (const item of YMP_KB) {
    const hay = (item.keywords.join(' ') + ' ' + (item.answer_en || '') + ' ' + (item.answer_hi || '')).toLowerCase();
    let score = 0;
    for (const t of tokens) if (hay.includes(t)) score++;
    if (score > bestScore) { bestScore = score; best = item; }
  }
  if (bestScore >= Math.max(1, Math.floor(tokens.length / 2))) return best;
  return null;
}

async function callLLM(query, lang) {
  try {
    const res = await fetch(FUNCTION_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId, query, lang }) });
    if (!res.ok) throw new Error('LLM endpoint error: ' + res.status);
    return await res.json();
  } catch (err) {
    console.warn('LLM call failed', err);
    return { status: 'error', message: err.message || String(err) };
  }
}

function triggerNavigate(featureId) {
    console.log('ymp:navigate ->', featureId);
    const path = YMP_KB.find(f => f.featureId === featureId)?.path;
    if(path) {
        window.location.href = path;
    } else if (typeof window.appNavigate === 'function') {
        try { window.appNavigate(featureId); } catch (e) { console.warn(e); }
    } else {
        const ev = new CustomEvent('ymp:navigate', { detail: { featureId } });
        window.dispatchEvent(ev);
    }
}

async function onSend() {
  const text = input.value.trim();
  if (!text) return;
  addMessage('user', text);
  input.value = '';
  const kb = kbSearch(text);
  if (kb) {
    const ans = (langSel.value === 'hi' ? (kb.answer_hi || kb.answer_en) : (kb.answer_en || kb.answer_hi));
    addMessage('bot', ans, { featureId: kb.featureId });
    return;
  }
  addMessage('bot', (langSel.value === 'hi') ? 'Soch raha hoon...' : 'Thinking...', {});
  const res = await callLLM(text, langSel.value);
  if (chatHistory.length && chatHistory[chatHistory.length - 1].text.match(/Thinking|Soch raha/)) chatHistory.pop();
  if (res.status === 'ok' && res.text) {
    addMessage('bot', res.text, { featureId: res.featureId || null });
  } else {
    addMessage('bot', (langSel.value === 'hi') ? 'Mujhe jawab nahi mila. Kripya baad mein dubara koshish karein.' : 'I couldn\\'t get an answer right now. Try again later.', {});
  }
}

toggle.addEventListener('click', () => {
  visible = !visible;
  panel.style.display = visible ? 'flex' : 'none';
  document.getElementById('ympAssistant').setAttribute('aria-hidden', String(!visible));
  if (visible) { renderMessages(); input.focus(); }
});
closeBtn.addEventListener('click', () => { visible = false; panel.style.display = 'none'; toggle.focus(); });
document.addEventListener('keydown', (e) => { if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'y') { visible = !visible; panel.style.display = visible ? 'flex' : 'none'; } });
sendBtn.addEventListener('click', onSend);
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { onSend(); e.preventDefault(); } });
clearBtn.addEventListener('click', () => { chatHistory = []; saveHistory(); renderMessages(); });
langSel.addEventListener('change', () => { renderQuick(); renderMessages(); });

if (chatHistory.length === 0) {
  addMessage('bot', (langSel.value === 'hi') ? 'Namaste! Main aapka Your Medical Partner assistant hoon. Kisi feature ke baare mein puchhiye — main turant bataunga.' : 'Hi! I am your Your Medical Partner assistant. Ask about any feature and I will help instantly.');
}

renderMessages();
renderQuick();
setInterval(() => saveHistory(), 3000);

})();
            `,
          }}
        />
      </body>
    </html>
  );
}
