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
  {
    id: "notif-5",
    userId: "user-1",
    type: "Warning",
    message:
      "High grid consumption detected on Main House. Grid usage is 2.1x above solar output.",
    isRead: false,
    createdAt: Date.now() - 1000 * 60 * 35,
  },
  {
    id: "notif-6",
    userId: "user-1",
    type: "Warning",
    message:
      "Battery charging rate abnormal on Office Block. Expected 1.8A but receiving 0.4A — check connections.",
    isRead: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
  },
  {
    id: "notif-7",
    userId: "user-1",
    type: "Warning",
    message:
      "Solar output below expected on Main House. Panels generating 1.2 kWh vs forecast 3.8 kWh — possible obstruction.",
    isRead: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
  },
  {
    id: "notif-8",
    userId: "user-1",
    type: "Info",
    message:
      "System firmware update available (v2.4.1). Improves battery efficiency by up to 8%. Schedule during off-peak hours.",
    isRead: false,
    createdAt: Date.now() - 1000 * 60 * 50,
  },
  {
    id: "notif-9",
    userId: "user-1",
    type: "Info",
    message:
      "Peak solar hours approaching. Expect maximum generation between 11:00 AM and 2:00 PM today.",
    isRead: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 7,
  },
  {
    id: "notif-10",
    userId: "user-1",
    type: "Info",
    message:
      "Monthly energy report for May is ready. Total solar generation: 142.6 kWh. View your full summary.",
    isRead: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
  },
  {
    id: "notif-11",
    userId: "user-1",
    type: "Info",
    message:
      "CO2 savings milestone reached: 500 kg of CO2 offset across all your properties this year.",
    isRead: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 36,
  },
];
