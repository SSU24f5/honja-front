import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/styles/theme';
import type { StyleProp, TextInputProps, ViewStyle } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type HintStatus = 'error' | 'success' | 'info';

interface TextFieldProps extends TextInputProps {
  label: string;
  hint?: string;
  hintStatus?: HintStatus;
  containerStyle?: StyleProp<ViewStyle>;
}

// 테마에 error/success 색이 아직 없어서 임시로 정의
const StatusColors = {
  error: '#E5484D',
  success: '#30A46C',
} as const;

export function TextField({
  label,
  hint,
  hintStatus = 'info',
  containerStyle,
  ...inputProps
}: TextFieldProps) {
  const theme = useTheme();

  const hintColor =
    hintStatus === 'error'
      ? StatusColors.error
      : hintStatus === 'success'
        ? StatusColors.success
        : theme.textSecondary;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>

      <TextInput
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          {
            backgroundColor: theme.backgroundElement,
            color: theme.text,
            borderColor: hintStatus === 'error' ? StatusColors.error : 'transparent',
          },
        ]}
        {...inputProps}
      />

      {hint ? <Text style={[styles.hint, { color: hintColor }]}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: Spacing.two,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    borderWidth: 1,
    fontSize: 16,
  },
  hint: {
    fontSize: 13,
  },
});
