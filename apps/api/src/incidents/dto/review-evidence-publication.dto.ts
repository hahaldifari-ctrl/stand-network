import { EvidencePublicationDecision } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class ReviewEvidencePublicationDto {
  @IsEnum(EvidencePublicationDecision)
  decision!: EvidencePublicationDecision;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string;
}