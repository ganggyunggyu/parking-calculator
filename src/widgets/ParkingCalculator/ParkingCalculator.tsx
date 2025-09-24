import React from 'react';
import { cn } from '@/shared';
import { Card, CardContent, Input, Button } from '@/shared/ui';
import { calculateParkingFee, formatDuration, getKoreanTime } from '@/features/parking-calculator';
import { saveParkingRecord } from '@/features/parking-storage';
import type { ParkingCalculation } from '@/entities/parking';

export const ParkingCalculator = () => {
  // input[type="datetime-local"] 형식으로 변환
  const formatDateTimeForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // 초기값을 오늘 날짜로 설정
  const getInitialDateTime = (addDays: number = 0) => {
    const now = getKoreanTime();
    now.setDate(now.getDate() + addDays);
    now.setMinutes(0, 0, 0); // 분/초를 00으로 설정
    return formatDateTimeForInput(now);
  };

  const [entryTime, setEntryTime] = React.useState(getInitialDateTime(0)); // 오늘
  const [exitTime, setExitTime] = React.useState(getInitialDateTime(1)); // 내일
  const [calculation, setCalculation] = React.useState<ParkingCalculation | null>(null);
  const [error, setError] = React.useState('');
  const [isCalculating, setIsCalculating] = React.useState(false);

  // 시간 설정 함수들
  const setCurrentEntryTime = () => {
    const now = getKoreanTime();
    setEntryTime(formatDateTimeForInput(now));
  };

  const setCurrentExitTime = () => {
    const now = getKoreanTime();
    setExitTime(formatDateTimeForInput(now));
  };

  // 편의 함수들
  const setTodayEntry = () => {
    setEntryTime(getInitialDateTime(0));
  };

  const setTomorrowExit = () => {
    setExitTime(getInitialDateTime(1));
  };

  const setEntryTimeWithHours = (hours: number) => {
    const now = getKoreanTime();
    now.setHours(hours, 0, 0, 0);
    setEntryTime(formatDateTimeForInput(now));
  };

  const setExitTimeWithHours = (hours: number) => {
    const now = getKoreanTime();
    now.setHours(hours, 0, 0, 0);
    setExitTime(formatDateTimeForInput(now));
  };

  // 요금 계산
  const handleCalculate = async () => {
    try {
      setError('');
      setIsCalculating(true);

      if (!entryTime || !exitTime) {
        setError('입차 시간과 출차 시간을 모두 입력해주세요!');
        setIsCalculating(false);
        return;
      }

      // 계산 애니메이션을 위한 딜레이
      await new Promise(resolve => setTimeout(resolve, 800));

      const entry = new Date(entryTime);
      const exit = new Date(exitTime);

      const result = calculateParkingFee(entry, exit);
      setCalculation(result);

    } catch (err) {
      setError(err instanceof Error ? err.message : '계산 중 오류가 발생했습니다');
      setCalculation(null);
    } finally {
      setIsCalculating(false);
    }
  };

  // 기록 저장
  const handleSave = () => {
    if (!calculation || !entryTime || !exitTime) return;

    try {
      const entry = new Date(entryTime);
      const exit = new Date(exitTime);

      saveParkingRecord({
        entryTime: entry,
        exitTime: exit,
        totalMinutes: calculation.totalMinutes,
        freeMinutes: calculation.freeMinutes,
        chargeableMinutes: calculation.chargeableMinutes,
        ticketsRequired: calculation.ticketsRequired,
      });

      // 성공 애니메이션 효과
      const button = document.activeElement as HTMLButtonElement;
      if (button) {
        button.classList.add('animate-bounce');
        setTimeout(() => button.classList.remove('animate-bounce'), 1000);
      }

      alert('주차 기록이 저장되었습니다! 오옥 나이스!');

    } catch (err) {
      alert('저장 중 오류가 발생했습니다: ' + (err instanceof Error ? err.message : '알 수 없는 오류'));
    }
  };

  // 초기화
  const handleReset = () => {
    setEntryTime(getInitialDateTime(0)); // 오늘로 리셋
    setExitTime(getInitialDateTime(1)); // 내일로 리셋
    setCalculation(null);
    setError('');
  };

  return (
    <React.Fragment>
      <div className={cn('w-full max-w-2xl mx-auto')}>
        {/* 메인 계산기 카드 */}
        <Card variant="default" className={cn('bg-white border border-gray-200 shadow-sm')}>
          <CardContent className={cn('p-6')}>
            <div className={cn('mb-8')}>
              <h2 className={cn('text-xl font-semibold text-gray-900 mb-2')}>
                주차 요금 계산
              </h2>
              <p className={cn('text-gray-600 text-sm')}>
                입차 및 출차 시간을 입력하여 주차 요금을 계산하세요
              </p>
            </div>

            {/* 시간 입력 섹션 */}
            <div className={cn('space-y-6')}>
              {/* 입차 시간 */}
              <div className={cn('space-y-3')}>
                <label className={cn('block text-sm font-medium text-gray-900')}>
                  입차 시간
                </label>
                <Input
                  type="datetime-local"
                  value={entryTime}
                  onChange={(e) => setEntryTime(e.target.value)}
                  fullWidth
                  className={cn('text-gray-900')}
                />
                <div className={cn('flex flex-wrap gap-2')}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={setCurrentEntryTime}
                    className={cn('text-gray-700 border-gray-300 hover:bg-gray-50')}
                  >
                    현재 시간
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={setTodayEntry}
                    className={cn('text-gray-700 border-gray-300 hover:bg-gray-50')}
                  >
                    오늘
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEntryTimeWithHours(9)}
                    className={cn('text-gray-700 border-gray-300 hover:bg-gray-50')}
                  >
                    09:00
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEntryTimeWithHours(12)}
                    className={cn('text-gray-700 border-gray-300 hover:bg-gray-50')}
                  >
                    12:00
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEntryTimeWithHours(18)}
                    className={cn('text-gray-700 border-gray-300 hover:bg-gray-50')}
                  >
                    18:00
                  </Button>
                </div>
              </div>

              {/* 출차 시간 */}
              <div className={cn('space-y-3')}>
                <label className={cn('block text-sm font-medium text-gray-900')}>
                  출차 시간
                </label>
                <Input
                  type="datetime-local"
                  value={exitTime}
                  onChange={(e) => setExitTime(e.target.value)}
                  fullWidth
                  className={cn('text-gray-900')}
                />
                <div className={cn('flex flex-wrap gap-2')}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={setCurrentExitTime}
                    className={cn('text-gray-700 border-gray-300 hover:bg-gray-50')}
                  >
                    현재 시간
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={setTomorrowExit}
                    className={cn('text-gray-700 border-gray-300 hover:bg-gray-50')}
                  >
                    내일
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExitTimeWithHours(9)}
                    className={cn('text-gray-700 border-gray-300 hover:bg-gray-50')}
                  >
                    09:00
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExitTimeWithHours(12)}
                    className={cn('text-gray-700 border-gray-300 hover:bg-gray-50')}
                  >
                    12:00
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExitTimeWithHours(22)}
                    className={cn('text-gray-700 border-gray-300 hover:bg-gray-50')}
                  >
                    22:00
                  </Button>
                </div>
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className={cn(
                'p-4 rounded-lg border border-red-200 bg-red-50'
              )}>
                <div className={cn('flex items-center')}>
                  <span className={cn('text-lg mr-2')}>⚠️</span>
                  <p className={cn('text-red-700 font-medium text-sm')}>{error}</p>
                </div>
              </div>
            )}

            {/* 버튼 그룹 */}
            <div className={cn('flex gap-3')}>
              <Button
                variant="primary"
                fullWidth
                onClick={handleCalculate}
                disabled={isCalculating}
                className={cn(
                  'h-12 text-base font-medium',
                  'bg-blue-600 hover:bg-blue-700',
                  'disabled:opacity-50'
                )}
              >
                {isCalculating ? '계산 중...' : '요금 계산하기'}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className={cn(
                  'h-12 px-6',
                  'text-gray-700 border-gray-300 hover:bg-gray-50'
                )}
              >
                초기화
              </Button>
            </div>

            {/* 계산 결과 */}
            {calculation && (
              <div className={cn(
                'border border-gray-200 rounded-lg bg-white p-6 space-y-6'
              )}>
                <div className={cn('mb-6')}>
                  <h3 className={cn('text-lg font-semibold text-gray-900 mb-1')}>
                    계산 결과
                  </h3>
                  <p className={cn('text-gray-600 text-sm')}>
                    주차 요금 내역입니다
                  </p>
                </div>

                <div className={cn('grid grid-cols-2 gap-4')}>
                  <div className={cn('p-4 bg-gray-50 rounded-lg')}>
                    <p className={cn('text-gray-600 text-sm mb-1')}>총 주차 시간</p>
                    <p className={cn('text-lg font-semibold text-gray-900')}>
                      {formatDuration(calculation.totalMinutes)}
                    </p>
                  </div>

                  <div className={cn('p-4 bg-green-50 rounded-lg')}>
                    <p className={cn('text-green-700 text-sm mb-1')}>무료 시간</p>
                    <p className={cn('text-lg font-semibold text-green-800')}>
                      {formatDuration(calculation.freeMinutes)}
                    </p>
                  </div>

                  <div className={cn('p-4 bg-purple-50 rounded-lg')}>
                    <p className={cn('text-purple-700 text-sm mb-1')}>야간 무료</p>
                    <p className={cn('text-lg font-semibold text-purple-800')}>
                      {formatDuration(calculation.nightFreeMinutes)}
                    </p>
                  </div>

                  <div className={cn('p-4 bg-blue-50 rounded-lg')}>
                    <p className={cn('text-blue-700 text-sm mb-1')}>유료 시간</p>
                    <p className={cn('text-lg font-semibold text-blue-800')}>
                      {formatDuration(calculation.chargeableMinutes)}
                    </p>
                  </div>
                </div>

                {/* 최종 결과 */}
                <div className={cn(
                  'text-center p-6 rounded-lg bg-blue-600'
                )}>
                  <h4 className={cn('text-lg font-medium text-white mb-2')}>
                    필요한 주차권
                  </h4>
                  <p className={cn('text-3xl font-bold text-white mb-1')}>
                    {calculation.ticketsRequired}장
                  </p>
                  <p className={cn('text-blue-100 text-sm')}>
                    (10분당 1장 기준)
                  </p>
                </div>

                <Button
                  variant="secondary"
                  fullWidth
                  onClick={handleSave}
                  className={cn(
                    'h-12 text-base font-medium',
                    'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  )}
                >
                  기록 저장하기
                </Button>
              </div>
            )}

            {/* 요금 체계 안내 */}
            <div className={cn(
              'border border-gray-200 rounded-lg bg-gray-50 p-4'
            )}>
              <h4 className={cn('text-sm font-medium text-gray-900 mb-3')}>
                요금 체계 안내
              </h4>
              <div className={cn('space-y-2')}>
                <div className={cn('flex items-center text-gray-700')}>
                  <span className={cn('text-sm mr-2')}>•</span>
                  <span className={cn('text-sm')}>10분당 주차권 1장 (올림 계산)</span>
                </div>
                <div className={cn('flex items-center text-gray-700')}>
                  <span className={cn('text-sm mr-2')}>•</span>
                  <span className={cn('text-sm')}>처음 30분 무료</span>
                </div>
                <div className={cn('flex items-center text-gray-700')}>
                  <span className={cn('text-sm mr-2')}>•</span>
                  <span className={cn('text-sm')}>18:30~24:00 야간 무료</span>
                </div>
                <div className={cn('flex items-center text-gray-700')}>
                  <span className={cn('text-sm mr-2')}>•</span>
                  <span className={cn('text-sm')}>한국시간 (UTC+09:00)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </React.Fragment>
  );
};