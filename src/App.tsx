import React from 'react';
import { cn } from '@/shared';
import { ParkingCalculator } from '@/widgets/ParkingCalculator';

function App() {
  return (
    <React.Fragment>
      <div className={cn('min-h-screen bg-gray-50')}>
        <div className={cn('container mx-auto max-w-4xl px-4 py-8')}>
          <main className={cn('mb-12')}>
            <ParkingCalculator />
          </main>

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
