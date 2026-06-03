/* 神通大讲堂 — Mock data */

const CATEGORIES = [
  { id: "all", name: "全部", icon: "grid" },
  { id: "onboard", name: "新人入职", icon: "rocket", color: "#2F6BF0" },
  { id: "product", name: "产品知识", icon: "box", color: "#15A05A" },
  { id: "sales", name: "销售技能", icon: "trend", color: "#DB7A2B" },
  { id: "compliance", name: "合规制度", icon: "shield", color: "#7A5AF0" },
  { id: "manage", name: "管理力", icon: "users", color: "#205AD9" },
  { id: "skill", name: "通用技能", icon: "spark", color: "#0E9BAA" },
];

const COVER_COLORS = {
  onboard:    "linear-gradient(140deg,#34548A,#172a4d)",
  product:    "linear-gradient(140deg,#2F6155,#172a4d)",
  sales:      "linear-gradient(140deg,#7C6242,#172a4d)",
  compliance: "linear-gradient(140deg,#4E4D80,#172a4d)",
  manage:     "linear-gradient(140deg,#33517E,#172a4d)",
  skill:      "linear-gradient(140deg,#356069,#172a4d)",
};

const COURSES = [
  { id: "c1", cat: "onboard", title: "新员工入职第一课：走进神通", type: "video", dur: "42分钟", lessons: 6, learners: 1284, rating: 4.9, instructor: "人力资源部 · 王敏", progress: 100, required: true,
    desc: "从公司发展历程、组织架构到企业文化与价值观，帮助新同学快速融入团队，了解我们是谁、为何而战。",
    chapters: [
      { t: "公司发展简史与里程碑", d: "08:20", type: "video", done: true },
      { t: "组织架构与各部门职能", d: "06:45", type: "video", done: true },
      { t: "企业文化与核心价值观", d: "09:10", type: "video", done: true },
      { t: "员工手册（文档）", d: "图文", type: "doc", done: true },
      { t: "行政与 IT 报到指引", d: "07:30", type: "video", done: true },
      { t: "入职第一课 · 结业测验", d: "测验", type: "quiz", done: true },
    ]},
  { id: "c2", cat: "product", title: "核心产品全景解析（2026版）", type: "video", dur: "1小时18分", lessons: 9, learners: 962, rating: 4.8, instructor: "产品部 · 李哲", progress: 45, required: true,
    desc: "系统讲解公司主力产品线的定位、核心功能、典型场景与竞品差异，销售与客户成功同学必学。",
    chapters: [
      { t: "产品矩阵总览", d: "07:12", type: "video", done: true },
      { t: "旗舰产品深度拆解", d: "12:40", type: "video", done: true },
      { t: "典型客户场景与价值", d: "10:05", type: "video", done: false },
      { t: "产品规格速查手册", d: "文档", type: "doc", done: false },
      { t: "竞品对比与话术", d: "11:30", type: "video", done: false },
      { t: "常见问题 FAQ", d: "图文", type: "doc", done: false },
    ]},
  { id: "c3", cat: "sales", title: "顾问式销售：从需求挖掘到成交", type: "video", dur: "56分钟", lessons: 7, learners: 745, rating: 4.7, instructor: "销售部 · 陈昊", progress: 0,
    desc: "用 SPIN 方法论拆解大客户销售全流程，结合真实案例演练，提升赢单率。",
    chapters: [
      { t: "为什么传统推销正在失效", d: "06:50", type: "video", done: false },
      { t: "SPIN 提问四步法", d: "13:20", type: "video", done: false },
      { t: "异议处理实战", d: "09:40", type: "video", done: false },
      { t: "成交信号与临门一脚", d: "08:15", type: "video", done: false },
    ]},
  { id: "c4", cat: "compliance", title: "信息安全与数据合规红线", type: "doc", dur: "图文 · 25分钟", lessons: 5, learners: 1530, rating: 4.6, instructor: "法务与风控部", progress: 70, required: true,
    desc: "每位员工必读的信息安全规范、数据分级管理与个人信息保护要点，年度合规必修。",
    chapters: [
      { t: "信息安全基本原则", d: "图文", type: "doc", done: true },
      { t: "数据分级与权限", d: "图文", type: "doc", done: true },
      { t: "个人信息保护合规", d: "图文", type: "doc", done: true },
      { t: "办公安全与钓鱼防范", d: "图文", type: "doc", done: false },
      { t: "合规红线 · 测验", d: "测验", type: "quiz", done: false },
    ]},
  { id: "c5", cat: "manage", title: "新晋管理者的第一个90天", type: "video", dur: "1小时04分", lessons: 8, learners: 412, rating: 4.9, instructor: "组织发展部 · 周立", progress: 20,
    desc: "从业务骨干到团队管理者的角色转变，搭建目标、辅导与反馈的管理基本功。",
    chapters: [
      { t: "角色转变：从单兵到带队", d: "09:00", type: "video", done: true },
      { t: "目标对齐与任务分配", d: "11:25", type: "video", done: false },
      { t: "有效的一对一沟通", d: "10:10", type: "video", done: false },
      { t: "绩效反馈与辅导", d: "12:00", type: "video", done: false },
    ]},
  { id: "c6", cat: "skill", title: "高效表达：用结构化思维做汇报", type: "video", dur: "38分钟", lessons: 5, learners: 880, rating: 4.8, instructor: "外部讲师 · 孙颖", progress: 0,
    desc: "金字塔原理 + 商务汇报模板，让你的方案一次讲清楚、讲到点子上。",
    chapters: [
      { t: "结论先行：金字塔原理", d: "08:30", type: "video", done: false },
      { t: "汇报结构化模板", d: "09:15", type: "video", done: false },
      { t: "可视化与图表表达", d: "07:40", type: "video", done: false },
    ]},
  { id: "c7", cat: "skill", title: "职场效率：你的时间管理系统", type: "video", dur: "33分钟", lessons: 4, learners: 654, rating: 4.5, instructor: "外部讲师 · 孙颖", progress: 0,
    desc: "搭建一套可落地的任务管理与精力管理方法，告别忙乱。",
    chapters: [
      { t: "四象限与优先级", d: "07:10", type: "video", done: false },
      { t: "番茄工作法实践", d: "06:30", type: "video", done: false },
      { t: "工具搭配与复盘", d: "08:00", type: "video", done: false },
    ]},
  { id: "c8", cat: "product", title: "客户成功：从交付到续费", type: "video", dur: "49分钟", lessons: 6, learners: 388, rating: 4.7, instructor: "客户成功部 · 赵琳", progress: 0,
    desc: "建立健康度模型，把一次性交付变成长期续费与增购。",
    chapters: [
      { t: "客户成功的价值与指标", d: "08:50", type: "video", done: false },
      { t: "客户健康度模型", d: "10:20", type: "video", done: false },
      { t: "续费与增购策略", d: "09:30", type: "video", done: false },
    ]},
];

