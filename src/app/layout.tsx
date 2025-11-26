
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
          #YMP_MSG_USER {
            text-align: right;
          }
          .ymp-msg {
            margin: 6px 0;
            padding: 8px 10px;
            border-radius: 10px;
            max-width: 90%;
            color: #333;
          }
          .ymp-user {
            background: #dff3ff;
            margin-left: auto;
          }
          .ymp-bot {
            background: #f1f5f9;
          }
          #YMP_FOOTER {
            padding: 10px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
            gap: 6px;
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
        `}} />

        <div id="YMP_FLOAT_ROOT">
          <div id="YMP_BUBBLE">YMP</div>
          <div id="YMP_PANEL">
            <div id="YMP_HEADER">
              <strong>Your Medical Partner</strong>
              <button id="YMP_CLOSE" style={{ background:'none', border:'none', fontSize:'18px', cursor:'pointer' }}>✖</button>
            </div>
            <div id="YMP_BODY"></div>
            <div id="YMP_FOOTER">
               <div className="voiceWidget">
                <button id="speakBtn" className="assistBtn" title="Speak assistant's reply">🔊</button>
                <button id="stopSpeechBtn" className="assistBtn" title="Stop speaking">■</button>
                <select id="assistantLang" style={{ borderRadius: 8, padding: 6, border: 0, color: '#333', background: '#f0f0f0' }}>
                  <option value="en-IN">EN</option>
                  <option value="hi-IN">HI</option>
                </select>
                <button id="micBtn" className="assistBtn" title="Start microphone">🎤</button>
                <span id="micStatus" style={{ fontSize: '12px', color: '#555', flex: 1 }}></span>
              </div>
              <div style={{ display:'flex', gap: '8px' }}>
                <input id="YMP_INPUT" placeholder="Ask about app features…" />
                <button id="YMP_SEND">Ask</button>
              </div>
            </div>
          </div>
        </div>

        <script dangerouslySetInnerHTML={{ __html: `
          const bubble = document.getElementById("YMP_BUBBLE");
          const panel = document.getElementById("YMP_PANEL");
          const closeBtn = document.getElementById("YMP_CLOSE");
          const input = document.getElementById("YMP_INPUT");
          const send = document.getElementById("YMP_SEND");
          const body = document.getElementById("YMP_BODY");
          const speakBtn = document.getElementById('speakBtn');
          const stopSpeechBtn = document.getElementById('stopSpeechBtn');
          const micBtn = document.getElementById('micBtn');
          const langSel = document.getElementById('assistantLang');
          const micStatus = document.getElementById('micStatus');
          
          bubble.onclick = () => { panel.style.display = "flex"; };
          closeBtn.onclick = () => { panel.style.display = "none"; };

          function addMsg(text, sender = "bot") {
            const div = document.createElement("div");
            div.className = "ymp-msg " + (sender === "user" ? "ymp-user" : "ymp-bot");
            div.innerText = text;
            body.appendChild(div);
            body.scrollTop = body.scrollHeight;
          }

          function handleSend() {
            const q = input.value.trim();
            if (!q) return;
            addMsg(q, "user");
            input.value = "";
            const answers = {
              "doctor": "To book doctor, go to Doctor Consult → Select doctor → Choose date/time → Confirm.",
              "disease": "Disease Scanner analyzes images, X-ray, reports → Open Disease Scanner from dashboard.",
              "planner": "Your health planner creates weekly diet + workout plan → Open My Planner.",
              "hospital": "Nearby Hospital finds hospitals around you via GPS.",
            };
            let reply = null;
            for (const key in answers) {
              if (q.toLowerCase().includes(key)) reply = answers[key];
            }
            if (!reply) reply = "I understand your question 👍. Tap the feature tile on Dashboard to open it.";
            addMsg(reply, "bot");
          }

          send.onclick = () => handleSend();
          input.addEventListener("keydown", (e) => e.key === "Enter" && handleSend());

          // --- TTS ---
          const synth = window.speechSynthesis;
          speakBtn.onclick = () => {
            const botMessages = Array.from(body.querySelectorAll('.ymp-bot'));
            if (botMessages.length === 0) return;
            const lastMsg = botMessages[botMessages.length - 1].innerText;
            if (!lastMsg) return;
            
            synth.cancel();
            const utter = new SpeechSynthesisUtterance(lastMsg);
            utter.lang = langSel.value || 'en-IN';
            synth.speak(utter);
          };
          stopSpeechBtn.onclick = () => synth.cancel();

          // --- STT ---
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (SpeechRecognition) {
            let recognition = new SpeechRecognition();
            recognition.continuous = false;
            
            micBtn.onclick = () => {
              recognition.lang = langSel.value || 'en-IN';
              recognition.start();
            };

            recognition.onstart = () => {
              micStatus.innerText = 'Listening...';
              micBtn.style.background = '#ff6b6b';
            };

            recognition.onend = () => {
              micStatus.innerText = '';
              micBtn.style.background = '#1398d8';
            };

            recognition.onresult = (event) => {
              const transcript = event.results[0][0].transcript;
              input.value = transcript;
              handleSend();
            };

            recognition.onerror = (event) => {
              micStatus.innerText = 'Error: ' + event.error;
            };

          } else {
            micBtn.disabled = true;
            micStatus.innerText = 'STT not supported';
          }

        `}} />
      </body>
    </html>
  );
}
