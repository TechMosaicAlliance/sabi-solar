import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = bigint;
export type Timestamp = bigint;
export interface UserPublic {
    id: UserId;
    name: string;
    email: string;
    phone: string;
}
export type PropertyId = bigint;
export interface Property {
    id: PropertyId;
    status: PropertyStatus;
    title: string;
    meterNumber: string;
    userId: UserId;
    modelNumber: string;
    address: string;
    capacityKva: number;
}
export type NotificationId = bigint;
export interface Notification {
    id: NotificationId;
    userId: UserId;
    notificationType: NotificationType;
    createdAt: Timestamp;
    isRead: boolean;
    message: string;
}
export interface EnergyLog {
    id: LogId;
    co2Offset: number;
    propertyId: PropertyId;
    kwhValue: number;
    timestamp: Timestamp;
    energyType: EnergyType;
}
export type AuthResult = {
    __kind__: "ok";
    ok: UserPublic;
} | {
    __kind__: "err";
    err: string;
};
export type LogId = bigint;
export enum EnergyType {
    Solar = "Solar",
    Grid = "Grid"
}
export enum NotificationType {
    Info = "Info",
    Warning = "Warning"
}
export enum PropertyStatus {
    Online = "Online",
    Offline = "Offline"
}
export interface backendInterface {
    addEnergyLog(propertyId: PropertyId, energyType: EnergyType, kwhValue: number, co2Offset: number): Promise<EnergyLog>;
    authenticate(email: string, hashedPassword: string): Promise<AuthResult>;
    createProperty(userId: UserId, title: string, address: string, meterNumber: string, capacityKva: number, modelNumber: string): Promise<Property>;
    getEnergyLogs(propertyId: PropertyId, hours: bigint): Promise<Array<EnergyLog>>;
    getNotifications(userId: UserId): Promise<Array<Notification>>;
    getProperties(userId: UserId): Promise<Array<Property>>;
    markNotificationRead(notifId: NotificationId): Promise<boolean>;
    registerUser(name: string, email: string, phone: string, hashedPassword: string): Promise<AuthResult>;
}
