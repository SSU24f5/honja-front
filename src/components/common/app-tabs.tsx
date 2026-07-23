import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '@/styles/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
        },
        tabBarActiveTintColor: colors.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: '지도',
        }}
      />
      <Tabs.Screen
        name="route"
        options={{
          title: '경로',
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: '마이페이지',
        }}
      />
    </Tabs>
  );
}
