import { IsEnum, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { NeedUrgency } from '@prisma/client';

export class CreateNeedDto {
  @IsString()
  @MinLength(3)
  title!: string;

  @IsString()
  @MinLength(10)
  description!: string;

  @IsString()
  @MinLength(2)
  location!: string;

  @IsOptional()
  @IsString()
  community?: string;

  @IsEnum(NeedUrgency)
  urgency!: NeedUrgency;

  @IsUUID()
  organizationId!: string;
}