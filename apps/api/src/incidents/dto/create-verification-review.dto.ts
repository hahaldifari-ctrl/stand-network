import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { VerificationDecision } from '@prisma/client';

export class CreateVerificationReviewDto {
  @IsEnum(VerificationDecision)
  decision!: VerificationDecision;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string;
}