// @ts-nocheck
import React, { useState, Fragment } from 'react';
import { Icon, Avatar, Cover, CourseCard } from '../components';
import { useQuery } from '../api/useQuery';
import * as api from '../api';

/* 神通大讲堂 — 考试中心（列表 + 答题 + 结果） */

function ExamPage() {
  const EXAMS = useQuery(['exams'], api.listExams).data || [];

  const [taking, setTaking] = useState(null);
  if (taking) return <ExamRunner exam={taking} onExit={() => setTaking(null)} />;

  return (
    <div className="content fade-up">
      <div className="page-head">
        <div className="page-title">考试中心</div>
        <div className="page-desc">完成认证考试，检验学习成果，通过即可获得证书与积分</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {EXAMS.map(e => {
          const passed = e.status === "passed";
          return (
            <div key={e.id} className="card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ width: 54, height: 54, borderRadius: 14, flex: "none", display: "grid", placeItems: "center",
                background: passed ? "var(--green-50)" : "var(--brand-50)" }}>
                <Icon name={passed ? "trophy" : "exam"} style={{ width: 27, height: 27, color: passed ? "var(--green-500)" : "var(--brand-600)" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 16.5, fontWeight: 700 }}>{e.title}</span>
                  <span className="tag gray">{e.related}</span>
                  {passed && <span className="tag green">已通过 · {e.score}分</span>}
                </div>
                <div style={{ display: "flex", gap: 18, fontSize: 13, color: "var(--ink-500)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon name="exam" style={{ width: 14, height: 14 }} />{e.questions} 题</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon name="clock" style={{ width: 14, height: 14 }} />{e.minutes} 分钟</span>
                  <span>及格 {e.pass} 分</span>
                  <span>· {e.attempts}</span>
                  {e.due !== "—" && <span>· 截止 {e.due}</span>}
                </div>
              </div>
              <button className={"btn " + (passed ? "btn-ghost" : "btn-primary")} style={{ flex: "none" }}
                onClick={() => setTaking(e)}>
                {passed ? "查看结果" : "开始考试"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExamRunner({ exam, onExit }) {
  const qs = EXAM_QUESTIONS;
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const q = qs[idx];
  const cur = answers[q.id];

  const select = (oi) => {
    if (submitted) return;
    if (q.type === "multi") {
      const arr = Array.isArray(cur) ? [...cur] : [];
      const at = arr.indexOf(oi);
      if (at >= 0) arr.splice(at, 1); else arr.push(oi);
      setAnswers({ ...answers, [q.id]: arr });
    } else {
      setAnswers({ ...answers, [q.id]: oi });
    }
  };

  const isCorrect = (qq) => {
    const a = answers[qq.id];
    if (qq.type === "multi") return Array.isArray(a) && a.length === qq.answer.length && qq.answer.every(x => a.includes(x));
    return a === qq.answer;
  };
  const score = Math.round(qs.filter(isCorrect).length / qs.length * 100);
  const answeredCount = qs.filter(qq => answers[qq.id] !== undefined && (qq.type !== "multi" || answers[qq.id].length)).length;

  if (submitted) {
    const passed = score >= exam.pass;
    return (
      <div className="content fade-up" style={{ maxWidth: 760 }}>
        <div className="card" style={{ padding: "44px 40px", textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 88, height: 88, borderRadius: "50%", margin: "0 auto 20px", display: "grid", placeItems: "center",
            background: passed ? "var(--green-50)" : "var(--orange-50)" }}>
            <Icon name={passed ? "trophy" : "exam"} style={{ width: 44, height: 44, color: passed ? "var(--green-500)" : "var(--orange-500)" }} />
          </div>
          <div style={{ fontSize: 15, color: "var(--ink-500)", marginBottom: 6 }}>{passed ? "恭喜你通过认证考试！" : "很遗憾，本次未通过"}</div>
          <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1, color: passed ? "var(--green-500)" : "var(--orange-500)" }}>{score}<span style={{ fontSize: 22, color: "var(--ink-400)" }}> 分</span></div>
          <div style={{ display: "flex", justifyContent: "center", gap: 28, marginTop: 24, fontSize: 13.5 }}>
            <div><div style={{ fontWeight: 700, fontSize: 18 }}>{qs.filter(isCorrect).length}/{qs.length}</div><div className="muted">答对题数</div></div>
            <div><div style={{ fontWeight: 700, fontSize: 18 }}>{exam.pass} 分</div><div className="muted">及格线</div></div>
            <div><div style={{ fontWeight: 700, fontSize: 18, color: passed ? "var(--green-500)" : "var(--red-500)" }}>{passed ? "通过" : "未通过"}</div><div className="muted">结果</div></div>
          </div>
          {passed && <div style={{ marginTop: 22, display: "flex", gap: 7, justifyContent: "center", alignItems: "center", color: "var(--gold-500)", fontWeight: 600, fontSize: 14 }}>
            <Icon name="coin" style={{ width: 17, height: 17 }} /> 获得 50 学习积分 + 认证证书
          </div>}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 26 }}>
            <button className="btn btn-ghost" onClick={onExit}>返回考试列表</button>
            {!passed && <button className="btn btn-primary" onClick={() => { setSubmitted(false); setIdx(0); setAnswers({}); }}>重新考试</button>}
          </div>
        </div>

        {/* review */}
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 14px" }}>答案解析</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {qs.map((qq, i) => {
            const ok = isCorrect(qq);
            return (
              <div key={qq.id} className="card" style={{ padding: 18, borderLeft: "3px solid " + (ok ? "var(--green-500)" : "var(--red-500)") }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <span className={"tag " + (ok ? "green" : "red")}>{ok ? "答对" : "答错"}</span>
                  <span style={{ fontSize: 14.5, fontWeight: 600 }}>{i + 1}. {qq.q}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {qq.options.map((o, oi) => {
                    const right = qq.type === "multi" ? qq.answer.includes(oi) : qq.answer === oi;
                    const chosen = qq.type === "multi" ? (answers[qq.id] || []).includes(oi) : answers[qq.id] === oi;
                    return (
                      <div key={oi} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", borderRadius: 8, fontSize: 13.5,
                        background: right ? "var(--green-50)" : chosen ? "var(--red-50)" : "transparent",
                        color: right ? "var(--green-500)" : chosen ? "var(--red-500)" : "var(--ink-600)", fontWeight: right || chosen ? 600 : 400 }}>
                        {right ? <Icon name="check" style={{ width: 15, height: 15 }} /> : <span style={{ width: 15 }} />}
                        {o}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="content fade-up" style={{ maxWidth: 800 }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <button onClick={onExit} className="icon-btn" style={{ border: "1px solid var(--line)" }}><Icon name="chevron" style={{ transform: "rotate(180deg)" }} /></button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16.5, fontWeight: 700 }}>{exam.title}</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-500)" }}>共 {qs.length} 题 · 及格 {exam.pass} 分</div>
        </div>
        <div className="tag gray" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, padding: "7px 12px" }}>
          <Icon name="clock" style={{ width: 15, height: 15 }} /> 19:42
        </div>
      </div>

      {/* progress dots */}
      <div style={{ display: "flex", gap: 7, marginBottom: 20, flexWrap: "wrap" }}>
        {qs.map((qq, i) => {
          const done = answers[qq.id] !== undefined && (qq.type !== "multi" || answers[qq.id].length);
          return (
            <button key={i} onClick={() => setIdx(i)}
              style={{ width: 34, height: 34, borderRadius: 9, fontSize: 13, fontWeight: 600,
                background: i === idx ? "var(--brand-600)" : done ? "var(--brand-50)" : "#fff",
                color: i === idx ? "#fff" : done ? "var(--brand-600)" : "var(--ink-400)",
                border: "1px solid " + (i === idx ? "var(--brand-600)" : done ? "var(--brand-200)" : "var(--line)") }}>{i + 1}</button>
          );
        })}
      </div>

      <div className="card" style={{ padding: "28px 30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
          <span className="tag">{q.type === "multi" ? "多选题" : "单选题"}</span>
          <span style={{ fontSize: 13, color: "var(--ink-500)" }}>第 {idx + 1} / {qs.length} 题</span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.5, marginBottom: 22 }}>{q.q}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {q.options.map((o, oi) => {
            const chosen = q.type === "multi" ? (Array.isArray(cur) && cur.includes(oi)) : cur === oi;
            return (
              <button key={oi} onClick={() => select(oi)}
                style={{ display: "flex", alignItems: "center", gap: 13, padding: "15px 17px", borderRadius: 12, textAlign: "left", width: "100%",
                  background: chosen ? "var(--brand-50)" : "#fff", border: "1.5px solid " + (chosen ? "var(--brand-600)" : "var(--line)"), transition: "all .12s" }}>
                <div style={{ width: 24, height: 24, flex: "none", borderRadius: q.type === "multi" ? 6 : "50%", display: "grid", placeItems: "center",
                  border: "1.5px solid " + (chosen ? "var(--brand-600)" : "var(--ink-300)"), background: chosen ? "var(--brand-600)" : "#fff", color: "#fff" }}>
                  {chosen && <Icon name="check" style={{ width: 14, height: 14 }} />}
                </div>
                <span style={{ fontSize: 15, fontWeight: chosen ? 600 : 500, color: "var(--ink-900)" }}>{String.fromCharCode(65 + oi)}. {o}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
        <button className="btn btn-ghost" disabled={idx === 0} style={{ opacity: idx === 0 ? .4 : 1 }} onClick={() => setIdx(idx - 1)}>上一题</button>
        <span style={{ marginLeft: "auto", marginRight: 14, fontSize: 13, color: "var(--ink-500)" }}>已答 {answeredCount} / {qs.length}</span>
        {idx < qs.length - 1
          ? <button className="btn btn-primary" onClick={() => setIdx(idx + 1)}>下一题</button>
          : <button className="btn btn-primary" onClick={() => setSubmitted(true)} disabled={answeredCount < qs.length} style={{ opacity: answeredCount < qs.length ? .5 : 1 }}>提交试卷</button>}
      </div>
    </div>
  );
}

export { ExamPage };
