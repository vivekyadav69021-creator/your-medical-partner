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
        
        {/* Assistant Widget Styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          #floatingAssistant { position: fixed; right: 18px; bottom: 18px; z-index: 99999; font-family: Inter, Arial, sans-serif; }
          #assistantBubble { width:64px; height:64px; border-radius:50%; background:#1398d8; color:white; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 30px rgba(0,0,0,0.18); cursor:pointer; font-weight: bold; font-size: 24px;}
          #assistantPanel { width:360px; max-width:92vw; background:#fff; border-radius:12px; box-shadow:0 20px 40px rgba(0,0,0,0.2); overflow:hidden; display:none; flex-direction:column; color: #333; }
          #assistantHeader { background:linear-gradient(90deg,#1aa3d7,#1280b0); color:#fff; padding:12px 14px; display:flex; align-items:center; justify-content:space-between; }
          #assistantHeader h4{ margin:0; font-size:15px; }
          #assistantBody { padding:12px; max-height:360px; overflow:auto; }
          #assistantFooter { padding:10px; border-top:1px solid #eee; display:flex; gap:8px; align-items:center; }
          .assistInput{ flex:1; padding:10px;border-radius:8px;border:1px solid #ddd; }
          .assistBtn{ padding:8px 10px;border-radius:8px;border:0;background:#1398d8;color:#fff; cursor:pointer; }
          .msg{ margin:8px 0; display:block; }
          .msg.user{ text-align:right; }
          .msg.user .bubble{ display:inline-block; background:#e6f6ff; padding:8px 10px; border-radius:10px; text-align:left;}
          .msg.assist .bubble{ display:inline-block; background:#f6f8fb; padding:8px 10px; border-radius:10px; }
          .msg .meta{ font-size:11px;color:#777;margin-top:4px; }
          .sendToPageBtn{ margin-top:6px; display:inline-block; background:#e9f7ff; color:#0b6b87; padding:6px 8px; border-radius:8px; cursor:pointer; font-size:13px; border:1px solid #cceef9; }
        `}} />
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

        {/* Assistant Widget HTML */}
        <div id="floatingAssistant" aria-live="polite">
          <div id="assistantBubble" title="Open Assistant" role="button">AI</div>
          <div id="assistantPanel" role="dialog" aria-label="AI Assistant">
            <div id="assistantHeader">
              <h4>Your Medical Partner — Assistant</h4>
              <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                <select id="assistantLang" style={{borderRadius:'8px',padding:'6px',border:'0', color: '#333'}}>
                  <option value="en">EN</option>
                  <option value="hi">हिंदी</option>
                </select>
                <button id="assistantClose" style={{background:'transparent',border:'0',color:'#fff',fontSize:'18px',cursor:'pointer'}}>✕</button>
              </div>
            </div>
            <div id="assistantBody" aria-live="polite"></div>
            <div id="assistantFooter">
              <input id="assistantInput" className="assistInput" placeholder="Ask about any feature..." />
              <button id="assistantSend" className="assistBtn">Ask</button>
            </div>
          </div>
        </div>

        {/* Firebase Bridge and Assistant Widget Script */}
        <Script id="firebase-assistant-widget" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
          (function() {
            // This function creates a bridge between modern Firebase SDK and the legacy global object the script expects.
            function initializeFirebaseBridge() {
              const checkInterval = setInterval(() => {
                if (window.firebase?.app) {
                  // Firebase seems to be initialized by the main app
                  // Make firestore and auth available on the global object for the assistant script
                  window.firebase.firestore = window.firebase.firestore || window.firebase.app.firestore;
                  window.firebase.auth = window.firebase.auth || window.firebase.app.auth;

                  // Now that Firebase is ready, initialize the assistant
                  initAssistant();
                  clearInterval(checkInterval);
                }
              }, 100);
            }

            /* Assistant Widget — Client-side Logic */
            const AI_ENDPOINT = null;
            const FIRESTORE_COLLECTION = 'featureDocs';
            const ENABLE_REMOTE_AI = !!AI_ENDPOINT;

            function navigateTo(path) {
              if (path) window.location.href = path.startsWith('/') ? path : '/' + path;
            }

            const bubble = document.getElementById('assistantBubble');
            const panel = document.getElementById('assistantPanel');
            const closeBtn = document.getElementById('assistantClose');
            const bodyEl = document.getElementById('assistantBody');
            const inputEl = document.getElementById('assistantInput');
            const sendBtn = document.getElementById('assistantSend');
            const langSel = document.getElementById('assistantLang');

            let chatHistory = JSON.parse(sessionStorage.getItem('amp_chat_history_v1') || '[]');

            function renderHistory() {
              if (!bodyEl) return;
              bodyEl.innerHTML = '';
              chatHistory.slice(-30).forEach(msg => {
                const wrap = document.createElement('div');
                wrap.className = 'msg ' + (msg.role === 'user' ? 'user' : 'assist');
                const bubble = document.createElement('div');
                bubble.className = 'bubble';
                bubble.innerHTML = sanitize(msg.text);
                wrap.appendChild(bubble);
                if (msg.meta && msg.meta.path) {
                  const btn = document.createElement('div');
                  btn.className = 'sendToPageBtn';
                  btn.textContent = (langSel.value === 'hi') ? 'पेज खोलें' : 'Open page';
                  btn.onclick = () => navigateTo(msg.meta.path);
                  wrap.appendChild(btn);
                }
                bodyEl.appendChild(wrap);
              });
              bodyEl.scrollTop = bodyEl.scrollHeight;
            }

            function sanitize(s) { return String(s || '').replace(/<|>/g, (c) => (c === '<' ? '&lt;' : '&gt;')).replace(/\\n/g, '<br>'); }

            if (bubble) bubble.addEventListener('click', () => { if (panel) panel.style.display = 'flex'; if (inputEl) inputEl.focus(); renderHistory(); });
            if (closeBtn) closeBtn.addEventListener('click', () => { if (panel) panel.style.display = 'none'; });

            async function onAsk() {
              if (!inputEl.value.trim()) return;
              const q = inputEl.value.trim();
              const lang = langSel.value || 'en';
              appendUserMessage(q);
              inputEl.value = '';
              renderHistory();

              const localResp = await findLocalFeature(q, lang);
              if (localResp && localResp.found) {
                appendAssistantMessage(localResp.answer, localResp.meta);
              } else if (ENABLE_REMOTE_AI) {
                // Remote AI logic (currently disabled)
              } else {
                appendAssistantMessage((lang === 'hi') ? 'क्षमा करें, इस विषय पर जानकारी उपलब्ध नहीं है।' : 'Sorry, I do not have information on that feature right now.');
              }
              renderHistory();
              saveSession();
            }
            
            if (sendBtn) sendBtn.addEventListener('click', onAsk);
            if (inputEl) inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') onAsk(); });

            function appendUserMessage(text) { chatHistory.push({ role: 'user', text, ts: Date.now() }); saveSession(); }
            function appendAssistantMessage(text, meta = null) { chatHistory.push({ role: 'assistant', text, meta, ts: Date.now() }); saveSession(); }
            function saveSession() { sessionStorage.setItem('amp_chat_history_v1', JSON.stringify(chatHistory)); }

            async function findLocalFeature(query, lang) {
              try {
                if (!window.firebase || !window.firebase.firestore) return null;
                const db = window.firebase.firestore();
                const col = db.collection(FIRESTORE_COLLECTION);
                const qLower = query.trim().toLowerCase();
                const snapshot = await col.limit(50).get();
                const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

                const results = docs.map(doc => {
                  let score = 0;
                  const title = (doc.title || '').toLowerCase();
                  if (title.includes(qLower)) score += 50;
                  if ((doc.slug || '').toLowerCase().includes(qLower)) score += 40;
                  if ((doc.content_en || '').toLowerCase().includes(qLower) || (doc.content_hi || '').toLowerCase().includes(qLower)) score += 20;
                  return { doc, score };
                }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);

                if (results.length) {
                  const best = results[0].doc;
                  const answer = (lang === 'hi') ? (best.content_hi || best.content_en) : (best.content_en || best.content_hi);
                  return { found: true, answer, meta: { id: best.id, path: best.path || null, title: best.title || null } };
                }
                return null;
              } catch (e) {
                console.warn('local lookup error', e);
                return null;
              }
            }
            
            async function seedSampleDocs() {
              try {
                if (!window.firebase || !window.firebase.firestore) return;
                const db = window.firebase.firestore();
                const col = db.collection(FIRESTORE_COLLECTION);
                const snap = await col.limit(1).get();
                if (!snap.empty) return;
                const sample = [
                  { id: 'how_to_book_doctor', title: 'Doctor Consultation', slug: 'doctor-consult', content_en: 'To book a doctor: open Consultations -> choose a doctor -> select date/time -> confirm.', content_hi: 'Doctor book karne ke liye: Consultations kholen -> doctor chunen -> date/time select karein -> confirm karein.', path: '/consultation' },
                  { id: 'disease_scanner', title: 'Disease Scanner', slug: 'disease-scanner', content_en: 'Use the Disease Scanner to analyze X-rays, lab reports, or images of physical symptoms.', content_hi: 'Disease Scanner ka istemal karke X-ray, lab report, ya sharirik lakshano ki tasveer ka vishleshan karein.', path: '/disease-scanner' },
                  { id: 'med_store', title: 'Medical Store', slug: 'medical-store', content_en: 'In the Medical Store, you can search for medicines or upload a prescription to find available products.', content_hi: 'Medical Store me aap dawai search kar sakte hain, ya prescription upload karke uplabdh dawai khoj sakte hain.', path: '/store' }
                ];
                const batch = db.batch();
                sample.forEach(d => {
                  const docRef = col.doc(d.id);
                  batch.set(docRef, d);
                });
                await batch.commit();
                console.log('Seeded sample featureDocs');
              } catch (e) { console.warn('Seed sample failed', e); }
            }

            async function initAssistant() {
              await seedSampleDocs();
              renderHistory();
            }

            initializeFirebaseBridge();

            window.amps_openAndAsk = async function(question) {
              if(panel) panel.style.display = 'flex';
              if(inputEl) inputEl.value = question;
              await onAsk();
            };
          })();
        `}} />
      </body>
    </html>
  );
}
