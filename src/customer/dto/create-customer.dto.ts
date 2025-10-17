import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import {
  LeadStatus,
  UserStatus,
  UserType,
  VerificationStatus,
} from '../enum/usertype.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  // introduction
  @ApiPropertyOptional({
    description: 'Full name of the customer',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'URL to user profile image',
    example: 'https://example.com/profile.jpg',
  })
  @IsOptional()
  @IsString()
  userImage?: string;

  @ApiPropertyOptional({
    description: 'Status of the contact',
    enum: LeadStatus,
    example: 'qualified',
    default: 'qualified',
  })
  @IsOptional()
  @IsEnum(LeadStatus)
  contactStatus?: LeadStatus;

  @ApiPropertyOptional({
    description: 'Firebase Cloud Messaging token for push notifications',
    example: 'fcm_token_example',
  })
  @IsOptional()
  @IsString()
  fcmToken?: string;

  @ApiPropertyOptional({
    description: 'Email address of the customer',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Type of user',
    enum: UserType,
    example: UserType.USER,
  })
  @IsOptional()
  @IsEnum(UserType)
  userType?: UserType;

  @ApiProperty({
    description: 'Phone number of the customer',
    example: '+1234567890',
  })
  @IsString()
  phoneNumber: string;

  // customer related fields
  @ApiPropertyOptional({
    description: 'ID of the assigned agent',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsString()
  assignAgent?: string;

  @ApiPropertyOptional({
    description: 'Array of builder IDs associated with the customer',
    type: [String],
    example: ['60d21b4667d0d8992e610c85', '60d21b4967d0d8992e610c86'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  builders?: string[];

  @ApiPropertyOptional({
    description: 'Array of project IDs the customer has applied to',
    type: [String],
    example: ['project1', 'project2'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  projectsApplied?: string[];

  // broker related fields
  @ApiPropertyOptional({
    description: 'Average response time',
    example: '1 day',
    default: '1 day',
  })
  @IsOptional()
  @IsString()
  responseTime?: string;

  @ApiPropertyOptional({
    description: 'Areas where services are provided',
    type: [String],
    example: ['New York', 'Boston'],
  })
  @IsOptional()
  @IsArray()
  serviceAreas?: string[];

  @ApiPropertyOptional({
    description: 'Verification status of the customer',
    enum: VerificationStatus,
    example: VerificationStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(VerificationStatus)
  verificationStatus?: VerificationStatus;

  @ApiPropertyOptional({
    description: 'Array of verification document URLs',
    type: [String],
    example: ['https://example.com/doc1.pdf', 'https://example.com/doc2.pdf'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  verificationDocuments?: string[];

  @ApiPropertyOptional({
    description: 'License number if applicable',
    example: 'LIC123456',
  })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional({
    description: 'License expiry date in ISO format',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDateString()
  licenseExpiry?: string;

  @ApiPropertyOptional({
    description: 'Years of professional experience',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number;

  // For agencies
  @ApiPropertyOptional({
    description: 'Name of the agency if user is an agency',
    example: 'Prime Real Estate',
  })
  @IsOptional()
  @IsString()
  agencyName?: string;

  @ApiPropertyOptional({
    description: 'Agency license number',
    example: 'AGENCY123',
  })
  @IsOptional()
  @IsString()
  agencyLicense?: string;

  @ApiPropertyOptional({
    description: 'Year the agency was founded',
    example: 2010,
  })
  @IsOptional()
  @IsNumber()
  agencyFoundedYear?: number;

  @ApiPropertyOptional({
    description: 'Size of the team',
    example: 10,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  teamSize?: number;

  @ApiPropertyOptional({
    description: 'Average rating',
    example: 4.5,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiPropertyOptional({
    description: 'Number of reviews received',
    example: 25,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  reviewCount?: number;

  @ApiPropertyOptional({
    description: 'Number of deals closed',
    example: 50,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  closedDeals?: number;

  // social media things
  @ApiPropertyOptional({
    description: 'Social media links',
    example: {
      facebook: 'https://facebook.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      instagram: 'https://instagram.com/johndoe',
    },
  })
  @IsOptional()
  socialMedia?: {
    facebook?: string;
    linkedin?: string;
    instagram?: string;
  };

  // address things
  @ApiPropertyOptional({
    description: 'Latitude coordinate',
    example: '40.7128',
  })
  @IsOptional()
  @IsString()
  latitude?: string;

  @ApiPropertyOptional({
    description: 'Longitude coordinate',
    example: '-74.0060',
  })
  @IsOptional()
  @IsString()
  longitude?: string;

  @ApiPropertyOptional({
    description: 'Full street address',
    example: '123 Main St',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'City name',
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'State or province',
    example: 'NY',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    description: 'Country name',
    example: 'United States',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Postal or zip code',
    example: '10001',
  })
  @IsOptional()
  @IsString()
  pinCode?: string;

  @ApiPropertyOptional({
    description: 'Status of the user',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus = UserStatus.ACTIVE;
}
