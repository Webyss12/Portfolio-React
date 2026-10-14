import type { ArtKey } from '../types';

// Descriptions used when artwork shows project content (not just decoration).
export const ART_ALT: Partial<Record<ArtKey, string>> = {
  scoreboard: 'Illustration of the basketball scoreboard: seven-segment score displays, a period display, a buzzer and web controller buttons.',
  smartled: 'Illustration of the SmartLED dashboard at smartled.local: a glowing LED, a brightness slider and a PWM waveform.',
  chatbot: 'Illustration of the chatbot: a chat asking where a Python book is, above a shelf of book spines.',
  waterworks: 'Illustration of the waterworks report: a monthly water consumption bar chart with a water drop.',
  fileserver: 'Illustration of the file server lab: a Company Share folder with Sales, Admin and IT folders and NTFS, share and ABE tags.',
  portfolio: 'Illustration of this portfolio: a browser window with a large name, a button and a list of projects.',
};
