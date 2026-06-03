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

/* 神通大讲堂 — 课程学习页（播放器 + 章节 + 详情 + 激励闭环） */

function CoursePage({ course, onOpen, setRoute }) {
  // 本地章节完成态（驱动进度实时变化 + 顺序解锁）
  const [chapters, setChapters] = useState(() => course.chapters.map(c => ({ ...c })));
  const firstUndone = Math.max(0, chapters.findIndex(c => !c.done));
  const [active, setActive] = useState(firstUndone);
  const [tab, setTab] = useState("catalog");
  const [bookmarked, setBookmarked] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const ch = chapters[active];
  const doneCount = chapters.filter(c => c.done).length;
  const total = chapters.length;
  const progress = Math.round(doneCount / total * 100);
  const allDone = doneCount === total;
  const related = COURSES.filter(c => c.cat === course.cat && c.id !== course.id).slice(0, 3);

  // 顺序解锁：第 0 节恒解锁；其后某节解锁需前一节已完成
  const isUnlocked = (i) => i === 0 || chapters[i - 1].done || chapters[i].done;

  const markDone = (i) => {
    if (chapters[i].done) { goNext(i); return; }
    const next = chapters.map((c, idx) => idx === i ? { ...c, done: true } : c);
    setChapters(next);
    const nowAll = next.every(c => c.done);
    if (nowAll) { setTimeout(() => setCelebrate(true), 350); }
    else goNext(i);
  };
  const goNext = (i) => { if (i < total - 1) setActive(i + 1); };

  const openChapter = (i) => { if (isUnlocked(i)) setActive(i); };

  return (
    <div className="content fade-up" style={{ maxWidth: 1320 }}>
      <div className="l-main-rail" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
        {/* Left: player + info */}
        <div>
          {/* Stage */}
          <div style={{ borderRadius: 14, overflow: "hidden", background: "#0B1A36", boxShadow: "var(--sh-lg)" }}>
            {ch.type === "doc" ? (
              <div style={{ aspectRatio: "16/9", display: "grid", placeItems: "center",
                background: "linear-gradient(135deg,#16233f,#0B1A36)", color: "#fff", padding: 30, textAlign: "center" }}>
                <div>
                  <Icon name="doc" style={{ width: 52, height: 52, opacity: .9, margin: "0 auto" }} />
                  <div style={{ fontSize: 16, fontWeight: 600, marginTop: 14 }}>{ch.t}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginTop: 6 }}>图文文档 · 阅读后点击下方「学完本节」</div>
                </div>
              </div>
            ) : ch.type === "quiz" ? (
              <div style={{ aspectRatio: "16/9", display: "grid", placeItems: "center",
                background: "linear-gradient(135deg,#1b3a6e,#0B1A36)", color: "#fff", padding: 30, textAlign: "center" }}>
                <div>
                  <Icon name="exam" style={{ width: 52, height: 52, opacity: .9, margin: "0 auto" }} />
                  <div style={{ fontSize: 16, fontWeight: 600, marginTop: 14 }}>{ch.t}</div>
                  <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setRoute("exam")}>前往考试中心作答</button>
                </div>
              </div>
            ) : (
              <div style={{ aspectRatio: "16/9", position: "relative", display: "grid", placeItems: "center",
                background: COVER_COLORS[course.cat] }}>
                <button style={{ width: 74, height: 74, borderRadius: "50%", background: "rgba(255,255,255,.92)",
                  display: "grid", placeItems: "center", boxShadow: "0 10px 30px rgba(0,0,0,.3)" }}>
                  <Icon name="play" style={{ width: 74, height: 74 }} />
                </button>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "30px 18px 14px",
                  background: "linear-gradient(transparent,rgba(11,26,54,.7))", color: "#fff" }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>第 {active + 1} 节 · {ch.t}</div>
                  <div style={{ height: 4, borderRadius: 3, background: "rgba(255,255,255,.25)", marginTop: 9, overflow: "hidden" }}>
                    <div style={{ width: ch.done ? "100%" : "32%", height: "100%", background: "#fff" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Player action bar — 学完本节 / 下一节 */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
            <div style={{ flex: 1, fontSize: 13, color: "var(--ink-500)" }}>
              {ch.done
                ? <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--green-500)", fontWeight: 600 }}><Icon name="check" style={{ width: 16, height: 16 }} />本节已完成</span>
                : <>正在学习第 {active + 1} 节 / 共 {total} 节</>}
            </div>
            {active > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={() => openChapter(active - 1)}>上一节</button>
            )}
            {!ch.done ? (
              <button className="btn btn-primary btn-sm" onClick={() => markDone(active)}>
                <Icon name="check" style={{ width: 16, height: 16 }} /> 学完本节{active < total - 1 ? "，下一节" : ""}
              </button>
            ) : active < total - 1 ? (
              <button className="btn btn-primary btn-sm" onClick={() => openChapter(active + 1)}>
                下一节 <Icon name="arrow" style={{ width: 16, height: 16 }} />
              </button>
            ) : (
              <button className="btn btn-outline btn-sm" onClick={() => setCelebrate(true)}>
                <Icon name="trophy" style={{ width: 16, height: 16 }} /> 查看证书
              </button>
            )}
          </div>

          {/* Title block */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, margin: "20px 0 6px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                <span className="tag">{CATEGORIES.find(c => c.id === course.cat)?.name}</span>
                {course.required && <span className="tag orange">必修</span>}
                <span className="tag gray" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Icon name="star" style={{ width: 13, height: 13, color: "var(--gold-400)" }} />{course.rating}
                </span>
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 10px", letterSpacing: "-.2px" }}>{course.title}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "var(--ink-500)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Avatar name={course.instructor.slice(-1)} size={24} />讲师 {course.instructor}</span>
                <span>·</span><span>{course.lessons} 节</span>
                <span>·</span><span>{course.learners.toLocaleString()} 人在学</span>
              </div>
            </div>
            <button className="icon-btn" onClick={() => setBookmarked(!bookmarked)}
              style={{ border: "1px solid var(--line)", color: bookmarked ? "var(--gold-500)" : "var(--ink-500)" }}>
              <Icon name={bookmarked ? "bookmarkFill" : "bookmark"} />
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 24, borderBottom: "1px solid var(--line)", margin: "18px 0 0" }}>
            {[["catalog", "目录"], ["intro", "课程介绍"], ["notes", "讨论 (12)"]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)}
                style={{ padding: "0 0 12px", fontSize: 14.5, fontWeight: 600, position: "relative",
                  color: tab === k ? "var(--brand-600)" : "var(--ink-500)" }}>
                {l}
                {tab === k && <span style={{ position: "absolute", left: 0, right: 0, bottom: -1, height: 2.5, background: "var(--brand-600)", borderRadius: 2 }} />}
              </button>
            ))}
          </div>

          <div style={{ paddingTop: 18 }}>
            {tab === "catalog" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {chapters.map((c, i) => {
                  const locked = !isUnlocked(i);
                  return (
                  <button key={i} onClick={() => openChapter(i)} disabled={locked}
                    style={{ display: "flex", alignItems: "center", gap: 13, padding: "13px 15px", borderRadius: 11, textAlign: "left", width: "100%",
                      cursor: locked ? "not-allowed" : "pointer", opacity: locked ? .6 : 1,
                      background: i === active ? "var(--brand-50)" : "#fff",
                      border: "1px solid " + (i === active ? "var(--brand-200)" : "var(--line)") }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, flex: "none", display: "grid", placeItems: "center",
                      background: c.done ? "var(--green-50)" : locked ? "var(--bg-2)" : i === active ? "var(--brand-600)" : "var(--bg-2)",
                      color: c.done ? "var(--green-500)" : locked ? "var(--ink-400)" : i === active ? "#fff" : "var(--ink-500)" }}>
                      {c.done ? <Icon name="check" style={{ width: 16, height: 16 }} />
                        : locked ? <Icon name="lock" style={{ width: 14, height: 14 }} />
                        : <Icon name={c.type === "doc" ? "doc" : c.type === "quiz" ? "exam" : "play"} style={{ width: 15, height: 15 }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-900)" }}>{i + 1}. {c.t}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 2 }}>
                        {c.type === "doc" ? "图文" : c.type === "quiz" ? "测验" : "视频"} · {c.d}
                      </div>
                    </div>
                    {locked ? <span className="tag gray" style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon name="lock" style={{ width: 11, height: 11 }} />未解锁</span>
                      : i === active ? <span className="tag">学习中</span>
                      : c.done ? <span className="tag green">已完成</span> : null}
                  </button>
                  );
                })}
              </div>
            )}
            {tab === "intro" && (
              <div style={{ fontSize: 14.5, lineHeight: 1.9, color: "var(--ink-700)" }}>
                <p style={{ marginTop: 0 }}>{course.desc}</p>
                <h4 style={{ fontSize: 15, color: "var(--ink-900)", marginBottom: 8 }}>你将学到</h4>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                  {course.chapters.filter(c => c.type !== "quiz").slice(0, 4).map((c, i) => <li key={i} style={{ marginBottom: 5 }}>{c.t}</li>)}
                </ul>
                <h4 style={{ fontSize: 15, color: "var(--ink-900)", marginBottom: 8, marginTop: 20 }}>适合人群</h4>
                <p style={{ margin: 0 }}>全体员工 / 相关业务线同事，建议结合实际工作场景边学边练。</p>
              </div>
            )}
            {tab === "notes" && (
              <div style={{ fontSize: 14, color: "var(--ink-500)", padding: "20px 0", textAlign: "center" }}>
                课程讨论区 · 学完本节后可在此交流心得
              </div>
            )}
          </div>
        </div>

        {/* Right rail */}
        <div className="l-rail" style={{ display: "flex", flexDirection: "column", gap: 18, position: "sticky", top: 88 }}>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>学习进度</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: allDone ? "var(--green-500)" : "var(--brand-600)" }}>{progress}%</span>
            </div>
            <div className={"progress" + (allDone ? " green" : "")} style={{ height: 8, transition: "none" }}>
              <i style={{ width: progress + "%", transition: "width .4s ease" }} />
            </div>
            <div style={{ fontSize: 12.5, color: "var(--ink-500)", margin: "10px 0 16px" }}>
              已完成 {doneCount} / {total} 节{allDone && " · 全部完成 🎉"}
            </div>
            {!allDone ? (
              <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => { const i = chapters.findIndex(c => !c.done); openChapter(i < 0 ? 0 : i); }}>
                <Icon name="play" style={{ width: 17, height: 17 }} />
                {doneCount === 0 ? "开始学习" : "继续学习"}
              </button>
            ) : (
              <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => setCelebrate(true)}>
                <Icon name="trophy" style={{ width: 17, height: 17 }} /> 领取结业证书
              </button>
            )}
            {/* 闭环说明 */}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line-2)" }}>
              <LoopStep done={allDone} active={!allDone} label="学完全部章节" sub={`${doneCount}/${total} 节`} />
              <LoopStep done={false} active={allDone} label="通过结业测验" sub="及格 70 分" />
              <LoopStep done={false} active={false} label="获得证书 + 80 积分" sub="自动发放" last />
            </div>
          </div>

          {related.length > 0 && (
            <div className="card" style={{ padding: 18 }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700 }}>相关课程</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {related.map(c => (
                  <div key={c.id} onClick={() => onOpen(c)} style={{ display: "flex", gap: 11, cursor: "pointer" }}>
                    <div style={{ width: 74, flex: "none" }}><Cover course={c} showPlay={false} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.title}</div>
                      <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginTop: 4 }}>{c.lessons} 节 · {c.dur}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {celebrate && <CourseComplete course={course} onClose={() => setCelebrate(false)} onExam={() => { setCelebrate(false); setRoute("exam"); }} />}
    </div>
  );
}

