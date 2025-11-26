
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script';
import { featureAssistant } from '@/ai/flows/feature-assistant-flow';

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
          #assistantFooter { padding:10px; border-top:1px solid #eee; display:flex; flex-direction:column; gap:8px; align-items:stretch; }
          .assistInput{ flex:1; padding:10px;border-radius:8px;border:1px solid #ddd; }
          .assistBtn{ padding:8px 10px;border-radius:8px;border:0;background:#1398d8;color:#fff; cursor:pointer; }
          .msg{ margin:8px 0; display:block; }
          .msg.user{ text-align:right; }
          .msg.user .bubble{ display:inline-block; background:#e6f6ff; padding:8px 10px; border-radius:10px; text-align:left;}
          .msg.assist .bubble{ display:inline-block; background:#f6f8fb; padding:8px 10px; border-radius:10px; }
          .msg .meta{ font-size:11px;color:#777;margin-top:4px; }
          .sendToPageBtn{ margin-top:6px; display:inline-block; background:#e9f7ff; color:#0b6b87; padding:6px 8px; border-radius:8px; cursor:pointer; font-size:13px; border:1px solid #cceef9; }
          .voiceWidget{display:flex;gap:8px;align-items:center}
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
          <div id="assistantPanel" role="dialog" aria-label="AI Assistant" style={{ width: 360, maxWidth: '92vw', background: '#fff', borderRadius: 12, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden', display: 'none', flexDirection: 'column' }}>
            <div id="assistantHeader" style={{ background: 'linear-gradient(90deg,#1aa3d7,#1280b0)', color: '#fff', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h4>Your Medical Partner — Assistant</h4>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <select id="assistantLang" style={{ borderRadius: 8, padding: 6, border: 0, color: '#333', background: '#f0f0f0' }}>
                  <option value="en">EN</option>
                  <option value="hi">HI</option>
                </select>
                <button id="assistantClose" style={{ background: 'transparent', border: '0', color: '#fff', fontSize: '18px', cursor: 'pointer' }}>✕</button>
              </div>
            </div>
            <div id="assistantBody" aria-live="polite"></div>
            <div id="assistantFooter" style={{ padding: '10px', borderTop: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'stretch' }}>
                <div className="voiceWidget" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button id="speakBtn" className="assistBtn" title="Speak assistant's reply">🔊</button>
                    <button id="stopSpeechBtn" className="assistBtn" title="Stop speaking">■</button>
                     <select id="voiceLang" style={{ borderRadius: 8, padding: 6, border: 0, color: '#333', background: '#f0f0f0' }}>
                      <option value="en-IN">EN</option>
                      <option value="hi-IN">HI</option>
                    </select>
                    <button id="micBtn" className="assistBtn" title="Start microphone">🎤</button>
                    <span id="micStatus" style={{ fontSize: '12px', color: '#555', flex: 1 }}></span>
                </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input id="assistantInput" className="assistInput" placeholder="Ask about any feature..." />
                <button id="assistantSend" className="assistBtn">Ask</button>
              </div>
            </div>
          </div>
        </div>

        <script
          id="feature-assistant-widget-script"
          dangerouslySetInnerHTML={{
            __html: `
              (async function() {
                // --- DOM References ---
                const bubble = document.getElementById('assistantBubble');
                const panel = document.getElementById('assistantPanel');
                const closeBtn = document.getElementById('assistantClose');
                const bodyEl = document.getElementById('assistantBody');
                const inputEl = document.getElementById('assistantInput');
                const sendBtn = document.getElementById('assistantSend');
                const langSel = document.getElementById('assistantLang');
                const speakBtn = document.getElementById('speakBtn');
                const stopSpeechBtn = document.getElementById('stopSpeechBtn');
                const micBtn = document.getElementById('micBtn');
                const micStatus = document.getElementById('micStatus');
                const voiceLang = document.getElementById('voiceLang');


                // --- State ---
                let chatHistory = JSON.parse(sessionStorage.getItem('amp_feature_chat_v1') || '[]');
                const synth = window.speechSynthesis;
                let recognition;

                // --- Helper Functions ---
                function navigateTo(path) {
                  if (path) window.location.href = path;
                }
                function sanitize(s) { return String(s || '').replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

                // --- Chat Rendering ---
                function renderHistory() {
                  if (!bodyEl) return;
                  bodyEl.innerHTML = '';
                  chatHistory.slice(-30).forEach(msg => {
                    const wrap = document.createElement('div');
                    wrap.className = 'msg ' + msg.role;
                    const bubble = document.createElement('div');
                    bubble.className = 'bubble';
                    bubble.innerHTML = sanitize(msg.text).replace(/\\n/g, '<br>');
                    wrap.appendChild(bubble);
                    if (msg.meta?.path) {
                      const btn = document.createElement('div');
                      btn.className = 'sendToPageBtn';
                      btn.textContent = (langSel.value === 'hi') ? 'पेज खोलें' : 'Open Page';
                      btn.onclick = () => navigateTo(msg.meta.path);
                      wrap.appendChild(btn);
                    }
                    bodyEl.appendChild(wrap);
                  });
                  bodyEl.scrollTop = bodyEl.scrollHeight;
                }
                
                function appendMessage(role, text, meta) {
                    chatHistory.push({ role, text, meta, ts: Date.now() });
                    sessionStorage.setItem('amp_feature_chat_v1', JSON.stringify(chatHistory));
                    renderHistory();
                }

                // --- Core Logic ---
                async function onAsk() {
                  const query = inputEl.value.trim();
                  if (!query) return;

                  appendMessage('user', query);
                  inputEl.value = '';

                  const lang = langSel.value;
                  const response = await window.featureAssistant({ query, language: lang });

                  appendMessage('assistant', response.answer, response);
                }

                // --- Text-to-Speech (TTS) ---
                function getBestVoice(lang) {
                    const voices = synth.getVoices();
                    return voices.find(v => v.lang.startsWith(lang)) || voices.find(v => v.lang.startsWith('en'));
                }

                speakBtn.onclick = () => {
                    const lastAssistMsg = [...chatHistory].reverse().find(m => m.role === 'assistant');
                    if (!lastAssistMsg || !lastAssistMsg.text) return;
                    synth.cancel();
                    const utter = new SpeechSynthesisUtterance(lastAssistMsg.text);
                    utter.lang = voiceLang.value === 'hi-IN' ? 'hi-IN' : 'en-IN';
                    utter.voice = getBestVoice(utter.lang);
                    synth.speak(utter);
                };

                stopSpeechBtn.onclick = () => synth.cancel();


                // --- Speech-to-Text (STT) ---
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                if (SpeechRecognition) {
                    micBtn.onclick = () => {
                        if (recognition && recognition.isStarted) {
                            recognition.stop();
                            return;
                        }
                        recognition = new SpeechRecognition();
                        recognition.lang = voiceLang.value === 'hi-IN' ? 'hi-IN' : 'en-IN';
                        recognition.onstart = () => { micStatus.textContent = 'Listening...'; micBtn.style.background = '#ff6b6b'; };
                        recognition.onend = () => { micStatus.textContent = ''; micBtn.style.background = '#2b9edb'; recognition.isStarted = false; };
                        recognition.onresult = (event) => {
                            inputEl.value = event.results[0][0].transcript;
                            onAsk();
                        };
                        recognition.start();
                        recognition.isStarted = true;
                    };
                } else {
                    micBtn.disabled = true;
                    micStatus.textContent = 'Not supported';
                }

                // --- Event Listeners ---
                bubble.onclick = () => { panel.style.display = 'flex'; inputEl.focus(); renderHistory(); };
                closeBtn.onclick = () => { panel.style.display = 'none'; };
                sendBtn.onclick = onAsk;
                inputEl.onkeydown = (e) => { if (e.key === 'Enter') onAsk(); };
                
                // --- Global function ---
                window.featureAssistant = ${featureAssistant.toString()};

                renderHistory();
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
