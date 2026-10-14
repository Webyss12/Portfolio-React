import type { ReactNode } from 'react';

interface ArtProps {
  className?: string;
  /** Accessible description. Leave empty for purely decorative use. */
  title?: string;
}

// Shared <svg> wrapper: adds the viewBox, class and accessibility attributes.
function Frame({ viewBox, className, title, children }: ArtProps & { viewBox: string; children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {children}
    </svg>
  );
}

// Palette shared by every cover
const IVORY = '#e4e0d5';
const INK = '#141414';
const PANEL = '#171717';
const PANEL_2 = '#2b2b29';
const ORANGE = '#ff630f';
const MUTED = '#9a968c';

/** Standard cover header: lowercase title on the left, small caption on the right. */
function Header({ name, caption }: { name: string; caption: string }) {
  return (
    <g fontFamily="Arial,sans-serif">
      <text x="45" y="92" fill={INK} fontSize="68" letterSpacing="-5">
        {name}
      </text>
      <text x="520" y="78" fill="#444" fontSize="10" letterSpacing="2">
        {caption}
      </text>
    </g>
  );
}

function Footer({ left, right }: { left: string; right: string }) {
  return (
    <g fontFamily="Arial,sans-serif" fill="#252525" fontSize="10" letterSpacing="1">
      <text x="45" y="752">
        {left}
      </text>
      <text x="697" y="752">
        {right}
      </text>
    </g>
  );
}

/* ---------- 7-segment digit, used by the scoreboard ---------- */

const SEGMENTS: Record<string, string> = {
  '0': 'abcdef', '1': 'bc', '2': 'abdeg', '3': 'abcdg', '4': 'bcfg',
  '5': 'acdfg', '6': 'acdefg', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg',
};

function Seven({ x, y, w, h, t, digit, lit = ORANGE }: { x: number; y: number; w: number; h: number; t: number; digit: string; lit?: string }) {
  const half = (h - 3 * t) / 2;
  const seg: Record<string, [number, number, number, number]> = {
    a: [x + t, y, w - 2 * t, t],
    b: [x + w - t, y + t, t, half],
    c: [x + w - t, y + 2 * t + half, t, half],
    d: [x + t, y + h - t, w - 2 * t, t],
    e: [x, y + 2 * t + half, t, half],
    f: [x, y + t, t, half],
    g: [x + t, y + t + half, w - 2 * t, t],
  };
  const on = SEGMENTS[digit] ?? '';
  return (
    <g>
      {Object.entries(seg).map(([key, [sx, sy, sw, sh]]) => (
        <rect key={key} x={sx} y={sy} width={sw} height={sh} rx={t / 3} fill={on.includes(key) ? lit : '#2d2d2d'} />
      ))}
    </g>
  );
}

/* ---------- 01 ESP32 Basketball Scoreboard ---------- */

export function ScoreboardArt({ className, title }: ArtProps) {
  const buttons = ['+1', '+2', '+3', '-1', 'PERIOD', 'BUZZ'];
  return (
    <Frame viewBox="0 0 800 800" className={className} title={title}>
      <rect width="800" height="800" fill={IVORY} />
      <Header name="scoreboard" caption="ESP32 + LED DISPLAYS" />
      <rect x="40" y="140" width="720" height="470" rx="16" fill={PANEL} />
      <g fontFamily="Arial,sans-serif" fill={MUTED} fontSize="12" letterSpacing="3">
        <text x="80" y="188">HOME</text>
        <text x="440" y="188">GUEST</text>
      </g>
      <Seven x={80} y={212} w={96} h={172} t={16} digit="5" />
      <Seven x={200} y={212} w={96} h={172} t={16} digit="8" />
      <path d="M400 180v210" stroke="#444" />
      <Seven x={440} y={212} w={96} h={172} t={16} digit="6" />
      <Seven x={560} y={212} w={96} h={172} t={16} digit="1" />
      <rect x="80" y="424" width="250" height="150" rx="8" fill={PANEL_2} />
      <text x="100" y="456" fontFamily="Arial,sans-serif" fontSize="11" letterSpacing="2" fill={MUTED}>PERIOD</text>
      <Seven x={236} y={448} w={44} h={100} t={10} digit="3" />
      <circle cx="450" cy="500" r="44" fill={ORANGE} />
      <path d="M502 478q22 22 0 44M520 466q34 34 0 68" fill="none" stroke={IVORY} strokeWidth="4" strokeLinecap="round" />
      <rect x="560" y="440" width="160" height="120" rx="8" fill={ORANGE} />
      <text x="578" y="482" fontFamily="Arial,sans-serif" fontSize="12" letterSpacing="2" fill={INK}>FIREBASE</text>
      <text x="578" y="514" fontFamily="Arial,sans-serif" fontSize="20" fill={INK}>RTDB</text>
      <text x="578" y="540" fontFamily="Arial,sans-serif" fontSize="12" fill={INK}>live sync</text>
      <g fontFamily="Arial,sans-serif" fontSize="16" fill={IVORY} textAnchor="middle">
        {buttons.map((label, i) => (
          <g key={label}>
            <rect x={40 + i * 122} y="636" width="104" height="58" rx="8" fill={PANEL_2} />
            <text x={92 + i * 122} y="671" fontSize={label.length > 3 ? 12 : 18} letterSpacing={label.length > 3 ? 1 : 0}>{label}</text>
          </g>
        ))}
      </g>
      <Footer left="TM1637 / MAX7219 / BUZZER / WEB CONTROLLER" right="2026" />
    </Frame>
  );
}