/* ---- Knowledge base: directory tree + docs ---- */
const KB_TREE = [
  { id: "k-hr", name: "人事制度", icon: "users", docs: [
    { id: "d1", title: "员工考勤与请假管理办法", updated: "2026-04-18", author: "人力资源部", views: 2310, tag: "制度" },
    { id: "d2", title: "差旅与费用报销标准（2026）", updated: "2026-03-30", author: "财务部", views: 3102, tag: "制度" },
    { id: "d3", title: "绩效考核与晋升通道说明", updated: "2026-02-12", author: "人力资源部", views: 1876, tag: "指南" },
  ]},
  { id: "k-it", name: "IT 与办公", icon: "laptop", docs: [
    { id: "d4", title: "VPN 与内网访问配置指引", updated: "2026-05-02", author: "IT 支持", views: 1540, tag: "操作手册" },
    { id: "d5", title: "企业邮箱与协同工具使用规范", updated: "2026-04-22", author: "IT 支持", views: 980, tag: "操作手册" },
    { id: "d6", title: "常见办公软件故障自助排查", updated: "2026-04-10", author: "IT 支持", views: 1220, tag: "FAQ" },
  ]},
  { id: "k-product", name: "产品资料", icon: "box", docs: [
    { id: "d7", title: "产品规格速查手册（全系列）", updated: "2026-05-15", author: "产品部", views: 4205, tag: "手册" },
    { id: "d8", title: "API 接入与对接说明", updated: "2026-05-08", author: "研发部", views: 2640, tag: "技术文档" },
    { id: "d9", title: "竞品对比分析（季度更新）", updated: "2026-04-28", author: "产品部", views: 1890, tag: "分析" },
  ]},
  { id: "k-sales", name: "销售支持", icon: "trend", docs: [
    { id: "d10", title: "标准报价单与折扣审批流程", updated: "2026-05-11", author: "销售运营", views: 2110, tag: "流程" },
    { id: "d11", title: "经典销售话术库", updated: "2026-04-19", author: "销售部", views: 3380, tag: "话术" },
    { id: "d12", title: "合同模板与签署须知", updated: "2026-03-25", author: "法务部", views: 1455, tag: "模板" },
  ]},
  { id: "k-compliance", name: "合规与安全", icon: "shield", docs: [
    { id: "d13", title: "信息安全管理制度", updated: "2026-05-20", author: "风控部", views: 2780, tag: "制度" },
    { id: "d14", title: "数据分级与保密协议", updated: "2026-04-30", author: "法务部", views: 1620, tag: "制度" },
  ]},
];

