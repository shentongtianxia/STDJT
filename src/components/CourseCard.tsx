// @ts-nocheck
import React from 'react';
import { Icon } from './icons';
import { Cover } from './Cover';

export function CourseCard({ course, onOpen }: { course: any; onOpen: (c: any) => void }) {
  return (
    <div className="card course-card" onClick={() => onOpen(course)}>
      <Cover course={course} />
      <div className="cc-body">
        <div className="cc-title">{course.title}</div>
        <div className="cc-meta">
          <span>{course.lessons} 节</span>
          <i className="dotsep" />
          <span>{course.learners.toLocaleString()} 人在学</span>
        </div>
        {course.progress > 0 ? (
          <div style={{ marginTop: 11 }}>
            <div className="progress">
              <i style={{ width: course.progress + '%' }} />
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-500)', marginTop: 6 }}>
              {course.progress === 100 ? '已完成 · 可复习' : `已学 ${course.progress}%`}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 11, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="tag gray" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="star" style={{ width: 13, height: 13, color: 'var(--gold-400)' }} />
              {course.rating}
            </span>
            {course.required && <span className="tag orange">必修</span>}
          </div>
        )}
      </div>
    </div>
  );
}
