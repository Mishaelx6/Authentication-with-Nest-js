import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { WasteLogStatus } from '@prisma/client';

export class CreateWasteLogDto {
  @ApiProperty({
    example: 'rider-user-1',
    description: 'Rider user ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  riderId?: string;

  @ApiProperty({
    enum: WasteLogStatus,
    example: WasteLogStatus.PENDING,
    description: 'Waste log status',
    required: false,
  })
  @IsOptional()
  @IsEnum(WasteLogStatus)
  status?: WasteLogStatus;

  @ApiProperty({
    example: '2026-05-04T12:00:00Z',
    description: 'Timestamp for the waste log',
    required: false,
    format: 'date-time',
  })
  @IsOptional()
  @IsString()
  timestamp?: string;
}
