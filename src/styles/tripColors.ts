// 여행/초대 관련 화면(내 여행, 여행 초대장)에서만 쓰는 색상.
// 공용 theme.ts의 brandPrimary 등을 건드리면 다른 화면(탭바 등)에도 영향이 가서 별도로 분리함.
export const TripColors = {
  /** 삭제 버튼 / 초대 거부 */
  danger: '#EE6019',
  /** 초대 수락 */
  success: '#85C335',
  /** 카드 제목 등 기본 글씨색 */
  titleText: '#92390D',
  /** '일반' 태그 박스 */
  tagGeneral: '#FFCE7F',
  /** '혼자' 등 일반 태그 외 박스 */
  tagNeutral: '#D3D3D3',
  /** 화면 배경 */
  screenBackground: '#F0EFED',
} as const;
