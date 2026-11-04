import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { RolesGuard } from './roles.guard';
import { ROLES_KEY } from './roles.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: {
    getAllAndOverride: jest.Mock;
  };

  let request: {
    user?: {
      role?: UserRole;
    };
  };

  const createContext = (): ExecutionContext =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    };

    guard = new RolesGuard(
      reflector as unknown as Reflector,
    );

    request = {};
  });

  it('should allow access when no roles are required', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    expect(guard.canActivate(createContext())).toBe(true);
  });

  it('should allow an ADMIN user', () => {
    reflector.getAllAndOverride.mockReturnValue([
      UserRole.ADMIN,
      UserRole.VERIFIER,
    ]);

    request.user = {
      role: UserRole.ADMIN,
    };

    expect(guard.canActivate(createContext())).toBe(true);
  });

  it('should allow a VERIFIER user', () => {
    reflector.getAllAndOverride.mockReturnValue([
      UserRole.ADMIN,
      UserRole.VERIFIER,
    ]);

    request.user = {
      role: UserRole.VERIFIER,
    };

    expect(guard.canActivate(createContext())).toBe(true);
  });

  it('should deny a MEMBER user', () => {
    reflector.getAllAndOverride.mockReturnValue([
      UserRole.ADMIN,
      UserRole.VERIFIER,
    ]);

    request.user = {
      role: UserRole.MEMBER,
    };

    expect(guard.canActivate(createContext())).toBe(false);
  });

  it('should deny access when the request has no authenticated user', () => {
    reflector.getAllAndOverride.mockReturnValue([
      UserRole.ADMIN,
      UserRole.VERIFIER,
    ]);

    request = {};

    expect(guard.canActivate(createContext())).toBe(false);
  });

  it('should deny access when the user has no role', () => {
    reflector.getAllAndOverride.mockReturnValue([
      UserRole.ADMIN,
      UserRole.VERIFIER,
    ]);

    request.user = {};

    expect(guard.canActivate(createContext())).toBe(false);
  });

  it('should read role metadata from the handler and controller', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    guard.canActivate(createContext());

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
      ROLES_KEY,
      expect.any(Array),
    );
  });
});