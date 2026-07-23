import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { AnimatedSplashOverlay } from '@/components/common/animated-icon';
import AppTabs from '@/components/common/app-tabs';
import { QueryProvider } from '@/providers/QueryProvider';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const [fontsLoaded, fontError] = useFonts({
    EF_jejudoldam: require('@/assets/fonts/EF_jejudoldam.ttf'),
    NEXON_Lv2_Gothic: require('@/assets/fonts/NEXON_Lv2_Gothic.otf'),
  });

  const colorScheme = useColorScheme();

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <AppTabs />
      </ThemeProvider>
    </QueryProvider>
  );
}
