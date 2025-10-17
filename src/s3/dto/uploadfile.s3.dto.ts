import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFileDto {
  @ApiProperty({
    description: 'The folder where the file should be uploaded in S3',
    example: 'uploads/images',
  })
  @IsNotEmpty()
  @IsString()
  folder: string;
}
