import { ImageBackground, StyleSheet, View } from 'react-native';

export function WelcomeBanner() {
  return (
    <View style={styles.outerContainer}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800' }}
        style={styles.bannerImage}
        imageStyle={{ borderRadius: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginHorizontal: 0, // Expanded to container edges
    borderRadius: 20,
    overflow: 'hidden',
    height: 190,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
});
