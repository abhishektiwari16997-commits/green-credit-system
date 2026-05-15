import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserProfile {
    name: string;
}
export type PositiveFloat = number;
export interface RestorationSubmission {
    id: bigint;
    files: Array<ExternalBlob>;
    status: SubmissionStatus;
    completionDate: string;
    submittedAt: bigint;
    description: string;
    reviewerNote: string;
    projectId: bigint;
}
export type SubmissionId = bigint;
export type ProjectId = bigint;
export interface Project {
    id: bigint;
    status: ProjectStatus;
    country: string;
    endDate: string;
    ownerName: string;
    projectType: string;
    gpsCoordinates: string;
    createdAt: bigint;
    landAreaHectares: PositiveFloat;
    creditsPurchased: bigint;
    creditsRequired: bigint;
    startDate: string;
}
export interface GlobalStats {
    countriesActive: bigint;
    totalCreditsIssued: bigint;
    projectsVerified: bigint;
    totalLandRestored: PositiveFloat;
}
export enum ProjectStatus {
    verified = "verified",
    pending = "pending",
    rejected = "rejected",
    inProgress = "inProgress"
}
export enum SubmissionStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approveRestoration(id: SubmissionId): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAdminSubmissions(): Promise<Array<RestorationSubmission>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGlobalStats(): Promise<GlobalStats>;
    getGreenMap(): Promise<Array<Project>>;
    getProject(id: ProjectId): Promise<Project | null>;
    getProjects(): Promise<Array<Project>>;
    getRestorationSubmissions(): Promise<Array<RestorationSubmission>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    purchaseCredits(projectId: ProjectId, amount: bigint): Promise<boolean>;
    rejectRestoration(id: SubmissionId, note: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitProject(ownerName: string, country: string, projectType: string, landAreaHectares: PositiveFloat, gpsCoordinates: string, startDate: string, endDate: string): Promise<ProjectId>;
    submitRestoration(projectId: ProjectId, description: string, completionDate: string, files: Array<ExternalBlob>): Promise<SubmissionId>;
    updateProjectStatus(id: ProjectId, status: ProjectStatus): Promise<boolean>;
}
