import React from 'react';

export const ICON_PATHS: Record<string, string> = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M9.5 20v-6h5v6"/>',
  learn:
    '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 1 4 17.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5A1.5 1.5 0 0 0 20 17.5z"/>',
  kb: '<path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z"/><path d="M9 8h6M9 12h6"/>',
  task: '<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="m8.5 12 2.2 2.2 4.3-4.4"/>',
  exam: '<path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4"/><path d="m9.5 14 1.6 1.6 3-3.2"/>',
  me: '<circle cx="12" cy="8" r="3.4"/><path d="M5.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/>',
  chat: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9A1.5 1.5 0 0 1 18.5 16H9l-4 4z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  bell: '<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  coin: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v10M9.3 9.2h3.7a1.8 1.8 0 0 1 0 3.6H9.6h3.4a1.8 1.8 0 0 1 0 3.6H9.3"/>',
  play: '<circle cx="12" cy="12" r="11" fill="rgba(255,255,255,.92)" stroke="none"/><path d="M10 8.5 16 12l-6 3.5z" fill="#205AD9" stroke="none"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  chevronD: '<path d="m6 9 6 6 6-6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
  rocket:
    '<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2"/><path d="M9 14c5-1 8-5 9-11-6 1-10 4-11 9z"/><circle cx="14.5" cy="9.5" r="1.5"/>',
  box: '<path d="M12 3 4 7v10l8 4 8-4V7z"/><path d="m4 7 8 4 8-4M12 11v10"/>',
  trend: '<path d="M4 17 10 11l3.5 3.5L20 8"/><path d="M15 8h5v5"/>',
  shield: '<path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z"/><path d="m9.2 12 1.9 1.9 3.7-3.9"/>',
  users:
    '<circle cx="9" cy="8" r="3"/><path d="M3.5 19c.5-3 2.8-4.5 5.5-4.5s5 1.5 5.5 4.5"/><path d="M16 5.5a2.8 2.8 0 0 1 0 5.5M21 19c-.3-2-1.4-3.4-3-4"/>',
  spark:
    '<path d="M12 3v4M12 17v4M5 12H3M21 12h-2M6.3 6.3 7.7 7.7M16.3 16.3l1.4 1.4M17.7 6.3l-1.4 1.4M7.7 16.3l-1.4 1.4"/><circle cx="12" cy="12" r="3"/>',
  laptop: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2.5 20h19"/>',
  flame:
    '<path d="M12 3c1 3-2 4-2 7a2 2 0 0 0 4 .5C16 13 14 8 12 3z"/><path d="M8.5 12c-1 1.5-1.5 3-1.5 4.5a5 5 0 0 0 10 0c0-2-1-3.5-2-5-.3 2-1.5 3-3 3-.5-2 .5-4-3.5-2.5z"/>',
  book: '<path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z"/><path d="M9 8h6"/>',
  trophy: '<path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3M10 13.5h4M9 20h6M12 16v4"/>',
  heart: '<path d="M12 20s-7-4.3-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7-1.2c0 4.9-7 9.2-7 9.2z"/>',
  doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M9.5 12h5M9.5 15.5h5"/>',
  bookmark: '<path d="M6 4h12v17l-6-4-6 4z"/>',
  bookmarkFill: '<path d="M6 4h12v17l-6-4-6 4z" fill="currentColor" stroke="none"/>',
  fire: '<path d="M12 3c1 3-2 4-2 7a2 2 0 0 0 4 .5C16 13 14 8 12 3z"/>',
  switch: '<path d="M7 7h11l-3-3M17 17H6l3 3"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  star: '<path d="m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.3L12 16.4 7.2 18.9l.9-5.3-3.9-3.8 5.4-.8z"/>',
  download: '<path d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M5 19h14M14 5l5 5-9 9H5v-5z"/>',
  chart: '<path d="M4 20V4M4 20h16M8 16v-5M12 16V7M16 16v-8"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.5"/>',
  reply: '<path d="M9 14 4 9l5-5M4 9h9a7 7 0 0 1 7 7v3"/>',
  check: '<path d="m5 12 4.5 4.5L19 7"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
};

export function Icon({
  name,
  className,
  style,
}: {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] || '' }}
    />
  );
}
