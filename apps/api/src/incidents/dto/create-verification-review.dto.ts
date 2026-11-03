import { IsEnum, IsOptional, IsString } from 'class-validator';
import { VerificationDecision } from '@prisma/client';

export class CreateVerificationReviewDto {
  @IsEnum(VerificationDecision)
  decision!: VerificationDecision;

  @IsOptional()
  @IsString()
  notes?: string;
}