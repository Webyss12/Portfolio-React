import { useCallback, useRef, useState, type MouseEvent } from 'react';
import { Approach } from './components/Approach';
import { Capabilities } from './components/Capabilities';
import { CaseStudy } from './components/CaseStudy';
import { Contact } from './components/Contact';
import { Cursor } from './components/Cursor';
import { Featured } from './components/Featured';
import { Hero } from './components/Hero';
import { MenuOverlay } from './components/MenuOverlay';
import { Nav } from './components/Nav';
import { SelectedWork } from './components/SelectedWork';
import { useReducedMotion } from './hooks/useMediaQuery';
import { useScrollLock } from './hooks/useScrollLock';
import { CursorContext } from './lib/cursorContext';
import type { Project } from './types';

const MENU_ID = 'site-menu';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [projectCursor, setProjectCursor] = useState(false);
  const [navShown, setNavShown] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useScrollLock(menuOpen);
  const modalOpen = menuOpen || project !== null;

  const showNav = useCallback(() => setNavShown(true), []);

  // Closing the menu returns focus to the button that opened it.
  const dismissMenu = useCallback(() => {
    setMenuOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  // Choosing a destination closes the menu, scrolls there and moves focus to that section.
  const goTo = useCallback(
    (id: string, e: MouseEvent) => {
      e.preventDefault();
      setMenuOpen(false);
      window.setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        el?.focus({ preventScroll: true });
      }, 60);
    },
    [reduced],
  );

  const openCase = useCallback((p: Project, opener: HTMLElement) => {
    openerRef.current = opener;
    setProject(p);
  }, []);

  const closeCase = useCallback(() => {
    setProject(null);
    requestAnimationFrame(() => openerRef.current?.focus());
  }, []);

  return (
    <CursorContext.Provider value={setProjectCursor}>
      <div className="relative min-h-screen bg-black font-body text-white">
        <a
          href="#work"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:text-black"
        >
          Skip to selected work
        </a>

        {/* The navigation layer sits outside #page so it stays usable while the page is inert */}
        <Nav
          open={menuOpen}
          shown={navShown}
          disabled={project !== null}
          panelId={MENU_ID}
          triggerRef={triggerRef}
          onToggle={() => (menuOpen ? dismissMenu() : setMenuOpen(true))}
        />
        <MenuOverlay open={menuOpen} id={MENU_ID} triggerRef={triggerRef} onDismiss={dismissMenu} onNavigate={goTo} />

        <div id="page" inert={modalOpen}>
          <main>
            <Hero modalOpen={modalOpen} onIntroStart={showNav} />
            <Approach />
            <Featured onOpen={openCase} />
            <SelectedWork onOpen={openCase} />
            <Capabilities />
            <Contact />
          </main>
        </div>

        <CaseStudy project={project} onClose={closeCase} />
        <Cursor projectMode={projectCursor} />
      </div>
    </CursorContext.Provider>
  );
}
