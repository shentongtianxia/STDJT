import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { http, ApiError } from './client';
import { session, onUnauthorized } from '../session';

const fetchSpy = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchSpy);
  fetchSpy.mockReset();
  session.clear();
});
afterEach(() => vi.unstubAllGlobals());

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
}

describe('http client', () => {
  it('GET parses JSON body', async () => {
    fetchSpy.mockResolvedValueOnce(jsonResponse({ ok: true }));
    const r = await http.get<{ ok: boolean }>('/foo');
    expect(r).toEqual({ ok: true });
    expect(fetchSpy).toHaveBeenCalledWith('/api/foo', expect.objectContaining({}));
  });

  it('attaches Authorization when a token is present', async () => {
    session.setToken('the-token');
    fetchSpy.mockResolvedValueOnce(jsonResponse({}));
    await http.get('/x');
    const [, init] = fetchSpy.mock.calls[0];
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer the-token');
  });

  it('omits Authorization when no token', async () => {
    fetchSpy.mockResolvedValueOnce(jsonResponse({}));
    await http.get('/x');
    const [, init] = fetchSpy.mock.calls[0];
    expect((init.headers as Record<string, string>).Authorization).toBeUndefined();
  });

  it('POST serialises body and uses POST method', async () => {
    fetchSpy.mockResolvedValueOnce(jsonResponse({ id: 1 }));
    await http.post('/x', { a: 1 });
    const [, init] = fetchSpy.mock.calls[0];
    expect(init.method).toBe('POST');
    expect(init.body).toBe(JSON.stringify({ a: 1 }));
  });

  it('returns undefined for 204', async () => {
    fetchSpy.mockResolvedValueOnce(new Response(null, { status: 204 }));
    const r = await http.delete<void>('/x');
    expect(r).toBeUndefined();
  });

  it('on 401: clears session, fires unauthorized, throws ApiError(401)', async () => {
    session.setToken('expired');
    const handler = vi.fn();
    onUnauthorized(handler);
    fetchSpy.mockResolvedValueOnce(new Response(null, { status: 401 }));

    await expect(http.get('/x')).rejects.toMatchObject({ status: 401 });
    expect(session.getToken()).toBeNull();
    expect(handler).toHaveBeenCalled();
  });

  it('throws ApiError with server message on 4xx/5xx', async () => {
    fetchSpy.mockResolvedValueOnce(
      jsonResponse({ message: 'bad input' }, { status: 400 }),
    );
    try {
      await http.get('/x');
      throw new Error('should not reach');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).status).toBe(400);
      expect((e as ApiError).message).toBe('bad input');
    }
  });
});
