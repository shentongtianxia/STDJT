/** 公用 loading / error 兜底视图，给所有页面用同一份样式。 */
import React from 'react';
import type { QueryState } from './useQuery';

export function LoadingScreen({ msg = '加载中…' }: { msg?: string }) {
  return (
    <div className="content fade-up">
      <div className="card muted" style={{ padding: 80, textAlign: 'center' }}>
        {msg}
      </div>
    </div>
  );
}

export function ErrorScreen({ err }: { err: Error }) {
  return (
    <div className="content fade-up">
      <div className="card" style={{ padding: 60, textAlign: 'center' }}>
        <div style={{ color: 'var(--orange-500)', marginBottom: 12 }}>
          加载失败：{err.message}
        </div>
        <button className="btn btn-primary" onClick={() => location.reload()}>
          重试
        </button>
      </div>
    </div>
  );
}

/** 聚合多个 useQuery，返回 loading/error 第一个不为空者。 */
export function aggregate(qs: QueryState<unknown>[]) {
  return {
    loading: qs.some((q) => q.loading),
    error: qs.find((q) => q.error)?.error,
  };
}
