/** MSW handlers — 把 src/data.ts 的内存数据暴露成 REST 接口。
 *
 * 后端接好以后，删掉对应 handler 即可让前端直连真服务。
 */
import { http, HttpResponse } from 'msw';
import {
  CATEGORIES, COURSES, KB_TREE, DOC_CONTENT, TASKS, EXAMS, EXAM_QUESTIONS,
  POSTS, USER, BADGES, CERTS, LEADERBOARD, NOTIFICATIONS, ADMIN_STATS,
} from '../data';

const ok = <T>(d: T) => HttpResponse.json(d);
const notFound = (msg = 'Not found') => HttpResponse.json({ message: msg }, { status: 404 });

export const handlers = [
  http.get('/api/categories', () => ok(CATEGORIES)),

  http.get('/api/courses', () => ok(COURSES)),
  http.get('/api/courses/:id', ({ params }) => {
    const c = COURSES.find((x) => x.id === params.id);
    return c ? ok(c) : notFound();
  }),

  http.get('/api/kb/categories', () => ok(KB_TREE)),
  http.get('/api/kb/docs/:id', ({ params }) => {
    const d = DOC_CONTENT[params.id as string];
    return d ? ok({ ...d, id: params.id }) : notFound();
  }),

  http.get('/api/tasks', () => ok(TASKS)),

  http.get('/api/exams', () => ok(EXAMS)),
  http.get('/api/exams/:id/questions', () => ok(EXAM_QUESTIONS)),

  http.get('/api/posts', () => ok(POSTS)),

  http.get('/api/me', () => ok(USER)),
  http.get('/api/me/badges', () => ok(BADGES)),
  http.get('/api/me/certs', () => ok(CERTS)),
  http.get('/api/leaderboard', () => ok(LEADERBOARD)),
  http.get('/api/notifications', () => ok(NOTIFICATIONS)),
  http.post('/api/notifications/:id/read', () => new HttpResponse(null, { status: 204 })),
  http.post('/api/notifications/read-all', () => new HttpResponse(null, { status: 204 })),

  http.get('/api/admin/stats', () => ok(ADMIN_STATS)),

  http.post('/api/courses/:id/chapters/:idx/done', ({ params }) => {
    const c = COURSES.find((x) => x.id === params.id);
    return c ? ok(c) : notFound();
  }),

  http.post('/api/exams/:id/submit', async ({ request }) => {
    const body = (await request.json()) as { answers?: Record<string, number | number[]> };
    const answers = body?.answers || {};
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
    return ok({ score, passed: score >= 60, rightCount: right, total });
  }),

  http.post('/api/posts', async ({ request }) => {
    const body = (await request.json()) as { cat?: string; title?: string; excerpt?: string };
    if (!body?.title) return HttpResponse.json({ message: '请填写标题' }, { status: 400 });
    return ok({
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

  http.post('/api/admin/courses', async ({ request }) => {
    const body = (await request.json()) as { title?: string };
    return ok({ ...COURSES[0], id: 'c' + Date.now(), title: body?.title || '新课程', progress: 0 });
  }),
  http.put('/api/admin/courses/:id', async ({ params, request }) => {
    const body = (await request.json()) as { title?: string };
    const c = COURSES.find((x) => x.id === params.id);
    return c ? ok({ ...c, title: body?.title || c.title }) : notFound();
  }),
  http.post('/api/admin/tasks', async ({ request }) => {
    const body = (await request.json()) as { courseId?: string; due?: string; required?: boolean };
    return ok({
      id: 't' + Date.now(),
      courseId: body?.courseId || '',
      title: COURSES.find((c) => c.id === body?.courseId)?.title || '新任务',
      assignedBy: USER.name,
      due: body?.due || '',
      progress: 0,
      status: 'doing',
      required: !!body?.required,
    });
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { account?: string; pwd?: string };
    if (!body?.account) return HttpResponse.json({ message: '请输入账号' }, { status: 400 });
    return ok({ token: 'mock-token', user: USER });
  }),
  http.post('/api/auth/logout', () => new HttpResponse(null, { status: 204 })),
];
