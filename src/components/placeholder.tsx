import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Spacing } from '@/styles/theme';
import { ThemedText } from './common/themed-text';

export default function NameInput() {
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold" style={styles.label}>
        이름 입력
      </ThemedText>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="이름을 입력해 주세요"
        placeholderTextColor="#8E8E93"
      />
      {name ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.helpText}>
          입력한 이름: <ThemedText type="smallBold">{name}</ThemedText>
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
    alignSelf: 'stretch',
  },
  label: {
    color: '#8E8E93',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  helpText: {
    marginTop: Spacing.one,
  },
});