/* ---------- 02 SmartLED IoT Controller ---------- */

export function SmartledArt({ className, title }: ArtProps) {
  return (
    <Frame viewBox="0 0 800 800" className={className} title={title}>
      <rect width="800" height="800" fill={IVORY} />
      <Header name="smartled" caption="PWM + FIREBASE + MDNS" />
      <rect x="40" y="140" width="720" height="560" rx="16" fill={PANEL} />
      <path d="M40 200h720" stroke="#444" />
      <circle cx="66" cy="170" r="5" fill={ORANGE} />
      <circle cx="86" cy="170" r="5" fill="#555" />
      <circle cx="106" cy="170" r="5" fill="#555" />
      <rect x="250" y="156" width="300" height="28" rx="14" fill={PANEL_2} />
      <text x="400" y="175" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="13" fill={IVORY}>smartled.local</text>
      <circle cx="240" cy="400" r="150" fill={ORANGE} opacity=".1" />
      <circle cx="240" cy="400" r="108" fill={ORANGE} opacity=".18" />
      <circle cx="240" cy="400" r="68" fill={ORANGE} opacity=".4" />
      <circle cx="240" cy="400" r="34" fill={ORANGE} />
      <g fontFamily="Arial,sans-serif">
        <text x="440" y="310" fontSize="11" letterSpacing="2" fill={MUTED}>BRIGHTNESS</text>
        <text x="440" y="378" fontSize="64" letterSpacing="-3" fill={IVORY}>72%</text>
      </g>
      <rect x="440" y="410" width="270" height="8" rx="4" fill="#444" />
      <rect x="440" y="410" width="194" height="8" rx="4" fill={ORANGE} />
      <circle cx="634" cy="414" r="14" fill={IVORY} stroke={ORANGE} strokeWidth="3" />
      <rect x="440" y="468" width="130" height="44" rx="8" fill={ORANGE} />
      <rect x="580" y="468" width="130" height="44" rx="8" fill={PANEL_2} />
      <g fontFamily="Arial,sans-serif" fontSize="14" letterSpacing="2" textAnchor="middle">
        <text x="505" y="496" fill={INK}>ON</text>
        <text x="645" y="496" fill={IVORY}>OFF</text>
      </g>
      <text x="64" y="578" fontFamily="Arial,sans-serif" fontSize="10" letterSpacing="2" fill={MUTED}>PWM / DUTY CYCLE</text>
      <rect x="64" y="590" width="672" height="90" rx="8" fill={PANEL_2} />
      <path d="M84 664V612H124V664H244V612H324V664H404V612H524V664H564V612H604V664H724" fill="none" stroke={ORANGE} strokeWidth="3" />
      <Footer left="ESP32 / EMBEDDED WEB DASHBOARD" right="2026" />
    </Frame>
  );
}

/* ---------- 03 Local AI Chatbot ---------- */

