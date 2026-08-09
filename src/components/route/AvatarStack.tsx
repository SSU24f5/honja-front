import {
    Image,
    type ImageSourcePropType,
    StyleSheet,
    View,
} from "react-native";

interface AvatarStackProps {
  /**
   * 참여자 아바타 이미지 배열.
   * - 로컬 에셋: require('@/assets/avatars/xxx.png')
   * - 원격 이미지: { uri: 'https://...' }
   */
  avatars: ImageSourcePropType[];
  size?: number;
}

// 이미지 로드 전/실패 시 배경으로 보일 색 (원 자체는 이미지가 채움)
const AVATAR_FALLBACK_COLORS = ["#F4D9B8", "#D9C7EE", "#C9E4DE", "#F7C9C9"];

export function AvatarStack({ avatars, size = 28 }: AvatarStackProps) {
  if (!avatars || avatars.length === 0) return null;

  return (
    <View style={styles.row}>
      {avatars.map((avatar, index) => (
        <View
          key={
            typeof avatar === "object" && avatar !== null && "uri" in avatar
              ? (avatar as any).uri
              : `avatar-fallback-${index}`
          }
          style={[
            styles.circle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor:
                AVATAR_FALLBACK_COLORS[index % AVATAR_FALLBACK_COLORS.length],
              marginLeft: index === 0 ? 0 : -size * 0.35,
              zIndex: avatars.length - index,
            },
          ]}
        >
          <Image
            source={avatar}
            style={{ width: size, height: size, borderRadius: size / 2 }}
            resizeMode="cover"
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 6,
  },
  circle: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    overflow: "hidden",
  },
});
