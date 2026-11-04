import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import {
  EvidenceContentRating,
  EvidenceType,
} from '@prisma/client';

export class CreateEvidenceDto {
  @IsEnum(EvidenceType)
  type!: EvidenceType;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  caption?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  credit?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  license?: string;

  @IsOptional()
  @IsEnum(EvidenceContentRating)
  contentRating?: EvidenceContentRating;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  storageKey?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  mimeType?: string;

  @IsOptional()
  @IsDateString()
  capturedAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(191)
  sourceId?: string;
}