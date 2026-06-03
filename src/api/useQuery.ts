import { useEffect, useState } from 'react';
import { ApiError } from './client';

export interface QueryState<T> {
  data: T | undefined;
  error: ApiError | Error | undefined;
  loading: boolean;
  refetch: () => void;
}

/** 轻量数据获取 hook。够用即可；以后要做缓存/失效再换 TanStack Query。
 *
 * 调用方负责把所有作用于 fn 内闭包的变量都放进 key 数组里，hook 不再
 * 通过 ref 跟踪 fn 身份。
 */
export function useQuery<T>(key: unknown[], fn: () => Promise<T>): QueryState<T> {
  const [data, setData] = useState<T | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(undefined);
    fn()
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // 故意忽略 fn —— 见上方注释，调用方用 key 数组声明依赖。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...key, tick]);

  return { data, error, loading, refetch: () => setTick((t) => t + 1) };
}
