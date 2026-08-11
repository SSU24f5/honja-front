import { login } from '@/api/auth';
import { Button } from '@/components/common/button';
import { TextField } from '@/components/common/text-field';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/stores/auth-store';
import { Spacing } from '@/styles/theme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await login(email, password);
      setToken(result.accessToken); // 토큰 저장
      router.replace('/'); // 홈으로 이동
    } catch (e) {
      // 백엔드가 던진 message가 여기로 옴 (비밀번호 틀림, 없는 이메일 등)
      setError(e instanceof Error ? e.message : '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = email.length > 0 && password.length > 0 && !loading;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={[styles.back, { color: theme.text }]}>‹</Text>
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>로그인</Text>

        <View style={styles.form}>
          <TextField
            label="이메일"
            placeholder="가입한 이메일을 입력해주세요."
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError(null);
            }}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextField
            label="비밀번호"
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError(null);
            }}
            secureTextEntry
            hint={error ?? undefined}
            hintStatus="error"
          />
        </View>

        <Button
          label={loading ? '로그인 중...' : '로그인 하기'}
          onPress={handleLogin}
          disabled={!canSubmit}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    gap: Spacing.five,
  },
  back: { fontSize: 32 },
  title: { fontSize: 24, fontWeight: 'bold' },
  form: { flex: 1, gap: Spacing.four },
});
