import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Spacing } from '@/styles/theme';

export function OlleTrailList() {
  const events = [
    {
      id: 'event-1',
      title: '뜻을 품은 그림',
      dates: '2026.03.24. ~ 08.23.',
      location: '제주현대미술관',
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500',
    },
    {
      id: 'event-2',
      title: '내꿈은 응원단장\nKBO 981 리그',
      dates: '2026.07.10. ~ 09.28.',
      location: '제주종합경기장',
      imageUrl: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=500',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>인기 행사 & 전시</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {events.map((event) => (
          <View key={event.id} style={styles.posterCard}>
            <Image source={{ uri: event.imageUrl }} style={styles.posterImage} />
            <View style={styles.infoContainer}>
              <Text style={styles.eventTitle} numberOfLines={2}>
                {event.title}
              </Text>
              <Text style={styles.eventDates}>{event.dates}</Text>
              <Text style={styles.eventLocation}>{event.location}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.two,
    backgroundColor: 'transparent',
  },
  header: {
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.three,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  scrollContainer: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
    paddingBottom: Spacing.two,
  },
  posterCard: {
    width: 170,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  posterImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: Spacing.three,
    gap: 4,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C1C1E',
    lineHeight: 18,
    height: 36, // Fixed height for 2 lines alignment
  },
  eventDates: {
    fontSize: 11,
    color: '#E06635',
    fontWeight: '600',
  },
  eventLocation: {
    fontSize: 11,
    color: '#8E8E93',
  },
});
