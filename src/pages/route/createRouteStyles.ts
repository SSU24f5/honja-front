import { Platform, StyleSheet } from 'react-native';
import { MaxContentWidth, Spacing } from '@/styles/theme';

export const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flex: 1,
    paddingVertical: Spacing.four,
    gap: Spacing.five,
  },

  // ── 폼 레이아웃 ──
  formPageContainer: {
    paddingBottom: Spacing.six,
    gap: Spacing.four,
    alignSelf: 'stretch',
  },
  formHeaderRow: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  formHeader: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.one,
    backgroundColor: 'transparent',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222222',
  },
  formBody: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  formItem: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222222',
  },
  requiredAsterisk: {
    color: '#E06635',
    fontSize: 15,
    fontWeight: '700',
  },
  // 뒤로가기 아이콘
  backChevron: {
    fontSize: 28,
    color: '#292929',
    fontWeight: '300',
  },

  // ── 입력 필드 ──
  whiteInput: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#222222',
    fontWeight: '400',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    ...Platform.select({
      web: {
        // biome-ignore lint/suspicious/noExplicitAny: Outline style for web input
        outlineStyle: 'none' as any,
      },
      default: {},
    }),
  },
  multilineInput: {
    height: 80,
    paddingTop: 14,
    textAlignVertical: 'top',
  },

  // ── 카테고리 뱃지 ──
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryBadge: {
    flex: 1,
    minWidth: '30%',
    maxWidth: '31%',
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 0,
  },
  categoryBadgeActive: {
    backgroundColor: '#F5F5F5',
    borderWidth: 0,
  },
  categoryBadgeText: {
    fontSize: 14,
    color: '#AAAAAA',
    fontWeight: '500',
  },
  categoryBadgeTextActive: {
    color: '#222222',
    fontWeight: '700',
  },

  // ── 달력 ──
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  calendarArrow: {
    fontSize: 20,
    color: '#333333',
    fontWeight: '400',
  },
  calendarMonthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222222',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    color: '#666666',
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCellEmpty: {
    width: '14.28%',
    height: 40,
  },
  calendarDayCell: {
    width: '14.28%',
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  // 블록 스타일 (사각형, 날마다 끊어지는 느낌)
  calendarDayBlock: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayBlockActive: {
    backgroundColor: '#E06635',
  },
  calendarDayBlockInBetween: {
    backgroundColor: '#FCEFE9',
  },
  calendarDayText: {
    fontSize: 14,
    color: '#222222',
    fontWeight: '500',
  },
  calendarDayTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  calendarDayTextInBetween: {
    color: '#E06635',
    fontWeight: '600',
  },

  // ── 폼 하단 ──
  formFooter: {
    marginTop: Spacing.three,
    gap: Spacing.two,
  },
  submitBtn: {
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.four,
  },
  submitBtnActive: {
    backgroundColor: '#E06635',
  },
  submitBtnDisabled: {
    backgroundColor: '#E0E0E0',
  },
  submitBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.8,
  },

  // ── Day-by-Day Planner ──
  summaryCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 20,
    padding: Spacing.four,
    gap: Spacing.one,
  },
  inviteBtn: {
    backgroundColor: '#E59341',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  inviteBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  summaryBadgeDate: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  summaryBadgeDateText: {
    color: '#777777',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryBadgeCompanion: {
    backgroundColor: '#95B36F',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  summaryBadgeCompanionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  summaryTitleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111111',
  },
  tabsContainer: {
    marginVertical: Spacing.two,
  },
  tabsScrollContent: {
    gap: 12,
  },
  dayTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayTabActive: {
    backgroundColor: '#E59341',
  },
  dayTabInactive: {
    backgroundColor: '#F5F5F5',
  },
  dayTabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dayTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dayTabTextInactive: {
    color: '#E59341',
  },
  dailyPlannerSection: {
    gap: Spacing.three,
  },
  plannerItem: {
    gap: 8,
  },
  plannerLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222222',
    marginTop: 4,
  },
  placePlaceholderBox: {
    height: 52,
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    paddingHorizontal: 18,
    justifyContent: 'center',
    borderWidth: 0,
  },
  placePlaceholderText: {
    fontSize: 14,
    color: '#999999',
  },
  placeValueBox: {
    height: 52,
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0,
  },
  placeValueText: {
    fontSize: 14,
    color: '#222222',
    fontWeight: '500',
  },
  placeRemoveBtn: {
    padding: 4,
  },
  waypointBox: {
    height: 52,
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  waypointControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  waypointControlBtn: {
    padding: 6,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  waypointDragHandle: {
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusCardBox: {
    height: 52,
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnTextRow: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  backBtnText: {
    color: '#8E8E93',
    fontSize: 14,
    textDecorationLine: 'underline',
  },

  // ── 검색 모달 ──
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      web: {
        position: 'fixed' as any,
        top: 80,
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)' as any,
        width: '100%',
        maxWidth: MaxContentWidth,
        zIndex: 99999,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#F0F0F0',
      },
      default: {},
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    gap: 10,
    zIndex: 20,
  },
  modalBackBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSearchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  modalSearchInputNew: {
    flex: 1,
    fontSize: 15,
    color: '#222222',
    ...Platform.select({
      web: {
        // biome-ignore lint/suspicious/noExplicitAny: Outline style for web input
        outlineStyle: 'none' as any,
      },
      default: {},
    }),
  },

  // 카테고리 드롭다운 (검색 모달)
  categoryDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCEFE9',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  categoryDropdownBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E06635',
  },
  categoryDropdownChevron: {
    fontSize: 10,
    color: '#E06635',
  },
  categoryDropdownMenu: {
    position: 'absolute',
    top: 44,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 4,
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
      web: {
        // biome-ignore lint/suspicious/noExplicitAny: Shadow style for web
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)' as any,
      },
    }),
  },
  categoryDropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryDropdownItemActive: {
    backgroundColor: '#FCEFE9',
  },
  categoryDropdownItemText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  categoryDropdownItemTextActive: {
    color: '#E06635',
    fontWeight: '700',
  },

  // 검색 결과 (이름 + 주소 심플 리스트)
  searchResultItem: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  searchResultAddr: {
    fontSize: 13,
    color: '#888888',
  },

  suggestionListNew: {
    paddingHorizontal: Spacing.four,
    paddingTop: 8,
    paddingBottom: 100,
  },
  emptySearchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    gap: 16,
  },
  emptySearchText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  customAddBtn: {
    backgroundColor: '#FCEFE9',
    borderWidth: 1,
    borderColor: '#E06635',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  customAddBtnText: {
    color: '#E06635',
    fontSize: 13,
    fontWeight: '700',
  },
});
