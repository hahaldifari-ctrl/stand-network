import { NeedStatus } from '@prisma/client';

export class UpdateNeedStatusDto {
  status!: NeedStatus;
}