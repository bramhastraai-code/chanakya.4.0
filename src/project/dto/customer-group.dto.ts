import { IsMongoId, IsArray, ArrayNotEmpty } from 'class-validator';

export class AddCustomersToProjectDto {
  @IsMongoId()
  projectId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  customerIds: string[];
}

export class RemoveCustomersFromProjectDto {
  @IsMongoId()
  projectId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  customerIds: string[];
}
