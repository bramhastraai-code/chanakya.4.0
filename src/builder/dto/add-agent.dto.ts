import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString, IsArray } from 'class-validator';

export class AddAgentDto {
  @ApiProperty({
    description: 'Agent user ID to add to the project',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  agentId: string;

  @ApiProperty({
    description: 'Project ID to associate the agent with',
    example: '507f191e810c19729de860ea',
  })
  @IsMongoId()
  projectId: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the agent assignment',
    example: 'Agent specializes in luxury properties',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class BulkAddAgentsDto {
  @ApiProperty({
    description: 'Array of agent user IDs to add to the project',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true })
  agentIds: string[];

  @ApiProperty({
    description: 'Project ID to associate all agents with',
    example: '507f191e810c19729de860ea',
  })
  @IsMongoId()
  projectId: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the agent assignments',
    example: 'Agents assigned for Q1 2025 sales campaign',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
