import { IncidentPublicationDecision } from '@prisma/client';
import { IsEnum, IsString, Matches, MaxLength } from 'class-validator';

export class ReviewIncidentPublicationDto {
  @IsEnum(IncidentPublicationDecision)
  decision!: IncidentPublicationDecision;

  @IsString()
  @Matches(/\S/, {
    message: 'Review notes must contain non-whitespace characters',
  })
  @MaxLength(5000)
  notes!: string;
}
