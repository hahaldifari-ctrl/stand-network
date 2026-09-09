import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrganizationDto, ownerId: string) {
    return this.prisma.organization.create({
      data: {
        name: dto.name,
        description: dto.description,
        location: dto.location,
        website: dto.website,
        ownerId,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.organization.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        _count: {
          select: {
            needs: true,
            responses: true,
          },
        },
      },
    });
  }
}
