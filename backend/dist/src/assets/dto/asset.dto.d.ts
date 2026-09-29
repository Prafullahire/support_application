import { AssetStatus } from '../../common/enums';
export declare class CreateAssetDto {
    name: string;
    serialNumber?: string;
    description?: string;
    categoryId?: string;
    branchId?: string;
    employeeCode?: string;
    employeeName?: string;
    location?: string;
    purchaseDate?: string;
    assignedDate?: string;
    warrantyEnd?: string;
}
export declare class UpdateAssetDto {
    name?: string;
    serialNumber?: string;
    description?: string;
    categoryId?: string;
    branchId?: string;
    employeeCode?: string;
    employeeName?: string;
    location?: string;
    status?: AssetStatus;
    purchaseDate?: string;
    assignedDate?: string;
    warrantyEnd?: string;
}
export declare class AssignAssetDto {
    userId: string;
    condition?: string;
    notes?: string;
}
export declare class ReturnAssetDto {
    condition?: string;
    notes?: string;
}
export declare class CreateAssetCategoryDto {
    name: string;
}
export declare class UpdateAssetCategoryDto {
    name?: string;
    isActive?: boolean;
}
