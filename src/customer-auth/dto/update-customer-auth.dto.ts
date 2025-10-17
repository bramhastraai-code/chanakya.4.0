import { PartialType } from '@nestjs/swagger';
import { CreateCustomerAuthDto } from './create-customer-auth.dto';

export class UpdateCustomerAuthDto extends PartialType(CreateCustomerAuthDto) {}
