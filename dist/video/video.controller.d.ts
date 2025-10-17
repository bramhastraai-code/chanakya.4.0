import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoStatusDto } from './dto/update-video-status.dto';
import { VideoResponseDto } from './dto/video-response.dto';
import { Response } from 'src/common/interceptor/response.interface';
import { VideoService } from './video.service';
export declare class VideoController {
    private readonly videosService;
    constructor(videosService: VideoService);
    create(createVideoDto: CreateVideoDto, req: any): Promise<Response<VideoResponseDto>>;
    findAllByUser(req: any): Promise<Response<VideoResponseDto[]>>;
    getEarnings(req: any): Promise<Response<{
        earnings: number;
    }>>;
    findOne(req: any, id: string): Promise<Response<VideoResponseDto>>;
    updateStatus(id: string, updateVideoStatusDto: UpdateVideoStatusDto): Promise<Response<VideoResponseDto>>;
    private mapToDto;
}
