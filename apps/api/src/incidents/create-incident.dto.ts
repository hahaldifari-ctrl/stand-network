import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { IncidentType } from '@prisma/client';

export class CreateIncidentDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  @MaxLength(200)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  @MaxLength(10000)
  description!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  @MaxLength(120)
  state!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  lga?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  community?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  region?: string;

  @IsOptional()
  @IsDateString()
  incidentDate?: string;

  @IsEnum(IncidentType)
  incidentType!: IncidentType;

  @IsOptional()
  @IsInt()
  @Min(0)
  affectedPeopleCount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  sourceSummary?: string;
}