import type { ParkingRecord } from '@/entities/parking';

const STORAGE_KEY = 'parking-records';

/**
 * 로컬스토리지에서 주차 기록 조회
 */
export const getParkingRecords = (): ParkingRecord[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const records = JSON.parse(stored);
    return records.map((record: any) => ({
      ...record,
      entryTime: new Date(record.entryTime),
      exitTime: new Date(record.exitTime),
      createdAt: new Date(record.createdAt),
    }));
  } catch (error) {
    console.error('주차 기록 로드 실패:', error);
    return [];
  }
};

/**
 * 로컬스토리지에 주차 기록 저장
 */
export const saveParkingRecord = (record: Omit<ParkingRecord, 'id' | 'createdAt'>): ParkingRecord => {
  try {
    const records = getParkingRecords();
    const newRecord: ParkingRecord = {
      ...record,
      id: generateId(),
      createdAt: new Date(),
    };

    const updatedRecords = [newRecord, ...records];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));

    return newRecord;
  } catch (error) {
    console.error('주차 기록 저장 실패:', error);
    throw new Error('저장에 실패했습니다');
  }
};

/**
 * 주차 기록 삭제
 */
export const deleteParkingRecord = (id: string): void => {
  try {
    const records = getParkingRecords();
    const filteredRecords = records.filter(record => record.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecords));
  } catch (error) {
    console.error('주차 기록 삭제 실패:', error);
    throw new Error('삭제에 실패했습니다');
  }
};

/**
 * 모든 주차 기록 삭제
 */
export const clearParkingRecords = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('전체 주차 기록 삭제 실패:', error);
    throw new Error('전체 삭제에 실패했습니다');
  }
};

/**
 * 고유 ID 생성
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};