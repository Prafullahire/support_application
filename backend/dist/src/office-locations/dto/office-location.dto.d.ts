export declare class CreateOfficeLocationDto {
    name: string;
    branchId: string;
    latitude: number;
    longitude: number;
    allowedRadiusMeters?: number;
    isActive?: boolean;
}
export declare class UpdateOfficeLocationDto {
    name?: string;
    branchId?: string;
    latitude?: number;
    longitude?: number;
    allowedRadiusMeters?: number;
    isActive?: boolean;
}
