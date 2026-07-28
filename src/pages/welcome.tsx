import { Button } from '@/components/common/button';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/styles/theme';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <View style={styles.logoArea}>
          <Text style={[styles.title, { color: theme.brandPrimary }]}>혼저옵서예</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>[; 어서오세요]</Text>
        </View>

        <View style={styles.buttonArea}>
          <Button label="로그인 하기" onPress={() => console.log('로그인')} variant="primary" />
          <Button label="회원가입 하기" onPress={() => console.log('회원가입')} variant="secondary" />
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