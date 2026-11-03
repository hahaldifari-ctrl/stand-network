import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

jest.mock('./auth.service', () => ({
  AuthService: class AuthService {},
}));

jest.mock('./jwt-auth.guard', () => ({
  JwtAuthGuard: class JwtAuthGuard {},
}));

describe('AuthController', () => {
  let controller: AuthController;

  const authService = {
    register: jest.fn(),
    login: jest.fn(),
    getMe: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new AuthController(
      authService as unknown as AuthService,
    );
  });

  it('should pass registration data to AuthService', async () => {
    const dto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'StrongPassword123!',
    };

    const expected = { id: 'user-1', email: dto.email };
    authService.register.mockResolvedValue(expected);

    await expect(controller.register(dto)).resolves.toEqual(expected);
    expect(authService.register).toHaveBeenCalledWith(dto);
  });

  it('should pass login data to AuthService', async () => {
    const dto = {
      email: 'test@example.com',
      password: 'StrongPassword123!',
    };

    const expected = { accessToken: 'test-token' };
    authService.login.mockResolvedValue(expected);

    await expect(controller.login(dto)).resolves.toEqual(expected);
    expect(authService.login).toHaveBeenCalledWith(dto);
  });

  it('should retrieve the current user using the authenticated user ID', async () => {
    const request = {
      user: {
        id: 'user-1',
        email: 'test@example.com',
        role: 'USER',
      },
    };

    const expected = {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
    };

    authService.getMe.mockResolvedValue(expected);

    await expect(controller.me(request as any)).resolves.toEqual(expected);
    expect(authService.getMe).toHaveBeenCalledWith('user-1');
  });

  it('should retain the JWT guard on the current-user endpoint', () => {
    const guards = Reflect.getMetadata(
      '__guards__',
      AuthController.prototype.me,
    ) as unknown[];

    expect(guards).toContain(JwtAuthGuard);
  });
});
