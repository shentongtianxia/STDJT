import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, TopBar, BottomNav } from './components';
import { useAuth } from './auth';

const PATH_TO_ROUTE: Record<string, string> = {
  '/': 'home',
  '/learn': 'learn',
  '/kb': 'kb',
  '/tasks': 'tasks',
  '/exam': 'exam',
  '/me': 'me',
  '/community': 'community',
  '/settings': 'settings',
  '/search': 'search',
  '/admin/dash': 'a-dash',
  '/admin/courses': 'a-courses',
  '/admin/tasks': 'a-tasks',
  '/admin/people': 'a-people',
};

const ROUTE_TO_PATH: Record<string, string> = Object.fromEntries(
  Object.entries(PATH_TO_ROUTE).map(([p, r]) => [r, p]),
);

function routeFromPath(pathname: string): string {
  if (pathname.startsWith('/courses/')) return 'course';
  if (pathname.startsWith('/docs/')) return 'kb';
  return PATH_TO_ROUTE[pathname] || 'home';
}

const CRUMBS: Record<string, string[]> = {
  home: ['首页'],
  learn: ['学习中心'],
  kb: ['知识库'],
  tasks: ['任务中心'],
  exam: ['考试中心'],
  me: ['我的学习'],
  community: ['内部社区'],
  settings: ['个人设置'],
  'a-dash': ['管理端', '数据看板'],
  'a-courses': ['管理端', '课程管理'],
  'a-tasks': ['管理端', '任务指派'],
  'a-people': ['管理端', '学员管理'],
};

export default function Layout() {
  const loc = useLocation();
  const nav = useNavigate();
  const { logout } = useAuth();
  const [navOpen, setNavOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(
    new URLSearchParams(loc.search).get('q') || '',
  );

  const route = routeFromPath(loc.pathname);
  const mode = route.startsWith('a-') ? 'admin' : 'learner';
  const setRoute = (r: string) => {
    setNavOpen(false);
    nav(ROUTE_TO_PATH[r] || '/');
    window.scrollTo(0, 0);
  };
  const runSearch = (q: string) => {
    const term = (q || '').trim();
    setSearchValue(term);
    nav(term ? `/search?q=${encodeURIComponent(term)}` : '/search');
    setNavOpen(false);
    window.scrollTo(0, 0);
  };

  let crumb: string[] = CRUMBS[route] || ['首页'];
  if (route === 'course') {
    // 标题由 CoursePage 自己展示；面包屑只显示二级位置即可
    crumb = ['学习中心', '课程'];
  } else if (loc.pathname.startsWith('/docs/')) {
    crumb = ['知识库', '文档'];
  } else if (route === 'search') {
    crumb = ['搜索', new URLSearchParams(loc.search).get('q') || '全部'];
  }

  return (
    <div className={'app' + (mode === 'admin' ? ' admin-mode' : '')}>
      <Sidebar
        route={route}
        setRoute={setRoute}
        mode={mode}
        open={navOpen}
        onClose={() => setNavOpen(false)}
      />
      {navOpen && <div className="nav-backdrop" onClick={() => setNavOpen(false)} />}
      <div className="main">
        <TopBar
          crumb={crumb}
          onMenu={() => setNavOpen(true)}
          onSearch={runSearch}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onNav={setRoute}
          onSettings={() => setRoute('settings')}
          onLogout={() => {
            logout();
            nav('/login');
          }}
        />
        <Outlet />
      </div>
      <BottomNav route={route} setRoute={setRoute} mode={mode} />
    </div>
  );
}
