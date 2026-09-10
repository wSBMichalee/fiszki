"use client";

import { motion } from "framer-motion";

export default function NotebookScanIllustration({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full aspect-[4/3] rounded-3xl p-4 sm:p-8 flex items-center justify-center overflow-hidden bg-white/70 border border-[var(--color-navy)]/10 shadow-[0_16px_40px_rgba(28,43,69,0.06)] backdrop-blur-xs select-none ${className}`}>
      <svg
        viewBox="0 0 540 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[350px]"
      >
        <defs>
          {/* Cień kartki papieru */}
          <filter id="sheetShadow" x="-10%" y="-10%" width="125%" height="130%">
            <feDropShadow
              dx="0"
              dy="10"
              stdDeviation="16"
              floodColor="#1C2B45"
              floodOpacity="0.08"
            />
          </filter>

          {/* Miękka bursztynowa poświata światła */}
          <linearGradient id="amberStreak" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D9A441" stopOpacity="0.05" />
            <stop offset="20%" stopColor="#D9A441" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#F5D78E" stopOpacity="0.55" />
            <stop offset="80%" stopColor="#D9A441" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#D9A441" stopOpacity="0.05" />
          </linearGradient>

          {/* Rdzeń smugi światła */}
          <linearGradient id="amberCore" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D9A441" stopOpacity="0" />
            <stop offset="30%" stopColor="#D9A441" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#D9A441" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#D9A441" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* FIZYCZNA KARTKA NOTATNIKA Z PISMEM ODRĘCZNYM */}
        <g transform="translate(270, 190) rotate(-2) translate(-270, -190)">
          {/* Kartka papieru */}
          <rect
            x="65"
            y="50"
            width="410"
            height="280"
            rx="16"
            fill="#FAF8F3"
            stroke="#1C2B45"
            strokeWidth="1.5"
            strokeOpacity="0.14"
            filter="url(#sheetShadow)"
          />

          {/* Bursztynowa linia marginesu po lewej stronie */}
          <line
            x1="130"
            y1="50"
            x2="130"
            y2="330"
            stroke="#D9A441"
            strokeWidth="1"
            strokeOpacity="0.35"
            strokeDasharray="4 3"
          />

          {/* Poziome linie notesu */}
          <g stroke="#1C2B45" strokeOpacity="0.06" strokeWidth="1">
            <line x1="65" y1="95" x2="475" y2="95" />
            <line x1="65" y1="135" x2="475" y2="135" />
            <line x1="65" y1="175" x2="475" y2="175" />
            <line x1="65" y1="215" x2="475" y2="215" />
            <line x1="65" y1="255" x2="475" y2="255" />
            <line x1="65" y1="295" x2="475" y2="295" />
          </g>

          {/* Miękka bursztynowa smuga / akcent światła padający na ważny fragment */}
          <motion.g
            initial={{ opacity: 0.75 }}
            animate={{ opacity: [0.65, 0.95, 0.65] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Szeroka, miękka smuga światła */}
            <rect
              x="140"
              y="160"
              width="240"
              height="28"
              rx="14"
              fill="url(#amberStreak)"
            />
            {/* Centralna jaśniejsza linia poświaty */}
            <line
              x1="155"
              y1="174"
              x2="365"
              y2="174"
              stroke="url(#amberCore)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </motion.g>

          {/* Organiczne pismo odręczne (fale / zygzaki) */}
          <g
            stroke="#1C2B45"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.75"
          >
            {/* Wiersz 1: Tytuł / nagłówek */}
            <path
              d="M 145 88 Q 158 84 172 88 T 202 87 T 235 89 T 268 86 M 285 88 Q 302 85 325 88 T 355 87"
              strokeWidth="3.2"
              strokeOpacity="0.88"
            />

            {/* Wiersz 2: Zwykły wiersz odręczny */}
            <path
              d="M 145 128 Q 158 125 175 128 T 205 129 T 235 126 T 268 128 T 300 127 M 315 128 Q 332 126 355 128 T 392 127 T 425 129"
            />

            {/* Wiersz 3: Podświetlony fragment (akcentowany definicją) */}
            <path
              d="M 148 168 Q 162 165 185 168 T 218 169 T 252 166 T 290 168 T 325 167 T 355 168"
              strokeOpacity="0.9"
            />

            {/* Wiersz 4: Ciąg dalszy notatek */}
            <path
              d="M 145 208 Q 162 205 190 208 T 222 209 T 255 206 T 288 208 M 305 208 Q 322 206 345 208 T 378 207 T 410 209"
            />

            {/* Wiersz 5: Zwięzła notatka */}
            <path
              d="M 145 248 Q 168 245 195 248 T 232 249 T 265 246 T 298 248 M 315 248 Q 332 246 355 248"
            />

            {/* Wiersz 6: Krótkie podsumowanie */}
            <path
              d="M 145 288 Q 162 285 190 288 T 228 287 T 255 289"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
