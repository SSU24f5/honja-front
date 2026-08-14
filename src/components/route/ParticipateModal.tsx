import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { Spacing } from '@/styles/theme';

interface ParticipateModalProps {
  visible: boolean;
  /** 모달에 표시할 여행 이름. '<title>에 참여하시겠습니까?' 형태로 들어감 */
  tripTitle: string;
  onReject: () => void;
  onParticipate: () => void;
}

// 초대받은 여행 카드를 눌렀을 때 뜨는 단일 모달 (수락/거부 모달 통합 버전)
export function ParticipateModal({
  visible,
  tripTitle,
  onReject,
  onParticipate,
}: ParticipateModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onReject}>
      <Pressable style={styles.overlay} onPress={onReject}>
        <Pressable onPress={() => {}} style={styles.sheetWrapper}>
          <ThemedView style={styles.sheet}>
            <ThemedText style={styles.message}>
              {'\u3008'}
              {tripTitle}
              {'\u3009'}에{'\n'}참여하시겠습니까?
            </ThemedText>

            <View style={styles.buttonRow}>
              <Pressable style={[styles.button, styles.rejectButton]} onPress={onReject}>
                <ThemedText style={styles.rejectText}>삭제</ThemedText>
              </Pressable>

              <Pressable style={[styles.button, styles.participateButton]} onPress={onParticipate}>
                <ThemedText style={styles.participateText}>참여</ThemedText>
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
    fontSize: 16,
    fontWeight: '700',
    color: '#222222',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.four,
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
  rejectButton: {
    backgroundColor: '#F5E9DE',
  },
  rejectText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6623',
  },
  participateButton: {
    backgroundColor: '#FF6623',
  },
  participateText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});