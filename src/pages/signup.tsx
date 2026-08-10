import { sendEmailCode, signUp } from '@/api/auth';
import { TermsAgreement } from '@/components/auth/TermsAgreement';
import { Button } from '@/components/common/button';
import { TextField } from '@/components/common/text-field';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/styles/theme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignupScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [agreedTermIds, setAgreedTermIds] = useState<number[]>([]);
  const [termsOk, setTermsOk] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordFilled = password.length > 0 && passwordConfirm.length > 0;
  const passwordMatch = passwordFilled && password === passwordConfirm;

  // 인증번호 발송 (실제 API)
  const handleSendCode = async () => {
    setError(null);
    try {
      await sendEmailCode(email);
      setCodeSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : '인증번호 발송에 실패했습니다.');
    }
  };

  // 회원가입 (실제 API) — 인증코드는 서버가 검증
  const handleSignup = async () => {
    setError(null);
    setLoading(true);
    try {
      await signUp({ email, authCode: code, nickname, password, agreedTermIds });
      router.replace('/login'); // 가입 성공 → 로그인 화면으로
    } catch (e) {
      setError(e instanceof Error ? e.message : '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit =
    nickname.length > 0 &&
    email.includes('@') &&
    code.length > 0 &&
    passwordMatch &&
    termsOk &&
    !loading;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={[styles.back, { color: theme.text }]}>‹</Text>
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>회원가입</Text>

        {/* 닉네임 */}
        <TextField
          label="닉네임"
          placeholder="닉네임을 정해주세요."
          value={nickname}
          onChangeText={setNickname}
        />

        {/* 이메일 + 인증하기 */}
        <View style={styles.emailRow}>
          <View style={{ flex: 1 }}>
            <TextField
              label="이메일"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.sendButton}>
            <Button
              label="인증하기"
              variant="secondary"
              onPress={handleSendCode}
              disabled={!email.includes('@')}
            />
          </View>
        </View>

        {/* 인증번호 (발송 후 표시) */}
        {codeSent ? (
          <TextField
            label="인증번호"
            placeholder="이메일 인증 코드를 입력해주세요."
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            hint="인증번호를 입력해주세요."
            hintStatus="info"
          />
        ) : null}

        {/* 비밀번호 */}
        <TextField
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* 비밀번호 재입력 */}
        <TextField
          label="비밀번호 재입력"
          placeholder="비밀번호를 재입력해주세요."
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          secureTextEntry
          hint={
            !passwordFilled
              ? undefined
              : passwordMatch
                ? '비밀번호가 일치합니다.'
                : '비밀번호가 일치하지 않습니다.'
          }
          hintStatus={passwordMatch ? 'success' : 'error'}
        />

        {/* 약관 (서버에서 받아옴) */}
        <TermsAgreement
          onChange={(ids, allRequired) => {
            setAgreedTermIds(ids);
            setTermsOk(allRequired);
          }}
        />

        {error ? <Text style={{ color: '#E5484D' }}>{error}</Text> : null}

        <Button
          label={loading ? '가입 중...' : '회원가입 하기'}
          onPress={handleSignup}
          disabled={!canSubmit}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  back: { fontSize: 32 },
  title: { fontSize: 24, fontWeight: 'bold' },
  emailRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.two },
  sendButton: { width: 100, marginBottom: 20 },
});
