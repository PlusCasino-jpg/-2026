@import "tailwindcss";

@theme {
  --font-sans: "Cairo", "Inter", sans-serif;
  --font-display: "Cairo", "Montserrat", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  
  --animate-pulse-slow: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  --animate-shimmer: shimmer 2.5s linear infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Custom Instagram-inspired scrollbar design & UI components */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  background: #09090b;
}

::-webkit-scrollbar-thumb {
  background: #27272a;
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background: #f43f5e;
}

/* Base style resets and layout utilities */
html, body, #root {
  min-height: 100dvh;
  font-family: var(--font-sans);
}

.custom-insta-ring {
  background: linear-gradient(115deg, #f9ce34, #ee2a7b, #6228d7);
}

.gradient-alert {
  background: linear-gradient(90deg, rgba(244,63,94,1) 0%, rgba(225,29,72,1) 100%);
}

.radial-live {
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
}

