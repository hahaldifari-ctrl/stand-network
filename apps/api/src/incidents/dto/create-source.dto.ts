import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { SourceType } from '@prisma/client';

export class CreateSourceDto {
  @IsString()
  name!: string;

  @IsEnum(SourceType)
  sourceType!: SourceType;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
