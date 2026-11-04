import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
} from 'class-validator';
import { SourceType } from '@prisma/client';

export class CreateSourceDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  @MaxLength(200)
  name!: string;

  @IsEnum(SourceType)
  sourceType!: SourceType;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  title?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  publisher?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  author?: string;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string;
}