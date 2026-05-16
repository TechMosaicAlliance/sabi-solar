import type { AppNotification, HourlyEnergyData, Property } from "@/types";

export function generateMockEnergyData(hours = 24): HourlyEnergyData[] {
  return Array.from({ length: hours }, (_, i) => {
    const hour = i;
    const label =
      hour === 0
        ? "12am"
        : hour < 12
          ? `${hour}am`
          : hour === 12
            ? "12pm"
            : `${hour - 12}pm`;
    // Solar peaks mid-day, grid fills in gaps
    const solarPeak = Math.sin(((hour - 6) / 12) * Math.PI);
    const solar =
      hour >= 6 && hour <= 18
        ? Math.max(0, solarPeak * 4.2 + (Math.random() - 0.5) * 0.5)
        : 0;
    const grid = Math.max(0, 1.8 + (Math.random() - 0.5) * 0.8 - solar * 0.4);
    return {
      hour: label,
      solar: Number.parseFloat(solar.toFixed(2)),
      grid: Number.parseFloat(grid.toFixed(2)),
    };
  });
}

export const MOCK_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    userId: "user-1",
    title: "Main House",
    modelNumber: "SL-5KVA-PRO",
    capacityKva: 5,
    meterNumber: "MTR-045892",
    address: "14 Adeleke Street, Lekki Phase 1, Lagos",
    status: "Online",
  },
  {
    id: "prop-2",
    userId: "user-1",
    title: "Office Block",
    modelNumber: "SL-10KVA-ENT",
    capacityKva: 10,
    meterNumber: "MTR-078234",
    address: "3rd Floor, Victoria Island Business Centre, Lagos",
    status: "Online",
  },
  {
    id: "prop-3",
    userId: "user-1",
    title: "Beach House",
    modelNumber: "SL-3KVA-LITE",
    capacityKva: 3,
    meterNumber: "MTR-091156",
    address: "Plot 7, Ajah Waterfront Estate, Lagos",
    status: "Offline",
  },
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    userId: "user-1",
    type: "Warning",
    message:
      "Main House: Consumption exceeded 4.8 kWh — 32% above daily average.",
    isRead: false,
    createdAt: Date.now() - 1000 * 60 * 18,
  },
  {
    id: "notif-2",
    userId: "user-1",
    type: "Info",
    message: "Office Block: Inverter health check passed. All systems nominal.",
    isRead: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: "notif-3",
    userId: "user-1",
    type: "Info",
    message: "Beach House is currently offline. Check inverter connection.",
    isRead: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: "notif-4",
    userId: "user-1",
    type: "Warning",
    message:
      "Low battery reserve detected on Beach House. Below 20% threshold.",
    isRead: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
];
