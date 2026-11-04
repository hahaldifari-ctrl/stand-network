import { UserRole } from '@prisma/client';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ROLES_KEY } from '../auth/roles.decorator';

jest.mock('../auth/jwt-auth.guard', () => ({
  JwtAuthGuard: class JwtAuthGuard {},
}));

describe('IncidentsController', () => {
  let controller: IncidentsController;

  const incidentsService = {
    getPublicIncidents: jest.fn(),
    getPublicIncident: jest.fn(),
    getPublicEvidence: jest.fn(),
    create: jest.fn(),
    addSource: jest.fn(),
    addEvidence: jest.fn(),
    reviewEvidence: jest.fn(),
    reviewEvidencePublication: jest.fn(),
    createVerificationReview: jest.fn(),
    getVerificationRecord: jest.fn(),
  };

  const protectedMethods = [
    'reviewEvidence',
    'reviewEvidencePublication',
    'createVerificationReview',
    'getVerificationRecord',
  ] as const;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new IncidentsController(
      incidentsService as unknown as IncidentsService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should pass the authenticated user ID when adding a source', () => {
    const dto = { name: 'Trusted News Organisation' };
    const req = {
      user: {
        id: 'submitter-1',
        email: 'submitter@example.com',
        role: UserRole.MEMBER,
      },
    };

    controller.addSource('incident-1', dto as any, req as any);

    expect(incidentsService.addSource).toHaveBeenCalledWith(
      'incident-1',
      dto,
      'submitter-1',
    );
  });

  it('should pass the authenticated user ID when adding evidence', () => {
    const dto = { type: 'IMAGE', title: 'Incident photograph' };
    const req = {
      user: {
        id: 'submitter-2',
        email: 'submitter@example.com',
        role: UserRole.MEMBER,
      },
    };

    controller.addEvidence('incident-1', dto as any, req as any);

    expect(incidentsService.addEvidence).toHaveBeenCalledWith(
      'incident-1',
      dto,
      'submitter-2',
    );
  });
  it('should restrict sensitive endpoints to ADMIN and VERIFIER roles', () => {
    for (const method of protectedMethods) {
      const roles = Reflect.getMetadata(
        ROLES_KEY,
        IncidentsController.prototype[method],
      );

      expect(roles).toEqual([
        UserRole.ADMIN,
        UserRole.VERIFIER,
      ]);
    }
  });

  it('should apply JWT and role guards to sensitive endpoints', () => {
    for (const method of protectedMethods) {
      const guards = Reflect.getMetadata(
        '__guards__',
        IncidentsController.prototype[method],
      ) as unknown[];

      expect(guards).toContain(JwtAuthGuard);
      expect(guards).toContain(RolesGuard);
    }
  });
});