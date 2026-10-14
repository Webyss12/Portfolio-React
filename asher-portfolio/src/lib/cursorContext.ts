import { createContext, useContext } from 'react';

// Lets the featured card tell the custom cursor to switch to the big "View case study" bubble.
export const CursorContext = createContext<(on: boolean) => void>(() => {});
export const useProjectCursor = () => useContext(CursorContext);
