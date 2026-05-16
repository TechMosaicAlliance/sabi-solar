import type { backendInterface } from "../backend";
import { EnergyType, NotificationType, PropertyStatus } from "../backend";

export const mockBackend: backendInterface = {
  authenticate: async (_email: string, _hashedPassword: string) => ({
    __kind__: "ok",
    ok: {
      id: BigInt(1),
      name: "Adebayo Okafor",
      email: "adebayo@email.com",
      phone: "+2348012345678",
    },
  }),
  registerUser: async (name: string, email: string, phone: string, _hashedPassword: string) => ({
    __kind__: "ok",
    ok: {
      id: BigInt(2),
      name,
      email,
      phone,
    },
  }),
  getProperties: async (_userId) => [
    {
      id: BigInt(1),
      userId: BigInt(1),
      title: "Main House",
      address: "12 Lekki Phase 1, Lagos",
      meterNumber: "MTR-2024-001",
      modelNumber: "SLR-5KVA-2024",
      capacityKva: 5.0,
      status: PropertyStatus.Online,
    },
    {
      id: BigInt(2),
      userId: BigInt(1),
      title: "Office",
      address: "45 Victoria Island, Lagos",
      meterNumber: "MTR-2024-002",
      modelNumber: "SLR-10KVA-2024",
      capacityKva: 10.0,
      status: PropertyStatus.Online,
    },
  ],
  createProperty: async (userId, title, address, meterNumber, capacityKva, modelNumber) => ({
    id: BigInt(3),
    userId,
    title,
    address,
    meterNumber,
    modelNumber,
    capacityKva,
    status: PropertyStatus.Online,
  }),
  getEnergyLogs: async (_propertyId, _hours) => {
    const now = BigInt(Date.now()) * BigInt(1_000_000);
    const hourMs = BigInt(3_600_000_000_000);
    return Array.from({ length: 24 }, (_, i) => [
      {
        id: BigInt(i * 2 + 1),
        propertyId: BigInt(1),
        energyType: EnergyType.Solar,
        kwhValue: Math.max(0, 2.5 + Math.sin(i / 3) * 1.8),
        co2Offset: Math.max(0, 1.2 + Math.sin(i / 3) * 0.9),
        timestamp: now - BigInt(23 - i) * hourMs,
      },
      {
        id: BigInt(i * 2 + 2),
        propertyId: BigInt(1),
        energyType: EnergyType.Grid,
        kwhValue: Math.max(0, 0.8 + Math.cos(i / 4) * 0.5),
        co2Offset: 0,
        timestamp: now - BigInt(23 - i) * hourMs,
      },
    ]).flat();
  },
  addEnergyLog: async (propertyId, energyType, kwhValue, co2Offset) => ({
    id: BigInt(999),
    propertyId,
    energyType,
    kwhValue,
    co2Offset,
    timestamp: BigInt(Date.now()) * BigInt(1_000_000),
  }),
  getNotifications: async (_userId) => [
    {
      id: BigInt(1),
      userId: BigInt(1),
      notificationType: NotificationType.Warning,
      message: "Excessive consumption detected at Main House — 42% above average",
      isRead: false,
      createdAt: BigInt(Date.now() - 3_600_000) * BigInt(1_000_000),
    },
    {
      id: BigInt(2),
      userId: BigInt(1),
      notificationType: NotificationType.Info,
      message: "Solar generation peaked at 4.8 kWh today — great solar conditions!",
      isRead: true,
      createdAt: BigInt(Date.now() - 7_200_000) * BigInt(1_000_000),
    },
    {
      id: BigInt(3),
      userId: BigInt(1),
      notificationType: NotificationType.Warning,
      message: "Inverter health check recommended for Office property",
      isRead: false,
      createdAt: BigInt(Date.now() - 86_400_000) * BigInt(1_000_000),
    },
  ],
  markNotificationRead: async (_notifId) => true,
};
