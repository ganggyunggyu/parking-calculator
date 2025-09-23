import React from 'react';
import { cn } from '@/shared';
import { ParkingCalculator } from '@/widgets/ParkingCalculator';

function App() {
  return (
    <React.Fragment>
      <div className={cn('min-h-screen bg-gray-50')}>
        <div className={cn('container mx-auto max-w-4xl px-4 py-8')}>
          {/* 헤더 섹션 */}
          <header className={cn('text-center mb-8')}>
            <div className={cn('mb-6')}>
              <div className={cn(
                'inline-flex items-center justify-center w-16 h-16 mb-6',
                'bg-blue-600 rounded-2xl'
              )}>
                <span className={cn('text-2xl')}>🚗</span>
              </div>
            </div>

            <h1 className={cn(
              'text-3xl md:text-4xl font-bold text-gray-900 mb-3'
            )}>
              문파크 주차장
            </h1>

            <p className={cn('text-gray-600 text-lg mb-2')}>
              주차 요금 계산기
            </p>

            <p className={cn('text-gray-500 text-sm')}>
              네이버 시계 기준 한국시간 (UTC+09:00) • 야간무료 18:30~24:00
            </p>
          </header>

          {/* 메인 컨텐츠 */}
          <main className={cn('mb-12')}>
            <ParkingCalculator />
          </main>

          {/* 푸터 */}
          <footer className={cn('text-center')}>
            <p className={cn('text-gray-400 text-sm')}>
              © 2024 문파크 주차장 계산기
            </p>
          </footer>
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
