import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ConfidenceLevel,
  EvidenceReviewDecision,
  EvidenceContentRating,
  EvidenceVerificationStatus,
  EvidencePublicationStatus,
  EvidencePublicationDecision,
  IncidentStatus,
  Prisma,
  VerificationDecision,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncidentDto } from './create-incident.dto';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { CreateSourceDto } from './dto/create-source.dto';
import { CreateVerificationReviewDto } from './dto/create-verification-review.dto';
import { ReviewEvidenceDto } from './dto/review-evidence.dto';
import { ReviewEvidencePublicationDto } from './dto/review-evidence-publication.dto';

@Injectable()
export class IncidentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicIncidents() {
    return this.prisma.incident.findMany({
      where: { status: IncidentStatus.VERIFIED },
      select: {
        id: true,
        title: true,
        description: true,
        state: true,
        lga: true,
        community: true,
        region: true,
        incidentDate: true,
        incidentType: true,
        motivation: true,
        religiousContext: true,
        status: true,
        confidenceLevel: true,
        affectedPeopleCount: true,
        peopleKilled: true,
        peopleAbducted: true,
        peopleInjured: true,
        peopleDisplaced: true,
        propertyDamage: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        { incidentDate: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async getPublicIncident(incidentId: string) {
    const incident = await this.prisma.incident.findFirst({
      where: {
        id: incidentId,
        status: IncidentStatus.VERIFIED,
      },
      select: {
        id: true,
        title: true,
        description: true,
        state: true,
        lga: true,
        community: true,
        region: true,
        incidentDate: true,
        incidentType: true,
        motivation: true,
        religiousContext: true,
        status: true,
        confidenceLevel: true,
        verificationSummary: true,
        affectedPeopleCount: true,
        peopleKilled: true,
        peopleAbducted: true,
        peopleInjured: true,
        peopleDisplaced: true,
        propertyDamage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!incident) {
      throw new NotFoundException('Verified incident not found');
    }

    return incident;
  }

  async getPublicEvidence(incidentId: string) {
    const incident = await this.prisma.incident.findFirst({
      where: {
        id: incidentId,
        status: IncidentStatus.VERIFIED,
      },
      select: { id: true },
    });

    if (!incident) {
      throw new NotFoundException('Verified incident not found');
    }

    const evidence = await this.prisma.evidence.findMany({
      where: {
        incidentId,
        verificationStatus: EvidenceVerificationStatus.VERIFIED,
        publicationStatus: EvidencePublicationStatus.APPROVED,
        contentRating: { not: EvidenceContentRating.GRAPHIC },
        credit: { not: '' },
        license: { not: '' },
      },
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        caption: true,
        credit: true,
        license: true,
        contentRating: true,
        url: true,
        mimeType: true,
        capturedAt: true,
        createdAt: true,
        source: {
          select: {
            name: true,
            sourceType: true,
            title: true,
            url: true,
            publisher: true,
            author: true,
            publishedAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return evidence.filter(
      (item) => Boolean(item.credit?.trim() && item.license?.trim()),
    );
  }

  async create(dto: CreateIncidentDto, userId: string) {
    return this.prisma.incident.create({
      data: {
        title: dto.title,
        description: dto.description,
        state: dto.state,
        lga: dto.lga,
        community: dto.community,
        region: dto.region,
        incidentDate: dto.incidentDate
          ? new Date(dto.incidentDate)
          : undefined,
        incidentType: dto.incidentType,
        affectedPeopleCount: dto.affectedPeopleCount,
        sourceSummary: dto.sourceSummary,
        status: IncidentStatus.REPORTED,
        createdById: userId,
      },
    });
  }

  async addSource(
    incidentId: string,
    dto: CreateSourceDto,
  ) {
    await this.ensureIncidentExists(incidentId);

    return this.prisma.source.create({
      data: {
        name: dto.name,
        sourceType: dto.sourceType,
        title: dto.title,
        url: dto.url,
        publisher: dto.publisher,
        author: dto.author,
        publishedAt: dto.publishedAt
          ? new Date(dto.publishedAt)
          : undefined,
        notes: dto.notes,
        incidentId,
      },
    });
  }

  async addEvidence(
    incidentId: string,
    dto: CreateEvidenceDto,
  ) {
    await this.ensureIncidentExists(incidentId);

    if (dto.sourceId) {
      const source = await this.prisma.source.findFirst({
        where: {
          id: dto.sourceId,
          incidentId,
        },
        select: { id: true },
      });

      if (!source) {
        throw new BadRequestException(
          'Source does not belong to this incident',
        );
      }
    }

    return this.prisma.evidence.create({
      data: {
        type: dto.type,
        title: dto.title,
        description: dto.description,
        caption: dto.caption,
        credit: dto.credit,
        license: dto.license,
        contentRating:
          dto.contentRating ?? EvidenceContentRating.STANDARD,
        url: dto.url,
        storageKey: dto.storageKey,
        mimeType: dto.mimeType,
        capturedAt: dto.capturedAt
          ? new Date(dto.capturedAt)
          : undefined,
        incidentId,
        sourceId: dto.sourceId,
        verificationStatus: EvidenceVerificationStatus.PENDING,
      },
    });
  }

  async reviewEvidence(
    incidentId: string,
    evidenceId: string,
    dto: ReviewEvidenceDto,
    reviewerId: string,
    reviewerRole: string,
  ) {
    if (!['VERIFIER', 'ADMIN'].includes(reviewerRole)) {
      throw new ForbiddenException(
        'Only verifiers and admins can review evidence',
      );
    }

    const evidence = await this.prisma.evidence.findFirst({
      where: {
        id: evidenceId,
        incidentId,
      },
      select: { id: true },
    });

    if (!evidence) {
      throw new NotFoundException(
        'Evidence not found for this incident',
      );
    }

    const verificationStatus =
      dto.decision === EvidenceReviewDecision.VERIFIED
        ? EvidenceVerificationStatus.VERIFIED
        : EvidenceVerificationStatus.REJECTED;

    return this.prisma.$transaction(async (tx) => {
      const review = await tx.evidenceReview.create({
        data: {
          decision: dto.decision,
          notes: dto.notes,
          evidenceId,
          reviewerId,
        },
      });

      const updatedEvidence = await tx.evidence.update({
        where: { id: evidenceId },
        data: {
          verificationStatus,
          publicationStatus: EvidencePublicationStatus.PENDING,
        },
        select: {
          id: true,
          type: true,
          title: true,
          description: true,
          caption: true,
          credit: true,
          license: true,
          contentRating: true,
          verificationStatus: true,
          url: true,
          mimeType: true,
          capturedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        evidence: updatedEvidence,
        review,
      };
    });
  }

  async reviewEvidencePublication(
    incidentId: string,
    evidenceId: string,
    dto: ReviewEvidencePublicationDto,
    reviewerId: string,
    reviewerRole: string,
  ) {
    if (!['VERIFIER', 'ADMIN'].includes(reviewerRole)) {
      throw new ForbiddenException(
        'Only verifiers and admins can review publication',
      );
    }

    const evidence = await this.prisma.evidence.findFirst({
      where: { id: evidenceId, incidentId },
      include: {
        incident: {
          select: { id: true, status: true },
        },
      },
    });

    if (!evidence) {
      throw new NotFoundException(
        'Evidence not found for this incident',
      );
    }

    if (dto.decision === EvidencePublicationDecision.APPROVED) {
      if (
        evidence.verificationStatus !== EvidenceVerificationStatus.VERIFIED ||
        evidence.incident.status !== IncidentStatus.VERIFIED
      ) {
        throw new BadRequestException(
          'Both the evidence and incident must be verified before publication',
        );
      }

      if (evidence.contentRating === EvidenceContentRating.GRAPHIC) {
        throw new BadRequestException(
          'Graphic evidence cannot be approved for public display',
        );
      }

      if (!evidence.credit?.trim() || !evidence.license?.trim()) {
        throw new BadRequestException(
          'Credit and licensing information are required for publication',
        );
      }

      if (
        /internal test|not for external publication|no publication|permission required/i
          .test(evidence.license)
      ) {
        throw new BadRequestException(
          'The recorded license does not permit publication approval',
        );
      }

      if (!dto.notes?.trim()) {
        throw new BadRequestException(
          'Review notes are required when approving publication',
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const review = await tx.evidencePublicationReview.create({
        data: {
          decision: dto.decision,
          notes: dto.notes?.trim() || undefined,
          evidenceId,
          reviewerId,
        },
      });

      const updatedEvidence = await tx.evidence.update({
        where: { id: evidenceId },
        data: {
          publicationStatus:
            dto.decision === EvidencePublicationDecision.APPROVED
              ? EvidencePublicationStatus.APPROVED
              : EvidencePublicationStatus.REJECTED,
        },
      });

      return { evidence: updatedEvidence, review };
    });
  }
  async createVerificationReview(
    incidentId: string,
    dto: CreateVerificationReviewDto,
    reviewerId: string,
    reviewerRole: string,
  ) {
    if (!['VERIFIER', 'ADMIN'].includes(reviewerRole)) {
      throw new ForbiddenException(
        'Only verifiers and admins can review incidents',
      );
    }

    await this.ensureIncidentExists(incidentId);

    return this.prisma.$transaction(async (tx) => {
      const review = await tx.verificationReview.create({
        data: {
          decision: dto.decision,
          notes: dto.notes,
          incidentId,
          reviewerId,
        },
      });

      const updateData: Prisma.IncidentUpdateInput = {
        verificationSummary:
          dto.notes ??
          this.defaultVerificationSummary(dto.decision),
      };

      switch (dto.decision) {
        case VerificationDecision.VERIFIED:
          updateData.status = IncidentStatus.VERIFIED;
          updateData.confidenceLevel = ConfidenceLevel.VERIFIED;
          break;

        case VerificationDecision.REJECTED:
          updateData.status = IncidentStatus.REJECTED;
          updateData.confidenceLevel = ConfidenceLevel.DISPUTED;
          break;

        case VerificationDecision.NEEDS_MORE_INFORMATION:
          updateData.status = IncidentStatus.UNDER_REVIEW;
          updateData.confidenceLevel = ConfidenceLevel.CORROBORATING;
          break;
      }

      const incident = await tx.incident.update({
        where: { id: incidentId },
        data: updateData,
      });

      // Any incident verification change invalidates prior publication approvals.
      await tx.evidence.updateMany({
        where: { incidentId },
        data: { publicationStatus: EvidencePublicationStatus.PENDING },
      });

      return { review, incident };
    });
  }

  async getVerificationRecord(
    incidentId: string,
    requesterRole: string,
  ) {
    if (!['VERIFIER', 'ADMIN'].includes(requesterRole)) {
      throw new ForbiddenException(
        'Only verifiers and admins can access verification records',
      );
    }

    const incident = await this.prisma.incident.findUnique({
      where: { id: incidentId },
      include: {
        sources: {
          orderBy: { createdAt: 'desc' },
        },
        evidence: {
          orderBy: { createdAt: 'desc' },
          include: {
            publicationReviews: {
              orderBy: { createdAt: 'desc' },
              include: {
                reviewer: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                  },
                },
              },
            },
          },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    return incident;
  }

  private async ensureIncidentExists(incidentId: string) {
    const incident = await this.prisma.incident.findUnique({
      where: { id: incidentId },
      select: { id: true },
    });

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }
  }

  private defaultVerificationSummary(
    decision: VerificationDecision,
  ) {
    switch (decision) {
      case VerificationDecision.VERIFIED:
        return 'Incident verified by an authorized reviewer.';

      case VerificationDecision.REJECTED:
        return 'Incident rejected by an authorized reviewer.';

      case VerificationDecision.NEEDS_MORE_INFORMATION:
        return 'Additional information is required before this incident can be verified.';
    }
  }
}
