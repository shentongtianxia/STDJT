import React from 'react';
import { Icon } from './icons';
import { getNav, type NavMode } from './nav';

export function Sidebar({
  route,
  setRoute,
  mode,
  open,
  onClose,
}: {
  route: string;
  setRoute: (r: string) => void;
  mode: NavMode;
  open: boolean;
  onClose: () => void;
}) {
  const nav = getNav(mode);
  return (
    <aside className={'sidebar' + (open ? ' open' : '')}>
      <div className="brand">
        <div className="brand-mark">
          <Icon name="rocket" style={{ color: '#fff' }} />
        </div>
        <div>
          <div className="brand-name">神通大讲堂</div>
          <div className="brand-sub">{mode === 'admin' ? 'ADMIN CONSOLE' : 'LEARNING HUB'}</div>
        </div>
        <button className="drawer-close" onClick={onClose} aria-label="关闭">
          <Icon name="plus" style={{ transform: 'rotate(45deg)' }} />
        </button>
      </div>
      <nav className="nav">
        <div className="nav-group-label">{mode === 'admin' ? '管理' : '学习'}</div>
        {nav.map((n) => (
          <button
            key={n.id}
            className={'nav-item' + (route === n.id ? ' active' : '')}
            onClick={() => setRoute(n.id)}
          >
            <Icon name={n.icon} />
            <span>{n.name}</span>
            {n.badge && <span className="nav-badge">{n.badge}</span>}
          </button>
        ))}
      </nav>
      <div className="sidebar-foot">
        <button
          className="role-switch"
          onClick={() => setRoute(mode === 'admin' ? 'home' : 'a-dash')}
        >
          <Icon name="switch" />
          <span>{mode === 'admin' ? '返回学员端' : '切换到管理端'}</span>
        </button>
      </div>
    </aside>
  );
}
