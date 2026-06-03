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

  http.get('/api/admin/stats', () => ok(ADMIN_STATS)),

  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { account?: string; pwd?: string };
    if (!body?.account) return HttpResponse.json({ message: '请输入账号' }, { status: 400 });
    return ok({ token: 'mock-token', user: USER });
  }),
  http.post('/api/auth/logout', () => new HttpResponse(null, { status: 204 })),
];
