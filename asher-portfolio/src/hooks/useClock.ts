import { useEffect, useState } from 'react';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

// Visitor's local time. The offset comes from the browser, so half-hour zones (e.g. +05:30) are right.
export function formatClock(d: Date) {
  const offsetMin = -d.getTimezoneOffset();
  const sign = offsetMin >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMin);
  return {
    zone: `GMT${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)} // LOCAL`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
  };
}

// Ticks once per second and pauses while the tab is hidden.
export function useClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timer = 0;
    const start = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => setNow(new Date()), 1000);
    };
    const onVisibility = () => {
      if (document.hidden) {
        window.clearInterval(timer);
      } else {
        setNow(new Date());
        start();
      }
    };
    if (!document.hidden) start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return formatClock(now);
}
