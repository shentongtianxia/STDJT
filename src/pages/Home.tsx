// @ts-nocheck
import React from 'react';
import { Icon, Avatar, Cover, CourseCard } from '../components';
import { CATEGORIES } from '../data';
import { useQuery } from '../api/useQuery';
import { LoadingScreen, ErrorScreen, aggregate } from '../api/ui';
import * as api from '../api';

/* 神通大讲堂 — 首页 Dashboard */
function StatBox({ icon, value, label, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,.13)",
        display: "grid", placeItems: "center", flex: "none" }}>
        <Icon name={icon} style={{ width: 21, height: 21, color: "#fff" }} />
      </div>
      <div>
        <div style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.7)", marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

function HomePage({ onOpen, setRoute }) {
  const courses = useQuery(['courses'], api.listCourses);
  const tasks = useQuery(['tasks'], api.listTasks);
  const me = useQuery(['me'], api.getMe);
  const board = useQuery(['leaderboard'], api.getLeaderboard);
  const badges = useQuery(['badges'], api.listMyBadges);

  const { loading, error } = aggregate([courses, tasks, me, board, badges]);
  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen err={error} />;

  const COURSES = courses.data!;
  const TASKS = tasks.data!;
  const USER = me.data!;
  const LEADERBOARD = board.data!;
  const BADGES = badges.data!;

  const continueCourses = COURSES.filter(c => c.progress > 0 && c.progress < 100);
  const recommended = COURSES.filter(c => c.progress === 0).slice(0, 4);
  const myTasks = TASKS.filter(t => t.status !== "done").slice(0, 3);
  const hour = 14;
  const greet = hour < 12 ? "上午好" : hour < 18 ? "下午好" : "晚上好";

  return (
    <div className="content fade-up">
      {/* Hero */}
      <div className="hero-card" style={{ borderRadius: 18, padding: "28px 30px", color: "#fff", marginBottom: 26,
        background: "linear-gradient(120deg,#12305f,#0B1A36 70%)", position: "relative", overflow: "hidden",
        boxShadow: "0 14px 40px rgba(11,26,54,.25)" }}>
        <div style={{ position: "absolute", right: -40, top: -40, width: 230, height: 230, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(47,107,240,.45),transparent 70%)" }} />
        <div style={{ position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontSize: 13.5, color: "rgba(255,255,255,.75)", marginBottom: 7 }}>
              {greet}，{USER.name} 👋 已连续学习 <b style={{ color: "#fff" }}>{USER.streak}</b> 天，继续保持！
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-.3px" }}>
              今天也是充电的好日子
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "rgba(255,255,255,.8)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,.12)", padding: "5px 11px", borderRadius: 8 }}>
                <Icon name="spark" style={{ width: 15, height: 15, color: "var(--gold-400)" }} />
                Lv.{USER.level} {USER.levelName}
              </span>
              <span>距下一等级还需 {USER.nextLevel - USER.points} 积分</span>
            </div>
          </div>
          <button className="btn" style={{ background: "#fff", color: "var(--brand-700)", boxShadow: "0 8px 20px rgba(0,0,0,.18)" }}
            onClick={() => continueCourses[0] && onOpen(continueCourses[0])}>
            <Icon name="play" style={{ width: 18, height: 18 }} /> 继续上次学习
          </button>
        </div>
        <div className="l-stats4" style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 26,
          borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: 22 }}>
          <StatBox icon="clock" value={USER.learnedHours + "h"} label="累计学习时长" />
          <StatBox icon="book" value={USER.coursesDone} label="完成课程" />
          <StatBox icon="trophy" value={USER.certs} label="获得证书" />
          <StatBox icon="coin" value={USER.points.toLocaleString()} label="学习积分" />
        </div>
      </div>

      <div className="l-main-rail" style={{ display: "grid", gridTemplateColumns: "1fr 312px", gap: 24, alignItems: "start" }}>
        {/* Left */}
        <div>
          {/* Continue learning */}
          {continueCourses.length > 0 && (
            <>
              <div className="section-head" style={{ marginTop: 0 }}>
                <h2>继续学习</h2>
                <button className="more" onClick={() => setRoute("me")}>全部记录 <Icon name="chevron" /></button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {continueCourses.map(c => (
                  <div key={c.id} className="card" onClick={() => onOpen(c)}
                    style={{ display: "flex", gap: 16, padding: 13, cursor: "pointer", alignItems: "center" }}>
                    <div style={{ width: 150, flex: "none" }}><Cover course={c} showPlay={false} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        {c.required && <span className="tag orange">必修</span>}
                        <span className="tag gray">{CATEGORIES.find(x => x.id === c.cat)?.name}</span>
                      </div>
                      <div style={{ fontSize: 15.5, fontWeight: 600, marginBottom: 4 }}>{c.title}</div>
                      <div style={{ fontSize: 12.5, color: "var(--ink-500)", marginBottom: 10 }}>讲师：{c.instructor}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div className="progress" style={{ flex: 1 }}><i style={{ width: c.progress + "%" }} /></div>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--brand-600)" }}>{c.progress}%</span>
                      </div>
                    </div>
                    <button className="btn btn-primary btn-sm" style={{ flex: "none" }}>继续</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Recommended */}
          <div className="section-head">
            <h2>为你推荐</h2>
            <button className="more" onClick={() => setRoute("learn")}>学习中心 <Icon name="chevron" /></button>
          </div>
          <div className="grid-courses" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))" }}>
            {recommended.map(c => <CourseCard key={c.id} course={c} onOpen={onOpen} />)}
          </div>
        </div>

        {/* Right rail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Tasks */}
          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 700 }}>我的待办</h3>
              <span className="tag red" style={{ marginLeft: 8 }}>{myTasks.length}</span>
              <button className="more" style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--brand-600)", fontWeight: 600 }}
                onClick={() => setRoute("tasks")}>全部</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {myTasks.map(t => {
                const c = COURSES.find(x => x.id === t.courseId);
                return (
                  <div key={t.id} onClick={() => c && onOpen(c)} style={{ cursor: "pointer" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <div style={{ width: 8, height: 8, borderRadius: 3, background: t.required ? "var(--orange-500)" : "var(--brand-500)", marginTop: 5, flex: "none" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.4 }}>{t.title}</div>
                        <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginTop: 3 }}>截止 {t.due} · {t.assignedBy}</div>
                      </div>
                    </div>
                    <div className="progress" style={{ marginTop: 8, marginLeft: 16 }}><i style={{ width: t.progress + "%" }} /></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 700 }}>本月积分榜</h3>
              <Icon name="trophy" style={{ width: 17, height: 17, color: "var(--gold-400)", marginLeft: 7 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {LEADERBOARD.map(u => (
                <div key={u.rank} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 8px",
                  borderRadius: 9, background: u.me ? "var(--brand-50)" : "transparent" }}>
                  <span style={{ width: 22, textAlign: "center", fontWeight: 700, fontSize: 13,
                    color: u.rank <= 3 ? "var(--gold-500)" : "var(--ink-400)" }}>{u.rank}</span>
                  <Avatar name={u.name} size={28} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{u.name}{u.me && <span style={{ color: "var(--brand-600)", fontSize: 11.5 }}> · 我</span>}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-500)" }}>{u.dept}</div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-700)" }}>{u.pts.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 700 }}>我的勋章</h3>
              <button className="more" style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--brand-600)", fontWeight: 600 }}
                onClick={() => setRoute("me")}>查看</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {BADGES.slice(0, 6).map(b => (
                <div key={b.id} style={{ textAlign: "center", opacity: b.got ? 1 : 0.4 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, margin: "0 auto 6px", display: "grid", placeItems: "center",
                    background: b.got ? "var(--gold-50)" : "var(--bg-2)" }}>
                    <Icon name={b.icon} style={{ width: 24, height: 24, color: b.got ? "var(--gold-500)" : "var(--ink-400)" }} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.2 }}>{b.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { HomePage };
