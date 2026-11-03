import { UserRole } from '@prisma/client';
import { NeedsController } from './needs.controller';
import { NeedsService } from './needs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ROLES_KEY } from '../auth/roles.decorator';

jest.mock('../auth/jwt-auth.guard', () => ({
  JwtAuthGuard: class JwtAuthGuard {},
}));

describe('NeedsController', () => {
  let controller: NeedsController;

  const needsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findPending: jest.fn(),
    findResponses: jest.fn(),
    updateResponseStatus: jest.fn(),
    create: jest.fn(),
    pray: jest.fn(),
    respond: jest.fn(),
    verify: jest.fn(),
    approve: jest.fn(),
    reject: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new NeedsController(
      needsService as unknown as NeedsService,
    );
  });

  it('should return all public needs', async () => {
    const expected = [{ id: 'need-1', title: 'Community support' }];
    needsService.findAll.mockResolvedValue(expected);

    await expect(controller.findAll()).resolves.toEqual(expected);
    expect(needsService.findAll).toHaveBeenCalledTimes(1);
  });

  it('should pass the need ID and authenticated user ID when creating a need', async () => {
    const dto = { title: 'Emergency supplies' };
    const request = {
      user: {
        id: 'user-1',
        email: 'user@example.com',
        role: UserRole.USER,
      },
    };

    const expected = { id: 'need-1' };
    needsService.create.mockResolvedValue(expected);

    await expect(
      controller.create(dto as any, request as any),
    ).resolves.toEqual(expected);

    expect(needsService.create).toHaveBeenCalledWith(dto, 'user-1');
  });

  it('should pass the need ID to the verification service', async () => {
    needsService.verify.mockResolvedValue({ id: 'need-1' });

    await controller.verify('need-1');

    expect(needsService.verify).toHaveBeenCalledWith('need-1');
  });

  it('should pass the need ID to the approval service', async () => {
    needsService.approve.mockResolvedValue({ id: 'need-1' });

    await controller.approve('need-1');

    expect(needsService.approve).toHaveBeenCalledWith('need-1');
  });

  it('should pass the need ID to the rejection service', async () => {
    needsService.reject.mockResolvedValue({ id: 'need-1' });

    await controller.reject('need-1');

    expect(needsService.reject).toHaveBeenCalledWith('need-1');
  });

  it('should restrict sensitive endpoints to ADMIN and VERIFIER roles', () => {
    const protectedMethods = [
      'findPending',
      'findResponses',
      'updateResponseStatus',
      'verify',
      'approve',
      'reject',
    ] as const;

    for (const method of protectedMethods) {
      const roles = Reflect.getMetadata(
        ROLES_KEY,
        NeedsController.prototype[method],
      );

      expect(roles).toEqual([UserRole.ADMIN, UserRole.VERIFIER]);
    }
  });

  it('should apply JWT and role guards to sensitive endpoints', () => {
    const protectedMethods = [
      'findPending',
      'findResponses',
      'updateResponseStatus',
      'verify',
      'approve',
      'reject',
    ] as const;

    for (const method of protectedMethods) {
      const guards = Reflect.getMetadata(
        '__guards__',
        NeedsController.prototype[method],
      ) as unknown[];

      expect(guards).toContain(JwtAuthGuard);
      expect(guards).toContain(RolesGuard);
    }
  });
});