const DOC_CONTENT = {
  d1: { title: "员工考勤与请假管理办法", author: "人力资源部", updated: "2026-04-18", views: 2310, tag: "制度",
    body: [
      { type: "h", t: "一、总则" },
      { type: "p", t: "为规范公司考勤管理，保障正常的工作秩序，结合公司实际情况，特制定本办法。本办法适用于公司全体正式员工及试用期员工。" },
      { type: "h", t: "二、工作时间" },
      { type: "p", t: "公司实行标准工时制，每周工作五天，每天工作八小时。上班时间为 09:00–18:00，午休时间为 12:00–13:30。部分岗位可申请弹性工作制。" },
      { type: "list", items: ["迟到/早退：超过规定时间 30 分钟以内计为迟到/早退；","旷工：未履行请假手续缺勤者，按旷工处理；","加班：需提前在系统提交加班申请并经主管审批。"] },
      { type: "h", t: "三、请假类型与流程" },
      { type: "p", t: "员工请假须通过「神通 OA」提交申请，按下列权限逐级审批。事假、病假、年假等不同假别的额度与凭证要求详见附表。" },
      { type: "callout", t: "提示：3 天以内由直属主管审批，3 天以上需部门负责人审批，7 天以上报 HR 备案。" },
    ]},
};

/* ---- Tasks ---- */
const TASKS = [
  { id: "t1", courseId: "c2", title: "核心产品全景解析（2026版）", assignedBy: "产品部 · 李哲", due: "2026-06-05", progress: 45, status: "doing", required: true },
  { id: "t2", courseId: "c4", title: "信息安全与数据合规红线", assignedBy: "风控部", due: "2026-06-02", progress: 70, status: "doing", required: true },
  { id: "t3", courseId: "c5", title: "新晋管理者的第一个90天", assignedBy: "组织发展部 · 周立", due: "2026-06-20", progress: 20, status: "doing", required: false },
  { id: "t4", courseId: "c1", title: "新员工入职第一课：走进神通", assignedBy: "人力资源部 · 王敏", due: "2026-05-15", progress: 100, status: "done", required: true },
];

