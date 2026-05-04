import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Min } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({
    example: 'newuser@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
  })
  @IsString()
  password: string;

  @ApiProperty({
    enum: Role,
    example: Role.RESIDENT,
    description: 'User role',
  })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({
    example: 'abuja-estate-1',
    description: 'Estate ID',
  })
  @IsString()
  estateId: string;

  @ApiProperty({
    example: 2,
    description: 'User clearance level',
    required: false,
  })
  @IsOptional()
  @Min(1)
  clearanceLevel?: number;
}
