import { getTerms, type Term } from '@/api/auth';
import { TermsModal } from '@/components/auth/TermsModal';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/styles/theme';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface TermsAgreementProps {
  // 동의한 약관 id 배열 + 필수 다 됐는지를 부모에게 전달
  onChange: (agreedIds: number[], allRequiredChecked: boolean) => void;
}

export function TermsAgreement({ onChange }: TermsAgreementProps) {
  const theme = useTheme();
  const [terms, setTerms] = useState<Term[]>([]);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [modalTerm, setModalTerm] = useState<Term | null>(null);

  // 화면 뜰 때 서버에서 약관 목록 받아오기
  useEffect(() => {
    getTerms()
      .then(setTerms)
      .catch((e) => console.log('약관 조회 실패:', e));
  }, []);

  const toggle = (id: number) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);

    const agreedIds = terms.filter((t) => next[t.id]).map((t) => t.id);
    const allRequired = terms.filter((t) => t.isRequired).every((t) => next[t.id]);
    onChange(agreedIds, allRequired);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: theme.text }]}>서비스 이용을 위한 약관 동의</Text>

      {terms.map((term) => (
        <View key={term.id} style={styles.row}>
          <Pressable style={styles.checkRow} onPress={() => toggle(term.id)} hitSlop={8}>
            <View
              style={[
                styles.box,
                {
                  borderColor: theme.textSecondary,
                  backgroundColor: checked[term.id] ? theme.brandPrimary : 'transparent',
                },
              ]}
            >
              {checked[term.id] ? <Text style={styles.checkMark}>✓</Text> : null}
            </View>
            <Text style={[styles.label, { color: theme.text }]}>
              {term.isRequired ? '[필수] ' : '[선택] '}
              {term.title}
            </Text>
          </Pressable>

          <Pressable onPress={() => setModalTerm(term)} hitSlop={8}>
            <Text style={[styles.viewMore, { color: theme.textSecondary }]}>보기</Text>
          </Pressable>
        </View>
      ))}

      <TermsModal
        visible={modalTerm !== null}
        title={modalTerm?.title ?? ''}
        content={modalTerm?.content ?? ''}
        onClose={() => setModalTerm(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.three },
  heading: { fontSize: 15, fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
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
  label: { fontSize: 14, flexShrink: 1 },
  viewMore: { fontSize: 13, textDecorationLine: 'underline' },
});
