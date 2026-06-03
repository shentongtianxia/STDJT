/* 神通大讲堂 — 我的学习（记录 / 收藏 / 证书 / 勋章） */
const { useState: useMeState } = React;

function MePage({ onOpen }) {
  const [tab, setTab] = useMeState("records");
  const learning = COURSES.filter(c => c.progress > 0);
  const favorites = [COURSES[2], COURSES[5], COURSES[7]];

  return (
    <div className="content fade-up">
      {/* profile header */}
      <div className="card" style={{ padding: 24, marginBottom: 22, display: "flex", alignItems: "center", gap: 20 }}>
        <Avatar name={USER.avatar} size={72} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 21, fontWeight: 700 }}>{USER.name}</span>
            <span className="tag gold" style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="spark" style={{ width: 13, height: 13 }} /> Lv.{USER.level} {USER.levelName}
            </span>
          </div>
          <div style={{ fontSize: 13.5, color: "var(--ink-500)", marginTop: 5 }}>{USER.dept}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, maxWidth: 360 }}>
            <div className="progress gold" style={{ flex: 1 }}><i style={{ width: (USER.points / USER.nextLevel * 100) + "%" }} /></div>
            <span style={{ fontSize: 12.5, color: "var(--ink-500)", whiteSpace: "nowrap" }}>{USER.points} / {USER.nextLevel}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 30, paddingLeft: 24, borderLeft: "1px solid var(--line)" }}>
          {[[USER.learnedHours + "h", "学习时长"], [USER.coursesDone, "完成课程"], [USER.certs, "证书"], [USER.streak, "连续天数"]].map(([v, l], i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{v}</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-500)", marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* tabs */}
      <div style={{ display: "flex", gap: 26, borderBottom: "1px solid var(--line)", marginBottom: 22 }}>
        {[["records", "学习记录"], ["favorites", "我的收藏"], ["certs", "我的证书"], ["badges", "勋章成就"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            style={{ padding: "0 0 13px", fontSize: 15, fontWeight: 600, position: "relative",
              color: tab === k ? "var(--brand-600)" : "var(--ink-500)" }}>
            {l}{tab === k && <span style={{ position: "absolute", left: 0, right: 0, bottom: -1, height: 2.5, background: "var(--brand-600)", borderRadius: 2 }} />}
          </button>
        ))}
      </div>

      {tab === "records" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {learning.map(c => (
            <div key={c.id} className="card" style={{ padding: 14, display: "flex", gap: 15, alignItems: "center", cursor: "pointer" }} onClick={() => onOpen(c)}>
              <div style={{ width: 120, flex: "none" }}><Cover course={c} showPlay={false} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 5 }}>{c.title}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-500)", marginBottom: 10 }}>{CATEGORIES.find(x => x.id === c.cat)?.name} · 最近学习于 2 天前</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, maxWidth: 400 }}>
                  <div className={"progress" + (c.progress === 100 ? " green" : "")} style={{ flex: 1 }}><i style={{ width: c.progress + "%" }} /></div>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: c.progress === 100 ? "var(--green-500)" : "var(--brand-600)" }}>
                    {c.progress === 100 ? "已完成" : c.progress + "%"}
                  </span>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm">{c.progress === 100 ? "复习" : "继续"}</button>
            </div>
          ))}
        </div>
      )}

      {tab === "favorites" && (
        <div className="grid-courses">{favorites.map(c => <CourseCard key={c.id} course={c} onOpen={onOpen} />)}</div>
      )}

      {tab === "certs" && (
        <div className="l-grid2" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 18 }}>
          {CERTS.map(ct => (
            <div key={ct.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "22px 24px", background: "linear-gradient(120deg,#12305f,#0B1A36)", color: "#fff", position: "relative" }}>
                <div style={{ position: "absolute", right: 18, top: 18, opacity: .3 }}><Icon name="trophy" style={{ width: 40, height: 40 }} /></div>
                <div style={{ fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,.6)" }}>CERTIFICATE</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 8 }}>{ct.name}</div>
                <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.7)", marginTop: 16 }}>{ct.org}</div>
              </div>
              <div style={{ padding: "14px 24px", display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "var(--ink-500)" }}>颁发于 {ct.date}</span>
                <button className="btn btn-outline btn-sm" style={{ marginLeft: "auto" }}><Icon name="download" style={{ width: 14, height: 14 }} /> 下载</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "badges" && (
        <div className="l-grid4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {BADGES.map(b => (
            <div key={b.id} className="card" style={{ padding: 24, textAlign: "center", opacity: b.got ? 1 : 0.55 }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, margin: "0 auto 12px", display: "grid", placeItems: "center",
                background: b.got ? "var(--gold-50)" : "var(--bg-2)" }}>
                <Icon name={b.icon} style={{ width: 32, height: 32, color: b.got ? "var(--gold-500)" : "var(--ink-400)" }} />
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 700 }}>{b.name}</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-500)", marginTop: 5 }}>{b.desc}</div>
              {b.got ? <span className="tag green" style={{ marginTop: 12 }}>已获得</span>
                : <span className="tag gray" style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="lock" style={{ width: 12, height: 12 }} />未解锁</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { MePage });
