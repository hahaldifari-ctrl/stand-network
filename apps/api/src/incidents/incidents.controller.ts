import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateIncidentDto } from './create-incident.dto';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { CreateSourceDto } from './dto/create-source.dto';
import { CreateVerificationReviewDto } from './dto/create-verification-review.dto';
import { ReviewEvidenceDto } from './dto/review-evidence.dto';
import { ReviewEvidencePublicationDto } from './dto/review-evidence-publication.dto';
import { IncidentsService } from './incidents.service';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Controller('incidents')
export class IncidentsController {
  constructor(
    private readonly incidentsService: IncidentsService,
  ) {}

  @Get()
  getPublicIncidents() {
    return this.incidentsService.getPublicIncidents();
  }

  @Get(':id')
  getPublicIncident(@Param('id') incidentId: string) {
    return this.incidentsService.getPublicIncident(incidentId);
  }

  @Get(':id/evidence')
  getPublicEvidence(@Param('id') incidentId: string) {
    return this.incidentsService.getPublicEvidence(incidentId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() dto: CreateIncidentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.incidentsService.create(dto, req.user.id);
  }

  @Post(':id/sources')
  @UseGuards(JwtAuthGuard)
  addSource(
    @Param('id') incidentId: string,
    @Body() dto: CreateSourceDto,
  ) {
    return this.incidentsService.addSource(incidentId, dto);
  }

  @Post(':id/evidence')
  @UseGuards(JwtAuthGuard)
  addEvidence(
    @Param('id') incidentId: string,
    @Body() dto: CreateEvidenceDto,
  ) {
    return this.incidentsService.addEvidence(incidentId, dto);
  }

  @Patch(':id/evidence/:evidenceId/review')
  @UseGuards(JwtAuthGuard)
  reviewEvidence(
    @Param('id') incidentId: string,
    @Param('evidenceId') evidenceId: string,
    @Body() dto: ReviewEvidenceDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.incidentsService.reviewEvidence(
      incidentId,
      evidenceId,
      dto,
      req.user.id,
      req.user.role,
    );
  }


  @Patch(':id/evidence/:evidenceId/publication-review')
  @UseGuards(JwtAuthGuard)
  reviewEvidencePublication(
    @Param('id') incidentId: string,
    @Param('evidenceId') evidenceId: string,
    @Body() dto: ReviewEvidencePublicationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.incidentsService.reviewEvidencePublication(
      incidentId,
      evidenceId,
      dto,
      req.user.id,
      req.user.role,
    );
  }
  @Post(':id/reviews')
  @UseGuards(JwtAuthGuard)
  createVerificationReview(
    @Param('id') incidentId: string,
    @Body() dto: CreateVerificationReviewDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.incidentsService.createVerificationReview(
      incidentId,
      dto,
      req.user.id,
      req.user.role,
    );
  }

  @Get(':id/verification')
  @UseGuards(JwtAuthGuard)
  getVerificationRecord(
    @Param('id') incidentId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.incidentsService.getVerificationRecord(
      incidentId,
      req.user.role,
    );
  }
}