import type { ComponentProps } from 'react';
import { Platform, Text } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Ionicons } from '@expo/vector-icons';

// 여기서 쓰는 아이콘 종류만 우선 등록. 필요하면 추가하면 됨.
export type AppIconName = 'envelope' | 'trash' | 'exchange';

// SymbolView가 기대하는 name 타입을 그대로 가져와서 맵 타입에 사용
type SFSymbolName = ComponentProps<typeof SymbolView>['name'];

// iOS: SF Symbol 이름
const SYMBOL_NAME_MAP: Record<AppIconName, SFSymbolName> = {
  envelope: 'envelope',
  trash: 'trash',
  exchange: 'arrow.triangle.2.circlepath',
};

// 웹 / Android: Ionicons 이름
const IONICON_NAME_MAP: Record<AppIconName, keyof typeof Ionicons.glyphMap> = {
  envelope: 'mail',
  trash: 'trash-outline',
  exchange: 'sync-outline',
};

// Ionicons 폰트/버전 문제로 렌더링이 불안정했던 아이콘은
// 폰트에 의존하지 않는 유니코드 문자로 대체 (envelope가 계속 안 보이던 문제 해결용)
const UNICODE_FALLBACK_MAP: Partial<Record<AppIconName, string>> = {
  envelope: '\u2709', // ✉
};

interface AppIconProps {
  name: AppIconName;
  size?: number;
  color: string;
}

/**
 * expo-symbols(SF Symbol)는 iOS에서만 렌더링되고 웹/Android에서는 아무것도 안 그려짐.
 * 그래서 iOS는 SymbolView, 그 외 플랫폼은 Ionicons(또는 유니코드 폴백)로 분기.
 */
export function AppIcon({ name, size = 20, color }: AppIconProps) {
  if (Platform.OS === 'ios') {
    return <SymbolView name={SYMBOL_NAME_MAP[name]} size={size} tintColor={color} />;
  }

  const unicodeFallback = UNICODE_FALLBACK_MAP[name];
  if (unicodeFallback) {
    return <Text style={{ fontSize: size, lineHeight: size, color }}>{unicodeFallback}</Text>;
  }

  return <Ionicons name={IONICON_NAME_MAP[name]} size={size} color={color} />;
}