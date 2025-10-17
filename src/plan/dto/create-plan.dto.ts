import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  IsNumberString,
  IsNotEmpty,
} from 'class-validator';

export class CreatePlanDto {
  @ApiProperty({
    description: 'The title of the plan',
    example: 'Premium Plan',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Price of the plan',
    example: '4999',
  })
  @IsNumberString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({
    description: 'Optional billing information for the plan',
    example: 'Per listing',
    required: false,
  })
  @IsOptional()
  @IsString()
  billingInfo?: string;

  @ApiProperty({
    description: 'Features included in the plan',
    example: ['Premium Visibility', 'Professional Photography'],
  })
  @IsArray()
  @IsNotEmpty()
  features: string[] | { name: string; included: boolean }[];

  @ApiProperty({
    description: 'Background color for the plan',
    example: 'from-blue-400 to-indigo-500',
    required: false,
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({
    description: 'Indicates if the plan is popular',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  popular?: boolean;

  @ApiProperty({
    description: 'Background color for the plan',
    example: 'bg-blue-100',
    required: false,
  })
  @IsOptional()
  @IsString()
  bgColor?: string;

  @ApiProperty({
    description: 'Logo for the plan',
    example: '/assets/icons/silver.svg',
    required: false,
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({
    description: 'Type of product for the plan (e.g., consultation, listing)',
    example: 'listing',
  })
  @IsString()
  @IsNotEmpty()
  productType: string;
}
