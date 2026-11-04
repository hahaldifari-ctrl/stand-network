import { validate } from 'class-validator';
import {
  EvidenceContentRating,
  EvidencePublicationDecision,
  EvidenceReviewDecision,
  EvidenceType,
  IncidentType,
  SourceType,
  VerificationDecision,
} from '@prisma/client';

import { CreateIncidentDto } from './create-incident.dto';
import { CreateSourceDto } from './dto/create-source.dto';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { CreateVerificationReviewDto } from './dto/create-verification-review.dto';
import { ReviewEvidenceDto } from './dto/review-evidence.dto';
import { ReviewEvidencePublicationDto } from './dto/review-evidence-publication.dto';

function firstEnumValue<T extends object>(values: T): T[keyof T] {
  return Object.values(values)[0] as T[keyof T];
}

describe('Incident DTO validation', () => {
  const incidentType = firstEnumValue(IncidentType);
  const sourceType = firstEnumValue(SourceType);
  const evidenceType = firstEnumValue(EvidenceType);
  const contentRating = firstEnumValue(EvidenceContentRating);
  const verificationDecision = firstEnumValue(VerificationDecision);
  const evidenceReviewDecision = firstEnumValue(EvidenceReviewDecision);
  const publicationDecision = firstEnumValue(EvidencePublicationDecision);

  it('accepts a valid incident with optional fields omitted', async () => {
    const dto = Object.assign(new CreateIncidentDto(), {
      title: 'Community attack',
      description: 'A reported incident affecting a local community.',
      state: 'Plateau',
      incidentType,
    });

    expect(await validate(dto)).toHaveLength(0);
  });

  it.each(['', '   ', '\t\n'])(
    'rejects a blank incident title: %j',
    async (title) => {
      const dto = Object.assign(new CreateIncidentDto(), {
        title,
        description: 'Incident description',
        state: 'Plateau',
        incidentType,
      });

      expect(await validate(dto)).not.toHaveLength(0);
    },
  );

  it('rejects an incident description exceeding 10000 characters', async () => {
    const dto = Object.assign(new CreateIncidentDto(), {
      title: 'Community attack',
      description: 'A'.repeat(10001),
      state: 'Plateau',
      incidentType,
    });

    expect(await validate(dto)).not.toHaveLength(0);
  });

  it('rejects an incident title exceeding 200 characters', async () => {
    const dto = Object.assign(new CreateIncidentDto(), {
      title: 'A'.repeat(201),
      description: 'Incident description',
      state: 'Plateau',
      incidentType,
    });

    expect(await validate(dto)).not.toHaveLength(0);
  });

  it('rejects a negative affected people count', async () => {
    const dto = Object.assign(new CreateIncidentDto(), {
      title: 'Community attack',
      description: 'Incident description',
      state: 'Plateau',
      incidentType,
      affectedPeopleCount: -1,
    });

    expect(await validate(dto)).not.toHaveLength(0);
  });

  it('accepts a valid source with optional fields omitted', async () => {
    const dto = Object.assign(new CreateSourceDto(), {
      name: 'Local news report',
      sourceType,
    });

    expect(await validate(dto)).toHaveLength(0);
  });

  it('rejects a whitespace-only source name', async () => {
    const dto = Object.assign(new CreateSourceDto(), {
      name: '   ',
      sourceType,
    });

    expect(await validate(dto)).not.toHaveLength(0);
  });

  it('rejects a source name exceeding 200 characters', async () => {
    const dto = Object.assign(new CreateSourceDto(), {
      name: 'A'.repeat(201),
      sourceType,
    });

    expect(await validate(dto)).not.toHaveLength(0);
  });

  it('rejects an invalid source URL', async () => {
    const dto = Object.assign(new CreateSourceDto(), {
      name: 'Local news report',
      sourceType,
      url: 'not-a-valid-url',
    });

    expect(await validate(dto)).not.toHaveLength(0);
  });

  it('accepts valid evidence with optional fields omitted', async () => {
    const dto = Object.assign(new CreateEvidenceDto(), {
      type: evidenceType,
    });

    expect(await validate(dto)).toHaveLength(0);
  });

  it('accepts valid evidence content rating when supplied', async () => {
    const dto = Object.assign(new CreateEvidenceDto(), {
      type: evidenceType,
      contentRating,
    });

    expect(await validate(dto)).toHaveLength(0);
  });

  it('rejects evidence descriptions exceeding 5000 characters', async () => {
    const dto = Object.assign(new CreateEvidenceDto(), {
      type: evidenceType,
      description: 'A'.repeat(5001),
    });

    expect(await validate(dto)).not.toHaveLength(0);
  });

  it('rejects evidence credit exceeding 500 characters', async () => {
    const dto = Object.assign(new CreateEvidenceDto(), {
      type: evidenceType,
      credit: 'A'.repeat(501),
    });

    expect(await validate(dto)).not.toHaveLength(0);
  });

  it('rejects an invalid evidence URL', async () => {
    const dto = Object.assign(new CreateEvidenceDto(), {
      type: evidenceType,
      url: 'not-a-valid-url',
    });

    expect(await validate(dto)).not.toHaveLength(0);
  });

  it('accepts a verification review with optional notes omitted', async () => {
    const dto = Object.assign(new CreateVerificationReviewDto(), {
      decision: verificationDecision,
    });

    expect(await validate(dto)).toHaveLength(0);
  });

  it('rejects verification notes exceeding 5000 characters', async () => {
    const dto = Object.assign(new CreateVerificationReviewDto(), {
      decision: verificationDecision,
      notes: 'A'.repeat(5001),
    });

    expect(await validate(dto)).not.toHaveLength(0);
  });

  it('accepts an evidence review with optional notes omitted', async () => {
    const dto = Object.assign(new ReviewEvidenceDto(), {
      decision: evidenceReviewDecision,
    });

    expect(await validate(dto)).toHaveLength(0);
  });

  it('rejects evidence review notes exceeding 5000 characters', async () => {
    const dto = Object.assign(new ReviewEvidenceDto(), {
      decision: evidenceReviewDecision,
      notes: 'A'.repeat(5001),
    });

    expect(await validate(dto)).not.toHaveLength(0);
  });

  it('accepts a publication review with optional notes omitted', async () => {
    const dto = Object.assign(new ReviewEvidencePublicationDto(), {
      decision: publicationDecision,
    });

    expect(await validate(dto)).toHaveLength(0);
  });

  it('rejects publication review notes exceeding 5000 characters', async () => {
    const dto = Object.assign(new ReviewEvidencePublicationDto(), {
      decision: publicationDecision,
      notes: 'A'.repeat(5001),
    });

    expect(await validate(dto)).not.toHaveLength(0);
  });
});