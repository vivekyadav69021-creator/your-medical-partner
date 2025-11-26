
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
        
        <style dangerouslySetInnerHTML={{ __html: `
          #YMP_FLOAT_ROOT {
            position: fixed !important;
            bottom: 22px !important;
            right: 22px !important;
            z-index: 999999999 !important;
            pointer-events: auto !important;
            font-family: Inter, Arial, sans-serif;
          }
          #YMP_BUBBLE {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #0ea5e9;
            color: white;
            box-shadow: 0 10px 30px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 18px;
            cursor: pointer;
            pointer-events: auto !important;
          }
          #YMP_PANEL {
            width: 350px;
            height: 480px;
            background: white;
            position: absolute;
            bottom: 80px;
            right: 0;
            border-radius: 14px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.22);
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 999999999 !important;
            pointer-events: auto;
            color: #333;
          }
          #YMP_HEADER {
            padding: 12px;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          #YMP_BODY {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
          }
          #YMP_FOOTER {
            padding: 10px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          #YMP_INPUT {
            flex: 1;
            padding: 8px;
            border-radius: 8px;
            border: 1px solid #cbd5e1;
          }
          #YMP_SEND {
            padding: 8px 12px;
            background: #0ea5e9;
            border-radius: 8px;
            border: none;
            color: white;
            cursor: pointer;
          }
           .voiceWidget {
            display: flex;
            gap: 8px;
            align-items: center;
          }
          .assistBtn {
            padding: 8px 10px;
            border-radius: 8px;
            border: 0;
            cursor: pointer;
            background: #1398d8;
            color: #fff;
          }
          .ymp-msg {
            margin: 6px 0;
            padding: 8px 10px;
            border-radius: 10px;
            max-width: 90%;
          }
          .ymp-user {
            background: #dff3ff;
            margin-left: auto;
          }
          .ymp-bot {
            background: #f1f5f9;
          }
        `}} />

        <div id="YMP_FLOAT_ROOT">
          <div id="YMP_BUBBLE">YMP</div>
          <div id="YMP_PANEL">
            <div id="YMP_HEADER">
              <strong>Your Medical Partner</strong>
               <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                <button id="YMP_CLOSE" style={{background:'transparent', border:'0', color:'#555', fontSize:'18px', cursor:'pointer'}}>✕</button>
              </div>
            </div>
            <div id="YMP_BODY"></div>
            <div id="YMP_FOOTER">
               <div className="voiceWidget">
                <button id="speakBtn" className="assistBtn" title="Speak assistant's reply">🔊</button>
                <button id="stopSpeechBtn" className="assistBtn" title="Stop speaking">■</button>
                <select id="assistantLang" style={{borderRadius: 8, padding: 6, border:'1px solid #ddd', color: '#333', background: '#fff' }}>
                  <option value="en-IN">EN</option>
                  <option value="hi-IN">HI</option>
                </select>
                <button id="micBtn" className="assistBtn" title="Start microphone">🎤</button>
                <span id="micStatus" style={{fontSize:'12px', color: '#555', flex: 1}}></span>
              </div>
              <div style={{display:'flex', gap: '8px'}}>
                <input id="YMP_INPUT" placeholder="Ask about any feature..." style={{flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1'}} />
                <button id="YMP_SEND" className="assistBtn">Ask</button>
              </div>
            </div>
          </div>
        </div>

        <script dangerouslySetInnerHTML={{ __html: `
              (async function() {
                // --- DOM References ---
                const bubble = document.getElementById('YMP_BUBBLE');
                const panel = document.getElementById('YMP_PANEL');
                const closeBtn = document.getElementById('YMP_CLOSE');
                const bodyEl = document.getElementById('YMP_BODY');
                const inputEl = document.getElementById('YMP_INPUT');
                const sendBtn = document.getElementById('YMP_SEND');
                const langSel = document.getElementById('assistantLang');
                const speakBtn = document.getElementById('speakBtn');
                const stopSpeechBtn = document.getElementById('stopSpeechBtn');
                const micBtn = document.getElementById('micBtn');
                const micStatus = document.getElementById('micStatus');

                if (!bubble || !panel || !closeBtn || !bodyEl || !inputEl || !sendBtn) {
                    console.error("YMP Assistant: One or more UI elements not found.");
                    return;
                }

                // --- State ---
                let chatHistory = JSON.parse(sessionStorage.getItem('ymp_feature_chat_v1') || '[]');
                const synth = window.speechSynthesis;
                let recognition;

                // --- Helper Functions ---
                function navigateTo(path) {
                  if (path) window.location.href = path.startsWith('/') ? path : '/' + path;
                }
                function sanitize(s) { return String(s || '').replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c])); }

                // --- Chat Rendering ---
                function renderHistory() {
                  if (!bodyEl) return;
                  bodyEl.innerHTML = '';
                  chatHistory.slice(-30).forEach(msg => {
                    const wrap = document.createElement('div');
                    wrap.className = 'ymp-msg ' + (msg.role === "user" ? "ymp-user" : "ymp-bot");
                    wrap.innerHTML = sanitize(msg.text).replace(/\\n/g, '<br>');
                    
                    if (msg.meta?.path) {
                      const btn = document.createElement('button');
                      btn.className = 'sendToPageBtn';
                      btn.textContent = (langSel.value === 'hi') ? 'पेज खोलें' : 'Open Page';
                      btn.onclick = () => navigateTo(msg.meta.path);
                       btn.style.display = 'block';
                       btn.style.marginTop = '8px';
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
                    if (!synth) return null;
                    const voices = synth.getVoices();
                    return voices.find(v => v.lang.startsWith(lang)) || voices.find(v => v.lang.startsWith('en'));
                }

                if (speakBtn) speakBtn.onclick = () => {
                    const lastAssistMsg = [...chatHistory].reverse().find(m => m.role === 'assistant');
                    if (!lastAssistMsg || !lastAssistMsg.text) return;
                    synth.cancel();
                    const utter = new SpeechSynthesisUtterance(lastAssistMsg.text);
                    utter.lang = langSel.value === 'hi' ? 'hi-IN' : 'en-IN';
                    const voice = getBestVoice(utter.lang);
                    if (voice) utter.voice = voice;
                    synth.speak(utter);
                };

                if (stopSpeechBtn) stopSpeechBtn.onclick = () => synth.cancel();

                // --- Speech-to-Text (STT) ---
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                if (SpeechRecognition && micBtn) {
                    let recognizing = false;
                    micBtn.onclick = () => {
                        if (recognizing) {
                            recognition.stop();
                            return;
                        }
                        recognition = new SpeechRecognition();
                        recognition.lang = langSel.value === 'hi' ? 'hi-IN' : 'en-IN';
                        recognition.onstart = () => { recognizing = true; if(micStatus) micStatus.textContent = 'Listening...'; micBtn.style.background = '#ff6b6b'; };
                        recognition.onend = () => { recognizing = false; if(micStatus) micStatus.textContent = ''; micBtn.style.background = '#2b9edb'; };
                        recognition.onresult = (event) => {
                            inputEl.value = event.results[0][0].transcript;
                            onAsk();
                        };
                        recognition.start();
                    };
                } else if(micBtn) {
                    micBtn.disabled = true;
                    if(micStatus) micStatus.textContent = 'Not supported';
                }

                // --- Event Listeners ---
                bubble.onclick = () => { panel.style.display = 'flex'; inputEl.focus(); renderHistory(); };
                closeBtn.onclick = () => { panel.style.display = 'none'; };
                sendBtn.onclick = onAsk;
                inputEl.onkeydown = (e) => { if (e.key === 'Enter') onAsk(); };
                
                // Define global function expected by the script
                window.featureAssistant = window.featureAssistant || async function(input) {
                    // This is a placeholder. The real function is in feature-assistant-flow.ts
                    // For client-side only demo, you can add mock logic here.
                    console.warn("featureAssistant flow not fully connected. Using mock response.");
                    const answer = \`This is a mock response for: \${input.query}\`;
                    return { answer, path: null, featureId: null };
                };

                renderHistory();
              })();
        `}} />
      </body>
    </html>
  );
}
