import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
  Matches,
} from 'class-validator';
import { TemplateCode } from '../../enum/website.enum';

export class CreateWebsiteDto {
  @ApiProperty({ example: 'rakesh-realty' })
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message:
      'Subdomain must contain only lowercase letters, numbers, and hyphens',
  })
  subdomain: string;

  @ApiProperty({ enum: TemplateCode, example: TemplateCode.MODERN_LUXURY })
  @IsEnum(TemplateCode)
  templateCode: TemplateCode;
}

export class UpdateWebsiteDto {
  @ApiPropertyOptional({
    example: { heroTitle: 'Welcome Home', aboutText: '...' },
  })
  @IsObject()
  @IsOptional()
  content?: Record<string, any>;

  @ApiPropertyOptional({ example: { primaryColor: '#FF0000', font: 'Roboto' } })
  @IsObject()
  @IsOptional()
  theme?: Record<string, any>;

  @ApiPropertyOptional({ example: 'www.rakeshrealty.com' })
  @IsString()
  @IsOptional()
  customDomain?: string;
}
