import { TermsModal } from '@/components/auth/TermsModal';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/styles/theme';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const TERMS = [
  {
    key: 'privacy',
    required: true,
    label: '[필수] 개인정보 수집 및 이용 동의',
    content: '회원가입, 로그인, 여행 추천 서비스 제공을 위해 필요한 개인정보를 수집·이용합니다.',
  },
  {
    key: 'service',
    required: true,
    label: '[필수] 서비스 이용약관 동의',
    content: '서비스 이용을 위한 기본적인 권리와 의무, 서비스 제공 조건 등을 규정한 약관입니다.',
  },
  {
    key: 'location',
    required: true,
    label: '[필수] 위치정보 이용 동의',
    content:
      '현재 위치를 이용하여 주변 관광지, 여행 코스 및 편의시설을 추천하기 위해 위치정보를 이용합니다.',
  },
  {
    key: 'marketing',
    required: false,
    label: '[선택] 마케팅 정보 수신 동의',
    content: '이벤트, 혜택 등의 마케팅 정보를 수신하는 데 동의합니다.',
  },
] as const;

interface TermsAgreementProps {
  // 필수 약관이 모두 체크됐는지 부모(회원가입)에게 알려줌
  onAllRequiredChange: (allChecked: boolean) => void;
}

export function TermsAgreement({ onAllRequiredChange }: TermsAgreementProps) {
  const theme = useTheme();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [modalTerm, setModalTerm] = useState<(typeof TERMS)[number] | null>(null);

  const toggle = (key: string) => {
    const next = { ...checked, [key]: !checked[key] };
    setChecked(next);
    const allRequired = TERMS.filter((t) => t.required).every((t) => next[t.key]);
    onAllRequiredChange(allRequired);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: theme.text }]}>서비스 이용을 위한 약관 동의</Text>

      {TERMS.map((term) => (
        <View key={term.key} style={styles.row}>
          <Pressable style={styles.checkRow} onPress={() => toggle(term.key)} hitSlop={8}>
            <View
              style={[
                styles.box,
                {
                  borderColor: theme.textSecondary,
                  backgroundColor: checked[term.key] ? theme.brandPrimary : 'transparent',
                },
              ]}
            >
              {checked[term.key] ? <Text style={styles.checkMark}>✓</Text> : null}
            </View>
            <Text style={[styles.label, { color: theme.text }]}>{term.label}</Text>
          </Pressable>

          <Pressable onPress={() => setModalTerm(term)} hitSlop={8}>
            <Text style={[styles.viewMore, { color: theme.textSecondary }]}>보기</Text>
          </Pressable>
        </View>
      ))}

      <TermsModal
        visible={modalTerm !== null}
        title={modalTerm?.label ?? ''}
        content={modalTerm?.content ?? ''}
        onClose={() => setModalTerm(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.three },
  heading: { fontSize: 15, fontWeight: '600' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, flex: 1 },
  box: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  label: { fontSize: 14 },
  viewMore: { fontSize: 13, textDecorationLine: 'underline' },
});
