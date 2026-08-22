import { Button } from '@/components/common/button';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/stores/auth-store';
import { Spacing } from '@/styles/theme';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <View style={styles.logoArea}>
          <Text style={[styles.title, { color: theme.brandPrimary }]}>혼저옵서예</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>[; 어서오세요]</Text>
        </View>

        <View style={styles.buttonArea}>
          <Button
            label="로그인 하기"
            onPress={() => router.push('/login' as any)}
            variant="primary"
          />
          <Button
            label="둘러보기 (임시 로그인)"
            onPress={() => {
              setToken('mock-token');
              router.replace('/');
            }}
            variant="secondary"
          />
          <Button
            label="회원가입 하기"
            onPress={() => router.push('/signup' as any)}
            variant="secondary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    justifyContent: 'space-between',
    paddingTop: Spacing.six,
    paddingBottom: Spacing.five,
  },
  logoArea: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.two },
  title: { fontSize: 40, fontWeight: 'bold' },
  subtitle: { fontSize: 16 },
  buttonArea: { gap: Spacing.three },
});