export function ChatbotArt({ className, title }: ArtProps) {
  const heights = [150, 120, 200, 160, 130, 190, 140, 180, 120, 170, 200, 130, 170, 150];
  const widths = [44, 36, 52, 40, 30, 48, 38, 50, 34, 44, 52, 36, 46, 40];
  const colors = [INK, ORANGE, INK, PANEL_2, ORANGE, INK, PANEL_2, INK, ORANGE, PANEL_2, INK, ORANGE, PANEL_2, INK];
  let x = 60;
  const books = heights.map((h, i) => {
    const book = { x, h, w: widths[i], fill: colors[i] };
    x += widths[i] + 6;
    return book;
  });
  return (
    <Frame viewBox="0 0 800 800" className={className} title={title}>
      <rect width="800" height="800" fill={IVORY} />
      <Header name="chatbot" caption="BOOK QUESTIONS" />
      <rect x="40" y="140" width="720" height="330" rx="16" fill={PANEL} />
      <rect x="360" y="170" width="360" height="64" rx="14" fill={ORANGE} />
      <text x="380" y="208" fontFamily="Arial,sans-serif" fontSize="18" fill={INK}>Where is the Python book?</text>
      <rect x="80" y="258" width="420" height="104" rx="14" fill={PANEL_2} />
      <text x="100" y="298" fontFamily="Arial,sans-serif" fontSize="18" fill={IVORY}>Python Basics, shelf B2.</text>
      <text x="100" y="330" fontFamily="Arial,sans-serif" fontSize="13" fill={MUTED}>tags: python, beginner</text>
      <g fill="#666">
        <circle cx="90" cy="420" r="5" />
        <circle cx="110" cy="420" r="5" />
        <circle cx="130" cy="420" r="5" />
      </g>
      <rect x="170" y="398" width="560" height="44" rx="22" fill={PANEL_2} />
      <text x="196" y="426" fontFamily="Arial,sans-serif" fontSize="14" fill="#777">Ask about a book</text>
      {books.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={700 - b.h} width={b.w} height={b.h} fill={b.fill} />
          <rect x={b.x + 6} y={700 - b.h + 16} width={b.w - 12} height="4" fill={IVORY} opacity=".6" />
        </g>
      ))}
      <rect x="40" y="700" width="720" height="10" fill={INK} />
      <Footer left="QWEN MODELS / OLLAMA MODELS / OLLAMA SERVER / FASTEMBED / FLASK / REST API" right="2026" />
    </Frame>
  );
}

/* ---------- 04 Waterworks Consumption Report ---------- */

export function WaterworksArt({ className, title }: ArtProps) {
  const heights = [150, 170, 140, 200, 230, 260, 300, 280, 220, 190, 160, 210];
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  return (
    <Frame viewBox="0 0 800 800" className={className} title={title}>
      <rect width="800" height="800" fill={IVORY} />
      <Header name="waterworks" caption="CONSUMPTION REPORT" />
      <rect x="40" y="140" width="720" height="500" rx="16" fill={PANEL} />
      <text x="64" y="184" fontFamily="Arial,sans-serif" fontSize="11" letterSpacing="2" fill={MUTED}>WATER CONSUMPTION / BY MONTH</text>
      <path d="M64 560h672M64 480h672M64 400h672M64 320h672M64 240h672" stroke="#3a3a38" />
      {heights.map((h, i) => (
        <g key={i}>
          <rect x={72 + i * 54} y={560 - h} width="36" height={h} fill={i === 6 ? ORANGE : PANEL_2} />
          <text x={90 + i * 54} y="588" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="11" fill={MUTED}>{months[i]}</text>
        </g>
      ))}
      <path d="M690 196C690 196 658 236 658 260a32 32 0 0 0 64 0C722 236 690 196 690 196Z" fill={ORANGE} />
      <text x="45" y="696" fontFamily="'Courier New',monospace" fontSize="15" fill={INK}>SELECT ... FROM ... GROUP BY month;</text>
      <Footer left="DJANGO / MYSQL / SQL REPORT" right="2026" />
    </Frame>
  );
}

/* ---------- 05 File Services and Access Control lab ---------- */

function Folder({ x, y, fill = IVORY }: { x: number; y: number; fill?: string }) {
  return (
    <g fill={fill}>
      <rect x={x} y={y} width="26" height="14" rx="3" />
      <rect x={x} y={y + 10} width="64" height="44" rx="4" />
    </g>
  );
}

