import { Button } from '@/components/common/button';
import { TextField } from '@/components/common/text-field';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/styles/theme';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    // mock 검증
    if (!email.includes('@')) {
      setError('가입되지 않은 이메일입니다.');
      return;
    }
    if (password.length < 4) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setError(null);
    console.log('로그인 시도:', email);
  };

  const canSubmit = email.length > 0 && password.length > 0;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>로그인 하기</Text>

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

        <Button label="로그인 하기" onPress={handleLogin} disabled={!canSubmit} />
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
  title: { fontSize: 24, fontWeight: 'bold' },
  form: { flex: 1, gap: Spacing.four },
});