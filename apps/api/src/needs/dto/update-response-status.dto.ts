import { IsEnum } from 'class-validator';
import { ResponseStatus } from '@prisma/client';

export class UpdateResponseStatusDto {
  @IsEnum(ResponseStatus)
  status!: ResponseStatus;
}
