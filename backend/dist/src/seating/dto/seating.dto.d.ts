export declare class CreateSeatingRecordDto {
    branchId: string;
    floor: string;
    zone?: string;
    totalSeats: number;
    occupiedSeats: number;
    recordDate?: string;
    notes?: string;
}
export declare class UpdateSeatingRecordDto {
    floor?: string;
    zone?: string;
    totalSeats?: number;
    occupiedSeats?: number;
    recordDate?: string;
    notes?: string;
}
