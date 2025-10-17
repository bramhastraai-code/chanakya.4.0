import { ApiProperty } from '@nestjs/swagger';

export class FeaturedProjectDto {
  @ApiProperty({ example: 'test project' })
  projectName: string;

  @ApiProperty({ example: 'http://example.com/thumbnail.jpg' })
  thumbnail: string;

  @ApiProperty({ example: '123 Main St' })
  address: string;

  @ApiProperty({ example: 'New York' })
  city: string;

  @ApiProperty({ example: 'NY' })
  state: string;

  @ApiProperty({ example: 20000 })
  priceMin: number;

  @ApiProperty({ example: 1000000 })
  priceMax: number;

  @ApiProperty({ example: ['2bhk', '3bhk'] })
  PropertyConfig: string[];

  @ApiProperty({ example: '66cdb6dc992b64a2b23f4dd6' })
  builderId: string;

  @ApiProperty({ example: 'John Doe Constructions' })
  builderName: string;

  @ApiProperty({ example: 100 })
  totalProject: number;

  @ApiProperty({ example: 2022 })
  since: number;
}
