import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { Spacing } from '@/styles/theme';

export function CalendarSlider() {
  const [selectedOffset, setSelectedOffset] = useState(0);

  // Generate current week dates
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const today = new Date();

  const getWeekDays = () => {
    const list = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      list.push({
        offset: i,
        dayName: daysOfWeek[d.getDay()],
        dateNum: d.getDate(),
        month: d.getMonth() + 1,
      });
    }
    return list;
  };

  const weekDays = getWeekDays();
  const selectedDay = weekDays.find((d) => d.offset === selectedOffset) || weekDays[3];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="smallBold" style={styles.title}>
          {selectedDay.month}월 {selectedDay.dateNum}일 ({selectedDay.dayName})
        </ThemedText>
      </ThemedView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {weekDays.map((item) => {
          const isSelected = item.offset === selectedOffset;
          return (
            <Pressable
              key={item.offset}
              onPress={() => setSelectedOffset(item.offset)}
              style={styles.dayContainer}
            >
              <ThemedText
                type="small"
                themeColor={isSelected ? 'brandPrimary' : 'textSecondary'}
                style={styles.dayName}
              >
                {item.dayName}
              </ThemedText>
              <View style={[styles.dateCircle, isSelected && styles.dateCircleSelected]}>
                <ThemedText style={[styles.dateNumText, isSelected && styles.dateNumTextSelected]}>
                  {item.dateNum}
                </ThemedText>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    gap: Spacing.two,
    backgroundColor: 'transparent',
    paddingHorizontal: Spacing.four,
  },
  header: {
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    gap: 12,
    paddingVertical: Spacing.one,
  },
  dayContainer: {
    alignItems: 'center',
    width: 44,
    gap: 6,
  },
  dayName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
  },
  dateCircleSelected: {
    backgroundColor: '#D36D3A',
  },
  dateNumText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  dateNumTextSelected: {
    color: '#FFFFFF',
  },
});
