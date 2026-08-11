import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { Spacing } from '@/styles/theme';
import { TripColors } from '@/styles/tripColors';

interface ConfirmModalProps {
  visible: boolean;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** 확인 버튼 배경색. 안 넘기면 danger(삭제/거부) 색 사용 */
  confirmColor?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

// 수락/거부 등 여러 확인창에서 재사용하는 범용 모달
export function ConfirmModal({
  visible,
  message,
  confirmLabel,
  cancelLabel = '취소',
  confirmColor = TripColors.danger,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable onPress={() => {}} style={styles.sheetWrapper}>
          <ThemedView style={styles.sheet}>
            <ThemedText type="default" style={styles.message}>
              {message}
            </ThemedText>

            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.button, { backgroundColor: TripColors.tagNeutral }]}
                onPress={onCancel}
              >
                <ThemedText type="smallBold" style={{ color: TripColors.titleText }}>
                  {cancelLabel}
                </ThemedText>
              </Pressable>

              <Pressable
                style={[styles.button, { backgroundColor: confirmColor }]}
                onPress={onConfirm}
              >
                <ThemedText type="smallBold" themeColor="background">
                  {confirmLabel}
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
