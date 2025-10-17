import { PartialType } from '@nestjs/swagger';
import { CreateShortVideoDto } from './create-short-video.dto';

export class UpdateShortVideoDto extends PartialType(CreateShortVideoDto) {}
