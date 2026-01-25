
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Your Medical Partner',
  description: 'Your Medical Partner',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const layoutFixScript = `
(function(){
  const processedCards = new Set();

  function adjustAllChatCardHeights() {
    try {
      const vh = Math.max(window.innerHeight || 600, document.documentElement.clientHeight);
      const newH = (window.innerWidth <= 720) ? Math.floor(vh*0.72) : Math.floor(vh*0.78);
      document.querySelectorAll('.ymp-expand-card').forEach(card => {
        card.style.height = newH + 'px';
      });
    } catch(e) {}
  }

  function fixCard(card) {
    if (!card || processedCards.has(card)) return;
    processedCards.add(card);

    card.classList.add('ymp-expand-card');
    
    let history = card.querySelector('[class*="h-full"]');
    let footer = card.querySelector('form, footer, .card-footer');

    if (!history) {
        let candidates = Array.from(card.children).filter(ch => ch.offsetHeight > 20);
        candidates.sort((a,b)=> b.offsetHeight - a.offsetHeight);
        history = candidates[0] || card;
    }
    
    const cardContent = history.parentElement;
    if(cardContent && cardContent.parentElement === card) {
       const flexWrap = document.createElement('div');
       flexWrap.className = 'ymp-expand-fit';

       Array.from(cardContent.childNodes).forEach(node => {
         if (node !== footer && node.parentElement !== footer) {
            flexWrap.appendChild(node);
         }
       });
       cardContent.innerHTML = '';
       cardContent.appendChild(flexWrap);

       if (history) history.classList.add('ymp-expand-history', 'ymp-expand-scroll');
       if (footer) {
         cardContent.appendChild(footer);
         footer.classList.add('ymp-expand-footer');
       }
    }

    setTimeout(()=> { if(history) history.scrollTop = history.scrollHeight; }, 150);
  }

  function applyFix() {
    const cards = document.querySelectorAll('[data-chat-card="true"]');
    if (cards.length === 0) return false;
    cards.forEach(fixCard);
    adjustAllChatCardHeights(); // Adjust height after fixing
    return true;
  }

  if (typeof window !== 'undefined') {
      window.addEventListener('resize', adjustAllChatCardHeights); // Add one listener for all
      
      document.addEventListener('DOMContentLoaded', () => {
          applyFix();
          setTimeout(applyFix, 400);
          setTimeout(applyFix, 1200);
          const observer = new MutationObserver((m)=>{
            applyFix();
          });
          observer.observe(document.body, {childList:true, subtree:true});
      });
  }
})();
  `;


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossOrigin=""/>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossOrigin=""></script>
        
        <style dangerouslySetInnerHTML={{ __html: `
          /* Safe, namespaced styles for chat layout fix */
          .ymp-expand-card {
            display: flex !important;
            flex-direction: column !important;
            height: 78vh !important;
            max-height: 88vh !important;
            min-height: 380px !important;
          }
          .ymp-expand-fit { display: flex; flex-direction: column; height: 100%; min-height: 1px; }
          .ymp-expand-history { flex: 1 1 auto; overflow-y: auto; padding: 12px; }
          .ymp-expand-footer { flex: 0 0 auto; background: var(--card); padding-top: 1rem; }

          .ymp-expand-msg {
            max-width: 100% !important; /* Override inline styles */
          }

          /* Scrollbar styling (optional, looks nicer) */
          .ymp-expand-scroll {
            scrollbar-width: thin;
            scrollbar-color: hsl(var(--primary) / 0.3) transparent;
          }
          .ymp-expand-scroll::-webkit-scrollbar { width: 8px; }
          .ymp-expand-scroll::-webkit-scrollbar-thumb { background: hsl(var(--primary) / 0.3); border-radius:8px; }
          .ymp-expand-scroll::-webkit-scrollbar-track { background: transparent; }

          @media (max-width:720px){
            .ymp-expand-card { height: calc(100vh - 12rem) !important; }
          }
        `}} />

      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            {children}
            <Toaster />
          </FirebaseClientProvider>
        </ThemeProvider>
        <Script id="chat-layout-fix" strategy="afterInteractive">
          {layoutFixScript}
        </Script>
      </body>
    </html>
  );
}
