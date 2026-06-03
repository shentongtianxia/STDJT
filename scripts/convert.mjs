/* One-shot conversion: legacy/*.jsx -> src/{data,components,App,pages/*}.tsx
 * Strategy: keep the prototype's bodies intact; only fix module boundaries
 * (drop window-injection, add ESM imports/exports, alias React-destructured hooks).
 */
import fs from 'node:fs';
import path from 'node:path';

const LEGACY = 'legacy';
const SRC = 'src';

const read = (f) => fs.readFileSync(path.join(LEGACY, f), 'utf8');
const write = (p, c) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, c);
};

// Strip the trailing `Object.assign(window, { ... });` (possibly multi-line) and
// any `const { useState: useXxxState } = React;` aliases.
function stripBoilerplate(src) {
  let out = src;
  out = out.replace(/^\s*const\s*\{\s*useState\s*:\s*\w+\s*\}\s*=\s*React;?\s*$/m, '');
  out = out.replace(/^\s*const\s*\{\s*useState\s*\}\s*=\s*React;?\s*$/m, '');
  out = out.replace(/Object\.assign\(\s*window\s*,\s*\{[\s\S]*?\}\s*\);?\s*$/m, '');
  out = out.replace(/ReactDOM\.createRoot\([\s\S]*?\)\.render\([\s\S]*?\);?\s*$/m, '');
  return out.trimEnd() + '\n';
}

// Rename all `useXxxState(` to `useState(` so we can drop the alias.
function unaliasHooks(src) {
  return src.replace(/\buse[A-Z]\w*State\(/g, 'useState(');
}

const HEADER_PAGE = `// @ts-nocheck
import React, { useState, Fragment } from 'react';
import {
  CATEGORIES, COVER_COLORS, COURSES, KB_TREE, DOC_CONTENT, TASKS, EXAMS,
  EXAM_QUESTIONS, POSTS, USER, BADGES, CERTS, LEADERBOARD, ADMIN_STATS, NOTIFICATIONS,
} from '../data';
import {
  Icon, Avatar, Cover, CourseCard, Sidebar, TopBar, BottomNav,
  getNav, BOTTOM_NAV,
} from '../components';
import { DocReader, resolveDoc, KbPage } from './Kb';
`;

const HEADER_COMPONENTS = `// @ts-nocheck
import React, { useState, Fragment } from 'react';
import { CATEGORIES, COVER_COLORS, USER, NOTIFICATIONS } from './data';
`;

const HEADER_APP = `// @ts-nocheck
import React, { useState, Fragment } from 'react';
import { Icon, Avatar, Sidebar, TopBar, BottomNav } from './components';
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
`;

function exports(names) {
  return `\nexport { ${names.join(', ')} };\n`;
}

// 1) data.ts — add `export` to top-level declarations
{
  let src = read('data.jsx');
  src = src.replace(/Object\.assign\([\s\S]*?\);?\s*$/m, '');
  src = src.replace(/^const\s+/gm, 'export const ');
  write(path.join(SRC, 'data.ts'), src.trimEnd() + '\n');
}

// 2) components.tsx
{
  let src = read('components.jsx');
  src = stripBoilerplate(src);
  src = unaliasHooks(src);
  // Add `export` before each top-level function/const that we want to expose.
  src = src.replace(/^function (Icon|Avatar|Cover|CourseCard|Sidebar|TopBar|BottomNav)\b/gm, 'export function $1');
  src = src.replace(/^const (ICON_PATHS|AV_COLORS|LEARNER_NAV|ADMIN_NAV|BOTTOM_NAV)\b/gm, 'export const $1');
  src = src.replace(/^const getNav\b/m, 'export const getNav');
  write(path.join(SRC, 'components.tsx'), HEADER_COMPONENTS + '\n' + src);
}

// 3) pages — each file becomes src/pages/<Name>.tsx
const PAGES = [
  { in: 'pages-auth.jsx', out: 'Auth.tsx', exports: ['LoginPage'] },
  { in: 'pages-home.jsx', out: 'Home.tsx', exports: ['HomePage'] },
  { in: 'pages-learn.jsx', out: 'Learn.tsx', exports: ['LearnPage'] },
  { in: 'pages-kb.jsx', out: 'Kb.tsx', exports: ['KbPage', 'DocReader', 'resolveDoc'] },
  { in: 'pages-tasks.jsx', out: 'Tasks.tsx', exports: ['TasksPage'] },
  { in: 'pages-exam.jsx', out: 'Exam.tsx', exports: ['ExamPage'] },
  { in: 'pages-me.jsx', out: 'Me.tsx', exports: ['MePage'] },
  { in: 'pages-community.jsx', out: 'Community.tsx', exports: ['CommunityPage'] },
  { in: 'pages-search.jsx', out: 'Search.tsx', exports: ['SearchPage'] },
  { in: 'pages-settings.jsx', out: 'Settings.tsx', exports: ['SettingsPage'] },
  { in: 'pages-admin.jsx', out: 'Admin.tsx', exports: ['AdminDash', 'AdminCourses', 'AdminTasks', 'AdminPeople'] },
  { in: 'pages-admin-editor.jsx', out: 'AdminEditor.tsx', exports: ['CourseEditor'] },
  { in: 'pages-course.jsx', out: 'Course.tsx', exports: ['CoursePage'] },
];

for (const p of PAGES) {
  let src = read(p.in);
  src = stripBoilerplate(src);
  src = unaliasHooks(src);
  // Kb defines DocReader/resolveDoc — don't self-import from itself.
  let header = HEADER_PAGE;
  if (p.out === 'Kb.tsx') {
    header = `// @ts-nocheck
import React, { useState, Fragment } from 'react';
import {
  CATEGORIES, COVER_COLORS, COURSES, KB_TREE, DOC_CONTENT, TASKS, EXAMS,
  EXAM_QUESTIONS, POSTS, USER, BADGES, CERTS, LEADERBOARD, ADMIN_STATS, NOTIFICATIONS,
} from '../data';
import {
  Icon, Avatar, Cover, CourseCard, Sidebar, TopBar, BottomNav,
  getNav, BOTTOM_NAV,
} from '../components';
`;
  }
  const out = header + '\n' + src + exports(p.exports);
  write(path.join(SRC, 'pages', p.out), out);
}

// 4) App.tsx
{
  let src = read('app.jsx');
  src = stripBoilerplate(src);
  src = unaliasHooks(src);
  // Make App the default export.
  src = src.replace(/^function App\b/m, 'function App');
  const out = HEADER_APP + '\n' + src + '\nexport default App;\n';
  write(path.join(SRC, 'App.tsx'), out);
}

console.log('conversion done');
