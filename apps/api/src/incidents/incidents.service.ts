import { Injectable } from '@nestjs/common';
import { IncidentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncidentDto } from './create-incident.dto';

@Injectable()
export class IncidentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateIncidentDto, userId: string) {
    return this.prisma.incident.create({
      data: {
        title: dto.title,
        description: dto.description,
        location: dto.location,
        community: dto.community,
        incidentDate: dto.incidentDate
          ? new Date(dto.incidentDate)
          : undefined,
        incidentType: dto.incidentType,
        affectedPeopleCount: dto.affectedPeopleCount,
        sourceSummary: dto.sourceSummary,
        status: IncidentStatus.REPORTED,
        createdById: userId,
      },
    });
  }
}