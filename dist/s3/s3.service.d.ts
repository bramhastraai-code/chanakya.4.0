export declare class S3Service {
    private readonly logger;
    private readonly s3;
    private readonly bucketName;
    constructor();
    private addWatermark;
    uploadFile(file: Express.Multer.File, folder: string): Promise<{
        url: string;
        key: string;
    }>;
    uploadFiles(files: Express.Multer.File[], folder: string): Promise<{
        url: string;
        key: string;
    }[]>;
    deleteFile(key: string): Promise<void>;
    uploadVideo(file: Express.Multer.File, folder: string): Promise<{
        url: string;
        key: string;
    }>;
    uploadPDF(file: Express.Multer.File, folder: string): Promise<{
        url: string;
        key: string;
    }>;
}
