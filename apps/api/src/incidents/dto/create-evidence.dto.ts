import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
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
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsString()
  credit?: string;

  @IsOptional()
  @IsString()
  license?: string;

  @IsOptional()
  @IsEnum(EvidenceContentRating)
  contentRating?: EvidenceContentRating;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsString()
  storageKey?: string;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsDateString()
  capturedAt?: string;

  @IsOptional()
  @IsString()
  sourceId?: string;
}