export function FileserverArt({ className, title }: ArtProps) {
  const rows = [
    { y: 290, name: 'Sales' },
    { y: 390, name: 'Admin' },
    { y: 490, name: 'IT' },
  ];
  return (
    <Frame viewBox="0 0 800 800" className={className} title={title}>
      <rect width="800" height="800" fill={IVORY} />
      <Header name="fileserver" caption="PERMISSIONS + ABE" />
      <rect x="40" y="140" width="720" height="560" rx="16" fill={PANEL} />
      <Folder x={80} y={180} fill={ORANGE} />
      <text x="164" y="222" fontFamily="Arial,sans-serif" fontSize="26" fill={IVORY}>Company Share</text>
      <path d="M100 240V517" stroke="#666" />
      {rows.map((r) => (
        <g key={r.name}>
          <path d={`M100 ${r.y + 27}H120`} stroke="#666" />
          <Folder x={120} y={r.y} />
          <text x="204" y={r.y + 36} fontFamily="Arial,sans-serif" fontSize="24" fill={IVORY}>{r.name}</text>
          <g fontFamily="Arial,sans-serif" fontSize="12" letterSpacing="2" textAnchor="middle">
            <rect x="420" y={r.y + 10} width="88" height="34" rx="17" fill="none" stroke="#777" />
            <text x="464" y={r.y + 32} fill={IVORY}>NTFS</text>
            <rect x="520" y={r.y + 10} width="96" height="34" rx="17" fill="none" stroke="#777" />
            <text x="568" y={r.y + 32} fill={IVORY}>SHARE</text>
            <rect x="628" y={r.y + 10} width="88" height="34" rx="17" fill={ORANGE} />
            <text x="672" y={r.y + 32} fill={INK}>ABE</text>
          </g>
        </g>
      ))}
      <path d="M80 640l12 12 24-26" fill="none" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <text x="132" y="648" fontFamily="Arial,sans-serif" fontSize="11" letterSpacing="2" fill={MUTED}>EFFECTIVE ACCESS CHECKED</text>
      <Footer left="WINDOWS SERVER 2025 / VMWARE / LAB ACTIVITY 04" right="2026" />
    </Frame>
  );
}

/* ---------- 06 This portfolio ---------- */

export function PortfolioArt({ className, title }: ArtProps) {
  const rows = [
    ['01', 'ESP32 Basketball Scoreboard'],
    ['02', 'SmartLED IoT Controller'],
    ['03', 'Local AI Chatbot'],
  ];
  return (
    <Frame viewBox="0 0 800 800" className={className} title={title}>
      <rect width="800" height="800" fill={IVORY} />
      <Header name="portfolio" caption="REACT + TAILWIND CSS" />
      <rect x="40" y="140" width="720" height="560" rx="16" fill="#0d0d0d" />
      <path d="M40 200h720" stroke="#333" />
      <circle cx="66" cy="170" r="5" fill={ORANGE} />
      <circle cx="86" cy="170" r="5" fill="#555" />
      <circle cx="106" cy="170" r="5" fill="#555" />
      <g fontFamily="Arial,sans-serif" fill="#e9e5da">
        <text x="76" y="330" fontSize="110" letterSpacing="-6">ES</text>
        <text x="270" y="330" fontSize="110" letterSpacing="-6">Asher</text>
        <text x="668" y="262" fontSize="12" fill={ORANGE}>[01]</text>
        <text x="80" y="382" fontSize="11" letterSpacing="2" fill={MUTED}>EMBEDDED SYSTEMS &amp; WEB DEVELOPER</text>
      </g>
      <rect x="560" y="404" width="160" height="44" rx="22" fill={IVORY} />
      <text x="640" y="432" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="15" fill={INK}>Explore work</text>
      {rows.map(([n, label], i) => (
        <g key={n}>
          <path d={`M80 ${492 + i * 52}H720`} stroke="#333" />
          <text x="80" y={522 + i * 52} fontFamily="Arial,sans-serif" fontSize="15" fill={IVORY}>
            {n}  {label}
          </text>
          <text x="684" y={522 + i * 52} fontFamily="Arial,sans-serif" fontSize="13" fill={MUTED}>2026</text>
        </g>
      ))}
      <Footer left="VITE / TYPESCRIPT / TAILWIND CSS" right="2026" />
    </Frame>
  );
}

