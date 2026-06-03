import React from 'react';
import {
  createBrowserRouter,
  createHashRouter,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useAuth } from './auth';
import Layout from './Layout';
import { LoginPage } from './pages/Auth';
import { HomePage } from './pages/Home';
import { LearnPage } from './pages/Learn';
import { KbPage, DocReader, resolveDoc } from './pages/Kb';
import { TasksPage } from './pages/Tasks';
import { ExamPage } from './pages/Exam';
import { MePage } from './pages/Me';
import { CommunityPage } from './pages/Community';
import { SearchPage } from './pages/Search';
import { SettingsPage } from './pages/Settings';
import { AdminDash, AdminCourses, AdminTasks, AdminPeople } from './pages/Admin';
import { CoursePage } from './pages/Course';
import * as api from './api';
import { useQuery } from './api/useQuery';
import { LoadingScreen, ErrorScreen } from './api/ui';

/** Common navigation callbacks plumbed into existing page components. */
function useNav() {
  const nav = useNavigate();
  return {
    onOpen: (c: any) => {
      nav(`/courses/${c.id}`);
      window.scrollTo(0, 0);
    },
    setRoute: (r: string) => {
      const map: Record<string, string> = {
        home: '/',
        learn: '/learn',
        kb: '/kb',
        tasks: '/tasks',
        exam: '/exam',
        me: '/me',
        community: '/community',
        settings: '/settings',
      };
      nav(map[r] || '/');
      window.scrollTo(0, 0);
    },
    openDoc: (d: any) => {
      const doc = resolveDoc(d);
      nav(`/docs/${doc.id || d.id}`);
      window.scrollTo(0, 0);
    },
  };
}

function RequireAuth() {
  const { authed } = useAuth();
  const loc = useLocation();
  if (!authed) return <Navigate to="/login" state={{ from: loc }} replace />;
  return <Outlet />;
}

function LoginRoute() {
  const { authed, login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  if (authed) {
    const from = (loc.state as any)?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }
  return (
    <LoginPage
      onLogin={(token, user) => {
        login(token, user);
        const from = (loc.state as any)?.from?.pathname || '/';
        nav(from, { replace: true });
      }}
    />
  );
}

function HomeRoute() {
  const { onOpen, setRoute } = useNav();
  return <HomePage onOpen={onOpen} setRoute={setRoute} />;
}
function LearnRoute() {
  const { onOpen } = useNav();
  return <LearnPage onOpen={onOpen} />;
}
function KbRoute() {
  return <KbPage />;
}
function TasksRoute() {
  const { onOpen } = useNav();
  return <TasksPage onOpen={onOpen} />;
}
function ExamRoute() {
  return <ExamPage />;
}
function MeRoute() {
  const { onOpen } = useNav();
  return <MePage onOpen={onOpen} />;
}
function CommunityRoute() {
  return <CommunityPage />;
}
function SearchRoute() {
  const [sp] = useSearchParams();
  const { onOpen, openDoc, setRoute } = useNav();
  const q = sp.get('q') || '';
  const nav = useNavigate();
  return (
    <SearchPage
      query={q}
      onOpen={onOpen}
      openDoc={openDoc}
      setRoute={(r: any) =>
        r && r.type === 'search' ? nav(`/search?q=${encodeURIComponent(r.q)}`) : setRoute(r)
      }
    />
  );
}
function SettingsRoute() {
  return <SettingsPage />;
}
function CourseRoute() {
  const { id } = useParams();
  const { onOpen, setRoute } = useNav();
  const q = useQuery(['course', id], () => api.getCourse(id as string));
  if (q.loading) return <LoadingScreen />;
  if (q.error) {
    // 404 → 退回学习中心
    if ((q.error as any).status === 404) return <Navigate to="/learn" replace />;
    return <ErrorScreen err={q.error} />;
  }
  return <CoursePage course={q.data!} onOpen={onOpen} setRoute={setRoute} />;
}
function DocRoute() {
  const { id } = useParams();
  const nav = useNavigate();
  const q = useQuery(['doc', id], () => api.getDoc(id as string));
  if (q.loading) return <LoadingScreen />;
  if (q.error) {
    if ((q.error as any).status === 404) return <Navigate to="/kb" replace />;
    return <ErrorScreen err={q.error} />;
  }
  return <DocReader doc={q.data!} onBack={() => nav(-1)} />;
}

const createRouter = import.meta.env.VITE_OFFLINE === 'true'
  ? createHashRouter
  : createBrowserRouter;

export const router = createRouter([
  { path: '/login', element: <LoginRoute /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <HomeRoute /> },
          { path: 'learn', element: <LearnRoute /> },
          { path: 'kb', element: <KbRoute /> },
          { path: 'tasks', element: <TasksRoute /> },
          { path: 'exam', element: <ExamRoute /> },
          { path: 'me', element: <MeRoute /> },
          { path: 'community', element: <CommunityRoute /> },
          { path: 'search', element: <SearchRoute /> },
          { path: 'settings', element: <SettingsRoute /> },
          { path: 'admin/dash', element: <AdminDash /> },
          { path: 'admin/courses', element: <AdminCourses /> },
          { path: 'admin/tasks', element: <AdminTasks /> },
          { path: 'admin/people', element: <AdminPeople /> },
          { path: 'courses/:id', element: <CourseRoute /> },
          { path: 'docs/:id', element: <DocRoute /> },
          { path: '*', element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },
]);
