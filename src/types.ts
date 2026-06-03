/** 核心领域类型 — 后续接后端时，按这里的形状定 API DTO。 */

export type CategoryId = 'all' | 'onboard' | 'product' | 'sales' | 'compliance' | 'manage' | 'skill';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  color?: string;
}

export type CourseType = 'video' | 'doc';
export type ChapterType = 'video' | 'doc' | 'quiz';

export interface Chapter {
  t: string;
  d: string;
  type: ChapterType;
  done: boolean;
}

export interface Course {
  id: string;
  cat: Exclude<CategoryId, 'all'>;
  title: string;
  type: CourseType;
  dur: string;
  lessons: number;
  learners: number;
  rating: number;
  instructor: string;
  progress: number;
  required?: boolean;
  desc: string;
  chapters: Chapter[];
}

export interface Doc {
  id: string;
  title: string;
  updated: string;
  author: string;
  views: number;
  tag: string;
}

export interface KbCategory {
  id: string;
  name: string;
  icon: string;
  docs: Doc[];
}

export type DocBlock =
  | { type: 'h'; t: string }
  | { type: 'p'; t: string }
  | { type: 'list'; items: string[] }
  | { type: 'callout'; t: string };

export interface DocFull extends Omit<Doc, 'id'> {
  /** id 由 DOC_CONTENT 的键提供，body 内可省略 */
  id?: string;
  body: DocBlock[];
}

export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Task {
  id: string;
  courseId: string;
  title: string;
  assignedBy: string;
  due: string;
  progress: number;
  status: TaskStatus;
  required: boolean;
}

export type ExamStatus = 'todo' | 'passed' | 'failed';

export interface Exam {
  id: string;
  title: string;
  related: string;
  questions: number;
  minutes: number;
  pass: number;
  attempts: string;
  status: ExamStatus;
  score?: number;
  due: string;
}

export type QuestionType = 'single' | 'multi';

export interface Question {
  id: string;
  type: QuestionType;
  q: string;
  options: string[];
  /** index for single, indices for multi */
  answer: number | number[];
}

export interface Post {
  id: string;
  cat: string;
  title: string;
  author: string;
  dept: string;
  time: string;
  replies: number;
  likes: number;
  hot?: boolean;
  excerpt?: string;
}

export interface User {
  name: string;
  dept: string;
  avatar: string;
  points: number;
  level: number;
  levelName: string;
  nextLevel: number;
  streak: number;
  learnedHours: number;
  coursesDone: number;
  certs: number;
}

export interface Badge {
  id: string;
  name: string;
  desc: string;
  got: boolean;
  icon: string;
}

export interface Cert {
  id: string;
  name: string;
  date: string;
  org: string;
}

export interface LeaderRow {
  rank: number;
  name: string;
  dept: string;
  pts: number;
  me: boolean;
}

export type NotificationType = 'task' | 'exam' | 'badge' | 'community' | 'course';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  text: string;
  time: string;
  unread: boolean;
  icon: string;
  color: string;
  bg: string;
}
