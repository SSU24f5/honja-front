import { Redirect } from 'expo-router';
import RouteScreen from '@/pages/route/route';
import { useAuthStore } from '@/stores/auth-store';

export default function RouteIndex() {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) {
    return <Redirect href="/welcome" />;
  }

  return <RouteScreen />;
}
