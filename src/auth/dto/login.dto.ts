import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'admin@abujaestate.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: 'admin123',
    description: 'User password',
  })
  password: string;
}
