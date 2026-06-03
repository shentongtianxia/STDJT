// @ts-nocheck
import React, { useState, Fragment } from 'react';
import {
  CATEGORIES, COVER_COLORS, COURSES, KB_TREE, DOC_CONTENT, TASKS, EXAMS,
  EXAM_QUESTIONS, POSTS, USER, BADGES, CERTS, LEADERBOARD, ADMIN_STATS, NOTIFICATIONS,
} from '../data';
import {
  Icon, Avatar, Cover, CourseCard, Sidebar, TopBar, BottomNav,
  getNav, BOTTOM_NAV,
} from '../components';
import { DocReader, resolveDoc, KbPage } from './Kb';

/* 神通大讲堂 — 全局搜索结果页 */

function SearchPage({ query, onOpen, openDoc, setRoute }) {
  const [scope, setScope] = useState("all");  // all | course | doc
  const q = (query || "").trim();

  const allDocs = KB_TREE.flatMap(g => g.docs.map(d => ({ ...d, groupName: g.name })));
  const courseHits = q ? COURSES.filter(c =>
    c.title.includes(q) || c.instructor.includes(q) || (CATEGORIES.find(x => x.id === c.cat)?.name || "").includes(q)) : [];
  const docHits = q ? allDocs.filter(d => d.title.includes(q) || d.author.includes(q) || d.tag.includes(q)) : [];
  const total = courseHits.length + docHits.length;

  const hl = (text) => {
    if (!q) return text;
    const i = text.indexOf(q);
    if (i < 0) return text;
    return (<>{text.slice(0, i)}<mark className="hl">{q}</mark>{text.slice(i + q.length)}</>);
  };

  const showCourses = scope !== "doc" && courseHits.length > 0;
  const showDocs = scope !== "course" && docHits.length > 0;

  return (
    <div className="content fade-up" style={{ maxWidth: 1080 }}>
      <div className="page-head">
        <div className="page-title">搜索结果</div>
        <div className="page-desc">
          {q ? <>找到 <b style={{ color: "var(--ink-900)" }}>{total}</b> 条与「<b style={{ color: "var(--brand-600)" }}>{q}</b>」相关的内容</> : "请输入关键词搜索课程或文档"}
        </div>
      </div>

      {q && (
        <div style={{ display: "flex", gap: 4, background: "var(--bg-2)", padding: 4, borderRadius: 9, width: "fit-content", marginBottom: 22 }}>
          {[["all", `全部 ${total}`], ["course", `课程 ${courseHits.length}`], ["doc", `文档 ${docHits.length}`]].map(([k, l]) => (
            <button key={k} onClick={() => setScope(k)}
              style={{ padding: "7px 16px", borderRadius: 7, fontSize: 13.5, fontWeight: 600,
                background: scope === k ? "#fff" : "transparent", color: scope === k ? "var(--brand-600)" : "var(--ink-500)",
                boxShadow: scope === k ? "var(--sh-sm)" : "none" }}>{l}</button>
          ))}
        </div>
      )}

      {q && total === 0 && (
        <div className="card" style={{ padding: "60px 30px", textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, margin: "0 auto 16px", display: "grid", placeItems: "center", background: "var(--bg-2)" }}>
            <Icon name="search" style={{ width: 28, height: 28, color: "var(--ink-400)" }} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>没有找到与「{q}」相关的内容</div>
          <div className="muted" style={{ fontSize: 13.5, marginTop: 6 }}>换个关键词试试，或浏览<button className="auth-link" style={{ fontSize: 13.5 }} onClick={() => setRoute("learn")}>学习中心</button></div>
        </div>
      )}

      {showCourses && (
        <>
          <div className="section-head" style={{ marginTop: 0 }}><h2>课程 · {courseHits.length}</h2></div>
          <div className="grid-courses" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))" }}>
            {courseHits.map(c => (
              <div key={c.id} className="card course-card" onClick={() => onOpen(c)}>
                <Cover course={c} />
                <div className="cc-body">
                  <div className="cc-title">{hl(c.title)}</div>
                  <div className="cc-meta">
                    <span>{c.lessons} 节</span><i className="dotsep" /><span>{c.instructor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showDocs && (
        <>
          <div className="section-head"><h2>知识库文档 · {docHits.length}</h2></div>
          <div className="card" style={{ overflow: "hidden" }}>
            {docHits.map((d, i) => (
              <button key={d.id} onClick={() => openDoc(d)}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 18px", width: "100%", textAlign: "left",
                  borderBottom: i < docHits.length - 1 ? "1px solid var(--line-2)" : "none", transition: "background .12s" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ width: 38, height: 38, borderRadius: 10, flex: "none", display: "grid", placeItems: "center", background: "var(--brand-50)" }}>
                  <Icon name="doc" style={{ width: 19, height: 19, color: "var(--brand-600)" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600 }}>{hl(d.title)}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 3 }}>{d.groupName} · {d.author} · {d.updated}</div>
                </div>
                <span style={{ fontSize: 13, color: "var(--ink-500)", display: "flex", alignItems: "center", gap: 5 }}>
                  <Icon name="eye" style={{ width: 14, height: 14 }} />{d.views.toLocaleString()}
                </span>
                <Icon name="chevron" style={{ width: 16, height: 16, color: "var(--ink-300)" }} />
              </button>
            ))}
          </div>
        </>
      )}

      {q && (
        <div style={{ marginTop: 26 }}>
          <div style={{ fontSize: 13, color: "var(--ink-500)", marginBottom: 10 }}>大家也在搜</div>
          <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
            {["新员工入职", "信息安全", "SPIN销售", "报销标准", "产品手册", "VPN配置"].map(t => (
              <button key={t} className="tag gray" style={{ fontSize: 13, padding: "6px 13px", cursor: "pointer" }}
                onClick={() => setRoute({ type: "search", q: t })}>{t}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { SearchPage };
