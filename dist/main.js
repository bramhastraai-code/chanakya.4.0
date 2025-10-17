"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const response_interceptor_1 = require("./interceptor/response.interceptor");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
    }));
    app.enableCors({ origin: '*' });
    const config = new swagger_1.DocumentBuilder()
        .addBearerAuth()
        .setTitle('vision vistara Api')
        .setDescription('this is the api for vision vistara')
        .setVersion('1.0')
        .addTag('vision vistara')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.use(cookieParser());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    await app.listen(3333);
}
bootstrap();
//# sourceMappingURL=main.js.map