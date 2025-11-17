import { Model } from 'mongoose';
import { Customer } from './entities/customer.entity';
import { UpdateBuilderDto } from './dto/create-builder.dto';
export declare class BuildersService {
    private customerModel;
    constructor(customerModel: Model<Customer>);
    findAll(): Promise<Customer[]>;
    findOne(id: string): Promise<Customer>;
    update(id: string, updateBuilderDto: UpdateBuilderDto): Promise<Customer>;
}
