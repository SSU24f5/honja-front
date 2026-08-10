const BASE_URL = 'http://192.168.0.11:8080';

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  data: T;
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json: ApiResponse<T> = await res.json();
  if (!res.ok || !json.isSuccess) {
    throw new Error(json.message || '요청에 실패했습니다.');
  }
  return json.data;
}

export async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const json: ApiResponse<T> = await res.json();
  if (!res.ok || !json.isSuccess) {
    throw new Error(json.message || '요청에 실패했습니다.');
  }
  return json.data;
}