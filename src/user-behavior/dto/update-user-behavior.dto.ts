import { PartialType } from '@nestjs/swagger';
import { TrackUserBehaviorDto } from './create-user-behavior.dto';

export class UpdateUserBehaviorDto extends PartialType(TrackUserBehaviorDto) {}
