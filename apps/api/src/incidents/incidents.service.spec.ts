import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  ConfidenceLevel,
  EvidenceContentRating,
  EvidenceReviewDecision,
  EvidencePublicationDecision,
  EvidencePublicationStatus,
  EvidenceVerificationStatus,
  IncidentPublicationDecision,
  IncidentPublicationStatus,
  IncidentStatus,
  VerificationDecision,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IncidentsService } from './incidents.service';

describe('IncidentsService', () => {
  let service: IncidentsService;

  const tx = {
    incidentPublicationReview: {
      create: jest.fn(),
    },
    evidencePublicationReview: {
      create: jest.fn(),
    },
    verificationReview: {
      create: jest.fn(),
    },
  incident: {
  update: jest.fn(),
  updateMany: jest.fn(),
},
    evidence: {
      update: jest.fn(),
      updateMany: jest.fn(),
    },
  };

  const prisma = {
    evidence: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
    source: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    incident: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const validEvidence = {
    id: 'evidence-1',
    incidentId: 'incident-1',
    verificationStatus: EvidenceVerificationStatus.VERIFIED,
    publicationStatus: EvidencePublicationStatus.PENDING,
    contentRating: EvidenceContentRating.STANDARD,
    credit: 'Photographer / Source',
    license: 'Permission granted for publication',
    incident: {
      id: 'incident-1',
      status: IncidentStatus.VERIFIED,
    },
  };

  const approvalDto = {
    decision: EvidencePublicationDecision.APPROVED,
    notes: 'Reviewed and approved for public display.',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    prisma.$transaction.mockImplementation(
      async (callback: (transaction: typeof tx) => unknown) => callback(tx),
    );

    service = new IncidentsService(prisma as unknown as PrismaService);
  });

  describe('addSource and addEvidence submitter attribution', () => {
    beforeEach(() => {
      prisma.incident.findUnique.mockResolvedValue({
        id: 'incident-1',
      });
    });

    it('should record the authenticated user when adding a source', async () => {
      const dto = {
        name: 'Trusted News Organisation',
        sourceType: 'NEWS',
        title: 'Incident report',
      };

      prisma.source.create.mockResolvedValue({
        id: 'source-1',
        incidentId: 'incident-1',
        submittedById: 'submitter-1',
      });

      await service.addSource('incident-1', dto as any, 'submitter-1');

      expect(prisma.source.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: dto.name,
          incidentId: 'incident-1',
          submittedById: 'submitter-1',
        }),
      });
    });

    it('should record the authenticated user and safe defaults when adding evidence', async () => {
      const dto = {
        type: 'IMAGE',
        title: 'Incident photograph',
      };

      prisma.evidence.create.mockResolvedValue({
        id: 'evidence-1',
        incidentId: 'incident-1',
        submittedById: 'submitter-1',
      });

      await service.addEvidence('incident-1', dto as any, 'submitter-1');

      expect(prisma.evidence.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: dto.type,
          title: dto.title,
          incidentId: 'incident-1',
          submittedById: 'submitter-1',
          contentRating: EvidenceContentRating.STANDARD,
          verificationStatus: EvidenceVerificationStatus.PENDING,
        }),
      });
    });
  });
  describe('reviewEvidencePublication', () => {
    it('should reject users without verifier or admin privileges', async () => {
      await expect(
        service.reviewEvidencePublication(
          'incident-1',
          'evidence-1',
          approvalDto as any,
          'user-1',
          'USER',
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);

      expect(prisma.evidence.findFirst).not.toHaveBeenCalled();
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should reject evidence that does not belong to the incident', async () => {
      prisma.evidence.findFirst.mockResolvedValue(null);

      await expect(
        service.reviewEvidencePublication(
          'incident-1',
          'evidence-1',
          approvalDto as any,
          'reviewer-1',
          'VERIFIER',
        ),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should reject publication when the evidence is not verified', async () => {
      prisma.evidence.findFirst.mockResolvedValue({
        ...validEvidence,
        verificationStatus: EvidenceVerificationStatus.PENDING,
      });

      await expect(
        service.reviewEvidencePublication(
          'incident-1',
          'evidence-1',
          approvalDto as any,
          'reviewer-1',
          'VERIFIER',
        ),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should reject publication when the incident is not verified', async () => {
      prisma.evidence.findFirst.mockResolvedValue({
        ...validEvidence,
        incident: {
          id: 'incident-1',
          status: IncidentStatus.UNDER_REVIEW,
        },
      });

      await expect(
        service.reviewEvidencePublication(
          'incident-1',
          'evidence-1',
          approvalDto as any,
          'reviewer-1',
          'VERIFIER',
        ),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should reject graphic evidence', async () => {
      prisma.evidence.findFirst.mockResolvedValue({
        ...validEvidence,
        contentRating: EvidenceContentRating.GRAPHIC,
      });

      await expect(
        service.reviewEvidencePublication(
          'incident-1',
          'evidence-1',
          approvalDto as any,
          'reviewer-1',
          'VERIFIER',
        ),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should reject evidence without credit or licensing information', async () => {
      prisma.evidence.findFirst.mockResolvedValue({
        ...validEvidence,
        credit: '   ',
        license: '',
      });

      await expect(
        service.reviewEvidencePublication(
          'incident-1',
          'evidence-1',
          approvalDto as any,
          'reviewer-1',
          'VERIFIER',
        ),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should reject licenses that prohibit external publication', async () => {
      prisma.evidence.findFirst.mockResolvedValue({
        ...validEvidence,
        license: 'Not for external publication',
      });

      await expect(
        service.reviewEvidencePublication(
          'incident-1',
          'evidence-1',
          approvalDto as any,
          'reviewer-1',
          'ADMIN',
        ),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should require review notes when approving publication', async () => {
      prisma.evidence.findFirst.mockResolvedValue(validEvidence);

      await expect(
        service.reviewEvidencePublication(
          'incident-1',
          'evidence-1',
          {
            decision: EvidencePublicationDecision.APPROVED,
            notes: '   ',
          } as any,
          'reviewer-1',
          'VERIFIER',
        ),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should approve eligible evidence and record the publication review', async () => {
      prisma.evidence.findFirst.mockResolvedValue(validEvidence);

      const review = {
        id: 'publication-review-1',
        decision: EvidencePublicationDecision.APPROVED,
      };

      const updatedEvidence = {
        ...validEvidence,
        publicationStatus: EvidencePublicationStatus.APPROVED,
      };

      tx.evidencePublicationReview.create.mockResolvedValue(review);
      tx.evidence.update.mockResolvedValue(updatedEvidence);

      const result = await service.reviewEvidencePublication(
        'incident-1',
        'evidence-1',
        approvalDto as any,
        'reviewer-1',
        'VERIFIER',
      );

      expect(tx.evidencePublicationReview.create).toHaveBeenCalledWith({
        data: {
          decision: EvidencePublicationDecision.APPROVED,
          notes: approvalDto.notes,
          evidenceId: 'evidence-1',
          reviewerId: 'reviewer-1',
        },
      });

      expect(tx.evidence.update).toHaveBeenCalledWith({
        where: { id: 'evidence-1' },
        data: {
          publicationStatus: EvidencePublicationStatus.APPROVED,
        },
      });

      expect(result).toEqual({
        evidence: updatedEvidence,
        review,
      });
    });
  });

  describe('createVerificationReview', () => {
    beforeEach(() => {
      prisma.incident.findUnique.mockResolvedValue({
        id: 'incident-1',
      });

      tx.verificationReview.create.mockResolvedValue({
        id: 'verification-review-1',
      });

      tx.incident.update.mockResolvedValue({
        id: 'incident-1',
      });

      tx.evidence.updateMany.mockResolvedValue({
        count: 2,
      });
    });

    it('should reject users without verifier or admin privileges', async () => {
      await expect(
        service.createVerificationReview(
          'incident-1',
          { decision: VerificationDecision.VERIFIED } as any,
          'user-1',
          'USER',
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);

      expect(prisma.incident.findUnique).not.toHaveBeenCalled();
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should reject a verification review for a nonexistent incident', async () => {
      prisma.incident.findUnique.mockResolvedValue(null);

      await expect(
        service.createVerificationReview(
          'incident-1',
          { decision: VerificationDecision.VERIFIED } as any,
          'reviewer-1',
          'VERIFIER',
        ),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should mark a verified incident as VERIFIED and reset evidence publication statuses', async () => {
      const dto = {
        decision: VerificationDecision.VERIFIED,
        notes: 'Independent sources and evidence reviewed.',
      };

      await service.createVerificationReview(
        'incident-1',
        dto as any,
        'reviewer-1',
        'VERIFIER',
      );

      expect(tx.incident.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'incident-1' },
          data: expect.objectContaining({
            status: IncidentStatus.VERIFIED,
            publicationStatus: IncidentPublicationStatus.PENDING,
            confidenceLevel: ConfidenceLevel.VERIFIED,
            verificationSummary: dto.notes,
          }),
        }),
      );

      expect(tx.evidence.updateMany).toHaveBeenCalledWith({
        where: { incidentId: 'incident-1' },
        data: {
          publicationStatus: EvidencePublicationStatus.PENDING,
        },
      });
    });

    it('should mark a rejected incident as REJECTED with DISPUTED confidence', async () => {
      await service.createVerificationReview(
        'incident-1',
        { decision: VerificationDecision.REJECTED } as any,
        'reviewer-1',
        'ADMIN',
      );

      expect(tx.incident.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'incident-1' },
          data: expect.objectContaining({
            status: IncidentStatus.REJECTED,
            publicationStatus: IncidentPublicationStatus.PENDING,
            confidenceLevel: ConfidenceLevel.DISPUTED,
          }),
        }),
      );

      expect(tx.evidence.updateMany).toHaveBeenCalled();
    });

    it('should place an incident needing more information UNDER_REVIEW with CORROBORATING confidence', async () => {
      await service.createVerificationReview(
        'incident-1',
        {
          decision: VerificationDecision.NEEDS_MORE_INFORMATION,
        } as any,
        'reviewer-1',
        'VERIFIER',
      );

      expect(tx.incident.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'incident-1' },
          data: expect.objectContaining({
            status: IncidentStatus.UNDER_REVIEW,
            publicationStatus: IncidentPublicationStatus.PENDING,
            confidenceLevel: ConfidenceLevel.CORROBORATING,
          }),
        }),
      );

      expect(tx.evidence.updateMany).toHaveBeenCalled();
    });

    it('should record the review, update the incident and reset evidence in one transaction', async () => {
      await service.createVerificationReview(
        'incident-1',
        {
          decision: VerificationDecision.VERIFIED,
          notes: 'Review completed.',
        } as any,
        'reviewer-1',
        'VERIFIER',
      );

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(tx.verificationReview.create).toHaveBeenCalled();
      expect(tx.incident.update).toHaveBeenCalled();
      expect(tx.evidence.updateMany).toHaveBeenCalled();
    });
  });

  describe('public incident visibility', () => {
    it('should list only verified and publication-approved incidents', async () => {
      prisma.incident.findMany.mockResolvedValue([]);

      await service.getPublicIncidents();

      expect(prisma.incident.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            status: IncidentStatus.VERIFIED,
            publicationStatus: IncidentPublicationStatus.APPROVED,
          },
        }),
      );
    });

    it('should require publication approval when retrieving an incident', async () => {
      prisma.incident.findFirst.mockResolvedValue(null);

      await expect(
        service.getPublicIncident('incident-1'),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.incident.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: 'incident-1',
            status: IncidentStatus.VERIFIED,
            publicationStatus: IncidentPublicationStatus.APPROVED,
          },
        }),
      );
    });

    it('should not retrieve evidence for an unpublished incident', async () => {
      prisma.incident.findFirst.mockResolvedValue(null);

      await expect(
        service.getPublicEvidence('incident-1'),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.incident.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: 'incident-1',
            status: IncidentStatus.VERIFIED,
            publicationStatus: IncidentPublicationStatus.APPROVED,
          },
        }),
      );

      expect(prisma.evidence.findMany).not.toHaveBeenCalled();
    });
  });

  describe('reviewIncidentPublication', () => {
    const publicationDto = {
      decision: IncidentPublicationDecision.APPROVED,
      notes: 'Publication reviewed and approved.',
    };

    beforeEach(() => {
      prisma.incident.findUnique.mockResolvedValue({
        id: 'incident-1',
        status: IncidentStatus.VERIFIED,
      });

      tx.incidentPublicationReview.create.mockResolvedValue({
        id: 'publication-review-1',
        decision: IncidentPublicationDecision.APPROVED,
      });

      tx.incident.updateMany.mockResolvedValue({ count: 1 });

      tx.incident.update.mockResolvedValue({
        id: 'incident-1',
        publicationStatus: IncidentPublicationStatus.APPROVED,
      });
    });

    it('should reject users without verifier or admin privileges', async () => {
      await expect(
        service.reviewIncidentPublication(
          'incident-1',
          publicationDto as any,
          'user-1',
          'MEMBER',
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);

      expect(prisma.incident.findUnique).not.toHaveBeenCalled();
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should reject publication review for a nonexistent incident', async () => {
      prisma.incident.findUnique.mockResolvedValue(null);

      await expect(
        service.reviewIncidentPublication(
          'incident-1',
          publicationDto as any,
          'reviewer-1',
          'VERIFIER',
        ),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should require non-whitespace notes for approval and rejection', async () => {
      for (const decision of [
        IncidentPublicationDecision.APPROVED,
        IncidentPublicationDecision.REJECTED,
      ]) {
        await expect(
          service.reviewIncidentPublication(
            'incident-1',
            { decision, notes: '   ' } as any,
            'reviewer-1',
            'VERIFIER',
          ),
        ).rejects.toBeInstanceOf(BadRequestException);
      }

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should prevent approval of an incident that is not verified', async () => {
      prisma.incident.findUnique.mockResolvedValue({
        id: 'incident-1',
        status: IncidentStatus.UNDER_REVIEW,
      });

      await expect(
        service.reviewIncidentPublication(
          'incident-1',
          publicationDto as any,
          'reviewer-1',
          'VERIFIER',
        ),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should prevent approval if the incident loses verified status before the conditional update', async () => {
      tx.incident.updateMany.mockResolvedValue({ count: 0 });

      await expect(
        service.reviewIncidentPublication(
          'incident-1',
          publicationDto as any,
          'reviewer-1',
          'VERIFIER',
        ),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(tx.incident.updateMany).toHaveBeenCalledWith({
        where: {
          id: 'incident-1',
          status: IncidentStatus.VERIFIED,
        },
        data: {
          publicationStatus: IncidentPublicationStatus.APPROVED,
        },
      });

      expect(tx.incident.update).not.toHaveBeenCalled();
      expect(tx.incidentPublicationReview.create).not.toHaveBeenCalled();
    });

    it('should approve publication and record the review in one transaction', async () => {
      tx.incident.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.reviewIncidentPublication(
        'incident-1',
        publicationDto as any,
        'reviewer-1',
        'VERIFIER',
      );

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);

      expect(tx.incident.updateMany).toHaveBeenCalledWith({
        where: {
          id: 'incident-1',
          status: IncidentStatus.VERIFIED,
        },
        data: {
          publicationStatus: IncidentPublicationStatus.APPROVED,
        },
      });

      expect(tx.incident.update).toHaveBeenCalledWith({
        where: { id: 'incident-1' },
        data: {
          publicationStatus: IncidentPublicationStatus.APPROVED,
        },
      });

      expect(tx.incidentPublicationReview.create).toHaveBeenCalledWith({
        data: {
          decision: IncidentPublicationDecision.APPROVED,
          notes: publicationDto.notes,
          incidentId: 'incident-1',
          reviewerId: 'reviewer-1',
        },
      });

      expect(result).toEqual({
        incident: expect.objectContaining({
          publicationStatus: IncidentPublicationStatus.APPROVED,
        }),
        review: expect.objectContaining({
          id: 'publication-review-1',
        }),
      });
    });

    it('should trim notes and record a rejection decision', async () => {
      const dto = {
        decision: IncidentPublicationDecision.REJECTED,
        notes: '  Publication not suitable for release.  ',
      };

      tx.incidentPublicationReview.create.mockResolvedValue({
        id: 'publication-review-2',
        decision: IncidentPublicationDecision.REJECTED,
      });

      tx.incident.update.mockResolvedValue({
        id: 'incident-1',
        publicationStatus: IncidentPublicationStatus.REJECTED,
      });

      await service.reviewIncidentPublication(
        'incident-1',
        dto as any,
        'reviewer-1',
        'ADMIN',
      );

      expect(tx.incidentPublicationReview.create).toHaveBeenCalledWith({
        data: {
          decision: IncidentPublicationDecision.REJECTED,
          notes: 'Publication not suitable for release.',
          incidentId: 'incident-1',
          reviewerId: 'reviewer-1',
        },
      });

      expect(tx.incident.update).toHaveBeenCalledWith({
        where: { id: 'incident-1' },
        data: {
          publicationStatus: IncidentPublicationStatus.REJECTED,
        },
      });

      expect(tx.incident.updateMany).not.toHaveBeenCalled();
    });
  });
  describe('reviewEvidence', () => {
    const reviewDto = {
      decision: EvidenceReviewDecision.VERIFIED,
      notes: 'Evidence checked against available sources.',
    };

    const existingEvidence = {
      id: 'evidence-1',
      type: 'IMAGE',
      title: 'Incident photograph',
      verificationStatus: EvidenceVerificationStatus.PENDING,
      publicationStatus: EvidencePublicationStatus.APPROVED,
    };

    beforeEach(() => {
      tx.evidenceReview = {
        create: jest.fn().mockResolvedValue({
          id: 'evidence-review-1',
          decision: EvidenceReviewDecision.VERIFIED,
        }),
      };

      tx.evidence.update.mockResolvedValue({
        ...existingEvidence,
        verificationStatus: EvidenceVerificationStatus.VERIFIED,
        publicationStatus: EvidencePublicationStatus.PENDING,
      });

      prisma.evidence.findFirst.mockResolvedValue({
        id: 'evidence-1',
      });
    });

    it('should reject users without verifier or admin privileges', async () => {
      await expect(
        service.reviewEvidence(
          'incident-1',
          'evidence-1',
          reviewDto as any,
          'user-1',
          'USER',
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);

      expect(prisma.evidence.findFirst).not.toHaveBeenCalled();
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should reject evidence that does not belong to the incident', async () => {
      prisma.evidence.findFirst.mockResolvedValue(null);

      await expect(
        service.reviewEvidence(
          'incident-1',
          'evidence-1',
          reviewDto as any,
          'reviewer-1',
          'VERIFIER',
        ),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should mark evidence VERIFIED when the reviewer verifies it', async () => {
      await service.reviewEvidence(
        'incident-1',
        'evidence-1',
        reviewDto as any,
        'reviewer-1',
        'VERIFIER',
      );

      expect(tx.evidence.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'evidence-1' },
          data: {
            verificationStatus: EvidenceVerificationStatus.VERIFIED,
            publicationStatus: EvidencePublicationStatus.PENDING,
          },
        }),
      );
    });

    it('should mark evidence REJECTED when the reviewer rejects it', async () => {
      await service.reviewEvidence(
        'incident-1',
        'evidence-1',
        {
          decision: EvidenceReviewDecision.REJECTED,
          notes: 'Evidence could not be sufficiently verified.',
        } as any,
        'reviewer-1',
        'ADMIN',
      );

      expect(tx.evidence.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'evidence-1' },
          data: {
            verificationStatus: EvidenceVerificationStatus.REJECTED,
            publicationStatus: EvidencePublicationStatus.PENDING,
          },
        }),
      );
    });

    it('should create an evidence review and return the updated evidence', async () => {
      const review = {
        id: 'evidence-review-1',
        decision: EvidenceReviewDecision.VERIFIED,
      };

      const updatedEvidence = {
        ...existingEvidence,
        verificationStatus: EvidenceVerificationStatus.VERIFIED,
        publicationStatus: EvidencePublicationStatus.PENDING,
      };

      tx.evidenceReview.create.mockResolvedValue(review);
      tx.evidence.update.mockResolvedValue(updatedEvidence);

      const result = await service.reviewEvidence(
        'incident-1',
        'evidence-1',
        reviewDto as any,
        'reviewer-1',
        'VERIFIER',
      );

      expect(tx.evidenceReview.create).toHaveBeenCalledWith({
        data: {
          decision: EvidenceReviewDecision.VERIFIED,
          notes: reviewDto.notes,
          evidenceId: 'evidence-1',
          reviewerId: 'reviewer-1',
        },
      });

      expect(result).toEqual({
        evidence: updatedEvidence,
        review,
      });
    });

    it('should record the review and update evidence within one transaction', async () => {
      await service.reviewEvidence(
        'incident-1',
        'evidence-1',
        reviewDto as any,
        'reviewer-1',
        'VERIFIER',
      );

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(tx.evidenceReview.create).toHaveBeenCalledTimes(1);
      expect(tx.evidence.update).toHaveBeenCalledTimes(1);
    });
  });
});
