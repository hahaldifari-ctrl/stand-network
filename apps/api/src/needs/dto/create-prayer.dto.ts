import { IsOptional, IsString } from 'class-validator';

export class CreatePrayerDto {
  @IsOptional()
  @IsString()
  message?: string;
}