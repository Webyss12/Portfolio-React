export type ArtKey = 'statement' | 'scoreboard' | 'smartled' | 'chatbot' | 'waterworks' | 'fileserver' | 'portfolio';

export interface SocialLink {
  label: string;
  href: string;
}

export interface Persona {
  firstName: string;
  /** optional second part of the big hero name. Leave '' to show only the first name. */
  lastName: string;
  /** the two big letters left of your name in the hero */
  monogram: string;
  role: string;
  tagline: string;
  note: string;
  heroLabel: string;
  /** the big statement in the About section, one entry per line */
  statement: string[];
  intro: string;
  disciplines: string[];
  contactIntro: string;
  email: string | null;
  location: string | null;
  socialLinks: SocialLink[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  year: string;
  discipline: string;
  role: string;
  summary: string;
  challenge: string;
  approach: string;
  deliverables: string[];
  coverKey: Exclude<ArtKey, 'statement'>;
  projectType: string;
  featuredLines?: [string, string];
  caption?: string;
}

export interface Service {
  id: string;
  title: string;
  /** the technologies, shown on the row */
  stack: string[];
  text: string;
  /** which projects use this stack */
  usedIn: string;
}

/** Optional image overrides. null means "use the built-in artwork". */
export type Assets = Record<'hero' | ArtKey, string | null>;
