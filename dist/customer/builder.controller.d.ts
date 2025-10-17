import { UpdateBuilderDto } from './dto/create-builder.dto';
import { BuildersService } from './builder.service';
import { Response } from 'src/common/interceptor/response.interface';
import { Customer } from './entities/customer.entity';
export declare class BuildersController {
    private readonly buildersService;
    constructor(buildersService: BuildersService);
    findAll(): Promise<Response<Customer[]>>;
    findOne(req: any): Promise<Response<Customer>>;
    update(req: any, updateBuilderDto: UpdateBuilderDto): Promise<Response<Customer>>;
}
