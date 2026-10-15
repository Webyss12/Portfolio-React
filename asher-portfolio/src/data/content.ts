import type { Assets, Persona, Project, Service } from '../types';

// Edit this file to change your name, copy, projects and tech stack. Everything on the page reads from here.

export const PERSONA: Persona = {
  firstName: 'Richito',
  lastName: 'Quinañola', // add a surname here if you want it in the big hero name
  monogram: 'RQ', // Embedded Systems. Use any two letters you like.
  role: 'Embedded Systems & Web Developer',
tagline: 'I develop a local AI library chatbot with LLMs, semantic search and a Flask backend.',
  note: 'Student developer in Cebu, learning backend development.',
  heroLabel: 'Cebu, Philippines / Embedded & web / 001',
  statement: [
  'Fourth-year BS Information Technology student at Cebu Technological',
  'University Ginatilan Extension Campus, passionate about embedded systems, web',
  'development, and backend engineering. Skilled at bridging hardware',
  'and software, with a strong commitment to continuous learning',
  'through hands-on projects and self-study.',
],
  intro:
    'I connect hardware, cloud services and web interfaces into systems that work as a whole. I study at Cebu Technological University, Ginatilan Extension Campus, and build projects on the side.',
  disciplines: ['AI Chatbot', 'Backend & Data', 'Embedded Systems'],
  contactIntro: 'Have a project, looking for an internship, or something to build in mind? Tell me about it.',
  email: 'quinanolarichitojr@gmail.com', // TODO: check this is the address you want visitors to use
  location: 'Cebu, Philippines',
  socialLinks: [{ label: 'GitHub', href: 'https://github.com/Webyss12' }],
};

// Put your portrait at public/hero.jpg, or set a different path/URL here.
// Any other key can be set to an image URL (for example a real photo of a project) to replace that built-in artwork.
export const ASSETS: Assets = {
  hero: '/hero.png',
  statement: null,
  scoreboard: null,
  smartled: null,
  chatbot: null,
  waterworks: null,
  fileserver: null,
  portfolio: null,
};

