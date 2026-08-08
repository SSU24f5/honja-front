import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/styles/theme';
import { useState } from 'react';
import type { StyleProp, TextInputProps, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type HintStatus = 'error' | 'success' | 'info';

interface TextFieldProps extends TextInputProps {
  label: string;
  hint?: string;
  hintStatus?: HintStatus;
  containerStyle?: StyleProp<ViewStyle>;
}

const StatusColors = {
  error: '#E5484D',
  success: '#3B82F6', // 시안: 인증/일치 성공은 파란색
} as const;

export function TextField({
  label,
  hint,
  hintStatus = 'info',
  containerStyle,
  secureTextEntry,
  ...inputProps
}: TextFieldProps) {
  const theme = useTheme();
  const [hidden, setHidden] = useState(true);

  // 비밀번호 필드일 때만 눈 아이콘 표시
  const isPassword = secureTextEntry === true;

  const hintColor =
    hintStatus === 'error'
      ? StatusColors.error
      : hintStatus === 'success'
        ? StatusColors.success
        : theme.textSecondary;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: hintStatus === 'error' ? StatusColors.error : 'transparent',
          },
        ]}
      >
        <TextInput
          placeholderTextColor={theme.textSecondary}
          secureTextEntry={isPassword && hidden}
          style={[styles.input, { color: theme.text }]}
          {...inputProps}
        />
        {isPassword ? (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8}>
            <Text style={{ color: theme.textSecondary, fontSize: 18 }}>{hidden ? '🙈' : '👁'}</Text>
          </Pressable>
        ) : null}
      </View>

      {hint ? <Text style={[styles.hint, { color: hintColor }]}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', gap: Spacing.two },
  label: { fontSize: 14, fontWeight: '600' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
  hint: { fontSize: 13 },
});
