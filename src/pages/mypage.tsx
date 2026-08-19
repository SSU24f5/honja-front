import { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/stores/auth-store';
import { BottomTabInset, Spacing } from '@/styles/theme';

export default function MyPageScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  
  // Auth Store
  const clearToken = useAuthStore((state) => state.clearToken);
  const profileImage = useAuthStore((state) => state.profileImage);
  const setProfileImage = useAuthStore((state) => state.setProfileImage);

  // Form states
  const [nickname, setNickname] = useState('제주좋아박희진');
  const [email, setEmail] = useState('heejin05@gmail.com');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state variables
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [isPasswordChangeEnabled, setIsPasswordChangeEnabled] = useState(false);

  // Preset avatar images list
  const avatarPresets = [
    'https://i.pravatar.cc/150?img=34',
    'https://i.pravatar.cc/150?img=47',
    'https://i.pravatar.cc/150?img=18',
    'https://i.pravatar.cc/150?img=20',
    'https://i.pravatar.cc/150?img=49',
    'https://i.pravatar.cc/150?img=28',
  ];

  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  const handleLogout = () => {
    clearToken();
    router.replace('/welcome' as any);
  };

  const handleSave = () => {
    if (isPasswordChangeEnabled && !confirmPassword.trim()) {
      const msg = '비밀번호 재입력을 입력해 주세요.';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('알림', msg);
      return;
    }
    const successMsg = '프로필 정보가 저장되었습니다.';
    if (Platform.OS === 'web') window.alert(successMsg);
    else Alert.alert('성공', successMsg);

    // Reset password change state on save success
    setIsPasswordChangeEnabled(false);
    setConfirmPassword('');
  };

  const handlePasswordPress = () => {
    setShowPasswordModal(true);
  };

  const confirmPasswordChange = () => {
    setShowPasswordModal(false);
    setIsPasswordChangeEnabled(true);
    setPassword(''); // Clear to let them type new password
  };

  const selectAvatar = (url: string) => {
    setProfileImage(url);
    setShowAvatarModal(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* 1. Header (Back button, Title, Logout button) */}
      <View style={[styles.headerRow, { paddingTop: Math.max(safeAreaInsets.top, Spacing.three) }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Text style={styles.backBtnText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>마이페이지</Text>
        <Pressable onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutBtnText}>로그아웃</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom }]}
      >
        <View style={styles.formContainer}>
          {/* 닉네임 필드 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>닉네임</Text>
            <TextInput
              value={nickname}
              onChangeText={setNickname}
              placeholder="닉네임을 입력해주세요."
              placeholderTextColor="#C0C0C0"
              style={styles.textInput}
            />
          </View>

          {/* 프로필 사진 필드 */}
          <View style={styles.photoGroup}>
            <Text style={styles.label}>프로필 사진</Text>
            <Pressable onPress={() => setShowAvatarModal(true)} style={styles.avatarWrapper}>
              <Image
                source={{ uri: profileImage }}
                style={styles.avatarImage}
              />
              <View style={styles.cameraIconContainer}>
                <Text style={styles.cameraIcon}>📷</Text>
              </View>
            </Pressable>
          </View>

          {/* 이메일 필드 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              value={email}
              editable={false}
              style={[styles.textInput, styles.disabledInput]}
            />
          </View>

          {/* 비밀번호 필드 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>비밀번호</Text>
            <Pressable onPress={handlePasswordPress}>
              <View pointerEvents="none">
                <TextInput
                  value={isPasswordChangeEnabled ? password : '••••••••'}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={styles.textInput}
                  editable={isPasswordChangeEnabled}
                  placeholder={isPasswordChangeEnabled ? '새 비밀번호를 입력해주세요.' : ''}
                />
              </View>
            </Pressable>
          </View>

          {/* 비밀번호 재입력 필드 (비밀번호 변경이 활성화 되었을 때만 표시) */}
          {isPasswordChangeEnabled && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>비밀번호 재입력</Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="비밀번호를 다시 한 번 입력해주세요."
                placeholderTextColor="#C0C0C0"
                style={styles.textInput}
              />
            </View>
          )}

          {/* 저장하기 버튼 */}
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]}
          >
            <Text style={styles.saveBtnText}>저장하기</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* 2. 비밀번호 변경 확인 팝업 (모달) */}
      <Modal
        visible={showPasswordModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>비밀번호를 변경하시겠습니까?</Text>
            <View style={styles.modalButtonsRow}>
              <Pressable
                onPress={() => setShowPasswordModal(false)}
                style={styles.modalCancelBtn}
              >
                <Text style={styles.modalCancelText}>취소</Text>
              </Pressable>
              <Pressable
                onPress={confirmPasswordChange}
                style={styles.modalConfirmBtn}
              >
                <Text style={styles.modalConfirmText}>비밀번호 변경</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* 3. 프로필 사진 선택 팝업 (모달) */}
      <Modal
        visible={showAvatarModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAvatarModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxWidth: 360 }]}>
            <Text style={styles.modalTitle}>프로필 사진 선택</Text>
            
            <View style={styles.avatarGrid}>
              {avatarPresets.map((url, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => selectAvatar(url)}
                  style={({ pressed }) => [
                    styles.avatarGridItem,
                    profileImage === url && styles.avatarGridItemActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <Image source={{ uri: url }} style={styles.avatarGridImage} />
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={() => setShowAvatarModal(false)}
              style={styles.modalCancelBtnFull}
            >
              <Text style={styles.modalCancelText}>닫기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#F2F2F7',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  backBtn: {
    padding: Spacing.one,
  },
  backBtnText: {
    fontSize: 32,
    color: '#1C1C1E',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  logoutBtn: {
    backgroundColor: '#FF8A00',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
  },
  formContainer: {
    gap: Spacing.four,
    flex: 1,
  },
  inputGroup: {
    gap: 8,
  },
  photoGroup: {
    alignItems: 'center',
    gap: 8,
    marginVertical: Spacing.two,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C1C1E',
    alignSelf: 'flex-start',
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    backgroundColor: '#FAF8F6', // Mockup input background
    paddingHorizontal: Spacing.three,
    fontSize: 14,
    color: '#1C1C1E',
  },
  disabledInput: {
    color: '#8E8E93',
    backgroundColor: '#F2F2F7',
  },
  avatarWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cameraIcon: {
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: '#FF6623',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.five,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.85,
  },
  // Modal styles matching mockup exactly
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: Spacing.five,
    width: '85%',
    maxWidth: 320,
    alignItems: 'center',
    gap: Spacing.four,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalCancelBtnFull: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 8,
  },
  modalConfirmBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FF6623',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Avatar Picker Grid styles
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginVertical: Spacing.two,
    width: '100%',
  },
  avatarGridItem: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  avatarGridItemActive: {
    borderColor: '#FF6623',
  },
  avatarGridImage: {
    width: '100%',
    height: '100%',
  },
});
