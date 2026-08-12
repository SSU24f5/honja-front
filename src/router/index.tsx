import { Redirect } from 'expo-router';
import HomeScreen from '@/pages/home';
import { useAuthStore } from '@/stores/auth-store';

export default function Index() {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) {
    return <Redirect href="/welcome" />;
  }

  return <HomeScreen />;
}
