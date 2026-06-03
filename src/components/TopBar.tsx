import React, { useState, Fragment } from 'react';
import { Icon } from './icons';
import { Avatar } from './Avatar';
import { useAuth } from '../auth';
import { useQuery } from '../api/useQuery';
import * as api from '../api';
import type { User, Notification as Notif } from '../types';

const FALLBACK_USER: User = {
  name: '', dept: '', avatar: '', points: 0, level: 0, levelName: '',
  nextLevel: 0, streak: 0, learnedHours: 0, coursesDone: 0, certs: 0,
};

export function TopBar({
  crumb,
  onMenu,
  onSearch,
  searchValue,
  setSearchValue,
  onNav,
  onSettings,
  onLogout,
}: {
  crumb: string[];
  onMenu: () => void;
  onSearch?: (q: string) => void;
  searchValue: string;
  setSearchValue: (v: string) => void;
  onNav?: (r: string) => void;
  onSettings?: () => void;
  onLogout?: () => void;
}) {
  const { user } = useAuth();
  const USER = user || FALLBACK_USER;
  const notifsQ = useQuery(['notifications'], api.listNotifications);
  const [localNotifs, setLocalNotifs] = useState<Notif[] | null>(null);
  const notifs = localNotifs ?? notifsQ.data ?? [];
  const [bellOpen, setBellOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const unread = notifs.filter((n) => n.unread).length;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch && onSearch(searchValue);
  };
  const closeAll = () => {
    setBellOpen(false);
    setMenuOpen(false);
  };
  const markAllRead = () => {
    setLocalNotifs(notifs.map((n) => ({ ...n, unread: false })));
    api.markAllNotificationsRead().catch(() => {/* 退化为本地标记 */});
  };
  const markOneRead = (id: string) => {
    setLocalNotifs(notifs.map((x) => (x.id === id ? { ...x, unread: false } : x)));
    api.markNotificationRead(id).catch(() => {/* ditto */});
  };

  const NAV_FOR: Record<string, string> = {
    task: 'tasks',
    exam: 'exam',
    badge: 'me',
    community: 'community',
    course: 'me',
  };

  return (
    <header className="topbar">
      <button className="hamburger icon-btn" onClick={onMenu} aria-label="菜单">
        <Icon name="filter" />
      </button>
      <div className="mobile-brand">
        <div className="brand-mark" style={{ width: 30, height: 30, borderRadius: 9 }}>
          <Icon name="rocket" style={{ color: '#fff', width: 17, height: 17 }} />
        </div>
        <span>神通大讲堂</span>
      </div>
      <div className="crumb">
        {crumb.map((c, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <Icon name="chevron" style={{ width: 14, height: 14, color: 'var(--ink-300)' }} />
            )}
            {i === crumb.length - 1 ? <b>{c}</b> : <span>{c}</span>}
          </Fragment>
        ))}
      </div>
      <form className="search" onSubmit={submit}>
        <Icon name="search" />
        <input
          placeholder="搜索课程、文档、考试…"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </form>
      <div className="topbar-right">
        <div className="points-pill">
          <Icon name="coin" />
          {USER.points.toLocaleString()}
        </div>

        <div className="tb-pop">
          <button
            className="icon-btn"
            onClick={() => {
              setBellOpen(!bellOpen);
              setMenuOpen(false);
            }}
          >
            <Icon name="bell" />
            {unread > 0 && <span className="dot" />}
          </button>
          {bellOpen && (
            <>
              <div className="tb-backdrop" onClick={closeAll} />
              <div className="notif-pop">
                <div className="notif-head">
                  <span>
                    通知{unread > 0 && <span className="notif-count">{unread}</span>}
                  </span>
                  <button onClick={markAllRead}>全部已读</button>
                </div>
                <div className="notif-list">
                  {notifs.map((n) => (
                    <button
                      key={n.id}
                      className={'notif-item' + (n.unread ? ' unread' : '')}
                      onClick={() => {
                        markOneRead(n.id);
                        closeAll();
                        onNav && onNav(NAV_FOR[n.type] || 'home');
                      }}
                    >
                      <span className="notif-ic" style={{ background: n.bg, color: n.color }}>
                        <Icon name={n.icon} style={{ width: 18, height: 18 }} />
                      </span>
                      <span className="notif-body">
                        <span className="notif-title">
                          {n.title}
                          {n.unread && <i className="notif-dot" />}
                        </span>
                        <span className="notif-text">{n.text}</span>
                        <span className="notif-time">{n.time}</span>
                      </span>
                    </button>
                  ))}
                </div>
                <button className="notif-foot" onClick={closeAll}>
                  查看全部消息
                </button>
              </div>
            </>
          )}
        </div>

        <div className="tb-pop">
          <button
            className="user-chip"
            onClick={() => {
              setMenuOpen(!menuOpen);
              setBellOpen(false);
            }}
          >
            <Avatar name={USER.avatar} size={38} />
            <div>
              <div className="uname">{USER.name}</div>
              <div className="urole">{USER.dept}</div>
            </div>
            <Icon
              name="chevronD"
              className="user-caret"
              style={{ width: 16, height: 16, color: 'var(--ink-400)' }}
            />
          </button>
          {menuOpen && (
            <>
              <div className="tb-backdrop" onClick={closeAll} />
              <div className="user-menu">
                <div className="user-menu-head">
                  <Avatar name={USER.avatar} size={42} />
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 700 }}>{USER.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{USER.dept}</div>
                  </div>
                </div>
                <div className="user-menu-stats">
                  <div>
                    <b>{USER.points.toLocaleString()}</b>
                    <span>积分</span>
                  </div>
                  <div>
                    <b>Lv.{USER.level}</b>
                    <span>{USER.levelName}</span>
                  </div>
                  <div>
                    <b>{USER.certs}</b>
                    <span>证书</span>
                  </div>
                </div>
                <button
                  className="user-menu-item"
                  onClick={() => {
                    closeAll();
                    onNav && onNav('me');
                  }}
                >
                  <Icon name="me" /> 我的学习
                </button>
                <button
                  className="user-menu-item"
                  onClick={() => {
                    closeAll();
                    onSettings && onSettings();
                  }}
                >
                  <Icon name="spark" /> 个人设置
                </button>
                <div className="divider" style={{ margin: '6px 0' }} />
                <button
                  className="user-menu-item danger"
                  onClick={() => {
                    closeAll();
                    onLogout && onLogout();
                  }}
                >
                  <Icon name="switch" /> 退出登录
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
