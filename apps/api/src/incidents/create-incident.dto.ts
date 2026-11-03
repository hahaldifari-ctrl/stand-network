import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { IncidentType } from '@prisma/client';

export class CreateIncidentDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  state!: string;

  @IsOptional()
  @IsString()
  lga?: string;

  @IsOptional()
  @IsString()
  community?: string;

  @IsOptional()
  @IsString()
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
  sourceSummary?: string;
}