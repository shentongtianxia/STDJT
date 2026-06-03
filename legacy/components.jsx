/* 神通大讲堂 — shared components & icons */
const { useState } = React;

/* ---------------- Icons ---------------- */
const ICON_PATHS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M9.5 20v-6h5v6"/>',
  learn: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 1 4 17.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5A1.5 1.5 0 0 0 20 17.5z"/>',
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
  rocket: '<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2"/><path d="M9 14c5-1 8-5 9-11-6 1-10 4-11 9z"/><circle cx="14.5" cy="9.5" r="1.5"/>',
  box: '<path d="M12 3 4 7v10l8 4 8-4V7z"/><path d="m4 7 8 4 8-4M12 11v10"/>',
  trend: '<path d="M4 17 10 11l3.5 3.5L20 8"/><path d="M15 8h5v5"/>',
  shield: '<path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z"/><path d="m9.2 12 1.9 1.9 3.7-3.9"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3.5 19c.5-3 2.8-4.5 5.5-4.5s5 1.5 5.5 4.5"/><path d="M16 5.5a2.8 2.8 0 0 1 0 5.5M21 19c-.3-2-1.4-3.4-3-4"/>',
  spark: '<path d="M12 3v4M12 17v4M5 12H3M21 12h-2M6.3 6.3 7.7 7.7M16.3 16.3l1.4 1.4M17.7 6.3l-1.4 1.4M7.7 16.3l-1.4 1.4"/><circle cx="12" cy="12" r="3"/>',
  laptop: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2.5 20h19"/>',
  flame: '<path d="M12 3c1 3-2 4-2 7a2 2 0 0 0 4 .5C16 13 14 8 12 3z"/><path d="M8.5 12c-1 1.5-1.5 3-1.5 4.5a5 5 0 0 0 10 0c0-2-1-3.5-2-5-.3 2-1.5 3-3 3-.5-2 .5-4-3.5-2.5z"/>',
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
function Icon({ name, className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] || "" }} />
  );
}

/* ---------------- Avatar ---------------- */
const AV_COLORS = ["#3A5A86","#3F6E60","#7C6242","#4E4D80","#3A6470","#5E5566"];
function Avatar({ name, size = 36, color }) {
  const c = color || AV_COLORS[(name?.charCodeAt(0) || 0) % AV_COLORS.length];
  return (
    <div className="avatar" style={{ width: size, height: size, background: c, fontSize: size * 0.42 }}>
      {name?.[0]}
    </div>
  );
}

/* ---------------- Cover ---------------- */
function Cover({ course, showPlay = true }) {
  const cat = CATEGORIES.find(c => c.id === course.cat);
  const isDoc = course.type === "doc";
  return (
    <div className="cover" style={{ background: COVER_COLORS[course.cat] }}>
      <Icon name={isDoc ? "doc" : cat?.icon || "play"} className="cover-ic" />
      <span className="cover-cat">{cat?.name}</span>
      <span className="cover-dur"><Icon name={isDoc ? "doc" : "clock"} />{course.dur}</span>
      {showPlay && !isDoc && (
        <div className="play-overlay"><Icon name="play" /></div>
      )}
    </div>
  );
}

