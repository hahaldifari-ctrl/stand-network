import {
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('@nestjs/jwt', () => ({
  JwtService: class JwtService {},
}));

describe('AuthService', () => {
  let service: AuthService;

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const jwtMock = {
    signAsync: jest.fn(),
  };

  const registeredUser = {
    id: 'user-123',
    email: 'person@example.com',
    name: 'Test User',
    role: 'USER',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  const loginUser = {
    ...registeredUser,
    passwordHash: 'stored-password-hash',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: JwtService,
          useValue: jwtMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    const registerDto = {
      email: 'person@example.com',
      name: 'Test User',
      password: 'StrongPassword123!',
    };

    it('rejects registration when the email already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue(loginUser);

      await expect(service.register(registerDto)).rejects.toBeInstanceOf(
        ConflictException,
      );

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });

      expect(prismaMock.user.create).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it('hashes the password and creates a user without exposing the hash', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new-password-hash');
      prismaMock.user.create.mockResolvedValue(registeredUser);

      const result = await service.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(
        registerDto.password,
        12,
      );

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          name: registerDto.name,
          passwordHash: 'new-password-hash',
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });

      expect(result).toEqual(registeredUser);
      expect(result).not.toHaveProperty('passwordHash');
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'person@example.com',
      password: 'StrongPassword123!',
    };

    it('rejects login when the email does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwtMock.signAsync).not.toHaveBeenCalled();
    });

    it('rejects login when the password is incorrect', async () => {
      prismaMock.user.findUnique.mockResolvedValue(loginUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        loginUser.passwordHash,
      );

      expect(jwtMock.signAsync).not.toHaveBeenCalled();
    });

    it('returns an access token and safe user details after valid login', async () => {
      prismaMock.user.findUnique.mockResolvedValue(loginUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtMock.signAsync.mockResolvedValue('test-access-token');

      const result = await service.login(loginDto);

      expect(jwtMock.signAsync).toHaveBeenCalledWith({
        sub: loginUser.id,
        email: loginUser.email,
        role: loginUser.role,
      });

      expect(result).toEqual({
        accessToken: 'test-access-token',
        user: {
          id: loginUser.id,
          email: loginUser.email,
          name: loginUser.name,
          role: loginUser.role,
        },
      });

      expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('rejects login when the user has no password hash', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        ...registeredUser,
        passwordHash: null,
      });

      await expect(service.login(loginDto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwtMock.signAsync).not.toHaveBeenCalled();
    });
  });

  describe('getMe', () => {
    it('returns safe user details for an existing user', async () => {
      const safeUser = {
        ...registeredUser,
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      };

      prismaMock.user.findUnique.mockResolvedValue(safeUser);

      await expect(service.getMe(registeredUser.id)).resolves.toEqual(
        safeUser,
      );

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: registeredUser.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    it('rejects when the requested user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        service.getMe('missing-user'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});

