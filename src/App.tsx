// @ts-nocheck
import React, { useState, Fragment } from 'react';
import { Icon, Avatar, Sidebar, TopBar, BottomNav } from './components';
import { LoginPage } from './pages/Auth';
import { HomePage } from './pages/Home';
import { LearnPage } from './pages/Learn';
import { KbPage, DocReader, resolveDoc } from './pages/Kb';
import { TasksPage } from './pages/Tasks';
import { ExamPage } from './pages/Exam';
import { MePage } from './pages/Me';
import { CommunityPage } from './pages/Community';
import { SearchPage } from './pages/Search';
import { SettingsPage } from './pages/Settings';
import { AdminDash, AdminCourses, AdminTasks, AdminPeople } from './pages/Admin';
import { CoursePage } from './pages/Course';

/* 神通大讲堂 — App shell & routing */

const CRUMBS = {
  home: ["首页"], learn: ["学习中心"], kb: ["知识库"], tasks: ["任务中心"],
  exam: ["考试中心"], me: ["我的学习"], community: ["内部社区"],
  "a-dash": ["管理端", "数据看板"], "a-courses": ["管理端", "课程管理"],
  "a-tasks": ["管理端", "任务指派"], "a-people": ["管理端", "学员管理"],
};

function Placeholder({ name }) {
  return (
    <div className="content fade-up">
      <div className="card" style={{ padding: "70px 30px", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, margin: "0 auto 18px", display: "grid", placeItems: "center", background: "var(--brand-50)" }}>
          <Icon name="spark" style={{ width: 30, height: 30, color: "var(--brand-600)" }} />
        </div>
        <h2 style={{ margin: "0 0 8px", fontSize: 20 }}>{name} · 建设中</h2>
        <p className="muted" style={{ margin: 0, fontSize: 14 }}>先确认首页效果，确认后我会继续完成这个模块。</p>
      </div>
    </div>
  );
}

function App() {
  const [authed, setAuthed] = useState(false);
  const [route, setRoute] = useState("home");
  const [course, setCourse] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [query, setQuery] = useState("");        // committed search query
  const [searchValue, setSearchValue] = useState(""); // topbar input value
  const [doc, setDoc] = useState(null);          // app-level doc reader

  const mode = route.startsWith("a-") ? "admin" : "learner";
  const onOpen = (c) => { setCourse(c); setDoc(null); setRoute("course"); window.scrollTo(0, 0); };
  const openDoc = (d) => { setDoc(resolveDoc(d)); window.scrollTo(0, 0); };
  const go = (r) => { setCourse(null); setDoc(null); setRoute(r); setNavOpen(false); window.scrollTo(0, 0); };
  const runSearch = (q) => {
    const term = (typeof q === "string" ? q : "").trim();
    setSearchValue(term); setQuery(term); setCourse(null); setDoc(null);
    setRoute("search"); setNavOpen(false); window.scrollTo(0, 0);
  };

  if (!authed) return <LoginPage onLogin={() => setAuthed(true)} />;

  let page;
  if (doc) page = <DocReader doc={doc} onBack={() => setDoc(null)} />;
  else if (route === "home") page = <HomePage onOpen={onOpen} setRoute={setRoute} />;
  else if (route === "learn") page = <LearnPage onOpen={onOpen} />;
  else if (route === "kb") page = <KbPage />;
  else if (route === "tasks") page = <TasksPage onOpen={onOpen} />;
  else if (route === "exam") page = <ExamPage />;
  else if (route === "me") page = <MePage onOpen={onOpen} />;
  else if (route === "community") page = <CommunityPage />;
  else if (route === "settings") page = <SettingsPage />;
  else if (route === "search") page = <SearchPage query={query} onOpen={onOpen} openDoc={openDoc} setRoute={(r) => r && r.type === "search" ? runSearch(r.q) : go(r)} />;
  else if (route === "a-dash") page = <AdminDash />;
  else if (route === "a-courses") page = <AdminCourses />;
  else if (route === "a-tasks") page = <AdminTasks />;
  else if (route === "a-people") page = <AdminPeople />;
  else if (route === "course" && course) page = <CoursePage course={course} onOpen={onOpen} setRoute={setRoute} />;
  else page = <Placeholder name={(CRUMBS[route] || ["页面"]).slice(-1)[0]} />;

  const crumb = doc ? ["知识库", doc.title]
    : route === "course" ? ["学习中心", course?.title || "课程"]
    : route === "search" ? ["搜索", query || "全部"]
    : route === "settings" ? ["个人设置"]
    : (CRUMBS[route] || ["首页"]);

  return (
    <div className={"app" + (mode === "admin" ? " admin-mode" : "")}>
      <Sidebar route={route} setRoute={go} mode={mode} open={navOpen} onClose={() => setNavOpen(false)} />
      {navOpen && <div className="nav-backdrop" onClick={() => setNavOpen(false)} />}
      <div className="main">
        <TopBar crumb={crumb} onMenu={() => setNavOpen(true)} onSearch={runSearch} searchValue={searchValue} setSearchValue={setSearchValue}
          onNav={go} onSettings={() => go("settings")} onLogout={() => { setAuthed(false); setRoute("home"); }} />
        {page}
      </div>
      <BottomNav route={route} setRoute={go} mode={mode} />
    </div>
  );
}

export default App;
