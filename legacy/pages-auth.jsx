/* 神通大讲堂 — 登录页 */
const { useState: useAuthState } = React;

function LoginPage({ onLogin }) {
  const [tab, setTab] = useAuthState("account");  // account | sms
  const [account, setAccount] = useAuthState("");
  const [pwd, setPwd] = useAuthState("");
  const [showPwd, setShowPwd] = useAuthState(false);
  const [remember, setRemember] = useAuthState(true);
  const [err, setErr] = useAuthState("");

  const submit = (e) => {
    e && e.preventDefault();
    if (!account.trim()) { setErr("请输入工号 / 企业邮箱"); return; }
    if (tab === "account" && !pwd) { setErr("请输入密码"); return; }
    setErr("");
    onLogin();
  };

  return (
    <div className="auth-wrap">
      {/* Left brand panel */}
      <div className="auth-brand">
        <div className="auth-brand-top">
          <div className="brand-mark" style={{ width: 44, height: 44, borderRadius: 13 }}>
            <Icon name="rocket" style={{ color: "#fff", width: 25, height: 25 }} />
          </div>
          <div>
            <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: ".5px" }}>神通大讲堂</div>
            <div style={{ fontSize: 11, color: "#8FA6CC", letterSpacing: 2, marginTop: 2 }}>LEARNING HUB</div>
          </div>
        </div>
        <div className="auth-brand-mid">
          <h1>让每一位同事<br />都能持续成长</h1>
          <p>公司内部培训与知识库平台 · 系统化课程、随时检索的制度文档、任务与认证一站式完成。</p>
          <div className="auth-stats">
            <div><b>64+</b><span>培训课程</span></div>
            <div><b>1,286</b><span>在学员工</span></div>
            <div><b>120+</b><span>知识文档</span></div>
          </div>
        </div>
        <div className="auth-brand-foot">© 2026 神通科技 · 内部学习平台</div>
        <div className="auth-glow" />
      </div>

      {/* Right form panel */}
      <div className="auth-form-col">
        <form className="auth-card" onSubmit={submit}>
          <div className="auth-mobile-brand">
            <div className="brand-mark" style={{ width: 36, height: 36, borderRadius: 11 }}>
              <Icon name="rocket" style={{ color: "#fff", width: 20, height: 20 }} />
            </div>
            <span>神通大讲堂</span>
          </div>
          <h2>欢迎回来 👋</h2>
          <p className="auth-sub">登录以继续你的学习</p>

          <div className="auth-tabs">
            {[["account", "账号密码"], ["sms", "短信验证码"]].map(([k, l]) => (
              <button type="button" key={k} className={"auth-tab" + (tab === k ? " active" : "")} onClick={() => { setTab(k); setErr(""); }}>{l}</button>
            ))}
          </div>

          <label className="auth-field">
            <span>工号 / 企业邮箱</span>
            <div className="auth-input">
              <Icon name="me" />
              <input value={account} onChange={e => setAccount(e.target.value)} placeholder="如 lin.siqi@company.com" autoFocus />
            </div>
          </label>

          {tab === "account" ? (
            <label className="auth-field">
              <span>密码</span>
              <div className="auth-input">
                <Icon name="lock" />
                <input type={showPwd ? "text" : "password"} value={pwd} onChange={e => setPwd(e.target.value)} placeholder="请输入登录密码" />
                <button type="button" className="auth-eye" onClick={() => setShowPwd(!showPwd)}>
                  <Icon name={showPwd ? "eye" : "eye"} style={{ opacity: showPwd ? 1 : .5 }} />
                </button>
              </div>
            </label>
          ) : (
            <label className="auth-field">
              <span>验证码</span>
              <div className="auth-input">
                <Icon name="chat" />
                <input value={pwd} onChange={e => setPwd(e.target.value)} placeholder="6 位短信验证码" />
                <button type="button" className="auth-sms-btn">获取验证码</button>
              </div>
            </label>
          )}

          {err && <div className="auth-err"><Icon name="spark" style={{ width: 15, height: 15 }} />{err}</div>}

          <div className="auth-row">
            <label className="auth-remember">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
              <span>记住我</span>
            </label>
            <button type="button" className="auth-link">忘记密码？</button>
          </div>

          <button type="submit" className="btn btn-primary auth-submit">登录</button>

          <div className="auth-sso">
            <span>或使用</span>
          </div>
          <button type="button" className="auth-sso-btn" onClick={onLogin}>
            <Icon name="grid" style={{ width: 18, height: 18 }} /> 企业微信 / 钉钉 一键登录
          </button>

          <div className="auth-foot">
            还没有账号？请联系 <b>HR 或部门管理员</b> 开通
          </div>
        </form>
      </div>
    </div>
  );
}

Object.assign(window, { LoginPage });
