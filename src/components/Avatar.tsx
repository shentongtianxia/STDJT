// @ts-nocheck
import React from 'react';

const AV_COLORS = ['#3A5A86', '#3F6E60', '#7C6242', '#4E4D80', '#3A6470', '#5E5566'];

export function Avatar({ name, size = 36, color }: { name: string; size?: number; color?: string }) {
  const c = color || AV_COLORS[(name?.charCodeAt(0) || 0) % AV_COLORS.length];
  return (
    <div
      className="avatar"
      style={{ width: size, height: size, background: c, fontSize: size * 0.42 }}
    >
      {name?.[0]}
    </div>
  );
}
