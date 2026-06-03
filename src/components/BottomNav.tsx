// @ts-nocheck
import React from 'react';
import { Icon } from './icons';
import { getNav, BOTTOM_NAV, type NavMode } from './nav';

export function BottomNav({
  route,
  setRoute,
  mode,
}: {
  route: string;
  setRoute: (r: string) => void;
  mode: NavMode;
}) {
  const nav = getNav(mode);
  const ids = BOTTOM_NAV[mode] || BOTTOM_NAV.learner;
  const items = ids.map((id) => nav.find((n) => n.id === id)).filter(Boolean) as any[];
  const activeId = route === 'course' ? 'learn' : route;
  return (
    <nav className="bottom-nav">
      {items.map((n) => (
        <button
          key={n.id}
          className={'bn-item' + (activeId === n.id ? ' active' : '')}
          onClick={() => setRoute(n.id)}
        >
          <span className="bn-ic">
            <Icon name={n.icon} />
            {n.badge && <span className="bn-badge">{n.badge}</span>}
          </span>
          <span className="bn-label">{n.name}</span>
        </button>
      ))}
    </nav>
  );
}
