/** API contract — 所有后端调用都从这里出。
 *
 * 命名约定：
 *   list*   → 列表（数组）
 *   get*    → 单个对象
 *   create* / update* / delete* → 写操作
 */
import { http } from './client';
import type {
  Category, Course, KbCategory, DocFull, Task, Exam, Question, Post,
  User, Badge, Cert, LeaderRow, Notification,
} from '../types';

export interface AdminStats {
  totalLearners: number;
  activeRate: number;
  coursesPublished: number;
  avgHours: number;
  completionRate: number;
  examPassRate: number;
  recentCourses: Array<{ title: string; learners: number; completion: number; status: string }>;
  deptProgress: Array<{ dept: string; rate: number }>;
}

/* -- catalogs ------------------------------------------------- */
export const listCategories = () => http.get<Category[]>('/categories');
export const listCourses = () => http.get<Course[]>('/courses');
export const getCourse = (id: string) => http.get<Course>(`/courses/${id}`);

/* -- knowledge base ------------------------------------------- */
export const listKbCategories = () => http.get<KbCategory[]>('/kb/categories');
export const getDoc = (id: string) => http.get<DocFull>(`/kb/docs/${id}`);

/* -- tasks / exams -------------------------------------------- */
export const listTasks = () => http.get<Task[]>('/tasks');
export const listExams = () => http.get<Exam[]>('/exams');
export const listExamQuestions = (examId: string) =>
  http.get<Question[]>(`/exams/${examId}/questions`);

/* -- community ------------------------------------------------ */
export const listPosts = () => http.get<Post[]>('/posts');

/* -- me / profile --------------------------------------------- */
export const getMe = () => http.get<User>('/me');
export const listMyBadges = () => http.get<Badge[]>('/me/badges');
export const listMyCerts = () => http.get<Cert[]>('/me/certs');
export const getLeaderboard = () => http.get<LeaderRow[]>('/leaderboard');
export const listNotifications = () => http.get<Notification[]>('/notifications');

/* -- admin ---------------------------------------------------- */
export const getAdminStats = () => http.get<AdminStats>('/admin/stats');

/* -- auth ----------------------------------------------------- */
export interface LoginInput {
  account: string;
  pwd: string;
}
export interface LoginResult {
  token: string;
  user: User;
}
export const login = (input: LoginInput) => http.post<LoginResult>('/auth/login', input);
export const logout = () => http.post<void>('/auth/logout');
