import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useQuery } from './useQuery';

describe('useQuery', () => {
  it('starts loading, resolves with data', async () => {
    const fn = vi.fn().mockResolvedValue({ a: 1 });
    const { result } = renderHook(() => useQuery(['k'], fn));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeUndefined();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual({ a: 1 });
    expect(result.current.error).toBeUndefined();
  });

  it('captures error when the fetch rejects', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useQuery(['k'], fn));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error?.message).toBe('boom');
    expect(result.current.data).toBeUndefined();
  });

  it('refetch re-runs fn and surfaces new data', async () => {
    let n = 0;
    const fn = vi.fn().mockImplementation(() => Promise.resolve(++n));
    const { result } = renderHook(() => useQuery(['k'], fn));
    await waitFor(() => expect(result.current.data).toBe(1));

    act(() => result.current.refetch());
    await waitFor(() => expect(result.current.data).toBe(2));
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('re-fires when key changes', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    const { rerender } = renderHook(({ id }) => useQuery([id], fn), {
      initialProps: { id: 'a' },
    });
    await waitFor(() => expect(fn).toHaveBeenCalledTimes(1));
    rerender({ id: 'b' });
    await waitFor(() => expect(fn).toHaveBeenCalledTimes(2));
  });
});
