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

/* 神通大讲堂 — 个人设置 */

function Toggle({ on, onChange }) {
  return (
    <button className={"sw" + (on ? " on" : "")} onClick={() => onChange(!on)} type="button">
      <span className="sw-dot" />
    </button>
  );
}

function SettingsPage() {
  const [tab, setTab] = useState("profile");
  const [notif, setNotif] = useState({ task: true, exam: true, reply: true, badge: true, weekly: false, marketing: false });
  const tabs = [["profile", "个人资料", "me"], ["security", "账号安全", "lock"], ["notify", "通知偏好", "bell"]];

  return (
    <div className="content fade-up" style={{ maxWidth: 940 }}>
      <div className="page-head">
        <div className="page-title">个人设置</div>
        <div className="page-desc">管理你的个人资料、账号安全与通知偏好</div>
      </div>

      <div className="set-layout">
        {/* side tabs */}
        <div className="set-tabs">
          {tabs.map(([k, l, ic]) => (
            <button key={k} className={"set-tab" + (tab === k ? " active" : "")} onClick={() => setTab(k)}>
              <Icon name={ic} style={{ width: 18, height: 18 }} /> {l}
            </button>
          ))}
        </div>

        {/* panel */}
        <div>
          {tab === "profile" && (
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, paddingBottom: 24, marginBottom: 24, borderBottom: "1px solid var(--line)" }}>
                <Avatar name={USER.avatar} size={68} />
                <div>
                  <button className="btn btn-outline btn-sm">更换头像</button>
                  <div style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 8 }}>支持 JPG / PNG，建议 200×200 以上</div>
                </div>
              </div>
              <div className="set-form">
                <Field2 label="姓名"><input className="set-input" defaultValue={USER.name} /></Field2>
                <Field2 label="工号"><input className="set-input" defaultValue="ST-20231" disabled /></Field2>
                <Field2 label="所属部门"><input className="set-input" defaultValue="市场部" disabled /></Field2>
                <Field2 label="职级"><input className="set-input" defaultValue="高级专员" disabled /></Field2>
                <Field2 label="企业邮箱"><input className="set-input" defaultValue="lin.siqi@company.com" /></Field2>
                <Field2 label="手机号"><input className="set-input" defaultValue="138****6021" /></Field2>
                <Field2 label="个人简介" full>
                  <textarea className="set-input" rows="3" defaultValue="市场部高级专员，专注品牌与活动运营，热爱学习与分享。" style={{ resize: "vertical", lineHeight: 1.6 }} />
                </Field2>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button className="btn btn-primary">保存修改</button>
                <button className="btn btn-ghost">取消</button>
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-400)", marginTop: 14 }}>* 工号、部门、职级由 HR 系统同步，如需变更请联系人力资源部。</div>
            </div>
          )}

          {tab === "security" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="card" style={{ padding: 28 }}>
                <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 700 }}>修改密码</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 420 }}>
                  <Field2 label="当前密码" full><input type="password" className="set-input" placeholder="请输入当前密码" /></Field2>
                  <Field2 label="新密码" full><input type="password" className="set-input" placeholder="至少 8 位，含字母与数字" /></Field2>
                  <Field2 label="确认新密码" full><input type="password" className="set-input" placeholder="再次输入新密码" /></Field2>
                </div>
                <button className="btn btn-primary" style={{ marginTop: 20 }}>更新密码</button>
              </div>
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>登录与绑定</h3>
                {[
                  { ic: "chat", t: "企业微信", s: "已绑定 · 林思齐", on: true },
                  { ic: "grid", t: "钉钉", s: "未绑定", on: false },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 13, padding: "13px 0", borderBottom: i === 0 ? "1px solid var(--line-2)" : "none" }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--bg-2)", display: "grid", placeItems: "center", flex: "none" }}>
                      <Icon name={r.ic} style={{ width: 19, height: 19, color: "var(--ink-600)" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{r.t}</div>
                      <div style={{ fontSize: 12.5, color: "var(--ink-500)" }}>{r.s}</div>
                    </div>
                    <button className={"btn btn-sm " + (r.on ? "btn-ghost" : "btn-outline")}>{r.on ? "解绑" : "绑定"}</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "notify" && (
            <div className="card" style={{ padding: 28 }}>
              <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700 }}>通知偏好</h3>
              <p className="muted" style={{ fontSize: 13, margin: "0 0 8px" }}>选择你希望接收的站内与推送通知类型</p>
              {[
                ["task", "任务指派提醒", "有新学习任务指派给你时通知"],
                ["exam", "考试截止提醒", "认证考试临近截止日期时提醒"],
                ["reply", "社区互动通知", "你的帖子被回复或点赞时通知"],
                ["badge", "积分与勋章", "获得积分、解锁勋章时通知"],
                ["weekly", "每周学习周报", "每周一推送你的学习数据汇总"],
                ["marketing", "新课上线推荐", "有新课程发布时推荐给你"],
              ].map(([k, t, s], i, arr) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--line-2)" : "none" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 600 }}>{t}</div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-500)", marginTop: 2 }}>{s}</div>
                  </div>
                  <Toggle on={notif[k]} onChange={v => setNotif({ ...notif, [k]: v })} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field2({ label, children, full }) {
  return (
    <div style={{ gridColumn: full ? "1 / -1" : "auto" }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-700)", marginBottom: 7 }}>{label}</div>
      {children}
    </div>
  );
}

export { SettingsPage };
