import dotenv from 'dotenv';
import { resolve } from 'path';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  PrismaClient,
  NeedStatus,
  NeedUrgency,
  UserRole,
} from '@prisma/client';

dotenv.config({
  path: resolve(process.cwd(), '../../.env'),
});

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🌱 Seeding STAND Network database...');

  await prisma.response.deleteMany();
  await prisma.prayer.deleteMany();
  await prisma.need.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: 'STAND Network Admin',
      email: 'admin@stand.network',
      role: UserRole.ADMIN,
    },
  });

  const verifier = await prisma.user.create({
    data: {
      name: 'STAND Verification Team',
      email: 'verifier@stand.network',
      role: UserRole.VERIFIER,
    },
  });

  const supporter = await prisma.user.create({
    data: {
      name: 'STAND Supporter',
      email: 'supporter@stand.network',
      role: UserRole.USER,
    },
  });

  const josRelief = await prisma.organization.create({
    data: {
      name: 'Hope for Jos Communities',
      description:
        'A community-based organization supporting displaced and vulnerable Christian families in Plateau State.',
      location: 'Jos, Plateau State, Nigeria',
      website: 'https://example.org/hope-for-jos',
      ownerId: verifier.id,
    },
  });

  const kadunaRelief = await prisma.organization.create({
    data: {
      name: 'Northern Hope Initiative',
      description:
        'A relief network supporting vulnerable Christian communities across Northern Nigeria.',
      location: 'Kaduna, Kaduna State, Nigeria',
      website: 'https://example.org/northern-hope',
      ownerId: admin.id,
    },
  });

  const needs = await Promise.all([
    prisma.need.create({
      data: {
        title: 'Emergency food support for displaced families',
        description:
          'Families displaced by violence urgently need food supplies and essential household items while they remain in temporary shelter.',
        location: 'Jos, Plateau State, Nigeria',
        community: 'Displaced families community',
        urgency: NeedUrgency.CRITICAL,
        status: NeedStatus.ACTIVE,
        verified: true,
        organizationId: josRelief.id,
      },
    }),

    prisma.need.create({
      data: {
        title: 'Safe shelter for vulnerable families',
        description:
          'Several vulnerable families require safe temporary accommodation and basic household supplies.',
        location: 'Barkin Ladi, Plateau State, Nigeria',
        community: 'Barkin Ladi community',
        urgency: NeedUrgency.HIGH,
        status: NeedStatus.ACTIVE,
        verified: true,
        organizationId: josRelief.id,
      },
    }),

    prisma.need.create({
      data: {
        title: 'Medical supplies for a rural clinic',
        description:
          'A community clinic serving families affected by violence needs basic medical supplies and first-aid materials.',
        location: 'Southern Kaduna, Kaduna State, Nigeria',
        community: 'Rural Christian communities',
        urgency: NeedUrgency.HIGH,
        status: NeedStatus.VERIFIED,
        verified: true,
        organizationId: kadunaRelief.id,
      },
    }),

    prisma.need.create({
      data: {
        title: 'Rebuilding support for a damaged church community',
        description:
          'A local church community needs assistance restoring a damaged meeting space and replacing essential equipment.',
        location: 'Kaduna State, Nigeria',
        community: 'Local church community',
        urgency: NeedUrgency.MEDIUM,
        status: NeedStatus.PENDING_REVIEW,
        verified: false,
        organizationId: kadunaRelief.id,
      },
    }),
  ]);

  await prisma.prayer.create({
    data: {
      message:
        'Praying for protection, provision, and peace for every family.',
      userId: supporter.id,
      needId: needs[0].id,
    },
  });

  await prisma.prayer.create({
    data: {
      message:
        'Lord, strengthen this community and provide what they need.',
      userId: supporter.id,
      needId: needs[1].id,
    },
  });

  console.log(`✅ Created ${needs.length} needs`);
  console.log('✅ Created organizations, users, and prayer activity');
  console.log('🌱 STAND Network database seeded successfully.');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });