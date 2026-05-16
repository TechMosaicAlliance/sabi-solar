export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender?: string;
  dob?: string;
}

export interface Property {
  id: string;
  userId: string;
  title: string;
  modelNumber: string;
  capacityKva: number;
  meterNumber: string;
  address: string;
  status: "Online" | "Offline";
}

export interface EnergyLog {
  id: string;
  propertyId: string;
  type: "Solar" | "Grid";
  kwhValue: number;
  co2Offset: number;
  timestamp: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: "Warning" | "Info";
  message: string;
  isRead: boolean;
  createdAt: number;
}

export interface HourlyEnergyData {
  hour: string;
  solar: number;
  grid: number;
}

export type EnergySource = "Solar" | "Grid";
