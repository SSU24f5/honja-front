import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/styles/theme';

interface TermsModalProps {
  visible: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

export function TermsModal({ visible, title, content, onClose }: TermsModalProps) {
  const theme = useTheme();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: theme.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={[styles.close, { color: theme.text }]}>X</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.body}>
            <Text style={[styles.content, { color: theme.textSecondary }]}>{content}</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '80%',
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    padding: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  title: { fontSize: 18, fontWeight: 'bold', flex: 1 },
  close: { fontSize: 18, fontWeight: 'bold', paddingHorizontal: Spacing.two },
  body: { flexGrow: 0 },
  content: { fontSize: 14, lineHeight: 22 },
});
