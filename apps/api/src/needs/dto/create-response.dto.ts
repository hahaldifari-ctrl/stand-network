import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ResponseType } from '@prisma/client';

export class CreateResponseDto {
  @IsEnum(ResponseType)
  type!: ResponseType;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsUUID()
  organizationId?: string;
}