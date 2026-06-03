/* 神通大讲堂 — 任务中心 */
const { useState: useTaskState } = React;

function TasksPage({ onOpen }) {
  const [filter, setFilter] = useTaskState("all");
  const list = TASKS.filter(t => filter === "all" ? true : filter === "doing" ? t.status === "doing" : t.status === "done");
  const doingCount = TASKS.filter(t => t.status === "doing").length;
  const todayLeft = TASKS.filter(t => t.status === "doing" && t.required).length;

  const daysLeft = (due) => {
    const d = Math.ceil((new Date(due) - new Date("2026-05-29")) / 86400000);
    return d;
  };

  return (
    <div className="content fade-up">
      <div className="page-head">
        <div className="page-title">任务中心</div>
        <div className="page-desc">由部门 / HR 指派给你的学习任务，按时完成可获积分</div>
      </div>

      {/* summary */}
      <div className="l-stats3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 22 }}>
        {[
          { ic: "task", v: doingCount, l: "进行中任务", c: "var(--brand-600)", bg: "var(--brand-50)" },
          { ic: "flame", v: todayLeft, l: "待完成必修", c: "var(--orange-500)", bg: "var(--orange-50)" },
          { ic: "check", v: TASKS.filter(t => t.status === "done").length, l: "已完成", c: "var(--green-500)", bg: "var(--green-50)" },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: 18, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: s.bg, display: "grid", placeItems: "center", flex: "none" }}>
              <Icon name={s.ic} style={{ width: 23, height: 23, color: s.c }} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 13, color: "var(--ink-500)", marginTop: 4 }}>{s.l}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 4, background: "var(--bg-2)", padding: 4, borderRadius: 9, width: "fit-content", marginBottom: 16 }}>
        {[["all", "全部"], ["doing", "进行中"], ["done", "已完成"]].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)}
            style={{ padding: "7px 18px", borderRadius: 7, fontSize: 13.5, fontWeight: 600,
              background: filter === k ? "#fff" : "transparent", color: filter === k ? "var(--brand-600)" : "var(--ink-500)",
              boxShadow: filter === k ? "var(--sh-sm)" : "none" }}>{l}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {list.map(t => {
          const c = COURSES.find(x => x.id === t.courseId);
          const dl = daysLeft(t.due);
          const overdue = dl < 0 && t.status !== "done";
          return (
            <div key={t.id} className="card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 16 }}>
              {c && <div style={{ width: 132, flex: "none" }}><Cover course={c} showPlay={false} /></div>}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                  {t.required && <span className="tag orange">必修</span>}
                  {t.status === "done"
                    ? <span className="tag green">已完成</span>
                    : overdue ? <span className="tag red">已逾期</span>
                    : <span className={"tag " + (dl <= 3 ? "red" : "gray")}>{dl <= 3 ? `仅剩 ${dl} 天` : `${dl} 天后截止`}</span>}
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 5 }}>{t.title}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-500)", marginBottom: 11 }}>指派人：{t.assignedBy} · 截止 {t.due}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, maxWidth: 420 }}>
                  <div className={"progress" + (t.status === "done" ? " green" : "")} style={{ flex: 1 }}><i style={{ width: t.progress + "%" }} /></div>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: t.status === "done" ? "var(--green-500)" : "var(--brand-600)" }}>{t.progress}%</span>
                </div>
              </div>
              <button className={"btn " + (t.status === "done" ? "btn-ghost" : "btn-primary")} style={{ flex: "none" }}
                onClick={() => c && onOpen(c)}>
                {t.status === "done" ? "查看" : t.progress > 0 ? "继续学习" : "开始学习"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { TasksPage });