/* ---------------- CourseCard ---------------- */
function CourseCard({ course, onOpen }) {
  return (
    <div className="card course-card" onClick={() => onOpen(course)}>
      <Cover course={course} />
      <div className="cc-body">
        <div className="cc-title">{course.title}</div>
        <div className="cc-meta">
          <span>{course.lessons} 节</span>
          <i className="dotsep" />
          <span>{course.learners.toLocaleString()} 人在学</span>
        </div>
        {course.progress > 0 ? (
          <div style={{ marginTop: 11 }}>
            <div className="progress"><i style={{ width: course.progress + "%" }} /></div>
            <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginTop: 6 }}>
              {course.progress === 100 ? "已完成 · 可复习" : `已学 ${course.progress}%`}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 11, display: "flex", alignItems: "center", gap: 8 }}>
            <span className="tag gray" style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="star" style={{ width: 13, height: 13, color: "var(--gold-400)" }} />{course.rating}
            </span>
            {course.required && <span className="tag orange">必修</span>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Nav defs (shared by Sidebar + BottomNav) ---------------- */
const LEARNER_NAV = [
  { id: "home", name: "首页", icon: "home" },
  { id: "learn", name: "学习中心", icon: "learn" },
  { id: "kb", name: "知识库", icon: "kb" },
  { id: "tasks", name: "任务中心", icon: "task", badge: 3 },
  { id: "exam", name: "考试中心", icon: "exam", badge: 2 },
  { id: "me", name: "我的学习", icon: "me" },
  { id: "community", name: "内部社区", icon: "chat" },
];
const ADMIN_NAV = [
  { id: "a-dash", name: "数据看板", icon: "chart" },
  { id: "a-courses", name: "课程管理", icon: "learn" },
  { id: "a-tasks", name: "任务指派", icon: "task" },
  { id: "a-people", name: "学员管理", icon: "users" },
];
const getNav = (mode) => (mode === "admin" ? ADMIN_NAV : LEARNER_NAV);
// mobile bottom-bar shows up to 5 primary destinations
const BOTTOM_NAV = {
  learner: ["home", "learn", "kb", "tasks", "me"],
  admin: ["a-dash", "a-courses", "a-tasks", "a-people"],
};

/* ---------------- Sidebar ---------------- */
function Sidebar({ route, setRoute, mode, open, onClose }) {
  const nav = getNav(mode);
  return (
    <aside className={"sidebar" + (open ? " open" : "")}>
      <div className="brand">
        <div className="brand-mark"><Icon name="rocket" style={{ color: "#fff" }} /></div>
        <div>
          <div className="brand-name">神通大讲堂</div>
          <div className="brand-sub">{mode === "admin" ? "ADMIN CONSOLE" : "LEARNING HUB"}</div>
        </div>
        <button className="drawer-close" onClick={onClose} aria-label="关闭">
          <Icon name="plus" style={{ transform: "rotate(45deg)" }} />
        </button>
      </div>
      <nav className="nav">
        <div className="nav-group-label">{mode === "admin" ? "管理" : "学习"}</div>
        {nav.map(n => (
          <button key={n.id} className={"nav-item" + (route === n.id ? " active" : "")}
            onClick={() => setRoute(n.id)}>
            <Icon name={n.icon} />
            <span>{n.name}</span>
            {n.badge && <span className="nav-badge">{n.badge}</span>}
          </button>
        ))}
      </nav>
      <div className="sidebar-foot">
        <button className="role-switch" onClick={() => setRoute(mode === "admin" ? "home" : "a-dash")}>
          <Icon name="switch" />
          <span>{mode === "admin" ? "返回学员端" : "切换到管理端"}</span>
        </button>
      </div>
    </aside>
  );
}

/* ---------------- TopBar ---------------- */
function TopBar({ crumb, onMenu, onSearch, searchValue, setSearchValue, onNav, onSettings, onLogout }) {
  const [bellOpen, setBellOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [notifs, setNotifs] = React.useState(NOTIFICATIONS);
  const unread = notifs.filter(n => n.unread).length;
  const submit = (e) => { e.preventDefault(); onSearch && onSearch(searchValue); };
  const closeAll = () => { setBellOpen(false); setMenuOpen(false); };
  const markAllRead = () => setNotifs(notifs.map(n => ({ ...n, unread: false })));

  const NAV_FOR = { task: "tasks", exam: "exam", badge: "me", community: "community", course: "me" };

  return (
    <header className="topbar">
      <button className="hamburger icon-btn" onClick={onMenu} aria-label="菜单"><Icon name="filter" /></button>
      <div className="mobile-brand">
        <div className="brand-mark" style={{ width: 30, height: 30, borderRadius: 9 }}><Icon name="rocket" style={{ color: "#fff", width: 17, height: 17 }} /></div>
        <span>神通大讲堂</span>
      </div>
      <div className="crumb">
        {crumb.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Icon name="chevron" style={{ width: 14, height: 14, color: "var(--ink-300)" }} />}
            {i === crumb.length - 1 ? <b>{c}</b> : <span>{c}</span>}
          </React.Fragment>
        ))}
      </div>
      <form className="search" onSubmit={submit}>
        <Icon name="search" />
        <input placeholder="搜索课程、文档、考试…" value={searchValue} onChange={e => setSearchValue(e.target.value)} />
      </form>
      <div className="topbar-right">
        <div className="points-pill"><Icon name="coin" />{USER.points.toLocaleString()}</div>

        {/* Bell + dropdown */}
        <div className="tb-pop">
          <button className="icon-btn" onClick={() => { setBellOpen(!bellOpen); setMenuOpen(false); }}>
            <Icon name="bell" />{unread > 0 && <span className="dot" />}
          </button>
          {bellOpen && (
            <>
              <div className="tb-backdrop" onClick={closeAll} />
              <div className="notif-pop">
                <div className="notif-head">
                  <span>通知{unread > 0 && <span className="notif-count">{unread}</span>}</span>
                  <button onClick={markAllRead}>全部已读</button>
                </div>
                <div className="notif-list">
                  {notifs.map(n => (
                    <button key={n.id} className={"notif-item" + (n.unread ? " unread" : "")}
                      onClick={() => { setNotifs(notifs.map(x => x.id === n.id ? { ...x, unread: false } : x)); closeAll(); onNav && onNav(NAV_FOR[n.type] || "home"); }}>
                      <span className="notif-ic" style={{ background: n.bg, color: n.color }}><Icon name={n.icon} style={{ width: 18, height: 18 }} /></span>
                      <span className="notif-body">
                        <span className="notif-title">{n.title}{n.unread && <i className="notif-dot" />}</span>
                        <span className="notif-text">{n.text}</span>
                        <span className="notif-time">{n.time}</span>
                      </span>
                    </button>
                  ))}
                </div>
                <button className="notif-foot" onClick={closeAll}>查看全部消息</button>
              </div>
            </>
          )}
        </div>

        {/* User chip + menu */}
        <div className="tb-pop">
          <button className="user-chip" onClick={() => { setMenuOpen(!menuOpen); setBellOpen(false); }}>
            <Avatar name={USER.avatar} size={38} />
            <div>
              <div className="uname">{USER.name}</div>
              <div className="urole">{USER.dept}</div>
            </div>
            <Icon name="chevronD" className="user-caret" style={{ width: 16, height: 16, color: "var(--ink-400)" }} />
          </button>
          {menuOpen && (
            <>
              <div className="tb-backdrop" onClick={closeAll} />
              <div className="user-menu">
                <div className="user-menu-head">
                  <Avatar name={USER.avatar} size={42} />
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 700 }}>{USER.name}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-500)" }}>{USER.dept}</div>
                  </div>
                </div>
                <div className="user-menu-stats">
                  <div><b>{USER.points.toLocaleString()}</b><span>积分</span></div>
                  <div><b>Lv.{USER.level}</b><span>{USER.levelName}</span></div>
                  <div><b>{USER.certs}</b><span>证书</span></div>
                </div>
                <button className="user-menu-item" onClick={() => { closeAll(); onNav && onNav("me"); }}><Icon name="me" /> 我的学习</button>
                <button className="user-menu-item" onClick={() => { closeAll(); onSettings && onSettings(); }}><Icon name="spark" /> 个人设置</button>
                <div className="divider" style={{ margin: "6px 0" }} />
                <button className="user-menu-item danger" onClick={() => { closeAll(); onLogout && onLogout(); }}><Icon name="switch" /> 退出登录</button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/* ---------------- BottomNav (mobile only) ---------------- */
function BottomNav({ route, setRoute, mode }) {
  const nav = getNav(mode);
  const ids = BOTTOM_NAV[mode] || BOTTOM_NAV.learner;
  const items = ids.map(id => nav.find(n => n.id === id)).filter(Boolean);
  // course detail counts as part of "learn" highlight
  const activeId = route === "course" ? "learn" : route;
  return (
    <nav className="bottom-nav">
      {items.map(n => (
        <button key={n.id} className={"bn-item" + (activeId === n.id ? " active" : "")}
          onClick={() => setRoute(n.id)}>
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

Object.assign(window, { Icon, Avatar, Cover, CourseCard, Sidebar, TopBar, BottomNav, getNav, BOTTOM_NAV });
