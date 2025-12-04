import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateAssociationDto {
  @ApiProperty({
    description: 'Builder user ID to associate with',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  builderId: string;

  @ApiProperty({
    description: 'Project ID to associate with',
    example: '507f191e810c19729de860ea',
  })
  @IsMongoId()
  projectId: string;

  @ApiPropertyOptional({
    description: 'User ID who invited the agent (if applicable)',
    example: '507f1f77bcf86cd799439012',
  })
  @IsMongoId()
  @IsOptional()
  invitedBy?: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the association',
    example: 'Agent has expertise in luxury properties',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
