export declare class FileService {
    private readonly uploadPath;
    constructor();
    private ensureUploadDirectoryExists;
    uploadFile(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
    }>;
    uploadFiles(files: Express.Multer.File[]): Promise<{
        url: string;
        filename: string;
    }[]>;
    deleteFile(filename: string): Promise<void>;
}
