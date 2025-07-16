import { ApiProperty } from '@nestjs/swagger';

export class ValidateTokenResponseDTO {
  @ApiProperty({
    description: 'Indica se o token é válido',
    example: true
  })
  valid: boolean;
}