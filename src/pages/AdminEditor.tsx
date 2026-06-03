import React, { useState, Fragment } from 'react';
import { Icon, Avatar, Cover, CourseCard } from '../components';
import { CATEGORIES, COVER_COLORS } from '../data';
import { useQuery } from '../api/useQuery';
import * as api from '../api';
import { Toggle } from './Settings';

/* 神通大讲堂 — 管理端 · 课程编辑器（基本信息 / 章节管理 / 题库） */

/* 复用控件 */
function AField({ label, hint, children, full }: { label: string; hint?: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label style={{ display: "block", gridColumn: full ? "1 / -1" : "auto" }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-700)", marginBottom: 7 }}>
        {label}{hint && <span style={{ fontWeight: 400, color: "var(--ink-400)" }}> · {hint}</span>}
      </div>
      {children}
    </label>
  );
}
function AInput(props) { return <input {...props} className="set-input" />; }
function ATextarea(props) { return <textarea {...props} className="set-input" style={{ height: "auto", padding: "12px 14px", lineHeight: 1.6, resize: "vertical", ...(props.style || {}) }} />; }
export function ASelect({ value, onChange, options }: { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: Array<{ value: string; label: string } | string> }) {
  return (
    <div style={{ position: "relative" }}>
      <select value={value} onChange={onChange} className="set-input" style={{ appearance: "none", paddingRight: 38, cursor: "pointer" }}>
        {options.map((o) => {
          const v = typeof o === 'string' ? o : o.value;
          const l = typeof o === 'string' ? o : o.label;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
      <Icon name="chevronD" style={{ width: 17, height: 17, position: "absolute", right: 13, top: 14, color: "var(--ink-400)", pointerEvents: "none" }} />
    </div>
  );
}

const TYPE_OPTS = [{ value: "video", label: "视频" }, { value: "doc", label: "图文文档" }, { value: "quiz", label: "测验" }];

function CourseEditor({ course, onBack, onToast }) {
  const _qs = useQuery(['exam-q'], () => api.listExamQuestions('e1'));
  const EXAM_QUESTIONS = _qs.data || [];
  const isNew = !course;
  const [tab, setTab] = useState("basic");
  const [title, setTitle] = useState(course?.title || "");
  const [cat, setCat] = useState(course?.cat || "onboard");
  const [instructor, setInstructor] = useState(course?.instructor || "");
  const [desc, setDesc] = useState(course?.desc || "");
  const [required, setRequired] = useState(course?.required || false);
  const [chapters, setChapters] = useState(() =>
    (course?.chapters || []).map((c, i) => ({ id: "ch" + i, t: c.t, type: c.type, d: c.d })));
  const [questions, setQuestions] = useState(() =>
    EXAM_QUESTIONS.slice(0, 3).map(q => ({ id: q.id, type: q.type, q: q.q, options: [...q.options], answer: q.answer })));

  /* 章节操作 */
  const addChapter = () => setChapters([...chapters, { id: "ch" + Date.now(), t: "新章节", type: "video", d: "00:00" }]);
  const delChapter = (id) => setChapters(chapters.filter(c => c.id !== id));
  const editChapter = (id, key, val) => setChapters(chapters.map(c => c.id === id ? { ...c, [key]: val } : c));
  const moveChapter = (i, dir) => {
    const j = i + dir; if (j < 0 || j >= chapters.length) return;
    const next = [...chapters]; [next[i], next[j]] = [next[j], next[i]]; setChapters(next);
  };

  /* 题库操作 */
  const addQuestion = () => setQuestions([...questions, { id: "q" + Date.now(), type: "single", q: "新题目", options: ["选项 A", "选项 B"], answer: 0 }]);
  const delQuestion = (id) => setQuestions(questions.filter(q => q.id !== id));
  const editQ = (id, patch) => setQuestions(questions.map(q => q.id === id ? { ...q, ...patch } : q));

  const cover = COVER_COLORS[cat];
  const catName = CATEGORIES.find(c => c.id === cat)?.name;

  return (
    <div className="content fade-up" style={{ maxWidth: 1080 }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <button onClick={onBack} className="icon-btn" style={{ border: "1px solid var(--line)" }}><Icon name="chevron" style={{ transform: "rotate(180deg)" }} /></button>
        <div style={{ flex: 1 }}>
          <div className="page-title" style={{ fontSize: 21 }}>{isNew ? "新建课程" : "编辑课程"}</div>
          <div className="page-desc" style={{ marginTop: 3 }}>{isNew ? "填写课程信息、添加章节与测验题目" : title}</div>
        </div>
        <button className="btn btn-ghost" onClick={() => onToast("已存为草稿")}>存为草稿</button>
        <button className="btn btn-primary" onClick={() => onToast(isNew ? "课程已创建并发布" : "修改已保存", "success")}>
          <Icon name="check" style={{ width: 16, height: 16 }} /> {isNew ? "发布课程" : "保存修改"}
        </button>
      </div>

      {/* tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
        {[["basic", "基本信息", "edit"], ["chapters", `章节管理 (${chapters.length})`, "learn"], ["quiz", `题库 (${questions.length})`, "exam"]].map(([k, l, ic]) => (
          <button key={k} onClick={() => setTab(k)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 10, fontSize: 14, fontWeight: 600,
              background: tab === k ? "var(--brand-600)" : "#fff", color: tab === k ? "#fff" : "var(--ink-600)",
              border: "1px solid " + (tab === k ? "var(--brand-600)" : "var(--line)") }}>
            <Icon name={ic} style={{ width: 16, height: 16 }} /> {l}
          </button>
        ))}
      </div>

      {tab === "basic" && (
        <div className="card" style={{ padding: 26 }}>
          {/* cover preview */}
          <div style={{ display: "flex", gap: 20, marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid var(--line)" }}>
            <div style={{ width: 200, flex: "none" }}>
              <div className="cover" style={{ background: cover, aspectRatio: "16/10" }}>
                <Icon name={CATEGORIES.find(c => c.id === cat)?.icon || "play"} className="cover-ic" />
                <span className="cover-cat">{catName}</span>
              </div>
              <button className="btn btn-outline btn-sm" style={{ width: "100%", marginTop: 10 }}>
                <Icon name="download" style={{ width: 15, height: 15, transform: "rotate(180deg)" }} /> 上传封面图
              </button>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "var(--ink-500)", lineHeight: 1.7 }}>
                封面默认使用所选分类的主题色与图标。也可上传自定义封面图（建议 800×500）。
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <AField label="课程标题" full>
              <AInput value={title} onChange={e => setTitle(e.target.value)} placeholder="如：新员工入职第一课" />
            </AField>
            <AField label="所属分类">
              <ASelect value={cat} onChange={e => setCat(e.target.value)} options={CATEGORIES.filter(c => c.id !== "all").map(c => ({ value: c.id, label: c.name }))} />
            </AField>
            <AField label="授课讲师">
              <AInput value={instructor} onChange={e => setInstructor(e.target.value)} placeholder="如：人力资源部 · 王敏" />
            </AField>
            <AField label="课程简介" full>
              <ATextarea rows="3" value={desc} onChange={e => setDesc(e.target.value)} placeholder="简要描述课程内容与学习目标…" />
            </AField>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20, padding: "14px 16px", background: "var(--bg)", borderRadius: 12 }}>
            <Toggle on={required} onChange={setRequired} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>设为必修课程</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-500)", marginTop: 2 }}>必修课程将标记「必修」徽章，并可强制指派给指定人员</div>
            </div>
          </div>
        </div>
      )}

      {tab === "chapters" && (
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>章节列表</h3>
              <div style={{ fontSize: 12.5, color: "var(--ink-500)", marginTop: 3 }}>拖动排序，或用箭头调整顺序；学员将按此顺序解锁学习</div>
            </div>
            <button className="btn btn-primary btn-sm" style={{ marginLeft: "auto" }} onClick={addChapter}>
              <Icon name="plus" style={{ width: 16, height: 16 }} /> 添加章节
            </button>
          </div>

          {chapters.length === 0 ? (
            <div style={{ padding: "44px 0", textAlign: "center", color: "var(--ink-500)" }}>
              <Icon name="learn" style={{ width: 40, height: 40, color: "var(--ink-300)", margin: "0 auto 12px" }} />
              <div style={{ fontSize: 14 }}>还没有章节，点击「添加章节」开始</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {chapters.map((c, i) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", border: "1px solid var(--line)", borderRadius: 12, background: "#fff" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <button className="ed-move" onClick={() => moveChapter(i, -1)} disabled={i === 0}><Icon name="chevronD" style={{ transform: "rotate(180deg)", width: 15, height: 15 }} /></button>
                    <button className="ed-move" onClick={() => moveChapter(i, 1)} disabled={i === chapters.length - 1}><Icon name="chevronD" style={{ width: 15, height: 15 }} /></button>
                  </div>
                  <span style={{ width: 24, height: 24, borderRadius: 7, flex: "none", display: "grid", placeItems: "center", background: "var(--brand-50)", color: "var(--brand-600)", fontSize: 12.5, fontWeight: 700 }}>{i + 1}</span>
                  <input value={c.t} onChange={e => editChapter(c.id, "t", e.target.value)} className="ed-inline" style={{ flex: 1 }} placeholder="章节标题" />
                  <div style={{ width: 130, flex: "none" }}>
                    <ASelect value={c.type} onChange={e => editChapter(c.id, "type", e.target.value)} options={TYPE_OPTS} />
                  </div>
                  <input value={c.d} onChange={e => editChapter(c.id, "d", e.target.value)} className="ed-inline" style={{ width: 80, flex: "none", textAlign: "center" }} placeholder="时长" />
                  <button className="icon-btn" style={{ width: 34, height: 34, color: "var(--red-500)" }} onClick={() => delChapter(c.id)}><Icon name="plus" style={{ transform: "rotate(45deg)", width: 18, height: 18 }} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "quiz" && (
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>结业测验题库</h3>
              <div style={{ fontSize: 12.5, color: "var(--ink-500)", marginTop: 3 }}>设置题目与正确答案，学员完成章节后作答</div>
            </div>
            <button className="btn btn-primary btn-sm" style={{ marginLeft: "auto" }} onClick={addQuestion}>
              <Icon name="plus" style={{ width: 16, height: 16 }} /> 添加题目
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {questions.map((q, qi) => (
              <div key={q.id} style={{ border: "1px solid var(--line)", borderRadius: 14, padding: 18, background: "var(--bg)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-700)" }}>第 {qi + 1} 题</span>
                  <div style={{ width: 110 }}>
                    <ASelect value={q.type} onChange={e => editQ(q.id, { type: e.target.value, answer: e.target.value === "multi" ? [] : 0 })}
                      options={[{ value: "single", label: "单选题" }, { value: "multi", label: "多选题" }]} />
                  </div>
                  <button className="icon-btn" style={{ width: 32, height: 32, color: "var(--red-500)", marginLeft: "auto" }} onClick={() => delQuestion(q.id)}><Icon name="plus" style={{ transform: "rotate(45deg)", width: 18, height: 18 }} /></button>
                </div>
                <input value={q.q} onChange={e => editQ(q.id, { q: e.target.value })} className="set-input" style={{ marginBottom: 12, fontWeight: 600 }} placeholder="输入题干…" />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {q.options.map((o, oi) => {
                    const isAns = q.type === "multi" ? ((q.answer as number[]) || []).includes(oi) : q.answer === oi;
                    const toggleAns = () => {
                      if (q.type === "multi") {
                        const a = (q.answer as number[]) || []; editQ(q.id, { answer: a.includes(oi) ? a.filter((x: number) => x !== oi) : [...a, oi] });
                      } else editQ(q.id, { answer: oi });
                    };
                    return (
                      <div key={oi} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <button onClick={toggleAns} title="设为正确答案"
                          style={{ width: 24, height: 24, flex: "none", borderRadius: q.type === "multi" ? 6 : "50%", display: "grid", placeItems: "center",
                            border: "1.5px solid " + (isAns ? "var(--green-500)" : "var(--ink-300)"), background: isAns ? "var(--green-500)" : "#fff", color: "#fff" }}>
                          {isAns && <Icon name="check" style={{ width: 14, height: 14 }} />}
                        </button>
                        <input value={o} onChange={e => editQ(q.id, { options: q.options.map((x, k) => k === oi ? e.target.value : x) })}
                          className="set-input" style={{ flex: 1, background: "#fff" }} placeholder={"选项 " + String.fromCharCode(65 + oi)} />
                        <button className="icon-btn" style={{ width: 32, height: 32, color: "var(--ink-400)" }}
                          onClick={() => editQ(q.id, { options: q.options.filter((_, k) => k !== oi) })}><Icon name="plus" style={{ transform: "rotate(45deg)", width: 16, height: 16 }} /></button>
                      </div>
                    );
                  })}
                </div>
                <button className="btn btn-ghost btn-sm" style={{ marginTop: 10 }}
                  onClick={() => editQ(q.id, { options: [...q.options, "新选项"] })}>
                  <Icon name="plus" style={{ width: 15, height: 15 }} /> 添加选项
                </button>
                <div style={{ fontSize: 12, color: "var(--ink-400)", marginTop: 10 }}>点选项前的圆圈/方框设为正确答案 · 绿色为正确项</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { CourseEditor };
