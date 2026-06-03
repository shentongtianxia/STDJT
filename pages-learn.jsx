/* 神通大讲堂 — 学习中心 */
const { useState: useLearnState } = React;

function LearnPage({ onOpen }) {
  const [cat, setCat] = useLearnState("all");
  const [sort, setSort] = useLearnState("hot");
  const [onlyRequired, setOnlyRequired] = useLearnState(false);

  let list = COURSES.filter(c => cat === "all" || c.cat === cat);
  if (onlyRequired) list = list.filter(c => c.required);
  list = [...list].sort((a, b) =>
    sort === "hot" ? b.learners - a.learners :
    sort === "rating" ? b.rating - a.rating : 0);

  return (
    <div className="content fade-up">
      <div className="page-head">
        <div className="page-title">学习中心</div>
        <div className="page-desc">共 {COURSES.length} 门课程 · 覆盖入职、产品、销售、合规、管理与通用技能</div>
      </div>

      {/* Category chips */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)}
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 15px", borderRadius: 10,
              fontSize: 13.5, fontWeight: 600, transition: "all .15s",
              background: cat === c.id ? "var(--brand-600)" : "#fff",
              color: cat === c.id ? "#fff" : "var(--ink-600)",
              border: "1px solid " + (cat === c.id ? "var(--brand-600)" : "var(--line)"),
              boxShadow: cat === c.id ? "0 6px 16px rgba(32,90,217,.25)" : "none" }}>
            <Icon name={c.icon} style={{ width: 16, height: 16 }} />{c.name}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="learn-toolbar" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 4, background: "var(--bg-2)", padding: 4, borderRadius: 9 }}>
          {[["hot", "最热"], ["rating", "评分"], ["new", "最新"]].map(([k, l]) => (
            <button key={k} onClick={() => setSort(k)}
              style={{ padding: "6px 14px", borderRadius: 7, fontSize: 13, fontWeight: 600,
                background: sort === k ? "#fff" : "transparent",
                color: sort === k ? "var(--brand-600)" : "var(--ink-500)",
                boxShadow: sort === k ? "var(--sh-sm)" : "none" }}>{l}</button>
          ))}
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13.5, color: "var(--ink-600)", cursor: "pointer", marginLeft: 4 }}>
          <input type="checkbox" checked={onlyRequired} onChange={e => setOnlyRequired(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: "var(--brand-600)" }} />
          只看必修
        </label>
        <span className="muted" style={{ marginLeft: "auto", fontSize: 13 }}>{list.length} 门结果</span>
      </div>

      <div className="grid-courses">
        {list.map(c => <CourseCard key={c.id} course={c} onOpen={onOpen} />)}
      </div>
      {list.length === 0 && (
        <div className="card" style={{ padding: 50, textAlign: "center" }} className="muted">该分类下暂无课程</div>
      )}
    </div>
  );
}

Object.assign(window, { LearnPage });