function LoopStep({ done, active, label, sub, last }) {
  return (
    <div style={{ display: "flex", gap: 11, position: "relative", paddingBottom: last ? 0 : 14 }}>
      {!last && <span style={{ position: "absolute", left: 10, top: 22, bottom: 0, width: 2, background: "var(--line)" }} />}
      <div style={{ width: 21, height: 21, borderRadius: "50%", flex: "none", display: "grid", placeItems: "center", zIndex: 1,
        background: done ? "var(--green-500)" : active ? "var(--brand-600)" : "var(--bg-2)",
        color: done || active ? "#fff" : "var(--ink-400)", border: active ? "none" : done ? "none" : "1px solid var(--line)" }}>
        {done ? <Icon name="check" style={{ width: 13, height: 13 }} /> : <span style={{ width: 6, height: 6, borderRadius: "50%", background: active ? "#fff" : "var(--ink-300)" }} />}
      </div>
      <div style={{ marginTop: -1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: done || active ? "var(--ink-900)" : "var(--ink-500)" }}>{label}</div>
        <div style={{ fontSize: 11.5, color: "var(--ink-400)", marginTop: 1 }}>{sub}</div>
      </div>
    </div>
  );
}

function CourseComplete({ course, onClose, onExam }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="celebrate-top">
          <div className="celebrate-burst" />
          <div style={{ position: "relative", width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,.16)", display: "grid", placeItems: "center", margin: "0 auto" }}>
            <Icon name="trophy" style={{ width: 42, height: 42, color: "#fff" }} />
          </div>
          <div style={{ position: "relative", fontSize: 21, fontWeight: 700, color: "#fff", marginTop: 16 }}>恭喜完成课程！</div>
          <div style={{ position: "relative", fontSize: 13.5, color: "rgba(255,255,255,.8)", marginTop: 6 }}>{course.title}</div>
        </div>
        <div style={{ padding: "22px 26px 26px" }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, background: "var(--gold-50)", borderRadius: 12, padding: "16px 14px", textAlign: "center" }}>
              <Icon name="trophy" style={{ width: 24, height: 24, color: "var(--gold-500)", margin: "0 auto 8px" }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--gold-500)" }}>结业证书</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginTop: 3 }}>已发放至「我的证书」</div>
            </div>
            <div style={{ flex: 1, background: "var(--brand-50)", borderRadius: 12, padding: "16px 14px", textAlign: "center" }}>
              <Icon name="coin" style={{ width: 24, height: 24, color: "var(--brand-600)", margin: "0 auto 8px" }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--brand-600)" }}>+80 积分</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginTop: 3 }}>已计入学习账户</div>
            </div>
          </div>
          <div style={{ background: "var(--bg)", borderRadius: 12, padding: "14px 16px", margin: "16px 0", display: "flex", gap: 11, alignItems: "center" }}>
            <Icon name="exam" style={{ width: 22, height: 22, color: "var(--ink-600)", flex: "none" }} />
            <div style={{ flex: 1, fontSize: 13, color: "var(--ink-700)", lineHeight: 1.5 }}>
              完成<b> 结业测验 </b>即可获得<b> 认证证书</b>，检验你的学习成果。
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>稍后再说</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={onExam}>
              <Icon name="exam" style={{ width: 16, height: 16 }} /> 去考试
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CoursePage };
