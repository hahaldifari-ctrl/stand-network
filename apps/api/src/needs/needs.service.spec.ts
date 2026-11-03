import { NeedStatus, ResponseStatus } from '@prisma/client';
import { NeedsService } from './needs.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';

describe('NeedsService', () => {
  let service: NeedsService;

  const prisma = {
    user: {
      findUnique: jest.fn(),
    },
    organization: {
      findUnique: jest.fn(),
    },
    need: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    response: {
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    prayer: {
      create: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new NeedsService(
      prisma as unknown as PrismaService,
    );
  });

  describe('create', () => {
    it('should reject a user who does not own the organisation', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
      });

      prisma.organization.findUnique.mockResolvedValue({
        id: 'org-1',
        ownerId: 'another-user',
      });

      await expect(
        service.create(
          { organizationId: 'org-1' } as any,
          'user-1',
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);

      expect(prisma.need.create).not.toHaveBeenCalled();
    });
  });

  describe('approve', () => {
    it('should approve a pending need and mark it as verified', async () => {
      prisma.need.findUnique.mockResolvedValue({
        id: 'need-1',
        status: NeedStatus.PENDING_REVIEW,
        verified: false,
      });

      const approvedNeed = {
        id: 'need-1',
        status: NeedStatus.ACTIVE,
        verified: true,
      };

      prisma.need.update.mockResolvedValue(approvedNeed);

      const result = await service.approve('need-1');

      expect(prisma.need.update).toHaveBeenCalledWith({
        where: { id: 'need-1' },
        data: {
          verified: true,
          status: NeedStatus.ACTIVE,
        },
        include: {
          organization: true,
        },
      });

      expect(result).toEqual(approvedNeed);
    });
  });

  describe('reject', () => {
    it('should reject a pending need without marking it as verified', async () => {
      prisma.need.findUnique.mockResolvedValue({
        id: 'need-1',
        status: NeedStatus.PENDING_REVIEW,
        verified: false,
      });

      const rejectedNeed = {
        id: 'need-1',
        status: NeedStatus.REJECTED,
        verified: false,
      };

      prisma.need.update.mockResolvedValue(rejectedNeed);

      const result = await service.reject('need-1');

      expect(prisma.need.update).toHaveBeenCalledWith({
        where: { id: 'need-1' },
        data: {
          verified: false,
          status: NeedStatus.REJECTED,
        },
        include: {
          organization: true,
        },
      });

      expect(result).toEqual(rejectedNeed);
    });
  });
});
