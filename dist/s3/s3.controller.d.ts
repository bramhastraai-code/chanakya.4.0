import { S3Service } from './s3.service';
import { UploadFileDto } from './dto/uploadfile.s3.dto';
import { UploadFilesDto } from './dto/UploadFiles.s3.dto';
import { Response } from 'src/common/interceptor/response.interface';
export declare class S3Controller {
    private readonly s3Service;
    constructor(s3Service: S3Service);
    uploadFile(file: Express.Multer.File, uploadFileDto: UploadFileDto): Promise<Response<{
        url: string;
        key: string;
    }>>;
    uploadFiles(files: Express.Multer.File[], uploadFilesDto: UploadFilesDto): Promise<Response<{
        url: string;
        key: string;
    }[]>>;
    deleteFile(key: string): Promise<{
        data: void;
        message: string;
    }>;
    uploadVideo(file: Express.Multer.File, folder: string): Promise<{
        data: {
            url: string;
            key: string;
        };
        message: string;
    }>;
    uploadPDF(file: Express.Multer.File, folder: string): Promise<Response<{
        url: string;
        key: string;
    }>>;
}
