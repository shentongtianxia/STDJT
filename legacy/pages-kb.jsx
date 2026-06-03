/* 神通大讲堂 — 知识库（目录树 + 检索 + 阅读页） */
const { useState: useKbState } = React;

const TAG_COLORS = { "制度": "red", "指南": "", "操作手册": "green", "FAQ": "gray", "手册": "green", "技术文档": "", "分析": "orange", "流程": "", "话术": "gold", "模板": "gray" };

function KbPage() {
  const allDocs = KB_TREE.flatMap(g => g.docs.map(d => ({ ...d, group: g.id, groupName: g.name })));
  const [activeGroup, setActiveGroup] = useKbState("all");
  const [q, setQ] = useKbState("");
  const [openDoc, setOpenDoc] = useKbState(null);

  if (openDoc) return <DocReader doc={openDoc} onBack={() => setOpenDoc(null)} />;

  let docs = allDocs;
  if (activeGroup !== "all") docs = docs.filter(d => d.group === activeGroup);
  if (q.trim()) docs = docs.filter(d => d.title.includes(q.trim()));
  const sorted = [...docs].sort((a, b) => b.views - a.views);

  return (
    <div className="content fade-up">
      <div className="page-head">
        <div className="page-title">内部知识库</div>
        <div className="page-desc">{allDocs.length} 篇文档 · 制度规范、操作手册、产品资料随时检索</div>
      </div>

      <div className="l-kb" style={{ display: "grid", gridTemplateColumns: "236px 1fr", gap: 24, alignItems: "start" }}>
        {/* Tree */}
        <div className="card l-rail" style={{ padding: 12, position: "sticky", top: 88 }}>
          <button onClick={() => setActiveGroup("all")}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 9, textAlign: "left",
              fontSize: 14, fontWeight: 600, marginBottom: 2,
              background: activeGroup === "all" ? "var(--brand-50)" : "transparent",
              color: activeGroup === "all" ? "var(--brand-600)" : "var(--ink-700)" }}>
            <Icon name="grid" style={{ width: 18, height: 18 }} /> 全部文档
            <span style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--ink-400)" }}>{allDocs.length}</span>
          </button>
          <div className="divider" style={{ margin: "8px 0" }} />
          {KB_TREE.map(g => (
            <button key={g.id} onClick={() => setActiveGroup(g.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 9, textAlign: "left",
                fontSize: 14, fontWeight: 600, marginBottom: 2,
                background: activeGroup === g.id ? "var(--brand-50)" : "transparent",
                color: activeGroup === g.id ? "var(--brand-600)" : "var(--ink-700)" }}>
              <Icon name={g.icon} style={{ width: 18, height: 18 }} /> {g.name}
              <span style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--ink-400)" }}>{g.docs.length}</span>
            </button>
          ))}
        </div>

        {/* List */}
        <div>
          <div className="search" style={{ maxWidth: "none", background: "#fff", border: "1px solid var(--line)", marginBottom: 16 }}>
            <Icon name="search" />
            <input placeholder="在知识库中搜索文档标题…" value={q} onChange={e => setQ(e.target.value)} />
          </div>

          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", padding: "13px 18px", borderBottom: "1px solid var(--line)", fontSize: 12.5, color: "var(--ink-500)", fontWeight: 600 }}>
              <span style={{ flex: 1 }}>文档标题</span>
              <span style={{ width: 120 }}>更新时间</span>
              <span style={{ width: 90, textAlign: "right" }}>阅读量</span>
            </div>
            {sorted.map((d, i) => (
              <button key={d.id} onClick={() => setOpenDoc(DOC_CONTENT[d.id] ? { ...DOC_CONTENT[d.id], groupName: d.groupName } : { ...d, groupName: d.groupName, body: null })}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 18px", width: "100%", textAlign: "left",
                  borderBottom: i < sorted.length - 1 ? "1px solid var(--line-2)" : "none", transition: "background .12s" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ width: 38, height: 38, borderRadius: 10, flex: "none", display: "grid", placeItems: "center", background: "var(--brand-50)" }}>
                  <Icon name="doc" style={{ width: 19, height: 19, color: "var(--brand-600)" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14.5, fontWeight: 600 }}>{d.title}</span>
                    <span className={"tag " + (TAG_COLORS[d.tag] || "")}>{d.tag}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 3 }}>{d.groupName} · {d.author}</div>
                </div>
                <span style={{ width: 120, fontSize: 13, color: "var(--ink-500)" }}>{d.updated}</span>
                <span style={{ width: 90, fontSize: 13, color: "var(--ink-500)", textAlign: "right", display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
                  <Icon name="eye" style={{ width: 14, height: 14 }} />{d.views.toLocaleString()}
                </span>
              </button>
            ))}
            {sorted.length === 0 && (
              <div style={{ padding: 50, textAlign: "center", color: "var(--ink-500)", fontSize: 14 }}>没有找到匹配「{q}」的文档</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DocReader({ doc, onBack }) {
  return (
    <div className="content fade-up" style={{ maxWidth: 1000 }}>
      <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ marginBottom: 18 }}>
        <Icon name="chevron" style={{ width: 15, height: 15, transform: "rotate(180deg)" }} /> 返回知识库
      </button>
      <div className="card" style={{ padding: "38px 44px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span className="tag">{doc.groupName}</span>
          <span className={"tag " + (TAG_COLORS[doc.tag] || "")}>{doc.tag}</span>
        </div>
        <h1 style={{ fontSize: 27, fontWeight: 700, margin: "0 0 16px", lineHeight: 1.35, letterSpacing: "-.3px" }}>{doc.title}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "var(--ink-500)", paddingBottom: 22, borderBottom: "1px solid var(--line)", marginBottom: 28 }}>
          <span>{doc.author}</span><span>·</span>
          <span>更新于 {doc.updated}</span><span>·</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon name="eye" style={{ width: 15, height: 15 }} />{doc.views.toLocaleString()} 次阅读</span>
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }}><Icon name="download" style={{ width: 15, height: 15 }} /> 下载</button>
        </div>

        {doc.body ? (
          <div style={{ fontSize: 15.5, lineHeight: 1.95, color: "var(--ink-700)" }}>
            {doc.body.map((b, i) => {
              if (b.type === "h") return <h3 key={i} style={{ fontSize: 18, fontWeight: 700, color: "var(--ink-900)", margin: "28px 0 12px" }}>{b.t}</h3>;
              if (b.type === "p") return <p key={i} style={{ margin: "0 0 14px" }}>{b.t}</p>;
              if (b.type === "list") return <ul key={i} style={{ margin: "0 0 14px", paddingLeft: 22 }}>{b.items.map((it, j) => <li key={j} style={{ marginBottom: 6 }}>{it}</li>)}</ul>;
              if (b.type === "callout") return (
                <div key={i} style={{ display: "flex", gap: 11, background: "var(--brand-50)", border: "1px solid var(--brand-100)", borderRadius: 12, padding: "14px 16px", margin: "6px 0 18px", fontSize: 14.5 }}>
                  <Icon name="spark" style={{ width: 19, height: 19, color: "var(--brand-600)", flex: "none", marginTop: 2 }} />
                  <span style={{ color: "var(--ink-700)" }}>{b.t}</span>
                </div>
              );
              return null;
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--ink-500)" }}>
            <Icon name="doc" style={{ width: 44, height: 44, color: "var(--ink-300)", margin: "0 auto 12px" }} />
            <div style={{ fontSize: 14.5 }}>该文档为示例条目，正文内容待录入。</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>正式上线后此处展示完整图文 / 附件。</div>
          </div>
        )}
      </div>
    </div>
  );
}

function resolveDoc(d) {
  return DOC_CONTENT[d.id] ? { ...DOC_CONTENT[d.id], groupName: d.groupName } : { ...d, groupName: d.groupName, body: null };
}

Object.assign(window, { KbPage, DocReader, resolveDoc });