/* ---- Exams ---- */
const EXAMS = [
  { id: "e1", title: "信息安全合规年度认证考试", related: "合规制度", questions: 10, minutes: 20, pass: 80, attempts: "2 次机会", status: "todo", due: "2026-06-02" },
  { id: "e2", title: "新员工入职知识结业测验", related: "新人入职", questions: 8, minutes: 15, pass: 70, attempts: "已通过", status: "passed", score: 92, due: "—" },
  { id: "e3", title: "产品认证 · 初级", related: "产品知识", questions: 15, minutes: 30, pass: 75, attempts: "不限", status: "todo", due: "2026-06-30" },
];

const EXAM_QUESTIONS = [
  { id: "q1", type: "single", q: "关于公司机密数据的处理，下列哪种做法是正确的？",
    options: ["将客户名单导出到个人云盘备份","通过企业加密邮箱在内部授权同事间传输","在公共社交平台讨论项目细节","使用未经审批的第三方工具存储合同"], answer: 1 },
  { id: "q2", type: "single", q: "收到一封要求你点击链接并输入账号密码的「IT 系统升级」邮件，你应该？",
    options: ["立即点击并按提示操作","转发给同事让他们也升级","核实发件人身份，疑似钓鱼则上报 IT","直接回复邮件提供账号"], answer: 2 },
  { id: "q3", type: "multi", q: "以下哪些属于个人敏感信息？（多选）",
    options: ["身份证号","公开的公司官网地址","银行卡号","健康医疗记录"], answer: [0,2,3] },
  { id: "q4", type: "single", q: "公司数据分级中，密级最高、泄露影响最严重的是？",
    options: ["公开","内部","秘密","绝密"], answer: 3 },
  { id: "q5", type: "single", q: "离职时关于公司资料的正确处理是？",
    options: ["可以带走自己做的所有文档","按规定移交并删除本地副本","保留客户联系方式以备后用","上传到个人网盘留存"], answer: 1 },
];

/* ---- Community ---- */
const POSTS = [
  { id: "p1", cat: "经验分享", title: "做完《顾问式销售》后，我把 SPIN 用在了真实客户上", author: "陈思远", dept: "销售部", time: "2小时前", replies: 18, likes: 64, hot: true,
    excerpt: "上周跟进一个犹豫了很久的客户，试着用了课程里的 SPIN 四步提问，效果出乎意料……" },
  { id: "p2", cat: "提问求助", title: "新人求助：VPN 配置后还是连不上内网，求大佬", author: "刘晓彤", dept: "研发部", time: "5小时前", replies: 7, likes: 12,
    excerpt: "按照知识库的指引配置完，仍然提示连接超时，是不是还要申请什么权限？" },
  { id: "p3", cat: "课程讨论", title: "《新晋管理者90天》第三章的一对一沟通模板太实用了", author: "周航", dept: "产品部", time: "昨天", replies: 23, likes: 88, hot: true,
    excerpt: "把模板整理成了一页纸，分享给同样刚带团队的朋友们，附上我的批注。" },
  { id: "p4", cat: "经验分享", title: "整理了一份产品 FAQ 速查表，客户常问的都在这", author: "赵琳", dept: "客户成功部", time: "2天前", replies: 31, likes: 102 },
];

/* ---- User / achievements ---- */
const USER = {
  name: "林思齐", dept: "市场部 · 高级专员", avatar: "林",
  points: 2860, level: 7, levelName: "学习达人", nextLevel: 3200,
  streak: 12, learnedHours: 38.5, coursesDone: 9, certs: 3,
};

const BADGES = [
  { id: "b1", name: "学习先锋", desc: "累计学习满 30 小时", got: true, icon: "spark" },
  { id: "b2", name: "全勤之星", desc: "连续学习 7 天", got: true, icon: "flame" },
  { id: "b3", name: "知识达人", desc: "完成 5 门课程", got: true, icon: "book" },
  { id: "b4", name: "考霸", desc: "3 次考试满分", got: false, icon: "trophy" },
  { id: "b5", name: "分享之王", desc: "社区获赞满 100", got: false, icon: "heart" },
  { id: "b6", name: "管理新秀", desc: "完成管理力专题", got: false, icon: "users" },
];

