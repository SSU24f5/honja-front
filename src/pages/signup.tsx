import { TermsAgreement } from '@/components/auth/TermsAgreement';
import { Button } from '@/components/common/button';
import { TextField } from '@/components/common/text-field';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/styles/theme';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignupScreen() {
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [termsOk, setTermsOk] = useState(false);

  // 비밀번호 일치 여부 (둘 다 입력됐을 때만 판단)
  const passwordFilled = password.length > 0 && passwordConfirm.length > 0;
  const passwordMatch = passwordFilled && password === passwordConfirm;

  const handleSendCode = () => {
    // mock: 실제로는 인증번호 발송 API 호출
    setCodeSent(true);
    console.log('인증번호 발송:', email);
  };

  const handleVerifyCode = () => {
    // mock: 코드가 6자리면 인증 성공 처리
    if (code.length === 6) {
      setEmailVerified(true);
    }
  };

  const canSubmit = emailVerified && nickname.length > 0 && passwordMatch && termsOk;

  const handleSignup = () => {
    console.log('회원가입:', { email, nickname });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>회원가입 하기</Text>

        {/* 이메일 + 인증번호 받기 */}
        <View style={styles.emailRow}>
          <View style={{ flex: 1 }}>
            <TextField
              label="이메일"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!emailVerified}
            />
          </View>
          <View style={styles.sendButton}>
            <Button
              label="인증번호 받기"
              variant="secondary"
              onPress={handleSendCode}
              disabled={!email.includes('@') || emailVerified}
            />
          </View>
        </View>

        {/* 인증번호 입력 (발송 후에만 표시) */}
        {codeSent ? (
          <TextField
            label="인증번호"
            placeholder="이메일 인증 코드를 입력해주세요."
            value={code}
            onChangeText={(text) => {
              setCode(text);
              if (text.length === 6) handleVerifyCode();
            }}
            keyboardType="number-pad"
            editable={!emailVerified}
            hint={emailVerified ? '이메일이 인증되었습니다!' : undefined}
            hintStatus="success"
          />
        ) : null}

        {/* 닉네임 */}
        <TextField
          label="닉네임"
          placeholder="닉네임을 정해주세요."
          value={nickname}
          onChangeText={setNickname}
        />

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

        {/* 약관 동의 */}
        <TermsAgreement onAllRequiredChange={setTermsOk} />

        <Button label="회원가입 하기" onPress={handleSignup} disabled={!canSubmit} />
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
  title: { fontSize: 24, fontWeight: 'bold' },
  emailRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.two },
  sendButton: { width: 120, marginBottom: 20 },
});
