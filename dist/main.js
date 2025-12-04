"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const response_interceptor_1 = require("./interceptor/response.interceptor");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        exceptionFactory: (errors) => {
            const messages = errors.map((error) => ({
                field: error.property,
                errors: Object.values(error.constraints || {}),
            }));
            return {
                statusCode: 400,
                message: 'Validation failed',
                errors: messages,
            };
        },
    }));
    app.setGlobalPrefix('v1');
    app.enableCors({
        origin: true,
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .addBearerAuth()
        .setTitle('chanakya connect Api')
        .setDescription('this is the api for chanakya connect')
        .setVersion('1.0')
        .addTag('chanakya connect')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.use(cookieParser());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    await app.listen(4921).finally(() => {
        console.log('Server is running on port http://localhost:4921/api');
    });
}
bootstrap();
//# sourceMappingURL=main.js.map