
import { EvidenceReviewDecision } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class ReviewEvidenceDto {
  @IsEnum(EvidenceReviewDecision)
  decision!: EvidenceReviewDecision;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string;
}