/* ---------- Research sheet that trails the pointer over the About statement ---------- */

export function StatementArt({ className, title }: ArtProps) {
  return (
    <Frame viewBox="0 0 600 720" className={className} title={title}>
      <rect width="600" height="720" fill={IVORY} />
      <g fontFamily="Arial,sans-serif" fill="#111">
        <text x="32" y="48" fontSize="22" letterSpacing="-1">FROM CIRCUIT TO BROWSER</text>
        <text x="32" y="75" fontSize="10" letterSpacing="2">ESP32 / FIREBASE / WEB / 01-06</text>
      </g>
      <g stroke="#a5a096" fill="none">
        <path d="M32 96h536M32 110v530M298 110v530M568 110v530M32 280h536M32 460h536M32 640h536" />
      </g>
      {/* 01 hardware */}
      <g transform="translate(60 128)">
        <rect width="205" height="122" fill="#141414" />
        <rect x="68" y="20" width="70" height="82" rx="4" fill={IVORY} />
        <path d="M48 36h20M48 56h20M48 76h20M48 96h20M138 36h20M138 56h20M138 76h20M138 96h20" stroke={IVORY} strokeWidth="3" />
        <circle cx="80" cy="32" r="5" fill={ORANGE} />
      </g>
      {/* 02 network */}
      <g transform="translate(326 128)" fill="none" strokeWidth="8" strokeLinecap="round">
        <path d="M81 83A30 30 0 0 1 123 83" stroke="#171717" />
        <path d="M63 65A55 55 0 0 1 141 65" stroke="#171717" />
        <path d="M45 47A80 80 0 0 1 159 47" stroke={ORANGE} />
        <circle cx="102" cy="104" r="8" fill={ORANGE} stroke="none" />
      </g>
      {/* 03 database */}
      <g transform="translate(60 305)">
        <rect width="205" height="125" fill={ORANGE} />
        <ellipse cx="102" cy="92" rx="50" ry="14" fill="#131313" />
        <rect x="52" y="32" width="100" height="60" fill="#131313" />
        <path d="M52 54a50 14 0 0 0 100 0M52 74a50 14 0 0 0 100 0" fill="none" stroke={ORANGE} strokeWidth="3" />
        <ellipse cx="102" cy="32" rx="50" ry="14" fill="#131313" />
      </g>
      {/* 04 interface */}
      <g transform="translate(328 302)" fill="none" stroke="#171717" strokeWidth="2">
        <rect width="205" height="125" />
        <path d="M0 24h205" />
        <rect x="14" y="38" width="90" height="70" fill="#171717" />
        <rect x="116" y="38" width="74" height="30" fill={ORANGE} stroke="none" />
        <rect x="116" y="78" width="74" height="30" />
      </g>
      {/* 05 pwm */}
      <g transform="translate(60 483)">
        <rect width="204" height="124" fill="#111" />
        <path d="M12 92V38H44V92H84V38H132V92H172V38H192" fill="none" stroke={ORANGE} strokeWidth="4" />
      </g>
      {/* 06 access */}
      <g transform="translate(333 483)">
        <rect x="20" y="18" width="56" height="20" fill="#131313" />
        <rect x="20" y="34" width="164" height="80" fill="#131313" />
        <rect x="82" y="66" width="40" height="32" fill={ORANGE} />
        <path d="M90 66v-8a12 12 0 0 1 24 0v8" fill="none" stroke={IVORY} strokeWidth="4" />
      </g>
      <g fontFamily="Arial,sans-serif" fontSize="9" letterSpacing="1" fill="#333">
        <text x="36" y="273">01 / HARDWARE</text>
        <text x="302" y="273">02 / NETWORK</text>
        <text x="36" y="453">03 / DATABASE</text>
        <text x="302" y="453">04 / INTERFACE</text>
        <text x="36" y="633">05 / PWM</text>
        <text x="302" y="633">06 / ACCESS</text>
        <text x="32" y="684" fontSize="10">BUILT IN CEBU, PHILIPPINES</text>
      </g>
    </Frame>
  );
}
