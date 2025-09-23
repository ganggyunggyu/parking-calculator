import type { ParkingCalculation, TimeRange } from '@/entities/parking';

// 상수 정의
const MINUTES_PER_TICKET = 10; // 10분당 1장
const FREE_INITIAL_MINUTES = 30; // 처음 30분 무료
const NIGHT_FREE_START = 18; // 18시 30분부터 무료 시작
const NIGHT_FREE_START_MINUTE = 30;
const NIGHT_FREE_END = 24; // 24시까지 무료

/**
 * 네이버 시계 기준 한국 시간 가져오기 (UTC+09:00)
 */
export const getKoreanTime = (): Date => {
  const now = new Date();
  const koreanTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  return koreanTime;
};

/**
 * 야간 무료 시간대(18:30~24:00) 계산
 */
const calculateNightFreeMinutes = (entryTime: Date, exitTime: Date): number => {
  let totalNightFreeMinutes = 0;

  const currentDate = new Date(entryTime);
  const endDate = new Date(exitTime);

  while (currentDate <= endDate) {
    const dayStart = new Date(currentDate);
    dayStart.setHours(NIGHT_FREE_START, NIGHT_FREE_START_MINUTE, 0, 0);

    const dayEnd = new Date(currentDate);
    dayEnd.setHours(NIGHT_FREE_END, 0, 0, 0);

    const overlapStart = new Date(Math.max(entryTime.getTime(), dayStart.getTime()));
    const overlapEnd = new Date(Math.min(exitTime.getTime(), dayEnd.getTime()));

    if (overlapStart < overlapEnd) {
      totalNightFreeMinutes += Math.floor((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60));
    }

    // 다음 날로 이동
    currentDate.setDate(currentDate.getDate() + 1);
    currentDate.setHours(0, 0, 0, 0);
  }

  return totalNightFreeMinutes;
};

/**
 * 주차 요금 계산 메인 함수
 */
export const calculateParkingFee = (entryTime: Date, exitTime: Date): ParkingCalculation => {
  if (entryTime >= exitTime) {
    throw new Error('출차 시간이 입차 시간보다 빨라요! 아이고난1!');
  }

  // 총 주차 시간 (분 단위)
  const totalMinutes = Math.floor((exitTime.getTime() - entryTime.getTime()) / (1000 * 60));

  // 야간 무료 시간 계산
  const nightFreeMinutes = calculateNightFreeMinutes(entryTime, exitTime);

  // 기본 무료 시간 30분과 야간 무료 시간 합산
  const totalFreeMinutes = FREE_INITIAL_MINUTES + nightFreeMinutes;

  // 유료 시간 계산 (총 시간에서 무료 시간 차감)
  const chargeableMinutes = Math.max(0, totalMinutes - totalFreeMinutes);

  // 필요한 주차권 수 (10분 단위로 올림)
  const ticketsRequired = Math.ceil(chargeableMinutes / MINUTES_PER_TICKET);

  return {
    totalMinutes,
    freeMinutes: Math.min(totalMinutes, totalFreeMinutes),
    nightFreeMinutes,
    chargeableMinutes,
    ticketsRequired
  };
};

/**
 * 시간을 "X시간 Y분" 형태로 포맷팅
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}분`;
  } else if (remainingMinutes === 0) {
    return `${hours}시간`;
  } else {
    return `${hours}시간 ${remainingMinutes}분`;
  }
};

/**
 * 날짜를 "YYYY-MM-DD HH:mm" 형태로 포맷팅
 */
export const formatDateTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};