import { useAuthStore } from '@/stores/auth-store';

export function getApiBaseUrl(): string {
  return process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  data: T;
}

function getHeaders(): Record<string, string> {
  const token = useAuthStore.getState().accessToken;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  const baseUrl = getApiBaseUrl();
  console.log(`[API POST] ${baseUrl}${path}`);
  if (body !== undefined) {
    console.log(`[API POST Body ${path}]:\n`, JSON.stringify(body, null, 2));
  }
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  const json: ApiResponse<T> = await res.json();
  console.log(`[API POST Response ${path}]:\n`, JSON.stringify(json, null, 2));
  if (!res.ok || !json.isSuccess) {
    throw new Error(json.message || '요청에 실패했습니다.');
  }
  return json.data;
}

export async function get<T>(path: string): Promise<T> {
  const baseUrl = getApiBaseUrl();
  console.log(`[API GET] ${baseUrl}${path}`);
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  const json: ApiResponse<T> = await res.json();
  console.log(`[API GET Response ${path}]:\n`, JSON.stringify(json, null, 2));
  if (!res.ok || !json.isSuccess) {
    throw new Error(json.message || '요청에 실패했습니다.');
  }
  return json.data;
}

export async function postRaw<T>(path: string, body: unknown): Promise<T> {
  const baseUrl = getApiBaseUrl();
  console.log(`[API POST RAW] ${baseUrl}${path}`);
  if (body !== undefined) {
    console.log(`[API POST RAW Body ${path}]:\n`, JSON.stringify(body, null, 2));
  }
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  const json = await res.json();
  console.log(`[API POST RAW Response ${path}]:\n`, JSON.stringify(json, null, 2));
  if (!res.ok) {
    throw new Error(json.message || '요청에 실패했습니다.');
  }
  return json as T;
}

export async function put<T>(path: string, body: unknown): Promise<T> {
  const baseUrl = getApiBaseUrl();
  console.log(`[API PUT] ${baseUrl}${path}`);
  if (body !== undefined) {
    console.log(`[API PUT Body ${path}]:\n`, JSON.stringify(body, null, 2));
  }
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  const json: ApiResponse<T> = await res.json();
  console.log(`[API PUT Response ${path}]:\n`, JSON.stringify(json, null, 2));
  if (!res.ok || !json.isSuccess) {
    throw new Error(json.message || '요청에 실패했습니다.');
  }
  return json.data;
}

export async function del<T>(path: string): Promise<T> {
  const baseUrl = getApiBaseUrl();
  console.log(`[API DELETE] ${baseUrl}${path}`);
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  const json: ApiResponse<T> = await res.json();
  console.log(`[API DELETE Response ${path}]:\n`, JSON.stringify(json, null, 2));
  if (!res.ok || !json.isSuccess) {
    throw new Error(json.message || '요청에 실패했습니다.');
  }
  return json.data;
}