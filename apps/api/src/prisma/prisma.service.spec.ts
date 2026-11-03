import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;
  let module: TestingModule;

  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(async () => {
    process.env.DATABASE_URL =
      'postgresql://test:test@localhost:5432/stand_test';

    module = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await service?.$disconnect();
    await module?.close();

    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
  });

  it('should be provided by the Nest testing module', () => {
    expect(service).toBeDefined();
    expect(typeof service.$connect).toBe('function');
    expect(typeof service.$disconnect).toBe('function');
  });
});
