import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { Spacing } from '@/styles/theme';
import { TripColors } from '@/styles/tripColors';

interface DeleteConfirmModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ visible, onCancel, onConfirm }: DeleteConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable onPress={() => {}} style={styles.sheetWrapper}>
          <ThemedView style={styles.sheet}>
            <ThemedText type="default" style={styles.message}>
              여행을 삭제하시겠습니까?
            </ThemedText>

            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.button, { backgroundColor: TripColors.tagNeutral }]}
                onPress={onCancel}
              >
                <ThemedText type="smallBold" style={{ color: TripColors.titleText }}>
                  취소
                </ThemedText>
              </Pressable>

              <Pressable
                style={[styles.button, { backgroundColor: TripColors.danger }]}
                onPress={onConfirm}
              >
                <ThemedText type="smallBold" themeColor="background">
                  삭제
                </ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.five,
  },
  sheetWrapper: {
    width: '100%',
  },
  sheet: {
    borderRadius: 20,
    paddingTop: Spacing.four + Spacing.one,
    paddingBottom: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  message: {
    textAlign: 'center',
    marginBottom: Spacing.four,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.two + Spacing.half,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.two + Spacing.half,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});