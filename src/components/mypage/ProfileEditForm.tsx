import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { useMyPageStore } from '@/stores/mypageStore';
import { Spacing } from '@/styles/theme';

export function ProfileEditForm() {
  const { profileName, profileImage, visitCount, incrementVisit, decrementVisit, updateProfile } =
    useMyPageStore();

  const [name, setName] = useState(profileName);
  const [activeAvatar, setActiveAvatar] = useState(profileImage);
  const [isEditing, setIsEditing] = useState(false);

  const avatars = [
    { key: 'orange', label: '감귤 🍊' },
    { key: 'palm', label: '야자수 🌴' },
    { key: 'stone', label: '돌하르방 🗿' },
    { key: 'hallasan', label: '한라산 🏔️' },
  ];

  const handleSave = () => {
    updateProfile(name, activeAvatar);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(profileName);
    setActiveAvatar(profileImage);
    setIsEditing(false);
  };

  const getAvatarEmoji = (key: string) => {
    switch (key) {
      case 'orange':
        return '🍊';
      case 'palm':
        return '🌴';
      case 'stone':
        return '🗿';
      case 'hallasan':
        return '🏔️';
      default:
        return '👤';
    }
  };

  return (
    <ThemedView style={styles.container} type="backgroundElement">
      {/* Profile Header */}
      <ThemedView style={styles.header}>
        <ThemedText style={styles.avatarLarge}>{getAvatarEmoji(profileImage)}</ThemedText>
        <ThemedView style={styles.profileText}>
          {isEditing ? (
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.textInput}
              placeholder="이름을 입력하세요"
            />
          ) : (
            <ThemedText type="subtitle" style={styles.profileNameText}>
              {profileName}
            </ThemedText>
          )}
          <ThemedText type="small" themeColor="textSecondary">
            제주를 사랑하는 탐험가
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Avatar Picker (Editing mode only) */}
      {isEditing && (
        <ThemedView style={styles.avatarPicker}>
          <ThemedText type="smallBold">프로필 아바타 선택</ThemedText>
          <ThemedView style={styles.avatarRow}>
            {avatars.map((av) => (
              <Pressable
                key={av.key}
                onPress={() => setActiveAvatar(av.key)}
                style={[styles.avatarChip, activeAvatar === av.key && styles.avatarChipActive]}
              >
                <ThemedText style={styles.chipText}>{av.label}</ThemedText>
              </Pressable>
            ))}
          </ThemedView>
        </ThemedView>
      )}

      {/* Profile Edit buttons */}
      <ThemedView style={styles.buttonContainer}>
        {isEditing ? (
          <ThemedView style={styles.editActions}>
            <Pressable onPress={handleSave} style={[styles.btn, styles.btnSave]}>
              <ThemedText style={styles.btnTextWhite}>저장</ThemedText>
            </Pressable>
            <Pressable onPress={handleCancel} style={[styles.btn, styles.btnCancel]}>
              <ThemedText style={styles.btnTextBlack}>취소</ThemedText>
            </Pressable>
          </ThemedView>
        ) : (
          <Pressable onPress={() => setIsEditing(true)} style={[styles.btn, styles.btnEdit]}>
            <SymbolView name="pencil" tintColor="#D36D3A" size={14} />
            <ThemedText style={styles.btnTextBrand}>프로필 수정</ThemedText>
          </Pressable>
        )}
      </ThemedView>

      <ThemedView style={styles.divider} />

      {/* Visit Counter */}
      <ThemedView style={styles.counterSection}>
        <ThemedView style={styles.counterLabel}>
          <SymbolView name="airplane" tintColor="#D36D3A" size={18} />
          <ThemedText type="smallBold">나의 제주 방문 횟수</ThemedText>
        </ThemedView>

        <ThemedView style={styles.counterRow}>
          <Pressable onPress={decrementVisit} style={styles.counterBtn}>
            <SymbolView name="minus" tintColor="#D36D3A" size={16} />
          </Pressable>

          <ThemedText type="subtitle" style={styles.countText}>
            {visitCount}회
          </ThemedText>

          <Pressable onPress={incrementVisit} style={styles.counterBtn}>
            <SymbolView name="plus" tintColor="#D36D3A" size={16} />
          </Pressable>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.four,
    borderRadius: 16,
    alignSelf: 'stretch',
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: 'transparent',
  },
  avatarLarge: {
    fontSize: 54,
  },
  profileText: {
    gap: 2,
    backgroundColor: 'transparent',
    flex: 1,
  },
  profileNameText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textInput: {
    fontSize: 16,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#D36D3A',
    paddingVertical: 2,
    color: '#000000',
    fontFamily: 'NEXON_Lv2_Gothic',
  },
  avatarPicker: {
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  avatarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  avatarChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  avatarChipActive: {
    borderColor: '#D36D3A',
    backgroundColor: '#FAF2EE',
  },
  chipText: {
    fontSize: 13,
  },
  buttonContainer: {
    backgroundColor: 'transparent',
  },
  editActions: {
    flexDirection: 'row',
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: Spacing.three,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  btnEdit: {
    borderWidth: 1,
    borderColor: '#D36D3A',
    alignSelf: 'flex-start',
  },
  btnSave: {
    backgroundColor: '#D36D3A',
    flex: 1,
  },
  btnCancel: {
    backgroundColor: '#E5E5EA',
    flex: 1,
  },
  btnTextWhite: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  btnTextBlack: {
    color: '#000000',
  },
  btnTextBrand: {
    color: '#D36D3A',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  counterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  counterLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    backgroundColor: 'transparent',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: 'transparent',
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
