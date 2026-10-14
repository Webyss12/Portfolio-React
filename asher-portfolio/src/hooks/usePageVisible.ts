import { useSyncExternalStore } from 'react';

// true while the browser tab is visible
export function usePageVisible() {
  return useSyncExternalStore(
    (onChange) => {
      document.addEventListener('visibilitychange', onChange);
      return () => document.removeEventListener('visibilitychange', onChange);
    },
    () => !document.hidden,
    () => true,
  );
}
