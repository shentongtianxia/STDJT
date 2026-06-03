# 神通大讲堂

公司内部培训与知识库平台的前端实现。Vite + React 18 + TypeScript，MSW 提供前端 mock，可零改动切到真后端。

## 快速上手

```bash
npm install
cp .env.example .env.local   # 可选；不改也能跑 mock
npm run dev                  # http://localhost:5173
```

| 命令 | 用途 |
|---|---|
| `npm run dev` | 启动 Vite dev server（默认开启 MSW） |
| `npm run build` | tsc 类型检查 + Vite 生产构建 |
| `npm run preview` | 预览 `dist/` |
| `npm run lint` | ESLint |
| `npm run format` | Prettier 写回 |

## 目录结构

```
src/
  api/          # API 契约层（client / 端点 / useQuery / ui 兜底）
  components/   # 共享组件（Icon/Avatar/Sidebar/TopBar/...）
  mocks/        # MSW handlers + browser worker setup
  pages/        # 13 个页面：Auth/Home/Learn/Kb/Tasks/Exam/Me/
                # Community/Search/Settings/Admin/AdminEditor/Course
  App.tsx       # AuthProvider + RouterProvider 壳
  Layout.tsx    # Sidebar + TopBar + BottomNav 容器
  routes.tsx    # React Router 路由表 + 鉴权 gate + 路由包装
  auth.tsx      # 登录态 Context（token + user，持久化到 localStorage）
  session.ts    # http client 读 token、401 触发登出的桥
  data.ts       # 静态参考数据（分类配色、降级用占位）
  types.ts      # 全部领域类型
  styles.css    # 全局样式
legacy/         # 原始 HTML/JSX 原型（归档参考）
public/
  mockServiceWorker.js  # MSW 注入脚本（npx msw init 生成，勿手改）
scripts/        # 一次性迁移脚本，留作回放
.github/workflows/ci.yml  # push/PR 跑 lint + build
```

## API 契约

后端实现请按 `src/api/index.ts` 的函数签名做。每个函数即一个端点：

| 函数 | 方法 + 路径 | 用途 |
|---|---|---|
| `listCourses` | `GET /courses` | 课程列表 |
| `getCourse` | `GET /courses/:id` | 课程详情 |
| `markChapterDone` | `POST /courses/:id/chapters/:idx/done` | 学完某节 |
| `listKbCategories` | `GET /kb/categories` | 知识库目录 |
| `getDoc` | `GET /kb/docs/:id` | 文档详情 |
| `listTasks` | `GET /tasks` | 我的任务 |
| `listExams` | `GET /exams` | 考试列表 |
| `listExamQuestions` | `GET /exams/:id/questions` | 试题 |
| `submitExam` | `POST /exams/:id/submit` | 交卷 → 返回 `{ score, passed }` |
| `listPosts` | `GET /posts` | 社区帖 |
| `createPost` | `POST /posts` | 发帖 |
| `getMe` / `listMyBadges` / `listMyCerts` | `GET /me/*` | 个人 |
| `getLeaderboard` | `GET /leaderboard` | 积分榜 |
| `listNotifications` / `markNotificationRead` / `markAllNotificationsRead` | `GET/POST /notifications/...` | 通知 |
| `getAdminStats` | `GET /admin/stats` | 管理端数据看板 |
| `createCourse` / `updateCourse` | `POST/PUT /admin/courses[/:id]` | 课程编辑 |
| `assignTask` | `POST /admin/tasks` | 任务指派 |
| `login` / `logout` | `POST /auth/login` / `POST /auth/logout` | 登录登出 |

返回结构详见 `src/types.ts`。错误用标准 HTTP 状态码 + `{ message: string }` body；401 会自动登出 + 跳登录页。

所有 `GET` 请求会带 `Authorization: Bearer <token>` 头（除非未登录）。

## 切换 mock vs 真后端

| 场景 | `.env.local` |
|---|---|
| dev 本地 mock（默认） | `VITE_USE_MOCK=true` 或不填 |
| 直连真后端 | `VITE_USE_MOCK=false` + `VITE_API_BASE_URL=https://...` |

也可以逐个端点切：在 `src/mocks/handlers.ts` 删掉对应 handler，那个端点就直连后端，其它仍走 mock。

## 测试约定

- 鉴权：登录后 token + user 存 `localStorage.stdjt.token / stdjt.user`
- 退出登录：调 `api.logout` 同时清理本地
- 全局 401：任何接口收到 401 会清理本地登录态并把用户带回 `/login`

## CI

`.github/workflows/ci.yml`：push 和 PR 都会跑 `npm ci && npm run lint && npm run build`，Node 22 + npm 缓存。