// TODO: years are set to 2026 as a placeholder. Change each to the year you really built it.
export const PROJECTS: Project[] = [
  {
    id: '01',
    slug: 'esp32-basketball-scoreboard',
    title: 'ESP32 Basketball Scoreboard',
    year: '2026',
    discipline: 'Embedded & Web',
    role: 'Firmware, hardware wiring, web controller UI.',
    summary: 'A multi-part basketball scoreboard run by an ESP32, with LED score displays, a period display, a buzzer and a web controller.',
    challenge:
      'Getting every part to work together: lambda issues, naming conflicts, library incompatibilities with the ESP32, and power problems on the MAX7219 display.',
    approach:
      'TM1637 LED displays show the scores, a MAX7219 shows the period, and a buzzer signals the end of play. Firebase Realtime Database keeps the scoreboard and the web controller in sync. The controller is being redesigned with calculator-style buttons to reduce misclicks, and a layout that adapts to landscape and portrait.',
    deliverables: ['Arduino firmware', 'Hardware wiring', 'Firebase sync', 'Web controller UI (redesign in progress)'],
    coverKey: 'scoreboard',
    projectType: 'Personal project',
    caption: 'ESP32 Scoreboard System',
  },
  {
    id: '02',
    slug: 'smartled-iot-controller',
    title: 'SmartLED IoT Controller',
    year: '2026',
    discipline: 'Embedded & IoT',
    role: 'Firmware, embedded web dashboard.',
    summary: 'An ESP32 LED controller with PWM brightness control and a dashboard served by the board itself.',
    challenge: 'Make a light easy to control from any browser on the local network.',
    approach:
      'The ESP32 serves an embedded HTML dashboard from its own web server and drives the LED with PWM brightness control. Firebase Realtime Database stores and syncs the state, and mDNS makes the controller reachable at smartled.local.',
    deliverables: ['ESP32 firmware', 'Embedded web dashboard', 'Firebase RTDB sync', 'Local address with mDNS'],
    coverKey: 'smartled',
    projectType: 'Personal project',
  },
  {
  id: '03',
  slug: 'local-ai-chatbot',
  title: 'Local Library Chatbot',
  year: '2026',
  discipline: 'AI & Backend',
  role: 'Backend, semantic search, prompt design, chat frontend.',
  summary: 'A library assistant that helps students and teachers find books. It runs a small language model locally with Ollama, so no cloud AI service is needed.',
  challenge: 'Small language models make up books. The chatbot must recommend only books that really exist in the library.',
  approach:
    'Each question becomes an embedding with FastEmbed (BAAI/bge-small-en-v1.5), and cosine similarity finds the closest books in the catalog. Only those books are passed to the model as a strict whitelist, so it cannot recommend anything else. Answers stream to a vanilla JavaScript frontend with server-sent events, and a semantic cache returns saved answers for similar first questions. The books are in a JSON file for now, and PostgreSQL is the planned next step.',
  deliverables: [
    'Flask API with streaming chat',
    'Semantic book search',
    'Whitelist prompt design',
    'Semantic response cache',
    'Chat frontend',
  ],
  coverKey: 'chatbot',
  projectType: 'Personal project',
  featuredLines: ['LOCAL AI', 'CHATBOT'],
  caption: 'Local Library Assistant',
},
  {
    id: '04',
    slug: 'waterworks-report',
    title: 'Waterworks Consumption Report',
    year: '2026',
    discipline: 'Backend & Data',
    role: 'SQL queries and reporting.',
    summary: 'A report that extracts water consumption data for a local waterworks system.',
    challenge: 'Pull the right numbers out of an existing database behind a Django system.',
    approach:
      'SQL queries against the MySQL database used by the Django system produce the consumption report. I learned SQL fundamentals while building it.',
    deliverables: ['SQL queries', 'Consumption report'],
    coverKey: 'waterworks',
    projectType: 'Data project',
  },
  {
    id: '05',
    slug: 'file-services-lab',
    title: 'File Services and Access Control',
    year: '2026',
    discipline: 'Systems',
    role: 'Server setup and permissions.',
    summary: 'Laboratory Activity 4 at Cebu Technological University, Argao: a basic file server for a small organization, on Windows Server 2025 in VMware.',
    challenge: 'Give each department the access it needs, and keep other departments out of its folders.',
    approach:
      'Department folders use NTFS and share permissions together. Effective access checks confirm each result, and Access-Based Enumeration hides folders a user is not allowed to open.',
    deliverables: ['Department folder structure', 'NTFS and share permissions', 'Effective access checks', 'Access-Based Enumeration'],
    coverKey: 'fileserver',
    projectType: 'Coursework',
  },
  {
    id: '06',
    slug: 'developer-portfolio',
    title: 'Developer Portfolio',
    year: '2026',
    discipline: 'Frontend',
    role: 'Design implementation and front-end development.',
    summary: 'The portfolio you are looking at, built with React, Vite and Tailwind CSS.',
    challenge: 'Turn a detailed design into reusable React components with Tailwind CSS, with motion that respects reduced-motion settings.',
    approach:
      'Each section is a React component that reads from one content file. Styling is Tailwind utility classes, and scroll reveals, the menu and the case-study dialogs are built with hooks and native browser features.',
    deliverables: ['React components', 'Tailwind CSS styling', 'Scroll and hover motion', 'Accessible menu and dialogs'],
    coverKey: 'portfolio',
    projectType: 'Personal project',
  },
];

export const SERVICES: Service[] = [
  {
    id: '01',
    title: 'AI & Search',
    stack: ['Ollama', 'Qwen 3.5', 'FastEmbed', 'Semantic search'],
    text: 'Running small language models locally and grounding their answers in real data, so the chatbot recommends only books the library actually has.',
    usedIn: 'Local Library Chatbot.',
  },
  {
    id: '02',
    title: 'Backend & Data',
    stack: ['Python', 'Flask', 'Django', 'REST APIs', 'MySQL', 'PostgreSQL', 'Firebase RTDB'],
    text: 'Servers, APIs and databases that hold the data and connect the pieces. PostgreSQL is the next step for the chatbot.',
    usedIn: 'Local Library Chatbot, Waterworks Consumption Report, Firebase sync in the ESP32 projects.',
  },
  {
    id: '03',
    title: 'Web Development',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'HTML / CSS / JavaScript'],
    text: 'Interfaces for controlling devices and presenting information, from a dashboard served by a microcontroller to a full React app.',
    usedIn: 'Chatbot frontend, scoreboard web controller, SmartLED dashboard, Developer Portfolio.',
  },
  {
    id: '04',
    title: 'Embedded Systems',
    stack: ['ESP32', 'Arduino', 'C/C++', 'PWM & LEDs'],
    text: 'Firmware and wiring for devices that connect to the internet: displays, buzzers, LED control and sensors, with the debugging that goes with them.',
    usedIn: 'ESP32 Basketball Scoreboard, SmartLED IoT Controller.',
  },
  {
    id: '05',
    title: 'Systems & Tools',
    stack: ['Windows Server', 'VMware', 'Git & GitHub', 'VS Code'],
    text: 'Setting up and managing servers in virtual machines, and the everyday tools I build with.',
    usedIn: 'File Services and Access Control lab.',
  },
];
