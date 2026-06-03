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

/** 标记某节课已学完；返回更新后的整门课程，便于前端同步进度。 */
export const markChapterDone = (courseId: string, chapterIndex: number) =>
  http.post<Course>(`/courses/${courseId}/chapters/${chapterIndex}/done`);

/* -- knowledge base ------------------------------------------- */
export const listKbCategories = () => http.get<KbCategory[]>('/kb/categories');
export const getDoc = (id: string) => http.get<DocFull>(`/kb/docs/${id}`);

/* -- tasks / exams -------------------------------------------- */
export const listTasks = () => http.get<Task[]>('/tasks');
export const listExams = () => http.get<Exam[]>('/exams');
export const listExamQuestions = (examId: string) =>
  http.get<Question[]>(`/exams/${examId}/questions`);

export interface ExamSubmission {
  /** key = question id, value = 单选下标 / 多选下标数组 */
  answers: Record<string, number | number[]>;
}
export interface ExamResult {
  score: number;
  passed: boolean;
  rightCount: number;
  total: number;
}
export const submitExam = (examId: string, body: ExamSubmission) =>
  http.post<ExamResult>(`/exams/${examId}/submit`, body);

/* -- community ------------------------------------------------ */
export const listPosts = () => http.get<Post[]>('/posts');

export interface CreatePostInput {
  cat: string;
  title: string;
  excerpt?: string;
}
export const createPost = (input: CreatePostInput) => http.post<Post>('/posts', input);

/* -- me / profile --------------------------------------------- */
export const getMe = () => http.get<User>('/me');
export const listMyBadges = () => http.get<Badge[]>('/me/badges');
export const listMyCerts = () => http.get<Cert[]>('/me/certs');
export const getLeaderboard = () => http.get<LeaderRow[]>('/leaderboard');
export const listNotifications = () => http.get<Notification[]>('/notifications');
export const markNotificationRead = (id: string) =>
  http.post<void>(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => http.post<void>('/notifications/read-all');

/* -- admin ---------------------------------------------------- */
export const getAdminStats = () => http.get<AdminStats>('/admin/stats');

export interface CourseDraft {
  title: string;
  cat: string;
  instructor: string;
  desc: string;
  required: boolean;
  chapters: Array<{ id?: string; t: string; type: string; d: string }>;
  questions?: Array<{ id?: string; type: string; q: string; options: string[]; answer: number | number[] }>;
}
export const createCourse = (input: CourseDraft) => http.post<Course>('/admin/courses', input);
export const updateCourse = (id: string, input: CourseDraft) =>
  http.put<Course>(`/admin/courses/${id}`, input);

export interface AssignTaskInput {
  courseId: string;
  target: string;
  due: string;
  required: boolean;
}
export const assignTask = (input: AssignTaskInput) => http.post<Task>('/admin/tasks', input);

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
