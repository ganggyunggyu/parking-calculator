export interface ParkingRecord {
  id: string;
  entryTime: Date;
  exitTime: Date;
  totalMinutes: number;
  freeMinutes: number;
  chargeableMinutes: number;
  ticketsRequired: number;
  createdAt: Date;
}

export interface ParkingCalculation {
  totalMinutes: number;
  freeMinutes: number;
  nightFreeMinutes: number;
  chargeableMinutes: number;
  ticketsRequired: number;
}

export interface TimeRange {
  start: Date;
  end: Date;
}