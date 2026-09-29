import { RequestStatus } from '../../common/enums';
export declare class CreateRequestDto {
    title: string;
    description?: string;
    type: string;
    status?: RequestStatus;
    branchId?: string;
    assignedToId?: string;
}
export declare class UpdateRequestDto {
    title?: string;
    description?: string;
    type?: string;
    status?: RequestStatus;
    branchId?: string;
    assignedToId?: string;
}
