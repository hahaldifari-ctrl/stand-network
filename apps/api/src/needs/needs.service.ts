import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NeedStatus, ResponseStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNeedDto } from './dto/create-need.dto';
import { CreatePrayerDto } from './dto/create-prayer.dto';
import { CreateResponseDto } from './dto/create-response.dto';

@Injectable()
export class NeedsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.need.findMany({
      where: {
        status: {
          in: [NeedStatus.VERIFIED, NeedStatus.ACTIVE],
        },
        verified: true,
      },
      include: {
        organization: true,
        _count: {
          select: {
            prayers: true,
            responses: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findPending() {
    return this.prisma.need.findMany({
      where: {
        status: NeedStatus.PENDING_REVIEW,
        verified: false,
      },
      include: {
        organization: true,
        _count: {
          select: {
            prayers: true,
            responses: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const need = await this.prisma.need.findUnique({
      where: { id },
      include: {
        organization: true,
        _count: {
          select: {
            prayers: true,
            responses: true,
          },
        },
      },
    });

    if (!need) {
      throw new NotFoundException('Need not found');
    }

    if (
      !need.verified ||
      !([NeedStatus.VERIFIED, NeedStatus.ACTIVE] as NeedStatus[]).includes(
        need.status,
      )
    ) {
      throw new NotFoundException('Need not found');
    }

    return need;
  }

  async create(dto: CreateNeedDto, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const organization = await this.prisma.organization.findUnique({
      where: { id: dto.organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    if (organization.ownerId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to submit needs for this organization',
      );
    }

    return this.prisma.need.create({
      data: {
        title: dto.title,
        description: dto.description,
        location: dto.location,
        community: dto.community,
        urgency: dto.urgency,
        organizationId: dto.organizationId,
        status: NeedStatus.PENDING_REVIEW,
        verified: false,
      },
      include: {
        organization: true,
      },
    });
  }

  async verify(id: string) {
    const need = await this.prisma.need.findUnique({
      where: { id },
    });

    if (!need) {
      throw new NotFoundException('Need not found');
    }

    if (need.status !== NeedStatus.PENDING_REVIEW) {
      throw new BadRequestException(
        'Only pending needs can be verified',
      );
    }

    return this.prisma.need.update({
      where: { id },
      data: {
        verified: true,
        status: NeedStatus.ACTIVE,
      },
      include: {
        organization: true,
      },
    });
  }

  async approve(id: string) {
    const need = await this.prisma.need.findUnique({
      where: { id },
    });

    if (!need) {
      throw new NotFoundException('Need not found');
    }

    if (need.status !== NeedStatus.PENDING_REVIEW) {
      throw new BadRequestException(
        'Only pending needs can be approved',
      );
    }

    return this.prisma.need.update({
      where: { id },
      data: {
        verified: true,
        status: NeedStatus.ACTIVE,
      },
      include: {
        organization: true,
      },
    });
  }

  async reject(id: string) {
    const need = await this.prisma.need.findUnique({
      where: { id },
    });

    if (!need) {
      throw new NotFoundException('Need not found');
    }

    if (need.status !== NeedStatus.PENDING_REVIEW) {
      throw new BadRequestException(
        'Only pending needs can be rejected',
      );
    }

    return this.prisma.need.update({
      where: { id },
      data: {
        verified: false,
        status: NeedStatus.REJECTED,
      },
      include: {
        organization: true,
      },
    });
  }

  async pray(id: string, dto: CreatePrayerDto, userId: string) {
    const need = await this.prisma.need.findUnique({
      where: { id },
    });

    if (!need) {
      throw new NotFoundException('Need not found');
    }

    if (
      !need.verified ||
      !([NeedStatus.VERIFIED, NeedStatus.ACTIVE] as NeedStatus[]).includes(
        need.status,
      )
    ) {
      throw new BadRequestException(
        'Prayer is only available for active needs',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.prayer.create({
      data: {
        message: dto.message,
        userId,
        needId: id,
      },
    });
  }

  async respond(
    id: string,
    dto: CreateResponseDto,
    userId: string,
  ) {
    const need = await this.prisma.need.findUnique({
      where: { id },
    });

    if (!need) {
      throw new NotFoundException('Need not found');
    }

    if (
      !need.verified ||
      !([NeedStatus.VERIFIED, NeedStatus.ACTIVE] as NeedStatus[]).includes(
        need.status,
      )
    ) {
      throw new BadRequestException(
        'Responses are only available for active needs',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        organization: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.organizationId) {
      if (!user.organization) {
        throw new ForbiddenException(
          'You are not authorized to respond on behalf of an organization',
        );
      }

      if (user.organization.id !== dto.organizationId) {
        throw new ForbiddenException(
          'You are not authorized to respond on behalf of this organization',
        );
      }
    }

    return this.prisma.response.create({
      data: {
        type: dto.type,
        message: dto.message,
        status: ResponseStatus.SUBMITTED,
        userId,
        needId: id,
        organizationId: dto.organizationId,
      },
    });
  }
}