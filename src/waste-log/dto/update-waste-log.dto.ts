import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { WasteLogStatus } from '@prisma/client';

export class UpdateWasteLogDto {
  @ApiProperty({
    enum: WasteLogStatus,
    example: WasteLogStatus.IN_PROGRESS,
    description: 'Updated waste log status',
    required: false,
  })
  @IsOptional()
  @IsEnum(WasteLogStatus)
  status?: WasteLogStatus;

  @ApiProperty({
    example: '2026-05-04T12:00:00Z',
    description: 'Updated timestamp for the waste log',
    required: false,
    format: 'date-time',
  })
  @IsOptional()
  @IsString()
  timestamp?: string;
}
