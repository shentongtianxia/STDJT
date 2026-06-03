import React, { useState, Fragment } from 'react';
import { Icon, Avatar, Cover, CourseCard } from '../components';
import { CATEGORIES, COVER_COLORS } from '../data';
import { useQuery } from '../api/useQuery';
import * as api from '../api';
import { ASelect, CourseEditor } from './AdminEditor';
import type { Course } from '../types';

/* 神通大讲堂 — 轻量管理端 */

/* 轻量 Toast */
interface ToastState { msg: string; kind: 'info' | 'success'; id: number }
type ToastFn = (msg: string, kind?: 'info' | 'success') => void;
function useToast(): [React.ReactNode, ToastFn] {
  const [toast, setToast] = useState<ToastState | null>(null);
  const show: ToastFn = (msg, kind) => {
    setToast({ msg, kind: kind || 'info', id: Date.now() });
    setTimeout(() => setToast((t) => (t && t.msg === msg ? null : t)), 2400);
  };
  const node = toast ? (
    <div className="toast" key={toast.id}>
      <span className="toast-ic" style={{ background: toast.kind === 'success' ? 'var(--green-500)' : 'var(--brand-600)' }}>
        <Icon name="check" style={{ width: 14, height: 14, color: '#fff' }} />
      </span>
      {toast.msg}
    </div>
  ) : null;
  return [node, show];
}

