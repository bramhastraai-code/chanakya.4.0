import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFilesDto {
  @ApiProperty({
    description: 'The folder where the files should be uploaded in S3',
    example: 'uploads/images',
  })
  @IsNotEmpty()
  @IsString()
  folder: string;
}
