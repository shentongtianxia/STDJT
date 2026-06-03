// @ts-nocheck
import React from 'react';
import { Icon } from './icons';
import { CATEGORIES, COVER_COLORS } from '../data';

export function Cover({ course, showPlay = true }: { course: any; showPlay?: boolean }) {
  const cat = CATEGORIES.find((c) => c.id === course.cat);
  const isDoc = course.type === 'doc';
  return (
    <div className="cover" style={{ background: COVER_COLORS[course.cat] }}>
      <Icon name={isDoc ? 'doc' : cat?.icon || 'play'} className="cover-ic" />
      <span className="cover-cat">{cat?.name}</span>
      <span className="cover-dur">
        <Icon name={isDoc ? 'doc' : 'clock'} />
        {course.dur}
      </span>
      {showPlay && !isDoc && (
        <div className="play-overlay">
          <Icon name="play" />
        </div>
      )}
    </div>
  );
}
