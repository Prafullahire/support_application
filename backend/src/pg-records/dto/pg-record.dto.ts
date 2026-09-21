import { PgStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePgRecordDto {
  @IsString()
  employeeName: string;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsString()
  address: string;

  @IsNumber()
  rentAmount: number;

  @IsDateString()
  agreementStart: string;

  @IsDateString()
  agreementEnd: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePgRecordDto {
  @IsOptional()
  @IsString()
  employeeName?: string;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  rentAmount?: number;

  @IsOptional()
  @IsDateString()
  agreementStart?: string;

  @IsOptional()
  @IsDateString()
  agreementEnd?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsEnum(PgStatus)
  status?: PgStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
