import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';

describe('AppController', () => {
  let appController: AppController;

  const prismaServiceMock = {
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('root', () => {
    it('should return the STAND API service information', () => {
      expect(appController.getRoot()).toEqual({
        service: 'stand-api',
        status: 'ok',
        version: '0.1.0',
      });
    });
  });

  describe('health', () => {
    it('should return a healthy status when the database is connected', async () => {
      prismaServiceMock.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      await expect(appController.getHealth()).resolves.toEqual({
        service: 'stand-api',
        status: 'ok',
        database: 'connected',
      });

      expect(prismaServiceMock.$queryRaw).toHaveBeenCalled();
    });
  });
});