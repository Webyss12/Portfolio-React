import { useEffect, useState } from 'react';

export type ImageStatus = 'loading' | 'ready' | 'error';

// Loads an image in the background so we know if it exists and how big it is.
export function useImageStatus(src: string | null) {
  const [state, setState] = useState<{ status: ImageStatus; width: number; height: number }>({
    status: src ? 'loading' : 'error',
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => setState({ status: 'ready', width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => setState({ status: 'error', width: 0, height: 0 });
    img.src = src;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return state;
}
