/** 离线模式：把 /api/* 请求拦在 window.fetch 上，直接返回 data.ts 的内存
 *  数据。SPA 单文件分发用，不依赖 service worker、不依赖后端。
 *
 *  逻辑与 src/mocks/handlers.ts 对齐；handlers 改动时记得同步这里。
 */
import {
  CATEGORIES, COURSES, KB_TREE, DOC_CONTENT, TASKS, EXAMS, EXAM_QUESTIONS,
  POSTS, USER, BADGES, CERTS, LEADERBOARD, NOTIFICATIONS, ADMIN_STATS,
} from '../data';

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
const notFound = () => json({ message: 'Not found' }, 404);
const noContent = () => new Response(null, { status: 204 });

type Handler = (
  url: URL,
  init: RequestInit | undefined,
  params: Record<string, string>,
) => Promise<Response> | Response;

interface Route {
  method: string;
  pattern: RegExp;
  keys: string[];
  handle: Handler;
}

function compile(path: string): { pattern: RegExp; keys: string[] } {
  const keys: string[] = [];
  const re = path.replace(/:([a-zA-Z]+)/g, (_, k) => {
    keys.push(k);
    return '([^/]+)';
  });
  return { pattern: new RegExp(`^${re}$`), keys };
}

function route(method: string, path: string, handle: Handler): Route {
  const { pattern, keys } = compile(path);
  return { method, pattern, keys, handle };
}

const ROUTES: Route[] = [
  route('GET', '/api/categories', () => json(CATEGORIES)),
  route('GET', '/api/courses', () => json(COURSES)),
  route('GET', '/api/courses/:id', (_u, _i, p) => {
    const c = COURSES.find((x) => x.id === p.id);
    return c ? json(c) : notFound();
  }),
  route('POST', '/api/courses/:id/chapters/:idx/done', (_u, _i, p) => {
    const c = COURSES.find((x) => x.id === p.id);
    return c ? json(c) : notFound();
  }),
  route('GET', '/api/kb/categories', () => json(KB_TREE)),
  route('GET', '/api/kb/docs/:id', (_u, _i, p) => {
    const d = DOC_CONTENT[p.id];
    return d ? json({ ...d, id: p.id }) : notFound();
  }),
  route('GET', '/api/tasks', () => json(TASKS)),
  route('GET', '/api/exams', () => json(EXAMS)),
  route('GET', '/api/exams/:id/questions', () => json(EXAM_QUESTIONS)),
  route('POST', '/api/exams/:id/submit', async (_u, init) => {
    const body = init?.body ? JSON.parse(String(init.body)) : {};
    const answers: Record<string, number | number[]> = body.answers || {};
    let right = 0;
    for (const q of EXAM_QUESTIONS) {
      const a = answers[q.id];
      if (Array.isArray(q.answer)) {
        const set = new Set(q.answer);
        if (Array.isArray(a) && a.length === set.size && a.every((v) => set.has(v))) right++;
      } else if (a === q.answer) right++;
    }
    const total = EXAM_QUESTIONS.length;
    const score = Math.round((right / total) * 100);
    return json({ score, passed: score >= 60, rightCount: right, total });
  }),
  route('GET', '/api/posts', () => json(POSTS)),
  route('POST', '/api/posts', async (_u, init) => {
    const body = init?.body ? JSON.parse(String(init.body)) : {};
    if (!body.title) return json({ message: '请填写标题' }, 400);
    return json({
      id: 'p' + Date.now(),
      cat: body.cat || '经验分享',
      title: body.title,
      author: USER.name,
      dept: USER.dept,
      time: '刚刚',
      replies: 0,
      likes: 0,
      excerpt: body.excerpt,
    });
  }),
  route('GET', '/api/me', () => json(USER)),
  route('GET', '/api/me/badges', () => json(BADGES)),
  route('GET', '/api/me/certs', () => json(CERTS)),
  route('GET', '/api/leaderboard', () => json(LEADERBOARD)),
  route('GET', '/api/notifications', () => json(NOTIFICATIONS)),
  route('POST', '/api/notifications/:id/read', () => noContent()),
  route('POST', '/api/notifications/read-all', () => noContent()),
  route('GET', '/api/admin/stats', () => json(ADMIN_STATS)),
  route('POST', '/api/admin/courses', async (_u, init) => {
    const body = init?.body ? JSON.parse(String(init.body)) : {};
    return json({ ...COURSES[0], id: 'c' + Date.now(), title: body.title || '新课程', progress: 0 });
  }),
  route('PUT', '/api/admin/courses/:id', async (_u, init, p) => {
    const body = init?.body ? JSON.parse(String(init.body)) : {};
    const c = COURSES.find((x) => x.id === p.id);
    return c ? json({ ...c, title: body.title || c.title }) : notFound();
  }),
  route('POST', '/api/admin/tasks', async (_u, init) => {
    const body = init?.body ? JSON.parse(String(init.body)) : {};
    return json({
      id: 't' + Date.now(),
      courseId: body.courseId || '',
      title: COURSES.find((c) => c.id === body.courseId)?.title || '新任务',
      assignedBy: USER.name,
      due: body.due || '',
      progress: 0,
      status: 'doing',
      required: !!body.required,
    });
  }),
  route('POST', '/api/auth/login', async (_u, init) => {
    const body = init?.body ? JSON.parse(String(init.body)) : {};
    if (!body.account) return json({ message: '请输入账号' }, 400);
    return json({ token: 'offline-token', user: USER });
  }),
  route('POST', '/api/auth/logout', () => noContent()),
];

function dispatch(method: string, url: URL, init: RequestInit | undefined): Promise<Response> | Response {
  for (const r of ROUTES) {
    if (r.method !== method) continue;
    const m = r.pattern.exec(url.pathname);
    if (!m) continue;
    const params: Record<string, string> = {};
    r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
    return r.handle(url, init, params);
  }
  return notFound();
}

/** 安装 fetch 拦截。多次调用幂等。 */
export function installOfflineFetch() {
  const w = window as Window & { __stdjtOfflineFetch?: boolean };
  if (w.__stdjtOfflineFetch) return;
  w.__stdjtOfflineFetch = true;
  const original = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const raw = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    if (raw.startsWith('/api/') || raw.includes('/api/')) {
      const url = new URL(raw, window.location.origin);
      const method = (init?.method || 'GET').toUpperCase();
      return dispatch(method, url, init);
    }
    return original(input as RequestInfo, init);
  };
}
