/** Per-page migration: blanket-import header -> targeted imports + useQuery preamble.
 * Idempotent: skips files whose header doesn't match the legacy shape.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'src/pages';

// resource name -> { call, default } where default is a placeholder used
// while the request is in flight (so we never early-return after useState).
const RES = {
  COURSES:        { call: 'api.listCourses',        def: '[]' },
  TASKS:          { call: 'api.listTasks',          def: '[]' },
  EXAMS:          { call: 'api.listExams',          def: '[]' },
  EXAM_QUESTIONS: { call: "() => api.listExamQuestions('e1')", def: '[]' },
  POSTS:          { call: 'api.listPosts',          def: '[]' },
  USER:           { call: 'api.getMe',              def: "{ name: '', dept: '', avatar: '', points: 0, level: 0, levelName: '', nextLevel: 0, streak: 0, learnedHours: 0, coursesDone: 0, certs: 0 }" },
  BADGES:         { call: 'api.listMyBadges',       def: '[]' },
  CERTS:          { call: 'api.listMyCerts',        def: '[]' },
  LEADERBOARD:    { call: 'api.getLeaderboard',     def: '[]' },
  ADMIN_STATS:    { call: 'api.getAdminStats',      def: '{ totalLearners: 0, activeRate: 0, coursesPublished: 0, avgHours: 0, completionRate: 0, examPassRate: 0, recentCourses: [], deptProgress: [] }' },
  NOTIFICATIONS:  { call: 'api.listNotifications',  def: '[]' },
  KB_TREE:        { call: 'api.listKbCategories',   def: '[]' },
};

// Static refs we keep importing directly from data.ts (they are reference
// material for UI styling, not user-state).
const STATIC = new Set(['CATEGORIES', 'COVER_COLORS', 'DOC_CONTENT']);

const PAGES = [
  { file: 'Learn.tsx',     fn: 'LearnPage',     dyn: ['COURSES'], stat: ['CATEGORIES'] },
  { file: 'Kb.tsx',        fn: 'KbPage',        dyn: ['KB_TREE'], stat: ['DOC_CONTENT'] },
  { file: 'Tasks.tsx',     fn: 'TasksPage',     dyn: ['TASKS', 'COURSES'], stat: [] },
  { file: 'Exam.tsx',      fn: 'ExamPage',      dyn: ['EXAMS'], stat: [] },
  { file: 'Me.tsx',        fn: 'MePage',        dyn: ['COURSES', 'BADGES', 'CERTS', 'USER'], stat: ['CATEGORIES'] },
  { file: 'Community.tsx', fn: 'CommunityPage', dyn: ['POSTS', 'LEADERBOARD'], stat: [] },
  { file: 'Search.tsx',    fn: 'SearchPage',    dyn: ['COURSES', 'KB_TREE'], stat: ['CATEGORIES'] },
  { file: 'Settings.tsx',  fn: 'SettingsPage',  dyn: ['USER'], stat: [] },
  { file: 'Admin.tsx',     fn: 'AdminDash',     dyn: ['ADMIN_STATS', 'COURSES'], stat: ['CATEGORIES', 'COVER_COLORS'] },
];

const HEADER_RE =
  /^\/\/ @ts-nocheck\nimport React[^\n]*\n(?:import \{[\s\S]*?\n} from '\.\.\/data';\n)(?:import \{[\s\S]*?\n} from '\.\.\/components';\n)(?:import \{[^}]*\} from '\.\/Kb';\n)?/m;

function buildHeader(p) {
  const staticImport = p.stat.length
    ? `import { ${p.stat.join(', ')} } from '../data';\n`
    : '';
  return (
    `// @ts-nocheck\n` +
    `import React, { useState, Fragment } from 'react';\n` +
    `import { Icon, Avatar, Cover, CourseCard } from '../components';\n` +
    staticImport +
    `import { useQuery } from '../api/useQuery';\n` +
    `import * as api from '../api';\n`
  );
}

/** 数据 hook 必须先于早返调用，所以用"默认值"模式：拉取期间 page 渲染空
 *  列表 / 占位对象，不打断 useState 等后续 hook 的调用顺序。 */
function buildPreamble(p) {
  return p.dyn
    .map(
      (n) =>
        `  const ${n} = useQuery(['${n.toLowerCase()}'], ${RES[n].call}).data || ${RES[n].def};`,
    )
    .join('\n') + '\n';
}

for (const p of PAGES) {
  const f = path.join(DIR, p.file);
  let src = fs.readFileSync(f, 'utf8');
  if (!src.includes("from '../data';")) {
    console.log(`skip ${p.file}: header already migrated`);
    continue;
  }
  // Replace the legacy header (lines 1..N up to and incl. ./Kb import if present).
  const m = src.match(HEADER_RE);
  if (!m) {
    console.log(`skip ${p.file}: header pattern did not match`);
    continue;
  }
  src = src.replace(HEADER_RE, buildHeader(p));

  // Inject the preamble at the top of the page function body.
  // Match through the parameter list's closing `)` then the body's `{`.
  const fnRe = new RegExp(`(function ${p.fn}\\b\\s*\\([^)]*\\)\\s*\\{)`);
  if (!fnRe.test(src)) {
    console.log(`skip ${p.file}: cannot find ${p.fn} signature`);
    continue;
  }
  src = src.replace(fnRe, `$1\n${buildPreamble(p)}`);
  fs.writeFileSync(f, src);
  console.log(`migrated ${p.file}`);
}