const CERTS = [
  { id: "cert1", name: "新员工入职认证", date: "2026-05-15", org: "神通大讲堂 · 人力资源部" },
  { id: "cert2", name: "信息安全合规认证", date: "2026-01-20", org: "神通大讲堂 · 风控部" },
  { id: "cert3", name: "产品知识初级认证", date: "2025-11-08", org: "神通大讲堂 · 产品部" },
];

const LEADERBOARD = [
  { rank: 1, name: "张文博", dept: "销售部", pts: 4120, me: false },
  { rank: 2, name: "王雅琪", dept: "产品部", pts: 3880, me: false },
  { rank: 3, name: "李慕白", dept: "研发部", pts: 3540, me: false },
  { rank: 4, name: "陈思远", dept: "销售部", pts: 3010, me: false },
  { rank: 5, name: "林思齐", dept: "市场部", pts: 2860, me: true },
  { rank: 6, name: "赵琳", dept: "客户成功部", pts: 2640, me: false },
];

/* admin stats */
const ADMIN_STATS = {
  totalLearners: 1286, activeRate: 78, coursesPublished: 64, avgHours: 12.4,
  completionRate: 71, examPassRate: 86,
  recentCourses: [
    { title: "核心产品全景解析（2026版）", learners: 962, completion: 64, status: "已发布" },
    { title: "信息安全与数据合规红线", learners: 1530, completion: 71, status: "已发布" },
    { title: "新晋管理者的第一个90天", learners: 412, completion: 33, status: "已发布" },
    { title: "2026 销售战法专题", learners: 0, completion: 0, status: "草稿" },
  ],
  deptProgress: [
    { dept: "销售部", rate: 88 }, { dept: "产品部", rate: 81 }, { dept: "研发部", rate: 74 },
    { dept: "市场部", rate: 69 }, { dept: "客户成功部", rate: 92 }, { dept: "职能部门", rate: 58 },
  ],
};

/* ---- Notifications ---- */
const NOTIFICATIONS = [
  { id: "n1", type: "task", title: "新任务指派", text: "产品部为你指派了《核心产品全景解析（2026版）》，6月5日前完成", time: "10 分钟前", unread: true, icon: "task", color: "var(--brand-600)", bg: "var(--brand-50)" },
  { id: "n2", type: "exam", title: "考试即将截止", text: "《信息安全合规年度认证考试》将于 6月2日截止，请尽快完成", time: "2 小时前", unread: true, icon: "exam", color: "var(--orange-500)", bg: "var(--orange-50)" },
  { id: "n3", type: "badge", title: "恭喜获得新勋章", text: "你已解锁「知识达人」勋章，奖励 50 学习积分", time: "5 小时前", unread: true, icon: "trophy", color: "var(--gold-500)", bg: "var(--gold-50)" },
  { id: "n4", type: "community", title: "你的帖子有新回复", text: "陈思远 回复了你在《SPIN销售实战》中的讨论", time: "昨天", unread: false, icon: "chat", color: "var(--green-500)", bg: "var(--green-50)" },
  { id: "n5", type: "course", title: "课程更新提醒", text: "你收藏的《客户成功：从交付到续费》新增了 2 节内容", time: "2 天前", unread: false, icon: "learn", color: "var(--brand-600)", bg: "var(--brand-50)" },
];

Object.assign(window, {
  CATEGORIES, COVER_COLORS, COURSES, KB_TREE, DOC_CONTENT, TASKS, EXAMS,
  EXAM_QUESTIONS, POSTS, USER, BADGES, CERTS, LEADERBOARD, ADMIN_STATS, NOTIFICATIONS,
});
