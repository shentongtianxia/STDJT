import React, { useState, Fragment } from 'react';
import { Icon, Avatar, Cover, CourseCard } from '../components';
import { useQuery } from '../api/useQuery';
import * as api from '../api';

/* 神通大讲堂 — 内部社区 */

function CommunityPage() {
  const POSTS = useQuery(['posts'], api.listPosts).data || [];
  const LEADERBOARD = useQuery(['leaderboard'], api.getLeaderboard).data || [];

  const cats = ["全部", "经验分享", "课程讨论", "提问求助"];
  const [cat, setCat] = useState("全部");
  const list = POSTS.filter(p => cat === "全部" || p.cat === cat);

  return (
    <div className="content fade-up">
      <div className="page-head" style={{ display: "flex", alignItems: "flex-end" }}>
        <div>
          <div className="page-title">内部社区</div>
          <div className="page-desc">分享学习心得、交流业务经验、互助答疑</div>
        </div>
        <button className="btn btn-primary" style={{ marginLeft: "auto" }}><Icon name="plus" style={{ width: 17, height: 17 }} /> 发布帖子</button>
      </div>

      <div className="l-main-rail" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24, alignItems: "start" }}>
        <div>
          <div style={{ display: "flex", gap: 4, background: "var(--bg-2)", padding: 4, borderRadius: 9, width: "fit-content", marginBottom: 16 }}>
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)}
                style={{ padding: "7px 16px", borderRadius: 7, fontSize: 13.5, fontWeight: 600,
                  background: cat === c ? "#fff" : "transparent", color: cat === c ? "var(--brand-600)" : "var(--ink-500)",
                  boxShadow: cat === c ? "var(--sh-sm)" : "none" }}>{c}</button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {list.map(p => (
              <div key={p.id} className="card" style={{ padding: 18, cursor: "pointer", transition: "box-shadow .15s" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--sh)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "var(--sh-sm)"}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
                  <Avatar name={p.author} size={34} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{p.author} <span style={{ color: "var(--ink-400)", fontWeight: 400 }}>· {p.dept}</span></div>
                    <div style={{ fontSize: 12, color: "var(--ink-400)" }}>{p.time}</div>
                  </div>
                  <span className={"tag " + (p.cat === "提问求助" ? "orange" : p.cat === "课程讨论" ? "" : "green")}>{p.cat}</span>
                  {p.hot && <span className="tag red" style={{ display: "flex", alignItems: "center", gap: 3 }}><Icon name="fire" style={{ width: 12, height: 12 }} />热</span>}
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 7, lineHeight: 1.4 }}>{p.title}</div>
                {p.excerpt && <div style={{ fontSize: 13.5, color: "var(--ink-600)", lineHeight: 1.6, marginBottom: 13,
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.excerpt}</div>}
                <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 13, color: "var(--ink-500)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="heart" style={{ width: 16, height: 16 }} />{p.likes}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="reply" style={{ width: 16, height: 16 }} />{p.replies} 回复</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* right rail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="card" style={{ padding: 18 }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700 }}>热门话题</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {["#新人入职打卡", "#SPIN销售实战", "#管理者成长", "#信息安全月", "#效率工具分享"].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: i < 3 ? "var(--brand-600)" : "var(--ink-400)", width: 14 }}>{i + 1}</span>
                  <span style={{ flex: 1, fontWeight: 500 }}>{t}</span>
                  <span style={{ fontSize: 11.5, color: "var(--ink-400)" }}>{(120 - i * 18)} 讨论</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: 18 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700 }}>活跃达人</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {LEADERBOARD.slice(0, 4).map(u => (
                <div key={u.rank} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name={u.name} size={32} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-500)" }}>{u.dept}</div>
                  </div>
                  <button className="btn btn-outline btn-sm" style={{ padding: "5px 12px" }}>关注</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CommunityPage };