function AdminDash() {
  const ADMIN_STATS = useQuery(['admin_stats'], api.getAdminStats).data || { totalLearners: 0, activeRate: 0, coursesPublished: 0, avgHours: 0, completionRate: 0, examPassRate: 0, recentCourses: [], deptProgress: [] };
  const COURSES = useQuery(['courses'], api.listCourses).data || [];

  const s = ADMIN_STATS;
  const cards = [
    { v: s.totalLearners.toLocaleString(), l: "总学员数", sub: "+42 本月新增", ic: "users", c: "var(--brand-600)", bg: "var(--brand-50)" },
    { v: s.activeRate + "%", l: "本月活跃率", sub: "较上月 +5%", ic: "trend", c: "var(--green-500)", bg: "var(--green-50)" },
    { v: s.coursesPublished, l: "已发布课程", sub: "4 门待审", ic: "learn", c: "var(--gold-500)", bg: "var(--gold-50)" },
    { v: s.completionRate + "%", l: "平均完课率", sub: "目标 75%", ic: "check", c: "var(--brand-600)", bg: "var(--brand-50)" },
  ];
  return (
    <div className="content fade-up">
      <div className="page-head">
        <div className="page-title">数据看板</div>
        <div className="page-desc">神通大讲堂运营概览 · 数据截至 2026-05-29</div>
      </div>

      <div className="l-stats4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 22 }}>
        {cards.map((c, i) => (
          <div key={i} className="card" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: c.bg, display: "grid", placeItems: "center" }}>
                <Icon name={c.ic} style={{ width: 20, height: 20, color: c.c }} />
              </div>
            </div>
            <div style={{ fontSize: 27, fontWeight: 700, lineHeight: 1 }}>{c.v}</div>
            <div style={{ fontSize: 13, color: "var(--ink-600)", marginTop: 6, fontWeight: 500 }}>{c.l}</div>
            <div style={{ fontSize: 12, color: "var(--ink-400)", marginTop: 3 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="l-main-rail" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, alignItems: "start" }}>
        {/* recent courses */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)", fontSize: 15.5, fontWeight: 700 }}>课程数据</div>
          <div style={{ display: "flex", alignItems: "center", padding: "11px 20px", borderBottom: "1px solid var(--line)", fontSize: 12.5, color: "var(--ink-500)", fontWeight: 600 }}>
            <span style={{ flex: 1 }}>课程名称</span><span style={{ width: 90, textAlign: "center" }}>学员</span>
            <span style={{ width: 130, textAlign: "center" }}>完课率</span><span style={{ width: 70, textAlign: "right" }}>状态</span>
          </div>
          {s.recentCourses.map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderBottom: i < s.recentCourses.length - 1 ? "1px solid var(--line-2)" : "none" }}>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{c.title}</span>
              <span style={{ width: 90, textAlign: "center", fontSize: 13.5, color: "var(--ink-600)" }}>{c.learners.toLocaleString()}</span>
              <div style={{ width: 130, display: "flex", alignItems: "center", gap: 8, padding: "0 10px" }}>
                <div className="progress" style={{ flex: 1 }}><i style={{ width: c.completion + "%" }} /></div>
                <span style={{ fontSize: 12.5, color: "var(--ink-500)", width: 30 }}>{c.completion}%</span>
              </div>
              <span style={{ width: 70, textAlign: "right" }}>
                <span className={"tag " + (c.status === "已发布" ? "green" : "gray")}>{c.status}</span>
              </span>
            </div>
          ))}
        </div>

        {/* dept progress */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 16 }}>各部门完课率</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            {s.deptProgress.map((d, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span style={{ fontWeight: 500 }}>{d.dept}</span>
                  <span style={{ fontWeight: 700, color: d.rate >= 80 ? "var(--green-500)" : d.rate >= 65 ? "var(--brand-600)" : "var(--orange-500)" }}>{d.rate}%</span>
                </div>
                <div className={"progress" + (d.rate >= 80 ? " green" : d.rate < 65 ? " gold" : "")} style={{ height: 7 }}><i style={{ width: d.rate + "%" }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminCourses() {
  const COURSES = useQuery(['courses'], api.listCourses).data || [];
  const [view, setView] = useState<Course | 'new' | null>(null);  // null=list | course对象 | "new"
  const [toastNode, toast] = useToast();

  if (view) return (<>{toastNode}<CourseEditor course={view === "new" ? null : view} onBack={() => setView(null)} onToast={toast} /></>);

  return (
    <div className="content fade-up">
      {toastNode}
      <div className="page-head" style={{ display: "flex", alignItems: "flex-end" }}>
        <div><div className="page-title">课程管理</div><div className="page-desc">创建、编辑与发布培训课程</div></div>
        <button className="btn btn-primary" style={{ marginLeft: "auto" }} onClick={() => setView("new")}><Icon name="plus" style={{ width: 17, height: 17 }} /> 新建课程</button>
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid var(--line)", fontSize: 12.5, color: "var(--ink-500)", fontWeight: 600 }}>
          <span style={{ flex: 1 }}>课程</span><span style={{ width: 100 }}>分类</span><span style={{ width: 90, textAlign: "center" }}>学员</span>
          <span style={{ width: 80, textAlign: "center" }}>状态</span><span style={{ width: 90, textAlign: "right" }}>操作</span>
        </div>
        {COURSES.map((c, i) => (
          <div key={c.id} style={{ display: "flex", alignItems: "center", padding: "13px 20px", borderBottom: i < COURSES.length - 1 ? "1px solid var(--line-2)" : "none" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <div style={{ width: 56, height: 36, borderRadius: 7, flex: "none", background: COVER_COLORS[c.cat], display: "grid", placeItems: "center" }}>
                <Icon name={c.type === "doc" ? "doc" : "play"} style={{ width: 16, height: 16, color: "#fff" }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</div>
                <div style={{ fontSize: 12, color: "var(--ink-500)" }}>{c.instructor}</div>
              </div>
            </div>
            <span style={{ width: 100, fontSize: 13, color: "var(--ink-600)" }}>{CATEGORIES.find(x => x.id === c.cat)?.name}</span>
            <span style={{ width: 90, textAlign: "center", fontSize: 13.5, color: "var(--ink-600)" }}>{c.learners.toLocaleString()}</span>
            <span style={{ width: 80, textAlign: "center" }}><span className="tag green">已发布</span></span>
            <span style={{ width: 90, textAlign: "right", display: "flex", gap: 6, justifyContent: "flex-end" }}>
              <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => setView(c)}><Icon name="edit" style={{ width: 16, height: 16 }} /></button>
              <button className="icon-btn" style={{ width: 32, height: 32 }}><Icon name="chart" style={{ width: 16, height: 16 }} /></button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminTasks() {
  const COURSES = useQuery(['courses'], api.listCourses).data || [];
  const [toastNode, toast] = useToast();
  const [courseId, setCourseId] = useState<string>(COURSES[1]?.id || '');
  const [target, setTarget] = useState("sales");
  const [due, setDue] = useState("2026-06-15");
  const [required, setRequired] = useState(true);
  const [assignments, setAssignments] = useState([
    { c: "信息安全与数据合规红线", to: "全公司 (1286人)", done: 71, due: "2026-06-02" },
    { c: "核心产品全景解析（2026版）", to: "销售部 (68人)", done: 64, due: "2026-06-15" },
    { c: "新晋管理者的第一个90天", to: "管理岗 (42人)", done: 33, due: "2026-06-20" },
  ]);

  const TARGETS = [
    { value: "all", label: "全公司 (1286人)" },
    { value: "sales", label: "销售部 (68人)" },
    { value: "product", label: "产品部 (54人)" },
    { value: "rd", label: "研发部 (120人)" },
    { value: "manager", label: "管理岗 (42人)" },
  ];

  const [assigning, setAssigning] = useState(false);
  const assign = async () => {
    const c = COURSES.find((x: Course) => x.id === courseId);
    const to = TARGETS.find(t => t.value === target)?.label;
    if (!c) { toast('请选择课程'); return; }
    setAssigning(true);
    try {
      await api.assignTask({ courseId, target, due, required });
      setAssignments([{ c: c.title, to, done: 0, due }, ...assignments]);
      toast("已成功指派给「" + to + "」", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : '指派失败');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="content fade-up">
      {toastNode}
      <div className="page-head">
        <div className="page-title">任务指派</div>
        <div className="page-desc">向部门或个人下发学习任务，设置必修与截止日期</div>
      </div>
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 700 }}>新建指派</h3>
        <div className="l-form2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 720 }}>
          <Field label="选择课程">
            <ASelect value={courseId} onChange={e => setCourseId(e.target.value)} options={COURSES.map(c => ({ value: c.id, label: c.title }))} />
          </Field>
          <Field label="指派对象">
            <ASelect value={target} onChange={e => setTarget(e.target.value)} options={TARGETS} />
          </Field>
          <Field label="截止日期">
            <input type="date" value={due} onChange={e => setDue(e.target.value)} className="set-input" />
          </Field>
          <Field label="是否必修">
            <ASelect value={required ? "yes" : "no"} onChange={e => setRequired(e.target.value === "yes")} options={[{ value: "yes", label: "必修" }, { value: "no", label: "选修" }]} />
          </Field>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button className="btn btn-primary" disabled={assigning} onClick={assign}><Icon name="check" style={{ width: 16, height: 16 }} /> {assigning ? '指派中…' : '确认指派'}</button>
          <button className="btn btn-ghost" onClick={() => toast("已存为草稿")}>存为草稿</button>
        </div>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, margin: "28px 0 14px" }}>近期指派</h3>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {assignments.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", padding: "15px 20px", borderBottom: i < assignments.length - 1 ? "1px solid var(--line-2)" : "none", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{r.c}</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-500)", marginTop: 3 }}>指派给 {r.to} · 截止 {r.due}</div>
            </div>
            {r.done === 0
              ? <span className="tag" style={{ width: 180, justifyContent: "center" }}>刚刚指派 · 待学员开始</span>
              : <div style={{ width: 180, display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="progress" style={{ flex: 1 }}><i style={{ width: r.done + "%" }} /></div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--brand-600)", width: 60 }}>{r.done}% 完成</span>
                </div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPeople() {
  const people = [
    { n: "张文博", d: "销售部", courses: 14, hours: 52, rate: 92 },
    { n: "王雅琪", d: "产品部", courses: 12, hours: 47, rate: 88 },
    { n: "李慕白", d: "研发部", courses: 9, hours: 38, rate: 74 },
    { n: "林思齐", d: "市场部", courses: 9, hours: 38.5, rate: 71 },
    { n: "赵琳", d: "客户成功部", courses: 16, hours: 61, rate: 96 },
    { n: "陈思远", d: "销售部", courses: 11, hours: 41, rate: 80 },
  ];
  return (
    <div className="content fade-up">
      <div className="page-head"><div className="page-title">学员管理</div><div className="page-desc">查看员工学习情况与完成进度</div></div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid var(--line)", fontSize: 12.5, color: "var(--ink-500)", fontWeight: 600 }}>
          <span style={{ flex: 1 }}>员工</span><span style={{ width: 100, textAlign: "center" }}>完成课程</span>
          <span style={{ width: 100, textAlign: "center" }}>学习时长</span><span style={{ width: 160, textAlign: "center" }}>完课率</span>
        </div>
        {people.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", padding: "13px 20px", borderBottom: i < people.length - 1 ? "1px solid var(--line-2)" : "none" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 11 }}>
              <Avatar name={p.n} size={36} />
              <div><div style={{ fontSize: 14, fontWeight: 600 }}>{p.n}</div><div style={{ fontSize: 12, color: "var(--ink-500)" }}>{p.d}</div></div>
            </div>
            <span style={{ width: 100, textAlign: "center", fontSize: 13.5 }}>{p.courses}</span>
            <span style={{ width: 100, textAlign: "center", fontSize: 13.5 }}>{p.hours}h</span>
            <div style={{ width: 160, display: "flex", alignItems: "center", gap: 10, padding: "0 16px" }}>
              <div className={"progress" + (p.rate >= 85 ? " green" : "")} style={{ flex: 1 }}><i style={{ width: p.rate + "%" }} /></div>
              <span style={{ fontSize: 13, fontWeight: 600, width: 34 }}>{p.rate}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (<div><div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--ink-700)" }}>{label}</div>{children}</div>);
}
function Select({ v }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "11px 14px", borderRadius: 10, border: "1px solid var(--line)", background: "#fff", fontSize: 14, color: "var(--ink-900)" }}>
      <span>{v}</span><Icon name="chevronD" style={{ width: 17, height: 17, marginLeft: "auto", color: "var(--ink-400)" }} />
    </div>
  );
}

export { AdminDash, AdminCourses, AdminTasks, AdminPeople };
