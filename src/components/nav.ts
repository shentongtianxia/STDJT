export type NavMode = 'learner' | 'admin';
export interface NavItem {
  id: string;
  name: string;
  icon: string;
  badge?: number;
}

export const LEARNER_NAV: NavItem[] = [
  { id: 'home', name: '首页', icon: 'home' },
  { id: 'learn', name: '学习中心', icon: 'learn' },
  { id: 'kb', name: '知识库', icon: 'kb' },
  { id: 'tasks', name: '任务中心', icon: 'task', badge: 3 },
  { id: 'exam', name: '考试中心', icon: 'exam', badge: 2 },
  { id: 'me', name: '我的学习', icon: 'me' },
  { id: 'community', name: '内部社区', icon: 'chat' },
];

export const ADMIN_NAV: NavItem[] = [
  { id: 'a-dash', name: '数据看板', icon: 'chart' },
  { id: 'a-courses', name: '课程管理', icon: 'learn' },
  { id: 'a-tasks', name: '任务指派', icon: 'task' },
  { id: 'a-people', name: '学员管理', icon: 'users' },
];

export const getNav = (mode: NavMode): NavItem[] => (mode === 'admin' ? ADMIN_NAV : LEARNER_NAV);

export const BOTTOM_NAV: Record<NavMode, string[]> = {
  learner: ['home', 'learn', 'kb', 'tasks', 'me'],
  admin: ['a-dash', 'a-courses', 'a-tasks', 'a-people'],
};
