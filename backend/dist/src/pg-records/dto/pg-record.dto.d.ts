import { PgStatus } from '../../common/enums';
export declare class CreatePgRecordDto {
    employeeName: string;
    branchId?: string;
    address: string;
    rentAmount: number;
    agreementStart: string;
    agreementEnd: string;
    contactPhone?: string;
    notes?: string;
    raisedBy?: string;
    location?: string;
    fileAttachment?: string;
    reminderDays?: number;
}
export declare class UpdatePgRecordDto {
    employeeName?: string;
    branchId?: string;
    address?: string;
    rentAmount?: number;
    agreementStart?: string;
    agreementEnd?: string;
    contactPhone?: string;
    status?: PgStatus;
    notes?: string;
    raisedBy?: string;
    location?: string;
    fileAttachment?: string;
    reminderDays?: number;
}
