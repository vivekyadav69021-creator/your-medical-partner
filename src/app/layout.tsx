
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

  const assistantStyle = {
    position: 'fixed' as 'fixed',
    right: '20px',
    bottom: '24px',
    width: '360px',
    maxWidth: 'calc(100% - 40px)',
    fontFamily: 'Inter, Arial, sans-serif',
    zIndex: 99999,
  };
  
  const toggleStyle = {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: '#0ea5e9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700,
    boxShadow: '0 10px 30px rgba(2,6,23,0.2)',
    cursor: 'pointer',
  };

  const panelStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 14px 40px rgba(2,6,23,0.18)',
    overflow: 'hidden',
    width: '100%',
    maxHeight: '70vh',
    display: 'none',
    flexDirection: 'column',
    color: '#0f172a',
  };

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
        
        <div id="ympAssistant" style={assistantStyle} aria-hidden="true">
          <div id="ympToggle" style={toggleStyle} title="Your Medical Partner (AI)"><span>YMP</span></div>
          <div id="ympPanel" style={panelStyle}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'12px 14px',borderBottom:'1px solid #f0f3f7'}}>
              <div style={{flex:'1'}}>
                <div style={{fontWeight:700, color:'#0f172a'}}>Your Medical Partner</div>
                <div className="small" style={{fontSize:'12px',color:'#475569'}}>Ask about any feature — get instant answers & navigate.</div>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'4px'}}>
                <select id="ympLang" className="langToggle" title="Language" style={{border:'1px solid #e6eef6',padding:'6px',borderRadius:'8px',background:'#fff',cursor:'pointer'}}>
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                </select>
                <button id="ympClose" className="linkBtn" style={{marginTop:'6px', background:'#f1f5f9',border:'1px solid #e6eef6',padding:'6px 8px',borderRadius:'8px',cursor:'pointer',color:'#0f172a'}}>Close</button>
              </div>
            </div>
            <div id="ympBody" style={{padding:'12px', overflow:'auto', flex:'1'}} role="log" aria-live="polite"></div>
            <div style={{padding:'0 12px'}}>
              <div id="ympQuick" style={{display:'flex',gap:'8px',flexWrap:'wrap',marginTop:'8px'}}></div>
            </div>
            <div style={{display:'flex',gap:'8px',padding:'10px',borderTop:'1px solid #f0f3f7',alignItems:'center'}}>
              <input id="ympInput" className="ymp-input" placeholder="Ask about: doctor booking, planner, disease scanner..." style={{flex:'1',padding:'10px',borderRadius:'8px',border:'1px solid #e6eef6'}}/>
              <button id="ympSend" className="ymp-btn" style={{background:'#0ea5e9',color:'white',padding:'8px 10px',borderRadius:'8px',border:0,cursor:'pointer'}}>Ask</button>
              <button id="ympClear" className="linkBtn" title="Clear" style={{background:'#f1f5f9',border:'1px solid #e6eef6',padding:'6px 8px',borderRadius:'8px',cursor:'pointer',color:'#0f172a'}}>Clear</button>
            </div>
          </div>
        </div>

        <script id="feature-assistant-widget-script" dangerouslySetInnerHTML={{ __html: `
              /*
                YMP — AI Flow Assistant (client-side widget)
              */

              /* -------- CONFIG -------- */
              const FUNCTION_ENDPOINT = null; 
              const enableFirestoreSave = false;
              const panelWidth = 360;

              /* --------- Knowledge Base (KB) --------- */
              const YMP_KB = [
                {
                  id: 'dashboard',
                  keywords: ['dashboard', 'home', 'main screen'],
                  featureId: 'dashboard',
                  answer_en: 'Dashboard shows your profile, quick health score, appointments, and quick-access tiles to features like Disease Scanner, AI Assistant, and Medical Store.',
                  answer_hi: 'डैशबोर्ड में आपका प्रोफ़ाइल, क्विक हेल्थ स्कोर, अपॉइंटमेंट और Disease Scanner, AI Assistant तथा Medical Store जैसे फास्ट-एक्सेस टाइल दिखती हैं।'
                },
                {
                  id: 'doctor_consult',
                  keywords: ['doctor', 'consultation', 'book doctor', 'appointment'],
                  featureId: 'consultation',
                  answer_en: 'Doctor Consultation feature lets you choose Indian or Foreign doctors, pick date/time, set reminders, and start video call with the booked doctor.',
                  answer_hi: 'Doctor Consultation फिचर में आप Indian या Foreign doctor चुन सकते हैं, तारीख/समय सेट कर सकते हैं, रिमाइंडर जोड़ सकते हैं और वीडियो कॉल शुरू कर सकते हैं।'
                },
                {
                  id: 'disease_scanner',
                  keywords: ['disease scanner','scan disease','scanner','scan image'],
                  featureId: 'disease-scanner',
                  answer_en: 'Disease Scanner accepts images (camera/front/back) and provides a preliminary analysis, plus option to chat further with the AI for symptom details.',
                  answer_hi: 'Disease Scanner तस्वीर ले कर प्रारम्भिक विश्लेषण देता है और उपयोगकर्ता वार्ता के जरिए लक्षणों की और जानकारी भी दे सकता है।'
                },
                {
                  id: 'nearby_hospitals',
                  keywords: ['nearby hospital','hospital','nearby'],
                  featureId: 'nearby-hospital',
                  answer_en: 'Nearby Hospitals fetches hospitals close to your location using OpenStreetMap-based geolocation. You can view addresses and call the hospital.',
                  answer_hi: 'Nearby Hospitals आपके आस-पास के अस्पताल दिखाता है (OpenStreetMap आधारित)। आप उनका पता देख सकते हैं और कॉल कर सकते हैं।'
                },
                {
                  id: 'store',
                  keywords: ['medical store','medicine store','buy medicine','pharmacy'],
                  featureId: 'store',
                  answer_en: 'Medical Store contains the medicine catalog with Indian prices, product details and buy flow (cart & checkout).',
                  answer_hi: 'Medical Store में दवाओं की सूची, मूल्य और खरीदने का प्रोसेस (कार्ट और चेकआउट) उपलब्ध है।'
                },
                {
                  id: 'health-assistant',
                  keywords: ['ai assistant','chatbot','health assistant'],
                  featureId: 'health-assistant',
                  answer_en: 'AI Health Assistant answers medical questions, provides suggestions and supports Hindi & English. Currently it is knowledge-base backed and can be extended via admin.',
                  answer_hi: 'AI Health Assistant हिंदी और अंग्रेज़ी में सवालों के जवाब देता है। यह फिलहाल KB & LLM fallback से चलता है।'
                },
                {
                  id: 'planner',
                  keywords: ['planner','health planner','create plan'],
                  featureId: 'planner',
                  answer_en: 'Health Planner builds a weekly scientific plan based on user details (BMI, calories, exercise). You can download it as PDF and save to profile.',
                  answer_hi: 'Health Planner उपयोगकर्ता के विवरण के आधार पर 7-दिन का प्लान बनाता है — PDF डाउनलोड और प्रोफ़ाइल में सेव किया जा सकता है।'
                },
              ];

              /* --------- Widget state & helpers --------- */
              const panel = document.getElementById('ympPanel');
              const toggle = document.getElementById('ympToggle');
              const closeBtn = document.getElementById('ympClose');
              const body = document.getElementById('ympBody');
              const input = document.getElementById('ympInput');
              const sendBtn = document.getElementById('ympSend');
              const clearBtn = document.getElementById('ympClear');
              const quick = document.getElementById('ympQuick');
              const langSel = document.getElementById('ympLang');

              let visible = false;
              let sessionId = sessionStorage.getItem('ymp_session') || ('sess_' + Date.now());
              sessionStorage.setItem('ymp_session', sessionId);
              let chatHistory = JSON.parse(sessionStorage.getItem('ymp_history_' + sessionId) || '[]');

              function saveHistory(){ sessionStorage.setItem('ymp_history_' + sessionId, JSON.stringify(chatHistory)); }
              function addMessage(role, text, meta){ chatHistory.push({ts:Date.now(), role, text, meta}); saveHistory(); renderMessages(); }
              function escapeHtml(s){ return String(s||'').replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }
              function renderMessages(){
                body.innerHTML = '';
                chatHistory.slice(-40).forEach(m=>{
                  const d = document.createElement('div');
                  d.className = 'ymp-msg ' + (m.role==='user'?'user':'bot');
                  d.innerHTML = escapeHtml(m.text).replace(/\\n/g, '<br>');
                  if(m.meta && m.meta.featureId){
                    const btn = document.createElement('button');
                    btn.className = 'linkBtn';
                    btn.style.marginTop='6px';
                    btn.textContent = (langSel.value==='hi') ? 'फ़ीचर खोलें' : 'Open feature';
                    btn.addEventListener('click', ()=> triggerNavigate(m.meta.featureId));
                    d.appendChild(btn);
                  }
                  body.appendChild(d);
                });
                body.scrollTop = body.scrollHeight;
              }

              /* Quick chips */
              const quickChips = [
                {q_en:'How to book doctor?', q_hi:'Doctor kaise book kare?', kb:'doctor_consult'},
                {q_en:'Open Disease Scanner', q_hi:'Disease Scanner kholo', kb:'disease_scanner'},
                {q_en:'Nearby hospitals', q_hi:'Nazar ke hospital', kb:'nearby_hospitals'},
              ];
              function renderQuick(){ quick.innerHTML=''; quickChips.forEach(c=>{
                const txt = langSel.value==='hi'?c.q_hi:c.q_en;
                const chip = document.createElement('div');
                chip.className='chip';
                chip.style.background = '#f1f5f9';
                chip.style.borderRadius = '20px';
                chip.style.padding = '6px 10px';
                chip.style.fontSize = '13px';
                chip.style.cursor = 'pointer';
                chip.style.border = '1px solid #e2e8f0';
                chip.textContent=txt;
                chip.addEventListener('click', ()=> { input.value = txt; onSend(); });
                quick.appendChild(chip);
              }); }
              renderQuick();
              langSel.addEventListener('change', ()=> { renderQuick(); renderMessages(); });

              /* toggle behaviour */
              toggle.addEventListener('click', ()=> {
                visible = !visible;
                panel.style.display = visible ? 'flex' : 'none';
                document.getElementById('ympAssistant').setAttribute('aria-hidden', !visible);
                if(visible) { renderMessages(); input.focus(); }
              });
              closeBtn.addEventListener('click', ()=> { visible=false; panel.style.display='none'; toggle.focus(); });

              /* ---------- Matching & answer logic ---------- */
              function kbSearch(query){
                if(!query || query.trim().length < 2) return null;
                const q = query.toLowerCase();
                for(const item of YMP_KB){
                  for(const k of item.keywords){
                    if(q.includes(k) || k.includes(q) || q.split(' ').some(w=>k.includes(w) || item.keywords.join(' ').includes(w))){
                      return item;
                    }
                  }
                  if((item.answer_en && item.answer_en.toLowerCase().includes(q)) || (item.answer_hi && item.answer_hi.toLowerCase().includes(q))){
                    return item;
                  }
                }
                const tokens = q.split(/\\s+/).filter(Boolean);
                let best = null, bestScore = 0;
                for(const item of YMP_KB){
                  const hay = (item.keywords.join(' ') + ' ' + (item.answer_en||'') + ' ' + (item.answer_hi||'')).toLowerCase();
                  let score = 0;
                  for(const t of tokens) if(hay.includes(t)) score++;
                  if(score > bestScore){ bestScore = score; best = item; }
                }
                if(bestScore >= Math.max(1, Math.floor(tokens.length/2))) return best;
                return null;
              }

              /* navigation hook */
              function triggerNavigate(featureId){
                  const path = '/' + featureId.replace(/Page$/, '');
                  window.location.href = path;
              }

              /* Send flow */
              async function onSend(){
                const text = input.value.trim();
                if(!text) return;
                addMessage('user', text);
                input.value = '';
                const kb = kbSearch(text);
                if(kb){
                  const ans = (langSel.value==='hi' ? (kb.answer_hi || kb.answer_en) : (kb.answer_en || kb.answer_hi));
                  addMessage('bot', ans, { featureId: kb.featureId });
                  return;
                }
                addMessage('bot', (langSel.value==='hi') ? 'Soch raha hoon...' : 'Thinking...', {});
                const res = { status: 'error' }; // Mocking LLM call failure
                if(chatHistory.length && chatHistory[chatHistory.length-1].text.match(/Thinking|Soch raha/)) chatHistory.pop();
                if(res.status === 'ok' && res.text){
                  addMessage('bot', res.text, { featureId: res.featureId || null });
                } else {
                  const failMsg = (langSel.value==='hi') ? 'Mujhe jawab nahi mila. Kripya baad mein dubara koshish karein.' : 'I couldn\\'t get an answer right now. Try again later.';
                  addMessage('bot', failMsg, {});
                }
              }

              /* events */
              sendBtn.addEventListener('click', onSend);
              input.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ onSend(); e.preventDefault(); }});
              clearBtn.addEventListener('click', ()=>{ chatHistory=[]; saveHistory(); renderMessages(); });

              /* initial render */
              renderMessages();

              if(chatHistory.length===0){
                addMessage('bot', (langSel.value==='hi') ? 'Namaste! Main aapka Your Medical Partner assistant hoon. Kisi feature ke baare mein puchhiye — main turant bataunga.' : 'Hi! I am your Your Medical Partner assistant. Ask about any feature and I will help instantly.');
              }
            `}} />
      </body>
    </html>
  );
}

    